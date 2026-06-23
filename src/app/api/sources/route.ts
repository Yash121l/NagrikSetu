import { NextResponse } from "next/server";
import { sourceInventory } from "@/lib/seed-data";

export function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    sources: sourceInventory
  });
}
