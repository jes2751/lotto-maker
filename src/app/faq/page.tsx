import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, getAbsoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/faq",
    titleKo: "FAQ",
    titleEn: "FAQ",
    descriptionKo:
      "Lotto Maker Lab 추천 기준, 통계 해석, 광고 노출, 데이터 반영 주기에 대한 자주 묻는 질문입니다.",
    descriptionEn:
      "Frequently asked questions about Lotto Maker Lab recommendations, statistics, ads, and data updates."
  })
};

const faqItems = [
  {
    question: "추천 번호는 당첨 가능성을 높여주나요?",
    answer:
      "아니요. 추천 결과는 과거 당첨 데이터와 조건형 필터를 참고해 만드는 참고용 조합이며 당첨을 보장하지 않습니다."
  },
  {
    question: "통계는 어떤 기준으로 계산되나요?",
    answer:
      "전체 회차 또는 최근 10회를 기준으로 출현 횟수, 홀짝 비율, 합계 구간, 연속번호 포함 여부 등을 계산합니다."
  },
  {
    question: "최신 회차 데이터는 언제 반영되나요?",
    answer:
      "기본 운영 원칙은 한국 시간 기준 일요일 자동 반영입니다. 데이터 소스 상태에 따라 지연될 수 있습니다."
  },
  {
    question: "광고는 언제 보이나요?",
    answer:
      "Google AdSense가 실제로 설정되기 전까지 광고는 화면에 노출하지 않습니다. 광고가 활성화되면 정책 페이지도 함께 갱신합니다."
  }
];

export default function FaqPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <JsonLd data={structuredData} />

      <section className="panel">
        <p className="eyebrow">FAQ</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">자주 묻는 질문</h1>
        <p className="mt-4 leading-8 text-slate-300">
          추천 기준, 통계 해석, 광고 노출, 데이터 반영 주기처럼 사용자가 자주 묻는 질문을
          먼저 정리했습니다.
        </p>
      </section>

      <section className="grid gap-4">
        {faqItems.map((item, index) => (
          <article key={item.question} className="panel">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Question {index + 1}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{item.question}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold text-white">추가 안내</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          정책이나 운영 방식이 바뀌면 FAQ와 관련 정책 문서를 함께 수정합니다. 더 자세한
          운영 기준은{" "}
          <a href={getAbsoluteUrl("/contact")} className="text-teal transition hover:text-teal-200">
            문의 / 운영 안내
          </a>
          페이지에서 확인할 수 있습니다.
        </p>
      </section>
    </div>
  );
}
