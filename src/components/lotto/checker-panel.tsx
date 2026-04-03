"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { NumberBall } from "@/components/lotto/number-ball";
import type { Draw } from "@/types/lotto";

/* ── Prize logic (Korean Lotto 6/45) ──────────────────────── */

type PrizeRank = 1 | 2 | 3 | 4 | 5 | null;

interface CheckResult {
  rank: PrizeRank;
  matchedNumbers: number[];
  bonusMatched: boolean;
  label: string;
  color: string;
}

interface HistoryMatch {
  round: number;
  drawDate: string;
  rank: NonNullable<PrizeRank>;
  matchedNumbers: number[];
  winningNumbers: number[];
  bonusMatched: boolean;
  bonusNumber: number;
}

type CheckMode = "single" | "history";

function checkPrize(
  userNumbers: number[],
  draw: Draw
): CheckResult {
  const matched = userNumbers.filter((n) => draw.numbers.includes(n));
  const bonusMatched = userNumbers.includes(draw.bonus);
  const matchCount = matched.length;

  if (matchCount === 6)
    return { rank: 1, matchedNumbers: matched, bonusMatched, label: "1등 당첨!", color: "from-amber-400 to-yellow-500" };
  if (matchCount === 5 && bonusMatched)
    return { rank: 2, matchedNumbers: matched, bonusMatched, label: "2등 당첨!", color: "from-sky-400 to-blue-500" };
  if (matchCount === 5)
    return { rank: 3, matchedNumbers: matched, bonusMatched, label: "3등 당첨!", color: "from-rose-400 to-pink-500" };
  if (matchCount === 4)
    return { rank: 4, matchedNumbers: matched, bonusMatched, label: "4등 당첨!", color: "from-emerald-400 to-green-500" };
  if (matchCount === 3)
    return { rank: 5, matchedNumbers: matched, bonusMatched, label: "5등 당첨!", color: "from-violet-400 to-purple-500" };

  return { rank: null, matchedNumbers: matched, bonusMatched, label: "아쉽지만 미당첨", color: "from-slate-500 to-slate-600" };
}

/* ── Component ────────────────────────────────────────────── */

interface CheckerPanelProps {
  latestDraw: Draw;
}

