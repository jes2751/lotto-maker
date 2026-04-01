import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/lotto-statistics",
    titleKo: "로또 통계 허브",
    titleEn: "Lotto statistics hub",
    descriptionKo: "자주 나온 번호, 적게 나온 번호, 홀짝 패턴, 합계 패턴, 최근 10회 분석으로 이동하는 통계 허브입니다.",
    descriptionEn: "Use the Lotto statistics hub to move into hot numbers, cold numbers, odd-even patterns, sum patterns, and recent draw analysis."
  });
}

const cards = [
  {
    href: "/hot-numbers",
    title: "자주 나온 번호",
    description: "전체 회차 기준으로 많이 나온 번호를 먼저 확인합니다."
  },
  {
    href: "/cold-numbers",
    title: "적게 나온 번호",
    description: "상대적으로 조용했던 번호를 정리해서 비교합니다."
  },
  {
    href: "/odd-even-pattern",
    title: "Odd-even pattern",
    description: "홀짝 비율이 어떤 조합으로 자주 나왔는지 확인합니다."
  },
  {
    href: "/sum-pattern",
    title: "Sum pattern",
    description: "번호 합계 구간이 어떻게 분포되는지 확인합니다."
  },
  {
    href: "/recent-10-draw-analysis",
    title: "최근 10회 분석",
    description: "짧은 구간에서 반복되는 흐름을 먼저 보고 싶을 때 유용합니다."
  },
  {
    href: "/stats",
    title: "상세 통계 대시보드",
    description: "필터와 드릴다운이 들어간 실제 통계 페이지로 이동합니다."
  }
];

export default async function LottoStatisticsLandingPage() {
  const { locale } = getRequestPreferences();
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: locale === "ko" ? "로또 통계 허브" : "Lotto statistics hub",
          description:
            locale === "ko"
              ? "자주 나온 번호, 적게 나온 번호, 홀짝 패턴, 합계 패턴, 최근 10회 분석으로 이동하는 통계 허브"
              : "Statistics hub for Lotto hot numbers, cold numbers, odd-even patterns, and recent draw analysis.",
          url: `${siteUrl}/lotto-statistics`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="panel">
        <p className="eyebrow">Lotto Statistics Hub</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">한눈에 들어오는 로또 통계 허브</h1>
        <p className="mt-4 leading-8 text-slate-300">
          통계를 작은 주제별로 나눠서 빠르게 이동할 수 있도록 정리한 페이지입니다. 자주 나온 번호부터 Odd-even,
          Sum pattern, 최근 10회 분석까지 연결됩니다.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">{card.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

