import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 1등 당첨 후기: 실수령액 15억으로 할 수 있는 현실적인 자산 관리",
  description: "로또 1등에 당첨된 후 실수령액 15억 원을 방어하고 불리기 위한 예금 이자, 파킹통장, 배당주 등 현실적인 자산 관리 기초 가이드입니다.",
  alternates: {
    canonical: "/guides/lotto-asset-management"
  }
};

export default function LottoAssetManagementPage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/lotto-asset-management`,
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
        <p className="eyebrow">재무 관리 가이드</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          당첨금 15억을 지키는 현실적인 자산 관리 전략
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          농협 본점을 다녀오신 후, 통장에 찍힌 15억 원(세후 실수령액 가정)을 보며 "이제 강남 아파트를 사고, 포르쉐를 뽑고, 회사를 그만둬야지!" 라고 생각하셨나요? 안타깝게도 현재 대한민국의 물가 수준에서 15억 원은 흥청망청 쓰면 3년 안에 사라지는 돈입니다. 일확천금을 평생의 현금흐름으로 바꾸는 현실적인 자산 관리 가이드를 소개합니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 최소 3개월은 파킹통장에 넣고 관망하기</h2>
          <p className="mt-4 leading-8 text-slate-300">
            가장 먼저 해야 할 일은 <strong className="text-white">아무것도 하지 않는 것</strong>입니다. 당첨의 흥분 상태에서는 사기꾼의 유혹에 빠지거나, 평소라면 절대 하지 않을 무리한 코인/주식 투자를 할 위험이 극도로 높습니다.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white">파킹통장(CMA 등) 활용</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              15억 원을 연 2.5% 수준의 수시입출금식 파킹통장이나 단기 예금에만 넣어두어도 <strong className="text-white">한 달에 세후 약 260만 원의 이자</strong>가 발생합니다. 아무런 리스크 없이 매달 월급이 꽂히는 경험을 하면서, 3개월 동안 흥분을 가라앉히고 냉정하게 미래 계획을 세워야 합니다.
            </p>
          </div>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 자산의 분산 배치: 원금 방어 vs 현금 흐름 창출</h2>
          <p className="mt-4 leading-8 text-slate-300">
            냉정을 되찾았다면, 15억 원을 크게 세 바구니로 나누는 것을 전문가들은 추천합니다.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li><strong>주거 안정 자금 (약 6억 ~ 8억):</strong> 대출이 없는 안정적인 실거주 1주택(수도권 요지 또는 지방 대장 아파트)을 매수하여 주거비를 방어합니다. 단, 지나친 상급지 갈아타기로 취등록세와 인테리어, 대출 이자에 돈을 소진하는 것은 금물입니다.</li>
            <li><strong>현금 흐름 자금 (약 5억):</strong> 매달 일하지 않아도 생활비가 나오는 시스템을 만듭니다. 안정적인 고배당 ETF(미국 배당주 등)나 예적금 포트폴리오를 구성합니다. 연 4% 배당률만 가정해도 월 140만 원의 수입이 발생합니다.</li>
            <li><strong>예비 및 소비 자금 (약 2억):</strong> 비상금 및 삶의 질을 높이는 데(자동차 구매, 가족 여행 등) 사용합니다. 로또 당첨의 기쁨을 누리는 돈은 이 안에서만 해결해야 합니다.</li>
          </ul>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 절대 피해야 할 최악의 행동 3가지</h2>
          <p className="mt-4 leading-8 text-slate-300">
            역대 복권 당첨자들의 파산 사례를 분석해 보면 다음과 같은 공통점이 있습니다.
          </p>
          <ol className="mt-4 list-inside list-decimal space-y-3 text-slate-300 leading-7 font-semibold">
            <li><strong className="text-rose-400">당일 퇴사 통보:</strong> 15억은 근로소득 없이 평생 펑펑 쓰기엔 부족한 돈입니다. 이자 소득이 월급을 완전히 대체할 수 있는 수준의 '경제적 자유'가 완성되기 전까지는 본업을 유지하는 것이 정신 건강에 좋습니다.</li>
            <li><strong className="text-rose-400">지인에게 묻지마 빌려주기/투자:</strong> 식당 창업, 지인 회사 투자 등 경험 없는 사업에 돈을 밀어 넣는 것은 파산으로 가는 특급 열차입니다.</li>
            <li><strong className="text-rose-400">과도한 소비 인플레이션:</strong> 명품, 슈퍼카 등으로 생활 수준을 한 번 높여버리면, 나중에 원금이 바닥나도 씀씀이를 줄이지 못해 결국 빚을 지게 됩니다.</li>
          </ol>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/guides/what-to-do-when-winning-lotto" className="cta-button">
            당첨 직후 필수 행동 요령 보기
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
