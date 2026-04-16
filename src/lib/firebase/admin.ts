import {
  buildGeneratedStatsViewModel,
  type GeneratedStatsSnapshot,
  type GeneratedStatsViewModel,
  type StoredGeneratedRecord
} from "@/lib/generated-stats/shared";
import type { Draw, GeneratedSet, GenerationStrategy } from "@/types/lotto";

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore";
const FIRESTORE_BASE_URL = "https://firestore.googleapis.com/v1";
const LOTTO_DRAWS_COLLECTION = "lotto_draws";
const GENERATED_RECORDS_COLLECTION = "generated_records";
const GENERATED_REQUESTS_COLLECTION = "generated_requests";
const GENERATED_ROUND_STATS_COLLECTION = "generated_round_stats";

type FirestorePrimitive =
  | string
  | number
  | boolean
  | null
  | FirestorePrimitive[]
  | { [key: string]: FirestorePrimitive };

interface GoogleAccessTokenCache {
  accessToken: string;
  expiresAt: number;
}

interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
}

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
}

export interface LottoDrawRecord extends Draw {
  source: "official-sync";
  syncedAt: string;
}

export interface GeneratedRecordSettlement {
  id: string;
  matchCount: number;
  bonusMatched: boolean;
  matchedRound: number;
  settledAt: string;
}

let tokenCache: GoogleAccessTokenCache | null = null;

function normalizeEnvValue(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function getOptionalEnv(name: string) {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    return undefined;
  }

  return normalizeEnvValue(value);
}

function getEnv(name: string): string {
  const value = getOptionalEnv(name);

  if (!value) {
    throw new Error(`${name} is required for Firestore admin access.`);
  }

  return value;
}

function inferProjectIdFromServiceAccountEmail(email?: string) {
  if (!email) {
    return undefined;
  }

  const match = email.match(/@([^.]+)\.iam\.gserviceaccount\.com$/);
  return match?.[1];
}

function getConfiguredFirestoreProjectId() {
  return (
    getOptionalEnv("FIREBASE_ADMIN_PROJECT_ID") ||
    getOptionalEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID") ||
    inferProjectIdFromServiceAccountEmail(getOptionalEnv("FIREBASE_SERVICE_ACCOUNT_EMAIL"))
  );
}

export function hasFirestoreAdminEnv() {
  return Boolean(
    getOptionalEnv("FIREBASE_SERVICE_ACCOUNT_EMAIL") &&
      getOptionalEnv("FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY") &&
      getConfiguredFirestoreProjectId()
  );
}

export function hasFirestorePublicEnv() {
  return Boolean(
    getConfiguredFirestoreProjectId() && getOptionalEnv("NEXT_PUBLIC_FIREBASE_API_KEY")
  );
}

function getFirestoreAdminConfig() {
  return {
    projectId: getConfiguredFirestoreProjectId() || getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    clientEmail: getEnv("FIREBASE_SERVICE_ACCOUNT_EMAIL"),
    privateKey: getEnv("FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n")
  };
}

function toBase64Url(value: ArrayBuffer | Uint8Array | string) {
  const buffer =
    typeof value === "string"
      ? Buffer.from(value, "utf8")
      : value instanceof Uint8Array
        ? Buffer.from(value)
        : Buffer.from(value);

  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function parsePemPrivateKey(privateKey: string) {
  const normalized = privateKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s+/g, "");

  return Buffer.from(normalized, "base64");
}

async function signServiceAccountJwt(clientEmail: string, privateKey: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 3600;
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: clientEmail,
    scope: FIRESTORE_SCOPE,
    aud: GOOGLE_OAUTH_TOKEN_URL,
    iat: issuedAt,
    exp: expiresAt
  };

  const headerPart = toBase64Url(JSON.stringify(header));
  const payloadPart = toBase64Url(JSON.stringify(payload));
  const signingInput = `${headerPart}.${payloadPart}`;

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    parsePemPrivateKey(privateKey),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, Buffer.from(signingInput, "utf8"));
  return `${signingInput}.${toBase64Url(signature)}`;
}

