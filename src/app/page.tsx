import { SearchShell } from "@/components/SearchShell";
import { seedRecords } from "@/lib/seed-data";

export default function Home() {
  return <SearchShell initialRecords={seedRecords} />;
}
