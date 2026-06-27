import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { Locale } from "@/lib/i18n";

export const moderationStatuses = [
  "new",
  "triaged",
  "source-check-needed",
  "accepted",
  "rejected",
  "duplicate",
  "published"
] as const;

export type ModerationStatus = (typeof moderationStatuses)[number];

const correctionInputSchema = z
  .object({
    recordId: z.string().trim().min(1).max(160),
    message: z.string().trim().min(5).max(2000),
    language: z.enum(["en", "hi"]).default("en")
  })
  .strict();

const httpUrlSchema = z.url().refine(
  (value) => {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  },
  { message: "Must be an HTTP(S) URL" }
);

const suggestedChangeSchema = z
  .object({
    field: z.string().trim().min(1).max(80),
    value: z.string().trim().min(1).max(2000),
    sourceUrl: httpUrlSchema,
    sourceName: z.string().trim().min(2).max(180).optional()
  })
  .strict();

const moderationUpdateSchema = z
  .object({
    status: z.enum(moderationStatuses),
    reviewerNote: z.string().trim().max(2000).optional(),
    officialSourceUrl: httpUrlSchema.optional(),
    suggestedChange: suggestedChangeSchema.optional()
  })
  .strict();

export class CorrectionInputError extends Error {
  issues: string[];

  constructor(issues: string[]) {
    super("Invalid correction submission");
    this.name = "CorrectionInputError";
    this.issues = issues;
  }
}

export interface CorrectionSubmission {
  id: string;
  status: ModerationStatus;
  recordId: string;
  message: string;
  language: Locale;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
  officialSourceUrl?: string;
  suggestedChange?: z.infer<typeof suggestedChangeSchema>;
  auditTrail: CorrectionAuditEvent[];
}

export interface CorrectionAuditEvent {
  at: string;
  status: ModerationStatus;
  note?: string;
}

export interface CorrectionPersistResult {
  filePath: string;
  submission: CorrectionSubmission;
}

const defaultQueueDir = () => path.join(process.cwd(), "data", "corrections");
const correctionFilePattern = /\.json$/;

function makeCorrectionId(recordId: string, message: string, submittedAt: string) {
  return createHash("sha256").update(`${recordId}:${message}:${submittedAt}`).digest("hex").slice(0, 14);
}

function safeFilePart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "record";
}

export function buildCorrectionSubmission(input: unknown, now = new Date()): CorrectionSubmission {
  const parsed = correctionInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new CorrectionInputError(parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`));
  }

  const submittedAt = now.toISOString();
  return {
    id: makeCorrectionId(parsed.data.recordId, parsed.data.message, submittedAt),
    status: "new",
    recordId: parsed.data.recordId,
    message: parsed.data.message,
    language: parsed.data.language,
    submittedAt,
    auditTrail: [{ at: submittedAt, status: "new", note: "Correction submitted for moderation." }]
  };
}

export async function persistCorrectionSubmission(
  submission: CorrectionSubmission,
  queueDir = defaultQueueDir()
): Promise<CorrectionPersistResult> {
  await mkdir(queueDir, { recursive: true });
  const fileName = `${submission.submittedAt.replace(/[:.]/g, "-")}-${safeFilePart(submission.recordId)}-${submission.id}.json`;
  const filePath = path.join(queueDir, fileName);
  await writeFile(filePath, `${JSON.stringify(submission, null, 2)}\n`, "utf8");

  return { filePath, submission };
}

export async function submitCorrection(
  input: unknown,
  options: { now?: Date; queueDir?: string } = {}
): Promise<CorrectionPersistResult> {
  const submission = buildCorrectionSubmission(input, options.now);
  return persistCorrectionSubmission(submission, options.queueDir);
}

function normalizeCorrectionSubmission(value: unknown): CorrectionSubmission {
  const raw = value as Partial<CorrectionSubmission>;
  return {
    id: raw.id ?? "unknown",
    status: raw.status ?? "new",
    recordId: raw.recordId ?? "unknown",
    message: raw.message ?? "",
    language: raw.language ?? "en",
    submittedAt: raw.submittedAt ?? new Date(0).toISOString(),
    reviewedAt: raw.reviewedAt,
    reviewerNote: raw.reviewerNote,
    officialSourceUrl: raw.officialSourceUrl,
    suggestedChange: raw.suggestedChange,
    auditTrail:
      raw.auditTrail && raw.auditTrail.length > 0
        ? raw.auditTrail
        : [{ at: raw.submittedAt ?? new Date(0).toISOString(), status: raw.status ?? "new" }]
  };
}

export async function listCorrectionQueue(queueDir = defaultQueueDir()) {
  await mkdir(queueDir, { recursive: true });
  const entries = await readdir(queueDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && correctionFilePattern.test(entry.name))
    .map((entry) => path.join(queueDir, entry.name));
  const submissions = (
    await Promise.all(
      files.map(async (filePath) => {
        try {
          const submission = normalizeCorrectionSubmission(JSON.parse(await readFile(filePath, "utf8")));
          return { filePath, submission };
        } catch (error) {
          console.error(`Skipping unreadable correction queue file: ${filePath}`, error);
          return null;
        }
      })
    )
  ).filter((entry): entry is CorrectionPersistResult => entry !== null);

  return submissions.sort((a, b) => b.submission.submittedAt.localeCompare(a.submission.submittedAt));
}

export async function findCorrectionSubmission(id: string, queueDir = defaultQueueDir()) {
  const queue = await listCorrectionQueue(queueDir);
  return queue.find((entry) => entry.submission.id === id);
}

export async function updateCorrectionModeration(
  id: string,
  input: unknown,
  options: { now?: Date; queueDir?: string } = {}
) {
  const parsed = moderationUpdateSchema.safeParse(input);
  if (!parsed.success) {
    throw new CorrectionInputError(parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`));
  }

  const existing = await findCorrectionSubmission(id, options.queueDir);
  if (!existing) return null;

  const reviewedAt = (options.now ?? new Date()).toISOString();
  const submission: CorrectionSubmission = {
    ...existing.submission,
    status: parsed.data.status,
    reviewedAt,
    reviewerNote: parsed.data.reviewerNote ?? existing.submission.reviewerNote,
    officialSourceUrl: parsed.data.officialSourceUrl ?? existing.submission.officialSourceUrl,
    suggestedChange: parsed.data.suggestedChange ?? existing.submission.suggestedChange,
    auditTrail: [
      ...existing.submission.auditTrail,
      { at: reviewedAt, status: parsed.data.status, note: parsed.data.reviewerNote }
    ]
  };
  const tempPath = `${existing.filePath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(submission, null, 2)}\n`, "utf8");
  await rename(tempPath, existing.filePath);
  return { filePath: existing.filePath, submission };
}
