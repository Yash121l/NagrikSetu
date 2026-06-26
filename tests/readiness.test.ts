import { describe, expect, it } from "vitest";
import {
  buildProductionReadinessReport,
  productionEnvironmentVariables
} from "@/lib/production-readiness";

const productionEnv = {
  NEXT_PUBLIC_SITE_URL: "https://nagriksetu.example.org",
  NAGRIKSETU_ADMIN_TOKEN: "a-production-token-long-enough-for-review",
  NAGRIKSETU_DATABASE_URL: "postgresql://nagriksetu:secret@db.example.org:5432/nagriksetu",
  NAGRIKSETU_RAW_SNAPSHOT_URI: "s3://nagriksetu-raw-snapshots"
};

describe("production readiness", () => {
  it("documents the required deployment environment", () => {
    expect(productionEnvironmentVariables).toContain("NEXT_PUBLIC_SITE_URL");
    expect(productionEnvironmentVariables).toContain("NAGRIKSETU_ADMIN_TOKEN");
    expect(productionEnvironmentVariables).toContain("NAGRIKSETU_DATABASE_URL");
    expect(productionEnvironmentVariables).toContain("NAGRIKSETU_RAW_SNAPSHOT_URI");
  });

  it("blocks production when required environment is absent", () => {
    const report = buildProductionReadinessReport({}, undefined, "2026-06-26T00:00:00.000Z");

    expect(report.summary.blocked).toBeGreaterThan(0);
    expect(report.checks.find((check) => check.id === "database-url")?.status).toBe("blocked");
    expect(report.checks.find((check) => check.id === "raw-snapshot-store")?.status).toBe("blocked");
  });

  it("passes required deployment gates while preserving source-review watches", () => {
    const report = buildProductionReadinessReport(productionEnv, undefined, "2026-06-26T00:00:00.000Z");

    expect(report.summary.blocked).toBe(0);
    expect(report.checks.find((check) => check.id === "site-url")?.status).toBe("pass");
    expect(report.checks.find((check) => check.id === "admin-token")?.status).toBe("pass");
    expect(report.checks.find((check) => check.id === "license-review")?.status).toBe("watch");
  });
});
