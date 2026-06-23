import { runDemoIngestion } from "@/ingestion/run-demo";
import type { EntityKind, NagrikRecord } from "@/lib/types";

const report = runDemoIngestion();

export function getAllRecords(): NagrikRecord[] {
  return report.records;
}

export function getSourceHealth() {
  return report.health;
}

export function getIngestionReport() {
  return report;
}

export function getRecordStats(records = report.records) {
  const byKind = records.reduce(
    (counts, record) => ({
      ...counts,
      [record.kind]: (counts[record.kind] ?? 0) + 1
    }),
    {} as Partial<Record<EntityKind, number>>
  );

  return {
    totalRecords: records.length,
    officialSourceRecords: records.filter((record) => record.provenance.priority === "official").length,
    lowConfidenceRecords: records.filter((record) => record.confidence === "low").length,
    byKind
  };
}
