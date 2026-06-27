import { seedRecords } from "@/lib/seed-data";
import { sourceCatalog } from "./source-catalog";
import { runAdapters } from "./connector-runner";
import { createFixtureAdapter } from "./fixture-adapter";
import { assertReportIsUsable, buildSourceHealth, validateRecords } from "./validator";
import type { IngestionReport } from "./types";
import type { NagrikRecord } from "@/lib/types";

const demoAsOf = "2026-06-27";

function indefiniteArticle(value: string) {
  return /^[aeiou]/i.test(value.trim()) ? "an" : "a";
}

export function buildSourceRecords(): NagrikRecord[] {
  return sourceCatalog.map((source) => ({
    id: `source-${source.id}`,
    kind: "source",
    title: source.name,
    summary: `${source.name} is tracked as ${indefiniteArticle(source.priority)} ${source.priority} source for ${source.entityKinds.join(", ")} records in ${source.geography}.`,
    department: source.owner,
    jurisdiction: source.geography,
    website: source.homepageUrl,
    issueTags: ["source inventory", ...source.entityKinds],
    languageTags: ["en"],
    confidence: source.quality.confidence,
    updatedAt: demoAsOf,
    provenance: {
      sourceName: source.name,
      sourceUrl: source.homepageUrl,
      lastChecked: demoAsOf,
      priority: source.priority,
      licenseNote: source.legal.licenseNote
    }
  }));
}

export function buildDemoRecords() {
  const sourceRecords = buildSourceRecords();
  const duplicateSourceIds = new Set(sourceRecords.map((record) => record.id));
  const generatedSourceUrls = new Set(sourceRecords.map((record) => record.provenance.sourceUrl));
  const retainedSeedRecords = seedRecords.filter((record) => {
    if (duplicateSourceIds.has(record.id)) return false;
    return record.kind !== "source" || !generatedSourceUrls.has(record.provenance.sourceUrl);
  });
  return [...retainedSeedRecords, ...sourceRecords];
}

export function runDemoIngestion(asOf = demoAsOf): IngestionReport {
  const records = buildDemoRecords();
  const adapters = sourceCatalog.map((source) => createFixtureAdapter(source, records));
  const runnerResult = runAdapters(adapters, { asOf });
  const results = runnerResult.results;
  const events = results.map((result) => result.event);
  const adapterIssues = results.flatMap((result) =>
    result.warnings.map((message) => ({
      recordId: result.source.id,
      severity: "warning" as const,
      message
    }))
  );
  const issues = [...validateRecords(records), ...adapterIssues, ...runnerResult.issues];
  const health = buildSourceHealth(sourceCatalog, events, asOf);
  const report = { generatedAt: asOf, records, health, issues, events };

  assertReportIsUsable(report);
  return report;
}
