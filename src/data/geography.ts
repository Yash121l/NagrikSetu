import { getAllRecords } from "@/data/repository";
import type { NagrikRecord } from "@/lib/types";

export type RegionKind =
  | "country"
  | "state"
  | "union-territory"
  | "division"
  | "district"
  | "sub-division"
  | "sub-district"
  | "development-block"
  | "village"
  | "town"
  | "city"
  | "urban-local-body"
  | "rural-local-body"
  | "ward"
  | "locality";

export type GovernanceBranch = "administrative" | "urban-local-government" | "rural-local-government";
export type DataStatus = "source-backed-pilot" | "directory-page" | "under-development";
export type LocalBodyType =
  | "municipal-corporation"
  | "municipality"
  | "town-panchayat"
  | "cantonment-board"
  | "district-panchayat"
  | "block-panchayat"
  | "gram-panchayat";

export interface GeographicRegion {
  id: string;
  kind: RegionKind;
  name: string;
  localName?: string;
  slug: string[];
  parentId?: string;
  relatedRegionIds?: string[];
  governanceBranch: GovernanceBranch;
  dataStatus: DataStatus;
  localBodyType?: LocalBodyType;
  summary: string;
  center?: { lat: number; lng: number };
  directRecordIds: string[];
  facts: Array<{ label: string; value: string }>;
}

interface TopLevelEntry {
  id: string;
  name: string;
  kind: "state" | "union-territory";
}

export const stateAndUnionTerritoryEntries: TopLevelEntry[] = [
  { id: "andhra-pradesh", name: "Andhra Pradesh", kind: "state" },
  { id: "arunachal-pradesh", name: "Arunachal Pradesh", kind: "state" },
  { id: "assam", name: "Assam", kind: "state" },
  { id: "bihar", name: "Bihar", kind: "state" },
  { id: "chhattisgarh", name: "Chhattisgarh", kind: "state" },
  { id: "goa", name: "Goa", kind: "state" },
  { id: "gujarat", name: "Gujarat", kind: "state" },
  { id: "haryana", name: "Haryana", kind: "state" },
  { id: "himachal-pradesh", name: "Himachal Pradesh", kind: "state" },
  { id: "jharkhand", name: "Jharkhand", kind: "state" },
  { id: "karnataka", name: "Karnataka", kind: "state" },
  { id: "kerala", name: "Kerala", kind: "state" },
  { id: "madhya-pradesh", name: "Madhya Pradesh", kind: "state" },
  { id: "maharashtra", name: "Maharashtra", kind: "state" },
  { id: "manipur", name: "Manipur", kind: "state" },
  { id: "meghalaya", name: "Meghalaya", kind: "state" },
  { id: "mizoram", name: "Mizoram", kind: "state" },
  { id: "nagaland", name: "Nagaland", kind: "state" },
  { id: "odisha", name: "Odisha", kind: "state" },
  { id: "punjab", name: "Punjab", kind: "state" },
  { id: "rajasthan", name: "Rajasthan", kind: "state" },
  { id: "sikkim", name: "Sikkim", kind: "state" },
  { id: "tamil-nadu", name: "Tamil Nadu", kind: "state" },
  { id: "telangana", name: "Telangana", kind: "state" },
  { id: "tripura", name: "Tripura", kind: "state" },
  { id: "uttar-pradesh", name: "Uttar Pradesh", kind: "state" },
  { id: "uttarakhand", name: "Uttarakhand", kind: "state" },
  { id: "west-bengal", name: "West Bengal", kind: "state" },
  { id: "andaman-and-nicobar-islands", name: "Andaman and Nicobar Islands", kind: "union-territory" },
  { id: "chandigarh", name: "Chandigarh", kind: "union-territory" },
  {
    id: "dadra-and-nagar-haveli-and-daman-and-diu",
    name: "Dadra and Nagar Haveli and Daman and Diu",
    kind: "union-territory"
  },
  { id: "delhi", name: "National Capital Territory of Delhi", kind: "union-territory" },
  { id: "jammu-and-kashmir", name: "Jammu and Kashmir", kind: "union-territory" },
  { id: "ladakh", name: "Ladakh", kind: "union-territory" },
  { id: "lakshadweep", name: "Lakshadweep", kind: "union-territory" },
  { id: "puducherry", name: "Puducherry", kind: "union-territory" }
];

