import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 6/45 vs 연금복권 720+: 기댓값과 세금 완벽 비교",
  description: "벼락부자가 되는 로또와 매월 700만원씩 받는 연금복권의 확률, 기댓값, 세금 차이를 재무적 관점에서 상세히 비교합니다.",
  alternates: {
    canonical: "/guides/lotto-vs-pension-lottery"
  }
};

export default function LottoVsPensionLotteryPage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/lotto-vs-pension-lottery`,
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
        <p className="eyebrow">비교 가이드</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          로또 6/45 vs 연금복권 720+: 무엇을 사는 게 이득일까?
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          대한민국 복권계의 양대산맥, 일시불의 대명사 '로또 6/45'와 안정적 현금흐름의 대명사 '연금복권 720+'. 매주 무엇을 살지 고민되시나요? 확률, 기댓값, 세금이라는 3가지 수학적/재무적 기준을 통해 두 복권을 완벽하게 비교해 드립니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 당첨 확률 비교: 연금복권의 완승</h2>
          <p className="mt-4 leading-8 text-slate-300">
            단순히 1등에 당첨될 확률만 놓고 본다면 연금복권이 압도적으로 유리합니다.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/50 text-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">구분</th>
                  <th className="px-6 py-4 font-medium">로또 6/45 (1등)</th>
                  <th className="px-6 py-4 font-medium">연금복권 720+ (1등)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="px-6 py-4">당첨 확률</td>
                  <td className="px-6 py-4">1 / 8,145,060</td>
                  <td className="px-6 py-4">1 / 5,000,000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">당첨금 구조</td>
                  <td className="px-6 py-4">변동 (통상 15억 ~ 25억 일시불)</td>
                  <td className="px-6 py-4">고정 (월 700만 원 × 20년)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-8 text-slate-300">
            연금복권은 조(1~5조)와 6자리 숫자를 맞추는 구조로 정확히 500만 분의 1의 확률을 가집니다. 로또보다 1등 당첨 확률이 약 1.6배 높습니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 세금 혜택의 비밀: 33% vs 22%</h2>
          <p className="mt-4 leading-8 text-slate-300">
            이 두 복권의 가장 큰 차이는 바로 <strong className="text-white">'세율 적용 방식'</strong>에 있습니다. 대한민국 세법상 복권 당첨금이 3억 원을 초과하면 33%의 고율 세금을 내야 합니다.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li><strong>로또 6/45:</strong> 1등 당첨금이 20억 원이라면, 3억 원 초과분이므로 약 6억 원 이상을 세금으로 떼고 13억 후반대를 일시불로 받습니다.</li>
            <li><strong>연금복권 720+:</strong> 총 수령액은 16억 8천만 원(700만 원 × 240개월)으로 3억 원이 넘지만, 법적으로 <strong className="text-white">매월 수령하는 금액(700만 원)</strong>을 기준으로 과세합니다. 따라서 3억 원 이하 세율인 <strong className="text-white">22%</strong>만 적용되어 매월 546만 원을 수령하게 됩니다.</li>
          </ul>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 기댓값과 인플레이션: 일시불 vs 연금</h2>
          <p className="mt-4 leading-8 text-slate-300">
            세금 면에서는 연금복권이 유리하지만, <strong className="text-white">'화폐의 시간 가치(Time Value of Money)'</strong>를 고려하면 상황이 달라집니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            20년 뒤의 546만 원은 현재의 546만 원과 가치가 다릅니다. 매년 물가가 2.5%씩 상승한다고 가정할 때, 20년 뒤의 구매력은 반토막이 날 수 있습니다. 반면 로또는 세금을 많이 떼더라도 14억 원의 거금을 당장 손에 쥐어 예금 이자 복리나 주식, 부동산에 투자할 수 있는 <strong className="text-white">기회 비용</strong>을 얻게 됩니다.
          </p>
          <p className="mt-4 font-semibold text-rose-400">
            요약: 당첨 즉시 사업이나 투자(부동산 등)로 자산을 굴릴 지식과 배짱이 있다면 로또 6/45가 유리하며, 투자 리스크 없이 안정적으로 노후를 대비하고 세금을 덜 내고 싶다면 연금복권이 유리합니다.
          </p>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-button">
            로또 번호 생성하기
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
