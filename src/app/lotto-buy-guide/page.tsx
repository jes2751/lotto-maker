import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getRequestPreferences } from "@/lib/server-preferences";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/lotto-buy-guide",
    titleKo: "온라인 구매 안내와 로또 기본 정보",
    titleEn: "Online buying guide and Lotto basics",
    descriptionKo:
      "동행복권 공식 안내를 기준으로 온라인 구매 가능 여부, 구매 한도, 판매 시간, 추첨 일정, 기본 주의사항을 정리했습니다.",
    descriptionEn:
      "A simple guide to official online buying, time limits, draw schedule, and basic Lotto rules."
  });
}

const content = {
  ko: {
    eyebrow: "구매 안내",
    title: "온라인 구매와 로또 기본 정보를\n한 번에 확인하세요",
    intro:
      "동행복권 공식 안내를 기준으로 온라인 구매 가능 여부, 구매 한도, 판매 시간, 추첨 일정, 기본 주의사항을 정리했습니다.",
    updated: "2026-04-02 기준 공식 안내 확인",
    cards: [
      {
        title: "온라인으로 구매할 수 있나요?",
        body: "가능합니다. 동행복권 공식 홈페이지에서 로또 6/45를 구매할 수 있습니다."
      },
      {
        title: "온라인 구매 한도는 얼마인가요?",
        body: "공식 안내 기준으로 인터넷 구매는 1회차 1인 5천 원으로 제한됩니다."
      },
      {
        title: "판매 시간은 어떻게 되나요?",
        body: "매일 오전 6시부터 밤 12시까지 판매하며, 추첨일인 토요일은 오후 8시에 마감합니다."
      },
      {
        title: "추첨은 언제 하나요?",
        body: "로또 6/45는 매주 토요일 추첨이며 최신 결과는 추첨 이후 확인할 수 있습니다."
      }
    ],
    basicsTitle: "기본적으로 알아둘 점",
    basics: [
      "로또 6/45는 45개 번호 중 6개를 선택하는 방식입니다.",
      "자동, 반자동, 수동 방식으로 번호를 선택할 수 있습니다.",
      "만 19세 미만은 복권을 구매할 수 없습니다.",
      "정상 발매된 복권은 환불되지 않습니다.",
      "추천 번호와 통계는 참고용이며 당첨을 보장하지 않습니다."
    ],
    linksTitle: "공식 안내 바로가기",
    officialLink: {
      href: "https://www.dhlottery.co.kr/common.do?method=main",
      label: "동행복권 구매하기"
    },
    infoLink: {
      href: "https://www.dhlottery.co.kr/lt645/intro",
      label: "로또 6/45 소개"
    },
    nextTitle: "같이 보면 좋은 페이지",
    nextLinks: [
      { href: "/generate", label: "번호 생성기" },
      { href: "/draws", label: "최신 당첨번호 보기" },
      { href: "/faq", label: "자주 묻는 질문" }
    ]
  },
  en: {
    eyebrow: "Buying Guide",
    title: "Online buying and Lotto basics\nin one place",
    intro:
      "Based on the official lottery site, this page summarizes online buying, purchase limits, sales hours, draw timing, and basic cautions.",
    updated: "Checked against official pages on 2026-04-02",
    cards: [
      {
        title: "Can I buy online?",
        body: "Yes. Lotto 6/45 can be purchased through the official lottery website."
      },
      {
        title: "What is the online limit?",
        body: "Internet Lotto buying is limited to KRW 5,000 per person per round."
      },
      {
        title: "When is it sold?",
        body: "Sales run from 6:00 to 24:00 daily and close at 20:00 on Saturdays."
      },
      {
        title: "When is the draw?",
        body: "Lotto 6/45 is drawn every Saturday and the result is posted right after the draw."
      }
    ],
    basicsTitle: "Basic points to know",
    basics: [
      "Lotto 6/45 uses 6 numbers selected from 45.",
      "You can buy with automatic, semi-automatic, or manual selection.",
      "People under 19 cannot legally buy lottery tickets.",
      "Valid issued tickets are not refundable.",
      "Recommendations and statistics should be treated as reference material."
    ],
    linksTitle: "Official links",
    officialLink: {
      href: "https://www.dhlottery.co.kr/common.do?method=main",
      label: "Open Donghang Lottery"
    },
    infoLink: {
      href: "https://www.dhlottery.co.kr/lt645/intro",
      label: "Lotto 6/45 overview"
    },
    nextTitle: "Related pages",
    nextLinks: [
      { href: "/generate", label: "Generator" },
      { href: "/draws", label: "Latest results" },
      { href: "/faq", label: "FAQ" }
    ]
  }
} as const;

export default async function LottoBuyGuidePage() {
  const { locale } = await getRequestPreferences();
  const copy = content[locale];
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: locale === "ko" ? "온라인 구매 안내와 로또 기본 정보" : "Online buying guide and Lotto basics",
          description: copy.intro,
          url: `${siteUrl}/lotto-buy-guide`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <section className="panel">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="mt-4 whitespace-pre-line text-4xl font-semibold text-white">{copy.title}</h1>
        <p className="mt-4 max-w-4xl leading-8 text-slate-300">{copy.intro}</p>
        <p className="mt-3 text-sm text-slate-400">{copy.updated}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {copy.cards.map((card) => (
          <article key={card.title} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
            <h2 className="text-xl font-semibold text-white">{card.title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">{card.body}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <p className="eyebrow">{locale === "ko" ? "기본 정보" : "Basics"}</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">{copy.basicsTitle}</h2>
        <div className="mt-6 grid gap-4">
          {copy.basics.map((item) => (
            <article key={item} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-sm leading-7 text-slate-300">
              {item}
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">{locale === "ko" ? "공식 링크" : "Official Links"}</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">{copy.linksTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <a
            href={copy.officialLink.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-base font-medium text-white transition hover:border-white/30"
          >
            {copy.officialLink.label}
          </a>
          <a
            href={copy.infoLink.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-base font-medium text-white transition hover:border-white/30"
          >
            {copy.infoLink.label}
          </a>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">{locale === "ko" ? "관련 페이지" : "Related"}</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">{copy.nextTitle}</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {copy.nextLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
