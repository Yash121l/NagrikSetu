import { NextRequest, NextResponse } from "next/server";
import { CorrectionInputError, submitCorrection } from "@/lib/corrections";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  try {
    const { submission } = await submitCorrection(body);
    return NextResponse.json(
      {
        status: "accepted",
        correctionId: submission.id,
        recordId: submission.recordId,
        note: "Correction saved to the Draft 3 moderation queue."
      },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof CorrectionInputError) {
      return NextResponse.json({ error: "Invalid correction submission", issues: error.issues }, { status: 400 });
    }

    console.error("Failed to persist correction submission", error);
    return NextResponse.json({ error: "Correction could not be saved" }, { status: 500 });
  }
}
