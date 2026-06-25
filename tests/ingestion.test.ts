import { describe, expect, it } from "vitest";
import { getAllRecords, getIngestionReport, getRecordStats } from "@/data/repository";
import { sourceCatalog } from "@/ingestion/source-catalog";
import { validateRecords } from "@/ingestion/validator";

describe("Draft 2 ingestion backbone", () => {
  it("produces valid normalized records with unique ids", () => {
    const records = getAllRecords();
    const issues = validateRecords(records);

    expect(issues.filter((issue) => issue.severity === "error")).toHaveLength(0);
    expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
  });

  it("tracks source health for every catalog entry", () => {
    const report = getIngestionReport();

    expect(report.health).toHaveLength(sourceCatalog.length);
    expect(report.health.every((source) => source.recordCount > 0)).toBe(true);
  });

  it("covers the next national source expansion backlog", () => {
    const sourceIds = new Set(sourceCatalog.map((source) => source.id));

    expect(sourceCatalog.length).toBeGreaterThanOrEqual(16);
    expect(sourceIds).toContain("lgd-india");
    expect(sourceIds).toContain("pmgsy");
    expect(sourceIds).toContain("mcd-311");
    expect(sourceCatalog.every((source) => source.legal.licenseNote.length > 12)).toBe(true);
  });

  it("keeps official-source provenance measurable", () => {
    const stats = getRecordStats();

    expect(stats.totalRecords).toBeGreaterThan(6);
    expect(stats.officialSourceRecords).toBeGreaterThan(0);
    expect(stats.lowConfidenceRecords).toBeGreaterThan(0);
  });

  it("returns validation issues instead of throwing for malformed records", () => {
    const issues = validateRecords([{ id: "bad-record", kind: "office", title: "Broken" }]);

    expect(issues.some((issue) => issue.recordId === "bad-record" && issue.severity === "error")).toBe(true);
  });
});
