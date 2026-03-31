import Link from "next/link";

import { AdSlot } from "@/components/ads/ad-slot";
import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";
import { computeFrequencyStats } from "@/lib/lotto/stats";

export default async function HomePage() {
  const [latest, draws] = await Promise.all([drawRepository.getLatest(), drawRepository.getAll()]);
  const hotNumbers = computeFrequencyStats(draws).slice(0, 5);
  const latestSummary = latest ? `${latest.round}회차 · ${latest.drawDate}` : "회차 데이터 준비 중";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="panel overflow-hidden">
          <p className="eyebrow">Historical Recommendation</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold tracking-tight text-white">
            과거 당첨 흐름을 참고해,
            <br />
            추천과 통계를 한 화면에서
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            LOTTO LAB은 기존 당첨 데이터를 기반으로 번호를 추천하는 무료 웹 서비스입니다. 홈에서는 최신 회차 당첨번호를 먼저 보여주고,
            추천기에서는 그 흐름을 참고한 추천 조합을 바로 확인할 수 있습니다.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">기본 전략</p>
              <p className="mt-3 text-xl font-semibold text-white">혼합형 추천</p>
              <p className="mt-2 text-sm text-slate-400">빈도 흐름과 무작위 요소를 함께 반영한 기본 추천입니다.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">최신 데이터</p>
              <p className="mt-3 text-xl font-semibold text-white">{latestSummary}</p>
              <p className="mt-2 text-sm text-slate-400">최신 회차 결과를 홈 첫 화면에서 바로 확인할 수 있습니다.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">운영 기준</p>
              <p className="mt-3 text-xl font-semibold text-white">일요일 주간 반영</p>
              <p className="mt-2 text-sm text-slate-400">주간 반영 로직으로 최신 회차를 안정적으로 업데이트하도록 설계했습니다.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/generate" className="cta-button">
              추천 번호 보러 가기
            </Link>
            <Link
              href="/stats"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
            >
              통계 먼저 보기
            </Link>
          </div>
        </div>

        <div className="panel flex flex-col justify-between">
          <p className="eyebrow">Latest Draw</p>
          {latest ? (
            <>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold text-white">{latest.round}회</p>
                  <p className="mt-1 text-sm text-slate-400">{latest.drawDate}</p>
                </div>
                <Link href={`/draws/${latest.round}`} className="text-sm text-teal transition hover:text-white">
                  상세 보기
                </Link>
              </div>
              <div className="mt-6">
                <NumberSet numbers={latest.numbers} bonus={latest.bonus} hrefBuilder={(value) => `/stats/numbers/${value}`} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">1등 당첨자</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{latest.winnerCount ?? 0}명</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">1등 당첨금</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {latest.firstPrize ? `${Math.round(latest.firstPrize / 100000000)}억 원` : "-"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-slate-400">
              회차 데이터 준비 중입니다. 준비가 끝나면 최신 당첨번호를 먼저 보여드립니다.
            </div>
          )}
        </div>
      </section>

      <AdSlot label="Sponsored" className="max-w-4xl self-center" />

      <section className="grid gap-6 md:grid-cols-3">
        {[
          ["혼합형 추천", "기존 당첨 흐름과 무작위 요소를 함께 반영하는 기본 추천 전략입니다."],
          ["최신 회차 확인", "가장 최근 당첨번호를 홈에서 바로 확인하고 상세 화면으로 이어집니다."],
          ["기본 통계", "자주 나온 번호를 빈도 기준으로 빠르게 확인할 수 있습니다."]
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
            <h2 className="mt-3 text-2xl font-semibold text-white">전체 회차 기준 자주 나온 번호</h2>
          </div>
          <p className="text-sm text-slate-400">메인 번호 기준 상위 5개</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {hotNumbers.map((item) => (
            <Link key={item.number} href={`/stats/numbers/${item.number}`} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
              <p className="text-4xl font-semibold text-white">{item.number}</p>
              <p className="mt-3 text-sm text-slate-400">등장 {item.frequency}회</p>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-teal" style={{ width: `${item.percentage}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">회차 대비 {item.percentage}%</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