export async function getFirestoreAdminAccessToken() {
  const now = Date.now();

  if (tokenCache && tokenCache.expiresAt > now + 30_000) {
    return tokenCache.accessToken;
  }

  const { clientEmail, privateKey } = getFirestoreAdminConfig();
  const assertion = await signServiceAccountJwt(clientEmail, privateKey);

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });

  if (!response.ok) {
    throw new Error(`Google OAuth token request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!payload.access_token || !payload.expires_in) {
    throw new Error("Google OAuth token response did not contain an access token.");
  }

  tokenCache = {
    accessToken: payload.access_token,
    expiresAt: now + payload.expires_in * 1000
  };

  return payload.access_token;
}

function toFirestoreValue(value: FirestorePrimitive): FirestoreValue {
  if (value === null) {
    return { nullValue: null };
  }

  if (typeof value === "string") {
    return { stringValue: value };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return { integerValue: String(value) };
    }

    return { doubleValue: value };
  }

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) => toFirestoreValue(item))
      }
    };
  }

  return {
    mapValue: {
      fields: Object.fromEntries(Object.entries(value).map(([key, entryValue]) => [key, toFirestoreValue(entryValue)]))
    }
  };
}

function fromFirestoreValue(value?: FirestoreValue): FirestorePrimitive {
  if (!value) {
    return null;
  }

  if ("stringValue" in value && value.stringValue !== undefined) {
    return value.stringValue;
  }

  if ("integerValue" in value && value.integerValue !== undefined) {
    return Number(value.integerValue);
  }

  if ("doubleValue" in value && value.doubleValue !== undefined) {
    return value.doubleValue;
  }

  if ("booleanValue" in value && value.booleanValue !== undefined) {
    return value.booleanValue;
  }

  if ("timestampValue" in value && value.timestampValue !== undefined) {
    return value.timestampValue;
  }

  if ("nullValue" in value) {
    return null;
  }

  if ("arrayValue" in value) {
    return (value.arrayValue?.values ?? []).map((entry) => fromFirestoreValue(entry));
  }

  if ("mapValue" in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue?.fields ?? {}).map(([key, entry]) => [key, fromFirestoreValue(entry)])
    );
  }

  return null;
}

async function firestoreAdminFetch(path: string, init: RequestInit = {}) {
  const { projectId } = getFirestoreAdminConfig();
  const accessToken = await getFirestoreAdminAccessToken();
  return fetch(`${FIRESTORE_BASE_URL}/projects/${projectId}/databases/(default)/documents${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });
}

async function firestoreAdminRequest(path: string, init: RequestInit = {}) {
  const response = await firestoreAdminFetch(path, init);

  if (!response.ok) {
    throw new Error(`Firestore admin request failed with status ${response.status}.`);
  }

  return response;
}

export function toLottoDrawRecord(draw: Draw, syncedAt = new Date().toISOString()): LottoDrawRecord {
  return {
    ...draw,
    source: "official-sync",
    syncedAt
  };
}

export function getLottoDrawDocumentId(round: number) {
  return String(round);
}

function recordToFirestoreFields(record: LottoDrawRecord) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, toFirestoreValue(value as FirestorePrimitive)])
  );
}

function parseDrawDocument(document: FirestoreDocument): LottoDrawRecord {
  const fields = Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [key, fromFirestoreValue(value)])
  ) as unknown as LottoDrawRecord;

  return {
    id: Number(fields.id),
    round: Number(fields.round),
    drawDate: String(fields.drawDate),
    numbers: (fields.numbers as number[]).map(Number),
    bonus: Number(fields.bonus),
    totalPrize: fields.totalPrize == null ? null : Number(fields.totalPrize),
    firstPrize: fields.firstPrize == null ? null : Number(fields.firstPrize),
    winnerCount: fields.winnerCount == null ? null : Number(fields.winnerCount),
    source: "official-sync",
    syncedAt: String(fields.syncedAt)
  };
}

