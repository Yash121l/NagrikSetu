import { describe, expect, it } from "vitest";
import { getAllRecords } from "@/data/repository";
import { searchRecords } from "@/lib/search";
import {
  applyWorkspaceControls,
  buildWorkspaceMatches,
  defaultWorkspaceFilters,
  parseWorkspaceFilters,
  serializeRecordsForCsv
} from "@/lib/workspace";
import { toSafeExternalHref } from "@/lib/urls";

describe("record workspace controls", () => {
  it("filters records by confidence, source priority, language, and missing coordinates", () => {
    const records = getAllRecords();
    const filtered = applyWorkspaceControls(buildWorkspaceMatches(records), {
      ...defaultWorkspaceFilters,
      confidence: "low",
      sourcePriority: "permissive-third-party",
      language: "hi",
      location: "with-location"
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.record.id).toBe("road-demo-linking-road");
  });

  it("sorts searched records by source freshness fields", () => {
    const filtered = applyWorkspaceControls(searchRecords("complaint"), {
      ...defaultWorkspaceFilters,
      sortBy: "lastChecked",
      sortDirection: "asc"
    });

    expect(filtered.length).toBeGreaterThan(1);
    expect(filtered[0]?.record.provenance.lastChecked <= filtered.at(-1)!.record.provenance.lastChecked).toBe(true);
  });

  it("parses invalid workspace query params back to safe defaults", () => {
    const filters = parseWorkspaceFilters(
      new URLSearchParams({
        kind: "unsafe",
        confidence: "certain",
        sourcePriority: "private",
        freshness: "ancient",
        location: "home",
        sortBy: "random",
        sortDirection: "sideways"
      })
    );

    expect(filters).toEqual(defaultWorkspaceFilters);
  });

  it("exports source attribution and license notes in CSV", () => {
    const csv = serializeRecordsForCsv([getAllRecords()[0]!], "2026-06-26T00:00:00.000Z");

    expect(csv).toContain('"sourceName"');
    expect(csv).toContain('"sourceUrl"');
    expect(csv).toContain('"licenseNote"');
    expect(csv).toContain('"confidence"');
  });

  it("neutralizes formula-looking CSV cells from source-derived data", () => {
    const [record] = getAllRecords();
    const csv = serializeRecordsForCsv(
      [
        {
          ...record!,
          title: "=IMPORTXML(\"https://example.test\")",
          provenance: { ...record!.provenance, licenseNote: "@untrusted formula-like value" }
        }
      ],
      "2026-06-26T00:00:00.000Z"
    );

    expect(csv).toContain("\"'=IMPORTXML(\"\"https://example.test\"\")\"");
    expect(csv).toContain("\"'@untrusted formula-like value\"");
  });

  it("keeps external links on http and https protocols only", () => {
    expect(toSafeExternalHref("javascript:alert(1)", "https://example.test")).toBe("https://example.test/");
    expect(toSafeExternalHref("data:text/html,unsafe")).toBeNull();
  });
});
