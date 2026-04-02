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
  const summary = computeDashboardSummary(draws, "all");
  const allHotNumbers = computeFrequencyStats(draws, "all").slice(0, 5);
  const recentHotNumbers = computeFrequencyStats(draws, "recent_10").slice(0, 5);
  const oddEvenLeader = summary.oddEvenBreakdown[0]?.label ?? "-";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">회차 당첨번호</p>
        {latestDraw ? (
          <div className="mt-5 grid gap-5 xl:grid-cols-[180px_minmax(0,1fr)_180px] xl:items-center">
            <div>
              <h2 className="text-5xl font-semibold text-white">{latestDraw.round}회</h2>
              <p className="mt-3 text-xl font-medium text-slate-400">{latestDraw.drawDate}</p>
            </div>

            <div className="overflow-x-auto">
              <NumberSet
                numbers={latestDraw.numbers}
                bonus={latestDraw.bonus}
                hrefBuilder={(value) => `/stats/numbers/${value}`}
                wrap={false}
                className="min-w-max"
              />
            </div>

            <div className="xl:text-right">
              <Link
                href={`/draws/${latestDraw.round}`}
                className="text-lg font-medium text-teal transition hover:text-teal-200"
              >
                회차 상세 보기
              </Link>
            </div>
          </div>
        ) : (
          <p className="mt-4 body-medium text-slate-400">최신 당첨번호를 불러오는 중입니다.</p>
        )}
      </section>

      <section className="panel">
        <p className="eyebrow">LOTTO MAKER LAB</p>
        <h1 className="section-title mt-4 text-white">최신 결과를 보고 바로 번호를 만들어보세요</h1>
        <p className="body-large mt-4 max-w-5xl text-slate-300">
          최신 당첨번호 확인, 번호 생성, 자주 보는 핵심 통계를 한 화면에서 빠르게 확인할 수 있습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-button">
            번호 생성하기
          </Link>
          <Link
            href="/draws"
            className="rounded-full border border-white/10 px-5 py-3 text-base font-medium text-slate-200 transition hover:border-white/30"
          >
            회차 조회
          </Link>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">빠른 시작</p>
        <h2 className="section-subtitle mt-4 text-white">가장 자주 쓰는 기능부터 시작하세요</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              href: "/generate",
              title: "번호 생성기",
              body: "혼합 추천, 빈도 추천, 랜덤 추천, 필터 추천으로 원하는 방식의 번호를 만들 수 있습니다."
            },
            {
              href: "/draws",
              title: "회차 조회",
              body: "전체 회차를 찾아보고 원하는 회차의 당첨번호와 상세 정보를 확인할 수 있습니다."
            },
            {
              href: "/stats",
              title: "통계 보기",
              body: "자주 나온 번호, 최근 흐름, 홀짝 비율, 합계 구간을 한 번에 비교할 수 있습니다."
            },
            {
              href: "/generated-stats",
              title: "생성 통계",
              body: "이번 회차 공개 생성 현황과 전략별 성과를 한눈에 확인할 수 있습니다."
            }
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 transition hover:border-white/30"
            >
              <p className="section-subtitle text-white">{card.title}</p>
              <p className="body-medium mt-3 text-slate-300">{card.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">핵심 요약</p>
        <h2 className="section-subtitle mt-4 text-white">지금 가장 많이 참고하는 숫자 흐름</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link href="/sum-pattern" className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 transition hover:border-white/30">
            <p className="text-base text-slate-300">평균 합계</p>
            <p className="mt-4 text-5xl font-semibold text-white">{summary.averageSum}</p>
          </Link>
          <Link
            href="/recent-10-draw-analysis"
            className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 transition hover:border-white/30"
          >
            <p className="text-base text-slate-300">연속번호 비율</p>
            <p className="mt-4 text-5xl font-semibold text-white">{summary.consecutiveSummary.percentage}%</p>
          </Link>
          <Link
            href="/odd-even-pattern"
            className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 transition hover:border-white/30"
          >
            <p className="text-base text-slate-300">대표 홀짝 비율</p>
            <p className="mt-4 text-5xl font-semibold text-white">{oddEvenLeader}</p>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
            <p className="section-subtitle text-white">전체 회차 인기 번호</p>
            <div className="mt-5 flex flex-wrap gap-3">
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

          <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
            <p className="section-subtitle text-white">최근 10회 인기 번호</p>
            <div className="mt-5 flex flex-wrap gap-3">
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
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <p className="eyebrow">가이드</p>
          <h2 className="section-subtitle mt-4 text-white">자주 보는 로또 가이드</h2>
          <div className="mt-6 grid gap-4">
            {[
              { href: "/guides/lotto-number-generator-vs-random", label: "생성기 vs 랜덤 추천" },
              { href: "/guides/recent-20-hot-numbers", label: "최근 20회 자주 나온 번호" },
              { href: "/guides/odd-even-pattern-guide", label: "홀짝 패턴은 어떻게 읽을까" }
            ].map((item) => (
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

        <div className="panel">
          <p className="eyebrow">서비스 안내</p>
          <h2 className="section-subtitle mt-4 text-white">처음 방문했다면 여기부터 보세요</h2>
          <div className="mt-6 grid gap-4">
            {[
              { href: "/lotto-buy-guide", label: "온라인 구매 안내" },
              { href: "/latest-lotto-results", label: "최신 결과 보기" },
              { href: "/draw-analysis", label: "회차 분석 보기" },
              { href: "/faq", label: "자주 묻는 질문" }
            ].map((item) => (
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