async function firestorePublicFetch(path: string, init: RequestInit = {}) {
  const projectId = getConfiguredFirestoreProjectId() || getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  const apiKey = getEnv("NEXT_PUBLIC_FIREBASE_API_KEY");
  return fetch(`${FIRESTORE_BASE_URL}/projects/${projectId}/databases/(default)/documents${path}?key=${apiKey}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });
}

async function firestorePublicRequest(path: string, init: RequestInit = {}) {
  const response = await firestorePublicFetch(path, init);

  if (!response.ok) {
    throw new Error(`Firestore public request failed with status ${response.status}.`);
  }

  return response;
}

export async function getLatestStoredLottoDraw(): Promise<LottoDrawRecord | null> {
  const response = await firestoreAdminRequest(":runQuery", {
    method: "POST",
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: LOTTO_DRAWS_COLLECTION }],
        orderBy: [{ field: { fieldPath: "round" }, direction: "DESCENDING" }],
        limit: 1
      }
    })
  });

  const payload = (await response.json()) as Array<{ document?: FirestoreDocument }>;
  const document = payload.find((entry) => entry.document)?.document;

  return document ? parseDrawDocument(document) : null;
}

export async function getAllStoredLottoDraws(): Promise<LottoDrawRecord[]> {
  const response = await firestoreAdminRequest(":runQuery", {
    method: "POST",
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: LOTTO_DRAWS_COLLECTION }],
        orderBy: [{ field: { fieldPath: "round" }, direction: "DESCENDING" }]
      }
    })
  });

  const payload = (await response.json()) as Array<{ document?: FirestoreDocument }>;
  return payload
    .map((entry) => (entry.document ? parseDrawDocument(entry.document) : null))
    .filter((entry): entry is LottoDrawRecord => entry !== null);
}

export async function getAllPublicStoredLottoDraws(): Promise<LottoDrawRecord[]> {
  const response = await firestorePublicRequest(":runQuery", {
    method: "POST",
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: LOTTO_DRAWS_COLLECTION }],
        orderBy: [{ field: { fieldPath: "round" }, direction: "DESCENDING" }]
      }
    })
  });

  const payload = (await response.json()) as Array<{ document?: FirestoreDocument }>;
  return payload
    .map((entry) => (entry.document ? parseDrawDocument(entry.document) : null))
    .filter((entry): entry is LottoDrawRecord => entry !== null);
}

export async function upsertLottoDrawRecords(draws: Draw[]) {
  if (draws.length === 0) {
    return { written: 0 };
  }

  const { projectId } = getFirestoreAdminConfig();
  const accessToken = await getFirestoreAdminAccessToken();
  const syncedAt = new Date().toISOString();
  const chunks: Draw[][] = [];

  for (let index = 0; index < draws.length; index += 200) {
    chunks.push(draws.slice(index, index + 200));
  }

  for (const chunk of chunks) {
    const writes = chunk.map((draw) => {
      const record = toLottoDrawRecord(draw, syncedAt);

      return {
        update: {
          name: `projects/${projectId}/databases/(default)/documents/${LOTTO_DRAWS_COLLECTION}/${getLottoDrawDocumentId(draw.round)}`,
          fields: recordToFirestoreFields(record)
        }
      };
    });

    const response = await fetch(`${FIRESTORE_BASE_URL}/projects/${projectId}/databases/(default)/documents:commit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ writes })
    });

    if (!response.ok) {
      throw new Error(`Firestore draw commit failed with status ${response.status}: ${await response.text()}`);
    }
  }

  return { written: draws.length };
}

export async function getStoredDrawCount() {
  const response = await firestoreAdminRequest(`/${LOTTO_DRAWS_COLLECTION}?pageSize=1`, {
    method: "GET"
  });
  const payload = (await response.json()) as { documents?: FirestoreDocument[] };
  return Array.isArray(payload.documents) ? payload.documents.length : 0;
}

interface FirestoreGeneratedRecordDocument {
  id: string;
  name: string;
  numbers: number[];
  bonus: number | null;
  targetRound: number | null;
}

function toNumberOrNull(value: FirestorePrimitive | undefined) {
  return typeof value === "number" ? value : typeof value === "string" ? Number.parseInt(value, 10) : null;
}

function toNumberList(value: FirestorePrimitive | undefined) {
  return Array.isArray(value) ? value.filter((item): item is number => typeof item === "number") : [];
}

function toFiltersMap(value: FirestorePrimitive | undefined): StoredGeneratedRecord["filters"] {
  const filters = value && typeof value === "object" && !Array.isArray(value) ? value : {};

  return {
    fixedNumbers: toNumberList((filters as Record<string, FirestorePrimitive>).fixedNumbers),
    excludedNumbers: toNumberList((filters as Record<string, FirestorePrimitive>).excludedNumbers),
    oddEven:
      typeof (filters as Record<string, FirestorePrimitive>).oddEven === "string"
        ? ((filters as Record<string, FirestorePrimitive>).oddEven as string)
        : "any",
    sumMin: toNumberOrNull((filters as Record<string, FirestorePrimitive>).sumMin),
    sumMax: toNumberOrNull((filters as Record<string, FirestorePrimitive>).sumMax),
    allowConsecutive:
      typeof (filters as Record<string, FirestorePrimitive>).allowConsecutive === "boolean"
        ? ((filters as Record<string, FirestorePrimitive>).allowConsecutive as boolean)
        : true
  };
}

