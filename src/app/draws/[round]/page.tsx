import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";
import { createPageMetadata } from "@/lib/site";

interface DrawDetailPageProps {
  params: Promise<{
    round: string;
  }>;
}

export async function generateMetadata({ params }: DrawDetailPageProps): Promise<Metadata> {
  const { round: roundParam } = await params;
  const round = Number.parseInt(roundParam, 10);
  const draw = Number.isInteger(round) ? await drawRepository.getByRound(round) : null;

  if (!draw) {
    return createPageMetadata({
      locale: "ko",
      path: "/draws",
      titleKo: "로또 회차 상세",
      titleEn: "Lotto Draw Detail",
      descriptionKo: "선택한 회차의 당첨번호와 기본 요약 정보를 확인할 수 있습니다.",
      descriptionEn: "View Lotto winning numbers and a short summary for a specific round."
    });
  }

  return createPageMetadata({
    locale: "ko",
    path: `/draws/${draw.round}`,
    titleKo: `${draw.round}회 당첨번호`,
    titleEn: `Round ${draw.round} Lotto Result`,
    descriptionKo: `${draw.round}회의 당첨번호, 추첨일, 보너스 번호, 당첨 요약 정보를 확인할 수 있습니다.`,
    descriptionEn: `Check the winning numbers, draw date, bonus number, and summary for round ${draw.round}.`
  });
}

function formatWonAmount(value?: number | null) {
  if (!value) {
    return "정보 없음";
  }

  return `${Math.round(value / 100000000)}억 원`;
}

export default async function DrawDetailPage({ params }: DrawDetailPageProps) {
  const { round: roundParam } = await params;
  const round = Number.parseInt(roundParam, 10);

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
      <section className="panel hero-panel">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">회차 상세</p>
            <h1 className="section-title mt-4 text-gradient-silver">{draw.round}회 당첨번호</h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              {draw.drawDate} 추첨 결과와 기본 요약을 확인하고, 번호별 통계나 회차 분석으로 이어서 탐색할 수 있습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/draws" className="secondary-button">
              전체 회차 보기
            </Link>
            <Link href={`/draw-analysis/${draw.round}`} className="cta-button">
              회차 분석 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">당첨 번호</p>
            {isLatest ? (
              <span className="status-badge">
                Latest Round
              </span>
            ) : null}
          </div>

          <div className="mt-6">
            <NumberSet
              numbers={draw.numbers}
              bonus={draw.bonus}
              hrefBuilder={(value) => `/stats/numbers/${value}`}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="kpi-cell">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Round</p>
              <p className="mt-2 text-2xl font-semibold text-white">{draw.round}회</p>
            </div>
            <div className="kpi-cell">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Draw Date</p>
              <p className="mt-2 text-lg font-semibold text-white md:text-xl">{draw.drawDate}</p>
            </div>
            <div className="kpi-cell">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Winners</p>
              <p className="mt-2 text-2xl font-semibold text-white">{draw.winnerCount ?? 0}명</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href={newerDraw ? `/draws/${newerDraw.round}` : "#"}
              aria-disabled={!newerDraw}
              className={[
                "interactive-card text-sm",
                newerDraw
                  ? "text-slate-200 hover:border-white/20"
                  : "cursor-not-allowed border-white/5 bg-slate-950/20 text-slate-600"
              ].join(" ")}
            >
              {newerDraw ? `${newerDraw.round}회로 이동` : "더 최신 회차 없음"}
            </Link>
            <Link
              href={olderDraw ? `/draws/${olderDraw.round}` : "#"}
              aria-disabled={!olderDraw}
              className={[
                "interactive-card text-sm",
                olderDraw
                  ? "text-slate-200 hover:border-white/20"
                  : "cursor-not-allowed border-white/5 bg-slate-950/20 text-slate-600"
              ].join(" ")}
            >
              {olderDraw ? `${olderDraw.round}회로 이동` : "더 이전 회차 없음"}
            </Link>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">요약</p>
          <div className="mt-4 space-y-3">
            <div className="kpi-cell">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Top Prize</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatWonAmount(draw.firstPrize)}</p>
            </div>
            <div className="kpi-cell">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Total Prize</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatWonAmount(draw.totalPrize)}</p>
            </div>
            <div className="soft-card text-sm leading-7 text-slate-300">
              번호별 통계, 회차 분석, 최신 결과 허브를 함께 보면 이 회차가 최근 흐름에서 어떤 위치에 있는지 더 잘 읽을 수 있습니다.
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href={`/draw-analysis/${draw.round}`} className="secondary-button">
                회차 분석 보기
              </Link>
              <Link href="/draw-analysis" className="secondary-button">
                분석 허브
              </Link>
              <Link href="/latest-lotto-results" className="secondary-button">
                최신 결과 허브
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
