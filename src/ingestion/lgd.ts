import { z } from "zod";
import type { DataStatus, GeographicRegion, GovernanceBranch, LocalBodyType, RegionKind } from "@/data/geography";

const governanceBranchSchema = z.enum(["administrative", "urban-local-government", "rural-local-government"]);
const regionKindSchema = z.enum([
  "country",
  "state",
  "union-territory",
  "division",
  "district",
  "sub-division",
  "sub-district",
  "development-block",
  "village",
  "town",
  "city",
  "urban-local-body",
  "rural-local-body",
  "ward",
  "locality"
]);
const localBodyTypeSchema = z
  .enum([
    "municipal-corporation",
    "municipality",
    "town-panchayat",
    "cantonment-board",
    "district-panchayat",
    "block-panchayat",
    "gram-panchayat"
  ])
  .optional();
const httpUrlSchema = z.url().refine(
  (value) => {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  },
  { message: "Expected an HTTP(S) URL" }
);

export const lgdImportRowSchema = z
  .object({
    lgdCode: z.string().trim().min(1),
    name: z.string().trim().min(2),
    localName: z.string().trim().min(1).optional(),
    kind: regionKindSchema,
    parentLgdCode: z.string().trim().min(1).optional(),
    governanceBranch: governanceBranchSchema,
    localBodyType: localBodyTypeSchema,
    stateLgdCode: z.string().trim().min(1),
    districtLgdCode: z.string().trim().min(1).optional(),
    latitude: z.number().min(6).max(38).optional(),
    longitude: z.number().min(68).max(98).optional(),
    sourceUrl: httpUrlSchema,
    sourceName: z.string().trim().min(2),
    lastChecked: z.iso.date()
  })
  .strict();

export const lgdImportBatchSchema = z.array(lgdImportRowSchema);

export type LgdImportRow = z.infer<typeof lgdImportRowSchema>;

export interface LgdImportResult {
  regions: GeographicRegion[];
  warnings: string[];
}

function slugPart(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugForRow(row: LgdImportRow) {
  return `${slugPart(row.name)}-${slugPart(row.lgdCode)}`;
}

function regionIdFromCode(lgdCode: string) {
  return `lgd-${lgdCode}`;
}

function regionId(row: LgdImportRow) {
  return regionIdFromCode(row.lgdCode);
}

function dataStatusFor(row: LgdImportRow): DataStatus {
  return row.kind === "state" || row.kind === "union-territory" || row.kind === "district" ? "directory-page" : "under-development";
}

function factRows(row: LgdImportRow) {
  return [
    { label: "LGD code", value: row.lgdCode },
    { label: "Governance branch", value: row.governanceBranch.replaceAll("-", " ") },
    { label: "Source checked", value: row.lastChecked }
  ];
}

function buildSlug(row: LgdImportRow, byCode: Map<string, LgdImportRow>, warnings: string[]) {
  const lineage: LgdImportRow[] = [row];
  const visitedCodes = new Set([row.lgdCode]);
  let currentCode = row.parentLgdCode;

  while (currentCode) {
    if (visitedCodes.has(currentCode)) {
      warnings.push(`${row.lgdCode}: cyclic parent LGD reference involving ${currentCode}; slug lineage was truncated.`);
      break;
    }
    visitedCodes.add(currentCode);

    const current = byCode.get(currentCode);
    if (!current) break;
    lineage.unshift(current);
    currentCode = current.parentLgdCode;
  }

  return ["india", ...lineage.map(slugForRow)];
}

function hasParentCycle(row: LgdImportRow, byCode: Map<string, LgdImportRow>) {
  const visitedCodes = new Set([row.lgdCode]);
  let currentCode = row.parentLgdCode;

  while (currentCode) {
    if (visitedCodes.has(currentCode)) return true;
    visitedCodes.add(currentCode);
    currentCode = byCode.get(currentCode)?.parentLgdCode;
  }

  return false;
}

export function normalizeLgdRows(rows: unknown[]): LgdImportResult {
  const warnings: string[] = [];
  const validRows: LgdImportRow[] = [];

  rows.forEach((row, index) => {
    const parsed = lgdImportRowSchema.safeParse(row);
    if (!parsed.success) {
      warnings.push(...parsed.error.issues.map((issue) => `row ${index + 1}.${issue.path.join(".") || "row"}: ${issue.message}`));
      return;
    }
    validRows.push(parsed.data);
  });

  const byCode = new Map<string, LgdImportRow>();
  const acceptedRows: LgdImportRow[] = [];
  for (const row of validRows) {
    if (byCode.has(row.lgdCode)) {
      warnings.push(`${row.lgdCode}: duplicate LGD code in import batch; later row was skipped.`);
      continue;
    }
    byCode.set(row.lgdCode, row);
    acceptedRows.push(row);
  }

  const hierarchyRows = acceptedRows.filter((row) => {
    if (!hasParentCycle(row, byCode)) return true;
    warnings.push(`${row.lgdCode}: cyclic parent LGD reference; row was skipped.`);
    return false;
  });

  const regions = hierarchyRows.map<GeographicRegion>((row) => {
    const parentId = row.parentLgdCode ? regionIdFromCode(row.parentLgdCode) : "india";
    if (row.parentLgdCode && !byCode.has(row.parentLgdCode)) {
      warnings.push(`${row.lgdCode}: parent LGD code ${row.parentLgdCode} was not present in this import batch.`);
    }

    const id = regionId(row);

    return {
      id,
      kind: row.kind as RegionKind,
      name: row.name,
      localName: row.localName,
      slug: buildSlug(row, byCode, warnings),
      parentId,
      governanceBranch: row.governanceBranch as GovernanceBranch,
      dataStatus: dataStatusFor(row),
      localBodyType: row.localBodyType as LocalBodyType | undefined,
      summary: `${row.name} imported from the Local Government Directory as a ${row.kind.replaceAll("-", " ")} entry.`,
      center: row.latitude !== undefined && row.longitude !== undefined ? { lat: row.latitude, lng: row.longitude } : undefined,
      directRecordIds: [],
      facts: factRows(row)
    };
  });

  return { regions, warnings };
}

export const lgdFixtureRows: LgdImportRow[] = [
  {
    lgdCode: "27",
    name: "Maharashtra",
    localName: "महाराष्ट्र",
    kind: "state",
    governanceBranch: "administrative",
    stateLgdCode: "27",
    latitude: 19.7515,
    longitude: 75.7139,
    sourceUrl: "https://lgdirectory.gov.in/",
    sourceName: "Local Government Directory",
    lastChecked: "2026-06-26"
  },
  {
    lgdCode: "482",
    name: "Mumbai",
    kind: "district",
    parentLgdCode: "27",
    governanceBranch: "administrative",
    stateLgdCode: "27",
    districtLgdCode: "482",
    latitude: 18.9388,
    longitude: 72.8354,
    sourceUrl: "https://lgdirectory.gov.in/",
    sourceName: "Local Government Directory",
    lastChecked: "2026-06-26"
  },
  {
    lgdCode: "483",
    name: "Mumbai Suburban",
    kind: "district",
    parentLgdCode: "27",
    governanceBranch: "administrative",
    stateLgdCode: "27",
    districtLgdCode: "483",
    latitude: 19.1538,
    longitude: 72.8752,
    sourceUrl: "https://lgdirectory.gov.in/",
    sourceName: "Local Government Directory",
    lastChecked: "2026-06-26"
  }
];
