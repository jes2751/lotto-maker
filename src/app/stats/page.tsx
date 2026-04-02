import type { Metadata } from "next";
import Link from "next/link";

import { AdSlot } from "@/components/ads/ad-slot";
import { FrequencyChart } from "@/components/lotto/frequency-chart";
import { clamp } from "@/lib/lotto/shared";
import { computeDashboardSummary, computeFrequencyStats, drawRepository } from "@/lib/lotto";
import { createPageMetadata } from "@/lib/site";
import type { FrequencyStat, StatsPeriod } from "@/types/lotto";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/stats",
    titleKo: "로또 통계",
    titleEn: "Lotto Statistics Dashboard",
    descriptionKo: "전체 회차와 최근 10회 기준으로 자주 나온 번호, 합계, 홀짝 비율, 최근 흐름을 비교합니다.",
    descriptionEn:
      "Compare overall and recent trends, including hot numbers, sums, odd-even balance, and consecutive-number rates."
  })
};

interface StatsPageProps {
  searchParams?: Promise<{
    period?: string;
    top?: string;
  }>;
}

function isValidPeriod(value: string | undefined): value is StatsPeriod {
  return value === "all" || value === "recent_10";
}

function getPeriodLabel(period: StatsPeriod) {
  return period === "all" ? "전체 회차" : "최근 10회";
}

function buildStatsHref(period: StatsPeriod, top: number) {
  const params = new URLSearchParams();
  params.set("period", period);
  params.set("top", String(top));
  return `/stats?${params.toString()}`;
}

