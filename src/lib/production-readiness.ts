import { sourceCatalog } from "@/ingestion/source-catalog";
import type { SourceCatalogEntry } from "@/ingestion/types";

export type ReadinessStatus = "pass" | "watch" | "blocked";

export interface ReadinessCheck {
  id: string;
  title: string;
  status: ReadinessStatus;
  detail: string;
  requiredBeforeProduction: boolean;
}

export interface ProductionReadinessReport {
  generatedAt: string;
  checks: ReadinessCheck[];
  summary: Record<ReadinessStatus, number>;
}

export const productionEnvironmentVariables = [
  "NEXT_PUBLIC_SITE_URL",
  "NAGRIKSETU_ADMIN_TOKEN",
  "NAGRIKSETU_DATABASE_URL",
  "NAGRIKSETU_RAW_SNAPSHOT_URI",
  "NAGRIKSETU_RAW_SNAPSHOT_BUCKET"
] as const;

type ReadinessEnv = Record<string, string | undefined>;

function isHttpsUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function sourceMetadataIssues(source: SourceCatalogEntry) {
  const issues: string[] = [];

  if (!isHttpsUrl(source.homepageUrl)) issues.push("homepageUrl must be HTTPS");
  if (source.legal.termsUrl && !isHttpsUrl(source.legal.termsUrl)) issues.push("termsUrl must be HTTPS");
  if (source.legal.robotsTxtUrl && !isHttpsUrl(source.legal.robotsTxtUrl)) issues.push("robotsTxtUrl must be HTTPS");
  if (source.legal.licenseNote.trim().length < 12) issues.push("licenseNote is too short");
  if (source.quality.expectedFreshnessDays <= 0) issues.push("expectedFreshnessDays must be positive");
  if (source.access.requiresAuth && source.access.automationMode !== "manual-review-required") {
    issues.push("auth-required source must be manual review");
  }

  return issues;
}

function buildSummary(checks: ReadinessCheck[]): Record<ReadinessStatus, number> {
  return checks.reduce(
    (summary, check) => ({
      ...summary,
      [check.status]: summary[check.status] + 1
    }),
    { pass: 0, watch: 0, blocked: 0 }
  );
}

export function buildProductionReadinessReport(
  env: ReadinessEnv = process.env,
  sources: SourceCatalogEntry[] = sourceCatalog,
  generatedAt = new Date().toISOString()
): ProductionReadinessReport {
  const sourceIssues = sources.flatMap((source) =>
    sourceMetadataIssues(source).map((issue) => `${source.id}: ${issue}`)
  );
  const missingRobots = sources.filter(
    (source) => source.access.automationMode !== "manual-review-required" && !source.legal.robotsTxtUrl
  );
  const datasetLicenseSources = sources.filter((source) => source.legal.redistribution === "dataset-license-required");
  const manualReviewSources = sources.filter((source) => source.access.automationMode === "manual-review-required");
  const hasAdminToken = (env.NAGRIKSETU_ADMIN_TOKEN?.length ?? 0) >= 24;
  const hasDatabaseUrl = /^postgres(ql)?:\/\//.test(env.NAGRIKSETU_DATABASE_URL ?? "");
  const hasRawSnapshotStore = Boolean(env.NAGRIKSETU_RAW_SNAPSHOT_URI || env.NAGRIKSETU_RAW_SNAPSHOT_BUCKET);

  const checks: ReadinessCheck[] = [
    {
      id: "site-url",
      title: "Public site URL",
      status: isHttpsUrl(env.NEXT_PUBLIC_SITE_URL) ? "pass" : "blocked",
      detail: "NEXT_PUBLIC_SITE_URL must be set to the production HTTPS origin for sitemap and canonical links.",
      requiredBeforeProduction: true
    },
    {
      id: "admin-token",
      title: "Moderation admin token",
      status: hasAdminToken ? "pass" : "blocked",
      detail: "NAGRIKSETU_ADMIN_TOKEN must be a strong secret before moderation routes are exposed.",
      requiredBeforeProduction: true
    },
    {
      id: "database-url",
      title: "PostgreSQL database",
      status: hasDatabaseUrl ? "pass" : "blocked",
      detail: "NAGRIKSETU_DATABASE_URL must point at the PostgreSQL/PostGIS store that implements the repository contract.",
      requiredBeforeProduction: true
    },
    {
      id: "raw-snapshot-store",
      title: "Raw snapshot storage",
      status: hasRawSnapshotStore ? "pass" : "blocked",
      detail: "Configure NAGRIKSETU_RAW_SNAPSHOT_URI or NAGRIKSETU_RAW_SNAPSHOT_BUCKET before running live connectors.",
      requiredBeforeProduction: true
    },
    {
      id: "source-metadata",
      title: "Source legal metadata",
      status: sourceIssues.length === 0 ? "pass" : "blocked",
      detail:
        sourceIssues.length === 0
          ? `${sources.length} catalog sources have HTTPS URLs, license notes, and freshness windows.`
          : sourceIssues.join("; "),
      requiredBeforeProduction: true
    },
    {
      id: "robots-review",
      title: "Robots and terms review",
      status: missingRobots.length === 0 ? "pass" : "watch",
      detail:
        missingRobots.length === 0
          ? "Automated sources list robots.txt URLs for preflight checks."
          : `${missingRobots.map((source) => source.id).join(", ")} need explicit robots/terms review before automation.`,
      requiredBeforeProduction: true
    },
    {
      id: "license-review",
      title: "Dataset license queue",
      status: datasetLicenseSources.length === 0 ? "pass" : "watch",
      detail:
        datasetLicenseSources.length === 0
          ? "No catalog sources require dataset-level redistribution review."
          : `${datasetLicenseSources.map((source) => source.id).join(", ")} require dataset-level license review before redistribution.`,
      requiredBeforeProduction: true
    },
    {
      id: "human-review",
      title: "Human review workflow",
      status: hasAdminToken && manualReviewSources.length > 0 ? "pass" : "blocked",
      detail: `${manualReviewSources.length} sources are explicitly marked manual-review-required; moderation routes require the admin token.`,
      requiredBeforeProduction: true
    }
  ];

  return {
    generatedAt,
    checks,
    summary: buildSummary(checks)
  };
}
