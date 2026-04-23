import type { Metadata } from "next";
import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { computeDashboardSummary, computeFrequencyStats, drawRepository } from "@/lib/lotto";
import { getGeneratedRoundStats } from "@/lib/firebase/admin";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/",
    titleKo: "로또 번호 생성기와 당첨번호 통계를 함께 보는 곳",
    titleEn: "Latest result, generator, and core statistics",
    descriptionKo:
      "최신 로또 당첨번호를 확인하고, 로또 번호를 생성한 뒤, 공식 당첨 통계와 사람들 선택 흐름을 함께 보며 조합을 고를 수 있습니다.",
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
  
  const generatedStats = nextRound ? await getGeneratedRoundStats(nextRound).catch(() => null) : null;
  const mostPicked = generatedStats?.view.currentTopNumbers[0] ?? null;
  const officialVsCrowd = [
    {
      href: "/stats",
      eyebrow: "공식 당첨 흐름",
      title: "과거 1등 데이터",
      body: "장기/최근 당첨 기록으로 실제로 반복된 번호와 패턴을 먼저 봅니다.",
      detail: "공식 당첨 기록 기준",
      points: ["실제로 나온 번호", "장기 + 최근 흐름", "번호별 출현 기록"]
    },
    {
      href: "/generated-stats",
      eyebrow: "유저 군중 흐름",
      title: "우리 유저 데이터",
      body: "사람들이 실제로 어떤 번호와 전략에 몰리는지 공개 생성 기록으로 봅니다.",
      detail: "실제 생성 기록 기준",
      points: ["사람들이 몰린 번호", "전략 점유율", "대중적 조합 힌트"]
    }
  ] as const;
  const playCards = [
    {
      href: "/generate",
      kicker: "지금 시작",
      title: "바로 번호 뽑기",
      body: "먼저 뽑고, 그다음 공식 기준과 유저 흐름을 붙여 봅니다."
    },
    {
      href: "/generated-stats",
      kicker: "유저 흐름",
      title: "사람들 몰림 보기",
      body: "사람들이 어디에 몰리는지 보고 더 대중적인 조합인지 같이 판단합니다."
    },
    {
      href: "/stats",
      kicker: "공식 기준",
      title: "과거 1등 흐름 보기",
      body: "실제로 나온 번호와 패턴을 먼저 보고 기준을 잡습니다."
    }
  ] as const;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="panel hero-panel grid gap-8">
        <div className="soft-card relative overflow-hidden flex flex-col justify-between gap-6">
          <div className="hero-signal-field" aria-hidden="true">
            <span className="hero-signal hero-signal-one" />
            <span className="hero-signal hero-signal-two" />
            <span className="hero-signal hero-signal-three" />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow">최신 회차</p>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-semibold tracking-[0.08em] text-slate-300">
                최신 당첨번호
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

                <div className="mt-6">
                  <NumberSet
                    numbers={latestDraw.numbers}
                    bonus={latestDraw.bonus}
                    hrefBuilder={(value) => `/stats/numbers/${value}`}
                    wrap={false}
                    compact
                  />
                </div>

                <div className="mt-5 sm:mt-6">
                  <div className="signal-row">
                    <span className="signal-row-dot" />
                    <span>
                      이번 회차는 {oddEvenLeader} 흐름이 중심이었고, 다음 타깃은{" "}
                      {nextRound ? `${nextRound}회` : "다음 회차"} 기준으로 바로 생성됩니다.
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2">
                  {[
                    { href: "/generate", title: "바로 생성", body: "이번 주 번호 바로 뽑기" },
                    { href: "/stats", title: "공식 기준 보기", body: "과거 1등 흐름 붙여 보기" }
                  ].map((item, index) => (
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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">평균 합계</p>
              <p className="mt-2 text-2xl font-semibold text-white">{summary.averageSum}</p>
            </div>
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">연속번호 비율</p>
              <p className="mt-2 text-2xl font-semibold text-white">{summary.consecutiveSummary.percentage}%</p>
            </div>
            <div className="kpi-cell col-span-2 sm:col-span-1">
              <p className="text-sm text-slate-400">대표 홀짝</p>
              <p className="mt-2 text-2xl font-semibold text-white">{oddEvenLeader}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 soft-card border-rose-500/20 bg-[linear-gradient(180deg,rgba(244,63,94,0.08)_0%,rgba(15,23,42,0.6)_100%)]">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="eyebrow text-rose-400">군중 회피 전략</p>
            <span className="status-badge bg-rose-500/10 text-rose-300 border-rose-500/20">어차피 당첨 확률이 같다면</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            남들이 안 뽑는 번호를 가져가세요.
          </h1>
          
          {mostPicked && (
            <div className="mt-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5">
              <p className="text-sm font-semibold text-rose-300">이번 주 가장 위험한 번호</p>
              <div className="mt-3 flex items-end gap-4">
                <span className="text-5xl font-bold text-white">{mostPicked.number}</span>
                <span className="mb-1 text-sm text-rose-200">
                  가장 많은 유저({mostPicked.count}명, {mostPicked.percentage}%)가 선택 중
                </span>
              </div>
            </div>
          )}

          <div className="mt-1 flex items-start gap-3 rounded-xl border border-rose-500/10 bg-rose-500/5 px-4 py-3">
            <span className="text-xl">💡</span>
            <p className="text-sm leading-relaxed text-rose-200">
              <strong className="font-semibold text-rose-300">왜 피해야 할까요?</strong> 로또 당첨금은 파이가 정해져 있습니다. 사람들이 몰리는 번호를 피해야 1등 당첨 시 기댓값(수령액)을 극대화할 수 있습니다.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/generate" className="cta-button w-full sm:w-auto">
              지금 번호 뽑기
            </Link>
            <Link href="/generated-stats" className="secondary-button w-full sm:w-auto">
              유저 흐름 상세 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">두 가지 데이터 축</p>
        <h2 className="section-subtitle mt-4 text-white">번호를 고를 때 공식 통계와 사람들 선택을 따로 봅니다</h2>
        <div className="mt-5 grid gap-4 md:mt-6 lg:grid-cols-[1fr_1fr_0.86fr]">
          {officialVsCrowd.map((item) => (
            <Link key={item.title} href={item.href} className="interactive-card">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">{item.eyebrow}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.points.map((point, index) => (
                  <span
                    key={point}
                    className={
                      index > 1
                        ? "hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-300 md:inline-flex"
                        : "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-300"
                    }
                  >
                    {point}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="hidden text-xs uppercase tracking-[0.18em] text-slate-500 md:inline">
                  {item.detail}
                </span>
                <span className="subtle-link text-white">바로 보기</span>
              </div>
            </Link>
          ))}

          <div className="soft-card md:block">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">바로 실행</p>
            <h3 className="mt-3 text-xl font-semibold text-white">먼저 생성하고 두 흐름에 붙여보세요</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              지금 번호를 만든 뒤, 공식 당첨 흐름과 유저 군중 흐름 양쪽으로 바로 이어보는 것이 이 서비스의
              기본 흐름입니다.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/generate" className="cta-button w-full">
                생성기 열기
              </Link>
              <Link href="/generated-stats" className="secondary-button w-full">
                유저 군중 흐름 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">빠른 시작</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Link href="/generate" className="interactive-card">
            <p className="text-sm font-semibold tracking-[0.08em] text-accent">먼저 해볼 일</p>
            <h2 className="section-subtitle mt-3 text-white">번호부터 뽑고, 그 다음 공식 통계와 사람들 선택을 보세요</h2>
            <p className="body-medium mt-3 max-w-xl text-slate-300">
              혼합, 빈도, 랜덤, 필터를 한 자리에서 눌러보고, 나온 결과를 공식 당첨 통계와 사람들 선택 흐름으로
              바로 이어볼 수 있습니다.
            </p>
            <div className="mt-6">
              <span className="subtle-link text-white">바로 생성 무대로 이동</span>
            </div>
          </Link>

          <div className="grid gap-3">
            {[
              {
                href: "/draws",
                title: "회차 조회",
                body: "전체 회차를 빠르게 찾고, 특정 번호가 포함된 회차를 바로 파고듭니다."
              },
              {
                href: "/stats",
                title: "과거 1등 데이터",
                body: "장기 인기 번호, 최근 10회 흐름, 번호별 출현 기록을 봅니다."
              },
              {
                href: "/generated-stats",
                title: "우리 유저 데이터",
                body: "사람들이 실제로 어떤 번호와 전략을 고르는지 공개 흐름으로 봅니다."
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
        <p className="eyebrow">과거 1등 데이터</p>
        <h2 className="section-subtitle mt-4 text-white">공식 당첨 기록으로 먼저 보는 숫자 흐름</h2>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Link href="/stats#sum-pattern" className="kpi-cell transition hover:border-white/20">
            <p className="text-sm text-slate-400">평균 합계</p>
            <p className="mt-3 text-4xl font-semibold text-white">{summary.averageSum}</p>
          </Link>
          <Link href="/stats#recent-10-draw-analysis" className="kpi-cell transition hover:border-white/20">
            <p className="text-sm text-slate-400">연속번호 비율</p>
            <p className="mt-3 text-4xl font-semibold text-white">{summary.consecutiveSummary.percentage}%</p>
          </Link>
          <Link href="/stats#odd-even-pattern" className="kpi-cell transition hover:border-white/20">
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
            <h2 className="section-subtitle mt-4 text-white">가장 많이 읽는 로또 가이드</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              로또의 수학적 확률부터 세금 계산, 그리고 1등 당첨 시 행동 요령까지 모든 것을 알려드립니다.
            </p>
            <div className="mt-5 grid gap-3">
              {[
                { href: "/guides/what-to-do-when-winning-lotto", label: "1등 당첨 시 가장 먼저 해야 할 일" },
                { href: "/guides/lotto-probability-truth", label: "1등 확률 814만 분의 1과 기댓값" },
                { href: "/guides/lotto-tax-and-claim-guide", label: "당첨금 세금 및 실수령액 계산법" },
                { href: "/guides/recent-hot-and-cold-numbers", label: "핫 넘버와 콜드 넘버 통계의 진실" },
                { href: "/guides/lotto-number-generator-vs-random", label: "생성기를 써야 하는 수학적 이유" }
              ].map((item) => (
                <Link key={item.href} href={item.href} className="link-list-item">
                  <span>{item.label}</span>
                  <span className="text-slate-500">열기</span>
                </Link>
              ))}
            </div>
            <div className="mt-5">
              <Link href="/guides" className="text-sm font-semibold tracking-wide text-teal hover:text-white transition-colors">
                모든 로또 가이드 (8편) 전체 보기 &rarr;
              </Link>
            </div>
          </div>

          <div>
            <p className="eyebrow">우리 유저 데이터</p>
            <h2 className="section-subtitle mt-4 text-white">공식 당첨 기록 다음엔 실제 유저 흐름을 보세요</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              사람들이 실제로 어떤 전략을 쓰는지, 어떤 번호에 몰리는지, 공개 생성 통계에서 이어서 볼 수 있습니다.
            </p>
            <div className="mt-5 grid gap-3">
              {[
                { href: "/generated-stats", label: "우리 유저 데이터 보기" },
                { href: "/generate", label: "지금 번호 생성하기" },
                { href: "/draws", label: "최신 결과 보기" },
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
