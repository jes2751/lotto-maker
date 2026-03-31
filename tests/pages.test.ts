import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import HomePage from "../src/app/page";
import DrawsPage from "../src/app/draws/page";
import StatsPage from "../src/app/stats/page";

test("home page renders hero copy", async () => {
  const html = renderToStaticMarkup(await HomePage());
  assert.match(html, /LOTTO LAB|패턴을 참고하되/);
});

test("draws page renders round cards", async () => {
  const html = renderToStaticMarkup(await DrawsPage());
  assert.match(html, /최근 회차 조회/);
});

test("stats page renders frequency sections", async () => {
  const html = renderToStaticMarkup(await StatsPage());
  assert.match(html, /기본 빈도 통계/);
});