function parseGeneratedRecordDocument(document: FirestoreDocument): FirestoreGeneratedRecordDocument {
  const fields = Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [key, fromFirestoreValue(value)])
  ) as Record<string, FirestorePrimitive>;

  return {
    id: document.name.split("/").at(-1) ?? "",
    name: document.name,
    numbers: Array.isArray(fields.numbers) ? fields.numbers.map((value) => Number(value)) : [],
    bonus: fields.bonus == null ? null : Number(fields.bonus),
    targetRound: fields.targetRound == null ? null : Number(fields.targetRound)
  };
}

function parseStoredGeneratedRecordDocument(document: FirestoreDocument): StoredGeneratedRecord {
  const fields = Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [key, fromFirestoreValue(value)])
  ) as Record<string, FirestorePrimitive>;

  return {
    id: document.name.split("/").at(-1) ?? "",
    anonymousId: typeof fields.anonymousId === "string" ? fields.anonymousId : "",
    strategy: (typeof fields.strategy === "string" ? fields.strategy : "mixed") as GenerationStrategy,
    numbers: toNumberList(fields.numbers),
    bonus: toNumberOrNull(fields.bonus),
    reason: typeof fields.reason === "string" ? fields.reason : "",
    generatedAt: typeof fields.generatedAt === "string" ? fields.generatedAt : "",
    targetRound: toNumberOrNull(fields.targetRound),
    matchedRound: toNumberOrNull(fields.matchedRound),
    matchCount: toNumberOrNull(fields.matchCount),
    bonusMatched: fields.bonusMatched === true,
    settledAt: typeof fields.settledAt === "string" ? fields.settledAt : null,
    filters: toFiltersMap(fields.filters)
  };
}

function toObjectMap(value: FirestorePrimitive | undefined) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, FirestorePrimitive>)
    : {};
}

function toStringValue(value: FirestorePrimitive | undefined, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toBooleanValue(value: FirestorePrimitive | undefined, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function toStoredGeneratedRecordList(value: FirestorePrimitive | undefined): StoredGeneratedRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map<StoredGeneratedRecord | null>((entry) => {
      const record = toObjectMap(entry);

      if (!record.anonymousId || !record.strategy || !record.generatedAt) {
        return null;
      }

      return {
        id: toStringValue(record.id),
        anonymousId: toStringValue(record.anonymousId),
        strategy: toStringValue(record.strategy, "mixed") as GenerationStrategy,
        numbers: toNumberList(record.numbers),
        bonus: toNumberOrNull(record.bonus),
        reason: toStringValue(record.reason),
        generatedAt: toStringValue(record.generatedAt),
        targetRound: toNumberOrNull(record.targetRound),
        matchedRound: toNumberOrNull(record.matchedRound),
        matchCount: toNumberOrNull(record.matchCount),
        bonusMatched: toBooleanValue(record.bonusMatched),
        settledAt: typeof record.settledAt === "string" ? record.settledAt : null,
        filters: toFiltersMap(record.filters)
      } satisfies StoredGeneratedRecord;
    })
    .filter((entry): entry is StoredGeneratedRecord => entry !== null);
}

function toCurrentStrategyTotals(value: FirestorePrimitive | undefined): GeneratedStatsViewModel["currentStrategyTotals"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      const item = toObjectMap(entry);

      return {
        strategy: toStringValue(item.strategy, "mixed") as GenerationStrategy,
        totalGenerated: toNumberOrNull(item.totalGenerated) ?? 0,
        sharePercentage: toNumberOrNull(item.sharePercentage) ?? 0
      };
    })
    .filter((entry) => entry.totalGenerated > 0);
}

function toStrategyBoard(value: FirestorePrimitive | undefined): GeneratedStatsViewModel["strategyBoard"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    const item = toObjectMap(entry);

    return {
      strategy: toStringValue(item.strategy, "mixed") as GenerationStrategy,
      totalGenerated: toNumberOrNull(item.totalGenerated) ?? 0,
      bestMatch: toNumberOrNull(item.bestMatch) ?? 0,
      threePlusHits: toNumberOrNull(item.threePlusHits) ?? 0,
      fourPlusHits: toNumberOrNull(item.fourPlusHits) ?? 0,
      bonusHits: toNumberOrNull(item.bonusHits) ?? 0,
      averageMatch: toNumberOrNull(item.averageMatch) ?? 0,
      sharePercentage: toNumberOrNull(item.sharePercentage) ?? 0
    };
  });
}

function toNumberUsageSummaryList(value: FirestorePrimitive | undefined): GeneratedStatsViewModel["currentTopNumbers"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    const item = toObjectMap(entry);

    return {
      number: toNumberOrNull(item.number) ?? 0,
      count: toNumberOrNull(item.count) ?? 0,
      percentage: toNumberOrNull(item.percentage) ?? 0
    };
  });
}

