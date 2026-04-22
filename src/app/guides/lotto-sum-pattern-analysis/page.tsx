import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 당첨 번호 합계 구간 분석: 정규 분포와 평균 합계 138의 비밀",
  description: "로또 당첨 번호 6자리의 합계가 통계학의 정규 분포 곡선에 따라 120~160 사이에 집중되는 이유를 수학적으로 분석합니다.",
  alternates: {
    canonical: "/guides/lotto-sum-pattern-analysis"
  }
};

export default function LottoSumPatternAnalysisPage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/lotto-sum-pattern-analysis`,
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
          당첨 번호 '합계 통계'의 수학적 진실: 왜 항상 비슷할까?
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          당첨된 로또 6개 번호를 모두 더해보면 대부분 120에서 160 사이의 값이 나옵니다. "역시 기계가 조작되어 있어서 합계가 일정하게 나온다!"라고 의심하기 전에, 이것이 수학적으로 너무나도 당연한 현상이라는 점을 통계학의 정규분포(Normal Distribution)를 통해 알아보겠습니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 최소 합계와 최대 합계의 극단적 경우</h2>
          <p className="mt-4 leading-8 text-slate-300">
            우선 1부터 45까지의 숫자 중에서 6개를 고를 때 만들 수 있는 합계의 범위를 보겠습니다.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li><strong>최소 합계 (21):</strong> 1 + 2 + 3 + 4 + 5 + 6</li>
            <li><strong>최대 합계 (255):</strong> 40 + 41 + 42 + 43 + 44 + 45</li>
          </ul>
          <p className="mt-4 leading-8 text-slate-300">
            합계가 21이 나오는 경우는 오직 1가지(1,2,3,4,5,6)뿐이며, 합계가 255가 나오는 경우도 오직 1가지(40,41,42,43,44,45)뿐입니다. 이 두 경우가 나올 확률은 전체 814만 가지 경우의 수 중 0.00001%도 되지 않습니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 왜 중간 합계인 138 주변에 몰릴까? (중심극한정리)</h2>
          <p className="mt-4 leading-8 text-slate-300">
            반면, 합계가 중간값(약 138)이 되는 번호 조합의 개수는 어떨까요? 중간 숫자를 만드는 조합은 셀 수 없이 많습니다. 예를 들어 합이 138이 되려면 작은 숫자, 중간 숫자, 큰 숫자가 골고루 섞이게 됩니다.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white">정규 분포 곡선 (Bell Curve)</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              통계학의 중심극한정리에 의해, 무작위로 숫자를 뽑아 합을 구하는 행위를 무한히 반복하면 그 분포는 종 모양의 정규 분포 곡선을 그립니다. 양 극단(합계 21이나 255)은 꼬리에 위치해 확률이 0에 수렴하며, 중앙값인 138 부근이 가장 봉긋하게 솟아올라 압도적인 확률을 차지하게 됩니다.
            </p>
          </div>
          <p className="mt-6 leading-8 text-slate-300">
            실제로 역대 로또 당첨 번호를 전수 분석해 보면, <strong className="text-white">전체 당첨의 약 70% 이상이 합계 120 ~ 160 구간</strong>에 위치하고 있습니다. 이는 주최 측이 일부러 그렇게 만드는 것이 아니라 수학이 지배하는 자연스러운 현상입니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 생성기 사용 시 합계 필터를 써야 하는 이유</h2>
          <p className="mt-4 leading-8 text-slate-300">
            그렇다면 합계 범위를 지정하여 번호를 고르는 전략은 어떨까요? 번호를 무작위로 뽑더라도 결국 자연스럽게 138 주변에 몰리게 되어 있습니다. 하지만 가끔 운이 나쁘게 합계가 60 이하로 떨어지는 극단적인 조합이 나올 수 있습니다.
          </p>
          <p className="mt-4 font-semibold text-rose-400">
            극단적인 합계를 고른다고 당첨 확률이 낮아지는 것은 아닙니다. 하지만 통계적으로 가장 자주 일어나는 메인 스트림(120~160) 영역에 베팅하는 것이 심리적으로 안정감을 주며, 불필요한 확률의 꼬리 영역(Outliers)에 자금을 낭비하지 않는 합리적인 선택입니다.
          </p>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/stats" className="cta-button">
            당첨 번호 합계 통계 확인하기
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
