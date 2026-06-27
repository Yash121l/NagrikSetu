import { describe, expect, it } from "vitest";
import {
  geographicRegions,
  getPrimaryRegionForRecord,
  getRegionById,
  getRegionBySlug,
  getRegionRecords,
  indiaDirectoryStats,
  stateAndUnionTerritoryEntries
} from "@/data/geography";
import { getAllRecords } from "@/data/repository";
import { getStateProfile, stateProfiles } from "@/data/state-profiles";
import { getOfficialAction, getRecordSections, getRelatedRecords } from "@/lib/record-details";
import type { NagrikRecord } from "@/lib/types";

describe("Draft 3 first-party navigation", () => {
  it("gives every record a complete first-party detail model", () => {
    const records = getAllRecords();

    for (const record of records) {
      expect(getRecordSections(record).length).toBeGreaterThan(0);
      expect(getRecordSections(record).every((section) => section.facts.length > 0)).toBe(true);
      expect(getOfficialAction(record).href).toMatch(/^https:\/\//);
      expect(getOfficialAction(record).isOfficial).toBe(record.provenance.priority === "official");
      expect(getPrimaryRegionForRecord(record.id), `missing region for ${record.id}`).toBeDefined();
    }
  });

  it("rejects unsafe outbound record actions and normalizes related departments", () => {
    const records = getAllRecords();
    const source = records.find((record) => record.id === "source-openstreetmap");
    const candidate = records.find((record) => record.id !== source?.id);
    if (!source || !candidate) throw new Error("Expected fixture records");

    const unsafeSource = {
      ...source,
      website: "javascript:alert(1)",
      provenance: { ...source.provenance, sourceUrl: "data:text/html,unsafe" }
    } as NagrikRecord;
    expect(getOfficialAction(unsafeSource).href).toBeNull();

    const normalizedDepartmentCandidate = {
      ...candidate,
      department: `  ${source.department.toUpperCase()}  `,
      issueTags: [],
      jurisdiction: "Different jurisdiction"
    } as NagrikRecord;
    expect(getRelatedRecords(source, [source, normalizedDepartmentCandidate])).toEqual([normalizedDepartmentCandidate]);
  });

  it("keeps geographic slugs unique and parent links resolvable", () => {
    const paths = geographicRegions.map((region) => region.slug.join("/"));
    expect(new Set(paths).size).toBe(paths.length);

    for (const region of geographicRegions) {
      expect(getRegionBySlug(region.slug)?.id).toBe(region.id);
      if (region.parentId) expect(getRegionById(region.parentId)).toBeDefined();
    }
  });

  it("creates all 28 state and 8 Union Territory pages", () => {
    const states = stateAndUnionTerritoryEntries.filter((entry) => entry.kind === "state");
    const unionTerritories = stateAndUnionTerritoryEntries.filter((entry) => entry.kind === "union-territory");

    expect(states).toHaveLength(28);
    expect(unionTerritories).toHaveLength(8);
    expect(stateAndUnionTerritoryEntries).toHaveLength(36);
    expect(stateAndUnionTerritoryEntries.every((entry) => getRegionBySlug(["india", entry.id]))).toBe(true);
  });

  it("gives every state and Union Territory a sourced civic profile", () => {
    expect(stateProfiles).toHaveLength(36);
    expect(new Set(stateProfiles.map((profile) => profile.regionId)).size).toBe(36);

    for (const entry of stateAndUnionTerritoryEntries) {
      const profile = getStateProfile(entry.id);
      expect(profile, `missing profile for ${entry.id}`).toBeDefined();
      expect(profile?.capital.length).toBeGreaterThan(1);
      expect(profile?.officialPortalUrl).toMatch(/^https:\/\//);
      expect(profile?.constitutionalHead.name).toBeTruthy();
      expect(profile?.constitutionalHead.source.sourceUrl).toMatch(/^https:\/\//);
      expect(profile?.profileSource.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      if (profile?.economy.perCapitaNsdpInr === null) {
        expect(profile.economy.unavailableReason).toContain("not reported");
      } else {
        expect(profile?.economy.perCapitaNsdpInr).toBeGreaterThan(0);
        expect(profile?.economy.reportingPeriod).toMatch(/^20\d{2}-\d{2}$/);
        expect(profile?.economy.allIndiaPerCapitaNniInr).toBeGreaterThan(0);
      }
    }

    expect(stateProfiles.filter((profile) => profile.chiefMinister.name)).toHaveLength(31);
    expect(stateProfiles.filter((profile) => profile.economy.perCapitaNsdpInr !== null)).toHaveLength(33);
  });

  it("gives every state and Union Territory source-backed records", () => {
    for (const entry of stateAndUnionTerritoryEntries) {
      const region = getRegionBySlug(["india", entry.id]);
      if (!region) throw new Error(`missing region for ${entry.id}`);

      const records = getRegionRecords(region);
      expect(records.length, `missing records for ${entry.id}`).toBeGreaterThanOrEqual(2);
      expect(records.some((record) => record.id === `office-${entry.id}-official-portal`)).toBe(true);
      expect(records.some((record) => record.id === `source-${entry.id}-state-profile`)).toBe(true);
    }
  });

  it("models national district and urban local body capacity separately", () => {
    expect(indiaDirectoryStats.find((stat) => stat.label === "Districts")?.value).toBe(784);
    expect(indiaDirectoryStats.find((stat) => stat.label === "Urban Local Bodies")?.value).toBe(5052);

    const mcgm = getRegionById("mcgm");
    const hWest = getRegionById("h-west-ward");
    expect(mcgm?.kind).toBe("urban-local-body");
    expect(mcgm?.localBodyType).toBe("municipal-corporation");
    expect(hWest?.parentId).toBe("mcgm");
  });

  it("rolls child records into parent place pages", () => {
    const india = getRegionById("india");
    const maharashtra = getRegionById("maharashtra");
    if (!india || !maharashtra) throw new Error("Expected pilot geography");

    expect(getRegionRecords(india)).toHaveLength(getAllRecords().length);
    expect(getRegionRecords(maharashtra).some((record) => record.id === "road-demo-linking-road")).toBe(true);
    expect(getRegionRecords(maharashtra).some((record) => record.id === "complaint-cpgrams")).toBe(false);
  });
});
