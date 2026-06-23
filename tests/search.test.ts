import { describe, expect, it } from "vitest";
import { buildSearchResponse, searchRecords } from "@/lib/search";

describe("searchRecords", () => {
  it("ranks road complaint records for a local issue query", () => {
    const results = searchRecords("road complaint Bandra");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.record.title).toContain("BMC");
    expect(results[0]?.score).toBeGreaterThan(0);
  });

  it("filters by tender kind", () => {
    const results = searchRecords("road works tender", "tender");

    expect(results).toHaveLength(1);
    expect(results[0]?.record.kind).toBe("tender");
  });

  it("returns caveats with every response", () => {
    const response = buildSearchResponse("CPGRAMS");

    expect(response.caveats.some((caveat) => caveat.includes("confidence"))).toBe(true);
  });
});
