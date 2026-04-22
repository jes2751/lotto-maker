import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

const guideEntries = {
  ko: [
    {
      href: "/guides/lotto-number-generator-vs-random",
      title: "생성기 vs 랜덤 추천",
      description: "로또 번호 생성기를 사용해야 하는 이유를 독립 확률과 겹침 회피 전략 등 수학적 관점에서 분석합니다."
    },
    {
      href: "/guides/lotto-probability-truth",
      title: "1등 확률과 기댓값의 진실",
      description: "814만 분의 1 확률의 의미와, 수학적 기댓값을 통해 왜 1,2,3,4,5,6을 찍으면 안 되는지 증명합니다."
    },
    {
      href: "/guides/odd-even-pattern-guide",
      title: "홀짝 패턴 완벽 분석",
      description: "홀짝 3:3이나 4:2가 가장 많이 나오는 이유를 대수의 법칙과 조합론을 통해 설명합니다."
    },
    {
      href: "/guides/lotto-sum-pattern-analysis",
      title: "당첨 번호 합계 통계의 비밀",
      description: "6개 번호의 합계가 정규 분포 곡선에 따라 120~160 사이에 집중되는 현상을 수학적으로 파헤칩니다."
    },
    {
      href: "/guides/recent-hot-and-cold-numbers",
      title: "핫 넘버와 콜드 넘버",
      description: "자주 나오는 번호와 안 나오는 번호의 통계적 회귀 현상과 군중 심리를 분석합니다."
    },
    {
      href: "/guides/how-to-buy-lotto-online",
      title: "로또 인터넷 구매 방법",
      description: "모바일 불가 정책, K뱅크 연동 충전 등 로또 온라인 구매 시 알아야 할 규제와 팁을 정리했습니다."
    },
    {
      href: "/guides/what-to-do-when-winning-lotto",
      title: "1등 당첨 시 행동 요령 4가지",
      description: "로또 1등 당첨 시 가장 먼저 해야 할 서명부터 농협 본점 방문까지 현실적인 대처법을 안내합니다."
    },
    {
      href: "/guides/lotto-tax-and-claim-guide",
      title: "당첨금 세금 및 실수령액 계산",
      description: "33% 세금 구간 계산법과 농협 본점 방문 절차 등 실제 수령에 필요한 정보를 총망라했습니다."
    },
    {
      href: "/guides/the-truth-of-lotto-hotspots",
      title: "로또 명당의 수학적 진실",
      description: "1등 당첨자가 많이 나오는 소위 '로또 명당'의 비밀을 표본 크기와 선택 편향으로 분석합니다."
    },
    {
      href: "/guides/lotto-vs-pension-lottery",
      title: "로또 6/45 vs 연금복권 720+",
      description: "일시불과 연금의 차이, 기댓값, 그리고 33%와 22%의 세금 차이를 재무적 관점에서 비교합니다."
    },
    {
      href: "/guides/illegal-overseas-lotto",
      title: "해외 복권(파워볼) 구매의 불법성",
      description: "국내 대행사를 통해 미국 복권을 구매하는 행위의 도박죄 처벌 위험과 당첨금 미지급 리스크를 경고합니다."
    },
    {
      href: "/guides/unusual-winning-patterns",
      title: "역대 가장 기괴했던 패턴 Top 3",
      description: "연속 번호 4개, 9의 배수 등 실제 당첨되었던 특이한 조합들을 통해 무작위와 기댓값의 진실을 배웁니다."
    },
    {
      href: "/guides/lotto-asset-management",
      title: "당첨금 15억 자산 관리 전략",
      description: "1등 실수령액 15억 원을 잃지 않고 지켜내기 위한 파킹통장, 배당주 등 현실적인 재무 가이드입니다."
    }
  ],
  en: [
    {
      href: "/guides/lotto-number-generator-vs-random",
      title: "Lotto number generator vs random picks",
      description: "Explain the difference between a pure random pick and a historical-data-based recommendation page."
    },
    {
      href: "/guides/recent-hot-and-cold-numbers",
      title: "Hot and Cold numbers",
      description: "Summarize the numbers that appeared most often in the latest rounds and connect them to the stats pages."
    },
    {
      href: "/guides/odd-even-pattern-guide",
      title: "How to read odd-even patterns",
      description: "Turn a common Lotto question into a guide article that links back into the pattern analysis landing page."
    }
  ]
} as const;

export const metadata: Metadata = {
  title: "로또 가이드 | 번호 생성기와 통계를 이해하는 글",
  description: "로또 번호 생성기 설명, 최근 자주 나온 번호, 홀짝 패턴 읽는 법까지 한국어 로또 가이드를 모아둔 콘텐츠 허브입니다.",
  alternates: { canonical: "/guides" }
};

export default async function GuidesHubPage() {
  const locale = "ko" as const;
  const siteUrl = getSiteUrl();
  const entries = guideEntries[locale];
  const copy = {
    name: "로또 가이드",
    description: "번호 생성기와 통계를 이해하는 한국어 로또 가이드 허브",
    eyebrow: "가이드",
    title: "번호 생성기와 통계를 이해하는 로또 가이드",
    intro:
      "이 가이드 허브는 한국어 검색 유입에 맞춰 로또 번호 생성기, 자주 나온 번호, 패턴 읽는 법을 설명하는 글을 모아둔 공간입니다. 각 글은 하나의 질문에 답한 뒤 추천기, 회차 조회, 통계 흐름으로 자연스럽게 이어지도록 구성했습니다.",
    next: "다음 단계",
    generator: "번호 생성기 열기",
    stats: "통계 허브 열기"
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: copy.name,
          description: copy.description,
          url: `${siteUrl}/guides`,
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
        <p className="mt-4 leading-8 text-slate-300">{copy.intro}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {entries.map((guide) => (
          <Link key={guide.href} href={guide.href} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <p className="text-lg font-semibold text-white">{guide.title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">{guide.description}</p>
          </Link>
        ))}
      </section>

      <section className="panel">
        <p className="eyebrow">{copy.next}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-button">
            {copy.generator}
          </Link>
          <Link href="/lotto-statistics" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
            {copy.stats}
          </Link>
        </div>
      </section>
    </div>
  );
}
