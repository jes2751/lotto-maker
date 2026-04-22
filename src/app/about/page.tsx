import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/about",
    titleKo: "서비스 소개",
    titleEn: "About Us",
    descriptionKo:
      "Lotto Maker Lab은 통계 분석과 겹침 회피 관점으로 더 현명한 로또 번호 선택을 돕는 무료 도구입니다.",
    descriptionEn:
      "About Lotto Maker Lab, a free statistical tool for smarter lotto number generation and data analysis."
  })
};

const principles = [
  {
    title: "데이터 기반 접근",
    description: "과거 당첨 결과 데이터(자주 나오는 번호, 적게 나오는 번호, 패턴 등)를 분석하여 번호 선택에 참고할 수 있는 통계 근거를 제공합니다."
  },
  {
    title: "겹침 회피 관점",
    description: "우리의 핵심 목표 중 하나는 남들이 흔히 선택할 만한 조합(겹침 리스크)을 피하고, 분산 리스크를 줄일 수 있는 합리적인 선택 기준을 제시하는 것입니다."
  },
  {
    title: "참고용 무료 도구",
    description: "본 서비스는 모든 핵심 기능을 무료로 공개합니다. 생성된 번호와 분석 결과는 단순 판단 보조 및 참고용이며, 어떠한 경우에도 로또 당첨을 보장하지 않습니다."
  }
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">About Us</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">서비스 소개</h1>
        <p className="mt-4 leading-8 text-slate-300">
          Lotto Maker Lab은 단순히 무작위 숫자를 만들어내는 곳이 아닙니다.<br />
          과거의 1등 당첨 데이터 흐름을 읽고, 다른 사람들이 어떤 번호를 피하고 선호하는지 분석하여,
          조금 더 합리적이고 현명한 로또 번호 선택을 돕기 위해 만들어진 통계 실험실입니다.
        </p>
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold text-white">운영 원칙 및 목표</h2>
        <div className="mt-6 flex flex-col gap-6">
          {principles.map((item) => (
            <div key={item.title}>
              <h3 className="text-lg font-medium text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold text-white">사이트 운영 정보</h2>
        <p className="mt-4 leading-8 text-slate-300">
          본 웹사이트는 사용자에게 유용한 도구와 정보를 전달하기 위해 운영되고 있습니다. 지속적인 서버 및 개발 유지보수를 위해 향후 구글 애드센스 등 최소한의 광고를 포함할 수 있습니다. 서비스 오류나 문의 사항이 있으시다면 언제든 안내된 연락처로 의견을 남겨주세요.
        </p>
      </section>
    </div>
  );
}
