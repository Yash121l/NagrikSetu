export type Confidence = "high" | "medium" | "low";

export type EntityKind =
  | "office"
  | "officer"
  | "project"
  | "road"
  | "tender"
  | "complaint"
  | "source";

export type SourcePriority = "official" | "open-government" | "permissive-third-party";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Provenance {
  sourceName: string;
  sourceUrl: string;
  lastChecked: string;
  priority: SourcePriority;
  licenseNote: string;
}

export interface CivicEntity {
  id: string;
  kind: EntityKind;
  title: string;
  summary: string;
  department: string;
  jurisdiction: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  issueTags: string[];
  languageTags: string[];
  location?: GeoPoint;
  confidence: Confidence;
  updatedAt: string;
  provenance: Provenance;
}

export interface OfficeEntity extends CivicEntity {
  kind: "office";
  services: string[];
  parentOffice?: string;
}

export interface TenderEntity extends CivicEntity {
  kind: "tender";
  tenderNumber: string;
  closingDate: string;
  estimatedValue?: string;
  documentUrl: string;
}

export interface ComplaintEntity extends CivicEntity {
  kind: "complaint";
  portalUrl: string;
  escalation: string[];
}

export interface ProjectEntity extends CivicEntity {
  kind: "project" | "road";
  contractor?: string;
  status: string;
  budget?: string;
  expectedCompletion?: string;
  supervisingOffice: string;
}

export interface SourceEntity extends CivicEntity {
  kind: "source";
}

export type NagrikRecord = OfficeEntity | TenderEntity | ComplaintEntity | ProjectEntity | SourceEntity;

export interface SearchRequest {
  query: string;
  kind?: EntityKind | "all";
  language?: "en" | "hi";
}

export type WorkspaceViewMode = "cards" | "table";
export type WorkspaceSortKey =
  | "relevance"
  | "title"
  | "kind"
  | "jurisdiction"
  | "department"
  | "confidence"
  | "lastChecked"
  | "updatedAt";
export type WorkspaceSortDirection = "asc" | "desc";
export type WorkspaceFreshnessFilter = "all" | "fresh" | "stale";
export type WorkspaceLocationFilter = "all" | "with-location" | "missing-location";

export interface WorkspaceFilters {
  kind: EntityKind | "all";
  confidence: Confidence | "all";
  sourcePriority: SourcePriority | "all";
  freshness: WorkspaceFreshnessFilter;
  location: WorkspaceLocationFilter;
  language: string;
  department: string;
  sortBy: WorkspaceSortKey;
  sortDirection: WorkspaceSortDirection;
}

export interface SearchMatch {
  record: NagrikRecord;
  score: number;
  reasons: string[];
}

export interface SearchResponse {
  query: string;
  generatedAt: string;
  matches: SearchMatch[];
  caveats: string[];
}
