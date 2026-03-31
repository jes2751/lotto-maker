import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";

export default async function DrawsPage() {
  const { draws } = await drawRepository.list({ limit: 12, offset: 0 });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="eyebrow">Draws</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">최근 회차 조회</h1>
        <p className="mt-3 text-slate-300">정적 시드 데이터 기준 최신 12개 회차를 표시합니다.</p>
      </div>

      <div className="grid gap-4">
        {draws.map((draw) => (
          <article key={draw.round} className="panel">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold text-white">{draw.round}회</p>
                <p className="mt-1 text-sm text-slate-400">{draw.drawDate}</p>
              </div>
              <div className="text-sm text-slate-400">1등 당첨자 {draw.winnerCount ?? 0}명</div>
            </div>
            <div className="mt-5">
              <NumberSet numbers={draw.numbers} bonus={draw.bonus} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
