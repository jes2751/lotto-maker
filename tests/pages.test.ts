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

test("home page renders focused core sections", async () => {
  const html = renderToStaticMarkup(await HomePage());

  assert.match(html, /Lotto Maker Lab/i);
  assert.match(html, /최신 회차|이번 주 컨트롤룸/);
  assert.match(html, /번호 생성하기/);
  assert.match(html, /생성 통계/);
});

test("generate page renders generator overview", async () => {
  const html = renderToStaticMarkup(await GeneratePage());

  assert.match(html, /번호 생성기/);
  assert.match(html, /필터 추천/);
  assert.match(html, /대상 회차/);
});

test("generated stats page renders public stats copy", async () => {
  const html = renderToStaticMarkup(await GeneratedStatsPage());

  assert.match(html, /생성 통계/);
  assert.match(html, /전략 성과/);
  assert.match(html, /새로 생성하기/);
});

test("draw analysis hub page renders recent analysis cards", async () => {
  const html = renderToStaticMarkup(await DrawAnalysisHubPage());

  assert.match(html, /1169/);
  assert.match(html, /분석|Analysis/);
});

test("draw analysis page renders article style content", async () => {
  const html = renderToStaticMarkup(await DrawAnalysisPage({ params: { round: "1169" } as never }));

  assert.match(html, /1169/);
  assert.match(html, /홀짝|Odd \/ Even|Trend Note/);
});

test("draws page renders draw list", async () => {
  const html = renderToStaticMarkup(await DrawsPage({ searchParams: {} as never }));

  assert.match(html, /1169/);
  assert.match(html, /회차|Find Round|Draws/);
});

test("draw detail page renders requested round", async () => {
  const html = renderToStaticMarkup(await DrawDetailPage({ params: { round: "1169" } as never }));

  assert.match(html, /1169/);
  assert.match(html, /당첨번호|Winning Numbers|Analysis/);
});

test("stats page renders simplified dashboard sections", async () => {
  const html = renderToStaticMarkup(await StatsPage({ searchParams: Promise.resolve({}) }));

  assert.match(html, /통계 대시보드|Statistics Dashboard/);
  assert.match(html, /핵심 번호|핵심 요약|Core Summary/);
  assert.match(html, /최근 10회에서 반복된 번호|자주 나온 번호|Hot numbers/i);
});

test("number detail page renders requested number stats", async () => {
  const html = renderToStaticMarkup(await NumberDetailPage({ params: Promise.resolve({ number: "34" }) }));

  assert.match(html, /34/);
  assert.match(html, /번호 통계|Number Detail/);
  assert.match(html, /최근 포함 회차|Recent Draws/);
});

test("lotto buy guide page renders official buying info", async () => {
  const html = renderToStaticMarkup(await LottoBuyGuidePage());

  assert.match(html, /온라인 구매 안내|Online buying guide/i);
  assert.match(html, /5천 원|KRW 5,000/i);
  assert.match(html, /동행복권 구매하기|Open Donghang Lottery/i);
});
