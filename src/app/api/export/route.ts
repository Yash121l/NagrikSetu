import { NextRequest, NextResponse } from "next/server";
import { getAllRecords } from "@/data/repository";
import { searchRecords } from "@/lib/search";
import {
  applyWorkspaceControls,
  buildWorkspaceMatches,
  parseWorkspaceFilters,
  serializeRecordsForCsv
} from "@/lib/workspace";

const exportRecordLimit = 1000;

export function GET(request: NextRequest) {
  const generatedAt = new Date().toISOString();
  const format = request.nextUrl.searchParams.get("format") === "json" ? "json" : "csv";
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const filters = parseWorkspaceFilters(request.nextUrl.searchParams);
  const baseMatches = query ? searchRecords(query, filters.kind) : buildWorkspaceMatches(getAllRecords());
  const records = applyWorkspaceControls(baseMatches, filters).slice(0, exportRecordLimit).map((match) => match.record);

  if (format === "json") {
    return NextResponse.json(
      {
        generatedAt,
        caveats: [
          "Export preserves source attribution, freshness, license notes, and confidence for review.",
          "NagrikSetu routes users to official portals and does not claim completeness where source coverage is incomplete.",
          `Exports are capped at ${exportRecordLimit} records per request until the production repository supports streaming.`
        ],
        filters,
        records
      },
      {
        headers: {
          "Content-Disposition": `attachment; filename="nagriksetu-records-${generatedAt.slice(0, 10)}.json"`,
          "Cache-Control": "no-store"
        }
      }
    );
  }

  return new NextResponse(serializeRecordsForCsv(records, generatedAt), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nagriksetu-records-${generatedAt.slice(0, 10)}.csv"`,
      "Cache-Control": "no-store"
    }
  });
}
