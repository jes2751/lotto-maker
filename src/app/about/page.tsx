import type { Metadata } from "next";
import Link from "next/link";

import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/about",
    titleKo: "About Lotto Maker Lab",
    titleEn: "About Lotto Maker Lab",
    descriptionKo:
      "Lotto Maker Lab의 운영 방식, 편집 기준, 그리고 신뢰 정보를 안내합니다.",
    descriptionEn:
      "Operating principles, editorial standards, and trust information for Lotto Maker Lab."
  })
};

const sections = [
  {
    title: "우리가 하는 일",
    body:
      "Lotto Maker Lab은 로또 번호 생성, 최근 회차 확인, 통계 해석, 가이드 제공을 한곳에 모은 서비스입니다. 사용자는 필요한 정보를 빠르게 보고, 도구는 바로 쓸 수 있게 만드는 것을 가장 우선합니다."
  },
  {
    title: "운영 원칙",
    body:
      "우리는 결과와 설명을 분리해서 보여줍니다. 먼저 필요한 정보를 확인할 수 있어야 하고, 그다음에 왜 그런지 이해할 수 있어야 한다고 생각합니다. 불필요하게 복잡한 표현보다, 읽기 쉬운 안내를 선호합니다."
  },
  {
    title: "편집 기준",
    body:
      "가이드와 안내 문서는 검색을 위한 얇은 글이 아니라, 실제로 도움이 되는 내용이어야 합니다. 과장된 표현은 줄이고, 확인 가능한 정보와 명확한 구조를 유지합니다. 내용이 길어지더라도 읽는 사람이 이해하기 쉬운 흐름을 우선합니다."
  },
  {
    title: "신뢰 정보",
    body:
      "서비스의 성격, 정책, 문의 창구는 각각 분리해서 제공합니다. 광고 정책, 개인정보 처리, 이용약관, FAQ, Contact 페이지를 통해 필요한 정보를 확인할 수 있도록 구성했습니다. 궁금한 점이 있으면 언제든 연결될 수 있게 열어두는 것을 중요하게 생각합니다."
  }
] as const;

const links = [
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/policies/ads", label: "Ads Policy" },
  { href: "/guides", label: "Guides" }
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="panel hero-panel grid gap-6">
        <div>
          <p className="eyebrow">About</p>
          <h1 className="section-title mt-4 text-gradient-silver">
            Lotto Maker Lab은 어떤 서비스인가요?
          </h1>
          <p className="body-large mt-5 max-w-3xl text-slate-300">
            이 페이지는 홍보용 소개보다, 이 사이트가 무엇을 제공하고 어떻게 운영되는지 편하게
            설명하기 위한 공간입니다. 로또 정보는 많아 보이지만 실제로는 찾기 어렵고, 또 너무
            복잡하게 느껴질 때가 많습니다. 그래서 우리는 가능한 한 단순하고 읽기 쉬운 방식으로
            정리하려고 합니다.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {[
            "필요한 정보는 먼저, 설명은 그다음에 배치합니다.",
            "가이드와 도구는 역할을 분리해서 보여줍니다.",
            "과장보다 확인 가능한 정보를 우선합니다.",
            "문의와 정책 정보를 쉽게 찾을 수 있게 구성합니다."
          ].map((item) => (
            <div key={item} className="soft-card text-sm leading-7 text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {sections.map((item) => (
          <article key={item.title} className="panel">
            <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold text-white">바로 가기</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          FAQ, Contact, Privacy, Terms, Ads Policy를 통해 필요한 정보를 빠르게 확인할 수
          있습니다. 가이드는 따로 모아두어, 원할 때만 천천히 둘러볼 수 있게 했습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="secondary-button">
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
