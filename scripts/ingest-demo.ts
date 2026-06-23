import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { runDemoIngestion } from "../src/ingestion/run-demo";

const outDir = path.join(process.cwd(), "data", "normalized");
const recordsPath = path.join(outDir, "nagrik-records.json");
const healthPath = path.join(outDir, "source-health.json");
const checkOnly = process.argv.includes("--check");

async function readIfExists(filePath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function main() {
  const report = runDemoIngestion();
  const recordsJson = `${JSON.stringify(report.records, null, 2)}\n`;
  const healthJson = `${JSON.stringify(
    {
      generatedAt: report.generatedAt,
      health: report.health,
      events: report.events,
      issues: report.issues
    },
    null,
    2
  )}\n`;

  if (checkOnly) {
    const existingRecords = await readIfExists(recordsPath);
    const existingHealth = await readIfExists(healthPath);
    if (existingRecords !== recordsJson || existingHealth !== healthJson) {
      throw new Error("Generated ingestion artifacts are stale. Run `pnpm run ingest:demo`.");
    }
    console.log(`Validated ${report.records.length} records and ${report.health.length} source-health rows.`);
    return;
  }

  await mkdir(outDir, { recursive: true });
  await writeFile(recordsPath, recordsJson);
  await writeFile(healthPath, healthJson);
  console.log(`Wrote ${report.records.length} normalized records to ${recordsPath}`);
  console.log(`Wrote ${report.health.length} source-health rows to ${healthPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
