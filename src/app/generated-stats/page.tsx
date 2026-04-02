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
    eyebrow: "생성 통계",
    title: "이번 회차에 사람들이\n어떤 방식으로 번호를 만들었는지 확인하세요",
    description:
      "이 페이지는 대화형 커뮤니티가 아니라 공개 생성 현황 페이지입니다. 이번 회차 생성 수, 전략 점유율, 최근 생성 번호, 최근 평가 회차 기준 전략 성과를 간결하게 보여줍니다.",
    links: [
      { href: "/generate", label: "번호 생성하러 가기" },
      { href: "/stats", label: "통계 보기" },
      { href: "/latest-lotto-results", label: "최신 결과 보기" }
    ]
  },
  en: {
    eyebrow: "Generated Stats",
    title: "See how visitors are\ncreating sets for the current round",
    description:
      "This is not a discussion board. It is a public overview of current-round generation volume, strategy share, recent sets, and recent performance.",
    links: [
      { href: "/generate", label: "Open generator" },
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

      <section className="panel">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="mt-4 whitespace-pre-line text-4xl font-semibold text-white">{copy.title}</h1>
        <p className="mt-4 max-w-4xl leading-8 text-slate-300">{copy.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {copy.links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <GeneratedStatsDashboard latestDraw={latestDraw} />
    </div>
  );
}