export const indiaDirectoryStats = [
  { label: "Country", value: 1, group: "Top level" },
  { label: "States", value: 28, group: "Top level" },
  { label: "Union Territories", value: 8, group: "Top level" },
  { label: "Total State/UT entries", value: 36, group: "Top level" },
  { label: "Districts", value: 784, group: "Administrative" },
  { label: "Sub-districts", value: 7090, group: "Administrative" },
  { label: "Development Blocks", value: 7323, group: "Administrative" },
  { label: "Villages", value: 676859, group: "Administrative" },
  { label: "Inhabited villages", value: 657588, group: "Administrative" },
  { label: "Rural villages", value: 641617, group: "Administrative" },
  { label: "Urban villages", value: 21720, group: "Administrative" },
  { label: "Rural Local Bodies", value: 262752, group: "Rural local government" },
  { label: "District Panchayats", value: 674, group: "Rural local government" },
  { label: "Block Panchayats", value: 6756, group: "Rural local government" },
  { label: "Gram Panchayats", value: 255322, group: "Rural local government" },
  { label: "Urban Local Bodies", value: 5052, group: "Urban local government" },
  { label: "Municipal Corporations", value: 271, group: "Urban local government" },
  { label: "Municipalities", value: 2012, group: "Urban local government" },
  { label: "Town Panchayats", value: 2418, group: "Urban local government" },
  { label: "Cantonment Boards", value: 60, group: "Urban local government" }
] as const;

export const indiaHierarchyModels = [
  {
    id: "administrative",
    title: "Administrative and revenue hierarchy",
    steps: [
      "India",
      "State / Union Territory",
      "Division / Region (where used)",
      "District",
      "Sub-division / Sub-district",
      "Tehsil / Taluka / Mandal / Circle",
      "Village / Town / City",
      "Ward / Locality / Mohalla"
    ]
  },
  {
    id: "rural",
    title: "Rural local government hierarchy",
    steps: ["District Panchayat / Zila Parishad", "Block Panchayat / Panchayat Samiti", "Gram Panchayat", "Village"]
  },
  {
    id: "urban",
    title: "Urban local government hierarchy",
    steps: [
      "District and city context",
      "Urban Local Body",
      "Municipal Corporation / Municipality / Town Panchayat / Cantonment Board",
      "Ward",
      "Locality"
    ]
  }
] as const;

const topLevelRecordIdsByRegion: Record<string, string[]> = {
  delhi: ["complaint-mcd-civic", "source-mcd-311"]
};

const topLevelRegions: GeographicRegion[] = stateAndUnionTerritoryEntries.map((entry) => {
  const isMaharashtra = entry.id === "maharashtra";
  const typeLabel = entry.kind === "state" ? "State" : "Union Territory";
  const directRecordIds = topLevelRecordIdsByRegion[entry.id] ?? [];

  return {
    id: entry.id,
    kind: entry.kind,
    name: entry.name,
    localName: isMaharashtra ? "महाराष्ट्र" : undefined,
    slug: ["india", entry.id],
    parentId: "india",
    governanceBranch: "administrative",
    dataStatus: isMaharashtra ? "source-backed-pilot" : "directory-page",
    summary: isMaharashtra
      ? "State-level entry point for Maharashtra civic offices, grievance paths, public works, districts, cities, and local bodies."
      : `${typeLabel} directory page for ${entry.name}. District, city, rural-body, and urban-body data is under structured development.`,
    center: isMaharashtra ? { lat: 19.7515, lng: 75.7139 } : undefined,
    directRecordIds,
    facts: [
      { label: "Administrative type", value: typeLabel },
      {
        label: "Data status",
        value: isMaharashtra
          ? "Mumbai source-backed pilot available"
          : directRecordIds.length > 0
            ? "Top-level page has national-source records; lower levels under development"
            : "Top-level page ready; lower levels under development"
      }
    ]
  };
});

