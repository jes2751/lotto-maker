import test from "node:test";
import assert from "node:assert/strict";

import { GET as getDraws } from "../src/app/api/v1/draws/route";
import { GET as getDrawByRound } from "../src/app/api/v1/draws/[round]/route";
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
    params: { round: "9999" }
  });
  const payload = await response.json();

  assert.equal(response.status, 404);
  assert.equal(payload.success, false);
  assert.equal(payload.error.code, "NOT_FOUND");
});

test("generate api validates invalid strategy", async () => {
  const response = await postGenerate(
    new Request("http://localhost/api/v1/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategy: "invalid", count: 1, include_bonus: true })
    })
  );

  assert.equal(response.status, 400);
});

test("generate api returns requested set count", async () => {
  const response = await postGenerate(
    new Request("http://localhost/api/v1/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategy: "random", count: 2, include_bonus: true })
    })
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.data.sets.length, 2);
});

test("stats api returns top level metadata", async () => {
  const response = await getFrequencyStats(new Request("http://localhost/api/v1/stats/frequency?period=recent_10&type=main"));
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.period, "recent_10");
});
