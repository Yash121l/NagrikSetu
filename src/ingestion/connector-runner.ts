import type { AdapterRunContext, AdapterRunResult, SourceAdapter, ValidationIssue } from "./types";

export interface DedupeCollision {
  dedupeKey: string;
  sourceIds: string[];
  recordIds: string[];
}

export interface AdapterRunnerResult {
  results: AdapterRunResult[];
  dedupeCollisions: DedupeCollision[];
  issues: ValidationIssue[];
}

export function findDedupeCollisions(results: AdapterRunResult[]): DedupeCollision[] {
  const byKey = new Map<string, Array<{ sourceId: string; recordIds: string[] }>>();

  for (const result of results) {
    for (const dedupeKey of result.dedupeKeys) {
      const recordIds = result.records
        .filter((record) => `${record.kind}:${record.id}` === dedupeKey)
        .map((record) => record.id);
      byKey.set(dedupeKey, [...(byKey.get(dedupeKey) ?? []), { sourceId: result.source.id, recordIds }]);
    }
  }

  return [...byKey.entries()]
    .filter(([, entries]) => new Set(entries.map((entry) => entry.sourceId)).size > 1)
    .map(([dedupeKey, entries]) => ({
      dedupeKey,
      sourceIds: [...new Set(entries.map((entry) => entry.sourceId))],
      recordIds: [...new Set(entries.flatMap((entry) => entry.recordIds))]
    }));
}

export function runAdapters(adapters: SourceAdapter[], context: AdapterRunContext): AdapterRunnerResult {
  const results = adapters.map((adapter) => adapter.run(context));
  const dedupeCollisions = findDedupeCollisions(results);
  const issues = dedupeCollisions.map<ValidationIssue>((collision) => ({
    recordId: collision.recordIds.join(",") || collision.dedupeKey,
    severity: "warning",
    message: `Dedupe key ${collision.dedupeKey} appeared in multiple sources: ${collision.sourceIds.join(", ")}.`
  }));

  return { results, dedupeCollisions, issues };
}
