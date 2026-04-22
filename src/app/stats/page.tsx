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
    titleKo: "과거 1등 데이터",
    titleEn: "Lotto Statistics Dashboard",
    descriptionKo: "과거 공식 당첨 기록 기준으로 자주 나온 번호, 합계, 홀짝 비율, 최근 흐름을 비교합니다.",
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
  const entryCards = [
    {
      href: "/hot-numbers",
      kicker: "핵심 번호",
      title: "자주 나온 번호",
      body: "전체 회차 기준으로 많이 나온 번호를 먼저 확인합니다."
    },
    {
      href: "/cold-numbers",
      kicker: "반대 신호",
      title: "적게 나온 번호",
      body: "상대적으로 조용했던 번호를 따로 모아 비교합니다."
    },
    {
      href: "/odd-even-pattern",
      kicker: "패턴 분석 1",
      title: "홀짝 패턴",
      body: "홀짝 비율이 어떤 조합으로 자주 나왔는지 확인합니다."
    },
    {
      href: "/sum-pattern",
      kicker: "패턴 분석 2",
      title: "합계 패턴",
      body: "번호 6개의 합계 구간이 어떻게 분포되는지 파악합니다."
    },
    {
      href: "/recent-10-draw-analysis",
      kicker: "단기 변화",
      title: "최근 10회 해석",
      body: "짧은 구간에서 반복되는 흐름을 먼저 보고 싶을 때 유용합니다."
    }
  ] as const;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="panel hero-panel flex flex-col gap-8">
        <div>
          <p className="eyebrow">로또 통계 허브</p>
          <h1 className="section-title mt-4 text-gradient-silver">공식 당첨 기록으로 흐름을 판단하세요</h1>
          <p className="body-large mt-4 max-w-4xl text-slate-300">
            이 화면은 전체 로또 통계 지표를 한눈에 보여주는 메인 대시보드입니다. 장기 흐름과 최근 10회 흐름을 함께 비교해 보시고, 하단의 주제별 심층 분석 카드를 통해 원하는 패턴으로 즉시 진입하세요.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {["공식 당첨 기록", "장기 흐름", "최근 10회", "실제 결과 기준"].map((item) => (
              <span key={item} className="spark-pill">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="soft-card border-teal/20 bg-[linear-gradient(180deg,rgba(45,212,191,0.12)_0%,rgba(15,23,42,0.94)_100%)]">
          <p className="eyebrow">공식 기준판</p>
          <h2 className="mt-4 text-[1.45rem] font-semibold leading-[1.2] text-white">
            실제 당첨 기록만 보고 장기 기준과 최근 변화를 같이 잡습니다
          </h2>
          <div className="mt-5 flex flex-col gap-6">
            <div className="flex flex-wrap items-start gap-x-12 gap-y-6">
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
            <div className="grid gap-3">
              {[
                `${getPeriodLabel(selectedPeriod)} 기준으로 가장 먼저 봐야 할 번호는 ${selectedSummary.topNumber.number}번입니다.`,
                `대표 홀짝은 ${oddEvenLeader}, 대표 합계 구간은 ${sumRangeLeader}입니다.`,
                "공식 데이터로 기준을 잡은 뒤에만 우리 유저 데이터와 비교해 군중 쏠림을 보는 편이 좋습니다."
              ].map((item) => (
                <div key={item} className="signal-row">
                  <span className="signal-row-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="panel mt-2">
        <h2 className="mb-4 text-xl font-semibold text-white">주제별 심층 분석</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {entryCards.map((item) => (
            <Link key={item.title} href={item.href} className="play-card">
              <span className="play-card-kicker">{item.kicker}</span>
              <span className="play-card-title">{item.title}</span>
              <span className="play-card-body">{item.body}</span>
            </Link>
          ))}
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
          <h2 className="section-subtitle mt-3 text-white">{getPeriodLabel(selectedPeriod)}에서 먼저 봐야 할 번호</h2>
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
          <h2 className="section-subtitle mt-3 text-white">{getPeriodLabel(comparisonPeriod)}와 붙여 보기</h2>
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
          <h2 className="section-subtitle mt-3 text-white">최근 10회에서 다시 튀는 번호</h2>
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
          <p className="eyebrow">읽는 법</p>
          <h2 className="section-subtitle mt-3 text-white">공식 당첨 기록을 판단 근거로 쓰는 기준</h2>
          <div className="mt-6 grid gap-4">
            {[
              "먼저 강한 번호를 잡고, 그 다음 최근 10회 쪽으로 시선을 옮기면 지금 바뀌는 흐름이 보입니다.",
              "홀짝과 합계는 분위기를 읽는 기준이고, 번호 통계는 실제 선택 후보를 좁히는 기준입니다.",
              "공식 데이터로 흐름을 잡고, 그 다음 우리 유저 데이터에서 많이 몰리는 번호인지까지 같이 보면 더 입체적으로 판단할 수 있습니다."
            ].map((item) => (
              <article key={item} className="soft-card text-sm leading-7 text-slate-300">
                {item}
              </article>
            ))}
            <Link href="/generated-stats" className="secondary-button justify-center">
              우리 유저 데이터로 이어 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="panel mt-2">
        <h2 className="text-xl font-semibold text-white">로또 통계 분석 가이드</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          과거의 로또 당첨 번호를 분석하는 것은 단순히 '다음에 확실히 나올 번호'를 예측하는 것이 아닙니다. 매 회차의 추첨은 독립 시행이므로 수학적 확률은 항상 동일합니다. 하지만 누적된 데이터를 통해 사람들이 어떤 번호를 선호하는지, 어떤 패턴(예: 특정 홀짝 비율, 합계 구간)이 평균적으로 자주 발생했는지를 파악할 수 있습니다. 
          이러한 통계적 접근은 특정 번호 조합에 군중이 몰리는 현상(겹침 현상)을 회피하여, 만약 1등에 당첨되었을 때 수령할 당첨금의 기대 가치를 높이는 전략적인 선택을 돕습니다. '장기 흐름'을 통해 전체적인 출현 빈도를 확인하고, '최근 10회'를 통해 단기적인 번호 출현의 쏠림 현상을 분석해 보세요.
        </p>
      </section>
    </div>
  );
}
