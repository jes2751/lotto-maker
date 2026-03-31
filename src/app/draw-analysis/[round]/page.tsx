import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NumberSet } from "@/components/lotto/number-set";
import { JsonLd } from "@/components/seo/json-ld";
import { drawRepository } from "@/lib/lotto";
import { analyzeDraw, buildDrawAnalysisSummary } from "@/lib/lotto/analysis";
import { getSiteUrl, siteConfig } from "@/lib/site";

interface DrawAnalysisPageProps {
  params: {
    round: string;
  };
}

export async function generateMetadata({ params }: DrawAnalysisPageProps): Promise<Metadata> {
  const round = Number.parseInt(params.round, 10);
  const draw = Number.isInteger(round) ? await drawRepository.getByRound(round) : null;

  if (!draw) {
    return {
      title: "Draw analysis",
      description: "Round-based Lotto analysis page with number patterns and trend summary."
    };
  }

  return {
    title: `${draw.round} draw analysis`,
    description: `Round ${draw.round} Lotto analysis with winning numbers, odd-even pattern, sum pattern, and data-based comparison.`,
    alternates: {
      canonical: `/draw-analysis/${draw.round}`
    }
  };
}

export default async function DrawAnalysisPage({ params }: DrawAnalysisPageProps) {
  const round = Number.parseInt(params.round, 10);

  if (!Number.isInteger(round) || round < 1) {
    notFound();
  }

  const draws = await drawRepository.getAll();
  const draw = draws.find((item) => item.round === round);

  if (!draw) {
    notFound();
  }

  const analysis = analyzeDraw(draw, draws);
  const summary = buildDrawAnalysisSummary(analysis);
  const index = draws.findIndex((item) => item.round === draw.round);
  const newer = index > 0 ? draws[index - 1] : null;
  const older = index >= 0 && index < draws.length - 1 ? draws[index + 1] : null;
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/draw-analysis/${draw.round}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${draw.round} draw analysis`,
      description: `Round ${draw.round} Lotto analysis with number combination summary, odd-even balance, sum range, and recent statistical comparison.`,
      url: pageUrl,
      inLanguage: "ko-KR",
      mainEntityOfPage: pageUrl,
      author: {
        "@type": "Organization",
        name: siteConfig.name
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name
      },
      datePublished: draw.drawDate,
      dateModified: draw.drawDate
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Latest results",
          item: `${siteUrl}/latest-lotto-results`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${draw.round} draw analysis`,
          item: pageUrl
        }
      ]
    }
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <JsonLd data={jsonLd} />

      <section className="panel">
        <p className="eyebrow">Round Analysis</p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-white">{draw.round} draw analysis</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300">
              This analysis page summarizes the winning number combination for round {draw.round}, highlights the odd-even
              split, reviews the sum pattern, and compares the set against overall historical trends.
            </p>
            <p className="mt-3 text-sm text-slate-400">{draw.drawDate}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/draws/${draw.round}`} className="cta-button">
              Open round detail
            </Link>
            <Link
              href="/latest-lotto-results"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
            >
              Latest results
            </Link>
          </div>
        </div>
        <div className="mt-6">
          <NumberSet numbers={draw.numbers} bonus={draw.bonus} hrefBuilder={(value) => `/stats/numbers/${value}`} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="panel">
          <p className="eyebrow">Pattern Note</p>
          <p className="mt-3 text-base leading-8 text-slate-300">{summary.oddEvenSummary}</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Sum Note</p>
          <p className="mt-3 text-base leading-8 text-slate-300">{summary.sumSummary}</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Trend Note</p>
          <p className="mt-3 text-base leading-8 text-slate-300">{summary.trendSummary}</p>
        </article>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article className="panel">
          <p className="eyebrow">Sum</p>
          <p className="mt-3 text-4xl font-semibold text-white">{analysis.sum}</p>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            The six main numbers add up to {analysis.sum}. This is useful for comparing the round with sum-pattern pages and
            recent trend summaries.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Odd / Even</p>
          <p className="mt-3 text-4xl font-semibold text-white">
            {analysis.oddCount}:{analysis.evenCount}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            The set contains {analysis.oddCount} odd numbers and {analysis.evenCount} even numbers.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Low / High</p>
          <p className="mt-3 text-4xl font-semibold text-white">
            {analysis.lowCount}:{analysis.highCount}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Numbers 1-22 are treated as low and 23-45 as high to show whether the combination leaned low or high.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Consecutive</p>
          <p className="mt-3 text-4xl font-semibold text-white">{analysis.consecutivePairs.length}</p>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Consecutive pairs in this round:{" "}
            {analysis.consecutivePairs.length > 0
              ? analysis.consecutivePairs.map((pair) => pair.join("-")).join(", ")
              : "none"}.
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="panel">
          <p className="eyebrow">Hot Matches</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Numbers that also belong to the current hot-number group</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Based on full-history frequency, this round includes{" "}
            {analysis.hotMatches.length > 0 ? analysis.hotMatches.join(", ") : "no top-frequency numbers"}.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/hot-numbers" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
              View hot numbers
            </Link>
            <Link href="/lotto-statistics" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
              Open statistics hub
            </Link>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Cold Matches</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Numbers that were relatively quiet before this round</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Based on full-history frequency, this round includes{" "}
            {analysis.coldMatches.length > 0 ? analysis.coldMatches.join(", ") : "no low-frequency numbers"}.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/cold-numbers" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
              View cold numbers
            </Link>
            <Link href="/recent-10-draw-analysis" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
              Recent 10 draw analysis
            </Link>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Next Step</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Continue exploring this round from multiple angles</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link href={`/draws/${draw.round}`} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">Round detail</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">Check prize, winner count, and the raw winning-number page.</p>
          </Link>
          <Link href="/odd-even-pattern" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">Odd-even pattern</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">Compare this round with the most common odd-even splits.</p>
          </Link>
          <Link href="/sum-pattern" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">Sum pattern</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">See which sum ranges appear most often across all rounds.</p>
          </Link>
          <Link href="/lotto-number-generator" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">Number generator</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">Generate a new set after reviewing the pattern of this round.</p>
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={newer ? `/draw-analysis/${newer.round}` : "#"}
            aria-disabled={!newer}
            className={[
              "rounded-2xl border px-4 py-4 text-sm transition",
              newer
                ? "border-white/10 bg-slate-950/40 text-slate-200 hover:border-white/30"
                : "cursor-not-allowed border-white/5 bg-slate-950/20 text-slate-600"
            ].join(" ")}
          >
            {newer ? `Newer analysis: round ${newer.round}` : "No newer analysis"}
          </Link>
          <Link
            href={older ? `/draw-analysis/${older.round}` : "#"}
            aria-disabled={!older}
            className={[
              "rounded-2xl border px-4 py-4 text-sm transition",
              older
                ? "border-white/10 bg-slate-950/40 text-slate-200 hover:border-white/30"
                : "cursor-not-allowed border-white/5 bg-slate-950/20 text-slate-600"
            ].join(" ")}
          >
            {older ? `Older analysis: round ${older.round}` : "No older analysis"}
          </Link>
        </div>
      </section>
    </div>
  );
}
