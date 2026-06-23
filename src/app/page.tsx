import { SearchShell } from "@/components/SearchShell";
import { getAllRecords, getRecordStats, getSourceHealth } from "@/data/repository";

export default function Home() {
  return <SearchShell initialRecords={getAllRecords()} stats={getRecordStats()} sourceHealth={getSourceHealth()} />;
}
