import Link from "next/link";

import { AdSlot } from "@/components/ads/ad-slot";
import { FrequencyChart } from "@/components/lotto/frequency-chart";
import { computeFrequencyStats, drawRepository } from "@/lib/lotto";
import { clamp } from "@/lib/lotto/shared";
import type { StatsPeriod } from "@/types/lotto";

interface StatsPageProps {
  searchParams?: {
    period?: string;
    top?: string;
  };
}

function FrequencyCard({
  label,
  value,
  frequency,
  percentage
}: {
  label: string;
  value: number;
  frequency: number;
  percentage: number;
}) {
  return (
    <Link href={`/stats/numbers/${value}`} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
      <p className="text-xs uppercase tracking-[0.26em] text-slate-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">등장 {frequency}회</p>
      <div className="mt-4 h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-accent" style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">회차 대비 {percentage}%</p>
    </Link>
  );
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

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const draws = await drawRepository.getAll();
  const selectedPeriod: StatsPeriod = isValidPeriod(searchParams?.period) ? searchParams.period : "all";
  const comparisonPeriod: StatsPeriod = selectedPeriod === "all" ? "recent_10" : "all";
  const top = clamp(Number.parseInt(searchParams?.top ?? "10", 10) || 10, 5, 15);

  const selectedStats = computeFrequencyStats(draws, selectedPeriod).slice(0, top);
  const comparisonStats = computeFrequencyStats(draws, comparisonPeriod).slice(0, top);
  const selectedTop = selectedStats[0];
  const comparisonTop = comparisonStats[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel">
          <p className="eyebrow">Stats</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">기본 빈도 통계</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            메인 번호 기준의 단순 빈도 통계입니다. 전체 회차와 최근 10회를 나란히 비교하면서 자주 나온 번호 흐름을 빠르게 확인할 수 있습니다.
          </p>
        </div>
        <div className="panel">
          <p className="eyebrow">Controls</p>
          <div className="mt-4 grid gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">기간 선택</p>
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
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">표시 개수</p>
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

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <p className="eyebrow">Primary</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{getPeriodLabel(selectedPeriod)} 1위</p>
              <p className="mt-2 text-2xl font-semibold text-white">{selectedTop?.number ?? "-"}</p>
              <p className="mt-1 text-sm text-slate-400">등장 {selectedTop?.frequency ?? 0}회</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">전체 회차 수</p>
              <p className="mt-2 text-2xl font-semibold text-white">{draws.length}개</p>
              <p className="mt-1 text-sm text-slate-400">현재 데이터셋 기준</p>
            </div>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Comparison</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{getPeriodLabel(comparisonPeriod)} 1위</p>
              <p className="mt-2 text-2xl font-semibold text-white">{comparisonTop?.number ?? "-"}</p>
              <p className="mt-1 text-sm text-slate-400">등장 {comparisonTop?.frequency ?? 0}회</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">현재 보기</p>
              <p className="mt-2 text-2xl font-semibold text-white">상위 {top}개</p>
              <p className="mt-1 text-sm text-slate-400">{getPeriodLabel(selectedPeriod)} 기준</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <FrequencyChart title={`${getPeriodLabel(selectedPeriod)} 상위 번호 분포`} stats={selectedStats} color="rgba(255, 143, 0, 0.72)" />
        <FrequencyChart title={`${getPeriodLabel(comparisonPeriod)} 상위 번호 분포`} stats={comparisonStats} color="rgba(45, 212, 191, 0.72)" />
      </section>

      <AdSlot className="max-w-4xl self-center" />

      <section className="grid gap-10 lg:grid-cols-2">
        <div className="panel">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Primary List</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{getPeriodLabel(selectedPeriod)} 상위 번호</h2>
            </div>
            <p className="text-sm text-slate-400">상위 {top}개</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {selectedStats.map((item, index) => (
              <FrequencyCard key={`selected-${item.number}`} label={`Rank ${index + 1}`} value={item.number} frequency={item.frequency} percentage={item.percentage} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Comparison List</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{getPeriodLabel(comparisonPeriod)} 상위 번호</h2>
            </div>
            <p className="text-sm text-slate-400">상위 {top}개</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {comparisonStats.map((item, index) => (
              <FrequencyCard key={`comparison-${item.number}`} label={`Rank ${index + 1}`} value={item.number} frequency={item.frequency} percentage={item.percentage} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
