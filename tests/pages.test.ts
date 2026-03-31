import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import HomePage from "../src/app/page";
import DrawsPage from "../src/app/draws/page";
import DrawDetailPage from "../src/app/draws/[round]/page";
import StatsPage from "../src/app/stats/page";

test("home page renders the hero and latest draw sections", async () => {
  const html = renderToStaticMarkup(await HomePage());

  assert.match(html, /Historical Recommendation/);
  assert.match(html, /Latest Draw/);
});

test("draws page renders draw cards", async () => {
  const html = renderToStaticMarkup(await DrawsPage({ searchParams: {} }));

  assert.match(html, /Draws/);
  assert.match(html, /Detail/);
  assert.match(html, /회차 찾기/);
});

test("draw detail page renders the requested round", async () => {
  const html = renderToStaticMarkup(await DrawDetailPage({ params: { round: "1169" } }));

  assert.match(html, /1169/);
  assert.match(html, /Winning Numbers/);
  assert.match(html, /추천기로 이동/);
});

test("stats page renders both frequency sections", async () => {
  const html = renderToStaticMarkup(await StatsPage());

  assert.match(html, /All Draws/);
  assert.match(html, /Recent 10/);
  assert.match(html, /기본 빈도 통계/);
});
