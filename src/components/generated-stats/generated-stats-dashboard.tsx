"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";

import { NumberSet } from "@/components/lotto/number-set";
import { getFirebaseDb } from "@/lib/firebase/client";
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

  return (
    typeof record.anonymousId === "string" &&
    typeof record.strategy === "string" &&
    Array.isArray(record.numbers) &&
    typeof record.reason === "string" &&
    typeof record.generatedAt === "string"
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
    const db = getFirebaseDb();
    const recordsQuery = query(
      collection(db, GENERATED_RECORDS_COLLECTION),
      orderBy("generatedAt", "desc"),
      limit(RECORD_LIMIT)
    );

    const unsubscribe = onSnapshot(
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
              targetRound: typeof data.targetRound === "number" ? data.targetRound : null,
              matchedRound: typeof data.matchedRound === "number" ? data.matchedRound : null,
              matchCount: typeof data.matchCount === "number" ? data.matchCount : null,
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
        setError("생성 통계를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const summary = useMemo(() => buildGeneratedStatsSummary(records, latestDraw), [records, latestDraw]);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">대상 회차</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {summary.currentTargetRound ? `${summary.currentTargetRound}회` : "-"}
          </p>
          <p className="mt-2 text-sm text-slate-400">현재 생성 결과를 모으는 회차입니다.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">이번 회차 생성 수</p>
          <p className="mt-3 text-3xl font-semibold text-white">{summary.currentRecords.length}</p>
          <p className="mt-2 text-sm text-slate-400">공개 생성 현황에 반영된 번호 세트 수입니다.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">최근 평가 회차</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {summary.latestEvaluatedRound ? `${summary.latestEvaluatedRound}회` : "-"}
          </p>
          <p className="mt-2 text-sm text-slate-400">실제 당첨번호와 비교를 마친 가장 최근 회차입니다.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">3개 이상 일치</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {summary.evaluatedRecords.filter((record) => record.matchCount >= 3).length}
          </p>
          <p className="mt-2 text-sm text-slate-400">최근 평가 회차에서 3개 이상 맞은 생성 결과 수입니다.</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel">
          <p className="eyebrow">전략 성과</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">최근 평가 회차 기준 전략별 결과</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            어떤 전략이 더 많이 쓰였는지보다, 실제 당첨번호와 비교했을 때 어느 전략이 더 가까웠는지를
            먼저 보여줍니다.
          </p>

          {summary.strategyBoard.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {summary.strategyBoard.map((item) => (
                <article key={item.strategy} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{getStrategyLabel(item.strategy)}</p>
                      <p className="mt-2 text-sm text-slate-400">
                        {item.totalGenerated}건 평가, 평균 {item.averageMatch}개 일치
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-teal">
                      최고 {item.bestMatch}개
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">3개 이상</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.threePlusHits}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">4개 이상</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.fourPlusHits}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">보너스 일치</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.bonusHits}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              아직 평가를 마친 생성 기록이 없습니다. 다음 회차 결과가 반영되면 전략 성과가 이곳에 나타납니다.
            </div>
          )}
        </div>

        <div className="panel">
          <p className="eyebrow">현재 흐름</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">이번 회차에서 많이 생성된 번호와 전략</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-sm font-medium text-white">전략 점유율</p>
              <div className="mt-4 space-y-4">
                {summary.currentStrategyTotals.length > 0 ? (
                  summary.currentStrategyTotals.map((item) => (
                    <div key={item.strategy}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-200">{getStrategyLabel(item.strategy)}</span>
                        <span className="text-slate-400">
                          {item.totalGenerated}건 · {item.sharePercentage}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-teal"
                          style={{ width: `${Math.max(item.sharePercentage, 4)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">이번 회차 생성 기록이 아직 많지 않습니다.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-sm font-medium text-white">많이 생성된 번호 TOP 10</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {summary.currentTopNumbers.length > 0 ? (
                  summary.currentTopNumbers.map((item) => (
                    <Link
                      key={item.number}
                      href={`/stats/numbers/${item.number}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
                    >
                      <span className="font-semibold text-white">{item.number}</span>
                      <span className="text-slate-500">{item.count}건</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">집계할 번호가 아직 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="panel">
          <p className="eyebrow">적중 분포</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">최근 평가 회차에서 몇 개가 맞았는지</h2>
          <div className="mt-6 space-y-4">
            {summary.matchDistribution.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-200">{item.label}</span>
                  <span className="text-slate-400">
                    {item.count}건 · {item.percentage}%
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-accent"
                    style={{ width: `${Math.max(item.percentage, item.count > 0 ? 4 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">최근 생성 번호</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">최근 생성된 번호 일부</h2>
            </div>
            <Link
              href="/generate"
              className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
            >
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
              {summary.currentRecords.slice(0, 8).map((record) => (
                <article key={record.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{getStrategyLabel(record.strategy)}</p>
                      <p className="mt-1 text-xs text-slate-500">
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
                  <p className="mt-4 text-sm leading-7 text-slate-400">{record.reason}</p>
                </article>
              ))}
              {summary.currentRecords.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-400">
                  아직 이번 회차 생성 기록이 충분하지 않습니다.
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
