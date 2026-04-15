import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import DrawAnalysisHubPage from "../src/app/draw-analysis/page";
import DrawAnalysisPage from "../src/app/draw-analysis/[round]/page";
import DrawDetailPage from "../src/app/draws/[round]/page";
import DrawsPage from "../src/app/draws/page";
import GeneratePage from "../src/app/generate/page";
import GeneratedStatsPage from "../src/app/generated-stats/page";
import LottoBuyGuidePage from "../src/app/lotto-buy-guide/page";
import HomePage from "../src/app/page";
import StatsPage from "../src/app/stats/page";
import NumberDetailPage from "../src/app/stats/numbers/[number]/page";
import { localDraws } from "../src/lib/data/local-draws";

const latestRound = String(localDraws[0]?.round ?? "");

test("home page renders focused core sections", async () => {
  const html = renderToStaticMarkup(await HomePage());

  assert.match(html, /최신 회차/);
  assert.match(html, /바로 번호 뽑기|지금 번호 뽑기/);
  assert.match(html, /사람들 몰림 보기|사람들 선택/);
});

test("generate page renders generator overview", async () => {
  const html = renderToStaticMarkup(await GeneratePage());

  assert.match(html, /Playboard Mode/);
  assert.match(html, /generator-panel/);
  assert.match(html, /혼합 추천|필터 추천/);
});

test("generated stats page renders public stats copy", async () => {
  const html = renderToStaticMarkup(await GeneratedStatsPage());

  assert.match(html, /사람들 선택|Crowd Board/);
  assert.match(html, /신뢰 계약|Aggregation Scope/);
  assert.match(html, /집계 출처|Source/);
  assert.match(html, /번호 생성하러 가기|Open generator/);
});

test("draw analysis hub page renders recent analysis cards", async () => {
  const html = renderToStaticMarkup(await DrawAnalysisHubPage());

  assert.match(html, new RegExp(latestRound));
  assert.match(html, /분석|Analysis/);
});

test("draw analysis page renders article style content", async () => {
  const html = renderToStaticMarkup(await DrawAnalysisPage({ params: { round: latestRound } as never }));

  assert.match(html, new RegExp(latestRound));
  assert.match(html, /Odd \/ Even|Trend Note/);
});

test("draws page renders draw list", async () => {
  const html = renderToStaticMarkup(await DrawsPage({ searchParams: {} as never }));

  assert.match(html, new RegExp(latestRound));
  assert.match(html, /회차|Find Round|Draws/);
});

test("draw detail page renders requested round", async () => {
  const html = renderToStaticMarkup(await DrawDetailPage({ params: { round: latestRound } as never }));

  assert.match(html, new RegExp(latestRound));
  assert.match(html, /당첨번호|Winning Numbers|Analysis/);
});

test("stats page renders simplified dashboard sections", async () => {
  const html = renderToStaticMarkup(await StatsPage({ searchParams: Promise.resolve({}) }));

  assert.match(html, /\/hot-numbers/);
  assert.match(html, /\/cold-numbers/);
  assert.match(html, /\/recent-10-draw-analysis/);
});

test("number detail page renders requested number stats", async () => {
  const html = renderToStaticMarkup(await NumberDetailPage({ params: Promise.resolve({ number: "34" }) }));

  assert.match(html, /34/);
  assert.match(html, /번호 상세|Number Detail|34번 번호 상세/);
  assert.match(html, /최근 출현 회차|href="\/draws\//);
});

test("lotto buy guide page renders official buying info", async () => {
  const html = renderToStaticMarkup(await LottoBuyGuidePage());

  assert.match(html, /구매 안내|Buying Guide/i);
  assert.match(html, /5천 원|KRW 5,000/i);
  assert.match(html, /동행복권 구매하기|Open Donghang Lottery/i);
});
