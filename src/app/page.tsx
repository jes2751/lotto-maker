import type { Metadata } from "next";
import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { computeDashboardSummary, computeFrequencyStats, drawRepository } from "@/lib/lotto";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/",
    titleKo: "최신 당첨번호, 번호 생성기, 핵심 통계",
    titleEn: "Latest results, generator, and core statistics",
    descriptionKo:
      "최신 당첨번호 확인, 로또 번호 생성, 자주 나온 번호와 최근 흐름 확인을 한 화면에서 빠르게 볼 수 있습니다.",
    descriptionEn:
      "Quick access to the latest draw, Lotto number generation, and the most useful statistics in one place."
  });
}

const content = {
  ko: {
    eyebrow: "LOTTO MAKER LAB",
    title: "최신 결과를 보고\n바로 번호를 만들어보세요",
    description:
      "홈에서는 최신 당첨번호, 바로 시작할 수 있는 생성기, 자주 확인하는 핵심 통계만 먼저 보여줍니다.",
    primaryCta: "번호 생성하기",
    secondaryCta: "회차 조회",
    latestEyebrow: "최신 당첨번호",
    latestLink: "회차 상세 보기",
    quickEyebrow: "빠른 시작",
    quickTitle: "가장 많이 찾는 기능만 먼저 정리했습니다",
    quickCards: [
      {
        href: "/generate",
        title: "번호 생성기",
        body: "혼합, 빈도, 랜덤, 필터 전략으로 바로 번호를 만들 수 있습니다."
      },
      {
        href: "/stats",
        title: "핵심 통계",
        body: "자주 나온 번호, 최근 흐름, 패턴 요약을 빠르게 확인할 수 있습니다."
      },
      {
        href: "/community",
        title: "생성 통계",
        body: "이번 회차 공개 생성 수와 전략별 성과를 한눈에 볼 수 있습니다."
      }
    ],
    statsEyebrow: "핵심 요약",
    statsTitle: "지금 가장 많이 참고하는 숫자 흐름",
    hotLabel: "전체 회차 기준 자주 나온 번호",
    recentLabel: "최근 10회 자주 나온 번호",
    summaryCards: {
      averageSum: "평균 합계",
      consecutiveRate: "연속번호 포함 비율",
      oddEven: "가장 흔한 홀짝 비율"
    },
    linksTitle: "더 자세히 보기",
    links: [
      { href: "/latest-lotto-results", label: "최신 결과 허브" },
      { href: "/draw-analysis", label: "회차 분석 허브" },
      { href: "/faq", label: "자주 묻는 질문" }
    ]
  },
  en: {
    eyebrow: "LOTTO MAKER LAB",
    title: "Check the latest result\nand generate a set right away",
    description:
      "The home page focuses on the latest draw, the generator, and the small set of stats most visitors check first.",
    primaryCta: "Open generator",
    secondaryCta: "Browse draws",
    latestEyebrow: "Latest draw",
    latestLink: "Round detail",
    quickEyebrow: "Quick Start",
    quickTitle: "Start with the most-used paths",
    quickCards: [
      {
        href: "/generate",
        title: "Generator",
        body: "Create sets with mixed, frequency, random, and filter strategies."
      },
      {
        href: "/stats",
        title: "Core stats",
        body: "See hot numbers, recent trends, and pattern summaries at a glance."
      },
      {
        href: "/community",
        title: "Generated stats",
        body: "Review public pick volume and strategy performance for the current round."
      }
    ],
    statsEyebrow: "Core Summary",
    statsTitle: "The number trends most visitors check first",
    hotLabel: "Most frequent across all draws",
    recentLabel: "Most frequent in the recent 10 draws",
    summaryCards: {
      averageSum: "Average sum",
      consecutiveRate: "Consecutive-number rate",
      oddEven: "Most common odd-even split"
    },
    linksTitle: "Keep exploring",
    links: [
      { href: "/latest-lotto-results", label: "Latest results" },
      { href: "/draw-analysis", label: "Analysis hub" },
      { href: "/faq", label: "FAQ" }
    ]
  }
} as const;

export default async function HomePage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const draws = await drawRepository.getAll();
  const latestDraw = draws[0] ?? null;
  const allSummary = computeDashboardSummary(draws, "all");
  const allHotNumbers = computeFrequencyStats(draws, "all").slice(0, 5);
  const recentHotNumbers = computeFrequencyStats(draws, "recent_10").slice(0, 5);
  const mostCommonOddEven = allSummary.oddEvenBreakdown[0]?.label ?? "-";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="mt-4 whitespace-pre-line text-4xl font-semibold text-white">{copy.title}</h1>
          <p className="mt-4 max-w-2xl leading-8 text-slate-300">{copy.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/generate" className="cta-button">
              {copy.primaryCta}
            </Link>
            <Link
              href="/draws"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
            >
              {copy.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">{copy.latestEyebrow}</p>
          {latestDraw ? (
            <>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold text-white">{latestDraw.round}회</h2>
                  <p className="mt-2 text-slate-400">{latestDraw.drawDate}</p>
                </div>
                <Link href={`/draws/${latestDraw.round}`} className="text-sm text-teal transition hover:text-teal-200">
                  {copy.latestLink}
                </Link>
              </div>
              <div className="mt-6">
                <NumberSet
                  numbers={latestDraw.numbers}
                  bonus={latestDraw.bonus}
                  hrefBuilder={(value) => `/stats/numbers/${value}`}
                />
              </div>
            </>
          ) : (
            <p className="mt-4 text-slate-400">
              {locale === "ko" ? "최신 회차 데이터를 아직 불러오지 못했습니다." : "Latest draw data is not ready yet."}
            </p>
          )}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">{copy.quickEyebrow}</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">{copy.quickTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {copy.quickCards.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
              <p className="text-lg font-semibold text-white">{card.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">{card.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel">
          <p className="eyebrow">{copy.statsEyebrow}</p>
          <h2 className="mt-4 text-2xl font-semibold text-white">{copy.statsTitle}</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{copy.summaryCards.averageSum}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{allSummary.averageSum}</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{copy.summaryCards.consecutiveRate}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{allSummary.consecutiveSummary.percentage}%</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{copy.summaryCards.oddEven}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{mostCommonOddEven}</p>
            </article>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-sm font-medium text-white">{copy.hotLabel}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {allHotNumbers.map((item) => (
                  <Link
                    key={`all-hot-${item.number}`}
                    href={`/stats/numbers/${item.number}`}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
                  >
                    {item.number} <span className="text-slate-500">{item.frequency}회</span>
                  </Link>
                ))}
              </div>
            </article>
            <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-sm font-medium text-white">{copy.recentLabel}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {recentHotNumbers.map((item) => (
                  <Link
                    key={`recent-hot-${item.number}`}
                    href={`/stats/numbers/${item.number}`}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
                  >
                    {item.number} <span className="text-slate-500">{item.frequency}회</span>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">{locale === "ko" ? "더 보기" : "Explore"}</p>
          <h2 className="mt-4 text-2xl font-semibold text-white">{copy.linksTitle}</h2>
          <div className="mt-6 grid gap-4">
            {copy.links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-base font-medium text-white transition hover:border-white/30"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
