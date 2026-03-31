import type { Metadata } from "next";
import Link from "next/link";

import { drawRepository } from "@/lib/lotto";
import { computeFrequencyStats } from "@/lib/lotto/stats";

export const metadata: Metadata = {
  title: "로또 적게 나온 번호 | 낮은 빈도 번호 정리",
  description: "전체 회차 기준으로 상대적으로 적게 나온 번호를 정리하고 번호별 통계로 이어지는 랜딩 페이지입니다."
};

export default async function ColdNumbersPage() {
  const draws = await drawRepository.getAll();
  const coldNumbers = [...computeFrequencyStats(draws, "all")]
    .sort((left, right) => {
      if (left.frequency === right.frequency) {
        return left.number - right.number;
      }

      return left.frequency - right.frequency;
    })
    .slice(0, 15);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Cold Numbers</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">적게 나온 번호</h1>
        <p className="mt-4 leading-8 text-slate-300">전체 회차 기준으로 상대적으로 적게 나온 번호를 정리한 페이지입니다. 전체 흐름과 최근 흐름을 함께 비교하는 출발점으로 사용합니다.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {coldNumbers.map((item, index) => (
          <Link key={item.number} href={`/stats/numbers/${item.number}`} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Low Rank {index + 1}</p>
            <p className="mt-3 text-4xl font-semibold text-white">{item.number}</p>
            <p className="mt-2 text-sm text-slate-400">등장 {item.frequency}회</p>
            <p className="mt-1 text-xs text-slate-500">회차 대비 {item.percentage}%</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
