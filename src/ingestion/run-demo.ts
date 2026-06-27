import { seedRecords } from "@/lib/seed-data";
import { stateProfiles } from "@/data/state-profiles";
import { sourceCatalog } from "./source-catalog";
import { runAdapters } from "./connector-runner";
import { createFixtureAdapter } from "./fixture-adapter";
import { assertReportIsUsable, buildSourceHealth, validateRecords } from "./validator";
import type { IngestionReport } from "./types";
import type { NagrikRecord } from "@/lib/types";

const demoAsOf = "2026-06-27";
const stateProfileLicenseNote =
  "Use National Portal state and UT directory facts with source dates; recheck volatile office-holder fields separately.";
const stateProfileRegionNames: Record<string, { name: string; kind: "state" | "union territory" }> = {
  "andhra-pradesh": { name: "Andhra Pradesh", kind: "state" },
  "arunachal-pradesh": { name: "Arunachal Pradesh", kind: "state" },
  assam: { name: "Assam", kind: "state" },
  bihar: { name: "Bihar", kind: "state" },
  chhattisgarh: { name: "Chhattisgarh", kind: "state" },
  goa: { name: "Goa", kind: "state" },
  gujarat: { name: "Gujarat", kind: "state" },
  haryana: { name: "Haryana", kind: "state" },
  "himachal-pradesh": { name: "Himachal Pradesh", kind: "state" },
  jharkhand: { name: "Jharkhand", kind: "state" },
  karnataka: { name: "Karnataka", kind: "state" },
  kerala: { name: "Kerala", kind: "state" },
  "madhya-pradesh": { name: "Madhya Pradesh", kind: "state" },
  maharashtra: { name: "Maharashtra", kind: "state" },
  manipur: { name: "Manipur", kind: "state" },
  meghalaya: { name: "Meghalaya", kind: "state" },
  mizoram: { name: "Mizoram", kind: "state" },
  nagaland: { name: "Nagaland", kind: "state" },
  odisha: { name: "Odisha", kind: "state" },
  punjab: { name: "Punjab", kind: "state" },
  rajasthan: { name: "Rajasthan", kind: "state" },
  sikkim: { name: "Sikkim", kind: "state" },
  "tamil-nadu": { name: "Tamil Nadu", kind: "state" },
  telangana: { name: "Telangana", kind: "state" },
  tripura: { name: "Tripura", kind: "state" },
  "uttar-pradesh": { name: "Uttar Pradesh", kind: "state" },
  uttarakhand: { name: "Uttarakhand", kind: "state" },
  "west-bengal": { name: "West Bengal", kind: "state" },
  "andaman-and-nicobar-islands": { name: "Andaman and Nicobar Islands", kind: "union territory" },
  chandigarh: { name: "Chandigarh", kind: "union territory" },
  "dadra-and-nagar-haveli-and-daman-and-diu": {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    kind: "union territory"
  },
  delhi: { name: "National Capital Territory of Delhi", kind: "union territory" },
  "jammu-and-kashmir": { name: "Jammu and Kashmir", kind: "union territory" },
  ladakh: { name: "Ladakh", kind: "union territory" },
  lakshadweep: { name: "Lakshadweep", kind: "union territory" },
  puducherry: { name: "Puducherry", kind: "union territory" }
};

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

export function buildStateProfileRecords(): NagrikRecord[] {
  return stateProfiles.flatMap((profile) => {
    const region = stateProfileRegionNames[profile.regionId];
    const regionName = region?.name ?? profile.regionId.replaceAll("-", " ");
    const typeLabel = region?.kind ?? "jurisdiction";
    return [
      {
        id: `office-${profile.regionId}-official-portal`,
        kind: "office",
        title: `${regionName} official government portal`,
        summary: `Official ${typeLabel} portal for ${regionName}, linked from the National Portal state and Union Territory directory. Use this as the first source for departments, services, notices, and official state-level updates.`,
        department: `Government of ${regionName}`,
        jurisdiction: regionName,
        website: profile.officialPortalUrl,
        issueTags: [
          regionName,
          "official portal",
          "state services",
          "government departments",
          "public information"
        ],
        languageTags: ["en", "hi"],
        services: ["Official portal", "Government departments", "Public notices", "State services"],
        parentOffice: "Government of India state and Union Territory directory",
        confidence: "high",
        updatedAt: profile.profileSource.lastChecked,
        provenance: {
          sourceName: profile.profileSource.sourceName,
          sourceUrl: profile.profileSource.sourceUrl,
          lastChecked: profile.profileSource.lastChecked,
          priority: "official",
          licenseNote: stateProfileLicenseNote
        }
      },
      {
        id: `source-${profile.regionId}-state-profile`,
        kind: "source",
        title: `${regionName} state profile source bundle`,
        summary: `Source-backed profile for ${regionName}: capital ${profile.capital}, government code ${profile.governmentCode}, LGD code ${profile.lgdCode}, official portal, National Portal leadership directories, and latest available RBI per-capita NSDP. Volatile office-holder fields should be rechecked before release updates.`,
        department: "National Portal of India and Reserve Bank of India",
        jurisdiction: regionName,
        website: profile.profileSource.sourceUrl,
        issueTags: [
          regionName,
          "state profile",
          "official portal",
          "LGD code",
          "chief minister",
          "governor",
          "RBI NSDP"
        ],
        languageTags: ["en", "hi"],
        confidence: profile.economy.perCapitaNsdpInr === null ? "medium" : "high",
        updatedAt: profile.profileSource.lastChecked,
        provenance: {
          sourceName: profile.profileSource.sourceName,
          sourceUrl: profile.profileSource.sourceUrl,
          lastChecked: profile.profileSource.lastChecked,
          priority: "official",
          licenseNote: stateProfileLicenseNote
        }
      }
    ] satisfies NagrikRecord[];
  });
}

export function buildDemoRecords() {
  const sourceRecords = buildSourceRecords();
  const stateProfileRecords = buildStateProfileRecords();
  const duplicateSourceIds = new Set(sourceRecords.map((record) => record.id));
  const generatedSourceUrls = new Set(sourceRecords.map((record) => record.provenance.sourceUrl));
  const retainedSeedRecords = seedRecords.filter((record) => {
    if (duplicateSourceIds.has(record.id)) return false;
    return record.kind !== "source" || !generatedSourceUrls.has(record.provenance.sourceUrl);
  });
  return [...retainedSeedRecords, ...stateProfileRecords, ...sourceRecords];
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
