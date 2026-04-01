import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import ColdNumbersPage from "../src/app/cold-numbers/page";
import ContactPage from "../src/app/contact/page";
import DrawAnalysisHubPage from "../src/app/draw-analysis/page";
import DrawAnalysisPage from "../src/app/draw-analysis/[round]/page";
import DrawDetailPage from "../src/app/draws/[round]/page";
import DrawsPage from "../src/app/draws/page";
import FaqPage from "../src/app/faq/page";
import GeneratePage from "../src/app/generate/page";
import GeneratorVsRandomGuidePage from "../src/app/guides/lotto-number-generator-vs-random/page";
import OddEvenPatternGuidePage from "../src/app/guides/odd-even-pattern-guide/page";
import RecentTwentyHotNumbersGuidePage from "../src/app/guides/recent-20-hot-numbers/page";
import GuidesHubPage from "../src/app/guides/page";
import HomePage from "../src/app/page";
import HotNumbersPage from "../src/app/hot-numbers/page";
import LatestLottoResultsPage from "../src/app/latest-lotto-results/page";
import LottoNumberGeneratorLandingPage from "../src/app/lotto-number-generator/page";
import LottoStatisticsLandingPage from "../src/app/lotto-statistics/page";
import OddEvenPatternPage from "../src/app/odd-even-pattern/page";
import PrivacyPage from "../src/app/privacy/page";
import RecentTenDrawAnalysisPage from "../src/app/recent-10-draw-analysis/page";
import StatsPage from "../src/app/stats/page";
import NumberDetailPage from "../src/app/stats/numbers/[number]/page";
import SumPatternPage from "../src/app/sum-pattern/page";
import TermsPage from "../src/app/terms/page";

test("home page renders core homepage sections", async () => {
  const html = renderToStaticMarkup(await HomePage());

  assert.match(html, /최신 회차|Latest Draw/);
  assert.match(html, /빠른 이동|Quick Actions/);
  assert.match(html, /분석 허브|Analysis Hub|Featured Analysis/);
});

test("draw analysis hub page renders recent analysis cards", async () => {
  const html = renderToStaticMarkup(await DrawAnalysisHubPage());

  assert.match(html, /회차 분석 허브|Draw Analysis Hub/i);
  assert.match(html, /최근 분석 목록|Recent analysis list/i);
  assert.match(html, /1169/);
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

  assert.match(oddEvenHtml, /Odd-even pattern/i);
  assert.match(sumHtml, /Sum pattern/i);
});

test("generate page renders the generator guide", async () => {
  const html = renderToStaticMarkup(await GeneratePage());

  assert.match(html, /번호 추천기|Number Generator/);
  assert.match(html, /filter/i);
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
  assert.match(html, /회차 분석 보기|Analysis/);
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

  assert.match(html, /최신 로또 결과|Latest Lotto Results/);
  assert.match(html, /회차 분석 보기|분석 허브 보기|Latest round analysis|Open analysis hub/);
});

test("hot numbers landing page renders ranked numbers", async () => {
  const html = renderToStaticMarkup(await HotNumbersPage());

  assert.match(html, /자주 나온 번호|Hot Numbers/);
  assert.match(html, /1/);
});

test("cold numbers landing page renders low frequency numbers", async () => {
  const html = renderToStaticMarkup(await ColdNumbersPage());

  assert.match(html, /적게 나온 번호|Cold Numbers/);
  assert.match(html, /1/);
});

test("recent 10 analysis page renders recent summary", async () => {
  const html = renderToStaticMarkup(await RecentTenDrawAnalysisPage());

  assert.match(html, /Recent 10 draw analysis/);
  assert.match(html, /Recent Draws|Top Numbers/);
});

test("seo landing pages render core entry content", async () => {
  const generatorHtml = renderToStaticMarkup(await LottoNumberGeneratorLandingPage());
  const statsHtml = renderToStaticMarkup(await LottoStatisticsLandingPage());

  assert.match(generatorHtml, /로또 번호 생성기|Lotto Number Generator/);
  assert.match(generatorHtml, /mixed|frequency|random/);
  assert.match(statsHtml, /로또 통계 허브|Lotto statistics hub/);
  assert.match(statsHtml, /홀짝|Odd-even/);
});

test("guide hub and articles render core entry content", async () => {
  const hubHtml = renderToStaticMarkup(await GuidesHubPage());
  const compareHtml = renderToStaticMarkup(await GeneratorVsRandomGuidePage());
  const recentHtml = renderToStaticMarkup(await RecentTwentyHotNumbersGuidePage());
  const oddEvenHtml = renderToStaticMarkup(await OddEvenPatternGuidePage());

  assert.match(hubHtml, /로또 가이드|Lotto guides/);
  assert.match(compareHtml, /random/i);
  assert.match(recentHtml, /Recent 20 hot numbers|최근 20회 자주 나온 번호/);
  assert.match(oddEvenHtml, /odd-even/i);
});

test("policy and trust pages render core content", async () => {
  const privacyHtml = renderToStaticMarkup(await PrivacyPage());
  const termsHtml = renderToStaticMarkup(await TermsPage());
  const faqHtml = renderToStaticMarkup(await FaqPage());
  const contactHtml = renderToStaticMarkup(await ContactPage());

  assert.match(privacyHtml, /개인정보처리방침|Privacy/);
  assert.match(termsHtml, /이용약관|Terms/);
  assert.match(faqHtml, /FAQ|자주 묻는 질문/);
  assert.match(contactHtml, /문의 \/ 운영 안내|Contact/);
});
