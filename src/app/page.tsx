import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";
import { computeFrequencyStats } from "@/lib/lotto/stats";

export default async function HomePage() {
  const [latest, draws] = await Promise.all([drawRepository.getLatest(), drawRepository.getAll()]);
  const hotNumbers = computeFrequencyStats(draws).slice(0, 5);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="panel overflow-hidden">
          <p className="eyebrow">Hybrid v1</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold tracking-tight text-white">
            패턴을 참고하되, 결과는 가볍고 빠르게.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            LOTTO LAB은 최근 회차 흐름을 참고해 번호를 조합하는 재미 중심 서비스입니다. v1은 정적 시드
            데이터로 즉시 실행되고, 생성기 경험을 가장 앞에 둡니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/generate" className="cta-button">
              번호 생성하러 가기
            </Link>
            <Link
              href="/stats"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
            >
              통계 먼저 보기
            </Link>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Latest Draw</p>
          {latest ? (
            <>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold text-white">{latest.round}회</p>
                  <p className="mt-1 text-sm text-slate-400">{latest.drawDate}</p>
                </div>
                <Link href="/draws" className="text-sm text-teal transition hover:text-white">
                  전체 회차 보기
                </Link>
              </div>
              <div className="mt-6">
                <NumberSet numbers={latest.numbers} bonus={latest.bonus} />
              </div>
            </>
          ) : (
            <p className="mt-4 text-slate-400">회차 데이터가 없습니다.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          ["혼합형", "빈도와 랜덤을 섞어 첫 화면의 기본 경험으로 제공합니다."],
          ["회차 조회", "시드 데이터 기반의 최신 회차 목록을 바로 확인할 수 있습니다."],
          ["기본 통계", "자주 나온 번호를 간단한 빈도 기준으로 빠르게 볼 수 있습니다."]
        ].map(([title, description]) => (
          <article key={title} className="panel">
            <p className="eyebrow">{title}</p>
            <p className="mt-4 text-lg font-medium text-white">{title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Hot Numbers</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">시드 기준 자주 등장한 번호</h2>
          </div>
          <p className="text-sm text-slate-400">메인 번호 기준 상위 5개</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {hotNumbers.map((item) => (
            <div key={item.number} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-4xl font-semibold text-white">{item.number}</p>
              <p className="mt-3 text-sm text-slate-400">등장 {item.frequency}회</p>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-teal" style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
