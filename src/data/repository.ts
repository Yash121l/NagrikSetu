import { localRepository } from "./local-repository";
import type { NagrikRepository } from "./repository-contract";
import type { NagrikRecord } from "@/lib/types";

export const activeRepository: NagrikRepository = localRepository;

export function getAllRecords(): NagrikRecord[] {
  return activeRepository.getAllRecords();
}

export function getSourceHealth() {
  return activeRepository.getSourceHealth();
}

export function getIngestionReport() {
  return activeRepository.getIngestionReport();
}

export function getRecordStats(records = activeRepository.getAllRecords()) {
  return activeRepository.getRecordStats(records);
}
