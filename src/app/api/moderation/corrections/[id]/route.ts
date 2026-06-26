import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { CorrectionInputError, updateCorrectionModeration } from "@/lib/corrections";

export const runtime = "nodejs";

interface CorrectionModerationRouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: CorrectionModerationRouteProps) {
  if (!isAdminRequest(request.headers)) {
    return NextResponse.json({ error: "Admin token required" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  try {
    const result = await updateCorrectionModeration(id, body);
    if (!result) {
      return NextResponse.json({ error: "Correction not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "updated", correction: result.submission }, { status: 200 });
  } catch (error) {
    if (error instanceof CorrectionInputError) {
      return NextResponse.json({ error: "Invalid moderation update", issues: error.issues }, { status: 400 });
    }
    console.error("Failed to update correction moderation", error);
    return NextResponse.json({ error: "Correction could not be updated" }, { status: 500 });
  }
}
