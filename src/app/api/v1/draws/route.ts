import { jsonSuccess, parseInteger } from "@/lib/http";
import { drawRepository } from "@/lib/lotto";
import { clamp } from "@/lib/lotto/shared";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = clamp(parseInteger(searchParams.get("limit"), 10), 1, 20);
  const offset = Math.max(parseInteger(searchParams.get("offset"), 0), 0);
  const result = await drawRepository.list({ limit, offset });

  return jsonSuccess(result);
}
