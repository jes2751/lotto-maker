import test from "node:test";
import assert from "node:assert/strict";

import { fetchOfficialDraw, mergeDraws, normalizeOfficialDraw, shouldRunSundaySync } from "../src/lib/data/draw-sync";
import { seedDraws } from "../src/lib/data/seed-draws";

test("normalizeOfficialDraw converts official payload into Draw shape", () => {
  const draw = normalizeOfficialDraw({
    resultCode: null,
    resultMessage: null,
    data: {
      list: [
        {
          ltEpsd: 1170,
          ltRflYmd: "20260404",
          tm1WnNo: 1,
          tm2WnNo: 7,
          tm3WnNo: 15,
          tm4WnNo: 22,
          tm5WnNo: 33,
          tm6WnNo: 41,
          bnsWnNo: 12,
          wholEpsdSumNtslAmt: 1000000000,
          rnk1WnAmt: 200000000,
          rnk1WnNope: 5
        }
      ]
    }
  });

  assert.equal(draw.round, 1170);
  assert.deepEqual(draw.numbers, [1, 7, 15, 22, 33, 41]);
  assert.equal(draw.bonus, 12);
});

test("mergeDraws appends a new draw without duplicating rounds", () => {
  const merged = mergeDraws(seedDraws, {
    id: 1170,
    round: 1170,
    drawDate: "2026-04-04",
    numbers: [1, 7, 15, 22, 33, 41],
    bonus: 12
  });

  assert.equal(merged.at(-1)?.round, 1170);
  assert.equal(merged.filter((draw) => draw.round === 1170).length, 1);
});

test("shouldRunSundaySync returns true for Sunday in Asia/Seoul", () => {
  const sundayUtc = new Date("2026-04-04T16:00:00.000Z");
  assert.equal(shouldRunSundaySync(sundayUtc), true);
});

test("fetchOfficialDraw returns null when the official site responds with html", async () => {
  const originalFetch = global.fetch;

  global.fetch = async () =>
    new Response("<!DOCTYPE html><html><body>not ready</body></html>", {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=UTF-8"
      }
    });

  try {
    const draw = await fetchOfficialDraw(9999);
    assert.equal(draw, null);
  } finally {
    global.fetch = originalFetch;
  }
});
