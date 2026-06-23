import type { EntityKind, NagrikRecord, SourcePriority } from "@/lib/types";

export type AccessMethod = "api" | "bulk-download" | "html-public-page" | "document-parse" | "manual-seed";
export type AutomationMode = "official-first" | "controlled-browser" | "manual-review-required";
export type SourceHealthStatus = "healthy" | "watch" | "stale" | "not-run";

export interface SourceCatalogEntry {
  id: string;
  name: string;
  homepageUrl: string;
  priority: SourcePriority;
  owner: string;
  geography: string;
  entityKinds: EntityKind[];
  access: {
    method: AccessMethod;
    refreshCadence: "daily" | "weekly" | "monthly" | "quarterly";
    requiresAuth: boolean;
    automationMode: AutomationMode;
  };
  legal: {
    licenseNote: string;
    termsUrl?: string;
    robotsTxtUrl?: string;
    redistribution: "link-only" | "metadata-ok" | "dataset-license-required";
  };
  quality: {
    expectedFreshnessDays: number;
    confidence: "high" | "medium" | "low";
  };
  notes: string;
}

export interface SourceRunEvent {
  sourceId: string;
  adapterName: string;
  fetchedAt: string;
  recordCount: number;
  warningCount: number;
  status: SourceHealthStatus;
}

export interface SourceHealth {
  sourceId: string;
  sourceName: string;
  status: SourceHealthStatus;
  lastSuccessfulRun?: string;
  daysSinceLastSuccess?: number;
  expectedFreshnessDays: number;
  recordCount: number;
  warnings: string[];
}

export interface AdapterRunContext {
  asOf: string;
}

export interface AdapterRunResult {
  source: SourceCatalogEntry;
  records: NagrikRecord[];
  warnings: string[];
  event: SourceRunEvent;
}

export interface SourceAdapter {
  id: string;
  sourceId: string;
  run(context: AdapterRunContext): AdapterRunResult;
}

export interface ValidationIssue {
  recordId: string;
  severity: "error" | "warning";
  message: string;
}

export interface IngestionReport {
  generatedAt: string;
  records: NagrikRecord[];
  health: SourceHealth[];
  issues: ValidationIssue[];
  events: SourceRunEvent[];
}
