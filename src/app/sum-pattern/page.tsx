import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { computeSumRangeStats } from "@/lib/lotto/analysis";
import { drawRepository } from "@/lib/lotto";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sum pattern",
  description: "Review the most common sum ranges across all Lotto rounds and compare them with recent draw behavior."
};

export default async function SumPatternPage() {
  const draws = await drawRepository.getAll();
  const ranges = computeSumRangeStats(draws);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sum pattern",
    description: "Most common sum ranges across Lotto rounds.",
    url: `${getSiteUrl()}/sum-pattern`,
    inLanguage: "ko-KR"
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <JsonLd data={jsonLd} />

      <section className="panel">
        <p className="eyebrow">Pattern Landing</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Sum pattern analysis</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          This page groups every round by number-sum range so visitors can compare which sum bands appear most often and move
          into detailed round or number analysis.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ranges.map((range, index) => (
          <article key={range.label} className="panel">
            <p className="eyebrow">Range {index + 1}</p>
            <p className="mt-3 text-4xl font-semibold text-white">{range.label}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">Appeared in {range.count} rounds across the full draw history.</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="flex flex-wrap gap-3">
          <Link href="/stats" className="cta-button">
            Open statistics
          </Link>
          <Link
            href="/latest-lotto-results"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            Latest results
          </Link>
        </div>
      </section>
    </div>
  );
}
