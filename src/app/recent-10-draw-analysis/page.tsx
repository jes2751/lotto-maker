import type { Metadata } from "next";
import Link from "next/link";

import { drawRepository } from "@/lib/lotto";
import { computeAverageSum, computeFrequencyStats } from "@/lib/lotto/stats";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/recent-10-draw-analysis",
    titleKo: "최근 10회 분석",
    titleEn: "Recent 10 draw analysis",
    descriptionKo: "최근 10회 기준 자주 나온 번호와 평균 합계를 빠르게 읽는 분석 페이지입니다.",
    descriptionEn: "Review a short-term summary of hot numbers and average sums across the latest ten draws."
  });
}

export default async function RecentTenDrawAnalysisPage() {
  const draws = await drawRepository.getAll();
  const recentDraws = draws.slice(0, 10);
  const topNumbers = computeFrequencyStats(draws, "recent_10").slice(0, 5);
  const averageSum = computeAverageSum(draws, "recent_10");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Recent 10 draw analysis</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">최근 10회 흐름 요약</h1>
        <p className="mt-4 leading-8 text-slate-300">
          최근 10회 구간에서 자주 나온 번호와 평균 합계를 빠르게 확인할 수 있는 짧은 분석 페이지입니다.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel">
          <p className="eyebrow">Top Numbers</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {topNumbers.map((item) => (
              <Link
                key={item.number}
                href={`/stats/numbers/${item.number}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
              >
                <span className="font-semibold text-white">{item.number}</span>
                <span className="text-slate-500">{item.frequency}회</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Average Sum</p>
            <p className="mt-2 text-3xl font-semibold text-white">{averageSum}</p>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Recent Draws</p>
          <div className="mt-4 grid gap-3">
            {recentDraws.map((draw) => (
              <div key={draw.round} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">{draw.round}회</p>
                    <p className="text-sm text-slate-400">{draw.drawDate}</p>
                  </div>
                  <Link href={`/draws/${draw.round}`} className="text-sm text-teal transition hover:text-teal-200">
                    Round detail
                  </Link>
                </div>
                <p className="mt-3 text-sm text-slate-300">{draw.numbers.join(", ")} + {draw.bonus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

