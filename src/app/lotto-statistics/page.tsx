import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    locale: "ko",
    path: "/lotto-statistics",
    titleKo: "로또 통계 허브",
    titleEn: "Lotto statistics hub",
    descriptionKo: "자주 나온 번호, 적게 나온 번호, 홀짝 패턴, 합계 패턴, 최근 10회 분석으로 이동하는 한국어 로또 통계 허브입니다.",
    descriptionEn: "Use the Lotto statistics hub to move into hot numbers, cold numbers, odd-even patterns, sum patterns, and recent draw analysis."
  });
}

const mainDashboard = {
  href: "/stats",
  title: "상세 통계 대시보드",
  description: "모든 로또 통계 데이터를 한눈에 볼 수 있는 메인 대시보드입니다. 전체적인 흐름을 먼저 파악한 후 아래의 개별 주제로 깊이 들어가 보세요."
};

const subCards = [
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
    title: "홀짝 패턴",
    description: "홀짝 비율이 어떤 조합으로 자주 나왔는지 확인합니다."
  },
  {
    href: "/sum-pattern",
    title: "합계 패턴",
    description: "번호 합계 구간이 어떻게 분포되는지 확인합니다."
  },
  {
    href: "/recent-10-draw-analysis",
    title: "최근 10회 분석",
    description: "짧은 구간에서 반복되는 흐름을 먼저 보고 싶을 때 유용합니다."
  }
];

export default async function LottoStatisticsLandingPage() {
  const { locale } = await getRequestPreferences();
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "로또 통계 허브",
          description: "상세 통계 대시보드를 비롯해 자주 나온 번호, 적게 나온 번호, 홀짝 패턴, 합계 패턴, 최근 10회 분석으로 이동하는 통계 허브",
          url: `${siteUrl}/lotto-statistics`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="panel">
        <p className="eyebrow">로또 통계 허브</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">한눈에 들어오는 로또 통계 허브</h1>
        <p className="mt-4 leading-8 text-slate-300">
          통계를 작은 주제별로 나눠서 빠르게 이동할 수 있도록 정리한 페이지입니다. 메인 대시보드에서 숲을 먼저 보고, 개별 주제에서 나무를 확인하세요.
        </p>
      </section>

      <section className="mt-2">
        <Link href={mainDashboard.href} className="group relative flex flex-col gap-4 rounded-3xl border border-teal/20 bg-[linear-gradient(180deg,rgba(45,212,191,0.12)_0%,rgba(15,23,42,0.94)_100%)] p-8 transition hover:border-teal/50">
          <h2 className="text-2xl font-bold text-white">{mainDashboard.title}</h2>
          <p className="text-base leading-8 text-slate-300">{mainDashboard.description}</p>
          <p className="mt-2 text-sm font-semibold tracking-wide text-teal group-hover:text-white transition-colors">
            대시보드 열기 &rarr;
          </p>
        </Link>
      </section>

      <section className="mt-6">
        <h2 className="mb-6 px-2 text-xl font-semibold text-white">주제별 심층 분석</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subCards.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
              <p className="text-lg font-semibold text-white">{card.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