const pilotRegions: GeographicRegion[] = [
  {
    id: "mumbai-city-district",
    kind: "district",
    name: "Mumbai City District",
    localName: "मुंबई शहर जिला",
    slug: ["india", "maharashtra", "mumbai-city-district"],
    parentId: "maharashtra",
    relatedRegionIds: ["mumbai-city-area", "mcgm"],
    governanceBranch: "administrative",
    dataStatus: "directory-page",
    summary: "Administrative district page linked to the Mumbai city and municipal-corporation pilot views.",
    center: { lat: 18.9388, lng: 72.8354 },
    directRecordIds: [],
    facts: [
      { label: "Administrative level", value: "District" },
      { label: "Lower-level data", value: "Sub-district and locality records under development" }
    ]
  },
  {
    id: "mumbai-suburban",
    kind: "district",
    name: "Mumbai Suburban District",
    localName: "मुंबई उपनगर जिला",
    slug: ["india", "maharashtra", "mumbai-suburban"],
    parentId: "maharashtra",
    relatedRegionIds: ["mumbai-city-area", "mcgm"],
    governanceBranch: "administrative",
    dataStatus: "source-backed-pilot",
    summary:
      "Pilot district coverage linked to BMC ward responsibility, civic complaints, road lookups, and municipal source evidence.",
    center: { lat: 19.1538, lng: 72.8752 },
    directRecordIds: ["complaint-bmc-civic", "source-bmc-citizen-portal"],
    facts: [
      { label: "Administrative level", value: "District" },
      { label: "Pilot focus", value: "Roads, ward routing, and civic complaints" }
    ]
  },
  {
    id: "mumbai-city-area",
    kind: "city",
    name: "Mumbai",
    localName: "मुंबई",
    slug: ["india", "maharashtra", "mumbai"],
    parentId: "maharashtra",
    relatedRegionIds: ["mumbai-city-district", "mumbai-suburban"],
    governanceBranch: "urban-local-government",
    dataStatus: "source-backed-pilot",
    summary:
      "City-level civic directory connected to both Mumbai districts and the Municipal Corporation of Greater Mumbai.",
    center: { lat: 19.076, lng: 72.8777 },
    directRecordIds: [],
    facts: [
      { label: "Place type", value: "City" },
      { label: "Administrative overlap", value: "Linked to Mumbai City and Mumbai Suburban districts" }
    ]
  },
  {
    id: "mcgm",
    kind: "urban-local-body",
    name: "Municipal Corporation of Greater Mumbai",
    localName: "बृहन्मुंबई महानगरपालिका",
    slug: ["india", "maharashtra", "mumbai", "municipal-corporation-of-greater-mumbai"],
    parentId: "mumbai-city-area",
    relatedRegionIds: ["mumbai-city-district", "mumbai-suburban"],
    governanceBranch: "urban-local-government",
    dataStatus: "source-backed-pilot",
    localBodyType: "municipal-corporation",
    summary:
      "Urban local body page for municipal services, complaints, ward routing, roads, and source evidence across Greater Mumbai.",
    center: { lat: 19.076, lng: 72.8777 },
    directRecordIds: ["complaint-bmc-civic", "source-bmc-citizen-portal"],
    facts: [
      { label: "Local body type", value: "Municipal Corporation" },
      { label: "Governance branch", value: "Urban local government" }
    ]
  },
  {
    id: "h-west-ward",
    kind: "ward",
    name: "H/West Ward",
    localName: "एच/पश्चिम वार्ड",
    slug: ["india", "maharashtra", "mumbai", "municipal-corporation-of-greater-mumbai", "h-west-ward"],
    parentId: "mcgm",
    relatedRegionIds: ["mumbai-suburban"],
    governanceBranch: "urban-local-government",
    dataStatus: "source-backed-pilot",
    summary:
      "Ward-level pilot covering Bandra West, Khar West, and Santacruz West responsibility and road issue routing.",
    center: { lat: 19.0633, lng: 72.8355 },
    directRecordIds: ["office-bmc-roads-hw", "road-demo-linking-road"],
    facts: [
      { label: "Primary local areas", value: "Bandra West, Khar West, Santacruz West" },
      { label: "Current issue coverage", value: "Road works and civic complaint routing" }
    ]
  }
];

