import type { Metadata } from "next";
import Link from "next/link";

import { GeneratedStatsDashboard } from "@/components/generated-stats/generated-stats-dashboard";
import { JsonLd } from "@/components/seo/json-ld";
import { getGeneratedStatsSnapshot } from "@/lib/generated-stats/server";
import { drawRepository } from "@/lib/lotto";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

const content = {
  ko: {
    eyebrow: "사람들 선택",
    title: "이번 회차 전체 생성 흐름을 한 화면에서 봅니다",
    description:
      "최근 240개 샘플이 아니라 현재 회차 전체 생성 기록과 직전 평가 회차 결과를 함께 보여주는 공개 통계 페이지입니다.",
    links: [
      { href: "/generate", label: "번호 생성하러 가기", primary: true },
      { href: "/stats", label: "공식 통계 보기" }
    ],
    compareCards: [
      {
        href: "/stats",
        kicker: "공식 통계",
        title: "실제 당첨 흐름부터 확인하기",
        body: "장기 통계와 회차별 결과를 먼저 보고 군중 흐름과 비교할 수 있습니다."
      },
      {
        href: "/generate",
        kicker: "생성",
        title: "번호를 만든 뒤 사람들 선택과 비교하기",
        body: "지금 세트를 만든 뒤 같은 회차의 전체 선택 흐름과 바로 비교할 수 있습니다."
      }
    ],
    pills: ["이번 회차 전체", "전략 점유율", "번호 집중도"]
  },
  en: {
    eyebrow: "Crowd Board",
    title: "See the full current-round generation flow in one place",
    description:
      "This page shows the full current-round public generation flow and the latest evaluated round instead of relying on a recent sample.",
    links: [
      { href: "/generate", label: "Open generator", primary: true },
      { href: "/stats", label: "Open stats" }
    ],
    compareCards: [
      {
        href: "/stats",
        kicker: "Official stats",
        title: "Start from actual winning history",
        body: "Check long-term and round-level draw results before comparing crowd behavior."
      },
      {
        href: "/generate",
        kicker: "Generate",
        title: "Create a set and compare it with the crowd",
        body: "Generate a new set, then compare it against the full current-round public flow."
      }
    ],
    pills: ["full current round", "strategy share", "number concentration"]
  }
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/generated-stats",
    titleKo: "사람들 선택 통계",
    titleEn: "Generated Stats",
    descriptionKo:
      "이번 회차 전체 생성 수, 전략 점유율, 많이 선택된 번호, 직전 평가 회차 결과를 함께 보여주는 공개 통계 페이지입니다.",
    descriptionEn:
      "A public page for current-round generation volume, strategy share, top numbers, and latest evaluated results."
  });
}

export default async function GeneratedStatsPage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const siteUrl = getSiteUrl();
  const latestDraw = await drawRepository.getLatest();
  const snapshot = await getGeneratedStatsSnapshot(latestDraw);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: locale === "ko" ? "사람들 선택 통계" : "Generated Stats",
          description: copy.description,
          url: `${siteUrl}/generated-stats`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="panel hero-panel grid gap-6">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="section-title mt-4 max-w-4xl text-gradient-silver">{copy.title}</h1>
          <p className="body-large mt-5 max-w-3xl text-slate-300">{copy.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-6 md:gap-2.5">
            {copy.pills.map((item, index) => (
              <span key={item} className={index > 1 ? "spark-pill hidden sm:inline-flex" : "spark-pill"}>
                {item}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {copy.compareCards.map((item) => (
              <Link key={item.title} href={item.href} className="play-card">
                <span className="play-card-kicker">{item.kicker}</span>
                <span className="play-card-title">{item.title}</span>
                <span className="play-card-body">{item.body}</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {copy.links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "primary" in item && item.primary ? "cta-button" : "secondary-button",
                  "w-full sm:w-auto"
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="soft-card border-accent/20 bg-[linear-gradient(180deg,rgba(255,143,0,0.14)_0%,rgba(15,23,42,0.94)_100%)]">
          <p className="eyebrow">{locale === "ko" ? "집계 기준" : "Aggregation Scope"}</p>
          <div className="mt-5 grid gap-3 lg:max-w-xl lg:grid-cols-2">
            <div className="kpi-cell px-3 py-3 md:px-5 md:py-4">
              <p className="text-xs text-slate-400">{locale === "ko" ? "대상 회차" : "Target round"}</p>
              <p className="mt-2 text-lg font-semibold text-white md:text-2xl">
                {snapshot.view.currentTargetRound ? `${snapshot.view.currentTargetRound}회` : "-"}
              </p>
            </div>
            <div className="kpi-cell px-3 py-3 md:px-5 md:py-4">
              <p className="text-xs text-slate-400">{locale === "ko" ? "집계 소스" : "Source"}</p>
              <p className="mt-2 text-lg font-semibold text-white md:text-2xl">
                {snapshot.source === "aggregate"
                  ? locale === "ko"
                    ? "집계 문서"
                    : "aggregate doc"
                  : snapshot.source === "recomputed"
                    ? locale === "ko"
                      ? "서버 재계산"
                      : "server recompute"
                    : locale === "ko"
                      ? "데이터 없음"
                      : "no data"}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="signal-row">
              <span className="signal-row-dot" />
              <span>
                {locale === "ko"
                  ? "사람들 선택은 현재 회차 전체 생성 기록을 기준으로 계산되고, 최근 공개 세트만 별도로 보여줍니다."
                  : "The crowd board is computed from the full current-round record set, with recent public cards shown separately."}
              </span>
            </div>
          </div>
        </div>
      </section>

      <GeneratedStatsDashboard snapshot={snapshot} />
    </div>
  );
}
