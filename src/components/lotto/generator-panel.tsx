"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toBlob } from "html-to-image";

import { ShareCard } from "@/components/lotto/share-card";

import { NumberSet } from "@/components/lotto/number-set";
import { recordGeneratedSets } from "@/lib/generated-stats/client";
import type {
  GeneratedSet,
  GenerationFilters,
  GenerationStrategy,
  OddEvenFilter
} from "@/types/lotto";

const STORAGE_KEY = "lotto-lab-saved-sets";

const strategies: Array<{ value: GenerationStrategy; label: string; description: string }> = [
  {
    value: "mixed",
    label: "혼합 추천",
    description: "전체 빈도와 최근 흐름을 함께 참고해 균형 있게 번호를 만듭니다."
  },
  {
    value: "frequency",
    label: "빈도 추천",
    description: "과거 당첨 데이터에서 자주 나온 번호 흐름을 더 강하게 반영합니다."
  },
  {
    value: "random",
    label: "랜덤 추천",
    description: "1부터 45까지 중복 없이 무작위로 번호를 생성합니다."
  },
  {
    value: "filter",
    label: "필터 추천",
    description: "고정수, 제외수, 홀짝, 합계, 연속번호 조건을 넣어 맞춤형으로 생성합니다."
  }
];

const oddEvenOptions: Array<{ value: OddEvenFilter; label: string }> = [
  { value: "any", label: "조건 없음" },
  { value: "balanced", label: "균형형 3:3" },
  { value: "odd-heavy", label: "홀수 비중 높게" },
  { value: "even-heavy", label: "짝수 비중 높게" }
];

type RecordStatus = "idle" | "recording" | "recorded" | "failed";

interface GeneratorPanelProps {
  targetRound?: number | null;
}

function parseNumberInput(value: string) {
  return [
    ...new Set(
      value
        .split(/[,\s]+/)
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isInteger(item) && item >= 1 && item <= 45)
    )
  ].sort((left, right) => left - right);
}

function formatCopyText(set: GeneratedSet) {
  return `${set.strategy}: ${set.numbers.join(", ")} + ${set.bonus}`;
}

