import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 홀짝 패턴 완벽 분석: 대수의 법칙과 조합 확률",
  description: "로또 당첨 번호에서 홀짝 패턴이 어떻게 나타나는지 조합론(Combinatorics)과 대수의 법칙을 통해 분석한 전문 가이드입니다.",
  alternates: {
    canonical: "/guides/odd-even-pattern-guide"
  }
};

export default function OddEvenPatternGuidePage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/odd-even-pattern-guide`,
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
        <p className="eyebrow">패턴 가이드</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          홀짝 패턴의 비밀: 왜 3:3이나 4:2가 가장 많이 나올까?
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          로또 번호를 분석할 때 가장 기초적이면서도 널리 쓰이는 지표가 바로 '홀짝(Odd/Even) 비율'입니다. 6개의 당첨 번호 중 홀수와 짝수가 각각 몇 개씩 포함되어 있는지를 보는 것인데, 이 단순해 보이는 비율 안에는 심오한 조합론(Combinatorics)과 확률의 법칙이 숨어 있습니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 홀짝이 6:0 이나 0:6으로 나올 확률</h2>
          <p className="mt-4 leading-8 text-slate-300">
            로또 45개 번호 중 홀수는 23개, 짝수는 22개입니다. 많은 분들이 "짝수만 6개 나오는 것은 조작이다" 혹은 "불가능에 가깝다"라고 생각하지만, 수학적으로 계산해보면 다음과 같습니다.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
            <ul className="space-y-4 text-sm leading-7 text-slate-300">
              <li><strong>홀수 6개 (6:0):</strong> 23개 중 6개를 고르는 경우의 수는 100,947가지. 전체의 약 1.2% 확률입니다.</li>
              <li><strong>짝수 6개 (0:6):</strong> 22개 중 6개를 고르는 경우의 수는 74,613가지. 전체의 약 0.9% 확률입니다.</li>
            </ul>
          </div>
          <p className="mt-6 leading-8 text-slate-300">
            1.2%라는 확률은 약 100번 추첨하면 1번 정도는 일어날 수 있는 확률입니다. 1년이 52주이므로, 약 2년에 한 번꼴로는 홀수만 6개 나오는 현상이 벌어집니다. 따라서 이는 조작이 아니라 지극히 정상적인 통계적 현상입니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 왜 3:3 과 4:2 / 2:4 가 압도적으로 많을까?</h2>
          <p className="mt-4 leading-8 text-slate-300">
            로또 1등 당첨 결과를 보면 '홀3:짝3', '홀4:짝2', '홀2:짝4' 비율이 전체 당첨 결과의 무려 **80% 이상**을 차지합니다. 이것은 대수의 법칙이나 마법이 아니라, 단순히 **그렇게 조합될 수 있는 '경우의 수' 자체가 압도적으로 많기 때문**입니다.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li><strong>홀3 짝3:</strong> 23C3 × 22C3 = 1,771 × 1,540 = 2,727,340가지 (약 33.5%)</li>
            <li><strong>홀4 짝2:</strong> 23C4 × 22C2 = 8,855 × 231 = 2,045,505가지 (약 25.1%)</li>
            <li><strong>홀2 짝4:</strong> 23C2 × 22C4 = 253 × 7,315 = 1,850,695가지 (약 22.7%)</li>
          </ul>
          <p className="mt-6 leading-8 text-slate-300">
            결국 이 세 가지 패턴을 합치면 무려 81.3%가 됩니다. 우리가 체감상 "보통 섞여서 나오네"라고 느끼는 것은, 섞여 있는 조합의 경우의 수가 극단적인 조합(6:0)보다 80배 이상 많기 때문입니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 번호 선택 시 홀짝 비율을 어떻게 활용해야 할까?</h2>
          <p className="mt-4 leading-8 text-slate-300">
            홀짝 분석은 '다음에 나올 번호'를 예측하는 마법의 지팡이가 아닙니다. 하지만 번호를 조합할 때 **내가 고른 번호가 통계적 주류에 속하는지, 비주류에 속하는지 점검하는 안전벨트** 역할을 할 수 있습니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            만약 자신이 고른 6개의 번호가 우연히 모두 짝수(0:6)라면, 이는 약 0.9% 확률의 바늘구멍을 뚫어야 하는 험난한 베팅입니다. 물론 당첨될 확률 자체는 814만 분의 1로 동일하지만, 장기적인 투자(로또 구매) 관점에서는 81%의 확률 안에 들어가는 안전한 3:3, 4:2, 2:4 패턴으로 번호를 구성하는 것이 정석적인 접근입니다.
          </p>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/stats" className="cta-button">
            실시간 홀짝 통계 확인하기
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
