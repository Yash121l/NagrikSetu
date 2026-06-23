import type { NagrikRecord } from "./types";

export function getRecordWarnings(record: NagrikRecord) {
  const warnings: string[] = [];
  if (record.confidence !== "high") warnings.push(`${record.confidence} confidence: verify against source before action.`);
  if (!record.location) warnings.push("No coordinates available yet.");
  if (record.summary.toLowerCase().includes("not publicly available")) {
    warnings.push("Some fields are missing from public seed data.");
  }
  return warnings;
}
