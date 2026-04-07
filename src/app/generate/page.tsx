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
      "혼합 추천, 빈도 추천, 랜덤 추천, 필터 추천으로 번호를 만든 뒤 공식 당첨 흐름과 유저 군중 흐름으로 바로 비교할 수 있습니다.",
    descriptionEn:
      "Generate Lotto number sets with mixed, frequency, random, and filter strategies."
  })
};

export default async function GeneratePage() {
  const latestDraw = await drawRepository.getLatest();
  const targetRound = latestDraw ? latestDraw.round + 1 : null;
  const quickModes = [
    {
      href: "#generator-panel",
      kicker: "빠르게",
      title: "혼합 추천 스타트",
      body: "기본 전략으로 바로 뽑고 그다음 판단을 붙입니다."
    },
    {
      href: "#generator-panel",
      kicker: "통계형",
      title: "빈도 추천 모드",
      body: "과거 공식 흐름을 더 세게 반영해 바로 생성합니다."
    },
    {
      href: "#generator-panel",
      kicker: "덜 겹치게 생각",
      title: "필터 조건 제작",
      body: "조건을 직접 걸어 더 덜 대중적인 조합을 설계합니다."
    }
  ] as const;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12">
      <section className="panel hero-panel grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="eyebrow">번호 생성기</p>
              <span className="status-badge">Playboard Mode</span>
            </div>
            <h1 className="section-title mt-4 max-w-4xl text-gradient-silver">
              먼저 뽑고, 공식 기준과 유저 흐름으로 바로 판단하세요
            </h1>
            <p className="mt-5 max-w-4xl text-lg font-medium leading-8 text-slate-300">
              이 화면은 설정 공부를 시키는 곳이 아니라, 어떤 방식으로 뽑을지 빠르게 고르고 결과를 두 데이터
              축에 붙여보게 만드는 곳입니다. 시작은 가볍게, 판단은 공식 기준과 유저 흐름으로 합니다.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                { title: "바로 뽑기", body: "혼합 추천이나 랜덤으로 즉시 시작" },
                { title: "공식 기준 붙이기", body: "과거 1등 흐름으로 번호 근거 확인" },
                { title: "유저 흐름 붙이기", body: "사람들이 몰리는 번호인지 같이 확인" }
              ].map((item) => (
                <div key={item.title} className="soft-card rounded-[22px] px-4 py-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-teal">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {quickModes.map((item) => (
                <Link key={item.title} href={item.href} className="play-card">
                  <span className="play-card-kicker">{item.kicker}</span>
                  <span className="play-card-title">{item.title}</span>
                  <span className="play-card-body">{item.body}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">대상 회차</p>
              <p className="mt-2 text-2xl font-semibold text-white">{targetRound ? `${targetRound}회` : "준비 중"}</p>
            </div>
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">첫 행동</p>
              <p className="mt-2 text-2xl font-semibold text-white">바로 생성</p>
            </div>
            <div className="kpi-cell">
              <p className="text-sm text-slate-400">후속 판단</p>
              <p className="mt-2 text-2xl font-semibold text-white">2축 비교</p>
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
              <p className="eyebrow">오늘의 스타트</p>
              <h2 className="mt-4 text-[1.45rem] font-semibold leading-[1.2] text-white">
                결과를 만든 뒤 공식 기준과 군중 흐름 두 쪽으로 바로 붙입니다
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
                "혼합·빈도·랜덤은 바로 생성, 필터만 조건 입력이 열립니다.",
                "생성 후엔 공식 흐름과 유저 흐름을 같이 보며 더 대중적인 조합인지 판단을 보강합니다."
              ].map((item) => (
              <div key={item} className="signal-row">
                <span className="signal-row-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/stats" className="secondary-button">
              공식 흐름 보기
            </Link>
            <Link href="/generated-stats" className="secondary-button">
              유저 군중 흐름 보기
            </Link>
            <Link href="/check" className="secondary-button">
              당첨 확인
            </Link>
          </div>
        </div>
      </section>

      <div id="generator-panel">
        <GeneratorPanel targetRound={targetRound} />
      </div>
    </div>
  );
}
