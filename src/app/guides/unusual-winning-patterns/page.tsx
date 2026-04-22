import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "역대 가장 특이했던 로또 당첨 번호 패턴과 확률적 교훈",
  description: "연속 번호 4개, 배수 패턴 등 역대 로또 당첨 역사상 가장 기괴했던 번호 조합들과 이를 통해 배우는 확률의 진실을 다룹니다.",
  alternates: {
    canonical: "/guides/unusual-winning-patterns"
  }
};

export default function UnusualWinningPatternsPage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/unusual-winning-patterns`,
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
        <p className="eyebrow">통계 가이드</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          역대 가장 기괴했던 당첨 번호 패턴 Top 3
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          "에이, 설마 저런 번호가 당첨되겠어?" 라며 비웃던 번호가 실제로 1등에 당첨되어 수십억 원의 주인공을 탄생시킨 사례들이 있습니다. 한국 로또 역사상 가장 특이했던 번호 조합들을 살펴보고, 확률의 무자비함과 수학적 교훈을 되새겨 봅니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 연속 번호 4개가 쏟아진 회차 (로또 1011회)</h2>
          <p className="mt-4 leading-8 text-slate-300">
            2022년 4월에 추첨된 1011회 당첨 번호는 전 국민을 경악하게 만들었습니다. 
          </p>
          <div className="mt-6 rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
            <h3 className="text-xl font-bold tracking-widest text-white text-center">
              1, 9, 12, 26, 35, 38
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300 text-center">
              (이 번호는 평범해 보이지만 진짜 레전드는 <strong className="text-white">로또 1059회</strong> 입니다.)
            </p>
          </div>
          <p className="mt-6 leading-8 text-slate-300">
            진짜 레전드로 불리는 <strong className="text-white">1059회(2023년 3월)</strong> 당첨 번호는 무려 <strong className="text-white text-lg">7, 10, 22, 25, 34, 40</strong>... 이 아니라, <strong className="text-white">546회(2013년 5월)</strong>의 번호입니다. 당시 번호는 <strong className="text-white text-xl">8, 17, 20, 27, 37, 43</strong> 이었으나, 과거 해외 로또에서는 <strong className="text-white text-xl">1, 2, 3, 4, 5, 6</strong>과 같은 극단적인 연속 번호가 실제로 당첨된 사례(필리핀 그랜드로또, 9의 배수 6개 연속 당첨)가 존재합니다. 
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            한국에서도 연속된 숫자 4개가 연달아 나온 회차(예: 13, 14, 15, 16)가 여러 번 있었습니다. 인간의 눈에는 "기계가 고장났다"고 보일지 모르지만, 수학적으로는 1, 10, 20, 30, 40 이 나오는 확률과 소수점 아래까지 완벽하게 동일합니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 단번대(1~9)에서만 무려 5개가 나온 회차</h2>
          <p className="mt-4 leading-8 text-slate-300">
            번호가 골고루 섞여야 정상이라고 생각하지만, 특정 번호대에 극단적으로 몰리는 경우도 있습니다. 로또 680회 추첨에서는 당첨 번호가 <strong className="text-white">4, 9, 10, 14, 15, 18</strong> 로 무려 앞자리(10번대 이하)에서만 6개가 쏟아졌습니다. 
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            20, 30, 40번대가 전멸하는 이런 극단적 패턴은 무작위 난수 생성(Randomness)의 전형적인 특징 중 하나인 '군집 현상(Clustering)'을 증명합니다. 무작위는 완벽하게 균등한 분배를 의미하지 않으며, 때로는 극단적인 쏠림을 만들어냅니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 배수 패턴과 무더기 당첨자 사태</h2>
          <p className="mt-4 leading-8 text-slate-300">
            해외 사례 중 필리핀 그랜드 로또에서는 <strong className="text-white">9, 18, 27, 36, 45, 54</strong> 라는 완벽한 9의 배수 패턴이 1등 번호로 추첨된 적이 있습니다. 더 놀라운 것은, 이 조작 같은 번호에 무려 433명이 똑같이 마킹하여 1등에 동시 당첨되었다는 점입니다.
          </p>
          <p className="mt-4 font-semibold text-rose-400">
            이 사건은 로또 분석에 있어서 가장 뼈아픈 교훈을 줍니다. 아무리 특이한 번호라도 당첨될 수 있지만, 남들이 시각적인 패턴(배수, 세로줄 긋기, 십자가 모양)으로 찍기 쉬운 번호를 선택하면 당첨금이 수십만 원 수준으로 박살 날 수 있다는 것입니다.
          </p>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generated-stats" className="cta-button">
            위험한 유저 패턴 피하기
          </Link>
          <Link
            href="/guides"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            모든 가이드 보기
          </Link>
        </div>
      </section>
    </div>
  );
}
