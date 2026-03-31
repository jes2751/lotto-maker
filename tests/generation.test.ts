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

test("frequency strategy includes the expected reason text", async () => {
  const service = new StaticGenerationService(seedDraws);
  const [set] = await service.generate({
    strategy: "frequency",
    count: 1,
    includeBonus: false
  });

  assert.match(set.reason, /가중치/);
});
