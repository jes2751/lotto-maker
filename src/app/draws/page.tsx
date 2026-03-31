import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";

interface DrawsPageProps {
  searchParams?: {
    round?: string;
  };
}

function formatWonAmount(value?: number | null) {
  if (!value) {
    return "정보 없음";
  }

  return `${Math.round(value / 100000000)}억 원`;
}

export default async function DrawsPage({ searchParams }: DrawsPageProps) {
  const { draws } = await drawRepository.list({ limit: 12, offset: 0 });
  const latest = draws[0] ?? null;
  const roundQuery = searchParams?.round?.trim() ?? "";
  const requestedRound = Number.parseInt(roundQuery, 10);
  const searchedDraw =
    roundQuery && Number.isInteger(requestedRound) && requestedRound > 0 ? await drawRepository.getByRound(requestedRound) : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel">
          <p className="eyebrow">Draws</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">최근 회차 조회</h1>
          <p className="mt-3 text-slate-300">정적 시드 데이터 기준 최신 12개 회차를 우선 보여줍니다.</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Find Round</p>
          <form action="/draws" className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="number"
              min="1"
              name="round"
              defaultValue={roundQuery}
              placeholder="예: 1169"
              className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500"
            />
            <button type="submit" className="cta-button">
              회차 찾기
            </button>
          </form>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">최신 회차</p>
              <p className="mt-2 text-2xl font-semibold text-white">{latest ? `${latest.round}회` : "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">목록 개수</p>
              <p className="mt-2 text-2xl font-semibold text-white">{draws.length}개</p>
            </div>
          </div>
        </div>
      </section>

      {roundQuery ? (
        <section className="panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Search Result</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">회차 바로 찾기 결과</h2>
            </div>
            {searchedDraw ? (
              <Link href={`/draws/${searchedDraw.round}`} className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30">
                상세 보기
              </Link>
            ) : null}
          </div>
          {searchedDraw ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-2xl font-semibold text-white">{searchedDraw.round}회</p>
                <p className="mt-1 text-sm text-slate-400">{searchedDraw.drawDate}</p>
                <p className="mt-4 text-sm text-slate-300">1등 당첨자 {searchedDraw.winnerCount ?? 0}명</p>
              </div>
              <div>
                <NumberSet numbers={searchedDraw.numbers} bonus={searchedDraw.bonus} />
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              입력한 회차를 찾지 못했습니다. 현재 시드 데이터 범위 안의 회차를 다시 확인해 주세요.
            </div>
          )}
        </section>
      ) : null}

      <div className="grid gap-4">
        {draws.map((draw) => (
          <article key={draw.round} className="panel">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold text-white">{draw.round}회</p>
                <p className="mt-1 text-sm text-slate-400">{draw.drawDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-400">1등 당첨자 {draw.winnerCount ?? 0}명</div>
                <Link
                  href={`/draws/${draw.round}`}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
                >
                  Detail
                </Link>
              </div>
            </div>
            <div className="mt-5">
              <NumberSet numbers={draw.numbers} bonus={draw.bonus} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
                총 판매금: {formatWonAmount(draw.totalPrize)}
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
                1등 당첨금: {formatWonAmount(draw.firstPrize)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
