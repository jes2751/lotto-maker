import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import DrawDetailPage from "../src/app/draws/[round]/page";
import DrawsPage from "../src/app/draws/page";
import GeneratePage from "../src/app/generate/page";
import HomePage from "../src/app/page";
import StatsPage from "../src/app/stats/page";
import NumberDetailPage from "../src/app/stats/numbers/[number]/page";

test("home page renders the hero and latest draw sections", async () => {
  const html = renderToStaticMarkup(await HomePage());

  assert.match(html, /Historical Recommendation/);
  assert.match(html, /Latest Draw/);
  assert.match(html, /추천 번호 보러 가기/);
});

test("generate page renders the generator guide", async () => {
  const html = renderToStaticMarkup(await GeneratePage());

  assert.match(html, /데이터 기반 번호 추천기/);
  assert.match(html, /혼합형 추천/);
  assert.match(html, /결과 카드에서 번호를 누르면/);
});

test("draws page renders draw cards", async () => {
  const html = renderToStaticMarkup(await DrawsPage({ searchParams: {} }));

  assert.match(html, /Draws/);
  assert.match(html, /Detail/);
  assert.match(html, /회차 찾기/);
  assert.match(html, /번호 포함 회차 찾기/);
  assert.match(html, /다음 페이지/);
});

test("draws page filters by selected number", async () => {
  const html = renderToStaticMarkup(await DrawsPage({ searchParams: { number: "3" } }));

  assert.match(html, /3번 번호 포함 회차/);
  assert.match(html, /3번 기준 회차 목록/);
});

test("draw detail page renders the requested round", async () => {
  const html = renderToStaticMarkup(await DrawDetailPage({ params: { round: "1169" } }));

  assert.match(html, /1169/);
  assert.match(html, /Winning Numbers/);
  assert.match(html, /추천기로 이동/);
});

test("stats page renders both frequency sections", async () => {
  const html = renderToStaticMarkup(await StatsPage({ searchParams: {} }));

  assert.match(html, /전체 회차/);
  assert.match(html, /최근 10회/);
  assert.match(html, /기본 빈도 통계/);
  assert.match(html, /상위 15개/);
});

test("number detail page renders number stats", async () => {
  const html = renderToStaticMarkup(await NumberDetailPage({ params: { number: "3" } }));

  assert.match(html, /3번 상세 통계/);
  assert.match(html, /최근 회차/);
  assert.match(html, /이 번호가 나온 회차 보기/);
  assert.match(html, /통계로 돌아가기/);
});