function toMatchDistributionList(value: FirestorePrimitive | undefined): GeneratedStatsViewModel["matchDistribution"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    const item = toObjectMap(entry);

    return {
      label: toStringValue(item.label),
      count: toNumberOrNull(item.count) ?? 0,
      percentage: toNumberOrNull(item.percentage) ?? 0
    };
  });
}

function parseGeneratedRoundStatsDocument(document: FirestoreDocument): GeneratedStatsSnapshot {
  const fields = Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [key, fromFirestoreValue(value)])
  ) as Record<string, FirestorePrimitive>;
  const view = toObjectMap(fields.view);

  return {
    source: "aggregate",
    computedAt: typeof fields.computedAt === "string" ? fields.computedAt : null,
    sourceRecordCount: toNumberOrNull(fields.sourceRecordCount) ?? 0,
    view: {
      currentTargetRound: toNumberOrNull(view.currentTargetRound),
      latestEvaluatedRound: toNumberOrNull(view.latestEvaluatedRound),
      currentTotalGenerated: toNumberOrNull(view.currentTotalGenerated) ?? 0,
      threePlusHitCount: toNumberOrNull(view.threePlusHitCount) ?? 0,
      strategyBoard: toStrategyBoard(view.strategyBoard),
      currentStrategyTotals: toCurrentStrategyTotals(view.currentStrategyTotals),
      currentTopNumbers: toNumberUsageSummaryList(view.currentTopNumbers),
      matchDistribution: toMatchDistributionList(view.matchDistribution),
      recentRecords: toStoredGeneratedRecordList(view.recentRecords)
    }
  };
}

function sortStoredGeneratedRecordsByGeneratedAtDesc(records: StoredGeneratedRecord[]) {
  return [...records].sort((left, right) => {
    const leftTime = new Date(left.generatedAt).getTime();
    const rightTime = new Date(right.generatedAt).getTime();

    return rightTime - leftTime;
  });
}

export async function listUnsettledGeneratedRecordsForRound(round: number) {
  const response = await firestoreAdminRequest(":runQuery", {
    method: "POST",
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: GENERATED_RECORDS_COLLECTION }],
        where: {
          compositeFilter: {
            op: "AND",
            filters: [
              {
                fieldFilter: {
                  field: { fieldPath: "targetRound" },
                  op: "EQUAL",
                  value: { integerValue: String(round) }
                }
              },
              {
                unaryFilter: {
                  field: { fieldPath: "matchedRound" },
                  op: "IS_NULL"
                }
              }
            ]
          }
        }
      }
    })
  });

  const payload = (await response.json()) as Array<{ document?: FirestoreDocument }>;
  return payload
    .map((entry) => (entry.document ? parseGeneratedRecordDocument(entry.document) : null))
    .filter((entry): entry is FirestoreGeneratedRecordDocument => entry !== null);
}

export async function listGeneratedRecords(limit = 240): Promise<StoredGeneratedRecord[]> {
  if (!hasFirestoreAdminEnv() && !hasFirestorePublicEnv()) {
    return [];
  }

  return runGeneratedRecordsQuery({
    structuredQuery: {
      from: [{ collectionId: GENERATED_RECORDS_COLLECTION }],
      orderBy: [{ field: { fieldPath: "generatedAt" }, direction: "DESCENDING" }],
      limit
    }
  });
}

async function runGeneratedRecordsQuery(payloadRequest: Record<string, unknown>) {
  try {
    if (hasFirestoreAdminEnv()) {
      const response = await firestoreAdminRequest(":runQuery", {
        method: "POST",
        body: JSON.stringify(payloadRequest)
      });
      const payload = (await response.json()) as Array<{ document?: FirestoreDocument }>;
      return payload
        .map((entry) => (entry.document ? parseStoredGeneratedRecordDocument(entry.document) : null))
        .filter((entry): entry is StoredGeneratedRecord => entry !== null);
    }
  } catch (error) {
    if (!hasFirestorePublicEnv()) {
      throw error;
    }
  }

  if (!hasFirestorePublicEnv()) {
    return [];
  }

  const response = await firestorePublicRequest(":runQuery", {
    method: "POST",
    body: JSON.stringify(payloadRequest)
  });
  const payload = (await response.json()) as Array<{ document?: FirestoreDocument }>;
  return payload
    .map((entry) => (entry.document ? parseStoredGeneratedRecordDocument(entry.document) : null))
    .filter((entry): entry is StoredGeneratedRecord => entry !== null);
}

