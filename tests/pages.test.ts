import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import HomePage from "../src/app/page";
import DrawsPage from "../src/app/draws/page";
import StatsPage from "../src/app/stats/page";

test("home page renders the hero and latest draw sections", async () => {
  const html = renderToStaticMarkup(await HomePage());

  assert.match(html, /Historical Recommendation/);
  assert.match(html, /Latest Draw/);
});

test("draws page renders draw cards", async () => {
  const html = renderToStaticMarkup(await DrawsPage());

  assert.match(html, /Draws/);
  assert.match(html, /BONUS/);
});

test("stats page renders both frequency sections", async () => {
  const html = renderToStaticMarkup(await StatsPage());

  assert.match(html, /All Draws/);
  assert.match(html, /Recent 10/);
});
