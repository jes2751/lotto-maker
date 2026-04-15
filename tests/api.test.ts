import assert from "node:assert/strict";
import test from "node:test";

import { GET as getDrawByRound } from "../src/app/api/v1/draws/[round]/route";
import { GET as getDraws } from "../src/app/api/v1/draws/route";
import { POST as postGenerate } from "../src/app/api/v1/generate/route";
import { GET as getFrequencyStats } from "../src/app/api/v1/stats/frequency/route";

const TEST_SERVICE_ACCOUNT_EMAIL = "firebase-adminsdk@test-project.iam.gserviceaccount.com";
const TEST_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6Ns7kdXS7D+cw
rGSC6FMADMzYt9SwicUYpZoA5K3WBqzCUE6xad0ElqqdNzcSVarejnPNoUZNX/QB
tzOP1Ze9UZZ0cAI0n3Xll84PZtTTJ83TtfP30CM8R34VyT1kQLSz5Yi8Q32ycDQS
X/FZ+HGKhjPhS/lFgU04gAVH0o1p/4AZlviLXpQdm9CMY9rQsiLW9r/IHUwS8Y6Q
0FH30xOoE0OODA0sG0o/QTrzxcHQ5L6bltKD+bx9ajWVWDzNiwTTsHJkn1Nfs5Ko
dMT2Pq0F25ctrIDmnXuLQ/RXaNSnsAwz6KJCnEbyqK/ZCJFpPdLbnQbA9MltBPFV
osFZJPxlAgMBAAECggEAF2oJ1LciIN1MjBW5I66ztQdnAH8I6tO/6Sv1c9RNOWKo
eVxgsLUnecq6FD+bmJ4V+Jr/26TCMrt0cnzHKnhIdqEaInTtChHc4KwYWF5tN0nD
ezHfRdMxgwRYScP+iKsMLayYZ1ezJ+ss2PygW9g96pWaU2Naqg8qlwad41yJtICZ
VXQH3om70OCSzfg1oDzPkkgaORfuEen8iFGRDIJUPFxkxgQrmR4zzxY24KMmgX5U
z38cpD/hKQ/s8kB8ZwTHlwYbEIVbcIX/BZ/+otVZcoRwW29Fd2FPTRmb9ahoqUgz
N9PdvbLk0i3rULcbxstoGTDtwZXxbnov8a2tULdBdwKBgQDscnx3ppQzsJOxL3mu
K9ws0mt8zmyndY97AicZ03kNmtb69IW3n4v/pFGmnM5soE5x50DZaaR8ZExRhcaS
/fE/IReNeIHArcyP1oUTrRN/IgO+8xrdOPDkxcjeEtMjK9gHRr4rQ5x3N9Ves8uB
WBA+XkclenBzCpZIUhDEyQmjIwKBgQDJnOcMTPOu/RKx4n+ZaGoLG9aQzilkTBzM
+y/xA4y3QyGQBf5irlmsdFHrk+61Hgu0VKecRCW04Jbgn1xFf5mRI9O3EJrlEgHd
wSUCY58zy/T1G887Hu65FjF5XELceSkx5Mp76wUDr36RomvxFOpzFyyAaTYovEGR
+40r6TO+1wKBgQCf39VrLdY9kSJ8BubWrs9j+y80p3ruS94lRVJc8xGB8nV0IEwd
2aJWy6tt5c7pwgbom33Mw9K1TTgRU0vubghmMCD1xkqtlpafl2RJ5pgtOTmhLk22
0V6IwXdNORtMR8P9P4csR74PGlCKhTWQEpSBJ0wh+kT4dGsjIWI3PNvoUwKBgEjf
/yASHK8u6PgFoAvKkzIqwNccvhdz76EkVoLuvolrqZEOqZHv5ZgRf58AnPM4xhBL
3T394AdOexr8X3T7l33ADoIIbYTJioUmkIMZkW0+lu+WOsTq/G1ImV99uulInlxb
j9lU7T4UzFJF/HBrGAe746kS3rHAwo7K949cvwiHAoGACqMay+FiSCfgZFe5T5VM
JSdds9vVzTwN07DxWSIZ38EuOV1S07ziGg4zen6epP2E18aVHL7f9E/a3Ud2d/7Q
epLzmpogSaqwlvqyq8h3gTCFPrmVOaXVhsCnZEbM7hCq3ifamzyzV0GbgAiZH87x
7p23R1JaxHLWyNYweL9jUfs=
-----END PRIVATE KEY-----`;

function toFirestoreValue(value: unknown): Record<string, unknown> {
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
        values: value.map((entry) => toFirestoreValue(entry))
      }
    };
  }

  return {
    mapValue: {
      fields: Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, toFirestoreValue(entry)])
      )
    }
  };
}

function createGeneratedRequestDocument(
  requestId: string,
  responseSets: Array<{
    id: string;
    strategy: string;
    numbers: number[];
    bonus: number | null;
    reason: string;
    generatedAt: string;
  }>,
  targetRound: number | null
) {
  return {
    name: `projects/test-project/databases/(default)/documents/generated_requests/${requestId}`,
    fields: Object.fromEntries(
      Object.entries({
        requestId,
        anonymousId: "anon-test",
        strategy: "mixed",
        targetRound,
        setCount: responseSets.length,
        recordIds: responseSets.map((_, index) => `${requestId}:${index}`),
        responseSets,
        status: "committed",
        createdAt: "2026-04-14T00:00:00.000Z",
        committedAt: "2026-04-14T00:00:00.000Z"
      }).map(([key, value]) => [key, toFirestoreValue(value)])
    )
  };
}

function withAdminFirestoreEnv() {
  const originalEnv = {
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_SERVICE_ACCOUNT_EMAIL: process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL,
    FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
  };

  process.env.FIREBASE_ADMIN_PROJECT_ID = "test-project";
  process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL = TEST_SERVICE_ACCOUNT_EMAIL;
  process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY = TEST_PRIVATE_KEY;
  delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  return () => {
    if (originalEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    else process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = originalEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (originalEnv.NEXT_PUBLIC_FIREBASE_API_KEY === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    else process.env.NEXT_PUBLIC_FIREBASE_API_KEY = originalEnv.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (originalEnv.FIREBASE_ADMIN_PROJECT_ID === undefined) delete process.env.FIREBASE_ADMIN_PROJECT_ID;
    else process.env.FIREBASE_ADMIN_PROJECT_ID = originalEnv.FIREBASE_ADMIN_PROJECT_ID;

    if (originalEnv.FIREBASE_SERVICE_ACCOUNT_EMAIL === undefined) delete process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL;
    else process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL = originalEnv.FIREBASE_SERVICE_ACCOUNT_EMAIL;

    if (originalEnv.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY === undefined) {
      delete process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;
    } else {
      process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY = originalEnv.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;
    }
  };
}

test("draws api returns success payload", async () => {
  const response = await getDraws(new Request("http://localhost/api/v1/draws?limit=5"));
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.draws.length, 5);
});

test("draw by round api returns 404 for unknown rounds", async () => {
  const response = await getDrawByRound(new Request("http://localhost/api/v1/draws/9999"), {
    params: Promise.resolve({ round: "9999" })
  });
  const payload = await response.json();

  assert.equal(response.status, 404);
  assert.equal(payload.success, false);
  assert.equal(payload.error.code, "NOT_FOUND");
});

test("draw by round api returns success for known rounds", async () => {
  const response = await getDrawByRound(new Request("http://localhost/api/v1/draws/1169"), {
    params: Promise.resolve({ round: "1169" })
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.round, 1169);
});

test("generate api validates invalid strategy", async () => {
  const response = await postGenerate(
    new Request("http://localhost/api/v1/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategy: "invalid", count: 1 })
    })
  );

  assert.equal(response.status, 400);
});

test("generate api returns requested set count", async () => {
  const response = await postGenerate(
    new Request("http://localhost/api/v1/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategy: "random", count: 2 })
    })
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.data.sets.length, 2);
  assert.equal(payload.data.statsRecorded, false);
  assert.equal(payload.data.requestId, null);
  assert.equal(typeof payload.data.targetRound, "number");
  assert.ok(payload.data.sets.every((set: { bonus?: number; numbers: number[] }) => typeof set.bonus === "number"));
});

test("generate api records stats through admin commit with request ledger", async () => {
  const originalFetch = global.fetch;
  const restoreEnv = withAdminFirestoreEnv();

  let commitRequestBody: { writes?: Array<{ update?: { name?: string } }> } | null = null;
  let storedLedgerDocument: { name: string; fields: Record<string, unknown> } | null = null;

  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url === "https://oauth2.googleapis.com/token") {
      return new Response(JSON.stringify({ access_token: "test-token", expires_in: 3600 }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (url.includes("/documents/generated_requests/req-admin")) {
      if (!storedLedgerDocument) {
        return new Response("not found", { status: 404 });
      }

      return new Response(JSON.stringify(storedLedgerDocument), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (url.endsWith("/documents:commit")) {
      commitRequestBody = JSON.parse(String(init?.body ?? "{}")) as {
        writes?: Array<{ update?: { name?: string; fields?: Record<string, unknown> } }>;
      };

      const ledgerWrite = commitRequestBody.writes?.find((write) =>
        write.update?.name?.includes("/generated_requests/req-admin")
      );

      storedLedgerDocument = ledgerWrite?.update
        ? {
            name: ledgerWrite.update.name ?? "",
            fields: ledgerWrite.update.fields ?? {}
          }
        : null;

      return new Response(JSON.stringify({ writeResults: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    throw new Error(`Unexpected fetch request in test: ${url}`);
  }) as typeof fetch;

  try {
    const response = await postGenerate(
      new Request("http://localhost/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: "req-admin",
          strategy: "mixed",
          count: 2,
          anonymous_id: "anon-test"
        })
      })
    );
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.data.statsRecorded, true);
    assert.equal(payload.data.requestId, "req-admin");
    assert.equal(payload.data.sets.length, 2);
    assert.ok(commitRequestBody);
    assert.equal(commitRequestBody.writes?.length, 3);
    assert.equal(commitRequestBody.writes?.[0]?.update?.name?.endsWith("/generated_requests/req-admin"), true);
    assert.equal(commitRequestBody.writes?.[1]?.update?.name?.endsWith("/generated_records/req-admin:0"), true);
    assert.equal(commitRequestBody.writes?.[2]?.update?.name?.endsWith("/generated_records/req-admin:1"), true);
  } finally {
    global.fetch = originalFetch;
    restoreEnv();
  }
});

test("generate api replays stored response for duplicate request ids", async () => {
  const originalFetch = global.fetch;
  const restoreEnv = withAdminFirestoreEnv();

  let commitCount = 0;
  let storedLedgerDocument: { name: string; fields: Record<string, unknown> } | null = null;

  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url === "https://oauth2.googleapis.com/token") {
      return new Response(JSON.stringify({ access_token: "test-token", expires_in: 3600 }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (url.includes("/documents/generated_requests/req-dup")) {
      if (!storedLedgerDocument) {
        return new Response("not found", { status: 404 });
      }

      return new Response(JSON.stringify(storedLedgerDocument), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (url.endsWith("/documents:commit")) {
      commitCount += 1;

      const body = JSON.parse(String(init?.body ?? "{}")) as {
        writes?: Array<{ update?: { name?: string; fields?: Record<string, unknown> } }>;
      };
      const ledgerWrite = body.writes?.find((write) => write.update?.name?.includes("/generated_requests/req-dup"));

      storedLedgerDocument = ledgerWrite?.update
        ? {
            name: ledgerWrite.update.name ?? "",
            fields: ledgerWrite.update.fields ?? {}
          }
        : createGeneratedRequestDocument("req-dup", [], null);

      return new Response(JSON.stringify({ writeResults: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    throw new Error(`Unexpected fetch request in test: ${url}`);
  }) as typeof fetch;

  try {
    const firstResponse = await postGenerate(
      new Request("http://localhost/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: "req-dup",
          strategy: "mixed",
          count: 1,
          anonymous_id: "anon-test"
        })
      })
    );
    const firstPayload = await firstResponse.json();

    assert.equal(firstResponse.status, 200);
    assert.equal(firstPayload.data.requestId, "req-dup");
    assert.equal(firstPayload.data.statsRecorded, true);

    const secondResponse = await postGenerate(
      new Request("http://localhost/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: "req-dup",
          strategy: "mixed",
          count: 1,
          anonymous_id: "anon-test"
        })
      })
    );
    const secondPayload = await secondResponse.json();

    assert.equal(secondResponse.status, 200);
    assert.equal(secondPayload.data.statsRecorded, true);
    assert.equal(secondPayload.data.requestId, "req-dup");
    assert.deepEqual(secondPayload.data.sets, firstPayload.data.sets);
    assert.equal(commitCount, 1);
  } finally {
    global.fetch = originalFetch;
    restoreEnv();
  }
});

test("generate api validates overlapping fixed and excluded numbers", async () => {
  const response = await postGenerate(
    new Request("http://localhost/api/v1/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        strategy: "filter",
        count: 1,
        filters: {
          fixed_numbers: [3, 7],
          excluded_numbers: [7, 12]
        }
      })
    })
  );

  assert.equal(response.status, 400);
});

test("generate api returns filtered sets", async () => {
  const response = await postGenerate(
    new Request("http://localhost/api/v1/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        strategy: "filter",
        count: 1,
        filters: {
          fixed_numbers: [3, 11],
          excluded_numbers: [1, 2, 45],
          odd_even: "balanced",
          allow_consecutive: false
        }
      })
    })
  );
  const payload = await response.json();
  const [set] = payload.data.sets;

  assert.equal(response.status, 200);
  assert.ok(set.numbers.includes(3));
  assert.ok(set.numbers.includes(11));
  assert.ok(!set.numbers.includes(1));
  assert.ok(!set.numbers.includes(2));
  assert.ok(!set.numbers.includes(45));
  assert.ok(typeof set.bonus === "number");
});

test("stats api returns top level metadata", async () => {
  const response = await getFrequencyStats(new Request("http://localhost/api/v1/stats/frequency?period=recent_10&type=main&limit=5"));
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.period, "recent_10");
  assert.equal(payload.data.limit, 5);
  assert.equal(payload.data.stats.length, 5);
});
