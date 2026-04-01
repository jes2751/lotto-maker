import type { Metadata } from "next";
import Link from "next/link";

import { drawRepository } from "@/lib/lotto";
import { computeSumRangeSummary } from "@/lib/lotto/stats";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/sum-pattern",
    titleKo: "합계 패턴 분석",
    titleEn: "Sum pattern analysis",
    descriptionKo: "로또 번호 합계 구간이 어떻게 분포되는지 정리한 분석 페이지입니다.",
    descriptionEn: "Review how number sum ranges are distributed across the draw history."
  });
}

export default async function SumPatternPage() {
  const draws = await drawRepository.getAll();
  const summary = computeSumRangeSummary(draws, "all");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Sum pattern</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">합계 패턴 분석</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          전체 회차 기준으로 번호 합계가 어느 구간에 많이 몰렸는지 빠르게 확인할 수 있는 패턴 분석 페이지입니다.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {summary.map((item, index) => (
          <article key={item.label} className="panel">
            <p className="eyebrow">구간 {index + 1}</p>
            <p className="mt-3 text-4xl font-semibold text-white">{item.label}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              전체 회차 기준 {item.count}회 등장했고, 비율은 {item.percentage}%입니다.
            </p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="flex flex-wrap gap-3">
          <Link href="/stats" className="cta-button">
            통계 보기
          </Link>
          <Link
            href="/latest-lotto-results"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            최신 결과 보기
          </Link>
        </div>
      </section>
    </div>
  );
}
