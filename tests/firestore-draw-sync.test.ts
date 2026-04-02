import assert from "node:assert/strict";
import test from "node:test";

import { getLottoDrawDocumentId, toLottoDrawRecord } from "../src/lib/firebase/admin";
import { getDrawsToSyncFromOfficial } from "../src/lib/data/firestore-draw-sync";
import { evaluateGeneratedRecord } from "../src/lib/generated-stats/shared";

test("toLottoDrawRecord normalizes a draw into Firestore record shape", () => {
  const record = toLottoDrawRecord(
    {
      id: 1,
      round: 1,
      drawDate: "2002-12-07",
      numbers: [10, 23, 29, 33, 37, 40],
      bonus: 16,
      totalPrize: 0,
      firstPrize: 0,
      winnerCount: 0
    },
    "2026-04-01T00:00:00.000Z"
  );

  assert.equal(record.round, 1);
  assert.equal(record.source, "official-sync");
  assert.equal(record.syncedAt, "2026-04-01T00:00:00.000Z");
});

test("getLottoDrawDocumentId uses round number as document id", () => {
  assert.equal(getLottoDrawDocumentId(1170), "1170");
});

test("getDrawsToSyncFromOfficial returns consecutive new draws until official response stops", async () => {
  const originalFetch = global.fetch;
  const payloads = new Map([
    [
      1170,
      {
        returnValue: "success",
        drwNo: 1170,
        drwNoDate: "2026-04-04",
        drwtNo1: 1,
        drwtNo2: 2,
        drwtNo3: 3,
        drwtNo4: 4,
        drwtNo5: 5,
        drwtNo6: 6,
        bnusNo: 7
      }
    ],
    [
      1171,
      {
        returnValue: "success",
        drwNo: 1171,
        drwNoDate: "2026-04-11",
        drwtNo1: 8,
        drwtNo2: 9,
        drwtNo3: 10,
        drwtNo4: 11,
        drwtNo5: 12,
        drwtNo6: 13,
        bnusNo: 14
      }
    ]
  ]);

  global.fetch = async (input) => {
    const url = String(input);
    const round = Number(url.split("drwNo=").at(-1));
    const payload = payloads.get(round);

    return new Response(JSON.stringify(payload ?? { returnValue: "fail" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  };

  try {
    const draws = await getDrawsToSyncFromOfficial(1169);
    assert.equal(draws.length, 2);
    assert.equal(draws[0]?.round, 1170);
    assert.equal(draws[1]?.round, 1171);
  } finally {
    global.fetch = originalFetch;
  }
});

test("evaluateGeneratedRecord uses persisted settlement when record is already closed", () => {
  const evaluated = evaluateGeneratedRecord(
    {
      id: "record-1",
      anonymousId: "anon",
      strategy: "mixed",
      numbers: [1, 2, 3, 4, 5, 6],
      bonus: 7,
      reason: "test",
      generatedAt: "2026-04-01T00:00:00.000Z",
      targetRound: 1170,
      matchedRound: 1170,
      matchCount: 4,
      bonusMatched: true,
      settledAt: "2026-04-05T00:00:00.000Z",
      filters: {
        fixedNumbers: [],
        excludedNumbers: [],
        oddEven: "any",
        sumMin: null,
        sumMax: null,
        allowConsecutive: true
      }
    },
    {
      id: 1170,
      round: 1170,
      drawDate: "2026-04-04",
      numbers: [11, 12, 13, 14, 15, 16],
      bonus: 17
    }
  );

  assert.equal(evaluated.matchCount, 4);
  assert.equal(evaluated.bonusMatched, true);
  assert.equal(evaluated.matchedRound, 1170);
});
