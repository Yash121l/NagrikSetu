import { sourceCatalog } from "../src/ingestion/source-catalog";
import { checkSources } from "../src/ingestion/source-health-check";

const failOnWatch = process.argv.includes("--fail-on-watch");

async function main() {
  const checkedAt = new Date().toISOString();
  const results = await checkSources(sourceCatalog, { checkedAt });
  const summary = {
    checkedAt,
    totalSources: results.length,
    reachableHomepages: results.filter((result) => result.homepage.status === "reachable").length,
    blockedHomepages: results.filter((result) => result.homepage.status === "blocked").length,
    watchHomepages: results.filter((result) => result.homepage.status === "watch").length
  };

  console.log(JSON.stringify({ summary, results }, null, 2));

  if (failOnWatch && results.some((result) => result.homepage.status !== "reachable")) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
