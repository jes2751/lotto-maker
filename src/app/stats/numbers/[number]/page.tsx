import Link from "next/link";
import { notFound } from "next/navigation";

import { NumberBall } from "@/components/lotto/number-ball";
import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";
import { findDrawsContainingNumber, getNumberFrequency } from "@/lib/lotto/stats";

interface NumberDetailPageProps {
  params: {
    number: string;
  };
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
          <div className="mt-4 flex items-center gap-4">
            <NumberBall value={number} />
            <div>
              <h1 className="text-4xl font-semibold text-white">{number}번 상세 통계</h1>
              <p className="mt-2 text-slate-300">전체 회차와 최근 10회 기준에서 이 번호가 얼마나 자주 나왔는지 확인합니다.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/draws?number=${number}`} className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
            이 번호가 나온 회차 보기
          </Link>
          <Link href="/stats" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
            통계로 돌아가기
          </Link>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <p className="eyebrow">Overall</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">전체 등장 횟수</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overall.frequency}회</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">회차 대비 비율</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overall.percentage}%</p>
            </div>
          </div>
        </div>
        <div className="panel">
          <p className="eyebrow">Recent 10</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">최근 10회 등장</p>
              <p className="mt-2 text-3xl font-semibold text-white">{recent.frequency}회</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">최근 비율</p>
              <p className="mt-2 text-3xl font-semibold text-white">{recent.percentage}%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Recent Draws</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">이 번호가 포함된 최근 회차</h2>
          </div>
          <p className="text-sm text-slate-400">최대 8개 회차 표시</p>
        </div>
        <div className="mt-6 grid gap-4">
          {recentDraws.map((draw) => (
            <Link
              key={draw.round}
              href={`/draws/${draw.round}`}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-white/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold text-white">{draw.round}회</p>
                  <p className="mt-1 text-sm text-slate-400">{draw.drawDate}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-teal">
                  Draw Detail
                </span>
              </div>
              <div className="mt-4">
                <NumberSet numbers={draw.numbers} bonus={draw.bonus} />
              </div>
            </Link>
          ))}
          {recentDraws.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              이 번호가 포함된 회차를 찾지 못했습니다.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
