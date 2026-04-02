import assert from "node:assert/strict";
import test from "node:test";

import { getSeoulDateKey, getTodayVisitStorageKey } from "../src/lib/site-visits";

test("getSeoulDateKey uses Asia/Seoul date boundaries", () => {
  assert.equal(getSeoulDateKey(new Date("2026-04-02T14:59:59Z")), "2026-04-02");
  assert.equal(getSeoulDateKey(new Date("2026-04-02T15:00:00Z")), "2026-04-03");
});

test("getTodayVisitStorageKey builds browser storage key", () => {
  assert.equal(getTodayVisitStorageKey("2026-04-03"), "lotto-lab-visit:2026-04-03");
});
