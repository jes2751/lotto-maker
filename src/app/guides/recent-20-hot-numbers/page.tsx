import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { drawRepository } from "@/lib/lotto";
import { computeFrequencyStats } from "@/lib/lotto/stats";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Recent 20 hot numbers",
  description:
    "Check which Lotto numbers appeared most often in the latest 20 rounds and move into number detail or recent-draw analysis.",
  alternates: {
    canonical: "/guides/recent-20-hot-numbers"
  }
};

export default async function RecentTwentyHotNumbersGuidePage() {
  const draws = (await drawRepository.getAll()).slice(0, 20);
  const hotNumbers = computeFrequencyStats(draws).slice(0, 10);
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Recent 20 hot numbers",
          description:
            "Guide article highlighting the most frequent Lotto numbers across the latest 20 rounds.",
          url: `${siteUrl}/guides/recent-20-hot-numbers`,
          inLanguage: "ko-KR",
          author: {
            "@type": "Organization",
            name: siteConfig.name
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name
          }
        }}
      />

      <section className="panel">
        <p className="eyebrow">Guide</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Recent 20 hot numbers</h1>
        <p className="mt-4 leading-8 text-slate-300">
          This page focuses on short-term momentum. Instead of full-history numbers, it highlights the values that appeared
          most often in the latest 20 rounds so visitors can compare short-term and long-term trends.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {hotNumbers.slice(0, 5).map((item, index) => (
          <Link
            key={item.number}
            href={`/stats/numbers/${item.number}`}
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Rank {index + 1}</p>
            <p className="mt-3 text-4xl font-semibold text-white">{item.number}</p>
            <p className="mt-2 text-sm text-slate-400">Frequency {item.frequency}</p>
          </Link>
        ))}
      </section>

      <section className="panel">
        <p className="eyebrow">Next Step</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/recent-10-draw-analysis" className="cta-button">
            Recent 10 analysis
          </Link>
          <Link
            href="/hot-numbers"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            Full-history hot numbers
          </Link>
        </div>
      </section>
    </div>
  );
}