export async function listGeneratedRecordsForRound(round: number, limit?: number): Promise<StoredGeneratedRecord[]> {
  if (!Number.isInteger(round) || round < 1) {
    return [];
  }

  const structuredQuery: Record<string, unknown> = {
    from: [{ collectionId: GENERATED_RECORDS_COLLECTION }],
    where: {
      fieldFilter: {
        field: { fieldPath: "targetRound" },
        op: "EQUAL",
        value: { integerValue: String(round) }
      }
    }
  };

  if (typeof limit === "number" && limit > 0) {
    structuredQuery.limit = limit * 4;
  }

  const records = sortStoredGeneratedRecordsByGeneratedAtDesc(await runGeneratedRecordsQuery({ structuredQuery }));
  return typeof limit === "number" && limit > 0 ? records.slice(0, limit) : records;
}

export async function getGeneratedRoundStats(round: number): Promise<GeneratedStatsSnapshot | null> {
  if (!Number.isInteger(round) || round < 1) {
    return null;
  }

  if (!hasFirestoreAdminEnv() && !hasFirestorePublicEnv()) {
    return null;
  }

  const path = `/${GENERATED_ROUND_STATS_COLLECTION}/${encodeURIComponent(String(round))}`;

  try {
    if (hasFirestoreAdminEnv()) {
      const response = await firestoreAdminFetch(path, { method: "GET" });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Firestore generated round stats lookup failed with status ${response.status}.`);
      }

      return parseGeneratedRoundStatsDocument((await response.json()) as FirestoreDocument);
    }
  } catch (error) {
    if (!hasFirestorePublicEnv()) {
      throw error;
    }
  }

  if (!hasFirestorePublicEnv()) {
    return null;
  }

  const response = await firestorePublicFetch(path, { method: "GET" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Firestore generated round stats public lookup failed with status ${response.status}.`);
  }

  return parseGeneratedRoundStatsDocument((await response.json()) as FirestoreDocument);
}

async function patchFirestoreDocument(
  documentName: string,
  fields: Record<string, FirestorePrimitive>,
  updateMask: string[]
) {
  const accessToken = await getFirestoreAdminAccessToken();
  const query = updateMask.map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`).join("&");
  const response = await fetch(`${FIRESTORE_BASE_URL}/${documentName}?${query}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, toFirestoreValue(value)]))
    })
  });

  if (!response.ok) {
    throw new Error(`Firestore generated record patch failed with status ${response.status}.`);
  }
}

export async function settleGeneratedRecordsForDraw(draw: Draw) {
  const records = await listUnsettledGeneratedRecordsForRound(draw.round);

  if (records.length === 0) {
    return { settled: 0 };
  }

  const settledAt = new Date().toISOString();

  await Promise.all(
    records.map((record) => {
      const matchCount = record.numbers.filter((number) => draw.numbers.includes(number)).length;
      const bonusMatched =
        typeof record.bonus === "number" ? record.bonus === draw.bonus : record.numbers.includes(draw.bonus);

      return patchFirestoreDocument(
        record.name,
        {
          matchedRound: draw.round,
          matchCount,
          bonusMatched,
          settledAt
        },
        ["matchedRound", "matchCount", "bonusMatched", "settledAt"]
      );
    })
  );


  return { settled: records.length };
}

export interface CreateGeneratedRecordInput {
  anonymousId: string;
  strategy: string;
  numbers: number[];
  bonus: number | null;
  reason: string;
  generatedAt: string;
  targetRound: number | null;
  filters: Record<string, FirestorePrimitive>;
}

export interface SaveGeneratedRecordsInput {
  requestId: string;
  records: CreateGeneratedRecordInput[];
  responseSets: GeneratedSet[];
  latestDraw?: Draw | null;
}

interface PreparedGeneratedRecordWrite {
  recordId: string;
  fields: Record<string, FirestorePrimitive>;
}

export interface StoredGeneratedRequest {
  requestId: string;
  anonymousId: string;
  strategy: GenerationStrategy;
  targetRound: number | null;
  setCount: number;
  recordIds: string[];
  responseSets: GeneratedSet[];
  status: string;
  createdAt: string;
  committedAt: string | null;
}

export interface SaveGeneratedRecordsResult {
  requestId: string;
  written: number;
  cached: boolean;
  targetRound: number | null;
  recordIds: string[];
  responseSets: GeneratedSet[];
}

function buildGeneratedRecordId(requestId: string, setIndex: number) {
  return `${requestId}:${setIndex}`;
}

