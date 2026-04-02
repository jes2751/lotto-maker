import { jsonError, jsonSuccess } from "@/lib/http";
import { generationService } from "@/lib/lotto";
import { isValidStrategy } from "@/lib/lotto/shared";
import type { GenerationFilters, OddEvenFilter } from "@/types/lotto";

interface GenerateRequestBody {
  strategy?: string;
  count?: number;
  filters?: {
    fixed_numbers?: number[];
    excluded_numbers?: number[];
    odd_even?: OddEvenFilter;
    sum_min?: number | null;
    sum_max?: number | null;
    allow_consecutive?: boolean;
  };
}

const validOddEvenFilters: OddEvenFilter[] = ["any", "balanced", "odd-heavy", "even-heavy"];

function normalizeNumberList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((item): item is number => Number.isInteger(item) && item >= 1 && item <= 45))].sort(
    (left, right) => left - right
  );
}

function normalizeFilters(body: GenerateRequestBody["filters"]): GenerationFilters {
  return {
    fixedNumbers: normalizeNumberList(body?.fixed_numbers),
    excludedNumbers: normalizeNumberList(body?.excluded_numbers),
    oddEven: validOddEvenFilters.includes(body?.odd_even ?? "any") ? (body?.odd_even ?? "any") : "any",
    sumMin: typeof body?.sum_min === "number" ? body.sum_min : null,
    sumMax: typeof body?.sum_max === "number" ? body.sum_max : null,
    allowConsecutive: typeof body?.allow_consecutive === "boolean" ? body.allow_consecutive : true
  };
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 50;
const rateLimitCache = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  if (rateLimitCache.size > 1000) {
    for (const [key, entry] of rateLimitCache.entries()) {
      if (entry.resetAt < now) {
        rateLimitCache.delete(key);
      }
    }
  }

  const entry = rateLimitCache.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitCache.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  if (isRateLimited(ip)) {
    return jsonError("RATE_LIMIT_EXCEEDED", "생성 한도를 초과했습니다. 잠시 후 다시 시도해주세요.", 429);
  }

  let body: GenerateRequestBody;

  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return jsonError("VALIDATION_ERROR", "JSON 본문을 읽을 수 없습니다.");
  }

  const strategy = body.strategy ?? "mixed";
  const count = typeof body.count === "number" ? body.count : 1;
  const filters = normalizeFilters(body.filters);

  if (!isValidStrategy(strategy)) {
    return jsonError("VALIDATION_ERROR", "지원하지 않는 생성 전략입니다.");
  }

  if (!Number.isInteger(count) || count < 1 || count > 5) {
    return jsonError("VALIDATION_ERROR", "count는 1 이상 5 이하여야 합니다.");
  }

  if ((filters.fixedNumbers?.length ?? 0) > 5) {
    return jsonError("VALIDATION_ERROR", "고정수는 최대 5개까지 선택할 수 있습니다.");
  }

  if ((filters.excludedNumbers?.length ?? 0) > 35) {
    return jsonError("VALIDATION_ERROR", "제외수는 최대 35개까지 선택할 수 있습니다.");
  }

  if ((filters.fixedNumbers ?? []).some((value) => (filters.excludedNumbers ?? []).includes(value))) {
    return jsonError("VALIDATION_ERROR", "고정수와 제외수에는 같은 번호를 넣을 수 없습니다.");
  }

  if (typeof filters.sumMin === "number" && typeof filters.sumMax === "number" && filters.sumMin > filters.sumMax) {
    return jsonError("VALIDATION_ERROR", "합계 최소값은 최대값보다 클 수 없습니다.");
  }

  try {
    const sets = await generationService.generate({
      strategy,
      count,
      filters
    });

    return jsonSuccess({ sets });
  } catch (error) {
    return jsonError("GENERATION_ERROR", error instanceof Error ? error.message : "추천 번호를 생성하지 못했습니다.");
  }
}
