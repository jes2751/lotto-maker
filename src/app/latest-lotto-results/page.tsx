import type { Metadata } from "next";
import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { JsonLd } from "@/components/seo/json-ld";
import { drawRepository } from "@/lib/lotto";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/latest-lotto-results",
    titleKo: "최신 로또 결과",
    titleEn: "Latest Lotto Results",
    descriptionKo:
      "최신 당첨번호와 최근 회차 목록을 확인하고, 회차 상세와 회차 분석으로 바로 이동할 수 있는 결과 허브입니다.",
    descriptionEn:
      "Check the latest Lotto results, browse recent rounds, and move directly into round detail or analysis pages."
  });
}

const content = {
  ko: {
    pageName: "최신 로또 결과",
    pageDescription: "최신 회차 결과와 최근 회차 목록을 모아 보는 랜딩 페이지입니다.",
    eyebrow: "최신 로또 결과",
    title: "최신 당첨번호와 최근 회차 흐름을 한 번에 확인하세요",
    description:
      "최신 회차를 먼저 보고, 최근 회차 목록과 분석 페이지로 이어서 이동할 수 있도록 구성한 결과 허브입니다.",
    currentRound: "현재 기준 최신 회차",
    openDetail: "회차 상세 보기",
    roundAnalysis: "회차 분석 보기",
    analysisHub: "분석 허브 보기",
    recent10: "최근 10회 흐름 분석",
    recentRounds: "최근 회차",
    recentTitle: "최근 회차를 상세와 분석 페이지로 이어서 살펴보세요",
    archive: "전체 회차 보기",
    drawDetail: "회차 상세",
    drawAnalysis: "회차 분석",
    guideTitle: "다음으로 이어서 볼 페이지",
    guideDescription:
      "최신 결과 확인 뒤 통계와 가이드, 분석 허브로 자연스럽게 이동할 수 있도록 추천 동선을 제공합니다."
  },
  en: {
    pageName: "Latest Lotto Results",
    pageDescription: "Landing page for the latest round result and the recent draw archive.",
    eyebrow: "Latest Lotto Results",
    title: "Check the latest round and browse recent results",
    description:
      "This hub highlights the latest round first and then connects you to round detail, round analysis, and recent draw summaries.",
    currentRound: "Current Round",
    openDetail: "Open round detail",
    roundAnalysis: "Open round analysis",
    analysisHub: "Open analysis hub",
    recent10: "Recent 10 analysis",
    recentRounds: "Recent Rounds",
    recentTitle: "Browse recent rounds with direct analysis links",
    archive: "Open draw archive",
    drawDetail: "Round detail",
    drawAnalysis: "Round analysis",
    guideTitle: "Next pages to open",
    guideDescription:
      "After checking the latest result, move into analysis, statistics, and generator pages for more context."
  }
} as const;

export default async function LatestLottoResultsPage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const draws = await drawRepository.getAll();
  const latest = draws[0];
  const recentDraws = draws.slice(0, 6);
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: copy.pageName,
          description: copy.pageDescription,
          url: `${siteUrl}/latest-lotto-results`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="panel hero-panel">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="section-title mt-4 text-gradient-silver">{copy.title}</h1>
        <p className="body-large mt-5 text-slate-300">{copy.description}</p>
      </section>

      {latest ? (
        <section className="panel">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{copy.currentRound}</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{latest.round}회</h2>
              <p className="mt-2 text-slate-400">{latest.drawDate}</p>
            </div>
            <Link href={`/draws/${latest.round}`} className="cta-button">
              {copy.openDetail}
            </Link>
          </div>

          <div className="mt-6">
            <NumberSet
              numbers={latest.numbers}
              bonus={latest.bonus}
              hrefBuilder={(value) => `/stats/numbers/${value}`}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/draw-analysis/${latest.round}`} className="secondary-button">
              {copy.roundAnalysis}
            </Link>
            <Link href="/draw-analysis" className="secondary-button">
              {copy.analysisHub}
            </Link>
            <Link href="/recent-10-draw-analysis" className="secondary-button">
              {copy.recent10}
            </Link>
          </div>
        </section>
      ) : null}

      <section className="panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">{copy.recentRounds}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{copy.recentTitle}</h2>
          </div>
          <Link href="/draws" className="secondary-button">
            {copy.archive}
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentDraws.map((draw) => (
            <div key={draw.round} className="interactive-card">
              <p className="text-2xl font-semibold text-white">{draw.round}회</p>
              <p className="mt-1 text-sm text-slate-400">{draw.drawDate}</p>
              <p className="mt-4 text-sm text-slate-300">
                {draw.numbers.join(", ")} + {draw.bonus}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/draws/${draw.round}`} className="secondary-button !px-4 !py-2 !text-xs">
                  {copy.drawDetail}
                </Link>
                <Link href={`/draw-analysis/${draw.round}`} className="secondary-button !px-4 !py-2 !text-xs">
                  {copy.drawAnalysis}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Guide</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">{copy.guideTitle}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">{copy.guideDescription}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link href="/stats" className="interactive-card">
            <p className="text-lg font-semibold text-white">
              {locale === "ko" ? "종합 통계 대시보드" : "Statistics dashboard"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              전체 회차와 최근 구간의 빈도, 패턴, 반복 번호를 한 번에 비교할 수 있습니다.
            </p>
          </Link>
          <Link href="/draw-analysis" className="interactive-card">
            <p className="text-lg font-semibold text-white">
              {locale === "ko" ? "회차 분석 허브" : "Analysis hub"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              최근 회차 분석 페이지를 한곳에 모아 빠르게 탐색할 수 있습니다.
            </p>
          </Link>
          <Link href="/guides" className="interactive-card">
            <p className="text-lg font-semibold text-white">
              {locale === "ko" ? "로또 가이드" : "Lotto guides"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              추천기, 통계, 패턴을 처음 접하는 사용자에게 필요한 설명형 콘텐츠를 모았습니다.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
