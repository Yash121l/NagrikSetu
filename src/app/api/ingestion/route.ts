import { NextResponse } from "next/server";
import { getIngestionReport } from "@/data/repository";

export function GET() {
  const report = getIngestionReport();
  return NextResponse.json({
    generatedAt: report.generatedAt,
    recordCount: report.records.length,
    health: report.health,
    events: report.events,
    issues: report.issues
  });
}