function FrequencyCard({ label, stat, href }: { label: string; stat: FrequencyStat; href: string }) {
  return (
    <Link href={href} className="soft-card transition hover:border-white/20">
      <p className="text-base text-slate-300">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-4xl font-semibold text-white">{stat.number}</p>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-white">{stat.frequency}회</span>
      </div>
      <p className="mt-3 text-sm text-slate-400">출현 비율 {stat.percentage}%</p>
    </Link>
  );
}

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const params = (await searchParams) ?? {};
  const draws = await drawRepository.getAll();
  const selectedPeriod: StatsPeriod = isValidPeriod(params.period) ? params.period : "all";
  const comparisonPeriod: StatsPeriod = selectedPeriod === "all" ? "recent_10" : "all";
  const top = clamp(Number.parseInt(params.top ?? "10", 10) || 10, 5, 15);

  const selectedStats = computeFrequencyStats(draws, selectedPeriod).slice(0, top);
  const comparisonStats = computeFrequencyStats(draws, comparisonPeriod).slice(0, top);
  const selectedSummary = computeDashboardSummary(draws, selectedPeriod);
  const comparisonSummary = computeDashboardSummary(draws, comparisonPeriod);
  const oddEvenLeader = selectedSummary.oddEvenBreakdown[0]?.label ?? "-";
  const sumRangeLeader = selectedSummary.sumRangeBreakdown[0]?.label ?? "-";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="panel hero-panel grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="eyebrow">통계 대시보드</p>
          <h1 className="section-title mt-4 text-gradient-silver">전체 흐름과 최근 흐름을 한 번에 비교해보세요</h1>
          <p className="body-large mt-4 max-w-4xl text-slate-300">
            전체 회차와 최근 10회 기준으로 자주 나온 번호, 평균 합계, 홀짝 비율, 연속번호 흐름을 비교할 수
            있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/hot-numbers" className="secondary-button">
              자주 나온 번호
            </Link>
            <Link href="/cold-numbers" className="secondary-button">
              적게 나온 번호
            </Link>
            <Link href="/recent-10-draw-analysis" className="secondary-button">
              최근 10회 분석
            </Link>
          </div>
        </div>

        <div className="soft-card">
          <p className="eyebrow">비교 기준</p>
          <div className="mt-5 grid gap-5">
            <div>
              <p className="text-base text-slate-300">조회 기간</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {(["all", "recent_10"] as StatsPeriod[]).map((period) => (
                  <Link
                    key={period}
                    href={buildStatsHref(period, top)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-medium transition",
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
              <p className="text-base text-slate-300">표시 개수</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {[5, 10, 15].map((value) => (
                  <Link
                    key={value}
                    href={buildStatsHref(selectedPeriod, value)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-medium transition",
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

      <section className="panel">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <article className="kpi-cell">
            <p className="text-base text-slate-300">{getPeriodLabel(selectedPeriod)}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{selectedSummary.totalDraws}회</p>
            <p className="mt-2 text-sm text-slate-400">현재 선택 기준으로 비교 중인 회차 수입니다.</p>
          </article>
          <article className="kpi-cell">
            <p className="text-base text-slate-300">평균 합계</p>
            <p className="mt-3 text-3xl font-semibold text-white">{selectedSummary.averageSum}</p>
            <p className="mt-2 text-sm text-slate-400">6개 번호 합계의 평균값입니다.</p>
          </article>
          <article className="kpi-cell">
            <p className="text-base text-slate-300">대표 홀짝 비율</p>
            <p className="mt-3 text-3xl font-semibold text-white">{oddEvenLeader}</p>
            <p className="mt-2 text-sm text-slate-400">가장 자주 나온 홀짝 조합입니다.</p>
          </article>
          <article className="kpi-cell">
            <p className="text-base text-slate-300">대표 합계 구간</p>
            <p className="mt-3 text-3xl font-semibold text-white">{sumRangeLeader}</p>
            <p className="mt-2 text-sm text-slate-400">가장 많이 나온 합계 구간입니다.</p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <p className="eyebrow">핵심 번호</p>
          <h2 className="section-subtitle mt-3 text-white">{getPeriodLabel(selectedPeriod)} 기준 자주 나온 번호</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FrequencyCard
              label="가장 자주 나온 번호"
              stat={selectedSummary.topNumber}
              href={`/stats/numbers/${selectedSummary.topNumber.number}`}
            />
            <FrequencyCard
              label="가장 적게 나온 번호"
              stat={selectedSummary.coldNumber}
              href={`/stats/numbers/${selectedSummary.coldNumber.number}`}
            />
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">비교</p>
          <h2 className="section-subtitle mt-3 text-white">{getPeriodLabel(comparisonPeriod)} 기준 비교</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="soft-card">
              <p className="text-base text-slate-300">가장 자주 나온 번호</p>
              <p className="mt-3 text-3xl font-semibold text-white">{comparisonSummary.topNumber.number}</p>
              <p className="mt-2 text-sm text-slate-400">
                {comparisonSummary.topNumber.frequency}회 · {comparisonSummary.topNumber.percentage}%
              </p>
            </article>
            <article className="soft-card">
              <p className="text-base text-slate-300">평균 합계</p>
              <p className="mt-3 text-3xl font-semibold text-white">{comparisonSummary.averageSum}</p>
              <p className="mt-2 text-sm text-slate-400">{getPeriodLabel(comparisonPeriod)} 기준 평균값입니다.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <FrequencyChart title={`${getPeriodLabel(selectedPeriod)} 상위 번호`} stats={selectedStats} color="rgba(255, 143, 0, 0.72)" />
        <FrequencyChart title={`${getPeriodLabel(comparisonPeriod)} 상위 번호`} stats={comparisonStats} color="rgba(45, 212, 191, 0.72)" />
      </section>

      <AdSlot className="max-w-4xl self-center" />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <p className="eyebrow">최근 흐름</p>
          <h2 className="section-subtitle mt-3 text-white">최근 10회에서 반복된 번호</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {selectedSummary.recentRepeatNumbers.map((item) => (
              <Link
                key={item.number}
                href={`/stats/numbers/${item.number}`}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
              >
                {item.number} <span className="text-slate-400">{item.frequency}회</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">해석 포인트</p>
          <h2 className="section-subtitle mt-3 text-white">통계를 볼 때 같이 보면 좋은 기준</h2>
          <div className="mt-6 grid gap-4">
            {[
              "전체 회차 기준 통계와 최근 10회 흐름을 함께 보면 단기 변화와 장기 흐름을 같이 볼 수 있습니다.",
              "홀짝 비율과 합계 구간은 대표 패턴을 보는 기준이고, 번호 통계는 개별 번호의 흐름을 보는 기준입니다.",
              "추천 번호는 참고용이며, 통계는 번호 선택을 돕는 보조 정보로 보는 것이 가장 안전합니다."
            ].map((item) => (
              <article key={item} className="soft-card text-sm leading-7 text-slate-300">
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
