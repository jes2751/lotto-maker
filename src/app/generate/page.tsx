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
      "혼합, 빈도, 랜덤, 필터 전략으로 번호를 만들고 생성 통계에도 바로 반영할 수 있습니다.",
    descriptionEn:
      "Generate Lotto number sets with mixed, frequency, random, and filter strategies, then reflect them in generated stats."
  })
};

export default async function GeneratePage() {
  const latestDraw = await drawRepository.getLatest();
  const targetRound = latestDraw ? latestDraw.round + 1 : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="panel">
          <p className="eyebrow">번호 생성기</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">
            원하는 방식으로 번호를 만들고
            <br />
            바로 비교해보세요
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-slate-300">
            혼합 추천, 빈도 추천, 랜덤 추천, 필터 추천을 한 곳에서 제공합니다. 생성한 결과는 공개 생성 통계에
            익명으로 반영되어 어떤 전략이 실제 결과와 더 가까웠는지 비교할 수 있습니다.
          </p>
        </div>

        <div className="panel">
          <p className="eyebrow">이번 생성 기준</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <li>대상 회차: {targetRound ? `${targetRound}회` : "다음 회차 준비 중"}</li>
            <li>필터 추천에서는 고정수, 제외수, 홀짝, 합계, 연속번호 조건을 함께 설정할 수 있습니다.</li>
            <li>생성 결과는 참고용이며 당첨을 보장하지 않습니다.</li>
          </ul>
        </div>
      </section>

      <GeneratorPanel targetRound={targetRound} />
    </div>
  );
}
