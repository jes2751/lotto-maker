import type { Metadata } from "next";
import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";
import { computeFrequencyStats } from "@/lib/lotto/stats";

export const metadata: Metadata = {
  title: "Recent 10 draw analysis | Short-term Lotto trend summary",
  description: "Review the latest 10 Lotto rounds with top numbers, odd-even split, average sum, and direct links into each round analysis."
};

export default async function RecentTenDrawAnalysisPage() {
  const draws = (await drawRepository.getAll()).slice(0, 10);
  const topNumbers = computeFrequencyStats(draws, "all").slice(0, 10);
  const oddCount = draws.flatMap((draw) => draw.numbers).filter((value) => value % 2 === 1).length;
  const evenCount = draws.flatMap((draw) => draw.numbers).length - oddCount;
  const averageSum = draws.length
    ? Math.round(draws.reduce((sum, draw) => sum + draw.numbers.reduce((inner, value) => inner + value, 0), 0) / draws.length)
    : 0;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Recent 10 Draw Analysis</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Recent 10 draw analysis</h1>
        <p className="mt-4 leading-8 text-slate-300">
          This page summarizes short-term Lotto behavior across the latest 10 rounds. It is designed as a search-friendly
          landing page that quickly leads into number statistics and individual round analysis pages.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="panel">
          <p className="eyebrow">Top Number</p>
          <p className="mt-3 text-4xl font-semibold text-white">{topNumbers[0]?.number ?? "-"}</p>
          <p className="mt-2 text-sm text-slate-400">Most repeated number across the latest 10 rounds.</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Odd / Even</p>
          <p className="mt-3 text-4xl font-semibold text-white">
            {oddCount} / {evenCount}
          </p>
          <p className="mt-2 text-sm text-slate-400">Combined odd-even split across the latest 10 rounds.</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Average Sum</p>
          <p className="mt-3 text-4xl font-semibold text-white">{averageSum}</p>
          <p className="mt-2 text-sm text-slate-400">Average six-number sum across the latest 10 rounds.</p>
        </div>
      </section>

      <section className="panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Top Numbers</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Most repeated numbers in the latest 10 rounds</h2>
          </div>
          <Link href="/stats?period=recent_10&top=10" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
            Open full statistics
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {topNumbers.slice(0, 5).map((item) => (
            <Link key={item.number} href={`/stats/numbers/${item.number}`} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
              <p className="text-4xl font-semibold text-white">{item.number}</p>
              <p className="mt-2 text-sm text-slate-400">Frequency {item.frequency}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Recent Draws</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Move from recent rounds into analysis pages</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          {draws.map((draw) => (
            <div key={draw.round} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-semibold text-white">Round {draw.round}</p>
                  <p className="mt-1 text-sm text-slate-400">{draw.drawDate}</p>
                </div>
              </div>
              <div className="mt-4">
                <NumberSet numbers={draw.numbers} bonus={draw.bonus} hrefBuilder={(value) => `/stats/numbers/${value}`} />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/draws/${draw.round}`} className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200 transition hover:border-white/30">
                  Round detail
                </Link>
                <Link href={`/draw-analysis/${draw.round}`} className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200 transition hover:border-white/30">
                  Round analysis
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
