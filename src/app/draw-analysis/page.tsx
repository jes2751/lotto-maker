import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { drawRepository } from "@/lib/lotto";
import { analyzeDraw, buildDrawAnalysisSummary } from "@/lib/lotto/analysis";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/draw-analysis",
    titleKo: "회차 분석 허브",
    titleEn: "Draw analysis hub",
    descriptionKo:
      "최신 회차 분석과 최근 회차 분석 목록을 한곳에서 탐색할 수 있는 Lotto Maker Lab의 분석 허브입니다.",
    descriptionEn:
      "Browse the latest and recent round analysis pages from one central analysis hub."
  });
}

const content = {
  ko: {
    eyebrow: "회차 분석 허브",
    title: "최신 회차 분석과 최근 회차 흐름을 한 번에 모아보세요",
    description:
      "홀짝, 합계, 연속번호, 자주 나온 번호와 적게 나온 번호 매칭을 중심으로 최근 회차 분석 페이지를 이어서 탐색할 수 있습니다.",
    latestLabel: "가장 먼저 볼 분석",
    latestButton: "최신 회차 분석 열기",
    listLabel: "최근 분석 목록",
    listTitle: "최근 회차 분석을 계속 탐색하세요",
    summaryLabel: "요약",
    latestResults: "최신 결과 허브",
    stats: "종합 통계",
    recent10: "최근 10회 분석"
  },
  en: {
    eyebrow: "Draw Analysis Hub",
    title: "Browse the latest and recent round analysis in one place",
    description:
      "Move through recent round analysis pages focused on odd-even balance, sum range, consecutive numbers, and hot-cold matches.",
    latestLabel: "Start here",
    latestButton: "Open latest analysis",
    listLabel: "Recent analysis list",
    listTitle: "Keep exploring recent round analysis",
    summaryLabel: "Summary",
    latestResults: "Latest results",
    stats: "Statistics",
    recent10: "Recent 10 analysis"
  }
} as const;

export default async function DrawAnalysisHubPage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const draws = await drawRepository.getAll();
  const latest = draws[0];
  const recentDraws = draws.slice(0, 6);
  const siteUrl = getSiteUrl();
  const latestSummary = latest ? buildDrawAnalysisSummary(analyzeDraw(latest, draws)) : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: copy.title,
          description: copy.description,
          url: `${siteUrl}/draw-analysis`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="panel hero-panel grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="section-title mt-4 max-w-4xl text-gradient-silver">{copy.title}</h1>
          <p className="body-large mt-5 max-w-3xl text-slate-300">{copy.description}</p>
        </div>

        <div className="soft-card">
          <p className="eyebrow">Analysis Lens</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">핵심 기준</p>
              <p className="mt-2 text-2xl font-semibold text-white">패턴</p>
            </div>
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">읽는 순서</p>
              <p className="mt-2 text-2xl font-semibold text-white">요약 → 비교</p>
            </div>
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">연결 페이지</p>
              <p className="mt-2 text-2xl font-semibold text-white">상세 · 통계</p>
            </div>
          </div>
        </div>
      </section>

      {latest ? (
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel">
            <p className="eyebrow">{copy.latestLabel}</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">{latest.round}회 분석</h2>
            <p className="mt-2 text-slate-400">{latest.drawDate}</p>
            <div className="mt-5 soft-card">
              <p className="text-sm leading-7 text-slate-300">
                {latestSummary ? `${latestSummary.oddEvenSummary} ${latestSummary.sumSummary} ${latestSummary.trendSummary}` : null}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/draws/${latest.round}`} className="cta-button">
                {copy.latestButton}
              </Link>
              <Link href={`/draws/${latest.round}`} className="secondary-button">
                {locale === "ko" ? "회차 상세 보기" : "Round detail"}
              </Link>
            </div>
          </div>

          <div className="panel">
            <p className="eyebrow">Shortcut</p>
            <div className="mt-4 grid gap-4">
              <Link href="/draws" className="interactive-card">
                <p className="text-lg font-semibold text-white">{copy.latestResults}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  최신 당첨번호와 최근 회차 목록을 먼저 확인하는 결과 허브입니다.
                </p>
              </Link>
              <Link href="/stats" className="interactive-card">
                <p className="text-lg font-semibold text-white">{copy.stats}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  번호 빈도와 패턴을 전체 회차 기준으로 넓게 비교할 수 있습니다.
                </p>
              </Link>
              <Link href="/stats#recent-10-draw-analysis" className="interactive-card">
                <p className="text-lg font-semibold text-white">{copy.recent10}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  최근 구간만 따로 모아 흐름을 빠르게 읽고 싶을 때 적합합니다.
                </p>
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="panel">
        <p className="eyebrow">{copy.listLabel}</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">{copy.listTitle}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          카드 수를 늘리기보다 최근 분석 몇 개를 빠르게 훑고, 더 깊게 보고 싶을 때 회차 조회나 최신 결과 허브로
          이어지도록 정리했습니다.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentDraws.map((draw) => (
            <Link key={draw.round} href={`/draws/${draw.round}`} className="interactive-card">
              <p className="text-2xl font-semibold text-white">{draw.round}회</p>
              <p className="mt-1 text-sm text-slate-400">{draw.drawDate}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500">{copy.summaryLabel}</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {(() => {
                  const summary = buildDrawAnalysisSummary(analyzeDraw(draw, draws));
                  return `${summary.oddEvenSummary} ${summary.sumSummary}`;
                })()}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/draws" className="secondary-button">
            {copy.latestResults}
          </Link>
          <Link href="/draws" className="secondary-button">
            {locale === "ko" ? "전체 회차 보기" : "Open draw archive"}
          </Link>
        </div>
      </section>
    </div>
  );
}