function toGeneratedSetList(value: FirestorePrimitive | undefined): GeneratedSet[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => (entry && typeof entry === "object" && !Array.isArray(entry) ? entry : null))
    .filter((entry): entry is Record<string, FirestorePrimitive> => entry !== null)
    .map((entry, index) => ({
      id: typeof entry.id === "string" ? entry.id : `generated-set-${index}`,
      strategy: (typeof entry.strategy === "string" ? entry.strategy : "mixed") as GenerationStrategy,
      numbers: toNumberList(entry.numbers),
      bonus: toNumberOrNull(entry.bonus) ?? undefined,
      reason: typeof entry.reason === "string" ? entry.reason : "",
      generatedAt: typeof entry.generatedAt === "string" ? entry.generatedAt : ""
    }));
}

function parseGeneratedRequestDocument(document: FirestoreDocument): StoredGeneratedRequest {
  const fields = Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [key, fromFirestoreValue(value)])
  ) as Record<string, FirestorePrimitive>;

  return {
    requestId: typeof fields.requestId === "string" ? fields.requestId : document.name.split("/").at(-1) ?? "",
    anonymousId: typeof fields.anonymousId === "string" ? fields.anonymousId : "",
    strategy: (typeof fields.strategy === "string" ? fields.strategy : "mixed") as GenerationStrategy,
    targetRound: toNumberOrNull(fields.targetRound),
    setCount: toNumberOrNull(fields.setCount) ?? 0,
    recordIds: Array.isArray(fields.recordIds)
      ? fields.recordIds.filter((entry): entry is string => typeof entry === "string")
      : [],
    responseSets: toGeneratedSetList(fields.responseSets),
    status: typeof fields.status === "string" ? fields.status : "committed",
    createdAt: typeof fields.createdAt === "string" ? fields.createdAt : "",
    committedAt: typeof fields.committedAt === "string" ? fields.committedAt : null
  };
}

