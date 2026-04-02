import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getRequestPreferences } from "@/lib/server-preferences";
import { getSiteUrl, siteConfig } from "@/lib/site";

const guideEntries = {
  ko: [
    {
      href: "/guides/lotto-number-generator-vs-random",
      title: "로또 번호 생성기와 랜덤 추천의 차이",
      description: "완전 랜덤 추천과 과거 당첨 데이터 기반 추천이 어떻게 다른지 설명합니다."
    },
    {
      href: "/guides/recent-20-hot-numbers",
      title: "최근 20회 자주 나온 번호",
      description: "최신 20회에서 많이 나온 번호를 요약하고 통계 페이지와 연결합니다."
    },
    {
      href: "/guides/odd-even-pattern-guide",
      title: "홀짝 패턴은 어떻게 읽을까",
      description: "많이 보는 로또 질문을 패턴 분석 페이지와 연결되는 가이드로 정리합니다."
    }
  ],
  en: [
    {
      href: "/guides/lotto-number-generator-vs-random",
      title: "Lotto number generator vs random picks",
      description: "Explain the difference between a pure random pick and a historical-data-based recommendation page."
    },
    {
      href: "/guides/recent-20-hot-numbers",
      title: "Recent 20 hot numbers",
      description: "Summarize the numbers that appeared most often in the latest 20 rounds and connect them to the stats pages."
    },
    {
      href: "/guides/odd-even-pattern-guide",
      title: "How to read odd-even patterns",
      description: "Turn a common Lotto question into a guide article that links back into the pattern analysis landing page."
    }
  ]
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return locale === "ko"
    ? {
        title: "로또 가이드 | 설명형 콘텐츠 허브",
        description: "번호 생성기 설명, 최근 자주 나온 번호 요약, 패턴 읽는 법까지 검색 유입용 로또 가이드를 모아둔 콘텐츠 허브입니다.",
        alternates: { canonical: "/guides" }
      }
    : {
        title: "Lotto guides | Search-first content hub",
        description: "Browse Lotto guides built for search entry, including number-generator tips, recent hot-number summaries, and pattern-reading basics.",
        alternates: { canonical: "/guides" }
      };
}

export default async function GuidesHubPage() {
  const { locale } = await getRequestPreferences();
  const siteUrl = getSiteUrl();
  const entries = guideEntries[locale];
  const copy =
    locale === "ko"
      ? {
          name: "로또 가이드",
          description: "검색 유입과 재방문을 위한 설명형 로또 콘텐츠 허브",
          eyebrow: "가이드",
          title: "검색 유입과 재방문을 위한 로또 가이드",
          intro:
            "이 가이드 허브는 검색 유입에 도움이 되는 설명형 콘텐츠를 모아둔 공간입니다. 각 글은 하나의 로또 질문에 답한 뒤 추천기, 회차 조회, 통계 흐름으로 자연스럽게 이어지도록 구성했습니다.",
          next: "다음 단계",
          generator: "생성기 랜딩 열기",
          stats: "통계 허브 열기"
        }
      : {
          name: "Lotto Guides",
          description: "Guide hub for explanation-first Lotto content aimed at search entry and repeat visits.",
          eyebrow: "Guides",
          title: "Lotto guides for search entry and repeat visits",
          intro:
            "This guide hub collects explanation-first pages that support search traffic. Each article is written to answer a specific Lotto question and then lead visitors into the generator, draw lookup, and statistics flows.",
          next: "Next Step",
          generator: "Open generator landing",
          stats: "Open statistics hub"
        };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: copy.name,
          description: copy.description,
          url: `${siteUrl}/guides`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="panel">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">{copy.title}</h1>
        <p className="mt-4 leading-8 text-slate-300">{copy.intro}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {entries.map((guide) => (
          <Link key={guide.href} href={guide.href} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">{guide.title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">{guide.description}</p>
          </Link>
        ))}
      </section>

      <section className="panel">
        <p className="eyebrow">{copy.next}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/lotto-number-generator" className="cta-button">
            {copy.generator}
          </Link>
          <Link href="/lotto-statistics" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
            {copy.stats}
          </Link>
        </div>
      </section>
    </div>
  );
}
