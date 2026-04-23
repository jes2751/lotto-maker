import test from "node:test";
import assert from "node:assert";
import { calculateCrowdOverlap, getOverlapWarning } from "../src/lib/lotto/overlap";
import type { NumberUsageSummary } from "../src/lib/generated-stats/shared";

test("calculateCrowdOverlap computes correct score", () => {
  const topNumbers: NumberUsageSummary[] = [
    { number: 7, count: 15, percentage: 15.0 },
    { number: 12, count: 10, percentage: 10.0 },
    { number: 45, count: 5, percentage: 5.0 }
  ];

  const numbers1 = [7, 12, 1, 2, 3, 4];
  const score1 = calculateCrowdOverlap(numbers1, topNumbers);
  assert.strictEqual(score1, 25.0);

  const numbers2 = [1, 2, 3, 4, 5, 6];
  const score2 = calculateCrowdOverlap(numbers2, topNumbers);
  assert.strictEqual(score2, 0);
});

test("getOverlapWarning returns correct levels", () => {
  assert.strictEqual(getOverlapWarning(25).level, "danger");
  assert.strictEqual(getOverlapWarning(20).level, "danger");
  
  assert.strictEqual(getOverlapWarning(15).level, "warning");
  assert.strictEqual(getOverlapWarning(10).level, "warning");
  
  assert.strictEqual(getOverlapWarning(5).level, "safe");
  assert.strictEqual(getOverlapWarning(0).level, "safe");
});
