import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/privacy",
    titleKo: "개인정보처리방침",
    titleEn: "Privacy Policy",
    descriptionKo:
      "Lotto Maker Lab의 개인정보 수집 항목, 쿠키 사용, Google Analytics 및 Google AdSense 처리 기준을 안내합니다.",
    descriptionEn:
      "Privacy policy for Lotto Maker Lab covering analytics, cookies, and advertising services."
  })
};

const sections = [
  {
    title: "1. 기본 원칙",
    body: [
      "Lotto Maker Lab은 로그인 없이 핵심 기능을 사용할 수 있는 무료 서비스입니다.",
      "회원가입을 운영하지 않으므로 이름, 전화번호, 주소 같은 직접 식별 정보는 기본적으로 수집하지 않습니다."
    ]
  },
  {
    title: "2. 자동으로 수집될 수 있는 정보",
    body: [
      "브라우저 정보, 접속 시간, 방문 페이지, 기기 유형, IP 기반 대략적 지역 정보가 분석 또는 보안 목적에서 자동 수집될 수 있습니다.",
      "이 정보는 서비스 사용 흐름을 파악하고 오류를 줄이기 위한 통계 목적으로 사용합니다."
    ]
  },
  {
    title: "3. 쿠키 사용 및 제3자 서비스 (구글 애드센스 고지)",
    body: [
      "테마 설정과 언어 설정 저장을 위해 쿠키를 사용할 수 있습니다.",
      "Google Analytics를 통해 방문 통계를 분석하고 사이트 성능을 모니터링할 수 있습니다.",
      "Lotto Maker Lab은 광고 게재를 위해 Google AdSense 등 제3자 광고 파트너사 서비스를 이용할 수 있습니다.",
      "Google을 포함한 제3자 제공업체는 사용자의 이전 웹사이트 방문 정보를 기반으로 본 사이트 및 기타 웹사이트에 광고를 게재하기 위해 쿠키를 사용합니다.",
      "Google의 광고 쿠키(DoubleClick Cookie) 사용으로 인해 Google 및 그 파트너사는 사용자의 본 사이트 및 다른 인터넷 사이트 방문을 기반으로 개인 맞춤형 광고를 제공할 수 있습니다.",
      "방문자는 구글의 [광고 설정](https://adssettings.google.com/) 페이지를 방문하여 맞춤형 광고 게재를 설정하거나 해제할 수 있습니다.",
      "또한, 사용자는 [www.aboutads.info](https://www.aboutads.info/)를 방문하여 제3자 제공업체의 개인 맞춤형 광고용 쿠키 사용을 선택적으로 해제할 수 있습니다."
    ]
  },
  {
    title: "4. 보관 및 공유",
    body: [
      "운영에 꼭 필요한 범위를 넘는 개인정보를 별도로 저장하지 않습니다.",
      "법령상 요구가 있는 경우를 제외하고, 사용자를 식별할 수 있는 정보를 제3자에게 판매하거나 임의 제공하지 않습니다."
    ]
  },
  {
    title: "5. 정책 변경",
    body: [
      "분석 도구, 광고 도구, 문의 채널이 바뀌면 이 페이지를 함께 갱신합니다.",
      "중요한 변경이 있을 경우 사이트 내 정책 페이지를 통해 먼저 고지합니다."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Privacy</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">개인정보처리방침</h1>
        <p className="mt-4 leading-8 text-slate-300">
          이 페이지는 Lotto Maker Lab이 어떤 정보를 수집할 수 있는지, 쿠키와 외부 분석
          도구를 어떻게 사용하는지, 광고 도구 적용 시 어떤 기준으로 고지하는지를 설명합니다.
        </p>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="panel">
          <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            {section.body.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
