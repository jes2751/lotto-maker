import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 핫 넘버와 콜드 넘버 분석: 통계적 회귀와 군중 심리",
  description: "최근 자주 나오는 로또 번호(핫 넘버)와 안 나오는 번호(콜드 넘버)의 수학적 의미와 통계적 회귀 현상을 분석합니다.",
  alternates: {
    canonical: "/guides/recent-hot-and-cold-numbers"
  }
};

export default function RecentHotAndColdNumbersGuidePage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/recent-hot-and-cold-numbers`,
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
          최근 자주 나온 번호(Hot)와 쉬고 있는 번호(Cold): 통계적 진실
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          로또 분석가들이 가장 많이 살펴보는 데이터 중 하나가 바로 "최근 10회, 혹은 20회 동안 얼마나 자주 출현했는가?" 입니다. 잘 나오는 번호는 계속 나올까요, 아니면 안 나오던 번호가 이제 나올 차례일까요? 통계학의 '평균으로의 회귀(Regression to the mean)' 이론을 통해 이를 파헤쳐 봅니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 핫 넘버(Hot Numbers)의 착시 현상</h2>
          <p className="mt-4 leading-8 text-slate-300">
            최근 10주 동안 특정 번호(예: 34번)가 4번이나 당첨되었다고 가정해 보겠습니다. 사람들은 이를 '핫 넘버'라 부르며 "흐름을 탔다"고 믿습니다. 하지만 이는 전형적인 <strong className="text-white">도박사의 오류(Gambler's Fallacy)의 반대 형태인 '뜨거운 손의 오류(Hot Hand Fallacy)'</strong>입니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            로또 기계는 과거를 기억하지 못합니다. 34번이 최근 자주 나왔다고 해서 다음 추첨에서 기계가 34번을 더 쉽게 뽑아주는 구조적 이유는 전혀 없습니다. 단지 한정된 짧은 기간(표본) 안에서 우연히 발생한 분산(Variance)일 뿐입니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 콜드 넘버(Cold Numbers)와 '평균으로의 회귀'</h2>
          <p className="mt-4 leading-8 text-slate-300">
            반대로 20주 넘게 단 한 번도 나오지 않은 번호도 있습니다. 이를 '콜드 넘버(장기 미출현 번호)'라고 부릅니다. 사람들은 "이제 나올 때가 되었다"고 기대하며 이 번호를 선택합니다. 이것이 바로 도박사의 오류입니다.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white">평균으로의 회귀 (Regression to the mean)</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              통계학에서 횟수가 수만 번, 수십만 번으로 무한히 길어지면 모든 번호의 출현 빈도는 45분의 1로 똑같아집니다. 하지만 이는 '오래 안 나온 번호가 보상 차원에서 더 나온다'는 뜻이 아닙니다. 앞서 발생한 편차가 무수히 많은 시행 속에 희석되어 평균에 수렴해 보일 뿐입니다. 이번 주 추첨에서 20주 쉰 콜드 넘버가 나올 확률은 여전히 45분의 1입니다.
            </p>
          </div>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 그렇다면 왜 핫/콜드 번호를 분석해야 할까?</h2>
          <p className="mt-4 leading-8 text-slate-300">
            당첨 확률이 동일하다면 왜 이런 통계를 제공하고 분석해야 할까요? 해답은 철저하게 <strong className="text-white">'군중 심리를 역이용하기 위함'</strong>입니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            사람들은 각종 로또 커뮤니티나 매체를 통해 "최근 34번이 핫하다", "이제 7번이 나올 때가 됐다"는 정보를 공유합니다. 그리고 무의식적으로 그 번호들을 수동 용지에 마킹합니다. 만약 모두가 선택한 핫/콜드 조합이 실제 1등에 당첨된다면 어떻게 될까요? 당첨자가 수십 명 쏟아져 1등 당첨금이 폭락하는 비극이 발생합니다.
          </p>
          <p className="mt-4 font-semibold text-rose-400">
            따라서 진정한 통계 분석가는 핫/콜드 넘버를 맹신하여 선택하기보다는, 남들이 과도하게 맹신하는 대중적인 조합을 '피하는(회피하는) 지표'로 활용합니다.
          </p>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/stats" className="cta-button">
            최근 핫/콜드 통계 보기
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
