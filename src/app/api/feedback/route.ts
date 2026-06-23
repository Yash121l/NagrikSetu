import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.recordId || !body?.message) {
    return NextResponse.json({ error: "recordId and message are required" }, { status: 400 });
  }

  return NextResponse.json(
    {
      status: "accepted",
      note: "Feedback capture is stubbed in Draft 2. Wire this endpoint to a moderation queue before public launch."
    },
    { status: 202 }
  );
}