export async function getGeneratedRequest(requestId: string): Promise<StoredGeneratedRequest | null> {
  if (!requestId || !hasFirestoreAdminEnv()) {
    return null;
  }

  const response = await firestoreAdminFetch(`/${GENERATED_REQUESTS_COLLECTION}/${encodeURIComponent(requestId)}`, {
    method: "GET"
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Firestore generated request lookup failed with status ${response.status}.`);
  }

  const document = (await response.json()) as FirestoreDocument;
  return parseGeneratedRequestDocument(document);
}

function buildGeneratedRecordWrites(
  requestId: string,
  records: CreateGeneratedRecordInput[],
  createdAt: string
): PreparedGeneratedRecordWrite[] {
  return records.map((record, index) => ({
    recordId: buildGeneratedRecordId(requestId, index),
    fields: {
      ...record,
      createdAt,
      createdSource: "generator",
      matchedRound: null,
      matchCount: null,
      bonusMatched: false,
      settledAt: null
    }
  }));
}

function buildGeneratedRequestFields(input: SaveGeneratedRecordsInput, recordIds: string[], committedAt: string) {
  const firstRecord = input.records[0];

  return {
    requestId: input.requestId,
    anonymousId: firstRecord?.anonymousId ?? "",
    strategy: firstRecord?.strategy ?? "mixed",
    targetRound: firstRecord?.targetRound ?? null,
    setCount: input.responseSets.length,
    recordIds,
    responseSets: input.responseSets.map((set) => ({
      id: set.id,
      strategy: set.strategy,
      numbers: set.numbers,
      bonus: set.bonus ?? null,
      reason: set.reason,
      generatedAt: set.generatedAt
    })),
    status: "committed",
    createdAt: committedAt,
    committedAt
  };
}

export async function saveGeneratedRoundStatsSnapshot(targetRound: number, snapshot: GeneratedStatsSnapshot) {
  if (!Number.isInteger(targetRound) || targetRound < 1) {
    return;
  }

  if (!hasFirestoreAdminEnv()) {
    throw new Error("Firestore generated round stats save requires admin credentials.");
  }

  const { projectId } = getFirestoreAdminConfig();
  const accessToken = await getFirestoreAdminAccessToken();

  const response = await fetch(`${FIRESTORE_BASE_URL}/projects/${projectId}/databases/(default)/documents:commit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: `projects/${projectId}/databases/(default)/documents/${GENERATED_ROUND_STATS_COLLECTION}/${targetRound}`,
            fields: Object.fromEntries(
              Object.entries({
                source: "aggregate",
                computedAt: snapshot.computedAt ?? new Date().toISOString(),
                sourceRecordCount: snapshot.sourceRecordCount,
                view: snapshot.view
              }).map(([key, value]) => [key, toFirestoreValue(value as FirestorePrimitive)])
            )
          }
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Firestore generated round stats save failed with status ${response.status}: ${await response.text()}`);
  }
}

function toSaveGeneratedRecordsResult(storedRequest: StoredGeneratedRequest, cached: boolean): SaveGeneratedRecordsResult {
  return {
    requestId: storedRequest.requestId,
    written: storedRequest.recordIds.length,
    cached,
    targetRound: storedRequest.targetRound,
    recordIds: storedRequest.recordIds,
    responseSets: storedRequest.responseSets
  };
}

async function saveGeneratedRecordsWithAdmin(
  input: SaveGeneratedRecordsInput,
  writes: PreparedGeneratedRecordWrite[],
  committedAt: string
) {
  const { projectId } = getFirestoreAdminConfig();
  const accessToken = await getFirestoreAdminAccessToken();
  const recordIds = writes.map((write) => write.recordId);
  const requestFields = buildGeneratedRequestFields(input, recordIds, committedAt);

  const response = await fetch(`${FIRESTORE_BASE_URL}/projects/${projectId}/databases/(default)/documents:commit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: `projects/${projectId}/databases/(default)/documents/${GENERATED_REQUESTS_COLLECTION}/${input.requestId}`,
            fields: Object.fromEntries(
              Object.entries(requestFields).map(([key, value]) => [key, toFirestoreValue(value)])
            )
          },
          currentDocument: {
            exists: false
          }
        },
        ...writes.map(({ recordId, fields }) => ({
          update: {
            name: `projects/${projectId}/databases/(default)/documents/${GENERATED_RECORDS_COLLECTION}/${recordId}`,
            fields: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, toFirestoreValue(value)]))
          },
          currentDocument: {
            exists: false
          }
        }))
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Firestore generated records save failed with status ${response.status}: ${await response.text()}`);
  }

  return {
    requestId: input.requestId,
    recordIds,
    targetRound: input.records[0]?.targetRound ?? null
  };
}

async function refreshGeneratedRoundStatsWithAdmin(
  targetRound: number,
  latestDraw: Draw | null,
  computedAt: string
) {
  if (!Number.isInteger(targetRound) || targetRound < 1) {
    return;
  }

  const [currentRecords, evaluatedRecords] = await Promise.all([
    listGeneratedRecordsForRound(targetRound),
    latestDraw ? listGeneratedRecordsForRound(latestDraw.round) : Promise.resolve([])
  ]);

  const allRecords = [...currentRecords, ...evaluatedRecords];
  const snapshot = {
    source: "aggregate" as const,
    computedAt,
    sourceRecordCount: allRecords.length,
    view: buildGeneratedStatsViewModel(allRecords, latestDraw, currentRecords.slice(0, 4))
  };

  await saveGeneratedRoundStatsSnapshot(targetRound, snapshot);
}

export async function saveGeneratedRecords(input: SaveGeneratedRecordsInput): Promise<SaveGeneratedRecordsResult> {
  if (input.records.length === 0) {
    return {
      requestId: input.requestId,
      written: 0,
      cached: false,
      targetRound: null,
      recordIds: [],
      responseSets: input.responseSets
    };
  }

  if (!hasFirestoreAdminEnv()) {
    throw new Error("Firestore generated records save requires admin credentials.");
  }

  const existing = await getGeneratedRequest(input.requestId);

  if (existing) {
    return toSaveGeneratedRecordsResult(existing, true);
  }

  const committedAt = new Date().toISOString();
  const writes = buildGeneratedRecordWrites(input.requestId, input.records, committedAt);

  try {
    const saved = await saveGeneratedRecordsWithAdmin(input, writes, committedAt);

    if (saved.targetRound && input.latestDraw) {
      try {
        await refreshGeneratedRoundStatsWithAdmin(saved.targetRound, input.latestDraw, committedAt);
      } catch (error) {
        console.warn("[generated-stats] failed to refresh round aggregate after save", error);
      }
    }

    return {
      requestId: saved.requestId,
      written: saved.recordIds.length,
      cached: false,
      targetRound: saved.targetRound,
      recordIds: saved.recordIds,
      responseSets: input.responseSets
    };
  } catch (error) {
    const duplicate = await getGeneratedRequest(input.requestId);

    if (duplicate) {
      return toSaveGeneratedRecordsResult(duplicate, true);
    }

    throw error;
  }
}
