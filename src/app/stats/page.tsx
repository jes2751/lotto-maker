import type { Metadata } from "next";
import Link from "next/link";

import { AdSlot } from "@/components/ads/ad-slot";
import { FrequencyChart } from "@/components/lotto/frequency-chart";
import { computeDashboardSummary, computeFrequencyStats, drawRepository } from "@/lib/lotto";
import { clamp } from "@/lib/lotto/shared";
import { createPageMetadata } from "@/lib/site";
import type { FrequencyStat, StatsPeriod } from "@/types/lotto";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/stats",
    titleKo: "로또 통계 대시보드",
    titleEn: "Lotto Statistics Dashboard",
    descriptionKo:
      "전체 회차와 최근 10회 기준으로 자주 나온 번호, 합계 흐름, 홀짝 비율, 연속번호 포함 비율을 한눈에 볼 수 있습니다.",
    descriptionEn:
      "Compare overall and recent Lotto trends, hot numbers, average sums, odd-even balance, and consecutive-number rates."
  })
};

interface StatsPageProps {
  searchParams?: {
    period?: string;
    top?: string;
  };
}

function isValidPeriod(value: string | undefined): value is StatsPeriod {
  return value === "all" || value === "recent_10";
}

function getPeriodLabel(period: StatsPeriod) {
  return period === "all" ? "전체 회차" : "최근 10회";
}

function buildStatsHref(period: StatsPeriod, top: number) {
  const searchParams = new URLSearchParams();
  searchParams.set("period", period);
  searchParams.set("top", String(top));
  return `/stats?${searchParams.toString()}`;
}

function FrequencyCard({
  label,
  stat,
  href
}: {
  label: string;
  stat: FrequencyStat;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 transition hover:border-white/30">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-4xl font-semibold text-white">{stat.number}</p>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-white">
          {stat.frequency}회
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-400">출현률 {stat.percentage}%</p>
    </Link>
  );
}

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const draws = await drawRepository.getAll();
  const selectedPeriod: StatsPeriod = isValidPeriod(searchParams?.period) ? searchParams.period : "all";
  const comparisonPeriod: StatsPeriod = selectedPeriod === "all" ? "recent_10" : "all";
  const top = clamp(Number.parseInt(searchParams?.top ?? "10", 10) || 10, 5, 15);

  const selectedStats = computeFrequencyStats(draws, selectedPeriod).slice(0, top);
  const comparisonStats = computeFrequencyStats(draws, comparisonPeriod).slice(0, top);
  const selectedSummary = computeDashboardSummary(draws, selectedPeriod);
  const comparisonSummary = computeDashboardSummary(draws, comparisonPeriod);
  const oddEvenLeader = selectedSummary.oddEvenBreakdown[0]?.label ?? "-";
  const sumRangeLeader = selectedSummary.sumRangeBreakdown[0]?.label ?? "-";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel">
          <p className="eyebrow">통계 대시보드</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">많이 보는 통계만 먼저 정리했습니다</h1>
          <p className="mt-4 max-w-3xl leading-8 text-slate-300">
            전체 회차와 최근 10회를 비교하면서 자주 나온 번호, 평균 합계, 홀짝 비율, 연속번호 포함 비율을
            빠르게 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/hot-numbers" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30">
              자주 나온 번호
            </Link>
            <Link href="/cold-numbers" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30">
              적게 나온 번호
            </Link>
            <Link href="/recent-10-draw-analysis" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30">
              최근 10회 분석
            </Link>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">보기 설정</p>
          <div className="mt-4 grid gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">기준 구간</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {(["all", "recent_10"] as StatsPeriod[]).map((period) => (
                  <Link
                    key={period}
                    href={buildStatsHref(period, top)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm transition",
                      selectedPeriod === period
                        ? "border-accent bg-accent/10 text-white"
                        : "border-white/10 text-slate-300 hover:border-white/30"
                    ].join(" ")}
                  >
                    {getPeriodLabel(period)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">상위 번호 수</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {[5, 10, 15].map((value) => (
                  <Link
                    key={value}
                    href={buildStatsHref(selectedPeriod, value)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm transition",
                      top === value
                        ? "border-accent bg-accent/10 text-white"
                        : "border-white/10 text-slate-300 hover:border-white/30"
                    ].join(" ")}
                  >
                    상위 {value}개
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{getPeriodLabel(selectedPeriod)}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{selectedSummary.totalDraws}회</p>
          <p className="mt-2 text-sm text-slate-400">비교에 사용된 회차 수</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">평균 합계</p>
          <p className="mt-3 text-3xl font-semibold text-white">{selectedSummary.averageSum}</p>
          <p className="mt-2 text-sm text-slate-400">번호 6개의 평균 합계</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">대표 홀짝 비율</p>
          <p className="mt-3 text-3xl font-semibold text-white">{oddEvenLeader}</p>
          <p className="mt-2 text-sm text-slate-400">가장 자주 나온 홀짝 조합</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">대표 합계 구간</p>
          <p className="mt-3 text-3xl font-semibold text-white">{sumRangeLeader}</p>
          <p className="mt-2 text-sm text-slate-400">가장 자주 나온 합계 범위</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <p className="eyebrow">핵심 번호</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{getPeriodLabel(selectedPeriod)} 기준 핵심 번호</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FrequencyCard label="가장 많이 나온 번호" stat={selectedSummary.topNumber} href={`/stats/numbers/${selectedSummary.topNumber.number}`} />
            <FrequencyCard label="가장 적게 나온 번호" stat={selectedSummary.coldNumber} href={`/stats/numbers/${selectedSummary.coldNumber.number}`} />
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">비교 구간</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{getPeriodLabel(comparisonPeriod)}와 함께 보기</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">가장 많이 나온 번호</p>
              <p className="mt-3 text-3xl font-semibold text-white">{comparisonSummary.topNumber.number}</p>
              <p className="mt-2 text-sm text-slate-400">
                {comparisonSummary.topNumber.frequency}회 · {comparisonSummary.topNumber.percentage}%
              </p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">평균 합계</p>
              <p className="mt-3 text-3xl font-semibold text-white">{comparisonSummary.averageSum}</p>
              <p className="mt-2 text-sm text-slate-400">{getPeriodLabel(comparisonPeriod)} 기준 평균</p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <FrequencyChart
          title={`${getPeriodLabel(selectedPeriod)} 상위 번호`}
          stats={selectedStats}
          color="rgba(255, 143, 0, 0.72)"
        />
        <FrequencyChart
          title={`${getPeriodLabel(comparisonPeriod)} 상위 번호`}
          stats={comparisonStats}
          color="rgba(45, 212, 191, 0.72)"
        />
      </section>

      <AdSlot className="max-w-4xl self-center" />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <p className="eyebrow">최근 반복 번호</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">최근 10회에서 자주 보인 번호</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {selectedSummary.recentRepeatNumbers.map((item) => (
              <Link
                key={item.number}
                href={`/stats/numbers/${item.number}`}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
              >
                {item.number} <span className="text-slate-500">{item.frequency}회</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">통계 읽는 방법</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">숫자 흐름을 보는 최소 기준</h2>
          <div className="mt-6 grid gap-4">
            {[
              "자주 나온 번호만 보지 말고 최근 10회 기준 흐름도 함께 보세요.",
              "대표 홀짝 비율과 평균 합계를 같이 보면 조합 감각을 잡기 쉽습니다.",
              "통계는 참고용입니다. 특정 번호를 당첨 번호로 보장하지 않습니다."
            ].map((item) => (
              <article key={item} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-sm leading-7 text-slate-300">
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
