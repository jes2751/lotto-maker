import { NextResponse } from "next/server";

import {
  getLatestStoredLottoDraw,
  hasFirestoreAdminEnv,
  hasFirestorePublicEnv
} from "@/lib/firebase/admin";

function isAuthorized(request: Request) {
  const secret = process.env.DRAW_SYNC_SECRET;

  if (!secret) {
    throw new Error("DRAW_SYNC_SECRET is required.");
  }

  const headerValue = request.headers.get("authorization") ?? request.headers.get("x-sync-token");

  if (!headerValue) {
    return false;
  }

  return headerValue === secret || headerValue === `Bearer ${secret}`;
}

function summarizePrivateKey(rawValue: string | undefined) {
  const value = rawValue ?? "";

  return {
    present: value.length > 0,
    startsWithQuote: value.startsWith('"') || value.startsWith("'"),
    endsWithQuote: value.endsWith('"') || value.endsWith("'"),
    containsBeginMarker: value.includes("BEGIN PRIVATE KEY"),
    containsEscapedNewlines: value.includes("\\n"),
    containsLiteralNewlines: value.includes("\n"),
    trimmedLength: value.trim().length
  };
}

export async function GET(request: Request) {
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

    const rawPrivateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;
    let adminRead: { ok: boolean; latestRound: number | null; error: string | null } = {
      ok: false,
      latestRound: null,
      error: null
    };

    try {
      const latest = await getLatestStoredLottoDraw();
      adminRead = {
        ok: true,
        latestRound: latest?.round ?? null,
        error: null
      };
    } catch (error) {
      adminRead = {
        ok: false,
        latestRound: null,
        error: error instanceof Error ? `${error.name}: ${error.message}` : "Unknown error"
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        runtimeEnv: {
          hasAdminEnv: hasFirestoreAdminEnv(),
          hasPublicEnv: hasFirestorePublicEnv(),
          hasProjectId: Boolean(process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
          hasServiceAccountEmail: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL),
          privateKey: summarizePrivateKey(rawPrivateKey)
        },
        adminRead
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FIRESTORE_DEBUG_FAILED",
          message: error instanceof Error ? error.message : "Unexpected debug error."
        }
      },
      { status: 500 }
    );
  }
}
