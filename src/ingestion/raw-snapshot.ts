import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export interface RawSnapshotInput {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string;
  contentType: string;
  body: string | Uint8Array;
  licenseNote: string;
  robotsTxtUrl?: string;
  parserVersion?: string;
}

export interface RawSnapshotManifest {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string;
  contentType: string;
  contentHash: string;
  byteLength: number;
  licenseNote: string;
  robotsTxtUrl?: string;
  parserVersion?: string;
  bodyPath: string;
  manifestPath: string;
}

const defaultRawDir = () => path.join(process.cwd(), "data", "raw");

function safePathPart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "source";
}

function extensionForContentType(contentType: string) {
  if (contentType.includes("json")) return "json";
  if (contentType.includes("csv")) return "csv";
  if (contentType.includes("html")) return "html";
  if (contentType.includes("xml")) return "xml";
  if (contentType.includes("pdf")) return "pdf";
  return "bin";
}

function dateSegmentForFetchedAt(fetchedAt: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(fetchedAt);
  if (!match || Number.isNaN(Date.parse(fetchedAt))) {
    throw new Error("Raw snapshot fetchedAt must be an ISO date or timestamp.");
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  const isValidCalendarDate =
    calendarDate.getUTCFullYear() === year && calendarDate.getUTCMonth() === month - 1 && calendarDate.getUTCDate() === day;

  if (!isValidCalendarDate) {
    throw new Error("Raw snapshot fetchedAt must be an ISO date or timestamp.");
  }

  return `${yearText}-${monthText}-${dayText}`;
}

export async function writeRawSnapshot(input: RawSnapshotInput, rawDir = defaultRawDir()): Promise<RawSnapshotManifest> {
  const bytes = typeof input.body === "string" ? Buffer.from(input.body, "utf8") : Buffer.from(input.body);
  const contentHash = createHash("sha256").update(bytes).digest("hex");
  const fetchedDate = dateSegmentForFetchedAt(input.fetchedAt);
  const snapshotDir = path.join(rawDir, safePathPart(input.sourceId), fetchedDate, contentHash.slice(0, 16));
  const bodyPath = path.join(snapshotDir, `body.${extensionForContentType(input.contentType)}`);
  const manifestPath = path.join(snapshotDir, "manifest.json");

  await mkdir(snapshotDir, { recursive: true });
  await writeFile(bodyPath, bytes);

  const manifest: RawSnapshotManifest = {
    sourceId: input.sourceId,
    sourceName: input.sourceName,
    sourceUrl: input.sourceUrl,
    fetchedAt: input.fetchedAt,
    contentType: input.contentType,
    contentHash,
    byteLength: bytes.byteLength,
    licenseNote: input.licenseNote,
    robotsTxtUrl: input.robotsTxtUrl,
    parserVersion: input.parserVersion,
    bodyPath,
    manifestPath
  };

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}