function loadSavedSets(): GeneratedSet[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as GeneratedSet[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistSavedSets(nextSavedSets: GeneratedSet[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSavedSets));
}

function buildStatsHref(value: number) {
  return `/stats/numbers/${value}`;
}

export function GeneratorPanel({ targetRound = null }: GeneratorPanelProps) {
  const [strategy, setStrategy] = useState<GenerationStrategy>("mixed");
  const [count, setCount] = useState(5);
  const [fixedNumbersInput, setFixedNumbersInput] = useState("");
  const [excludedNumbersInput, setExcludedNumbersInput] = useState("");
  const [oddEven, setOddEven] = useState<OddEvenFilter>("any");
  const [sumMin, setSumMin] = useState("");
  const [sumMax, setSumMax] = useState("");
  const [allowConsecutive, setAllowConsecutive] = useState(true);
  const [sets, setSets] = useState<GeneratedSet[]>([]);
  const [savedSets, setSavedSets] = useState<GeneratedSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [recordStatus, setRecordStatus] = useState<RecordStatus>("idle");

  const fixedNumbers = useMemo(() => parseNumberInput(fixedNumbersInput), [fixedNumbersInput]);
  const excludedNumbers = useMemo(() => parseNumberInput(excludedNumbersInput), [excludedNumbersInput]);

  const filters = useMemo<GenerationFilters>(
    () => ({
      fixedNumbers,
      excludedNumbers,
      oddEven,
      sumMin: sumMin ? Number(sumMin) : null,
      sumMax: sumMax ? Number(sumMax) : null,
      allowConsecutive
    }),
    [allowConsecutive, excludedNumbers, fixedNumbers, oddEven, sumMax, sumMin]
  );

  const filterSummary = useMemo(() => {
    const parts: string[] = [];

    if (fixedNumbers.length > 0) {
      parts.push(`고정수 ${fixedNumbers.join(", ")}`);
    }

    if (excludedNumbers.length > 0) {
      parts.push(`제외수 ${excludedNumbers.join(", ")}`);
    }

    if (oddEven !== "any") {
      const label = oddEvenOptions.find((item) => item.value === oddEven)?.label ?? oddEven;
      parts.push(label);
    }

    if (sumMin || sumMax) {
      parts.push(`합계 ${sumMin || "-"} ~ ${sumMax || "-"}`);
    }

    if (!allowConsecutive) {
      parts.push("연속번호 제외");
    }

    return parts.length > 0 ? parts.join(" / ") : "조건 없음";
  }, [allowConsecutive, excludedNumbers, fixedNumbers, oddEven, sumMax, sumMin]);

  const selectedStrategy = useMemo(
    () => strategies.find((item) => item.value === strategy),
    [strategy]
  );

  async function generate() {
    setLoading(true);
    setError(null);
    setRecordStatus("idle");

    try {
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy,
          count,
          filters: {
            fixed_numbers: filters.fixedNumbers,
            excluded_numbers: filters.excludedNumbers,
            odd_even: filters.oddEven,
            sum_min: filters.sumMin,
            sum_max: filters.sumMax,
            allow_consecutive: filters.allowConsecutive
          }
        })
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message ?? "번호 생성에 실패했습니다.");
      }

      const nextSets = payload.data.sets as GeneratedSet[];
      setSets(nextSets);
      setCopiedId(null);
      setSavedId(null);
      setRecordStatus("recording");

      void recordGeneratedSets({
        strategy,
        sets: nextSets,
        filters,
        targetRound
      })
        .then(() => setRecordStatus("recorded"))
        .catch(() => setRecordStatus("failed"));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "번호 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function copySet(set: GeneratedSet) {
    const text = formatCopyText(set);

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }

      setCopiedId(set.id);
      setTimeout(() => setCopiedId((current) => (current === set.id ? null : current)), 1500);
    } catch {
      setError("번호를 복사하지 못했습니다.");
    }
  }

  function saveSet(set: GeneratedSet) {
    const nextSavedSets = [set, ...savedSets.filter((item) => item.id !== set.id)].slice(0, 8);
    setSavedSets(nextSavedSets);
    persistSavedSets(nextSavedSets);
    setSavedId(set.id);
    setTimeout(() => setSavedId((current) => (current === set.id ? null : current)), 1500);
  }

  function removeSavedSet(id: string) {
    const nextSavedSets = savedSets.filter((item) => item.id !== id);
    setSavedSets(nextSavedSets);
    persistSavedSets(nextSavedSets);
  }

  async function shareSet(set: GeneratedSet) {
    setSharingId(set.id);
    setError(null);
    try {
      const element = document.getElementById(`share-card-${set.id}`);
      if (!element) throw new Error("공유용 이미지를 찾을 수 없습니다.");

      const blob = await toBlob(element, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: "#020617", // Ensure background isn't transparent
      });
      if (!blob) throw new Error("이미지 생성에 실패했습니다.");

      const file = new File([blob], `lotto-maker-${set.id}.png`, { type: "image/png" });

      if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "로또 번호 생성 결과",
          text: formatCopyText(set),
          files: [file]
        });
      } else {
        // Fallback to PC/legacy download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (caughtError) {
      if ((caughtError as DOMException)?.name !== "AbortError") {
        setError(caughtError instanceof Error ? caughtError.message : "이미지 공유에 실패했습니다.");
      }
    } finally {
      setSharingId(null);
    }
  }

  useEffect(() => {
    setSavedSets(loadSavedSets());
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="panel">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">생성 설정</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">전략을 고르고 바로 번호를 만들어보세요</h2>
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            보너스 번호는 항상 포함됩니다.
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {strategies.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setStrategy(item.value)}
              className={[
                "rounded-2xl border px-4 py-4 text-left transition",
                strategy === item.value
                  ? "border-accent bg-accent/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
              ].join(" ")}
            >
              <div className="font-medium">{item.label}</div>
              <div className="mt-2 text-sm leading-6 text-slate-400">{item.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[0.6fr_0.4fr]">
              <label className="space-y-2 text-sm text-slate-300">
                <span>생성 수</span>
                <select
                  value={count}
                  onChange={(event) => setCount(Number(event.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white"
                >
                  {[1, 2, 3, 4, 5].map((option) => (
                    <option key={option} value={option}>
                      {option}세트
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">현재 전략</p>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    {selectedStrategy?.label ?? strategy}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {selectedStrategy?.description ?? "현재 전략 설명이 준비되지 않았습니다."}
                </p>
              </div>
            </div>

            {strategy === "filter" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">현재 필터 요약</p>
                    <p className="text-xs text-slate-500">
                      고정수 {fixedNumbers.length}개 / 제외수 {excludedNumbers.length}개
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{filterSummary}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>고정수 입력</span>
                    <input
                      value={fixedNumbersInput}
                      onChange={(event) => setFixedNumbersInput(event.target.value)}
                      placeholder="예: 3, 11, 27"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-500">숫자는 최대 5개까지 넣을 수 있습니다.</p>
                  </label>

                  <label className="space-y-2 text-sm text-slate-300">
                    <span>제외수 입력</span>
                    <input
                      value={excludedNumbersInput}
                      onChange={(event) => setExcludedNumbersInput(event.target.value)}
                      placeholder="예: 1, 2, 45"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-500">제외수는 최대 35개까지 넣을 수 있습니다.</p>
                  </label>

                  <label className="space-y-2 text-sm text-slate-300">
                    <span>홀짝 조건</span>
                    <select
                      value={oddEven}
                      onChange={(event) => setOddEven(event.target.value as OddEvenFilter)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white"
                    >
                      {oddEvenOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-300">
                      <span>합계 최소값</span>
                      <input
                        value={sumMin}
                        onChange={(event) => setSumMin(event.target.value)}
                        inputMode="numeric"
                        placeholder="예: 90"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white placeholder:text-slate-500"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span>합계 최대값</span>
                      <input
                        value={sumMax}
                        onChange={(event) => setSumMax(event.target.value)}
                        inputMode="numeric"
                        placeholder="예: 170"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white placeholder:text-slate-500"
                      />
                    </label>
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={allowConsecutive}
                    onChange={(event) => setAllowConsecutive(event.target.checked)}
                    className="h-4 w-4 accent-accent"
                  />
                  연속번호 허용
                </label>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/30 p-5">
            <div>
              <p className="text-sm font-medium text-white">생성 기준</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {targetRound ? `${targetRound}회 대상 번호로 기록됩니다.` : "다음 회차 기준을 계산 중입니다."}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                생성 결과는 참고용이며 공개 생성 통계에도 익명으로 반영됩니다.
              </p>
            </div>

            <button type="button" onClick={() => void generate()} className="cta-button mt-auto w-full" disabled={loading}>
              {loading ? "번호 생성 중..." : "번호 생성하기"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="panel">
          <p className="eyebrow">생성 결과</p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="mt-3 text-2xl font-semibold text-white">지금 생성된 추천 번호</h2>
              <p className="mt-2 text-sm text-slate-400">
                생성한 번호는 번호 통계와 연결되고, 공개 생성 통계에도 익명으로 반영됩니다.
              </p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-400">
              {sets.length} set
            </span>
          </div>

          {targetRound ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              현재 생성 결과는 <strong>{targetRound}회</strong> 대상 번호로 기록됩니다.
            </div>
          ) : null}

          {recordStatus !== "idle" ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              {recordStatus === "recording" && "생성 통계에 반영 중입니다."}
              {recordStatus === "recorded" && "생성 통계에 반영됐습니다."}
              {recordStatus === "failed" && "번호는 생성됐지만 생성 통계 기록에는 실패했습니다."}
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {sets.map((set) => (
              <article key={set.id} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                <ShareCard id={`share-card-${set.id}`} set={set} targetRound={targetRound} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-teal">
                    {set.strategy}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{new Date(set.generatedAt).toLocaleString("ko-KR")}</span>
                    <button
                      type="button"
                      onClick={() => void shareSet(set)}
                      disabled={sharingId === set.id}
                      className="whitespace-nowrap rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs uppercase tracking-widest text-teal-300 transition hover:bg-teal-500/20 disabled:opacity-50"
                    >
                      {sharingId === set.id ? "캡처 중..." : "이미지 배포"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void copySet(set)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
                    >
                      {copiedId === set.id ? "복사 완료" : "복사"}
                    </button>
                    <button
                      type="button"
                      onClick={() => saveSet(set)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
                    >
                      {savedId === set.id ? "저장 완료" : "저장"}
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <NumberSet numbers={set.numbers} bonus={set.bonus} hrefBuilder={buildStatsHref} />
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-400">{set.reason}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/draws?number=${set.numbers[0]}`}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
                  >
                    관련 회차 보기
                  </Link>
                  <Link
                    href={`/stats/numbers/${set.numbers[0]}`}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
                  >
                    번호 통계 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {!error && sets.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              아직 생성된 결과가 없습니다. 전략을 선택하고 번호를 생성해보세요.
            </div>
          ) : null}
        </section>

        <section className="panel">
          <p className="eyebrow">임시 저장</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">다시 보고 싶은 번호</h2>
          <p className="mt-2 text-sm text-slate-400">최근 저장한 번호를 최대 8세트까지 유지합니다.</p>

          <div className="mt-6 space-y-4">
            {savedSets.map((set) => (
              <article key={set.id} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                <ShareCard id={`share-card-${set.id}`} set={set} targetRound={targetRound} />
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-teal">
                    {set.strategy}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void shareSet(set)}
                      disabled={sharingId === set.id}
                      className="hidden sm:inline-block rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-teal-300 transition hover:bg-teal-500/20 disabled:opacity-50"
                    >
                      {sharingId === set.id ? "캡처 중..." : "이미지 배포"}
                    </button>
                  <button
                    type="button"
                    onClick={() => removeSavedSet(set.id)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
                  >
                    삭제
                  </button>
                  </div>
                </div>
                <div className="mt-4">
                  <NumberSet numbers={set.numbers} bonus={set.bonus} hrefBuilder={buildStatsHref} />
                </div>
                <p className="mt-4 text-xs text-slate-500">{new Date(set.generatedAt).toLocaleString("ko-KR")}</p>
              </article>
            ))}

            {savedSets.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
                저장된 번호가 없습니다. 생성 결과에서 저장 버튼을 눌러 보관할 수 있습니다.
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </div>
  );
}
