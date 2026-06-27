import { runDemoIngestion } from "@/ingestion/run-demo";
import { buildRecordStats, type NagrikRepository } from "./repository-contract";
import type { NagrikRecord } from "@/lib/types";

const report = runDemoIngestion();

export const localRepository: NagrikRepository = {
  mode: "local-fixture",
  getAllRecords() {
    return report.records;
  },
  getSourceHealth() {
    return report.health;
  },
  getIngestionReport() {
    return report;
  },
  getRecordStats(records: NagrikRecord[] = report.records) {
    return buildRecordStats(records);
  }
};
