import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `광고 정책 | ${siteConfig.name}`,
  description: `${siteConfig.name}의 광고 노출 원칙, Google AdSense 사용 기준, 광고와 콘텐츠 분리 원칙을 안내합니다.`
};

const principles = [
  "광고 영역은 항상 '광고'로 표시하고, 일반 콘텐츠와 명확히 구분합니다.",
  "광고를 클릭하도록 유도하는 문구, 버튼, 오해를 줄 수 있는 인터페이스는 사용하지 않습니다.",
  "추천 결과, 통계 데이터, 회차 조회 같은 핵심 기능 앞을 광고로 막지 않습니다.",
  "Google AdSense가 실제로 설정되기 전까지 광고 영역은 화면에 노출하지 않습니다."
];

export default function AdsPolicyPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Ads Policy</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">광고 정책</h1>
        <p className="mt-4 leading-8 text-slate-300">
          {siteConfig.name}은 Google AdSense 운영 정책과 사용자 경험을 함께 고려해 광고를
          배치합니다. 광고는 콘텐츠를 방해하지 않는 범위에서만 노출하며, 추천 결과나 통계
          기능보다 앞세우지 않습니다.
        </p>
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold text-white">운영 원칙</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
          {principles.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold text-white">현재 상태</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
          <li>- 광고 컴포넌트와 `ads.txt` 준비는 완료되어 있습니다.</li>
          <li>- 실제 AdSense 퍼블리셔 ID와 슬롯 ID가 설정되기 전까지 광고는 비노출 상태입니다.</li>
          <li>- 광고 운영 방식이 바뀌면 이 페이지와 개인정보처리방침을 함께 갱신합니다.</li>
        </ul>
      </section>
    </div>
  );
}
