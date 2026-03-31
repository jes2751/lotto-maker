import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";

interface DrawDetailPageProps {
  params: {
    round: string;
  };
}

export async function generateMetadata({ params }: DrawDetailPageProps): Promise<Metadata> {
  const round = Number.parseInt(params.round, 10);
  const draw = Number.isInteger(round) ? await drawRepository.getByRound(round) : null;

  if (!draw) {
    return {
      title: "로또 회차 상세",
      description: "특정 회차의 로또 당첨번호와 기본 통계를 확인하는 페이지입니다."
    };
  }

  return {
    title: `${draw.round}회 로또 당첨번호`,
    description: `${draw.round}회 로또 당첨번호와 추첨일, 보너스 번호, 기본 통계를 확인할 수 있습니다.`
  };
}

function formatWonAmount(value?: number | null) {
  if (!value) {
    return "정보 없음";
  }

  return `${Math.round(value / 100000000)}억 원`;
}

export default async function DrawDetailPage({ params }: DrawDetailPageProps) {
  const round = Number.parseInt(params.round, 10);

  if (!Number.isInteger(round) || round < 1) {
    notFound();
  }

  const [draw, latest, allDraws] = await Promise.all([
    drawRepository.getByRound(round),
    drawRepository.getLatest(),
    drawRepository.getAll()
  ]);

  if (!draw) {
    notFound();
  }

  const currentIndex = allDraws.findIndex((item) => item.round === draw.round);
  const newerDraw = currentIndex > 0 ? allDraws[currentIndex - 1] : null;
  const olderDraw = currentIndex >= 0 && currentIndex < allDraws.length - 1 ? allDraws[currentIndex + 1] : null;
  const isLatest = latest?.round === draw.round;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Draw Detail</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">{draw.round}회 당첨번호 상세</h1>
          <p className="mt-3 text-slate-300">{draw.drawDate} 추첨 결과와 기본 정보를 한 화면에서 정리했습니다.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/draws"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            목록으로 돌아가기
          </Link>
          <Link href="/generate" className="cta-button">
            추천기로 이동
          </Link>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">Winning Numbers</p>
            {isLatest ? (
              <span className="rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-teal">
                최신 회차
              </span>
            ) : null}
          </div>
          <div className="mt-6">
            <NumberSet numbers={draw.numbers} bonus={draw.bonus} hrefBuilder={(value) => `/stats/numbers/${value}`} />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">회차</p>
              <p className="mt-2 text-2xl font-semibold text-white">{draw.round}회</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">추첨일</p>
              <p className="mt-2 text-2xl font-semibold text-white">{draw.drawDate}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">1등 당첨자</p>
              <p className="mt-2 text-2xl font-semibold text-white">{draw.winnerCount ?? 0}명</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href={newerDraw ? `/draws/${newerDraw.round}` : "#"}
              aria-disabled={!newerDraw}
              className={[
                "rounded-2xl border px-4 py-4 text-sm transition",
                newerDraw
                  ? "border-white/10 bg-slate-950/40 text-slate-200 hover:border-white/30"
                  : "cursor-not-allowed border-white/5 bg-slate-950/20 text-slate-600"
              ].join(" ")}
            >
              {newerDraw ? `${newerDraw.round}회로 이동` : "더 최신 회차 없음"}
            </Link>
            <Link
              href={olderDraw ? `/draws/${olderDraw.round}` : "#"}
              aria-disabled={!olderDraw}
              className={[
                "rounded-2xl border px-4 py-4 text-sm transition",
                olderDraw
                  ? "border-white/10 bg-slate-950/40 text-slate-200 hover:border-white/30"
                  : "cursor-not-allowed border-white/5 bg-slate-950/20 text-slate-600"
              ].join(" ")}
            >
              {olderDraw ? `${olderDraw.round}회로 이동` : "더 이전 회차 없음"}
            </Link>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Summary</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">1등 당첨금</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatWonAmount(draw.firstPrize)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">총 판매금</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatWonAmount(draw.totalPrize)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-7 text-slate-400">
              번호 볼을 누르면 해당 번호의 상세 통계로 이동합니다. 회차 흐름과 번호 흐름을 함께 보려는 사용자를 위한 상세 화면입니다.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
