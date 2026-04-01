import type { Metadata } from "next";
import Link from "next/link";

import { AdSlot } from "@/components/ads/ad-slot";
import { FrequencyChart } from "@/components/lotto/frequency-chart";
import {
  computeDashboardSummary,
  computeFrequencyStats,
  drawRepository
} from "@/lib/lotto";
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
      "전체 회차와 최근 10회 기준으로 자주 나온 번호, 적게 나온 번호, 홀짝 비율, 합계 흐름을 한눈에 확인하세요.",
    descriptionEn:
      "Compare overall and recent Lotto number trends, hot numbers, cold numbers, odd-even balance, and sum patterns at a glance."
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

function getTopPatternLabel<T extends { label: string; percentage: number; count: number }>(
  items: T[]
) {
  const item = items[0];

  if (!item) {
    return "데이터 준비 중";
  }

  return `${item.label} · ${item.count}회 (${item.percentage}%)`;
}

function FrequencyCard({
  label,
  stat,
  href,
  accentClass
}: {
  label: string;
  stat: FrequencyStat;
  href: string;
  accentClass: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 transition hover:border-white/30"
    >
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-4xl font-semibold text-white">{stat.number}</p>
        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-medium",
            accentClass
          ].join(" ")}
        >
          {stat.frequency}회
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-400">출현 비율 {stat.percentage}%</p>
      <div className="mt-4 h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-accent"
          style={{ width: `${Math.min(stat.percentage, 100)}%` }}
        />
      </div>
    </Link>
  );
}

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const draws = await drawRepository.getAll();
  const selectedPeriod: StatsPeriod = isValidPeriod(searchParams?.period)
    ? searchParams.period
    : "all";
  const comparisonPeriod: StatsPeriod =
    selectedPeriod === "all" ? "recent_10" : "all";
  const top = clamp(Number.parseInt(searchParams?.top ?? "10", 10) || 10, 5, 15);

  const selectedStats = computeFrequencyStats(draws, selectedPeriod).slice(0, top);
  const comparisonStats = computeFrequencyStats(draws, comparisonPeriod).slice(0, top);
  const selectedSummary = computeDashboardSummary(draws, selectedPeriod);
  const comparisonSummary = computeDashboardSummary(draws, comparisonPeriod);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel">
          <p className="eyebrow">Stats</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">
            한눈에 보는 로또 종합 통계 대시보드
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-slate-300">
            전체 회차와 최근 10회 흐름을 나란히 비교해 자주 나온 번호, 적게 나온 번호,
            홀짝 균형, 합계 분포, 연속번호 비율까지 빠르게 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <Link
              href="/hot-numbers"
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30"
            >
              자주 나온 번호 보기
            </Link>
            <Link
              href="/cold-numbers"
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30"
            >
              적게 나온 번호 보기
            </Link>
            <Link
              href="/recent-10-draw-analysis"
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30"
            >
              최근 10회 분석 보기
            </Link>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Controls</p>
          <div className="mt-4 grid gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                분석 기준
              </p>
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
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                상위 노출 개수
              </p>
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
        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {getPeriodLabel(selectedPeriod)}
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {selectedSummary.totalDraws}회
          </p>
          <p className="mt-2 text-sm text-slate-400">현재 비교에 포함된 회차 수</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            평균 합계
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {selectedSummary.averageSum}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            당첨번호 6개의 평균 합계 기준
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            가장 자주 나온 번호
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {selectedSummary.topNumber.number}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {selectedSummary.topNumber.frequency}회 · {selectedSummary.topNumber.percentage}%
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            연속번호 포함 비율
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {selectedSummary.consecutiveSummary.percentage}%
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {selectedSummary.consecutiveSummary.count}회에서 연속번호 출현
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <p className="eyebrow">Overview</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {getPeriodLabel(selectedPeriod)} 핵심 요약
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FrequencyCard
              label="Hot Number"
              stat={selectedSummary.topNumber}
              href={`/stats/numbers/${selectedSummary.topNumber.number}`}
              accentClass="bg-accent/10 text-white"
            />
            <FrequencyCard
              label="Cold Number"
              stat={selectedSummary.coldNumber}
              href={`/stats/numbers/${selectedSummary.coldNumber.number}`}
              accentClass="bg-sky-500/10 text-sky-200"
            />
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Comparison</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {getPeriodLabel(comparisonPeriod)}와 나란히 보기
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                비교 기준 최다 출현 번호
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {comparisonSummary.topNumber.number}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {comparisonSummary.topNumber.frequency}회 ·{" "}
                {comparisonSummary.topNumber.percentage}%
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                비교 기준 평균 합계
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {comparisonSummary.averageSum}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {getPeriodLabel(comparisonPeriod)} 기준 평균값
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <p className="eyebrow">Pattern Summary</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">패턴 통계 요약</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/odd-even-pattern"
              className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 transition hover:border-white/30"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                홀짝 비율
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {getTopPatternLabel(selectedSummary.oddEvenBreakdown)}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                가장 많이 나온 홀짝 조합
              </p>
            </Link>

            <Link
              href="/sum-pattern"
              className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 transition hover:border-white/30"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                합계 구간
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {getTopPatternLabel(selectedSummary.sumRangeBreakdown)}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                가장 많이 나온 합계 범위
              </p>
            </Link>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/50 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              최근 10회 반복 번호
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {selectedSummary.recentRepeatNumbers.map((item) => (
                <Link
                  key={item.number}
                  href={`/stats/numbers/${item.number}`}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
                >
                  {item.number} · {item.frequency}회
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Guide</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            이 대시보드를 읽는 방법
          </h2>
          <div className="mt-6 grid gap-4">
            {[
              "핫 넘버와 콜드 넘버는 참고 지표일 뿐이며, 다음 회차 당첨을 보장하지 않습니다.",
              "최근 10회와 전체 회차를 같이 보면 단기 흐름과 장기 분포를 함께 볼 수 있습니다.",
              "번호를 누르면 상세 통계와 포함 회차를 바로 확인할 수 있습니다."
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-sm leading-7 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <FrequencyChart
          title={`${getPeriodLabel(selectedPeriod)} 상위 번호 빈도`}
          stats={selectedStats}
          color="rgba(255, 143, 0, 0.72)"
        />
        <FrequencyChart
          title={`${getPeriodLabel(comparisonPeriod)} 상위 번호 빈도`}
          stats={comparisonStats}
          color="rgba(45, 212, 191, 0.72)"
        />
      </section>

      <AdSlot className="max-w-4xl self-center" />

      <section className="grid gap-10 lg:grid-cols-2">
        <div className="panel">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Primary List</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {getPeriodLabel(selectedPeriod)} 상위 번호
              </h2>
            </div>
            <p className="text-sm text-slate-400">상위 {top}개</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {selectedStats.map((item, index) => (
              <FrequencyCard
                key={`selected-${item.number}`}
                label={`Rank ${index + 1}`}
                stat={item}
                href={`/stats/numbers/${item.number}`}
                accentClass="bg-accent/10 text-white"
              />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Comparison List</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {getPeriodLabel(comparisonPeriod)} 상위 번호
              </h2>
            </div>
            <p className="text-sm text-slate-400">상위 {top}개</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {comparisonStats.map((item, index) => (
              <FrequencyCard
                key={`comparison-${item.number}`}
                label={`Rank ${index + 1}`}
                stat={item}
                href={`/stats/numbers/${item.number}`}
                accentClass="bg-sky-500/10 text-sky-200"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
