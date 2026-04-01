import test from "node:test";
import assert from "node:assert/strict";

import { StaticGenerationService } from "../src/lib/lotto/generation";
import { seedDraws } from "../src/lib/data/seed-draws";

test("generation service returns valid sets", async () => {
  const service = new StaticGenerationService(seedDraws);
  const sets = await service.generate({
    strategy: "mixed",
    count: 3,
    includeBonus: true
  });

  assert.equal(sets.length, 3);

  for (const set of sets) {
    assert.equal(set.numbers.length, 6);
    assert.equal(new Set(set.numbers).size, 6);
    assert.deepEqual([...set.numbers].sort((left, right) => left - right), set.numbers);
    assert.ok(set.numbers.every((number) => number >= 1 && number <= 45));
    assert.ok(typeof set.reason === "string" && set.reason.length > 0);
    assert.ok(typeof set.bonus === "number" && !set.numbers.includes(set.bonus));
  }
});

test("frequency strategy includes a non-empty reason", async () => {
  const service = new StaticGenerationService(seedDraws);
  const [set] = await service.generate({
    strategy: "frequency",
    count: 1,
    includeBonus: false
  });

  assert.ok(set.reason.trim().length > 0);
});

test("filter strategy respects fixed and excluded numbers", async () => {
  const service = new StaticGenerationService(seedDraws);
  const [set] = await service.generate({
    strategy: "filter",
    count: 1,
    includeBonus: false,
    filters: {
      fixedNumbers: [7, 21],
      excludedNumbers: [1, 2, 45],
      oddEven: "balanced",
      allowConsecutive: false
    }
  });

  assert.ok(set.numbers.includes(7));
  assert.ok(set.numbers.includes(21));
  assert.ok(!set.numbers.includes(1));
  assert.ok(!set.numbers.includes(2));
  assert.ok(!set.numbers.includes(45));
  assert.equal(set.numbers.filter((value) => value % 2 === 1).length, 3);

  for (let index = 1; index < set.numbers.length; index += 1) {
    assert.notEqual(set.numbers[index] - set.numbers[index - 1], 1);
  }
});
