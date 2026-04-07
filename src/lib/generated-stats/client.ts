"use client";

import type { GeneratedSet, GenerationFilters, GenerationStrategy } from "@/types/lotto";

const ANONYMOUS_ID_STORAGE_KEY = "lotto-lab-anonymous-id";
const GENERATED_RECORDS_COLLECTION = "generated_records";

interface GeneratedRecordDocument {
  anonymousId: string;
  strategy: GenerationStrategy;
  numbers: number[];
  bonus: number | null;
  reason: string;
  generatedAt: string;
  targetRound: number | null;
  filters: ReturnType<typeof normalizeFilters>;
  createdAt: string;
  createdSource: "generator";
  matchedRound: null;
  matchCount: null;
  bonusMatched: false;
  settledAt: null;
}

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

function buildGeneratedRecordDocuments({
  anonymousId,
  strategy,
  sets,
  filters,
  targetRound
}: {
  anonymousId: string;
  strategy: GenerationStrategy;
  sets: GeneratedSet[];
  filters?: GenerationFilters;
  targetRound?: number | null;
}): GeneratedRecordDocument[] {
  const normalizedFilters = normalizeFilters(filters);
  const createdAt = new Date().toISOString();

  return sets.map((set) => ({
    anonymousId,
    strategy,
    numbers: set.numbers,
    bonus: set.bonus ?? null,
    reason: set.reason,
    generatedAt: set.generatedAt,
    targetRound: targetRound ?? null,
    filters: normalizedFilters,
    createdAt,
    createdSource: "generator",
    matchedRound: null,
    matchCount: null,
    bonusMatched: false,
    settledAt: null
  }));
}

async function recordGeneratedSetsDirectly(records: GeneratedRecordDocument[]) {
  const [{ collection, doc, writeBatch }, { getFirebaseDb }] = await Promise.all([
    import("firebase/firestore"),
    import("@/lib/firebase/client")
  ]);

  const db = getFirebaseDb();
  const collectionRef = collection(db, GENERATED_RECORDS_COLLECTION);
  const batch = writeBatch(db);

  for (const record of records) {
    batch.set(doc(collectionRef), record);
  }

  await batch.commit();
}

async function recordGeneratedSetsViaApi(records: GeneratedRecordDocument[]) {
  const response = await fetch("/api/v1/generated-records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(records)
  });

  if (!response.ok) {
    throw new Error(`Failed to record generated sets via API: ${response.status}`);
  }
}

export async function recordGeneratedSets({ strategy, sets, filters, targetRound }: RecordGeneratedSetsInput) {
  if (typeof window === "undefined" || sets.length === 0) {
    return;
  }

  const anonymousId = getAnonymousId();
  const records = buildGeneratedRecordDocuments({
    anonymousId,
    strategy,
    sets,
    filters,
    targetRound
  });

  try {
    await recordGeneratedSetsDirectly(records);
    return;
  } catch (directWriteError) {
    console.warn("Direct generated-record write failed. Falling back to API route.", directWriteError);
  }

  try {
    await recordGeneratedSetsViaApi(records);
  } catch (apiError) {
    console.error("Error recording generated sets:", apiError);
    throw apiError;
  }
}
