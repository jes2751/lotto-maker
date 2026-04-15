import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { getStrategyLabel, type GeneratedStatsSnapshot } from "@/lib/generated-stats/shared";

interface GeneratedStatsDashboardProps {
  snapshot: GeneratedStatsSnapshot;
}

function formatGeneratedAt(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatSnapshotTime(value: string | null) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getSourceLabel(source: GeneratedStatsSnapshot["source"]) {
  switch (source) {
    case "aggregate":
      return "집계 문서";
    case "recomputed":
      return "서버 재계산";
    default:
      return "데이터 없음";
  }
}

function getSourceTone(source: GeneratedStatsSnapshot["source"]) {
  switch (source) {
    case "aggregate":
      return "border-teal/30 bg-teal/10 text-teal-200";
    case "recomputed":
      return "border-amber-400/30 bg-amber-400/10 text-amber-100";
    default:
      return "border-white/10 bg-white/5 text-slate-200";
  }
}

export function GeneratedStatsDashboard({ snapshot }: GeneratedStatsDashboardProps) {
  const view = snapshot.view;
  const sourceLabel = getSourceLabel(snapshot.source);

  return (
    <div className="grid gap-6">
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">신뢰 계약</p>
            <h2 className="section-subtitle mt-3 text-white">지금 보이는 값은 이번 회차 전체 기준입니다</h2>
          </div>
          <span className={`rounded-full border px-4 py-2 text-sm font-medium ${getSourceTone(snapshot.source)}`}>
            {sourceLabel}
          </span>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="kpi-cell">
            <p className="text-sm text-slate-400">기준 회차</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {view.currentTargetRound ? `${view.currentTargetRound}회` : "-"}
            </p>
          </div>
          <div className="kpi-cell">
            <p className="text-sm text-slate-400">참여 세트 수</p>
            <p className="mt-2 text-2xl font-semibold text-white">{view.currentTotalGenerated}</p>
          </div>
          <div className="kpi-cell">
            <p className="text-sm text-slate-400">마지막 계산</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatSnapshotTime(snapshot.computedAt)}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <div className="signal-row">
            <span className="signal-row-dot" />
            <span>집계 출처: {sourceLabel}</span>
          </div>
          <div className="signal-row">
            <span className="signal-row-dot" />
            <span>집계 소스 레코드: {snapshot.sourceRecordCount}개</span>
          </div>
          <div className="signal-row">
            <span className="signal-row-dot" />
            <span>
              {snapshot.source === "aggregate"
                ? "저장된 회차 집계를 우선 보여주고, 없을 때만 서버에서 다시 계산합니다."
                : snapshot.source === "recomputed"
                  ? "집계 문서가 없어 서버가 현재 회차 전체 기록을 다시 계산했습니다."
                  : "이번 회차 집계 데이터가 아직 없습니다."}
            </span>
          </div>
        </div>
      </section>

      <section className="grid items-start gap-6">
        <div className="panel self-start">
          <p className="eyebrow">전략 성과</p>
          <h2 className="section-subtitle mt-3 text-white">직전 평가 회차에서 전략별 결과를 비교합니다</h2>
          <p className="body-small mt-3 text-slate-300">
            지난 회차 대상 생성 기록이 실제로 얼마나 맞았는지 전략별로 정리합니다.
          </p>

          {view.strategyBoard.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {view.strategyBoard.map((item) => (
                <article key={item.strategy} className="interactive-card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{getStrategyLabel(item.strategy)}</p>
                      <p className="mt-2 text-sm text-slate-400">
                        생성 {item.totalGenerated}세트, 평균 적중 {item.averageMatch.toFixed(2)}개
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-teal">
                      최고 {item.bestMatch}개 적중
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                      <span>3개 이상 적중 비율</span>
                      <span>{item.totalGenerated > 0 ? Math.round((item.threePlusHits / item.totalGenerated) * 100) : 0}%</span>
                    </div>
                    <div className="progress-track mt-2">
                      <div
                        className="progress-fill-teal"
                        style={{
                          width: `${Math.max(
                            item.totalGenerated > 0 ? Math.round((item.threePlusHits / item.totalGenerated) * 100) : 0,
                            item.threePlusHits > 0 ? 6 : 0
                          )}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="kpi-cell">
                      <p className="text-sm text-slate-400">3개 이상</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.threePlusHits}</p>
                    </div>
                    <div className="kpi-cell">
                      <p className="text-sm text-slate-400">4개 이상</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.fourPlusHits}</p>
                    </div>
                    <div className="kpi-cell">
                      <p className="text-sm text-slate-400">보너스 일치</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.bonusHits}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              아직 평가 가능한 지난 회차 생성 기록이 없습니다.
            </div>
          )}
        </div>

        <div className="panel">
          <p className="eyebrow">사람들 선택</p>
          <h2 className="section-subtitle mt-3 text-white">이번 회차 전체 생성 기록에서 나온 선택 흐름입니다</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["이번 회차 전체", "전략 점유율", "번호 집중도", "최근 공개 세트"].map((item, index) => (
              <span key={item} className={index > 1 ? "spark-pill hidden md:inline-flex" : "spark-pill"}>
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="soft-card">
              <p className="text-base font-medium text-white">전략 점유율</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                현재 회차 전체 생성 기록에서 어떤 전략이 얼마나 사용됐는지 보여줍니다.
              </p>
              <div className="mt-4 space-y-4">
                {view.currentStrategyTotals.length > 0 ? (
                  view.currentStrategyTotals.map((item) => (
                    <div key={item.strategy}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-200">{getStrategyLabel(item.strategy)}</span>
                        <span className="text-slate-400">
                          {item.totalGenerated}세트 · {item.sharePercentage}%
                        </span>
                      </div>
                      <div className="progress-track mt-2">
                        <div className="progress-fill-teal" style={{ width: `${Math.max(item.sharePercentage, 4)}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">이번 회차 생성 기록이 아직 없습니다.</p>
                )}
              </div>
            </div>

            <div className="soft-card">
              <p className="text-base font-medium text-white">많이 선택된 번호 TOP 10</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                현재 회차 전체 생성 기록에서 가장 자주 등장한 번호입니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {view.currentTopNumbers.length > 0 ? (
                  view.currentTopNumbers.map((item) => (
                    <Link key={item.number} href={`/stats/numbers/${item.number}`} className="chip-link">
                      <span className="font-semibold text-white">{item.number}</span>
                      <span className="text-slate-400">{item.count}회</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">집계할 번호가 아직 없습니다.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/stats" className="secondary-button">
              공식 통계 보기
            </Link>
            <Link href="/generate" className="secondary-button">
              번호 다시 생성
            </Link>
          </div>
        </div>
      </section>

      <section className="grid items-start gap-6">
        <div className="panel self-start">
          <p className="eyebrow">적중 분포</p>
          <h2 className="section-subtitle mt-3 text-white">직전 평가 회차의 적중 분포입니다</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            지난 회차를 대상으로 생성됐던 세트가 몇 개씩 맞았는지 분포로 보여줍니다.
          </p>
          <div className="mt-6 space-y-4">
            {view.matchDistribution.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-200">{item.label}</span>
                  <span className="text-slate-400">
                    {item.count}세트 · {item.percentage}%
                  </span>
                </div>
                <div className="progress-track mt-2">
                  <div
                    className="progress-fill-amber"
                    style={{ width: `${Math.max(item.percentage, item.count > 0 ? 4 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">최근 공개 세트</p>
              <h2 className="section-subtitle mt-3 text-white">이번 회차에서 최근 생성된 공개 세트입니다</h2>
            </div>
            <Link href="/generate" className="secondary-button w-full sm:w-auto">
              번호 생성하러 가기
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {view.recentRecords.map((record) => (
              <article key={record.id} className="interactive-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{getStrategyLabel(record.strategy)}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {record.targetRound ? `${record.targetRound}회 대상` : "대상 회차 없음"} · {formatGeneratedAt(record.generatedAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <NumberSet
                    numbers={record.numbers}
                    bonus={record.bonus ?? undefined}
                    hrefBuilder={(value) => `/stats/numbers/${value}`}
                  />
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{record.reason}</p>
              </article>
            ))}
            {view.recentRecords.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-400">
                이번 회차 공개 생성 기록이 아직 없습니다.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
