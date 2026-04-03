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
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="eyebrow">번호 생성기</p>
              <span className="status-badge">Fast Flow</span>
            </div>
            <h1 className="mt-4 max-w-4xl text-[clamp(1.75rem,2.6vw,2.7rem)] font-semibold leading-[1.16] tracking-[-0.035em] text-gradient-silver">
              전략을 고르고, 바로 생성하고, 공개 흐름과 비교하세요
            </h1>
            <p className="mt-5 max-w-4xl text-lg font-medium leading-8 text-slate-300">
              혼합 추천, 빈도 추천, 랜덤 추천, 필터 추천을 한 곳에서 비교할 수 있습니다. 이 화면의 목적은
              복잡한 설명이 아니라 빠른 선택과 즉시 생성입니다.
            </p>

            <div className="mt-6 hidden gap-3 md:grid md:grid-cols-3">
              {[
                { label: "혼합 추천", value: "균형형" },
                { label: "빈도 추천", value: "데이터형" },
                { label: "필터 추천", value: "조건형" }
              ].map((item) => (
                <div key={item.label} className="signal-chip">
                  <span className="signal-chip-label">{item.label}</span>
                  <span className="signal-chip-value">{item.value}</span>
                </div>
              ))}
            </div>
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

        <div className="soft-card relative overflow-hidden">
          <div className="hero-signal-field" aria-hidden="true">
            <span className="hero-signal hero-signal-one" />
            <span className="hero-signal hero-signal-two" />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">이번 생성 기준</p>
              <h2 className="mt-4 text-[1.45rem] font-semibold leading-[1.2] text-white">
                지금 생성한 번호가 어떤 흐름에 놓이는지 함께 보여줍니다
              </h2>
            </div>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-300">
              Round Ready
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">대상 회차</p>
              <p className="mt-2 text-2xl font-semibold text-white">{targetRound ? `${targetRound}회` : "준비 중"}</p>
            </div>
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">생성 기록</p>
              <p className="mt-2 text-2xl font-semibold text-white">익명 반영</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              `대상 회차: ${targetRound ? `${targetRound}회` : "다음 회차 준비 중"}`,
              "필터 추천에서는 고정수, 제외수, 홀짝, 합계, 연속번호 조건을 함께 설정할 수 있습니다.",
              "생성 결과는 참고용이며 당첨을 보장하지 않습니다."
            ].map((item) => (
              <div key={item} className="signal-row">
                <span className="signal-row-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>

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
