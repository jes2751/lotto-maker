import { getGeneratedRequest, saveGeneratedRecords, getGeneratedRoundStats } from "@/lib/firebase/admin";
import { jsonError, jsonSuccess } from "@/lib/http";
import { generationService } from "@/lib/lotto";
import { drawRepository } from "@/lib/lotto/repository";
import { isValidStrategy } from "@/lib/lotto/shared";
import { calculateCrowdOverlap, getOverlapWarning } from "@/lib/lotto/overlap";
import type { GenerationFilters, OddEvenFilter } from "@/types/lotto";

interface GenerateRequestBody {
  strategy?: string;
  count?: number;
  anonymous_id?: string;
  request_id?: string;
  filters?: {
    fixed_numbers?: number[];
    excluded_numbers?: number[];
    odd_even?: OddEvenFilter;
    sum_min?: number | null;
    sum_max?: number | null;
    allow_consecutive?: boolean;
  };
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 50;
const rateLimitCache = new Map<string, RateLimitEntry>();
const validOddEvenFilters: OddEvenFilter[] = ["any", "balanced", "odd-heavy", "even-heavy"];

let cachedTopNumbers: { round: number; numbers: any[]; expiresAt: number } | null = null;

function normalizeRequestId(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (normalized.length === 0 || normalized.length > 128) {
    return null;
  }

  return normalized;
}

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
    return jsonError("RATE_LIMIT_EXCEEDED", "Too many generate requests.", 429);
  }

  let body: GenerateRequestBody;

  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return jsonError("VALIDATION_ERROR", "Invalid JSON payload.");
  }

  const strategy = body.strategy ?? "mixed";
  const count = typeof body.count === "number" ? body.count : 1;
  const filters = normalizeFilters(body.filters);

  if (!isValidStrategy(strategy)) {
    return jsonError("VALIDATION_ERROR", "Invalid generation strategy.");
  }

  if (!Number.isInteger(count) || count < 1 || count > 5) {
    return jsonError("VALIDATION_ERROR", "count must be between 1 and 5.");
  }

  if ((filters.fixedNumbers?.length ?? 0) > 5) {
    return jsonError("VALIDATION_ERROR", "You can pin up to 5 fixed numbers.");
  }

  if ((filters.excludedNumbers?.length ?? 0) > 35) {
    return jsonError("VALIDATION_ERROR", "You can exclude up to 35 numbers.");
  }

  if ((filters.fixedNumbers ?? []).some((value) => (filters.excludedNumbers ?? []).includes(value))) {
    return jsonError("VALIDATION_ERROR", "Fixed numbers and excluded numbers cannot overlap.");
  }

  if (typeof filters.sumMin === "number" && typeof filters.sumMax === "number" && filters.sumMin > filters.sumMax) {
    return jsonError("VALIDATION_ERROR", "sum_min cannot be greater than sum_max.");
  }

  try {
    const anonymousId = typeof body.anonymous_id === "string" ? body.anonymous_id.trim() : "";
    const requestId = normalizeRequestId(body.request_id);
    const latestDraw = await drawRepository.getLatest();
    const targetRound = latestDraw ? latestDraw.round + 1 : null;

    if (anonymousId && requestId) {
      const existingRequest = await getGeneratedRequest(requestId);

      if (existingRequest) {
        return jsonSuccess({
          sets: existingRequest.responseSets,
          statsRecorded: true,
          targetRound: existingRequest.targetRound,
          requestId
        });
      }
    }

    let topNumbers: any[] = [];
    if (targetRound) {
      if (cachedTopNumbers && cachedTopNumbers.round === targetRound && cachedTopNumbers.expiresAt > Date.now()) {
        topNumbers = cachedTopNumbers.numbers;
      } else {
        try {
          const stats = await getGeneratedRoundStats(targetRound);
          topNumbers = stats?.view.currentTopNumbers ?? [];
          cachedTopNumbers = {
            round: targetRound,
            numbers: topNumbers,
            expiresAt: Date.now() + 5 * 60 * 1000 // Cache for 5 minutes
          };
        } catch (err) {
          console.warn("[generated-stats] failed to fetch round stats for overlap calculation", err);
        }
      }
    }

    const rawSets = await generationService.generate({
      strategy,
      count,
      filters
    });

    const sets = rawSets.map(set => {
      if (topNumbers.length === 0) return set;
      const { score, level } = getOverlapWarning(calculateCrowdOverlap(set.numbers, topNumbers));
      return {
        ...set,
        overlapScore: score,
        overlapLevel: level
      };
    });

    if (anonymousId && requestId) {
      const recordFilters = {
        fixedNumbers: filters.fixedNumbers ?? [],
        excludedNumbers: filters.excludedNumbers ?? [],
        oddEven: filters.oddEven ?? "any",
        sumMin: filters.sumMin ?? null,
        sumMax: filters.sumMax ?? null,
        allowConsecutive: filters.allowConsecutive ?? true
      };

      try {
        const saveResult = await saveGeneratedRecords({
          requestId,
          latestDraw,
          responseSets: sets,
          records: sets.map((set) => ({
            anonymousId,
            strategy,
            numbers: set.numbers,
            bonus: set.bonus ?? null,
            reason: set.reason,
            generatedAt: set.generatedAt,
            targetRound,
            filters: recordFilters
          }))
        });

        return jsonSuccess({
          sets: saveResult.responseSets,
          statsRecorded: true,
          targetRound: saveResult.targetRound,
          requestId
        });
      } catch (recordError) {
        console.error("Failed to record generated stats during generate route:", recordError);
      }
    }

    return jsonSuccess({ sets, statsRecorded: false, targetRound, requestId });
  } catch (error) {
    return jsonError(
      "GENERATION_ERROR",
      error instanceof Error ? error.message : "Failed to generate lottery numbers."
    );
  }
}
