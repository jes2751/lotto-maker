import type { Metadata } from "next";
import Link from "next/link";

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
      <section className="panel hero-panel grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <p className="eyebrow">번호 생성기</p>
            <h1 className="mt-4 max-w-4xl text-[clamp(1.75rem,2.6vw,2.7rem)] font-semibold leading-[1.16] tracking-[-0.035em] text-gradient-silver">
              전략을 고르고, 바로 생성하고, 공개 흐름과 비교하세요
            </h1>
            <p className="mt-5 max-w-4xl text-lg font-medium leading-8 text-slate-300">
              혼합 추천, 빈도 추천, 랜덤 추천, 필터 추천을 한 곳에서 비교할 수 있습니다. 이 화면의 목적은
              복잡한 설명이 아니라 빠른 선택과 즉시 생성입니다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">대상 회차</p>
              <p className="mt-2 text-2xl font-semibold text-white">{targetRound ? `${targetRound}회` : "준비 중"}</p>
            </div>
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">전략 수</p>
              <p className="mt-2 text-2xl font-semibold text-white">4개</p>
            </div>
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">결과 성격</p>
              <p className="mt-2 text-2xl font-semibold text-white">참고용</p>
            </div>
          </div>
        </div>

        <div className="soft-card">
          <p className="eyebrow">이번 생성 기준</p>
          <ul className="mt-5 space-y-4 text-base font-medium leading-8 text-slate-300">
            <li>대상 회차: {targetRound ? `${targetRound}회` : "다음 회차 준비 중"}</li>
            <li>필터 추천에서는 고정수, 제외수, 홀짝, 합계, 연속번호 조건을 함께 설정할 수 있습니다.</li>
            <li>생성 결과는 참고용이며 당첨을 보장하지 않습니다.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/generated-stats" className="secondary-button">
              생성 통계 보기
            </Link>
            <Link href="/check" className="secondary-button">
              당첨 확인
            </Link>
          </div>
        </div>
      </section>

      <GeneratorPanel targetRound={targetRound} />
    </div>
  );
}
