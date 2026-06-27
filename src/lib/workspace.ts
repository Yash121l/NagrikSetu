import type {
  Confidence,
  EntityKind,
  NagrikRecord,
  SearchMatch,
  SourcePriority,
  WorkspaceFilters,
  WorkspaceSortDirection
} from "@/lib/types";

export const defaultWorkspaceFilters: WorkspaceFilters = {
  kind: "all",
  confidence: "all",
  sourcePriority: "all",
  freshness: "all",
  location: "all",
  language: "all",
  department: "all",
  sortBy: "relevance",
  sortDirection: "desc"
};

export const freshnessWindowDays = 45;

const dayMs = 24 * 60 * 60 * 1000;
const confidenceRank: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };

export function getDaysSinceLastChecked(record: NagrikRecord, now = new Date()) {
  const checkedAt = Date.parse(record.provenance.lastChecked);
  if (Number.isNaN(checkedAt)) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor((now.getTime() - checkedAt) / dayMs));
}

export function getFreshnessStatus(record: NagrikRecord, now = new Date()) {
  return getDaysSinceLastChecked(record, now) > freshnessWindowDays ? "stale" : "fresh";
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function compareStrings(a: string, b: string, direction: WorkspaceSortDirection) {
  const result = a.localeCompare(b);
  return direction === "asc" ? result : -result;
}

function compareNumbers(a: number, b: number, direction: WorkspaceSortDirection) {
  const result = a - b;
  return direction === "asc" ? result : -result;
}

export function buildWorkspaceMatches(records: NagrikRecord[]): SearchMatch[] {
  return records.map((record) => ({ record, score: 0, reasons: [] }));
}

export function filterWorkspaceMatches(matches: SearchMatch[], filters: WorkspaceFilters, now = new Date()) {
  return matches.filter(({ record }) => {
    if (filters.kind !== "all" && record.kind !== filters.kind) return false;
    if (filters.confidence !== "all" && record.confidence !== filters.confidence) return false;
    if (filters.sourcePriority !== "all" && record.provenance.priority !== filters.sourcePriority) return false;
    if (filters.freshness !== "all" && getFreshnessStatus(record, now) !== filters.freshness) return false;
    if (filters.location === "with-location" && !record.location) return false;
    if (filters.location === "missing-location" && record.location) return false;
    if (filters.language !== "all" && !record.languageTags.map(normalize).includes(normalize(filters.language))) return false;
    if (filters.department !== "all" && normalize(record.department) !== normalize(filters.department)) return false;
    return true;
  });
}

export function sortWorkspaceMatches(matches: SearchMatch[], filters: WorkspaceFilters) {
  return [...matches].sort((a, b) => {
    const direction = filters.sortDirection;
    if (filters.sortBy === "relevance") {
      const scoreResult = compareNumbers(a.score, b.score, direction);
      if (scoreResult !== 0) return scoreResult;
      return a.record.title.localeCompare(b.record.title);
    }
    if (filters.sortBy === "confidence") {
      const rankResult = compareNumbers(confidenceRank[a.record.confidence], confidenceRank[b.record.confidence], direction);
      if (rankResult !== 0) return rankResult;
      return a.record.title.localeCompare(b.record.title);
    }
    if (filters.sortBy === "lastChecked") {
      const checkedResult = compareStrings(a.record.provenance.lastChecked, b.record.provenance.lastChecked, direction);
      if (checkedResult !== 0) return checkedResult;
      return a.record.title.localeCompare(b.record.title);
    }
    if (filters.sortBy === "updatedAt") {
      const updatedResult = compareStrings(a.record.updatedAt, b.record.updatedAt, direction);
      if (updatedResult !== 0) return updatedResult;
      return a.record.title.localeCompare(b.record.title);
    }
    return compareStrings(String(a.record[filters.sortBy]), String(b.record[filters.sortBy]), direction);
  });
}

export function applyWorkspaceControls(matches: SearchMatch[], filters: WorkspaceFilters, now = new Date()) {
  return sortWorkspaceMatches(filterWorkspaceMatches(matches, filters, now), filters);
}

export function getWorkspaceFilterOptions(records: NagrikRecord[]) {
  return {
    departments: Array.from(new Set(records.map((record) => record.department))).sort((a, b) => a.localeCompare(b)),
    languages: Array.from(new Set(records.flatMap((record) => record.languageTags))).sort((a, b) => a.localeCompare(b))
  };
}

export function parseWorkspaceFilters(params: URLSearchParams): WorkspaceFilters {
  const allowedKinds = new Set<EntityKind | "all">(["all", "office", "officer", "project", "road", "tender", "complaint", "source"]);
  const allowedConfidence = new Set<Confidence | "all">(["all", "high", "medium", "low"]);
  const allowedPriority = new Set<SourcePriority | "all">(["all", "official", "open-government", "permissive-third-party"]);
  const allowedFreshness = new Set<WorkspaceFilters["freshness"]>(["all", "fresh", "stale"]);
  const allowedLocation = new Set<WorkspaceFilters["location"]>(["all", "with-location", "missing-location"]);
  const allowedSortBy = new Set<WorkspaceFilters["sortBy"]>([
    "relevance",
    "title",
    "kind",
    "jurisdiction",
    "department",
    "confidence",
    "lastChecked",
    "updatedAt"
  ]);
  const allowedDirection = new Set<WorkspaceFilters["sortDirection"]>(["asc", "desc"]);

  const kind = params.get("kind") ?? defaultWorkspaceFilters.kind;
  const confidence = params.get("confidence") ?? defaultWorkspaceFilters.confidence;
  const sourcePriority = params.get("sourcePriority") ?? defaultWorkspaceFilters.sourcePriority;
  const freshness = params.get("freshness") ?? defaultWorkspaceFilters.freshness;
  const location = params.get("location") ?? defaultWorkspaceFilters.location;
  const sortBy = params.get("sortBy") ?? defaultWorkspaceFilters.sortBy;
  const sortDirection = params.get("sortDirection") ?? defaultWorkspaceFilters.sortDirection;

  return {
    kind: allowedKinds.has(kind as EntityKind | "all") ? (kind as EntityKind | "all") : defaultWorkspaceFilters.kind,
    confidence: allowedConfidence.has(confidence as Confidence | "all")
      ? (confidence as Confidence | "all")
      : defaultWorkspaceFilters.confidence,
    sourcePriority: allowedPriority.has(sourcePriority as SourcePriority | "all")
      ? (sourcePriority as SourcePriority | "all")
      : defaultWorkspaceFilters.sourcePriority,
    freshness: allowedFreshness.has(freshness as WorkspaceFilters["freshness"])
      ? (freshness as WorkspaceFilters["freshness"])
      : defaultWorkspaceFilters.freshness,
    location: allowedLocation.has(location as WorkspaceFilters["location"])
      ? (location as WorkspaceFilters["location"])
      : defaultWorkspaceFilters.location,
    language: params.get("language")?.trim() || defaultWorkspaceFilters.language,
    department: params.get("department")?.trim() || defaultWorkspaceFilters.department,
    sortBy: allowedSortBy.has(sortBy as WorkspaceFilters["sortBy"])
      ? (sortBy as WorkspaceFilters["sortBy"])
      : defaultWorkspaceFilters.sortBy,
    sortDirection: allowedDirection.has(sortDirection as WorkspaceFilters["sortDirection"])
      ? (sortDirection as WorkspaceFilters["sortDirection"])
      : defaultWorkspaceFilters.sortDirection
  };
}

function csvCell(value: string | number | undefined) {
  const text = value === undefined ? "" : String(value);
  const neutralized = /^[=+\-@]/.test(text.trimStart()) ? `'${text}` : text;
  return `"${neutralized.replaceAll('"', '""')}"`;
}

export function serializeRecordsForCsv(records: NagrikRecord[], generatedAt: string) {
  const headers = [
    "id",
    "kind",
    "title",
    "department",
    "jurisdiction",
    "confidence",
    "updatedAt",
    "sourceName",
    "sourceUrl",
    "lastChecked",
    "sourcePriority",
    "licenseNote",
    "languageTags",
    "issueTags",
    "latitude",
    "longitude",
    "generatedAt"
  ];
  const rows = records.map((record) => [
    record.id,
    record.kind,
    record.title,
    record.department,
    record.jurisdiction,
    record.confidence,
    record.updatedAt,
    record.provenance.sourceName,
    record.provenance.sourceUrl,
    record.provenance.lastChecked,
    record.provenance.priority,
    record.provenance.licenseNote,
    record.languageTags.join("; "),
    record.issueTags.join("; "),
    record.location?.lat,
    record.location?.lng,
    generatedAt
  ]);

  return [headers.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n") + "\n";
}
