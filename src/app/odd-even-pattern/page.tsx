import type { Metadata } from "next";
import Link from "next/link";

import { drawRepository } from "@/lib/lotto";
import { computeOddEvenSummary } from "@/lib/lotto/stats";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/odd-even-pattern",
    titleKo: "홀짝 패턴 분석",
    titleEn: "Odd-even pattern analysis",
    descriptionKo: "전체 회차 기준으로 홀짝 비율이 어떻게 나타났는지 정리한 분석 페이지입니다.",
    descriptionEn: "Review how odd-even combinations appeared across the draw history."
  });
}

export default async function OddEvenPatternPage() {
  const draws = await drawRepository.getAll();
  const summary = computeOddEvenSummary(draws, "all").slice(0, 8);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Odd-even pattern</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">홀짝 패턴 분석</h1>
        <p className="mt-4 leading-8 text-slate-300">
          전체 회차 기준으로 어떤 홀짝 비율이 자주 나왔는지 간단히 살펴보는 페이지입니다.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.count}</p>
            <p className="mt-2 text-sm text-slate-400">{item.percentage}%</p>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/stats#sum-pattern" className="cta-button">
            Sum pattern 보기
          </Link>
          <Link
            href="/stats"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            통계 허브로 이동
          </Link>
        </div>
      </section>
    </div>
  );
}
