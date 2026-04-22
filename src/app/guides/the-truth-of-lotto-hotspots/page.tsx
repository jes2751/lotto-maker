import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 명당의 진실: 왜 특정 판매점에서 1등이 자주 나올까?",
  description: "로또 1등 당첨자가 많이 나오는 소위 '로또 명당'의 수학적 진실을 표본 크기(Sample Size)와 선택 편향으로 분석합니다.",
  alternates: {
    canonical: "/guides/the-truth-of-lotto-hotspots"
  }
};

export default function TheTruthOfLottoHotspotsPage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/the-truth-of-lotto-hotspots`,
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
          로또 명당의 수학적 진실: 진짜 명당일까, 착시일까?
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          매주 토요일 저녁이면 전국의 유명한 '로또 명당' 앞에는 복권을 사기 위해 길게 늘어선 줄을 볼 수 있습니다. 1등 당첨자가 10번, 20번 넘게 나온 곳이라면 정말로 그 터에 특별한 기운이 있는 것일까요? 통계학과 대수의 법칙을 통해 로또 명당의 비밀을 파헤쳐 봅니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 명당이라서 당첨되는 것이 아니라, 많이 사서 당첨되는 것이다</h2>
          <p className="mt-4 leading-8 text-slate-300">
            결론부터 말씀드리면, 판매점의 터가 좋아서 1등 번호가 자주 나오는 것이 아닙니다. <strong className="text-white">"그 판매점에서 로또가 압도적으로 많이 팔리기 때문"</strong>입니다.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white">표본 크기(Sample Size)의 마법</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              일반 동네 판매점에서는 1주일에 로또가 1만 장이 팔린다고 가정해 봅시다. 반면, 소위 명당이라 불리는 전국 탑클래스 판매점에서는 1주일에 50만 장 이상이 팔립니다. 로또 1등 당첨 확률은 814만 분의 1입니다. 50만 장을 팔면 통계적으로 16주에 1번 꼴로 1등이 나올 수밖에 없는 구조가 형성됩니다.
            </p>
          </div>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 선택 편향 (Selection Bias)과 자기 충족적 예언</h2>
          <p className="mt-4 leading-8 text-slate-300">
            로또 명당이 탄생하는 과정은 전형적인 통계적 착시인 '선택 편향'에 해당합니다. 
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li>초기에 우연히 1등 당첨자가 1~2명 나옵니다.</li>
            <li>이 소문이 퍼져 주변 사람들과 다른 지역 사람들이 이 판매점으로 몰려옵니다.</li>
            <li>판매량이 기하급수적으로 늘어나면서 <strong className="text-white">수학적으로 1등이 나올 확률이 높아집니다.</strong></li>
            <li>다시 1등이 나오면 명당이라는 소문이 굳어지고 더 많은 사람이 몰립니다. (자기 충족적 예언)</li>
          </ul>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 수동 당첨자가 명당에서 나오는 이유?</h2>
          <p className="mt-4 leading-8 text-slate-300">
            "자동은 기계가 뽑아주니 그렇다 쳐도, 수동 당첨자가 명당에서 많이 나오는 건 기운이 좋아서 아닌가요?" 라고 묻는 분들도 계십니다. 이 역시 착시입니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            명당을 굳이 찾아가는 사람들은 일반 구매자보다 복권에 진심인 분들이 많습니다. 이들은 자체적인 분석을 통해 <strong className="text-white">다량의 수동 조합</strong>을 구매하는 경향이 짙습니다. 즉, 명당에는 수동으로 구매되는 용지의 절대적인 장수 자체가 많기 때문에 수동 당첨자 비율이 높아 보이는 것뿐입니다.
          </p>
          <p className="mt-4 font-semibold text-rose-400">
            결론적으로, 집 앞 편의점에서 사든 전국 1위 명당에서 사든 당신이 쥔 1장의 당첨 확률은 8,145,060분의 1로 완벽히 동일합니다. 시간과 교통비를 들여 명당을 찾아갈 필요는 없습니다.
          </p>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-button">
            집에서 편하게 번호 생성하기
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
