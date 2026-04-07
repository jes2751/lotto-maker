import type { Metadata } from "next";
import Link from "next/link";

import { GeneratedStatsDashboard } from "@/components/generated-stats/generated-stats-dashboard";
import { JsonLd } from "@/components/seo/json-ld";
import { drawRepository } from "@/lib/lotto";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/generated-stats",
    titleKo: "우리 유저 데이터",
    titleEn: "Generated Stats",
    descriptionKo:
      "우리 유저들이 이번 회차에 어떤 번호와 전략을 선택하는지, 생성 수와 점유율, 적중 분포로 보는 공개 데이터 페이지입니다.",
    descriptionEn:
      "A public page for current-round generation volume, strategy share, match distribution, and recent generated sets."
  });
}

  const content = {
  ko: {
    eyebrow: "우리 유저 데이터",
    title: "우리 유저들이 이번 회차에 어디로 몰리는지 바로 보세요",
    description:
      "이 화면은 대화형 커뮤니티가 아니라, 우리 유저들의 공개 생성 흐름을 읽는 군중 관측판입니다. 이번 회차 생성 수, 전략 점유율, 최근 생성 번호, 최근 평가 회차 기준 전략 성과를 한 번에 보여줍니다.",
    links: [
      { href: "/generate", label: "번호 생성하러 가기", primary: true },
      { href: "/stats", label: "공식 당첨 흐름" },
      { href: "/latest-lotto-results", label: "최신 결과 보기" }
    ]
  },
  en: {
    eyebrow: "Public Lab",
    title: "See how visitors are creating sets for the current round at a glance",
    description:
      "This page is not a discussion board. It is a public control board for current-round generation volume, strategy share, recent sets, and recent evaluated performance.",
    links: [
      { href: "/generate", label: "Open generator", primary: true },
      { href: "/stats", label: "Open stats" },
      { href: "/latest-lotto-results", label: "Latest results" }
    ]
  }
} as const;

export default async function GeneratedStatsPage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const siteUrl = getSiteUrl();
  const latestDraw = await drawRepository.getLatest();
  const compareCards =
    locale === "ko"
      ? [
          {
            href: "/stats",
            kicker: "공식 당첨 흐름",
            title: "실제로 나온 번호를 먼저 본다",
            body: "과거 1등 기록으로 장기 흐름과 최근 흐름을 확인합니다."
          },
          {
            href: "/generated-stats",
            kicker: "우리 유저 흐름",
            title: "사람들이 어디로 몰리는지 본다",
            body: "실제 생성 기록으로 전략 점유율과 번호 쏠림을 확인합니다."
          },
          {
            href: "/generate",
            kicker: "바로 실행",
            title: "뽑고 나서 두 흐름에 붙여본다",
            body: "생성 결과를 공식 흐름과 유저 흐름 양쪽에서 비교합니다."
          }
        ]
      : [
          {
            href: "/stats",
            kicker: "Official draw flow",
            title: "Check what actually won first",
            body: "Review long-term and recent winning history."
          },
          {
            href: "/generated-stats",
            kicker: "User crowd flow",
            title: "See where people are clustering",
            body: "Review strategy share and number concentration."
          },
          {
            href: "/generate",
            kicker: "Action",
            title: "Generate, then compare both views",
            body: "Use both axes to judge your set."
          }
        ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: locale === "ko" ? "생성 통계" : "Generated Stats",
          description: copy.description,
          url: `${siteUrl}/generated-stats`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="panel hero-panel grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="section-title mt-4 max-w-4xl text-gradient-silver">{copy.title}</h1>
          <p className="body-large mt-5 max-w-4xl text-slate-300">{copy.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-6 md:gap-2.5">
            {(locale === "ko"
              ? ["유저 전략 점유율", "번호 쏠림", "군중 흐름", "공식 기준과 비교"]
              : ["strategy share", "number concentration", "compare with official flow", "overlap hints"]
            ).map((item, index) => (
              <span key={item} className={index > 1 ? "spark-pill hidden md:inline-flex" : "spark-pill"}>
                {item}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {(
              locale === "ko"
                ? [
                    { title: "1. 사람들 몰림 보기", body: "실제 생성된 전략과 번호 쏠림 확인" },
                    { title: "2. 공식 기준과 비교", body: "실제로 나온 번호 흐름과 분리해서 읽기" },
                    { title: "3. 다시 생성하기", body: "내 번호를 다시 뽑고 두 흐름에 붙여 보기" }
                  ]
                : [
                    { title: "1. Crowd flow", body: "Check actual strategy and number concentration" },
                    { title: "2. Compare", body: "Read this separately from official draws" },
                    { title: "3. Generate again", body: "Create another set and compare both axes" }
                  ]
            ).map((item) => (
              <div key={item.title} className="soft-card rounded-[22px] px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-accent">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-3">
            {compareCards.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className={index > 1 ? "play-card hidden md:flex" : "play-card"}
              >
                <span className="play-card-kicker">{item.kicker}</span>
                <span className="play-card-title">{item.title}</span>
                <span className="play-card-body">{item.body}</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {copy.links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "primary" in item && item.primary ? "cta-button" : "secondary-button",
                  item.href === "/latest-lotto-results" ? "hidden sm:inline-flex" : "w-full sm:w-auto"
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="soft-card border-accent/20 bg-[linear-gradient(180deg,rgba(255,143,0,0.14)_0%,rgba(15,23,42,0.94)_100%)]">
          <p className="eyebrow">{locale === "ko" ? "군중 관측판" : "Crowd Board"}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="kpi-cell px-3 py-3 md:px-5 md:py-4">
              <p className="text-xs text-slate-400">{locale === "ko" ? "현재 대상" : "Target"}</p>
              <p className="mt-2 text-lg font-semibold text-white md:text-2xl">
                {latestDraw ? `${latestDraw.round + 1}회` : "-"}
              </p>
            </div>
            <div className="kpi-cell px-3 py-3 md:px-5 md:py-4">
              <p className="text-xs text-slate-400">{locale === "ko" ? "해석 방식" : "Mode"}</p>
              <p className="mt-2 text-lg font-semibold text-white md:text-2xl">{locale === "ko" ? "공개 흐름" : "Public flow"}</p>
            </div>
            <div className="kpi-cell col-span-2 px-3 py-3 md:col-span-1 md:px-5 md:py-4">
              <p className="text-xs text-slate-400">{locale === "ko" ? "비교축" : "Axis"}</p>
              <p className="mt-2 text-lg font-semibold text-white md:text-2xl">{locale === "ko" ? "전략 성과" : "Strategy"}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {(
              locale === "ko"
                ? [
                    "이 화면은 사람들이 실제로 만든 번호 흐름을 보는 곳입니다.",
                    "공식 당첨 기록 자체는 과거 1등 데이터에서 따로 보는 편이 정확합니다.",
                    "좋아 보이는 흐름이어도 예측이 아니라 군중 편향으로 읽어야 합니다."
                  ]
                : [
                    "This page shows what users actually generated.",
                    "Use the official stats page for the actual winning record.",
                    "Treat this as public generation bias, not prediction."
                  ]
            ).map((item, index) => (
              <div key={item} className={index > 0 ? "signal-row hidden sm:flex" : "signal-row"}>
                <span className="signal-row-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GeneratedStatsDashboard latestDraw={latestDraw} />
    </div>
  );
}
