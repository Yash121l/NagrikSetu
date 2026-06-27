import type { IngestionReport, SourceHealth } from "@/ingestion/types";
import type { EntityKind, NagrikRecord } from "@/lib/types";

export interface RecordStats {
  totalRecords: number;
  officialSourceRecords: number;
  lowConfidenceRecords: number;
  byKind: Partial<Record<EntityKind, number>>;
}

export interface NagrikRepository {
  mode: "local-fixture" | "postgres";
  getAllRecords(): NagrikRecord[];
  getSourceHealth(): SourceHealth[];
  getIngestionReport(): IngestionReport;
  getRecordStats(records?: NagrikRecord[]): RecordStats;
}

export function buildRecordStats(records: NagrikRecord[]): RecordStats {
  const byKind = records.reduce(
    (counts, record) => {
      counts[record.kind] = (counts[record.kind] ?? 0) + 1;
      return counts;
    },
    {} as Partial<Record<EntityKind, number>>
  );

  return {
    totalRecords: records.length,
    officialSourceRecords: records.filter((record) => record.provenance.priority === "official").length,
    lowConfidenceRecords: records.filter((record) => record.confidence === "low").length,
    byKind
  };
}
