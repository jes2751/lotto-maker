import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "해외 복권(미국 파워볼, 메가밀리언) 국내 구매 대행의 불법성과 위험성",
  description: "수천억 당첨금에 혹해 미국 파워볼을 국내 대행사로 구매하는 행위의 법적 문제(도박죄)와 당첨금 미지급 리스크를 경고합니다.",
  alternates: {
    canonical: "/guides/illegal-overseas-lotto"
  }
};

export default function IllegalOverseasLottoPage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/illegal-overseas-lotto`,
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
        <p className="eyebrow">법률 및 주의사항 가이드</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          미국 파워볼 구매 대행, 당첨돼도 못 받는 이유 (불법성 및 위험성)
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          가끔 미국에서 수천억, 수조 원의 복권 당첨자가 나왔다는 뉴스를 보면 "나도 저거나 해볼까?" 하는 생각이 듭니다. 이를 노리고 국내에서 파워볼이나 메가밀리언을 대신 구매해 준다는 키오스크나 사이트가 성행하고 있습니다. 하지만 이는 <strong className="text-white">단순한 사기를 넘어 형벌을 받을 수 있는 불법 행위</strong>일 가능성이 매우 높습니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 대한민국 형법상 '도박죄' 처벌 가능성</h2>
          <p className="mt-4 leading-8 text-slate-300">
            우리나라 형법 제246조는 법률로 허용되지 않은 도박을 처벌합니다. 정부(동행복권)가 공식적으로 허가한 로또 6/45, 연금복권 등은 조각사유로 합법이지만, <strong className="text-white">정부의 허가를 받지 않은 사설 해외 복권 구매는 형법상 도박에 해당</strong>할 수 있습니다.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white">대법원 및 경찰의 입장</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              최근 경찰청과 사행산업통합감독위원회는 무인 단말기나 웹사이트를 통해 해외 복권을 판매하는 행위를 명백한 도박장 개설 및 도박 행위로 간주하고 대대적인 단속을 벌이고 있습니다. 운영자는 물론, 이를 상습적으로 구매한 일반인도 도박죄로 처벌받을 수 있습니다.
            </p>
          </div>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 당첨돼도 소유권을 증명할 수 없는 치명적 구조</h2>
          <p className="mt-4 leading-8 text-slate-300">
            백번 양보해서 법적 처벌을 피한다고 치더라도, 가장 큰 문제는 <strong className="text-white">수천억 원에 당첨되었을 때 그 돈을 받을 방법이 현실적으로 없다는 점</strong>입니다.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li><strong>무기명 유가증권의 맹점:</strong> 복권은 들고 있는 사람이 주인입니다. 미국 현지 알바생이나 대행사 대표가 당첨된 복권을 들고 잠적하면, 당신은 한국에서 화면 캡처본만 들고 발을 동동 굴러야 합니다.</li>
            <li><strong>미국 복권국의 규정 위반:</strong> 파워볼 주최 측은 복권의 해외 반출과 불법적인 대리 구매를 통한 수령을 엄격히 금지하고 있습니다. 소유권 분쟁이 일어나면 주최 측은 지급을 보류하거나 취소해 버릴 수 있습니다.</li>
          </ul>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 결론: 가장 안전하고 합법적인 투자처는 국내 복권</h2>
          <p className="mt-4 leading-8 text-slate-300">
            해외 복권 대행 사이트들은 "현지 변호사를 통해 안전하게 에스크로(Escrow) 처리한다"고 광고하지만, 수천억 원 앞에서는 어떤 계약서도 무용지물이 될 수 있습니다.
          </p>
          <p className="mt-4 font-semibold text-rose-400">
            인생 역전을 꿈꾼다면, 법적으로 지급이 100% 보장되고 국가가 관리하는 국내 로또 6/45나 연금복권을 즐기시는 것이 유일하고도 가장 안전한 방법입니다.
          </p>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-button">
            안전한 국내 로또 번호 생성하기
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
