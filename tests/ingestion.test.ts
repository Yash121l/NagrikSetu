import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { getAllRecords, getIngestionReport, getRecordStats } from "@/data/repository";
import { lgdFixtureRows, normalizeLgdRows } from "@/ingestion/lgd";
import { sourceCatalog } from "@/ingestion/source-catalog";
import { writeRawSnapshot } from "@/ingestion/raw-snapshot";
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

  it("writes raw snapshots with content hashes and sidecar manifests", async () => {
    const rawDir = await mkdtemp(path.join(tmpdir(), "nagriksetu-raw-"));
    try {
      const manifest = await writeRawSnapshot(
        {
          sourceId: "lgd-india",
          sourceName: "Local Government Directory",
          sourceUrl: "https://lgdirectory.gov.in/",
          fetchedAt: "2026-06-26T00:00:00.000Z",
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
          licenseNote: "Use public directory downloads with LGD attribution."
        },
        rawDir
      );

      expect(manifest.contentHash).toHaveLength(64);
      expect(manifest.byteLength).toBeGreaterThan(0);
      expect(JSON.parse(await readFile(manifest.manifestPath, "utf8")).bodyPath).toBe(manifest.bodyPath);
    } finally {
      await rm(rawDir, { recursive: true, force: true });
    }
  });

  it("rejects malformed raw snapshot dates before building paths", async () => {
    const rawDir = await mkdtemp(path.join(tmpdir(), "nagriksetu-raw-"));
    try {
      await expect(
        writeRawSnapshot(
          {
            sourceId: "lgd-india",
            sourceName: "Local Government Directory",
            sourceUrl: "https://lgdirectory.gov.in/",
            fetchedAt: "../2026-06-26",
            contentType: "application/json",
            body: "{}",
            licenseNote: "Use public directory downloads with LGD attribution."
          },
          rawDir
        )
      ).rejects.toThrow("ISO date or timestamp");

      await expect(
        writeRawSnapshot(
          {
            sourceId: "lgd-india",
            sourceName: "Local Government Directory",
            sourceUrl: "https://lgdirectory.gov.in/",
            fetchedAt: "2026-02-31",
            contentType: "application/json",
            body: "{}",
            licenseNote: "Use public directory downloads with LGD attribution."
          },
          rawDir
        )
      ).rejects.toThrow("ISO date or timestamp");
    } finally {
      await rm(rawDir, { recursive: true, force: true });
    }
  });

  it("normalizes LGD rows while preserving governance branches and parents", () => {
    const result = normalizeLgdRows(lgdFixtureRows);

    expect(result.warnings).toHaveLength(0);
    expect(result.regions).toHaveLength(3);
    expect(result.regions.find((region) => region.id === "lgd-482")?.parentId).toBe("lgd-27");
    expect(result.regions.find((region) => region.id === "lgd-483")?.parentId).toBe("lgd-27");
    expect(result.regions.every((region) => region.governanceBranch === "administrative")).toBe(true);
  });

  it("reports cyclic LGD parent links instead of hanging", () => {
    const result = normalizeLgdRows([
      { ...lgdFixtureRows[0], lgdCode: "A", name: "Alpha", parentLgdCode: "B" },
      { ...lgdFixtureRows[0], lgdCode: "B", name: "Beta", parentLgdCode: "A" }
    ]);

    expect(result.regions).toHaveLength(0);
    expect(result.warnings.some((warning) => warning.includes("cyclic parent LGD reference"))).toBe(true);
  });

  it("keeps valid LGD rows while quarantining malformed rows", () => {
    const result = normalizeLgdRows([lgdFixtureRows[0], { ...lgdFixtureRows[1], name: "" }]);

    expect(result.regions).toHaveLength(1);
    expect(result.regions[0]?.id).toBe("lgd-27");
    expect(result.warnings.some((warning) => warning.startsWith("row 2."))).toBe(true);
  });

  it("skips duplicate LGD codes so region ids remain unique", () => {
    const result = normalizeLgdRows([lgdFixtureRows[0], { ...lgdFixtureRows[0], name: "Duplicate Maharashtra" }]);

    expect(result.regions).toHaveLength(1);
    expect(new Set(result.regions.map((region) => region.id)).size).toBe(result.regions.length);
    expect(result.warnings.some((warning) => warning.includes("duplicate LGD code"))).toBe(true);
  });

  it("keeps LGD slugs unique for same-name sibling rows", () => {
    const result = normalizeLgdRows([
      lgdFixtureRows[0],
      { ...lgdFixtureRows[1], lgdCode: "1001", districtLgdCode: "1001", name: "Rampur" },
      { ...lgdFixtureRows[1], lgdCode: "1002", districtLgdCode: "1002", name: "Rampur" }
    ]);
    const slugs = result.regions.map((region) => region.slug.join("/"));

    expect(result.warnings).toHaveLength(0);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toContain("india/maharashtra-27/rampur-1001");
    expect(slugs).toContain("india/maharashtra-27/rampur-1002");
  });

  it("rejects non-http LGD source URLs", () => {
    const result = normalizeLgdRows([{ ...lgdFixtureRows[0], sourceUrl: "javascript:alert(1)" }]);

    expect(result.regions).toHaveLength(0);
    expect(result.warnings.some((warning) => warning.includes("Expected an HTTP(S) URL"))).toBe(true);
  });
});
