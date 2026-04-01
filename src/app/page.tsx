import type { Metadata } from "next";
import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";
import { computeFrequencyStats } from "@/lib/lotto/stats";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/",
    titleKo: "과거 당첨 데이터 기반 로또 추천과 통계",
    titleEn: "Data-driven Lotto recommendations and statistics",
    descriptionKo:
      "최신 당첨번호, 번호 추천기, 회차 조회, 핵심 통계를 한 화면에서 빠르게 확인할 수 있는 Lotto Maker Lab의 홈입니다.",
    descriptionEn:
      "Lotto Maker Lab home for historical recommendations, latest results, draw lookup, and core statistics."
  });
}

const content = {
  ko: {
    eyebrow: "LOTTO MAKER LAB",
    title: "과거 당첨 데이터를 바탕으로\n추천 번호와 통계를 함께 보는 로또 실험실",
    description:
      "Lotto Maker Lab은 번호 추천, 최신 회차 조회, 통계 탐색, 회차 분석을 한 흐름으로 연결한 무료 로또 웹 서비스입니다.",
    primaryCta: "번호 추천 시작",
    secondaryCta: "최신 결과 보기",
    latestEyebrow: "최신 회차",
    latestLink: "회차 상세",
    quickEyebrow: "빠른 이동",
    quickTitle: "자주 쓰는 핵심 기능부터 바로 시작하세요",
    featuredEyebrow: "분석 허브",
    featuredTitle: "바로 열어볼 만한 분석 페이지",
    guidesEyebrow: "가이드",
    guidesTitle: "검색 유입과 재방문을 위한 설명형 콘텐츠",
    explainEyebrow: "서비스 안내",
    explainTitle: "처음 방문한 사용자를 위한 핵심 안내",
    introTitle: "무엇을 할 수 있나요?",
    introBody:
      "추천 번호 생성, 전체 회차 조회, 자주 나온 번호 확인, 회차별 분석까지 한곳에서 이어서 볼 수 있습니다.",
    howToTitle: "어떻게 쓰면 좋나요?",
    howToBody:
      "추천기를 먼저 사용한 뒤 최신 당첨번호와 통계를 비교하고, 관심 회차는 분석 페이지로 이어서 확인하는 흐름을 권장합니다.",
    faqTitle: "꼭 알아둘 점",
    faqBody:
      "추천 결과는 참고용이며 당첨을 보장하지 않습니다. 통계는 전체 회차와 최근 10회 기준으로 함께 해석하는 편이 좋습니다.",
    probabilityTitle: "확률 안내",
    probabilityBody:
      "로또는 확률 게임입니다. 이 서비스는 과거 데이터를 읽기 쉽게 정리하고 참고용 조합을 만드는 데 초점을 둡니다.",
    trustLinks: [
      { href: "/faq", label: "FAQ" },
      { href: "/privacy", label: "개인정보처리방침" },
      { href: "/terms", label: "이용약관" },
      { href: "/contact", label: "문의 / 운영 안내" }
    ]
  },
  en: {
    eyebrow: "LOTTO MAKER LAB",
    title: "A clean Lotto lab for\nrecommendations, results, and statistics",
    description:
      "Lotto Maker Lab brings number generation, latest results, draw lookup, and analysis into one readable experience.",
    primaryCta: "Open Generator",
    secondaryCta: "Latest Results",
    latestEyebrow: "Latest Draw",
    latestLink: "Round Detail",
    quickEyebrow: "Quick Actions",
    quickTitle: "Start from the most-used paths",
    featuredEyebrow: "Analysis Hub",
    featuredTitle: "Open a deeper analysis next",
    guidesEyebrow: "Guides",
    guidesTitle: "Search-first content built for repeat visits",
    explainEyebrow: "Service Guide",
    explainTitle: "Core notes for first-time visitors",
    introTitle: "What can you do here?",
    introBody:
      "Generate reference number sets, browse all rounds, inspect popular numbers, and open round-by-round analysis pages.",
    howToTitle: "How to use it",
    howToBody:
      "Start with the generator, compare with the latest results, then move into statistics and round analysis for more context.",
    faqTitle: "Important note",
    faqBody:
      "Recommendations are for reference only. It is usually better to read all-draw statistics together with recent-10 trends.",
    probabilityTitle: "Probability note",
    probabilityBody:
      "Lotto is still a probability game. This service focuses on readable data interpretation and reference combinations.",
    trustLinks: [
      { href: "/faq", label: "FAQ" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/contact", label: "Contact" }
    ]
  }
} as const;

export default async function HomePage() {
  const { locale } = getRequestPreferences();
  const copy = content[locale];
  const [latestDraw, allDraws] = await Promise.all([
    drawRepository.getLatest(),
    drawRepository.getAll()
  ]);
  const hotNumbers = computeFrequencyStats(allDraws, "all").slice(0, 5);
  const featuredAnalysisRound = latestDraw?.round ?? 1169;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="mt-4 whitespace-pre-line text-4xl font-semibold text-white">
            {copy.title}
          </h1>
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
                <Link
                  href={`/draws/${latestDraw.round}`}
                  className="text-sm text-teal transition hover:text-teal-200"
                >
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
              최신 회차 데이터가 아직 준비되지 않았습니다. 잠시 후 다시 확인해 주세요.
            </p>
          )}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">{copy.quickEyebrow}</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">{copy.quickTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link
            href="/generate"
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
          >
            <p className="text-lg font-semibold text-white">
              {locale === "ko" ? "번호 추천기" : "Number Generator"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              데이터 기반 전략과 필터 조건을 조합해 참고용 번호 세트를 빠르게 생성합니다.
            </p>
          </Link>
          <Link
            href="/latest-lotto-results"
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
          >
            <p className="text-lg font-semibold text-white">
              {locale === "ko" ? "최신 당첨번호" : "Latest Results"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              최신 회차 결과와 최근 회차 흐름을 빠르게 훑은 뒤 상세 페이지로 이동할 수 있습니다.
            </p>
          </Link>
          <Link
            href="/stats"
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
          >
            <p className="text-lg font-semibold text-white">
              {locale === "ko" ? "종합 통계" : "Core Statistics"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              자주 나온 번호, 적게 나온 번호, 패턴 요약과 최근 흐름을 한 번에 볼 수 있습니다.
            </p>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel">
          <p className="eyebrow">{copy.featuredEyebrow}</p>
          <h2 className="mt-4 text-2xl font-semibold text-white">{copy.featuredTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link
              href="/draw-analysis"
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
            >
              <p className="text-lg font-semibold text-white">
                {locale === "ko" ? "회차 분석 허브" : "Analysis Hub"}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                최신 회차 분석과 최근 분석 목록을 한곳에서 모아 보는 허브 페이지입니다.
              </p>
            </Link>
            <Link
              href={`/draw-analysis/${featuredAnalysisRound}`}
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
            >
              <p className="text-lg font-semibold text-white">
                {locale === "ko" ? "최신 회차 분석" : "Latest Round Analysis"}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                홀짝, 합계, 연속번호, 자주 나온 번호와 적게 나온 번호 매칭을 짧게 정리합니다.
              </p>
            </Link>
            <Link
              href="/recent-10-draw-analysis"
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
            >
              <p className="text-lg font-semibold text-white">
                {locale === "ko" ? "최근 10회 흐름" : "Recent 10 Analysis"}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                최근 구간에서 반복되는 번호와 패턴이 무엇인지 빠르게 비교할 수 있습니다.
              </p>
            </Link>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">{locale === "ko" ? "핵심 번호" : "Top Numbers"}</p>
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
          <Link
            href="/guides/lotto-number-generator-vs-random"
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
          >
            <p className="text-lg font-semibold text-white">
              {locale === "ko" ? "추천기와 완전 랜덤의 차이" : "Generator vs random"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              데이터 기반 추천기와 완전 랜덤 조합의 차이를 빠르게 이해할 수 있는 가이드입니다.
            </p>
          </Link>
          <Link
            href="/guides/recent-20-hot-numbers"
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
          >
            <p className="text-lg font-semibold text-white">
              {locale === "ko" ? "최근 20회 자주 나온 번호" : "Recent 20 hot numbers"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              최근 회차에서 반복된 번호를 요약해 보여주는 설명형 콘텐츠입니다.
            </p>
          </Link>
          <Link
            href="/guides/odd-even-pattern-guide"
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30"
          >
            <p className="text-lg font-semibold text-white">
              {locale === "ko" ? "홀짝 패턴 읽는 법" : "Odd-even pattern guide"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              홀짝 통계를 해석할 때 무엇을 같이 봐야 하는지 기초부터 정리합니다.
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
          {copy.trustLinks.map((link) => (
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
