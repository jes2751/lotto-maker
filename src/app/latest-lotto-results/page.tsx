import type { Metadata } from "next";
import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";

export const metadata: Metadata = {
  title: "Latest lotto results | Latest round and recent draw archive",
  description: "Check the latest Lotto results, open round detail, and move directly into round analysis or recent draw analysis."
};

export default async function LatestLottoResultsPage() {
  const draws = await drawRepository.getAll();
  const latest = draws[0];
  const recentDraws = draws.slice(0, 6);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Latest Lotto Results</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Latest lotto results and recent round archive</h1>
        <p className="mt-4 leading-8 text-slate-300">
          Use this page as the main landing page for recent Lotto results. It highlights the latest round first and then lets
          visitors move into round detail, round analysis, and the broader recent-10 trend page.
        </p>
      </section>

      {latest ? (
        <section className="panel">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Current Round</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Round {latest.round}</h2>
              <p className="mt-2 text-slate-400">{latest.drawDate}</p>
            </div>
            <Link href={`/draws/${latest.round}`} className="cta-button">
              Open round detail
            </Link>
          </div>
          <div className="mt-6">
            <NumberSet numbers={latest.numbers} bonus={latest.bonus} hrefBuilder={(value) => `/stats/numbers/${value}`} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/draw-analysis/${latest.round}`}
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
            >
              Round analysis
            </Link>
            <Link
              href="/recent-10-draw-analysis"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
            >
              Recent 10 analysis
            </Link>
          </div>
        </section>
      ) : null}

      <section className="panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Recent Rounds</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Browse recent rounds with direct analysis links</h2>
          </div>
          <Link href="/draws" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
            Open draw archive
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentDraws.map((draw) => (
            <div key={draw.round} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-2xl font-semibold text-white">Round {draw.round}</p>
              <p className="mt-1 text-sm text-slate-400">{draw.drawDate}</p>
              <p className="mt-4 text-sm text-slate-300">
                {draw.numbers.join(", ")} + {draw.bonus}
              </p>
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
