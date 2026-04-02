import type { Metadata } from "next";
import Link from "next/link";

import { GeneratedStatsDashboard } from "@/components/generated-stats/generated-stats-dashboard";
import { JsonLd } from "@/components/seo/json-ld";
import { drawRepository } from "@/lib/lotto";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/generated-stats",
    titleKo: "생성 통계",
    titleEn: "Generated Stats",
    descriptionKo:
      "이번 회차 생성 수, 전략 점유율, 적중 분포, 최근 생성 번호를 모아 보는 공개 생성 현황 페이지입니다.",
    descriptionEn:
      "A public page for current-round generation volume, strategy share, match distribution, and recent generated sets."
  });
}

const content = {
  ko: {
    eyebrow: "공개 실험실",
    title: "이번 회차에 사람들이 어떤 방식으로 번호를 만들고 있는지 한눈에 보세요",
    description:
      "이 화면은 대화형 커뮤니티가 아니라, 공개 생성 흐름을 읽는 관측판입니다. 이번 회차 생성 수, 전략 점유율, 최근 생성 번호, 최근 평가 회차 기준 전략 성과를 한 번에 보여줍니다.",
    links: [
      { href: "/generate", label: "번호 생성하러 가기", primary: true },
      { href: "/stats", label: "통계 보기" },
      { href: "/latest-lotto-results", label: "최신 결과 보기" }
    ]
  },
  en: {
    eyebrow: "Public Lab",
    title: "See how visitors are creating sets for the current round at a glance",
    description:
      "This page is not a discussion board. It is a public control board for current-round generation volume, strategy share, recent sets, and recent evaluated performance.",
    links: [
      { href: "/generate", label: "Open generator", primary: true },
      { href: "/stats", label: "Open stats" },
      { href: "/latest-lotto-results", label: "Latest results" }
    ]
  }
} as const;

export default async function GeneratedStatsPage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const siteUrl = getSiteUrl();
  const latestDraw = await drawRepository.getLatest();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: locale === "ko" ? "생성 통계" : "Generated Stats",
          description: copy.description,
          url: `${siteUrl}/generated-stats`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="panel hero-panel grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="section-title mt-4 max-w-4xl text-gradient-silver">{copy.title}</h1>
          <p className="body-large mt-5 max-w-4xl text-slate-300">{copy.description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {copy.links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "primary" in item && item.primary ? "cta-button" : "secondary-button",
                  item.href === "/latest-lotto-results" ? "hidden sm:inline-flex" : "w-full sm:w-auto"
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="soft-card">
          <p className="eyebrow">{locale === "ko" ? "현재 관측 기준" : "Current Frame"}</p>
          <div className="mt-5 grid grid-cols-3 gap-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="kpi-cell px-3 py-3 md:px-5 md:py-4">
              <p className="text-xs text-slate-400">{locale === "ko" ? "현재 대상" : "Target"}</p>
              <p className="mt-2 text-lg font-semibold text-white md:text-2xl">
                {latestDraw ? `${latestDraw.round + 1}회` : "-"}
              </p>
            </div>
            <div className="kpi-cell px-3 py-3 md:px-5 md:py-4">
              <p className="text-xs text-slate-400">{locale === "ko" ? "해석 방식" : "Mode"}</p>
              <p className="mt-2 text-lg font-semibold text-white md:text-2xl">{locale === "ko" ? "공개 흐름" : "Public flow"}</p>
            </div>
            <div className="kpi-cell px-3 py-3 md:px-5 md:py-4">
              <p className="text-xs text-slate-400">{locale === "ko" ? "비교축" : "Axis"}</p>
              <p className="mt-2 text-lg font-semibold text-white md:text-2xl">{locale === "ko" ? "전략 성과" : "Strategy"}</p>
            </div>
          </div>
        </div>
      </section>

      <GeneratedStatsDashboard latestDraw={latestDraw} />
    </div>
  );
}
