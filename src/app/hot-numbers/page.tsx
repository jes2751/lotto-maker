import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { drawRepository } from "@/lib/lotto";
import { computeFrequencyStats } from "@/lib/lotto/stats";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/hot-numbers",
    titleKo: "자주 나온 번호",
    titleEn: "Hot Numbers",
    descriptionKo: "전체 회차 기준으로 가장 자주 나온 로또 번호를 확인하고 번호 상세 통계로 이동할 수 있습니다.",
    descriptionEn: "Review the most frequently drawn Lotto numbers across the full history and move into number-detail statistics."
  });
}

const content = {
  ko: {
    pageName: "자주 나온 번호",
    pageDescription: "전체 회차 기준으로 가장 자주 나온 번호를 정리한 통계 랜딩 페이지",
    eyebrow: "자주 나온 번호",
    title: "전체 회차 기준 자주 나온 로또 번호",
    description: "전체 회차에서 많이 등장한 번호를 순위별로 보여주고, 번호 상세 통계와 관련 가이드로 이어지는 페이지입니다.",
    rank: "순위",
    frequency: "출현 횟수",
    coverage: "출현 비율",
    next: "다음 이동",
    recentHot: "최근 20회 자주 나온 번호",
    hub: "통계 허브"
  },
  en: {
    pageName: "Hot Numbers",
    pageDescription: "Landing page for the most frequent Lotto numbers across all recorded draws.",
    eyebrow: "Hot Numbers",
    title: "Most frequent Lotto numbers across all draws",
    description: "This page summarizes the numbers that appeared most often across the full draw history.",
    rank: "Rank",
    frequency: "Frequency",
    coverage: "Coverage",
    next: "Next Step",
    recentHot: "Recent 20 hot numbers",
    hub: "Statistics hub"
  }
} as const;

export default async function HotNumbersPage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const draws = await drawRepository.getAll();
  const hotNumbers = computeFrequencyStats(draws, "all").slice(0, 15);
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: copy.pageName,
          description: copy.pageDescription,
          url: `${siteUrl}/hot-numbers`,
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
        <p className="mt-4 leading-8 text-slate-300">{copy.description}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {hotNumbers.map((item, index) => (
          <Link
            key={item.number}
            href={`/stats/numbers/${item.number}`}
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              {copy.rank} {index + 1}
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">{item.number}</p>
            <p className="mt-2 text-sm text-slate-400">
              {copy.frequency} {item.frequency}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {copy.coverage} {item.percentage}%
            </p>
          </Link>
        ))}
      </section>

      <section className="panel">
        <p className="eyebrow">{copy.next}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/guides/recent-hot-and-cold-numbers" className="cta-button">
            {copy.recentHot}
          </Link>
          <Link
            href="/lotto-statistics"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            {copy.hub}
          </Link>
        </div>
      </section>
    </div>
  );
}
