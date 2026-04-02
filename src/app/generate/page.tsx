import type { Metadata } from "next";

import { GeneratorPanel } from "@/components/lotto/generator-panel";
import { drawRepository } from "@/lib/lotto";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/generate",
    titleKo: "로또 번호 생성기",
    titleEn: "Lotto Number Generator",
    descriptionKo:
      "mixed, frequency, random, filter 전략으로 번호를 만들고 생성 통계까지 함께 반영하는 로또 번호 생성기입니다.",
    descriptionEn:
      "Generate Lotto number sets with mixed, frequency, random, and filter strategies, then track them in generated stats."
  })
};

export default async function GeneratePage() {
  const latestDraw = await drawRepository.getLatest();
  const targetRound = latestDraw ? latestDraw.round + 1 : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="panel">
          <p className="eyebrow">번호 생성기</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">과거 당첨 데이터를 바탕으로 추천 번호를 생성합니다</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            혼합 추천, 빈도 추천, 랜덤 추천, 필터 추천을 한 화면에서 비교할 수 있습니다. 생성한 번호는
            익명 기준으로 Firestore에 저장되어 생성 통계 허브에서 전략별 성과를 함께 볼 수 있습니다.
          </p>
        </div>

        <div className="panel">
          <p className="eyebrow">이번 회차 기준</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <li>현재 생성된 번호는 {targetRound ? `${targetRound}회` : "다음 회차"} 대상으로 저장됩니다.</li>
            <li>고정수, 제외수, 홀짝, 합계, 연속번호 조건을 함께 사용할 수 있습니다.</li>
            <li>최신 당첨 결과가 반영되면 생성 통계 허브에서 전략별 적중 성과를 확인할 수 있습니다.</li>
          </ul>
        </div>
      </section>

      <GeneratorPanel targetRound={targetRound} />
    </div>
  );
}
