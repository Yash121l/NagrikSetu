import type { AdapterRunContext, AdapterRunResult, SourceAdapter, SourceCatalogEntry } from "./types";
import type { NagrikRecord } from "@/lib/types";

export function createFixtureAdapter(source: SourceCatalogEntry, records: NagrikRecord[]): SourceAdapter {
  return {
    id: `${source.id}-fixture-adapter`,
    sourceId: source.id,
    run(context: AdapterRunContext): AdapterRunResult {
      const sourceRecords = records.filter((record) => record.provenance.sourceUrl === source.homepageUrl);
      const dedupeKeys = sourceRecords.map((record) => `${record.kind}:${record.id}`);
      const warnings = sourceRecords.some((record) => record.confidence === "low")
        ? ["One or more records are low confidence and need source-backed enrichment."]
        : [];

      return {
        source,
        records: sourceRecords,
        dedupeKeys,
        warnings,
        event: {
          sourceId: source.id,
          adapterName: `${source.id}-fixture-adapter`,
          fetchedAt: context.asOf,
          recordCount: sourceRecords.length,
          dedupeKeyCount: dedupeKeys.length,
          warningCount: warnings.length,
          status: warnings.length > 0 ? "watch" : "healthy"
        }
      };
    }
  };
}
