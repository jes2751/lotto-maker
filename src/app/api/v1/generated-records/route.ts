import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "DEPRECATED_ROUTE",
        message: "Use /api/v1/generate for generated record writes."
      }
    },
    { status: 410 }
  );
}
