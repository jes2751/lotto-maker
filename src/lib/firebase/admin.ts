import type { Draw } from "@/types/lotto";

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore";
const FIRESTORE_BASE_URL = "https://firestore.googleapis.com/v1";
const LOTTO_DRAWS_COLLECTION = "lotto_draws";
const GENERATED_RECORDS_COLLECTION = "generated_records";
const SITE_METRICS_COLLECTION = "site_metrics";

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

export interface DailyVisitMetric {
  dateKey: string;
  count: number;
  updatedAt: string | null;
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

export function hasFirestoreAdminEnv() {
  return Boolean(
    getOptionalEnv("FIREBASE_SERVICE_ACCOUNT_EMAIL") &&
      getOptionalEnv("FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY") &&
      (getOptionalEnv("FIREBASE_ADMIN_PROJECT_ID") || getOptionalEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"))
  );
}

export function hasFirestorePublicEnv() {
  return Boolean(
    (getOptionalEnv("FIREBASE_ADMIN_PROJECT_ID") || getOptionalEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID")) &&
      getOptionalEnv("NEXT_PUBLIC_FIREBASE_API_KEY")
  );
}

function getFirestoreAdminConfig() {
  return {
    projectId: getOptionalEnv("FIREBASE_ADMIN_PROJECT_ID") || getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
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

async function firestoreAdminRequest(path: string, init: RequestInit = {}) {
  const { projectId } = getFirestoreAdminConfig();
  const accessToken = await getFirestoreAdminAccessToken();
  const response = await fetch(`${FIRESTORE_BASE_URL}/projects/${projectId}/databases/(default)/documents${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });

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

async function firestorePublicRequest(path: string, init: RequestInit = {}) {
  const projectId = getOptionalEnv("FIREBASE_ADMIN_PROJECT_ID") || getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  const apiKey = getEnv("NEXT_PUBLIC_FIREBASE_API_KEY");
  const response = await fetch(`${FIRESTORE_BASE_URL}/projects/${projectId}/databases/(default)/documents${path}?key=${apiKey}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });

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

async function getFirestoreDocument(path: string) {
  const { projectId } = getFirestoreAdminConfig();
  const accessToken = await getFirestoreAdminAccessToken();
  const response = await fetch(`${FIRESTORE_BASE_URL}/projects/${projectId}/databases/(default)/documents${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Firestore admin request failed with status ${response.status}.`);
  }

  return (await response.json()) as FirestoreDocument;
}

function parseDailyVisitMetric(document: FirestoreDocument): DailyVisitMetric {
  const fields = Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [key, fromFirestoreValue(value)])
  ) as Record<string, FirestorePrimitive>;

  return {
    dateKey: String(fields.dateKey ?? ""),
    count: Number(fields.count ?? 0),
    updatedAt: fields.updatedAt == null ? null : String(fields.updatedAt)
  };
}

export async function getDailyVisitMetric(dateKey: string): Promise<DailyVisitMetric> {
  const document = await getFirestoreDocument(`/${SITE_METRICS_COLLECTION}/daily-${dateKey}`);

  if (!document) {
    return {
      dateKey,
      count: 0,
      updatedAt: null
    };
  }

  return parseDailyVisitMetric(document);
}

export async function incrementDailyVisitMetric(dateKey: string) {
  const current = await getDailyVisitMetric(dateKey);
  const nextCount = current.count + 1;
  const { projectId } = getFirestoreAdminConfig();
  const accessToken = await getFirestoreAdminAccessToken();
  const documentName = `projects/${projectId}/databases/(default)/documents/${SITE_METRICS_COLLECTION}/daily-${dateKey}`;
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
            name: documentName,
            fields: {
              type: { stringValue: "daily_visit" },
              dateKey: { stringValue: dateKey },
              count: { integerValue: String(nextCount) },
              updatedAt: { timestampValue: new Date().toISOString() }
            }
          }
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Firestore daily visit commit failed with status ${response.status}.`);
  }

  return {
    dateKey,
    count: nextCount
  };
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
