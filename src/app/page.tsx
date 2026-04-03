import type { Metadata } from "next";
import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { computeDashboardSummary, computeFrequencyStats, drawRepository } from "@/lib/lotto";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/",
    titleKo: "최신 결과, 번호 생성, 핵심 통계",
    titleEn: "Latest result, generator, and core statistics",
    descriptionKo:
      "최신 당첨번호를 확인하고, 번호를 생성하고, 자주 보는 핵심 통계를 빠르게 볼 수 있습니다.",
    descriptionEn:
      "Check the latest draw, generate a new set, and review the core statistics most visitors need first."
  })
};

export default async function HomePage() {
  const draws = await drawRepository.getAll();
  const latestDraw = draws[0] ?? null;
  const nextRound = latestDraw ? latestDraw.round + 1 : null;
  const summary = computeDashboardSummary(draws, "all");
  const allHotNumbers = computeFrequencyStats(draws, "all").slice(0, 5);
  const recentHotNumbers = computeFrequencyStats(draws, "recent_10").slice(0, 5);
  const oddEvenLeader = summary.oddEvenBreakdown[0]?.label ?? "-";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="panel hero-panel grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-stretch">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="eyebrow">이번 주 컨트롤룸</p>
              <span className="status-badge">Live Sync</span>
            </div>
            <h1 className="section-title mt-4 max-w-3xl text-gradient-silver">
              최신 회차를 보고, 바로 다음 번호를 만들고, 핵심 흐름까지 한 번에 보세요
            </h1>
            <p className="body-large mt-5 max-w-2xl text-slate-300">
              Lotto Maker Lab은 매주 가장 먼저 확인하는 최신 회차, 가장 빠르게 실행하는 번호 생성, 계속
              참고하게 되는 핵심 통계를 하나의 흐름으로 묶습니다.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "생성기", value: "4 전략" },
                { label: "조회", value: "전체 회차" },
                { label: "통계", value: "장기 + 최근" }
              ].map((item) => (
                <div key={item.label} className="signal-chip">
                  <span className="signal-chip-label">{item.label}</span>
                  <span className="signal-chip-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/generate" className="cta-button w-full sm:w-auto">
              번호 생성하기
            </Link>
            <Link href="/stats" className="secondary-button w-full sm:w-auto">
              통계 먼저 보기
            </Link>
            <Link href="/draws" className="secondary-button hidden sm:inline-flex">
              회차 전체 조회
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="kpi-cell">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Latest</p>
              <p className="mt-2 text-2xl font-semibold text-white">{latestDraw ? `${latestDraw.round}회` : "-"}</p>
            </div>
            <div className="kpi-cell">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Next Target</p>
              <p className="mt-2 text-2xl font-semibold text-white">{nextRound ? `${nextRound}회` : "-"}</p>
            </div>
            <div className="kpi-cell">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Core Pattern</p>
              <p className="mt-2 text-2xl font-semibold text-white">{oddEvenLeader}</p>
            </div>
          </div>
        </div>

        <div className="soft-card relative overflow-hidden flex flex-col justify-between gap-6">
          <div className="hero-signal-field" aria-hidden="true">
            <span className="hero-signal hero-signal-one" />
            <span className="hero-signal hero-signal-two" />
            <span className="hero-signal hero-signal-three" />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow">최신 회차</p>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-300">
                Weekly Draw
              </span>
            </div>
            {latestDraw ? (
              <>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-5xl font-semibold text-gradient-silver">{latestDraw.round}회</h2>
                    <p className="mt-2 text-base font-medium text-slate-400">{latestDraw.drawDate}</p>
                  </div>
                  <Link href={`/draws/${latestDraw.round}`} className="subtle-link">
                    회차 상세 보기
                  </Link>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <NumberSet
                    numbers={latestDraw.numbers}
                    bonus={latestDraw.bonus}
                    hrefBuilder={(value) => `/stats/numbers/${value}`}
                    wrap={false}
                    className="min-w-max"
                  />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { href: "/generate", title: "다음 번호 생성", body: "지금 바로 시작" },
                    { href: "/draw-analysis", title: "회차 해석 보기", body: "이번 흐름 읽기" },
                    { href: "/stats", title: "핵심 통계 이동", body: "장기/최근 비교" }
                  ].map((item) => (
                    <Link key={item.href} href={item.href} className="signal-link-card">
                      <span className="signal-link-title">{item.title}</span>
                      <span className="signal-link-body">{item.body}</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-4 body-medium text-slate-300">최신 당첨번호를 불러오는 중입니다.</p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">평균 합계</p>
              <p className="mt-2 text-2xl font-semibold text-white">{summary.averageSum}</p>
            </div>
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">연속번호 비율</p>
              <p className="mt-2 text-2xl font-semibold text-white">{summary.consecutiveSummary.percentage}%</p>
            </div>
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">대표 홀짝</p>
              <p className="mt-2 text-2xl font-semibold text-white">{oddEvenLeader}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">빠른 시작</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Link href="/generate" className="interactive-card">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Primary Action</p>
            <h2 className="section-subtitle mt-3 text-white">번호 생성기부터 시작하세요</h2>
            <p className="body-medium mt-3 max-w-xl text-slate-300">
              혼합 추천, 빈도 추천, 랜덤 추천, 필터 추천을 한 자리에서 비교하고 바로 결과를 확인할 수 있습니다.
            </p>
            <div className="mt-6">
              <span className="subtle-link text-white">다음 회차 번호 만들기</span>
            </div>
          </Link>

          <div className="grid gap-3">
            {[
              {
                href: "/draws",
                title: "회차 조회",
                body: "전체 회차를 빠르게 찾고 당첨번호 상세를 바로 확인합니다."
              },
              {
                href: "/stats",
                title: "통계 보기",
                body: "자주 나온 번호와 최근 흐름을 비교해봅니다."
              },
              {
                href: "/generated-stats",
                title: "생성 통계",
                body: "사람들이 실제로 어떤 전략으로 생성했는지 관측합니다."
              }
            ].map((item) => (
              <Link key={item.href} href={item.href} className="interactive-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
                  </div>
                  <span className="text-slate-500">›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">핵심 요약</p>
        <h2 className="section-subtitle mt-4 text-white">지금 가장 많이 참고하는 숫자 흐름</h2>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Link href="/sum-pattern" className="kpi-cell transition hover:border-white/20">
            <p className="text-sm text-slate-400">평균 합계</p>
            <p className="mt-3 text-4xl font-semibold text-white">{summary.averageSum}</p>
          </Link>
          <Link href="/recent-10-draw-analysis" className="kpi-cell transition hover:border-white/20">
            <p className="text-sm text-slate-400">연속번호 비율</p>
            <p className="mt-3 text-4xl font-semibold text-white">{summary.consecutiveSummary.percentage}%</p>
          </Link>
          <Link href="/odd-even-pattern" className="kpi-cell transition hover:border-white/20">
            <p className="text-sm text-slate-400">대표 홀짝 비율</p>
            <p className="mt-3 text-4xl font-semibold text-white">{oddEvenLeader}</p>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="soft-card">
            <p className="section-subtitle text-white">전체 회차 인기 번호</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {allHotNumbers.map((item) => (
                <Link
                  key={`all-hot-${item.number}`}
                  href={`/stats/numbers/${item.number}`}
                  className="chip-link"
                >
                  <span className="font-semibold text-white">{item.number}</span>
                  <span className="text-slate-400">{item.frequency}회</span>
                </Link>
              ))}
            </div>
          </article>

          <article className="soft-card">
            <p className="section-subtitle text-white">최근 10회 인기 번호</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {recentHotNumbers.map((item) => (
                <Link
                  key={`recent-hot-${item.number}`}
                  href={`/stats/numbers/${item.number}`}
                  className="chip-link"
                >
                  <span className="font-semibold text-white">{item.number}</span>
                  <span className="text-slate-400">{item.frequency}회</span>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">가이드</p>
            <h2 className="section-subtitle mt-4 text-white">자주 보는 로또 가이드</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              처음 보는 사람도 바로 이해할 수 있는 설명형 문서를 우선순위대로 정리했습니다.
            </p>
            <div className="mt-5 grid gap-3">
              {[
                { href: "/guides/lotto-number-generator-vs-random", label: "생성기 vs 랜덤 추천" },
                { href: "/guides/recent-20-hot-numbers", label: "최근 20회 자주 나온 번호" },
                { href: "/guides/odd-even-pattern-guide", label: "홀짝 패턴은 어떻게 읽을까" }
              ].map((item) => (
                <Link key={item.href} href={item.href} className="link-list-item">
                  <span>{item.label}</span>
                  <span className="text-slate-500">열기</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">서비스 안내</p>
            <h2 className="section-subtitle mt-4 text-white">처음 방문했다면 여기부터 보세요</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              구매, 결과, 분석, FAQ까지 처음 방문자의 탐색 흐름을 짧게 연결했습니다.
            </p>
            <div className="mt-5 grid gap-3">
              {[
                { href: "/lotto-buy-guide", label: "온라인 구매 안내" },
                { href: "/latest-lotto-results", label: "최신 결과 보기" },
                { href: "/draw-analysis", label: "회차 분석 보기" },
                { href: "/faq", label: "자주 묻는 질문" }
              ].map((item) => (
                <Link key={item.href} href={item.href} className="link-list-item">
                  <span>{item.label}</span>
                  <span className="text-slate-500">이동</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
