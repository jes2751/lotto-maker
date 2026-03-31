import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "광고 안내 | LOTTO LAB",
  description: "LOTTO LAB의 광고 표시 원칙과 Google AdSense 운영 기준을 안내합니다."
};

const principles = [
  "광고는 '광고' 라벨과 함께 콘텐츠와 분리된 영역에만 노출합니다.",
  "광고 클릭이나 조회를 유도하는 문구, 보상, 그래픽 요소를 사용하지 않습니다.",
  "추천 결과, 지난 회차 카드, 통계 핵심 정보처럼 사용자가 집중해야 하는 영역 안에는 광고를 넣지 않습니다.",
  "광고가 설정되지 않은 환경에서는 광고 슬롯을 렌더링하지 않습니다."
];

export default function AdsPolicyPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Ad Policy</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">광고 안내</h1>
        <p className="mt-4 leading-8 text-slate-300">
          LOTTO LAB은 Google AdSense 운영 시 광고와 콘텐츠를 명확히 구분하고, 광고 클릭 또는 조회를 유도하지 않는
          방향으로 페이지를 구성합니다.
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
        <h2 className="text-2xl font-semibold text-white">서비스 안내</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
          <li>- 추천 결과는 과거 당첨 데이터를 참고한 정보이며 당첨을 보장하지 않습니다.</li>
          <li>- 광고는 LOTTO LAB의 추천 결과와 무관하게 표시됩니다.</li>
          <li>- 광고 관련 설정은 Google AdSense 정책과 Cloudflare 배포 환경 기준에 맞춰 별도로 관리합니다.</li>
        </ul>
      </section>
    </div>
  );
}
