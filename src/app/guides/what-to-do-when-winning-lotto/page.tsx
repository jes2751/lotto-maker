import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 1등 당첨되면 가장 먼저 해야 할 일: 영수증 보관부터 당첨금 수령까지",
  description: "로또 1등에 당첨되었을 때 서명, 보관 방법, 주변 알림 여부, 농협 본점 이동 동선 등 현실적이고 법률적인 행동 가이드를 제공합니다.",
  alternates: {
    canonical: "/guides/what-to-do-when-winning-lotto"
  }
};

export default function WhatToDoWhenWinningLottoPage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/what-to-do-when-winning-lotto`,
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
          로또 1등에 당첨되면 가장 먼저 해야 할 일 4가지
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          토요일 저녁 8시 40분, 손에 쥔 로또 용지의 번호 6개가 TV 화면의 번호와 정확히 일치함을 확인했습니다. 환희도 잠시, 손발이 떨리고 머리가 하얘질 것입니다. 당황하여 치명적인 실수를 저지르지 않도록, 수십억 원의 권리를 지키는 현실적이고 법률적인 가이드를 정리했습니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 복권 뒷면에 즉시 서명하고 사진 촬영하기</h2>
          <p className="mt-4 leading-8 text-slate-300">
            가장 중요하고 가장 먼저 해야 할 일입니다. 로또 복권은 법적으로 <strong className="text-white">'무기명 유가증권'</strong>입니다. 즉, 누가 샀든 상관없이 그 종이를 들고 농협에 가는 사람이 주인이 됩니다.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li><strong>뒷면 서명:</strong> 복권 뒷면의 서명란에 지워지지 않는 펜(네임펜 등)으로 자신의 이름과 주민등록번호 앞자리, 서명을 즉시 기재하세요. 이렇게 하면 분실하거나 도난당하더라도 타인이 당첨금을 수령할 수 없습니다.</li>
            <li><strong>사진 및 동영상 촬영:</strong> 서명이 완료된 복권의 앞면과 뒷면을 스마트폰으로 선명하게 촬영해 두세요. 이는 훼손 및 분실 시 유력한 정황 증거가 됩니다.</li>
          </ul>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 절대 복권을 훼손하지 않고 안전하게 보관하기</h2>
          <p className="mt-4 leading-8 text-slate-300">
            당첨 확인을 한다고 형광펜으로 숫자를 진하게 칠하거나, 기뻐서 구기거나, 물에 젖게 해서는 안 됩니다. 농협 창구에서는 <strong className="text-white">복권 앞면의 바코드</strong>를 기계로 스캔하여 진위 여부를 판별합니다. 바코드가 훼손되면 당첨금 수령 절차가 매우 복잡해지거나 최악의 경우 지급이 거절될 수 있습니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            복권을 지퍼백이나 클리어 파일에 넣어 구겨지지 않게 보관하고, 평일 아침 농협에 가기 전까지 가장 안전한 곳(금고, 옷장 깊숙한 곳 등)에 보관하세요.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 당첨 사실 철저히 함구하기 (가족 포함 신중하게)</h2>
          <p className="mt-4 leading-8 text-slate-300">
            수십억 원의 현금이 생기면 평화롭던 인간관계가 파탄 나는 사례가 무수히 많습니다. 기쁜 마음에 SNS에 올리거나 친구, 직장 동료에게 말하는 것은 절대 금물입니다.
          </p>
          <p className="mt-4 font-semibold text-rose-400">
            심지어 가족에게도 즉각적으로 알리기보다는, 당첨금을 수령하여 통장에 넣고 평정심을 찾은 뒤 며칠이 지나서 조심스럽게 알리는 것을 전문가들은 권장합니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">4. 농협 본점 방문 시나리오 세우기</h2>
          <p className="mt-4 leading-8 text-slate-300">
            1등 당첨금은 서울 서대문구에 위치한 <strong className="text-white">농협은행 본점 (신관 1층 로비 데스크 아님, 전용 창구 안내 받음)</strong>에서만 지급합니다. 월요일 아침은 대기자가 많을 수 있으므로 화요일이나 수요일 방문을 추천하는 경험담이 많습니다.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li><strong>신분증과 당첨 복권</strong>을 반드시 챙기세요.</li>
            <li>대중교통이나 택시를 이용하는 것이 심리적으로 안전할 수 있습니다. 당첨의 흥분 상태에서 운전하는 것은 사고 위험이 높습니다.</li>
            <li>도착하면 청원경찰에게 조용히 당첨 복권을 살짝 보여주거나 "1등 당첨금 수령하러 왔습니다"라고 말하면 별도의 VIP 엘리베이터나 전용 창구로 안내해 줍니다.</li>
          </ul>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/guides/lotto-tax-and-claim-guide" className="cta-button">
            세금 계산 및 수령 절차 자세히 보기
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
