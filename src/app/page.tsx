import type { Metadata } from "next";
import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { computeFrequencyStats, drawRepository } from "@/lib/lotto";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/",
    titleKo: "로또 추천과 통계를 한곳에서 보는 데이터 기반 로또 서비스",
    titleEn: "Data-driven Lotto recommendations and statistics",
    descriptionKo:
      "최신 당첨번호, 번호 생성기, 회차 조회, 통계 분석, 생성 통계를 한곳에서 확인하는 Lotto Maker Lab 홈입니다.",
    descriptionEn:
      "Lotto Maker Lab home for historical recommendations, latest results, draw lookup, statistics, and generated stats."
  });
}

const content = {
  ko: {
    eyebrow: "LOTTO MAKER LAB",
    title: "추천 번호, 회차 조회, 통계,\n생성 통계를 한 화면에서 정리한 로또 실험실",
    description:
      "과거 당첨 데이터 기반 추천과 최신 회차 조회, 번호별 통계, 공개 생성 현황까지 한 흐름으로 볼 수 있는 무료 로또 웹 서비스입니다.",
    primaryCta: "번호 생성하기",
    secondaryCta: "최신 결과 보기",
    latestEyebrow: "최신 당첨번호",
    latestLink: "회차 상세 보기",
    quickEyebrow: "빠른 이동",
    quickTitle: "가장 많이 쓰는 기능부터 바로 시작하세요",
    featuredEyebrow: "핵심 탐색",
    featuredTitle: "생성기와 통계, 생성 현황을 자연스럽게 오갈 수 있게 구성했습니다",
    guidesEyebrow: "가이드",
    guidesTitle: "검색 유입과 재방문을 위한 설명형 콘텐츠",
    explainEyebrow: "서비스 안내",
    explainTitle: "처음 방문한 사람이 바로 이해해야 하는 핵심 정보",
    introTitle: "무엇을 할 수 있나요?",
    introBody:
      "번호 생성, 전체 회차 조회, 번호 통계 확인, 회차 분석 읽기, 생성 통계 허브 탐색까지 한 번에 할 수 있습니다.",
    howToTitle: "어떻게 쓰면 좋나요?",
    howToBody:
      "생성기로 번호를 만든 뒤, 최신 결과와 통계를 함께 보고, 필요하면 생성 통계 허브에서 전략 성과까지 확인하면 됩니다.",
    faqTitle: "중요 안내",
    faqBody:
      "추천 번호는 참고용입니다. 특정 번호나 전략이 당첨을 보장하지 않으며, 데이터 기반으로 읽기 쉽게 정리하는 데 초점을 둡니다.",
    probabilityTitle: "확률 안내",
    probabilityBody:
      "로또는 확률 게임입니다. 이 서비스는 과거 데이터를 이해하고 조합을 참고하는 도구이며, 당첨 보장 서비스가 아닙니다."
  },
  en: {
    eyebrow: "LOTTO MAKER LAB",
    title: "A Lotto lab for picks, draw lookup,\nstats, and generated stats",
    description:
      "Free Lotto web service that brings together historical recommendations, latest results, round lookup, number statistics, and public generated stats.",
    primaryCta: "Open generator",
    secondaryCta: "Latest results",
    latestEyebrow: "Latest Draw",
    latestLink: "Round detail",
    quickEyebrow: "Quick Actions",
    quickTitle: "Start with the most-used paths",
    featuredEyebrow: "Explore",
    featuredTitle: "Move naturally between generator, statistics, and generated stats",
    guidesEyebrow: "Guides",
    guidesTitle: "Search-friendly content for repeat visits",
    explainEyebrow: "Service Guide",
    explainTitle: "Core notes for first-time visitors",
    introTitle: "What can you do here?",
    introBody:
      "Generate sets, browse all rounds, inspect number statistics, read round analysis, and review the public generated stats board.",
    howToTitle: "How to use it",
    howToBody:
      "Create a set in the generator, compare it with stats, then review generated stats to see which strategy performs better.",
    faqTitle: "Important note",
    faqBody:
      "Recommendations are for reference only. No strategy or number is presented as a guaranteed winning method.",
    probabilityTitle: "Probability note",
    probabilityBody:
      "Lotto is still a probability game. This service focuses on readable data interpretation and reference combinations."
  }
} as const;

