import { computeFrequencyStats, drawRepository } from "@/lib/lotto";

function FrequencyCard({
  label,
  value,
  frequency,
  percentage
}: {
  label: string;
  value: number;
  frequency: number;
  percentage: number;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
      <p className="text-xs uppercase tracking-[0.26em] text-slate-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">등장 {frequency}회</p>
      <div className="mt-4 h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-accent" style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">회차 대비 {percentage}%</p>
    </article>
  );
}

export default async function StatsPage() {
  const draws = await drawRepository.getAll();
  const overall = computeFrequencyStats(draws, "all").slice(0, 10);
  const recent = computeFrequencyStats(draws, "recent_10").slice(0, 10);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="eyebrow">Stats</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">기본 빈도 통계</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          메인 번호 기준의 단순 빈도 통계입니다. v1에서는 전체 기준과 최근 10회 기준을 나눠 보여줍니다.
        </p>
      </div>

      <section className="grid gap-10 lg:grid-cols-2">
        <div className="panel">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">All Draws</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">전체 기준 상위 번호</h2>
            </div>
            <p className="text-sm text-slate-400">{draws.length}회 기준</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {overall.map((item, index) => (
              <FrequencyCard
                key={`overall-${item.number}`}
                label={`Rank ${index + 1}`}
                value={item.number}
                frequency={item.frequency}
                percentage={item.percentage}
              />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Recent 10</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">최근 10회 기준 상위 번호</h2>
            </div>
            <p className="text-sm text-slate-400">최근 흐름 기준</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {recent.map((item, index) => (
              <FrequencyCard
                key={`recent-${item.number}`}
                label={`Rank ${index + 1}`}
                value={item.number}
                frequency={item.frequency}
                percentage={item.percentage}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
