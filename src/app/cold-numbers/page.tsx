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
    path: "/cold-numbers",
    titleKo: "적게 나온 번호",
    titleEn: "Cold Numbers",
    descriptionKo: "전체 회차 기준으로 상대적으로 적게 나온 로또 번호를 확인하고 최근 흐름과 비교할 수 있습니다.",
    descriptionEn: "Review the less frequent Lotto numbers across the full history and compare them with other statistics pages."
  });
}

const content = {
  ko: {
    pageName: "적게 나온 번호",
    pageDescription: "전체 회차 기준으로 상대적으로 적게 나온 번호를 정리한 통계 랜딩 페이지",
    eyebrow: "적게 나온 번호",
    title: "전체 회차 기준 적게 나온 로또 번호",
    description: "전체 회차에서 상대적으로 적게 등장한 번호를 정리한 페이지입니다. 자주 나온 번호와 비교하면서 흐름을 볼 수 있습니다.",
    rank: "순위",
    frequency: "출현 횟수",
    coverage: "출현 비율",
    compare: "자주 나온 번호와 비교",
    hub: "통계 허브"
  },
  en: {
    pageName: "Cold Numbers",
    pageDescription: "Landing page for less frequent Lotto numbers across all recorded draws.",
    eyebrow: "Cold Numbers",
    title: "Less frequent Lotto numbers across all draws",
    description: "This page highlights the numbers that appeared relatively less often across the full draw history.",
    rank: "Rank",
    frequency: "Frequency",
    coverage: "Coverage",
    compare: "Compare with hot numbers",
    hub: "Statistics hub"
  }
} as const;

export default async function ColdNumbersPage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const draws = await drawRepository.getAll();
  const coldNumbers = computeFrequencyStats(draws, "all").slice(-15).reverse();
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: copy.pageName,
          description: copy.pageDescription,
          url: `${siteUrl}/cold-numbers`,
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
        {coldNumbers.map((item, index) => (
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
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/stats#hot-numbers" className="cta-button">
            {copy.compare}
          </Link>
          <Link
            href="/stats"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            {copy.hub}
          </Link>
        </div>
      </section>
    </div>
  );
}