export function CheckerPanel({ latestDraw }: CheckerPanelProps) {
  const [checkMode, setCheckMode] = useState<CheckMode>("single");
  const [roundInput, setRoundInput] = useState(String(latestDraw.round));
  const [draw, setDraw] = useState<Draw>(latestDraw);
  const [numberInputs, setNumberInputs] = useState<string[]>(["", "", "", "", "", ""]);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [historyResult, setHistoryResult] = useState<HistoryMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingRound, setFetchingRound] = useState(false);

  const updateNumber = useCallback((index: number, value: string) => {
    setNumberInputs((prev) => {
      const next = [...prev];
      next[index] = value.replace(/\D/g, "").slice(0, 2);
      return next;
    });
    setResult(null);
    setHistoryResult(null);
  }, []);

  const handleKeyUp = useCallback((index: number, value: string) => {
    if (value.length === 2 && index < 5) {
      const nextInput = document.getElementById(`check-num-${index + 1}`);
      nextInput?.focus();
    }
  }, []);

  async function fetchRound(round: number) {
    setFetchingRound(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/draws/${round}`);
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        throw new Error(payload.error?.message ?? "회차 데이터를 불러올 수 없습니다.");
      }
      setDraw(payload.data as Draw);
      setResult(null);
      setHistoryResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "회차 데이터를 불러올 수 없습니다.");
    } finally {
      setFetchingRound(false);
    }
  }

  function handleRoundChange() {
    const round = Number.parseInt(roundInput, 10);
    if (!Number.isInteger(round) || round < 1) {
      setError("유효한 회차 번호를 입력하세요.");
      return;
    }
    void fetchRound(round);
  }

  async function fetchHistory(numbers: number[]) {
    try {
      const res = await fetch("/api/v1/check-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers })
      });
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        throw new Error(payload.error?.message ?? "전체 회차 이력 조회에 실패했습니다.");
      }
      setHistoryResult(payload.data.matches as HistoryMatch[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "이력 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function handleCheck() {
    setLoading(true);
    setError(null);

    const parsed = numberInputs.map((v) => Number.parseInt(v, 10));

    if (parsed.some((n) => Number.isNaN(n) || n < 1 || n > 45)) {
      setError("모든 칸에 1~45 사이의 번호를 입력하세요.");
      setLoading(false);
      return;
    }

    const unique = new Set(parsed);
    if (unique.size !== 6) {
      setError("중복되지 않는 6개의 번호를 입력하세요.");
      setLoading(false);
      return;
    }

    if (checkMode === "single") {
      const checkResult = checkPrize(parsed, draw);
      setResult(checkResult);
      setHistoryResult(null);
      setLoading(false);
    } else {
      setResult(null);
      void fetchHistory(parsed);
    }
  }

  function handleClear() {
    setNumberInputs(["", "", "", "", "", ""]);
    setResult(null);
    setHistoryResult(null);
    setError(null);
  }

  const rankDescriptions: Record<number, string> = {
    1: "6개 번호가 일치합니다. 1등 당첨!",
    2: "5개 + 보너스 번호가 일치합니다! 2등 당첨!",
    3: "5개 번호가 일치합니다! 3등 당첨!",
    4: "4개 번호가 일치합니다. 4등",
    5: "3개 번호가 일치합니다. 5등",
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return "border-yellow-400/50 bg-yellow-400/10 text-yellow-300";
      case 2: return "border-blue-400/50 bg-blue-400/10 text-blue-300";
      case 3: return "border-pink-400/50 bg-pink-400/10 text-pink-300";
      case 4: return "border-green-400/50 bg-green-400/10 text-green-300";
      case 5: return "border-purple-400/50 bg-purple-400/10 text-purple-300";
      default: return "border-white/10 bg-white/5 text-slate-300";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── Mode Selector ──────────────────────── */}
      <section className="panel">
        <p className="eyebrow">조회 방식 선택</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => { setCheckMode("single"); setResult(null); setHistoryResult(null); setError(null); }}
            className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
              checkMode === "single" ? "border-accent bg-accent/10 text-white" : "border-white/10 text-slate-300 hover:border-white/30"
            }`}
          >
            특정 회차와 비교
          </button>
          <button
            type="button"
            onClick={() => { setCheckMode("history"); setResult(null); setHistoryResult(null); setError(null); }}
            className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
              checkMode === "history" ? "border-accent bg-accent/10 text-white flex items-center gap-2" : "border-white/10 text-slate-300 hover:border-white/30"
            }`}
          >
            역대 전체 당첨 이력
            {checkMode === "history" && <span className="rounded-full bg-accent text-white px-2 py-0.5 text-[0.65rem] uppercase tracking-wider font-bold">New</span>}
          </button>
        </div>

        {checkMode === "single" ? (
          <div className="mt-8 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-semibold text-white">
              어떤 회차의 당첨번호와 비교할까요?
            </h2>

            <div className="mt-6 flex flex-wrap items-end gap-4">
              <label className="space-y-2 text-sm text-slate-300">
                <span>회차 번호</span>
                <input
                  value={roundInput}
                  onChange={(e) => setRoundInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRoundChange(); }}
                  inputMode="numeric"
                  placeholder="예: 1217"
                  className="w-32 rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white placeholder:text-slate-500"
                />
              </label>
              <button
                type="button"
                onClick={handleRoundChange}
                disabled={fetchingRound}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-white/30 disabled:opacity-50"
              >
                {fetchingRound ? "조회 중..." : "회차 불러오기"}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">비교 대상</span>
                  <p className="mt-1 text-xl font-semibold text-white">{draw.round}회 ({draw.drawDate})</p>
                </div>
                <Link
                  href={`/draws/${draw.round}`}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/30"
                >
                  회차 상세 보기
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {draw.numbers.map((n) => (
                  <NumberBall key={n} value={n} />
                ))}
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-semibold text-slate-400">
                  +
                </span>
                <NumberBall value={draw.bonus} bonus />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-semibold text-white">
              내 번호가 역대 로또에서 당첨된 적이 있을까요?
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              1회차부터 {latestDraw.round}회차까지 <strong>전체 발매 기록</strong>을 대상으로 당첨 이력을 분석합니다.<br/>
              서버 메모리 캐시를 활용하므로 DB 요청 없이 0.01초 안에 1등~5등 이력을 찾아냅니다.
            </p>
          </div>
        )}
      </section>

      {/* ── Number Input ──────────────────────── */}
      <section className="panel">
        <p className="eyebrow">내 번호 입력</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">
          확인할 내 번호 6개를 입력하세요
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          1~45 사이의 숫자 6개를 순서와 상관없이 넣으면 됩니다.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {numberInputs.map((value, index) => (
            <input
              key={index}
              id={`check-num-${index}`}
              value={value}
              onChange={(e) => updateNumber(index, e.target.value)}
              onKeyUp={(e) => handleKeyUp(index, (e.target as HTMLInputElement).value)}
              onKeyDown={(e) => { if (e.key === "Enter" && index === 5) handleCheck(); }}
              inputMode="numeric"
              maxLength={2}
              placeholder={String(index + 1)}
              className="h-14 w-14 rounded-2xl border border-white/10 bg-slate-900 text-center text-xl font-bold text-white placeholder:text-slate-600 focus:border-teal-400/50 focus:outline-none focus:ring-1 focus:ring-teal-400/30 transition"
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading}
            className="cta-button"
          >
            {loading ? "확인 중..." : checkMode === "single" ? "당첨 확인하기" : "전체 회차 조회하기"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-white/30"
          >
            초기화
          </button>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-4 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
      </section>

      {/* ── Result: Single ──────────────────────── */}
      {checkMode === "single" && result ? (
        <section className="panel relative overflow-hidden">
          {result.rank ? (
            <>
              <div className={`absolute -top-20 -right-20 h-80 w-80 rounded-full bg-gradient-to-br ${result.color} opacity-10 blur-[100px]`} />
              <div className={`absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-br ${result.color} opacity-10 blur-[80px]`} />
            </>
          ) : null}

          <div className="relative z-10">
            <p className="eyebrow">당첨 확인 결과</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {result.rank ? (
                <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${result.color} px-6 py-2 text-lg font-bold text-white shadow-lg`}>
                  {result.label}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-2 text-lg font-semibold text-slate-300">
                  {result.label}
                </span>
              )}
              <span className="text-sm text-slate-400">
                {draw.round}회 기준
              </span>
            </div>

            <p className="mt-4 text-base leading-relaxed text-slate-300">
              {result.rank
                ? rankDescriptions[result.rank]
                : `${result.matchedNumbers.length}개 번호가 일치합니다. 다음 기회에 도전해보세요!`}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">내 번호</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {numberInputs
                    .map((v) => Number.parseInt(v, 10))
                    .filter((n) => !Number.isNaN(n))
                    .sort((a, b) => a - b)
                    .map((n) => {
                      const isMatch = result.matchedNumbers.includes(n);
                      const isBonusMatch = n === draw.bonus && result.bonusMatched;
                      return (
                         <div key={n} className="relative">
                           <NumberBall value={n} bonus={isBonusMatch} />
                           {isMatch ? (
                             <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white shadow">✓</span>
                           ) : null}
                         </div>
                      );
                    })}
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  {result.matchedNumbers.length}개 일치
                  {result.bonusMatched ? " + 보너스 일치" : ""}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{draw.round}회 당첨번호</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {draw.numbers.map((n) => {
                    const isMatch = result.matchedNumbers.includes(n);
                    return (
                      <div key={n} className="relative">
                        <NumberBall value={n} />
                        {isMatch ? <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white shadow">✓</span> : null}
                      </div>
                    );
                  })}
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-semibold text-slate-400">+</span>
                  <div className="relative">
                    <NumberBall value={draw.bonus} bonus />
                    {result.bonusMatched ? <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white shadow">✓</span> : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">당첨 등수 안내</p>
              <div className="mt-4 grid gap-2">
                {[
                  { rank: 1, condition: "6개 번호 일치", prize: "1등" },
                  { rank: 2, condition: "5개 + 보너스 번호 일치", prize: "2등" },
                  { rank: 3, condition: "5개 번호 일치", prize: "3등" },
                  { rank: 4, condition: "4개 번호 일치", prize: "4등" },
                  { rank: 5, condition: "3개 번호 일치", prize: "5등" },
                ].map((item) => (
                  <div
                    key={item.rank}
                    className={[
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm",
                      result.rank === item.rank
                        ? "border border-teal-500/30 bg-teal-500/10 text-white font-semibold"
                        : "border border-transparent text-slate-400"
                    ].join(" ")}
                  >
                    <span>{item.prize}</span>
                    <span>{item.condition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={handleClear} className="cta-button">
                다른 번호 확인하기
              </button>
              <Link href={`/draws/${draw.round}`} className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
                {draw.round}회 상세 보기
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Result: History (모든 회차) ──────────────────────── */}
      {checkMode === "history" && historyResult !== null ? (
        <section className="panel">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">전체 회차 이력</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                총 {historyResult.length}번의 당첨 기록이 있습니다.
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                1등 {historyResult.filter(r => r.rank === 1).length}회 / 
                2등 {historyResult.filter(r => r.rank === 2).length}회 / 
                3등 {historyResult.filter(r => r.rank === 3).length}회 / 
                4등 {historyResult.filter(r => r.rank === 4).length}회 / 
                5등 {historyResult.filter(r => r.rank === 5).length}회
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {historyResult.length > 0 ? (
              historyResult.map((match) => (
                <article key={match.round} className="rounded-3xl border border-white/10 bg-slate-900/40 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex rounded-full border px-3 py-1 font-semibold text-sm ${getRankBadgeColor(match.rank)}`}>
                        {match.rank}등 당첨
                      </span>
                      <p className="text-sm font-semibold text-white">{match.round}회</p>
                      <p className="text-xs text-slate-500">{match.drawDate}</p>
                    </div>
                    <Link
                      href={`/draws/${match.round}`}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/30"
                    >
                      회차 상세 보기
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {match.winningNumbers.map((n) => {
                      const isMatch = match.matchedNumbers.includes(n);
                      return (
                        <div key={n} className="relative">
                          <NumberBall value={n} />
                          {isMatch ? <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white shadow">✓</span> : null}
                        </div>
                      );
                    })}
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-semibold text-slate-400">+</span>
                    <div className="relative">
                      <NumberBall value={match.bonusNumber} bonus />
                      {match.bonusMatched ? <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white shadow">✓</span> : null}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                입력하신 번호는 역대 전체 회차에서 당첨된 기록이 없습니다.<br/>
                새로운 당첨 번호일지도 모릅니다.
              </div>
            )}
          </div>
        </section>
      ) : null}

    </div>
  );
}
