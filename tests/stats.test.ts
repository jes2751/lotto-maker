import test from "node:test";
import assert from "node:assert/strict";

import { seedDraws } from "../src/lib/data/seed-draws";
import { computeFrequencyStats, selectDrawsByPeriod } from "../src/lib/lotto/stats";

test("recent_10 period returns 10 draws", () => {
  const selected = selectDrawsByPeriod(seedDraws.slice().sort((left, right) => right.round - left.round), "recent_10");
  assert.equal(selected.length, 10);
});

test("frequency stats count repeated numbers", () => {
  const ordered = seedDraws.slice().sort((left, right) => right.round - left.round);
  const stats = computeFrequencyStats(ordered, "all");
  const numberThree = stats.find((item) => item.number === 3);
  const numberSix = stats.find((item) => item.number === 6);

  assert.equal(numberThree?.frequency, 2);
  assert.equal(numberSix?.frequency, 2);
});
