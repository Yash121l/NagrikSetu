import { NextRequest, NextResponse } from "next/server";
import { buildSearchResponse } from "@/lib/search";
import type { EntityKind } from "@/lib/types";

const allowedKinds = new Set<EntityKind | "all">(["all", "office", "officer", "project", "road", "tender", "complaint", "source"]);

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const kindParam = request.nextUrl.searchParams.get("kind") ?? "all";
  const kind = allowedKinds.has(kindParam as EntityKind | "all") ? (kindParam as EntityKind | "all") : "all";

  if (!query) {
    return NextResponse.json({ error: "Missing required query parameter: q" }, { status: 400 });
  }

  return NextResponse.json(buildSearchResponse(query, kind), {
    headers: {
      "Cache-Control": "public, max-age=30, stale-while-revalidate=120"
    }
  });
}
