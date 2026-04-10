"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { NumberSet } from "@/components/lotto/number-set";
import {
  buildGeneratedStatsSummary,
  getStrategyLabel,
  type StoredGeneratedRecord
} from "@/lib/generated-stats/shared";
import type { Draw } from "@/types/lotto";

interface GeneratedStatsDashboardProps {
  latestDraw: Draw | null;
}

const GENERATED_RECORDS_COLLECTION = "generated_records";
const RECORD_LIMIT = 240;

function isValidRecordShape(value: unknown): value is Omit<StoredGeneratedRecord, "id"> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  // Relax validations to guarantee valid records aren't dropped
  return (
    typeof record.anonymousId === "string" &&
    typeof record.strategy === "string" &&
    Array.isArray(record.numbers)
  );
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

export function GeneratedStatsDashboard({ latestDraw }: GeneratedStatsDashboardProps) {
  const [records, setRecords] = useState<StoredGeneratedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    let unsubscribe: (() => void) | null = null;

    async function subscribe() {
      try {
        const [{ collection, limit, onSnapshot, orderBy, query }, { getFirebaseDb }] = await Promise.all([
          import("firebase/firestore"),
          import("@/lib/firebase/client")
        ]);

        if (ignore) {
          return;
        }

        const db = getFirebaseDb();
        const recordsQuery = query(
          collection(db, GENERATED_RECORDS_COLLECTION),
          orderBy("generatedAt", "desc"),
          limit(RECORD_LIMIT)
        );

        unsubscribe = onSnapshot(
          recordsQuery,
          (snapshot) => {
            const nextRecords = snapshot.docs
              .map<StoredGeneratedRecord | null>((doc) => {
                const data = doc.data();

                if (!isValidRecordShape(data)) {
                  return null;
                }

                return {
                  id: doc.id,
                  anonymousId: data.anonymousId,
                  strategy: data.strategy,
                  numbers: [...data.numbers].filter((item): item is number => typeof item === "number"),
                  bonus: typeof data.bonus === "number" ? data.bonus : null,
                  reason: data.reason,
                  generatedAt: data.generatedAt,
                  targetRound: typeof data.targetRound === "number" ? data.targetRound : (typeof data.targetRound === "string" ? parseInt(data.targetRound, 10) : null),
                  matchedRound: typeof data.matchedRound === "number" ? data.matchedRound : (typeof data.matchedRound === "string" ? parseInt(data.matchedRound, 10) : null),
                  matchCount: typeof data.matchCount === "number" ? data.matchCount : (typeof data.matchCount === "string" ? parseInt(data.matchCount, 10) : null),
                  bonusMatched: data.bonusMatched === true,
                  settledAt: typeof data.settledAt === "string" ? data.settledAt : null,
                  filters: {
                    fixedNumbers: Array.isArray(data.filters?.fixedNumbers)
                      ? data.filters.fixedNumbers.filter((item): item is number => typeof item === "number")
                      : [],
                    excludedNumbers: Array.isArray(data.filters?.excludedNumbers)
                      ? data.filters.excludedNumbers.filter((item): item is number => typeof item === "number")
                      : [],
                    oddEven: typeof data.filters?.oddEven === "string" ? data.filters.oddEven : "any",
                    sumMin: typeof data.filters?.sumMin === "number" ? data.filters.sumMin : null,
                    sumMax: typeof data.filters?.sumMax === "number" ? data.filters.sumMax : null,
                    allowConsecutive: data.filters?.allowConsecutive !== false
                  }
                } satisfies StoredGeneratedRecord;
              })
              .filter((record): record is StoredGeneratedRecord => record !== null);

            setRecords(nextRecords);
            setLoading(false);
            setError(null);
          },
          () => {
            setError("생성 통계를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.");
            setLoading(false);
          }
        );
      } catch {
        if (!ignore) {
          setError("생성 통계를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.");
          setLoading(false);
        }
      }
    }

    void subscribe();

    return () => {
      ignore = true;
      unsubscribe?.();
    };
  }, []);

  const summary = useMemo(() => buildGeneratedStatsSummary(records, latestDraw), [records, latestDraw]);

  return (
    <div className="grid gap-6">
      <section className="panel">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <article className="kpi-cell">
            <p className="text-base text-slate-300">대상 회차</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {summary.currentTargetRound ? `${summary.currentTargetRound}회` : "-"}
            </p>
            <p className="mt-2 text-sm text-slate-400">지금 공개 생성 기록이 모이는 기준 회차입니다.</p>
          </article>
          <article className="kpi-cell">
            <p className="text-base text-slate-300">이번 회차 생성 수</p>
            <p className="mt-3 text-3xl font-semibold text-white">{summary.currentRecords.length}</p>
            <p className="mt-2 text-sm text-slate-400">현재 회차를 대상으로 생성된 공개 기록 수입니다.</p>
          </article>
          <article className="kpi-cell">
            <p className="text-base text-slate-300">최근 평가 회차</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {summary.latestEvaluatedRound ? `${summary.latestEvaluatedRound}회` : "-"}
            </p>
            <p className="mt-2 text-sm text-slate-400">당첨번호와 비교 평가가 끝난 가장 최근 회차입니다.</p>
          </article>
          <article className="kpi-cell">
            <p className="text-base text-slate-300">3개 이상 적중</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {summary.evaluatedRecords.filter((record) => record.matchCount >= 3).length}
            </p>
            <p className="mt-2 text-sm text-slate-400">최근 평가 회차 기준으로 3개 이상 맞은 기록 수입니다.</p>
          </article>
        </div>
      </section>

      <section className="grid items-start gap-6">
        <div className="panel self-start">
          <p className="eyebrow">우리 유저 전략 성과</p>
          <h2 className="section-subtitle mt-3 text-white">최근 평가 회차에서 유저들이 어떤 전략으로 더 잘 맞았는지 봅니다</h2>
          <p className="body-small mt-3 text-slate-300">
            유저 생성 기록 기준으로 전략별 생성 수, 최고 적중 수, 3개 이상 적중 수를 비교해서 어떤 흐름이
            상대적으로 좋았는지 확인할 수 있습니다.
          </p>

          {summary.strategyBoard.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {summary.strategyBoard.map((item) => (
                <article key={item.strategy} className="interactive-card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{getStrategyLabel(item.strategy)}</p>
                      <p className="mt-2 text-sm text-slate-400">
                        총 {item.totalGenerated}세트 · 평균 {item.averageMatch}개 적중
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-teal">
                      최고 {item.bestMatch}개
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                      <span>3개 이상 적중 비율</span>
                      <span>
                        {item.totalGenerated > 0 ? Math.round((item.threePlusHits / item.totalGenerated) * 100) : 0}%
                      </span>
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
                      <p className="text-sm text-slate-400">보너스 적중</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.bonusHits}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              아직 평가가 끝난 생성 기록이 없습니다. 회차 결과가 쌓이면 전략 성과가 여기에 표시됩니다.
            </div>
          )}
        </div>

        <div className="panel">
          <p className="eyebrow">현재 유저 흐름</p>
          <h2 className="section-subtitle mt-3 text-white">이번 회차에 유저들이 실제로 만드는 번호 흐름</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["실제 생성 기록", "전략 점유율", "많이 고른 번호", "공식 흐름과 비교"].map((item, index) => (
              <span key={item} className={index > 1 ? "spark-pill hidden md:inline-flex" : "spark-pill"}>
                {item}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="soft-card">
              <p className="text-base font-medium text-white">전략 점유율</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                이번 회차 기준으로 우리 유저들이 어떤 생성 방식을 많이 쓰는지 비중으로 봅니다.
              </p>
              <div className="mt-4 space-y-4">
                {summary.currentStrategyTotals.length > 0 ? (
                  summary.currentStrategyTotals.map((item) => (
                    <div key={item.strategy}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-200">{getStrategyLabel(item.strategy)}</span>
                        <span className="text-slate-400">
                          {item.totalGenerated}세트 · {item.sharePercentage}%
                        </span>
                      </div>
                      <div className="progress-track mt-2">
                        <div
                          className="progress-fill-teal"
                          style={{ width: `${Math.max(item.sharePercentage, 4)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">이번 회차 생성 기록이 아직 없습니다.</p>
                )}
              </div>
            </div>

            <div className="soft-card">
              <p className="text-base font-medium text-white">많이 생성된 번호 TOP 10</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                유저 생성 기록에서 반복해서 등장하는 번호를 빠르게 추려 봅니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {summary.currentTopNumbers.length > 0 ? (
                  summary.currentTopNumbers.map((item) => (
                    <Link
                      key={item.number}
                      href={`/stats/numbers/${item.number}`}
                      className="chip-link"
                    >
                      <span className="font-semibold text-white">{item.number}</span>
                      <span className="text-slate-400">{item.count}회</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">집계된 번호가 아직 없습니다.</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/stats" className="secondary-button">
              공식 당첨 흐름과 비교
            </Link>
            <Link href="/generate" className="secondary-button">
              새 번호 생성하기
            </Link>
          </div>
        </div>
      </section>

      <section className="grid items-start gap-6">
        <div className="panel self-start">
          <p className="eyebrow">유저 적중 분포</p>
          <h2 className="section-subtitle mt-3 text-white">최근 평가 회차에서 유저 조합이 몇 개 맞았는지 봅니다</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            평가가 끝난 유저 생성 기록을 적중 개수별로 묶어 전략 실험 결과를 거칠게 읽는 영역입니다.
          </p>
          <div className="mt-6 space-y-4">
            {summary.matchDistribution.map((item) => (
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
              <p className="eyebrow">최근 유저 번호</p>
              <h2 className="section-subtitle mt-3 text-white">이번 회차에 유저들이 공개 생성한 번호 일부</h2>
            </div>
            <Link href="/generate" className="secondary-button w-full sm:w-auto">
              새로 생성하기
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-400">
              생성 통계를 불러오는 중입니다.
            </div>
          ) : error ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-400">
              {error}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {summary.currentRecords.slice(0, 4).map((record) => (
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
              {summary.currentRecords.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-400">
                  이번 회차 공개 생성 기록이 아직 없습니다.
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
