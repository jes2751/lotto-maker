import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 1등 당첨 확률의 수학적 진실: 814만 분의 1과 기댓값",
  description: "814만 분의 1이라는 로또 당첨 확률의 의미와, 수학적 기댓값(Expected Value)을 통해 왜 1,2,3,4,5,6을 찍으면 안 되는지 증명합니다.",
  alternates: {
    canonical: "/guides/lotto-probability-truth"
  }
};

export default function LottoProbabilityTruthPage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/lotto-probability-truth`,
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
        <p className="eyebrow">확률 가이드</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          로또 1등 당첨 확률의 수학적 진실과 기댓값
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          "벼락 맞을 확률보다 낮다"고 흔히 표현하는 로또 1등 당첨 확률, 정확히 8,145,060분의 1입니다. 이 숫자는 어떻게 계산된 것이며, 이 가혹한 확률 속에서 우리는 어떤 수학적 기준을 가지고 번호를 선택해야 할까요? 통계학과 확률론을 통해 진실을 알아봅니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 8,145,060분의 1은 어떻게 나왔을까?</h2>
          <p className="mt-4 leading-8 text-slate-300">
            로또는 45개의 숫자 중 순서에 상관없이 6개를 고르는 게임입니다. 이를 고등학교 수학 시간에 배우는 조합(Combination) 공식으로 표현하면 <strong className="text-white">45C6</strong>이 됩니다.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
            <p className="text-sm leading-7 text-slate-300">
              계산식: (45 × 44 × 43 × 42 × 41 × 40) ÷ (6 × 5 × 4 × 3 × 2 × 1) = <strong className="text-white">8,145,060</strong>
            </p>
          </div>
          <p className="mt-6 leading-8 text-slate-300">
            즉, 이 세상에는 정확히 814만 5,060개의 서로 다른 로또 번호 조합이 존재합니다. 당신이 어떤 기발한 숫자를 고르든, 1, 2, 3, 4, 5, 6처럼 연달아 고르든 당첨될 확률은 <strong className="text-white">1 / 8,145,060</strong> 으로 완벽하게 동일합니다. 우주가 멸망할 때까지 이 확률은 변하지 않습니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 확률이 같다면 아무 번호나 찍어도 될까?</h2>
          <p className="mt-4 leading-8 text-slate-300">
            "어차피 다 똑같은 확률이니 1, 2, 3, 4, 5, 6을 찍겠다!" 수학적으로 당첨 확률 측면에서는 맞는 말입니다. 하지만 재무적, 투자적 관점인 <strong className="text-white">'기댓값(Expected Value, EV)'</strong> 측면에서는 최악의 선택입니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            기댓값이란 `당첨 확률 × 수령할 당첨금`을 의미합니다. 로또 1등 당첨금이 20억 원이라고 가정할 때, 나 혼자 당첨되면 기댓값 계산식에 20억이 들어갑니다. 하지만 1, 2, 3, 4, 5, 6 같은 특이한 일련번호나 7, 14, 21, 28, 35, 42 같은 배수 패턴은 매주 수천 명, 수만 명이 똑같이 마킹합니다.
          </p>
          <p className="mt-4 font-semibold text-rose-400">
            만약 이 패턴이 1등에 당첨되어 1만 명의 당첨자가 나온다면? 20억 원을 1만 명이 나누어 1인당 20만 원을 받게 됩니다. 당첨 확률은 같을지 몰라도, 얻게 되는 가치(기댓값)는 바닥으로 추락하는 것입니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 통계적 사고로 접근하는 최적의 전략</h2>
          <p className="mt-4 leading-8 text-slate-300">
            결론적으로, 통계를 분석하고 분석기를 사용하는 궁극적인 이유는 <strong className="text-white">'확률을 높이기 위해서'가 아니라 '기댓값을 방어하기 위해서'</strong>입니다. 남들이 무의식적으로 많이 고르는 패턴(생일, 수직/수평 마킹 패턴, 연속된 숫자)을 수학적으로 회피해야 합니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            Lotto Maker Lab의 생성기는 철저한 무작위성을 기반으로 하되, 인간이 본능적으로 선호하는 '위험한 패턴(겹침이 많이 발생할 패턴)'을 걸러내어, 당첨 시 독식 혹은 최소한의 인원과 당첨금을 나눌 수 있도록 통계적인 안전망을 제공합니다.
          </p>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-button">
            수학적 기반 번호 생성하기
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
