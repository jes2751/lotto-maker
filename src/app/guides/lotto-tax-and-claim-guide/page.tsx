import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 당첨금 세금 계산법 및 실제 수령 절차 완벽 가이드",
  description: "로또 1등 당첨 시 내야 하는 세금(33% 구간) 계산법과 농협 본점 방문부터 실수령까지의 디테일한 절차를 안내합니다.",
  alternates: {
    canonical: "/guides/lotto-tax-and-claim-guide"
  }
};

export default function LottoTaxAndClaimGuidePage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/lotto-tax-and-claim-guide`,
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
        <p className="eyebrow">당첨 가이드</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          로또 당첨금 세금 계산법 및 수령 절차 (1등 기준)
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          모두가 꿈꾸는 로또 1등, 하지만 막상 당첨되면 세금을 얼마나 떼고, 어디로 가서 어떻게 받아야 하는지 막막할 수 있습니다. 수십억 원이 걸려 있는 만큼 당황하지 않고 완벽하게 실수령액을 계산하고 수령하는 절차를 정리해 드립니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 당첨금 세금(기타소득세) 구간 및 계산법</h2>
          <p className="mt-4 leading-8 text-slate-300">
            로또 당첨금은 세법상 '기타소득'으로 분류되며, 당첨 금액에 따라 분리과세율이 다르게 적용됩니다. 복권 구매 비용(보통 1,000원)을 제외한 순수 당첨금에 대해 세금이 부과됩니다.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/50 text-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">당첨 금액 구간</th>
                  <th className="px-6 py-4 font-medium">적용 세율</th>
                  <th className="px-6 py-4 font-medium">비고</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="px-6 py-4">200만 원 이하</td>
                  <td className="px-6 py-4">비과세 (세금 0%)</td>
                  <td className="px-6 py-4">3등 이하 대부분 적용</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">200만 원 초과 ~ 3억 원 이하</td>
                  <td className="px-6 py-4">22%</td>
                  <td className="px-6 py-4">소득세 20% + 주민세 2%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">3억 원 초과</td>
                  <td className="px-6 py-4">33%</td>
                  <td className="px-6 py-4">소득세 30% + 주민세 3%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-800/50 p-6">
            <h3 className="font-semibold text-white">예시: 1등 당첨금이 20억 원일 경우 실수령액은?</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              - 3억 원까지의 세금: 3억 원 × 22% = 6,600만 원<br />
              - 3억 원 초과분(17억 원) 세금: 17억 원 × 33% = 5억 6,100만 원<br />
              - 총 세금: 6억 2,700만 원<br />
              <strong className="text-white">- 최종 실수령액: 약 13억 7,300만 원</strong> (전체 당첨금의 약 68.6%)
            </p>
          </div>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 당첨금 수령 장소 및 준비물</h2>
          <p className="mt-4 leading-8 text-slate-300">
            당첨 등수에 따라 당첨금을 수령하는 장소가 엄격하게 구분되어 있습니다. 1등 당첨자는 전국의 일반 은행이나 복권 판매점에서 절대 당첨금을 받을 수 없습니다.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li><strong>1등:</strong> 오직 <strong className="text-white">농협은행 본점 (서울 서대문구)</strong> 에서만 수령 가능합니다. (일반 농협 지점 불가)</li>
            <li><strong>2등, 3등:</strong> 전국 농협은행 각 지점</li>
            <li><strong>4등, 5등:</strong> 일반 복권 판매점 (보통 현금이나 새 복권으로 교환)</li>
          </ul>
          <p className="mt-4 font-semibold text-rose-400">
            필수 준비물: 당첨 복권 실물(인터넷 구매 시 모바일/PC 화면 인증), 본인 신분증 (주민등록증, 운전면허증 등)
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 농협 본점 방문 시 주의사항</h2>
          <p className="mt-4 leading-8 text-slate-300">
            농협 본점에 도착하면 1층 로비 데스크가 아닌, 전용 VIP 창구로 안내를 받습니다. 당첨 복권의 진위 여부를 확인한 후, 본인 명의의 농협은행 통장으로 실수령액이 일괄 입금됩니다. 농협 통장이 없다면 현장에서 즉시 개설해 줍니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            이 과정에서 금융 상품 가입(예금, 펀드 등)을 권유받을 수 있으나, 가입은 전적으로 본인의 자유입니다. 원치 않을 경우 정중히 거절하고 당첨금만 통장으로 이체받은 뒤 귀가하시면 됩니다.
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
            다른 가이드 보기
          </Link>
        </div>
      </section>
    </div>
  );
}
