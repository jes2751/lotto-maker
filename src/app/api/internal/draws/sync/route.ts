import { NextResponse } from "next/server";

import { syncFirestoreDraws } from "@/lib/data/firestore-draw-sync";

function isAuthorized(request: Request) {
  const secret = process.env.DRAW_SYNC_SECRET;

  if (!secret) {
    throw new Error("DRAW_SYNC_SECRET is required.");
  }

  const headerValue = request.headers.get("authorization") ?? request.headers.get("x-sync-token");

  if (!headerValue) {
    return false;
  }

  if (headerValue === secret) {
    return true;
  }

  return headerValue === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "A valid sync token is required."
          }
        },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const forceSeedAll = url.searchParams.get("mode") === "seed";
    const result = await syncFirestoreDraws({ forceSeedAll });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DRAW_SYNC_FAILED",
          message: error instanceof Error ? error.message : "Unexpected sync error."
        }
      },
      { status: 500 }
    );
  }
}
