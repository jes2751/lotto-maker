import test from "node:test";
import assert from "node:assert/strict";

import { localDraws } from "../src/lib/data/local-draws";
import { seedDraws } from "../src/lib/data/seed-draws";
import { getAllAvailableDraws, getConfiguredOfficialDraws } from "../src/lib/data/remote-draws";
test("configured official draws come from the local archive file", async () => {
  const draws = await getConfiguredOfficialDraws();

  assert.equal(draws.length, localDraws.length);
  assert.equal(draws[0]?.round, localDraws[0]?.round);
  assert.ok(draws.length > seedDraws.length);
});

test("available draws use the same local archive as the repository source", async () => {
  const draws = await getAllAvailableDraws();

  assert.equal(draws.length, localDraws.length);
  assert.equal(draws[0]?.round, localDraws[0]?.round);
  assert.equal(draws.at(-1)?.round, localDraws.at(-1)?.round);
});