export const geographicRegions: GeographicRegion[] = [
  {
    id: "india",
    kind: "country",
    name: "India",
    localName: "भारत",
    slug: ["india"],
    governanceBranch: "administrative",
    dataStatus: "source-backed-pilot",
    summary:
      "National civic directory spanning 28 states, 8 Union Territories, administrative units, and parallel rural and urban local-government structures.",
    center: { lat: 22.9734, lng: 78.6569 },
    directRecordIds: [
      "tender-cppp-roadworks",
      "project-pmgsy-road-discovery",
      "complaint-nhai-highway",
      "complaint-cpgrams",
      "complaint-rail-madad",
      "complaint-umang-service-discovery",
      "source-lgd-india",
      "source-national-portal-india",
      "source-data-gov-in",
      "source-rbi-handbook-state-statistics",
      "source-cppp-eprocure",
      "source-pmgsy",
      "source-morth",
      "source-nhai",
      "source-cpgrams-pgportal",
      "source-rail-madad",
      "source-umang",
      "source-egramswaraj",
      "source-bhuvan",
      "source-openstreetmap"
    ],
    facts: [
      { label: "Top-level entities", value: "28 states and 8 Union Territories" },
      { label: "Directory model", value: "Administrative, rural local government, and urban local government" }
    ]
  },
  ...topLevelRegions,
  ...pilotRegions
];

export function getRegionBySlug(slug: string[]) {
  return geographicRegions.find((region) => region.slug.join("/") === slug.join("/"));
}

export function getRegionById(id: string) {
  return geographicRegions.find((region) => region.id === id);
}

export function getRegionChildren(regionId: string) {
  return geographicRegions.filter((region) => region.parentId === regionId);
}

export function getRelatedRegions(region: GeographicRegion) {
  return (region.relatedRegionIds ?? []).map(getRegionById).filter((candidate): candidate is GeographicRegion => Boolean(candidate));
}

export function getRegionAncestors(region: GeographicRegion) {
  const ancestors: GeographicRegion[] = [];
  let current = region.parentId ? getRegionById(region.parentId) : undefined;

  while (current) {
    ancestors.unshift(current);
    current = current.parentId ? getRegionById(current.parentId) : undefined;
  }

  return ancestors;
}

function getDescendantIds(regionId: string): string[] {
  const children = getRegionChildren(regionId);
  return children.flatMap((child) => [child.id, ...getDescendantIds(child.id)]);
}

export function getRegionRecords(region: GeographicRegion, records: NagrikRecord[] = getAllRecords()) {
  const regionIds = new Set([region.id, ...getDescendantIds(region.id)]);
  const recordIds = new Set(
    geographicRegions.filter((candidate) => regionIds.has(candidate.id)).flatMap((candidate) => candidate.directRecordIds)
  );
  return records.filter((record) => recordIds.has(record.id));
}

export function getPrimaryRegionForRecord(recordId: string) {
  return [...geographicRegions]
    .sort((a, b) => b.slug.length - a.slug.length)
    .find((region) => region.directRecordIds.includes(recordId));
}
