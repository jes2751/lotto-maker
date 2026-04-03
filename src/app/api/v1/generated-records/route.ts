import { NextResponse } from "next/server";
import { saveGeneratedRecords, CreateGeneratedRecordInput } from "@/lib/firebase/admin";

// In-Memory Rate Limiting
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitWindow = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 50;

  const current = rateLimitMap.get(ip);
  if (!current || current.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + limitWindow });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown-ip";

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const payload = await request.json();

    if (!Array.isArray(payload) || payload.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const records = payload as CreateGeneratedRecordInput[];

    await saveGeneratedRecords(records);

    return NextResponse.json({ success: true, written: records.length });
  } catch (error) {
    console.error("Failed to save generated records:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
