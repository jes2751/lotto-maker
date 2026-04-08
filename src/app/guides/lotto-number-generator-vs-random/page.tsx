import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 번호 생성기와 랜덤 추천의 차이",
  description: "과거 당첨 데이터 기반 로또 번호 생성기와 완전 랜덤 추천이 어떻게 다른지 한국어로 설명합니다.",
  alternates: {
    canonical: "/guides/lotto-number-generator-vs-random"
  }
};

export default function GeneratorVsRandomGuidePage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "로또 번호 생성기와 랜덤 추천은 다릅니다",
          description: "과거 당첨 데이터 기반 번호 생성기와 완전 랜덤 추천의 차이를 설명하는 한국어 가이드입니다.",
          url: `${siteUrl}/guides/lotto-number-generator-vs-random`,
          inLanguage: "ko-KR",
          author: {
            "@type": "Organization",
            name: siteConfig.name
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name
          }
        }}
      />

      <section className="panel">
        <p className="eyebrow">가이드</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">로또 번호 생성기와 랜덤 추천은 다릅니다</h1>
        <p className="mt-4 leading-8 text-slate-300">
          랜덤 추천은 기준 없이 바로 뽑고 싶을 때 유용합니다. 과거 당첨 데이터 기반 번호 생성기는 출현 빈도,
          최근 흐름, 참고 통계를 함께 보며 조합을 고르고 싶을 때 유용합니다. 둘 다 당첨을 보장하지는 않지만,
          사용 목적이 다릅니다.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="panel">
          <p className="eyebrow">랜덤 추천</p>
          <p className="mt-3 text-sm leading-8 text-slate-300">
            완전 랜덤 추천은 과거 기록을 참고하지 않고 모든 번호를 동일하게 취급합니다. 빠르고 단순하며,
            데이터 기반 추천과 어떤 차이가 있는지 비교 기준으로 보기 좋습니다.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">데이터 기반 추천</p>
          <p className="mt-3 text-sm leading-8 text-slate-300">
            데이터 기반 번호 생성기는 과거 당첨 기록, 출현 빈도, 혼합 전략을 참고해 더 설명 가능한 조합을 만듭니다.
            핵심 가치는 확률 보장이 아니라, 왜 이런 번호가 나왔는지 해석할 수 있다는 점입니다.
          </p>
        </article>
      </section>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-button">
            번호 생성기 열기
          </Link>
          <Link
            href="/lotto-number-generator"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            번호 생성기 설명 보기
          </Link>
        </div>
      </section>
    </div>
  );
}
