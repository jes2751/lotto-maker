import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/terms",
    titleKo: "이용약관",
    titleEn: "Terms of Service",
    descriptionKo:
      "Lotto Maker Lab 이용 조건, 참고용 추천 고지, 서비스 제한 사항, 운영 원칙을 안내합니다.",
    descriptionEn:
      "Terms of service for Lotto Maker Lab including reference-only recommendation rules and service limitations."
  })
};

const terms = [
  "본 서비스는 로또 번호 추천, 회차 조회, 통계 분석을 참고용으로 제공하며 당첨을 보장하지 않습니다.",
  "추천 결과와 통계는 과거 데이터를 바탕으로 생성되며, 실제 추첨 결과와 일치해야 할 의무가 없습니다.",
  "서비스 중단, 데이터 지연, 외부 소스 장애가 발생할 수 있으며 운영자는 이를 사전 예고 없이 조정할 수 있습니다.",
  "광고, 분석 도구, 정책 문구는 운영 상황에 따라 바뀔 수 있으며 변경 시 관련 페이지를 갱신합니다.",
  "본 서비스를 불법 행위, 자동화된 과도한 요청, 서비스 방해 목적으로 사용해서는 안 됩니다."
];

export default function TermsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Terms</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">이용약관</h1>
        <p className="mt-4 leading-8 text-slate-300">
          Lotto Maker Lab은 참고용 통계와 추천 기능을 제공하는 무료 웹 서비스입니다. 아래
          항목은 서비스 이용 시 기본적으로 적용되는 운영 원칙입니다.
        </p>
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold text-white">이용 조건</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
          {terms.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
