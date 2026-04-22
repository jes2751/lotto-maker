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
      <section className="panel hero-panel">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="eyebrow">번호 생성기</p>
            <span className="status-badge">Playboard Mode</span>
          </div>
          <div className="max-w-5xl">
            <h1 className="section-title text-gradient-silver">먼저 뽑고, 공식 기준과 유저 흐름으로 바로 판단하세요</h1>
            <p className="mt-4 max-w-4xl text-lg font-medium leading-8 text-slate-300">
              길게 설명하지 않습니다. 어떤 방식으로 뽑을지만 빠르게 고르고, 만든 결과를 공식 흐름과 유저
              흐름에 붙여보는 화면입니다.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {quickModes.map((item) => (
              <Link key={item.title} href={item.href} className="play-card">
                <span className="play-card-kicker">{item.kicker}</span>
                <span className="play-card-title">{item.title}</span>
                <span className="play-card-body">{item.body}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span>대상 회차 {targetRound ? `${targetRound}회` : "준비 중"}</span>
            <span className="hidden text-white/20 sm:inline">•</span>
            <span>생성 기록 익명 반영</span>
            <span className="hidden text-white/20 sm:inline">•</span>
            <span>생성 후 2축 비교</span>
          </div>
        </div>
      </section>

      <div id="generator-panel">
        <GeneratorPanel targetRound={targetRound} />
      </div>

      <section className="panel mt-8">
        <h2 className="text-2xl font-semibold text-white">생성기 이용 가이드</h2>
        <div className="mt-4 grid gap-6 text-sm leading-7 text-slate-300 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-white">로또 번호 생성의 통계적 의미</h3>
            <p className="mt-2">
              Lotto Maker Lab의 생성기는 과거 1등 당첨 데이터의 흐름과 출현 빈도를 분석하여, 완전히 무작위로 번호를 고르는 것 이상의 판단 기준을 제시합니다. 통계나 패턴을 활용하더라도 모든 번호 조합의 당첨 확률은 수학적으로 동일합니다. 하지만 사람들이 흔히 선호하는 번호 조합을 회피함으로써, 실제 당첨 시 당첨금을 여러 명과 나누게 되는 '분산 리스크'를 줄일 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white">전략별 활용 방법</h3>
            <p className="mt-2">
              <strong className="text-white">혼합 추천:</strong> 가장 균형 잡힌 로직으로 빠르게 번호를 고르고 싶을 때 사용합니다.<br />
              <strong className="text-white">빈도 추천:</strong> 최근 자주 출현하거나 오랫동안 나오지 않은 번호의 흐름을 강하게 반영하고 싶을 때 적합합니다.<br />
              <strong className="text-white">필터 조건:</strong> 홀짝 비율, 연속 번호 등 특정 패턴을 직접 제어하여 남들이 잘 고르지 않을 만한 번호를 만들 때 활용합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
