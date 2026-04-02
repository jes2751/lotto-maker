import type { Metadata } from "next";

import { GeneratorPanel } from "@/components/lotto/generator-panel";
import { drawRepository } from "@/lib/lotto";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/generate",
    titleKo: "번호 생성기",
    titleEn: "Lotto Number Generator",
    descriptionKo:
      "혼합 추천, 빈도 추천, 랜덤 추천, 필터 추천을 한 곳에서 비교하며 로또 번호를 생성할 수 있습니다.",
    descriptionEn:
      "Generate Lotto number sets with mixed, frequency, random, and filter strategies."
  })
};

export default async function GeneratePage() {
  const latestDraw = await drawRepository.getLatest();
  const targetRound = latestDraw ? latestDraw.round + 1 : null;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12">
      <section className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)]">
        <div className="panel">
          <p className="eyebrow">번호 생성기</p>
          <h1 className="mt-4 text-[clamp(1.5rem,2.2vw,2.35rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-white lg:whitespace-nowrap">
            원하는 방식으로 번호를 만들고 바로 비교해보세요
          </h1>
          <p className="mt-5 max-w-5xl text-lg font-medium leading-8 text-slate-300">
            혼합 추천, 빈도 추천, 랜덤 추천, 필터 추천을 한 곳에서 바로 비교할 수 있습니다. 생성한 번호는
            공개 생성 통계에 익명으로 반영되어 어떤 전략이 실제 결과에 더 가까웠는지 흐름으로 확인할 수
            있습니다.
          </p>
        </div>

        <div className="panel">
          <p className="eyebrow">이번 생성 기준</p>
          <ul className="mt-5 space-y-4 text-base font-medium leading-8 text-slate-300">
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
