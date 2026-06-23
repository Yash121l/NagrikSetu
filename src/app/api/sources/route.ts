import { NextResponse } from "next/server";
import { sourceCatalog } from "@/ingestion/source-catalog";
import { getSourceHealth } from "@/data/repository";

export function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    sources: sourceCatalog,
    health: getSourceHealth()
  });
}
