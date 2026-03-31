import { NextResponse } from "next/server";

export function jsonSuccess<T>(data: T) {
  return NextResponse.json({ success: true, data });
}

export function jsonError(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message
      }
    },
    { status }
  );
}

export function parseInteger(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}
