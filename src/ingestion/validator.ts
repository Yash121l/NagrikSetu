import { nagrikRecordBatchSchema, nagrikRecordSchema } from "./record-schema";
import type { IngestionReport, SourceCatalogEntry, SourceHealth, SourceRunEvent, ValidationIssue } from "./types";

const dayMs = 24 * 60 * 60 * 1000;

function daysBetween(olderIso: string, newerIso: string) {
  return Math.max(0, Math.floor((Date.parse(newerIso) - Date.parse(olderIso)) / dayMs));
}

function getPotentialRecordId(record: unknown) {
  if (record && typeof record === "object" && "id" in record && typeof record.id === "string") {
    return record.id;
  }
  return "unknown";
}

export function validateRecords(records: unknown[]) {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const record of records) {
    const result = nagrikRecordSchema.safeParse(record);
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({
          recordId: getPotentialRecordId(record),
          severity: "error",
          message: `${issue.path.join(".") || "record"}: ${issue.message}`
        });
      }
    }

    const recordId = getPotentialRecordId(record);
    if (recordId !== "unknown" && seen.has(recordId)) {
      issues.push({ recordId, severity: "error", message: "Duplicate record id." });
    }
    seen.add(recordId);

    if (!result.success) continue;

    const parsedRecord = result.data;

    if (parsedRecord.confidence === "low") {
      issues.push({ recordId: parsedRecord.id, severity: "warning", message: "Low-confidence record must stay visibly labeled." });
    }
    if (!parsedRecord.provenance.sourceUrl) {
      issues.push({ recordId: parsedRecord.id, severity: "error", message: "Missing provenance source URL." });
    }
  }

  const batch = nagrikRecordBatchSchema.safeParse(records);
  if (!batch.success && issues.length === 0) {
    issues.push({ recordId: "batch", severity: "error", message: "Record batch failed schema validation." });
  }

  return issues;
}

export function buildSourceHealth(sources: SourceCatalogEntry[], events: SourceRunEvent[], asOf: string): SourceHealth[] {
  return sources.map((source) => {
    const event = events.find((candidate) => candidate.sourceId === source.id);
    if (!event) {
      return {
        sourceId: source.id,
        sourceName: source.name,
        status: "not-run",
        expectedFreshnessDays: source.quality.expectedFreshnessDays,
        recordCount: 0,
        warnings: ["No adapter run has been recorded for this source."]
      };
    }

    const daysSinceLastSuccess = daysBetween(event.fetchedAt, asOf);
    const stale = daysSinceLastSuccess > source.quality.expectedFreshnessDays;
    const warningStatus = event.warningCount > 0 ? "watch" : "healthy";

    return {
      sourceId: source.id,
      sourceName: source.name,
      status: stale ? "stale" : warningStatus,
      lastSuccessfulRun: event.fetchedAt,
      daysSinceLastSuccess,
      expectedFreshnessDays: source.quality.expectedFreshnessDays,
      recordCount: event.recordCount,
      warnings: [
        ...(stale ? [`Last successful run is ${daysSinceLastSuccess} days old.`] : []),
        ...(event.warningCount > 0 ? [`Adapter reported ${event.warningCount} warning(s).`] : [])
      ]
    };
  });
}

export function assertReportIsUsable(report: IngestionReport) {
  const errors = report.issues.filter((issue) => issue.severity === "error");
  if (errors.length > 0) {
    throw new Error(`Ingestion report has ${errors.length} error(s): ${errors.map((issue) => issue.message).join("; ")}`);
  }
}
