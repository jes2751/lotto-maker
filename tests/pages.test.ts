import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import ColdNumbersPage from "../src/app/cold-numbers/page";
import DrawAnalysisPage from "../src/app/draw-analysis/[round]/page";
import DrawDetailPage from "../src/app/draws/[round]/page";
import DrawsPage from "../src/app/draws/page";
import GeneratePage from "../src/app/generate/page";
import HomePage from "../src/app/page";
import HotNumbersPage from "../src/app/hot-numbers/page";
import LatestLottoResultsPage from "../src/app/latest-lotto-results/page";
import LottoNumberGeneratorLandingPage from "../src/app/lotto-number-generator/page";
import LottoStatisticsLandingPage from "../src/app/lotto-statistics/page";
import OddEvenPatternPage from "../src/app/odd-even-pattern/page";
import RecentTenDrawAnalysisPage from "../src/app/recent-10-draw-analysis/page";
import StatsPage from "../src/app/stats/page";
import NumberDetailPage from "../src/app/stats/numbers/[number]/page";
import SumPatternPage from "../src/app/sum-pattern/page";

test("home page renders the hero and latest draw sections", async () => {
  const html = renderToStaticMarkup(await HomePage());

  assert.match(html, /Historical Recommendation/);
  assert.match(html, /Latest Draw/);
  assert.match(html, /Search Entry/);
  assert.match(html, /Analysis Entry/);
});

test("draw analysis page renders article style content", async () => {
  const html = renderToStaticMarkup(await DrawAnalysisPage({ params: { round: "1169" } }));

  assert.match(html, /draw analysis/i);
  assert.match(html, /Odd \/ Even/);
  assert.match(html, /Trend Note/);
});

test("pattern landing pages render ranked summaries", async () => {
  const oddEvenHtml = renderToStaticMarkup(await OddEvenPatternPage());
  const sumHtml = renderToStaticMarkup(await SumPatternPage());

  assert.match(oddEvenHtml, /Odd-even pattern analysis/);
  assert.match(oddEvenHtml, /Rank 1/);
  assert.match(sumHtml, /Sum pattern analysis/);
  assert.match(sumHtml, /Range 1/);
});

test("generate page renders the generator guide", async () => {
  const html = renderToStaticMarkup(await GeneratePage());

  assert.match(html, /Generate/);
  assert.match(html, /Guide/);
  assert.match(html, /mixed/);
});

test("draws page renders draw cards", async () => {
  const html = renderToStaticMarkup(await DrawsPage({ searchParams: {} }));

  assert.match(html, /Draws/);
  assert.match(html, /Find Round/);
  assert.match(html, /Paging/);
});

test("draws page filters by selected number", async () => {
  const html = renderToStaticMarkup(await DrawsPage({ searchParams: { number: "3" } }));

  assert.match(html, /Number Filter/);
  assert.match(html, /3/);
});

test("draw detail page renders the requested round", async () => {
  const html = renderToStaticMarkup(await DrawDetailPage({ params: { round: "1169" } }));

  assert.match(html, /1169/);
  assert.match(html, /Winning Numbers/);
});

test("stats page renders both frequency sections", async () => {
  const html = renderToStaticMarkup(await StatsPage({ searchParams: {} }));

  assert.match(html, /Stats/);
  assert.match(html, /Controls/);
  assert.match(html, /Primary List/);
});

test("number detail page renders number stats", async () => {
  const html = renderToStaticMarkup(await NumberDetailPage({ params: { number: "3" } }));

  assert.match(html, /Number Detail/);
  assert.match(html, /Overall/);
  assert.match(html, /Recent Draws/);
});

test("latest lotto results landing page renders current result", async () => {
  const html = renderToStaticMarkup(await LatestLottoResultsPage());

  assert.match(html, /Latest lotto results and recent round archive/);
  assert.match(html, /Round analysis/);
});

test("hot numbers landing page renders ranked numbers", async () => {
  const html = renderToStaticMarkup(await HotNumbersPage());

  assert.match(html, /Hot Numbers/);
  assert.match(html, /Rank 1/);
});

test("cold numbers landing page renders low frequency numbers", async () => {
  const html = renderToStaticMarkup(await ColdNumbersPage());

  assert.match(html, /Cold Numbers/);
  assert.match(html, /Low Rank 1/);
});

test("recent 10 analysis page renders recent summary", async () => {
  const html = renderToStaticMarkup(await RecentTenDrawAnalysisPage());

  assert.match(html, /Recent 10 draw analysis/);
  assert.match(html, /Round analysis/);
});

test("seo landing pages render core entry content", async () => {
  const generatorHtml = renderToStaticMarkup(await LottoNumberGeneratorLandingPage());
  const statsHtml = renderToStaticMarkup(await LottoStatisticsLandingPage());

  assert.match(generatorHtml, /Lotto Number Generator/);
  assert.match(generatorHtml, /Next Step/);
  assert.match(statsHtml, /Lotto statistics hub/);
  assert.match(statsHtml, /Odd-even pattern/);
});
