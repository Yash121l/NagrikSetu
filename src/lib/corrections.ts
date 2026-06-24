import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { Locale } from "@/lib/i18n";

const correctionInputSchema = z
  .object({
    recordId: z.string().trim().min(1).max(160),
    message: z.string().trim().min(5).max(2000),
    language: z.enum(["en", "hi"]).default("en")
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
  status: "new";
  recordId: string;
  message: string;
  language: Locale;
  submittedAt: string;
}

export interface CorrectionPersistResult {
  filePath: string;
  submission: CorrectionSubmission;
}

const defaultQueueDir = () => path.join(process.cwd(), "data", "corrections");

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
    submittedAt
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
