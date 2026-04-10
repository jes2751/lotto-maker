import assert from "node:assert/strict";
import test from "node:test";

import { GET as getDrawByRound } from "../src/app/api/v1/draws/[round]/route";
import { GET as getDraws } from "../src/app/api/v1/draws/route";
import { POST as postGenerate } from "../src/app/api/v1/generate/route";
import { GET as getFrequencyStats } from "../src/app/api/v1/stats/frequency/route";

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
  assert.equal(typeof payload.data.targetRound, "number");
  assert.ok(payload.data.sets.every((set: { bonus?: number; numbers: number[] }) => typeof set.bonus === "number"));
});

test("generate api records stats through public firestore fallback", async () => {
  const originalFetch = global.fetch;
  const originalProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const originalApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const originalAdminProjectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const originalServiceEmail = process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL;
  const originalPrivateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;

  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "lotto-maker-lab";
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-public-key";
  delete process.env.FIREBASE_ADMIN_PROJECT_ID;
  delete process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL;
  delete process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;

  let requestUrl = "";
  let requestMethod = "";

  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    requestUrl = String(input);
    requestMethod = init?.method ?? "GET";

    return new Response(JSON.stringify({ name: "projects/lotto-maker-lab/databases/(default)/documents/generated_records/test" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }) as typeof fetch;

  try {
    const response = await postGenerate(
      new Request("http://localhost/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategy: "mixed", count: 1, anonymous_id: "anon-test" })
      })
    );
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.data.statsRecorded, true);
    assert.equal(requestMethod, "POST");
    assert.match(requestUrl, /generated_records\?documentId=.*key=test-public-key/);
  } finally {
    global.fetch = originalFetch;

    if (originalProjectId === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    else process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = originalProjectId;

    if (originalApiKey === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    else process.env.NEXT_PUBLIC_FIREBASE_API_KEY = originalApiKey;

    if (originalAdminProjectId === undefined) delete process.env.FIREBASE_ADMIN_PROJECT_ID;
    else process.env.FIREBASE_ADMIN_PROJECT_ID = originalAdminProjectId;

    if (originalServiceEmail === undefined) delete process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL;
    else process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL = originalServiceEmail;

    if (originalPrivateKey === undefined) delete process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;
    else process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY = originalPrivateKey;
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
