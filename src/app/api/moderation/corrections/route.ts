import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listCorrectionQueue } from "@/lib/corrections";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request.headers)) {
    return NextResponse.json({ error: "Admin token required" }, { status: 401 });
  }

  const queue = await listCorrectionQueue();
  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      corrections: queue.map(({ submission }) => submission)
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
