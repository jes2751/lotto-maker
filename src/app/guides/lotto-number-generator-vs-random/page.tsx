import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 번호 생성기와 랜덤 추천의 수학적 차이: 독립 확률과 겹침 회피 전략",
  description: "로또 번호 생성기를 사용해야 하는 이유를 독립 확률, 대수의 법칙, 겹침 회피 전략 등 수학적, 통계적 관점에서 상세히 분석한 가이드입니다.",
  alternates: {
    canonical: "/guides/lotto-number-generator-vs-random"
  }
};

export default function GeneratorVsRandomGuidePage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
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
        <p className="eyebrow">전략 가이드</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          자동 추천 vs 생성기: 수학적 관점에서의 완전 분석
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          "어차피 로또는 운인데, 굳이 생성기를 써야 하나요?" 이 질문에 대한 가장 수학적이고 이성적인 답변을 드립니다. 단순히 무작위로 번호를 고르는 것과, 통계적 알고리즘이 적용된 생성기를 사용하는 것은 '당첨 확률' 측면에서는 동일하지만, <strong className="text-white">'당첨금의 기댓값(Expected Value)'</strong> 측면에서는 완전히 다른 결과를 낳습니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 독립 시행과 당첨 확률의 진실</h2>
          <p className="mt-4 leading-8 text-slate-300">
            로또 추첨은 대표적인 '독립 시행(Independent Trial)'입니다. 지난 주에 1, 2, 3번이 나왔다고 해서 이번 주에 1, 2, 3번이 나올 확률이 낮아지는 것은 아닙니다. 매 추첨마다 45개의 공이 뽑힐 확률은 완벽하게 동일합니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            따라서, 어떤 기계나 알고리즘을 사용하더라도 "다음에 확실히 당첨될 번호"를 예측하는 것은 수학적으로 불가능합니다. 완전 무작위 자동(Random)을 선택하든, 통계 기반 생성기를 사용하든 1등 당첨 확률은 <strong className="text-white">8,145,060분의 1</strong>로 절대 변하지 않습니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 왜 생성기를 써야 하는가? '겹침 회피 전략'</h2>
          <p className="mt-4 leading-8 text-slate-300">
            그렇다면 왜 생성기가 필요할까요? 핵심은 <strong className="text-white">'당첨되었을 때 얼마를 받을 것인가(당첨금 분배)'</strong>에 있습니다.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white">인간의 편향성 (Human Bias)</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              수동으로 번호를 고를 때 사람들은 무의식적으로 특정한 패턴을 선호합니다. 생일(1~31), 기념일, 시각적 패턴(일렬로 찍기), 혹은 7, 3, 11과 같이 인기 있는 행운의 숫자를 주로 선택합니다. 반대로 41, 42, 43, 44, 45처럼 연속된 숫자나 가장자리에 있는 숫자는 본능적으로 피합니다.
            </p>
          </div>
          <p className="mt-6 leading-8 text-slate-300">
            이러한 편향성 때문에, 만약 '1, 2, 3, 4, 5, 6' 혹은 '7, 14, 21, 28, 35, 42'와 같이 사람들이 많이 찍는 패턴이 실제 1등 번호로 추첨될 경우, 수만 명의 1등 당첨자가 발생하게 됩니다. 이 경우 1등 당첨금은 수십억 원이 아니라 수백만 원 수준으로 폭락합니다. 
          </p>
          <p className="mt-4 font-semibold text-rose-400">
            생성기의 목적은 '당첨 확률을 높이는 것'이 아니라, '사람들이 잘 고르지 않는 번호 조합을 찾아내어 당첨금 기댓값을 극대화하는 것(겹침 회피)'입니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 완전 랜덤(Random) 방식의 치명적 단점</h2>
          <p className="mt-4 leading-8 text-slate-300">
            판매점의 '자동'이나 단순 난수 발생기(Random Number Generator)는 말 그대로 아무런 통제 없이 숫자를 뽑습니다. 이 경우 가끔 5개의 숫자가 모두 10번대 이하로 쏠리거나, 짝수만 6개가 나오는 등 <strong className="text-white">극단적인 패턴</strong>이 나올 수 있습니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            물론 극단적인 패턴도 나올 확률 자체는 동일하지만, 과거 통계적으로 볼 때 홀짝이 3:3이거나 합계가 120~160 사이인 경우가 전체 당첨의 대다수를 차지합니다. 굳이 확률적으로 '장기적인 평균(정규 분포의 중앙)'에서 크게 벗어난 희귀한 패턴에 돈을 걸 필요는 없습니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">4. Lotto Maker Lab 생성기의 철학</h2>
          <p className="mt-4 leading-8 text-slate-300">
            Lotto Maker Lab의 데이터 기반 번호 생성기는 단순 난수 생성을 넘어 다음과 같은 안전장치를 제공합니다:
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li><strong>분산 리스크 최소화:</strong> 대중적으로 인기 있는 숫자 조합이나 특이한 시각적 패턴을 피하도록 필터링합니다.</li>
            <li><strong>통계적 회귀 반영:</strong> 오랫동안 나오지 않은 '콜드 넘버'와 최근 자주 나온 '핫 넘버'를 적절한 비율로 섞어 추천합니다.</li>
            <li><strong>균형 잡힌 패턴:</strong> 극단적인 홀짝 비율이나 번호대 쏠림 현상을 방지하는 필터를 적용할 수 있습니다.</li>
          </ul>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-button">
            스마트 번호 생성기 실행하기
          </Link>
          <Link
            href="/guides"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            다른 가이드 보기
          </Link>
        </div>
      </section>
    </div>
  );
}
