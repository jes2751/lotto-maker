import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 인터넷(온라인) 구매 방법과 동행복권 사이트 이용 팁",
  description: "모바일 불가 정책, K뱅크 예치금 충전, 5천원 구매 한도 등 로또 인터넷 구매 시 알아야 할 모든 정보를 정리했습니다.",
  alternates: {
    canonical: "/guides/how-to-buy-lotto-online"
  }
};

export default function HowToBuyLottoOnlinePage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metadata.title as string,
          description: metadata.description as string,
          url: `${siteUrl}/guides/how-to-buy-lotto-online`,
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
        <p className="eyebrow">구매 가이드</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          로또 인터넷 구매 가이드: 한도, 제한 사항 및 충전 팁
        </h1>
        <p className="mt-6 leading-8 text-slate-300">
          오프라인 복권 판매점을 방문할 시간이 없다면 동행복권 공식 웹사이트를 통해 로또를 편리하게 구매할 수 있습니다. 하지만 온라인 구매는 과몰입을 방지하기 위해 여러 가지 까다로운 규제가 적용되어 있습니다. 처음 인터넷 구매를 시도하는 분들을 위해 필수적인 제한 사항과 팁을 정리했습니다.
        </p>
      </section>

      <div className="grid gap-8">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">1. 모바일 기기 구매 전면 금지 (PC만 가능)</h2>
          <p className="mt-4 leading-8 text-slate-300">
            가장 많이 겪는 혼란은 "스마트폰으로 동행복권 홈페이지에 들어갔는데 구매 버튼이 안 눌린다"는 것입니다. 관련 법령(사행산업 과몰입 방지)에 따라 **로또 6/45는 모바일 기기(스마트폰, 태블릿) 브라우저나 앱에서의 구매가 원천적으로 차단**되어 있습니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            오직 데스크톱(PC)이나 랩탑 컴퓨터 환경의 웹 브라우저에서만 결제창이 활성화됩니다. 예외적으로 연금복권 등은 모바일 구매가 가능하지만, 로또는 무조건 PC 환경이 필요합니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">2. 1회차 1인당 구매 한도: 5,000원</h2>
          <p className="mt-4 leading-8 text-slate-300">
            오프라인 판매점에서는 한 번에 10만 원어치까지 구매할 수 있지만, 인터넷 구매는 **1주일에 1인당 딱 5,000원(5게임)**까지만 구매가 허용됩니다.
          </p>
          <p className="mt-4 font-semibold text-rose-400">
            이 5,000원 한도는 매주 일요일 오전 6시에 리셋됩니다.
          </p>
          <p className="mt-2 leading-8 text-slate-300">
            만약 더 많은 조합을 구매하고 싶다면 5천 원은 인터넷으로, 나머지는 오프라인 판매점에서 구매하는 방식을 병행해야 합니다.
          </p>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">3. 결제 방식: 케이뱅크(K-Bank) 연동 가상계좌 예치금 충전</h2>
          <p className="mt-4 leading-8 text-slate-300">
            온라인 로또는 신용카드나 일반 간편결제(삼성페이, 네이버페이 등)로 결제할 수 없습니다. 오직 동행복권 사이트에 '예치금'을 미리 충전해두고 차감하는 방식으로만 구매가 가능합니다.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300 leading-7">
            <li>회원 가입 후 부여받는 **가상계좌(케이뱅크)**로 돈을 이체하여 예치금을 충전합니다.</li>
            <li>케이뱅크 계좌가 없어도, 다른 은행(국민, 신한, 토스 등)에서 자신의 동행복권 케이뱅크 가상계좌로 이체하는 것은 가능합니다.</li>
            <li>단, 최소 충전 단위가 5,000원 단위로 정해져 있으므로, 필요한 금액만큼만 이체하시기 바랍니다.</li>
          </ul>
        </section>

        <section className="panel">
          <h2 className="text-2xl font-semibold text-white">4. 인터넷 당첨금 수령 방식</h2>
          <p className="mt-4 leading-8 text-slate-300">
            온라인으로 구매한 로또가 4등(5만 원)이나 5등(5천 원)에 당첨되면, 일요일 오전에 **동행복권 예치금으로 자동 환급(입금)**됩니다. 이 예치금으로 다음 회차를 다시 구매하거나, 원할 경우 자신의 은행 계좌로 출금(이체 수수료 발생 가능)할 수 있어 매우 편리합니다.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            단, 1등~3등 등 고액 당첨의 경우에는 오프라인 구매와 동일하게 신분증 지참 후 농협은행을 직접 방문해야 합니다.
          </p>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">다음 단계</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-button">
            당첨 번호 생성기로 이동
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
