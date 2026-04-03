"use client";

import type { GeneratedSet, GenerationFilters, GenerationStrategy } from "@/types/lotto";

const ANONYMOUS_ID_STORAGE_KEY = "lotto-lab-anonymous-id";
const GENERATED_RECORDS_COLLECTION = "generated_records";

function normalizeFilters(filters?: GenerationFilters) {
  return {
    fixedNumbers: [...(filters?.fixedNumbers ?? [])].sort((left, right) => left - right),
    excludedNumbers: [...(filters?.excludedNumbers ?? [])].sort((left, right) => left - right),
    oddEven: filters?.oddEven ?? "any",
    sumMin: filters?.sumMin ?? null,
    sumMax: filters?.sumMax ?? null,
    allowConsecutive: filters?.allowConsecutive ?? true
  };
}

function createAnonymousId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getAnonymousId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const nextValue = createAnonymousId();
  window.localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, nextValue);
  return nextValue;
}

interface RecordGeneratedSetsInput {
  strategy: GenerationStrategy;
  sets: GeneratedSet[];
  filters?: GenerationFilters;
  targetRound?: number | null;
}

export async function recordGeneratedSets({ strategy, sets, filters, targetRound }: RecordGeneratedSetsInput) {
  if (typeof window === "undefined" || sets.length === 0) {
    return;
  }

  const anonymousId = getAnonymousId();
  const normalizedFilters = normalizeFilters(filters);

  const payload = sets.map((set) => ({
    anonymousId,
    strategy,
    numbers: set.numbers,
    bonus: set.bonus ?? null,
    reason: set.reason,
    generatedAt: set.generatedAt,
    targetRound: targetRound ?? null,
    filters: normalizedFilters
  }));

  try {
    const response = await fetch("/api/v1/generated-records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Failed to record generated sets:", response.status);
    }
  } catch (error) {
    console.error("Error recording generated sets:", error);
  }
}
