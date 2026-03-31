import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { computeOddEvenPatterns } from "@/lib/lotto/analysis";
import { drawRepository } from "@/lib/lotto";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Odd-even pattern",
  description: "Review the most common odd-even ratios across all Lotto rounds and compare them with recent trends."
};

export default async function OddEvenPatternPage() {
  const draws = await drawRepository.getAll();
  const patterns = computeOddEvenPatterns(draws);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Odd-even pattern",
    description: "Most common odd-even ratios across Lotto rounds.",
    url: `${getSiteUrl()}/odd-even-pattern`,
    inLanguage: "ko-KR"
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <JsonLd data={jsonLd} />

      <section className="panel">
        <p className="eyebrow">Pattern Landing</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Odd-even pattern analysis</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          This page groups all rounds by odd-even split so visitors can quickly compare common ratios such as 3:3, 4:2,
          and 2:4 before opening detailed number statistics or generating a new set.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {patterns.slice(0, 6).map((pattern, index) => (
          <article key={pattern.label} className="panel">
            <p className="eyebrow">Rank {index + 1}</p>
            <p className="mt-3 text-4xl font-semibold text-white">{pattern.label}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">Appeared in {pattern.count} rounds across the full draw history.</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="flex flex-wrap gap-3">
          <Link href="/stats" className="cta-button">
            Open statistics
          </Link>
          <Link
            href="/recent-10-draw-analysis"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            Recent 10 draw analysis
          </Link>
        </div>
      </section>
    </div>
  );
}