export default async function HomePage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const [latestDraw, allDraws] = await Promise.all([drawRepository.getLatest(), drawRepository.getAll()]);
  const hotNumbers = computeFrequencyStats(allDraws, "all").slice(0, 5);
  const featuredAnalysisRound = latestDraw?.round ?? 1169;

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
              href="/latest-lotto-results"
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
            <p className="mt-4 text-slate-400">최신 회차 데이터를 준비하는 중입니다.</p>
          )}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">{copy.quickEyebrow}</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">{copy.quickTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Link href="/generate" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">{locale === "ko" ? "번호 생성기" : "Generator"}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              혼합, 빈도, 랜덤, 필터 전략으로 참고용 번호를 바로 생성합니다.
            </p>
          </Link>
          <Link href="/draws" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">{locale === "ko" ? "회차 조회" : "Draws"}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              전체 회차와 번호 포함 회차를 빠르게 탐색할 수 있습니다.
            </p>
          </Link>
          <Link href="/stats" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">{locale === "ko" ? "통계 대시보드" : "Statistics"}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              자주 나온 번호, 홀짝, 합계, 최근 흐름을 한 화면에서 비교합니다.
            </p>
          </Link>
          <Link href="/community" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">{locale === "ko" ? "생성 통계" : "Generated Stats"}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              이번 회차 공개 생성 수와 전략별 성과를 함께 확인합니다.
            </p>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel">
          <p className="eyebrow">{copy.featuredEyebrow}</p>
          <h2 className="mt-4 text-2xl font-semibold text-white">{copy.featuredTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link href={`/draw-analysis/${featuredAnalysisRound}`} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
              <p className="text-lg font-semibold text-white">{locale === "ko" ? "최신 회차 분석" : "Latest analysis"}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                최근 당첨번호의 홀짝, 합계, 연속번호 패턴을 기사형으로 정리해 보여줍니다.
              </p>
            </Link>
            <Link href="/draw-analysis" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
              <p className="text-lg font-semibold text-white">{locale === "ko" ? "회차 분석 허브" : "Analysis hub"}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                최근 회차 분석 페이지를 모아보고 흐름을 이어서 볼 수 있습니다.
              </p>
            </Link>
            <Link href="/community" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
              <p className="text-lg font-semibold text-white">{locale === "ko" ? "전략 성과 보드" : "Strategy board"}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                사람들이 어떤 방식으로 번호를 만들었는지, 어떤 전략이 더 가까웠는지 확인합니다.
              </p>
            </Link>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">{locale === "ko" ? "핫 번호" : "Hot Numbers"}</p>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            {locale === "ko" ? "전체 회차 기준 자주 나온 번호" : "Most frequent numbers across all draws"}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {hotNumbers.map((item) => (
              <Link
                key={item.number}
                href={`/stats/numbers/${item.number}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
              >
                <span className="font-semibold text-white">{item.number}</span>
                <span className="text-slate-500">{item.frequency}회</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">{copy.guidesEyebrow}</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">{copy.guidesTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link href="/guides/lotto-number-generator-vs-random" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">{locale === "ko" ? "생성기와 랜덤의 차이" : "Generator vs random"}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              데이터 기반 추천과 완전 랜덤 조합의 차이를 쉽게 정리했습니다.
            </p>
          </Link>
          <Link href="/guides/recent-20-hot-numbers" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">{locale === "ko" ? "최근 20회 핫 번호" : "Recent 20 hot numbers"}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              최근 흐름을 빠르게 읽고 싶은 사용자를 위한 요약 가이드입니다.
            </p>
          </Link>
          <Link href="/guides/odd-even-pattern-guide" className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">{locale === "ko" ? "홀짝 패턴 가이드" : "Odd-even guide"}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              홀짝 비율을 어떻게 봐야 하는지 초보자도 이해하기 쉽게 설명합니다.
            </p>
          </Link>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">{copy.explainEyebrow}</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">{copy.explainTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-lg font-semibold text-white">{copy.introTitle}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{copy.introBody}</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-lg font-semibold text-white">{copy.howToTitle}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{copy.howToBody}</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-lg font-semibold text-white">{copy.faqTitle}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{copy.faqBody}</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-lg font-semibold text-white">{copy.probabilityTitle}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{copy.probabilityBody}</p>
          </article>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { href: "/community", label: locale === "ko" ? "생성 통계" : "Generated Stats" },
            { href: "/faq", label: "FAQ" },
            { href: "/privacy", label: locale === "ko" ? "개인정보처리방침" : "Privacy" },
            { href: "/terms", label: locale === "ko" ? "이용약관" : "Terms" },
            { href: "/contact", label: locale === "ko" ? "문의 / 운영 안내" : "Contact" }
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
