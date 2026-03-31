import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "로또 번호 생성기 | 데이터 기반 번호 추천",
  description: "과거 당첨 데이터를 참고해 mixed, frequency, random 전략으로 로또 번호를 생성할 수 있는 랜딩 페이지입니다."
};

export default function LottoNumberGeneratorLandingPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Lotto Number Generator</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">로또 번호 생성기</h1>
        <p className="mt-4 leading-8 text-slate-300">
          LOTTO LAB은 과거 당첨 데이터 흐름을 참고해 번호를 추천하는 무료 로또 번호 생성기입니다. 추천 결과는 재미용 참고 정보이며 당첨을 보장하지 않습니다.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          ["mixed", "기본 추천 전략", "과거 당첨 데이터 빈도와 무작위 요소를 함께 반영합니다."],
          ["frequency", "빈도형 추천", "자주 등장한 번호에 더 높은 비중을 둡니다."],
          ["random", "랜덤 비교", "데이터 기반 전략과 비교할 수 있는 무작위 조합입니다."]
        ].map(([key, title, description]) => (
          <article key={key} className="panel">
            <p className="eyebrow">{key}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Next Step</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">바로 번호 추천 받기</h2>
          </div>
          <Link href="/generate" className="cta-button">
            추천기 열기
          </Link>
        </div>
      </section>
    </div>
  );
}
