import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/lotto-number-generator",
    titleKo: "로또 번호 생성기",
    titleEn: "Lotto Number Generator",
    descriptionKo: "과거 당첨 데이터 기반 추천 전략과 필터 추첨기를 함께 소개하는 로또 번호 생성기 랜딩 페이지입니다.",
    descriptionEn: "Search landing page for the Lotto number generator, filter generator, and historical-data-based recommendation strategies."
  });
}

const content = {
  ko: {
    pageName: "로또 번호 생성기",
    pageDescription: "과거 당첨 데이터 기반 추천 전략을 설명하는 랜딩 페이지",
    eyebrow: "로또 번호 생성기",
    title: "과거 당첨 데이터 기반 로또 번호 생성기",
    description:
      "mixed, frequency, random, filter 전략을 비교하고 자신에게 맞는 추천 흐름으로 바로 이동할 수 있는 설명형 랜딩 페이지입니다.",
    strategies: [
      ["mixed", "혼합 추천", "전체 흐름과 최근 패턴을 함께 참고하는 기본 추천 전략입니다."],
      ["frequency", "빈도 기반 추천", "자주 나온 번호 흐름을 중심으로 참고할 때 적합합니다."],
      ["random", "랜덤 추천", "완전 무작위 조합을 비교 기준으로 보고 싶을 때 사용합니다."],
      ["filter", "필터 추첨기", "고정수, 제외수, 홀짝, 합계 범위를 직접 정하고 생성합니다."]
    ],
    links: [
      ["/generate", "추천기 바로 열기", "실제 추천기 화면으로 이동합니다."],
      ["/guides/lotto-number-generator-vs-random", "추천기와 랜덤의 차이", "데이터 기반 추천과 완전 랜덤의 차이를 설명합니다."],
      ["/guides/recent-20-hot-numbers", "최근 20회 자주 나온 번호", "단기 흐름을 먼저 보고 전략을 고를 수 있습니다."]
    ]
  },
  en: {
    pageName: "Lotto Number Generator",
    pageDescription: "Landing page that explains the historical-data-based recommendation strategies.",
    eyebrow: "Lotto Number Generator",
    title: "Historical-data-based Lotto number generator",
    description:
      "Compare mixed, frequency, random, and filter strategies, then move directly into the generator that fits your style.",
    strategies: [
      ["mixed", "Mixed strategy", "Balanced recommendation that references both long-term and short-term flow."],
      ["frequency", "Frequency strategy", "Useful when you want to lean on recurring-number trends."],
      ["random", "Random strategy", "Pure random combinations for comparison."],
      ["filter", "Filter generator", "Set fixed numbers, excluded numbers, odd-even balance, and sum range."]
    ],
    links: [
      ["/generate", "Open generator", "Jump into the main recommendation tool."],
      ["/guides/lotto-number-generator-vs-random", "Generator vs random picks", "Explain why a data-based generator and a pure random pick serve different user needs."],
      ["/guides/recent-20-hot-numbers", "Recent 20 hot numbers", "Use a short-term trend summary before choosing a strategy."]
    ]
  }
} as const;

export default async function LottoNumberGeneratorLandingPage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: copy.pageName,
          description: copy.pageDescription,
          url: `${siteUrl}/lotto-number-generator`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="panel">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">{copy.title}</h1>
        <p className="mt-4 leading-8 text-slate-300">{copy.description}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {copy.strategies.map(([key, title, description]) => (
          <div key={key} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{key}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="grid gap-4 md:grid-cols-3">
          {copy.links.map(([href, title, description]) => (
            <Link key={href} href={href} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
              <p className="text-lg font-semibold text-white">{title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
