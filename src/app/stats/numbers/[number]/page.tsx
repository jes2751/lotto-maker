import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";
import { findDrawsContainingNumber, getNumberFrequency } from "@/lib/lotto/stats";
import { createPageMetadata } from "@/lib/site";

interface NumberDetailPageProps {
  params: {
    number: string;
  };
}

export async function generateMetadata({ params }: NumberDetailPageProps): Promise<Metadata> {
  const number = Number.parseInt(params.number, 10);

  if (!Number.isInteger(number) || number < 1 || number > 45) {
    return createPageMetadata({
      locale: "ko",
      path: "/stats",
      titleKo: "번호 상세",
      titleEn: "Number Detail",
      descriptionKo: "번호별 출현 통계와 최근 포함 회차를 확인할 수 있습니다.",
      descriptionEn: "View number-level frequency stats and recent draws containing the selected number."
    });
  }

  return createPageMetadata({
    locale: "ko",
    path: `/stats/numbers/${number}`,
    titleKo: `${number}번 번호 상세`,
    titleEn: `Number ${number} Detail`,
    descriptionKo: `${number}번 번호의 전체 출현 횟수와 최근 포함 회차를 확인할 수 있습니다.`,
    descriptionEn: `Check the overall frequency and recent draws that included number ${number}.`
  });
}

export default async function NumberDetailPage({ params }: NumberDetailPageProps) {
  const number = Number.parseInt(params.number, 10);

  if (!Number.isInteger(number) || number < 1 || number > 45) {
    notFound();
  }

  const draws = await drawRepository.getAll();
  const overall = getNumberFrequency(draws, number, "all");
  const recent = getNumberFrequency(draws, number, "recent_10");
  const recentDraws = findDrawsContainingNumber(draws, number, "all").slice(0, 8);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Number Detail</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">{number}번 번호 상세 통계</h1>
          <p className="mt-3 text-slate-300">전체 출현 빈도와 최근 포함 회차를 함께 보는 번호 상세 페이지입니다.</p>
        </div>
        <Link href="/stats" className="cta-button">
          통계로 돌아가기
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="panel">
          <p className="eyebrow">Overall</p>
          <p className="mt-4 text-4xl font-semibold text-white">{overall.frequency}</p>
          <p className="mt-2 text-sm text-slate-400">전체 회차 출현 횟수</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Overall Rate</p>
          <p className="mt-4 text-4xl font-semibold text-white">{overall.percentage}%</p>
          <p className="mt-2 text-sm text-slate-400">전체 회차 기준 출현 비율</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Recent 10</p>
          <p className="mt-4 text-4xl font-semibold text-white">{recent.frequency}</p>
          <p className="mt-2 text-sm text-slate-400">최근 10회 출현 횟수</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Recent Rate</p>
          <p className="mt-4 text-4xl font-semibold text-white">{recent.percentage}%</p>
          <p className="mt-2 text-sm text-slate-400">최근 10회 출현 비율</p>
        </div>
      </section>

      <section className="panel">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Recent Draws</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{number}번이 포함된 최근 회차</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {recentDraws.map((draw) => (
            <div key={draw.round} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">{draw.round}회</p>
                  <p className="text-sm text-slate-400">{draw.drawDate}</p>
                </div>
                <Link href={`/draws/${draw.round}`} className="text-sm text-teal transition hover:text-teal-200">
                  Round detail
                </Link>
              </div>
              <div className="mt-4">
                <NumberSet numbers={draw.numbers} bonus={draw.bonus} hrefBuilder={(value) => `/stats/numbers/${value}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
