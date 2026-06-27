import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { lgdFixtureRows, normalizeLgdRows } from "../src/ingestion/lgd";

const outDir = path.join(process.cwd(), "data", "normalized");
const outPath = path.join(outDir, "lgd-regions.json");
const checkOnly = process.argv.includes("--check");

async function readIfExists(filePath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return "";
    }
    throw error;
  }
}

function argumentValue(name: string) {
  const prefix = `${name}=`;
  const match = process.argv.find((argument) => argument.startsWith(prefix));
  return match?.slice(prefix.length);
}

function generatedAtForRows() {
  return lgdFixtureRows.map((row) => row.lastChecked).sort((a, b) => b.localeCompare(a))[0] ?? new Date().toISOString().slice(0, 10);
}

async function main() {
  const result = normalizeLgdRows(lgdFixtureRows);
  const generatedAt = argumentValue("--generated-at") ?? generatedAtForRows();
  const json = `${JSON.stringify(
    {
      generatedAt,
      source: {
        sourceName: "Local Government Directory",
        sourceUrl: "https://lgdirectory.gov.in/",
        licenseNote: "Use public directory downloads for identifiers and hierarchy; preserve LGD attribution and extraction dates."
      },
      warnings: result.warnings,
      regions: result.regions
    },
    null,
    2
  )}\n`;

  if (checkOnly) {
    const existing = await readIfExists(outPath);
    if (existing !== json) {
      throw new Error("Generated LGD geography artifact is stale. Run `pnpm run ingest:lgd`.");
    }
    console.log(`Validated ${result.regions.length} LGD fixture regions.`);
    return;
  }

  await mkdir(outDir, { recursive: true });
  await writeFile(outPath, json, "utf8");
  console.log(`Wrote ${result.regions.length} LGD fixture regions to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
