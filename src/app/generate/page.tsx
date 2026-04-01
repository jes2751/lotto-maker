import type { Metadata } from "next";

import { GeneratorPanel } from "@/components/lotto/generator-panel";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/generate",
    titleKo: "로또 번호 생성기",
    titleEn: "Lotto Number Generator",
    descriptionKo: "mixed, frequency, random, filter 전략으로 로또 번호 조합을 생성하고 과거 당첨 데이터 흐름을 함께 확인할 수 있습니다.",
    descriptionEn:
      "Generate Lotto number sets with mixed, frequency, random, and filter strategies, then compare them with historical winning trends."
  })
};

export default function GeneratePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="panel">
          <p className="eyebrow">추천기</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">데이터 기반 번호 추천기</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            기본 추천 전략은 <code>mixed</code>이며, <code>frequency</code>, <code>random</code>, <code>filter</code> 전략을 함께 제공합니다.
            모든 결과는 참고용이며 당첨을 보장하지 않습니다.
          </p>
        </div>
        <div className="panel">
          <p className="eyebrow">필터 추첨기 안내</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <li>고정수는 최대 5개까지, 제외수는 최대 35개까지 설정할 수 있습니다.</li>
            <li>홀짝 조건, 합계 범위, 연속번호 허용 여부를 함께 조절할 수 있습니다.</li>
            <li>결과 카드에는 어떤 조건이 반영됐는지 이유 문구가 함께 표시됩니다.</li>
          </ul>
        </div>
      </section>

      <GeneratorPanel />
    </div>
  );
}
