import { buildProductionReadinessReport } from "../src/lib/production-readiness";

const strict = process.argv.includes("--strict");
const json = process.argv.includes("--json");
const report = buildProductionReadinessReport();

if (json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Production readiness report (${report.generatedAt})`);
  console.log(`pass=${report.summary.pass} watch=${report.summary.watch} blocked=${report.summary.blocked}`);
  for (const check of report.checks) {
    console.log(`[${check.status}] ${check.title}: ${check.detail}`);
  }
  if (!strict && report.summary.blocked > 0) {
    console.log("Run with --strict in deployment CI to fail when production-required checks are blocked.");
  }
}

if (strict && report.checks.some((check) => check.requiredBeforeProduction && check.status === "blocked")) {
  process.exitCode = 1;
}
