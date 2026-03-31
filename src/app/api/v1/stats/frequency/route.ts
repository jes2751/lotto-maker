import { jsonError, jsonSuccess } from "@/lib/http";
import { computeFrequencyStats, drawRepository } from "@/lib/lotto";
import { clamp } from "@/lib/lotto/shared";
import type { StatsPeriod } from "@/types/lotto";

function isValidPeriod(value: string): value is StatsPeriod {
  return value === "all" || value === "recent_10";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "all";
  const type = searchParams.get("type") ?? "main";
  const limit = clamp(Number.parseInt(searchParams.get("limit") ?? "10", 10) || 10, 5, 15);

  if (!isValidPeriod(period)) {
    return jsonError("VALIDATION_ERROR", "지원하지 않는 기간입니다.");
  }

  if (type !== "main") {
    return jsonError("VALIDATION_ERROR", "v1에서는 메인 번호 통계만 지원합니다.");
  }

  const draws = await drawRepository.getAll();
  const stats = computeFrequencyStats(draws, period).slice(0, limit);

  return jsonSuccess({
    period,
    type,
    limit,
    totalDraws: period === "recent_10" ? Math.min(draws.length, 10) : draws.length,
    stats
  });
}
