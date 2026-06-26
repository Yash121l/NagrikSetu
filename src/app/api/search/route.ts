import { NextRequest, NextResponse } from "next/server";
import { buildSearchResponse } from "@/lib/search";
import { parseWorkspaceFilters } from "@/lib/workspace";
import type { EntityKind } from "@/lib/types";

const allowedKinds = new Set<EntityKind | "all">(["all", "office", "officer", "project", "road", "tender", "complaint", "source"]);

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const kindParam = request.nextUrl.searchParams.get("kind") ?? "all";
  const kind = allowedKinds.has(kindParam as EntityKind | "all") ? (kindParam as EntityKind | "all") : "all";
  const filters = parseWorkspaceFilters(request.nextUrl.searchParams);
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 8);

  if (!query) {
    return NextResponse.json({ error: "Missing required query parameter: q" }, { status: 400 });
  }

  return NextResponse.json(buildSearchResponse(query, kind, { filters, limit: Number.isFinite(limit) ? Math.min(limit, 100) : 8 }), {
    headers: {
      "Cache-Control": "public, max-age=30, stale-while-revalidate=120"
    }
  });
}
