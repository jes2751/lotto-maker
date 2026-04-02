import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import CommunityPage from "../src/app/community/page";
import DrawAnalysisHubPage from "../src/app/draw-analysis/page";
import DrawAnalysisPage from "../src/app/draw-analysis/[round]/page";
import DrawDetailPage from "../src/app/draws/[round]/page";
import DrawsPage from "../src/app/draws/page";
import GeneratePage from "../src/app/generate/page";
import HomePage from "../src/app/page";
import StatsPage from "../src/app/stats/page";

test("home page renders clean core sections", async () => {
  const html = renderToStaticMarkup(await HomePage());

  assert.match(html, /LOTTO MAKER LAB/);
  assert.match(html, /번호 생성기|Generator/);
  assert.match(html, /생성 통계|Generated Stats/);
  assert.match(html, /최신 당첨번호|Latest Draw/);
});

test("generate page renders generator overview", async () => {
  const html = renderToStaticMarkup(await GeneratePage());

  assert.match(html, /번호 생성기|Lotto Number Generator/);
  assert.match(html, /혼합 추천|mixed/i);
  assert.match(html, /필터 추천|filter/i);
});

test("generated stats page renders hub copy", async () => {
  const html = renderToStaticMarkup(await CommunityPage());

  assert.match(html, /생성 통계 허브|Generated Stats Hub/);
  assert.match(html, /전략 성과 보드|Generated Stats/);
  assert.match(html, /번호 생성기로 이동|Open generator/);
});

test("draw analysis hub page renders recent analysis cards", async () => {
  const html = renderToStaticMarkup(await DrawAnalysisHubPage());

  assert.match(html, /1169/);
  assert.match(html, /분석|Analysis/i);
});

test("draw analysis page renders article style content", async () => {
  const html = renderToStaticMarkup(await DrawAnalysisPage({ params: { round: "1169" } }));

  assert.match(html, /1169/);
  assert.match(html, /Odd \/ Even|홀짝|Trend Note/);
});

test("draws page renders draw list", async () => {
  const html = renderToStaticMarkup(await DrawsPage({ searchParams: {} }));

  assert.match(html, /1169/);
  assert.match(html, /Find Round|회차 찾기|Draws/);
});

test("draw detail page renders requested round", async () => {
  const html = renderToStaticMarkup(await DrawDetailPage({ params: { round: "1169" } }));

  assert.match(html, /1169/);
  assert.match(html, /Winning Numbers|당첨 번호|Analysis/);
});

test("stats page renders dashboard sections", async () => {
  const html = renderToStaticMarkup(await StatsPage({ searchParams: {} }));

  assert.match(html, /Stats|통계/);
  assert.match(html, /Pattern Summary|Overview|Guide/);
});
