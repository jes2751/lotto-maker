import test from "node:test";
import assert from "node:assert/strict";

import { seedDraws } from "../src/lib/data/seed-draws";
import { getAllAvailableDraws, getConfiguredOfficialDraws } from "../src/lib/data/remote-draws";

const ORIGINAL_ENV = {
  LOTTO_REMOTE_DATA_DISABLED: process.env.LOTTO_REMOTE_DATA_DISABLED,
  FIREBASE_SERVICE_ACCOUNT_EMAIL: process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL,
  FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
  FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
};

function restoreEnv() {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

test.afterEach(() => {
  restoreEnv();
});

test("configured official draws fall back to public Firestore when admin env is missing", async () => {
  delete process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL;
  delete process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;
  process.env.FIREBASE_ADMIN_PROJECT_ID = "lotto-maker-lab";
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "lotto-maker-lab";
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "public-key";

  const originalFetch = globalThis.fetch;
  let requestedUrl = "";

  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrl = String(input);

    return new Response(
      JSON.stringify([
        {
          document: {
            name: "projects/lotto-maker-lab/databases/(default)/documents/lotto_draws/1217",
            fields: {
              id: { integerValue: "1217" },
              round: { integerValue: "1217" },
              drawDate: { stringValue: "2026-04-02" },
              numbers: {
                arrayValue: {
                  values: [
                    { integerValue: "3" },
                    { integerValue: "8" },
                    { integerValue: "15" },
                    { integerValue: "22" },
                    { integerValue: "31" },
                    { integerValue: "44" }
                  ]
                }
              },
              bonus: { integerValue: "11" },
              totalPrize: { integerValue: "123456789" },
              firstPrize: { integerValue: "12345678" },
              winnerCount: { integerValue: "7" },
              syncedAt: { stringValue: "2026-04-02T00:00:00.000Z" }
            }
          }
        }
      ]),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }) as typeof fetch;

  try {
    const draws = await getConfiguredOfficialDraws();

    assert.equal(draws.length, 1);
    assert.equal(draws[0]?.round, 1217);
    assert.match(requestedUrl, /documents:runQuery\?key=public-key$/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("configured official draws fall back to public Firestore when admin credentials are malformed", async () => {
  process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL = "svc@example.com";
  process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY =
    "\"-----BEGIN PRIVATE KEY-----\\ninvalid\\n-----END PRIVATE KEY-----\\n\"";
  process.env.FIREBASE_ADMIN_PROJECT_ID = "lotto-maker-lab";
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "lotto-maker-lab";
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "public-key";

  const originalFetch = globalThis.fetch;
  let requestedUrl = "";

  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrl = String(input);

    return new Response(
      JSON.stringify([
        {
          document: {
            name: "projects/lotto-maker-lab/databases/(default)/documents/lotto_draws/1217",
            fields: {
              id: { integerValue: "1217" },
              round: { integerValue: "1217" },
              drawDate: { stringValue: "2026-04-02" },
              numbers: {
                arrayValue: {
                  values: [
                    { integerValue: "3" },
                    { integerValue: "8" },
                    { integerValue: "15" },
                    { integerValue: "22" },
                    { integerValue: "31" },
                    { integerValue: "44" }
                  ]
                }
              },
              bonus: { integerValue: "11" },
              totalPrize: { integerValue: "123456789" },
              firstPrize: { integerValue: "12345678" },
              winnerCount: { integerValue: "7" },
              syncedAt: { stringValue: "2026-04-02T00:00:00.000Z" }
            }
          }
        }
      ]),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }) as typeof fetch;

  try {
    const draws = await getConfiguredOfficialDraws();

    assert.equal(draws.length, 1);
    assert.equal(draws[0]?.round, 1217);
    assert.match(requestedUrl, /documents:runQuery\?key=public-key$/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("available draws merge public Firestore archive with local seed data", async () => {
  process.env.LOTTO_REMOTE_DATA_DISABLED = "0";
  delete process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL;
  delete process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;
  process.env.FIREBASE_ADMIN_PROJECT_ID = "lotto-maker-lab";
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "lotto-maker-lab";
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "public-key";

  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify([
        {
          document: {
            name: "projects/lotto-maker-lab/databases/(default)/documents/lotto_draws/1100",
            fields: {
              id: { integerValue: "1100" },
              round: { integerValue: "1100" },
              drawDate: { stringValue: "2024-01-06" },
              numbers: {
                arrayValue: {
                  values: [
                    { integerValue: "1" },
                    { integerValue: "2" },
                    { integerValue: "3" },
                    { integerValue: "4" },
                    { integerValue: "5" },
                    { integerValue: "6" }
                  ]
                }
              },
              bonus: { integerValue: "7" },
              totalPrize: { integerValue: "1000" },
              firstPrize: { integerValue: "100" },
              winnerCount: { integerValue: "1" },
              syncedAt: { stringValue: "2026-04-02T00:00:00.000Z" }
            }
          }
        }
      ]),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )) as typeof fetch;

  try {
    const draws = await getAllAvailableDraws();

    assert.equal(draws.length, seedDraws.length + 1);
    assert.equal(draws[0]?.round, 1169);
    assert.equal(draws.at(-1)?.round, 1100);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
