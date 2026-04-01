import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/contact",
    titleKo: "문의 / 운영 안내",
    titleEn: "Contact & Operations",
    descriptionKo:
      "Lotto Maker Lab의 현재 문의 채널 상태, 운영 원칙, 데이터/광고/정책 업데이트 기준을 안내합니다.",
    descriptionEn:
      "Operational notes for Lotto Maker Lab including current contact status and update principles."
  })
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">문의 / 운영 안내</h1>
        <p className="mt-4 leading-8 text-slate-300">
          현재 Lotto Maker Lab은 1인 운영에 가까운 소규모 서비스로 관리되고 있습니다.
          정식 문의 메일과 별도 지원 채널은 준비 중이며, 정책/운영 문서는 이 페이지를 통해
          먼저 갱신합니다.
        </p>
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold text-white">현재 문의 채널 상태</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
          <li>- 정식 공개 문의 메일은 아직 준비 중입니다.</li>
          <li>- 문의 채널이 열리면 이 페이지와 개인정보처리방침, FAQ를 함께 갱신합니다.</li>
          <li>- 그 전까지는 사이트 내 정책 문서와 공지형 업데이트를 우선 기준으로 봐주세요.</li>
        </ul>
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold text-white">운영 원칙</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
          <li>- 추천 기능은 재미용·참고용으로 운영하며 당첨 보장을 약속하지 않습니다.</li>
          <li>- 회차 데이터와 통계는 가능한 빠르게 반영하되, 외부 데이터 소스 상태에 따라 지연될 수 있습니다.</li>
          <li>- 광고와 분석 도구 변경 시 관련 정책 문서와 footer 링크를 함께 수정합니다.</li>
        </ul>
      </section>
    </div>
  );
}
