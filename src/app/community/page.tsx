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
    path: "/community",
    titleKo: "생성 통계 허브",
    titleEn: "Generated Stats Hub",
    descriptionKo:
      "이번 회차 공개 생성 현황, 최근 평가 회차 기준 전략 성과, 최근 생성 번호를 한눈에 보는 생성 통계 허브입니다.",
    descriptionEn:
      "Generated stats hub for public pick volume, strategy performance, and recently created number sets."
  });
}

const content = {
  ko: {
    eyebrow: "생성 통계",
    title: "사람들이 이 사이트에서 만든 번호가\n어떻게 쌓이고 있는지 한눈에 확인하세요",
    description:
      "이 페이지는 소셜 게시판이 아니라 공개 생성 현황과 전략 성과를 보여주는 데이터 허브입니다. 이번 회차에 얼마나 많은 번호가 생성됐는지, 최근 당첨 회차 기준으로 어떤 전략이 더 가까웠는지 확인할 수 있습니다.",
    helperTitle: "이 페이지에서 볼 수 있는 것",
    helperItems: [
      "이번 회차 기준 공개 생성 수",
      "전략별 생성 수와 최근 성과 비교",
      "최근 생성된 번호 세트",
      "생성기와 통계 페이지로 바로 이어지는 동선"
    ],
    links: [
      { href: "/generate", label: "번호 생성기로 이동" },
      { href: "/stats", label: "통계 대시보드 보기" },
      { href: "/latest-lotto-results", label: "최신 결과 보기" }
    ]
  },
  en: {
    eyebrow: "Generated Stats",
    title: "See how public picks are building up across the site",
    description:
      "This page is not a social forum. It is a public stats hub that shows how many sets were generated for the current round and which strategies performed better against the latest official result.",
    helperTitle: "What you can see here",
    helperItems: [
      "Public pick volume for the current round",
      "Strategy performance against the latest evaluated round",
      "Recently generated number sets",
      "Direct paths back into generator and statistics pages"
    ],
    links: [
      { href: "/generate", label: "Open generator" },
      { href: "/stats", label: "Open statistics" },
      { href: "/latest-lotto-results", label: "Latest results" }
    ]
  }
} as const;

export default async function CommunityPage() {
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
          name: locale === "ko" ? "생성 통계 허브" : "Generated Stats Hub",
          description: copy.description,
          url: `${siteUrl}/community`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel">
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
        </div>

        <div className="panel">
          <p className="eyebrow">Guide</p>
          <h2 className="mt-4 text-2xl font-semibold text-white">{copy.helperTitle}</h2>
          <div className="mt-6 grid gap-4">
            {copy.helperItems.map((item) => (
              <article key={item} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GeneratedStatsDashboard latestDraw={latestDraw} />
    </div>
  );
}
