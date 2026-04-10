"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ShareCard } from "@/components/lotto/share-card";

import { NumberSet } from "@/components/lotto/number-set";
import { getAnonymousId, recordGeneratedSets } from "@/lib/generated-stats/client";
import type {
  GeneratedSet,
  GenerationFilters,
  GenerationStrategy,
  OddEvenFilter
} from "@/types/lotto";

const STORAGE_KEY = "lotto-lab-saved-sets";

const strategies: Array<{
  value: GenerationStrategy;
  label: string;
  tone: string;
  flavor: string;
  cue: string;
  description: string;
  accent: string;
  selectedAccent: string;
  signal: string[];
}> = [
  {
    value: "mixed",
    label: "혼합 추천",
    tone: "빠른 기본값",
    flavor: "START",
    cue: "처음 한 번 눌러보기 좋은 균형형",
    description: "전체 빈도와 최근 흐름을 함께 참고해 균형 있게 번호를 만듭니다."
,
    accent: "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(15,23,42,0.92)_100%)]",
    selectedAccent: "border-accent bg-[linear-gradient(180deg,rgba(255,143,0,0.22)_0%,rgba(255,143,0,0.06)_100%)] shadow-[0_18px_38px_rgba(255,143,0,0.12)]",
    signal: ["바로 시작", "균형형", "기본 추천"]
  },
  {
    value: "frequency",
    label: "빈도 추천",
    tone: "통계 몰입형",
    flavor: "DATA",
    cue: "자주 나온 흐름을 더 세게 반영",
    description: "과거 당첨 데이터에서 자주 나온 번호 흐름을 더 강하게 반영합니다.",
    accent: "border-teal/20 bg-[linear-gradient(180deg,rgba(45,212,191,0.10)_0%,rgba(15,23,42,0.92)_100%)]",
    selectedAccent: "border-teal bg-[linear-gradient(180deg,rgba(45,212,191,0.22)_0%,rgba(45,212,191,0.05)_100%)] shadow-[0_18px_38px_rgba(45,212,191,0.12)]",
    signal: ["공식 기준", "자주 나온 번호", "통계 우선"]
  },
  {
    value: "random",
    label: "랜덤 추천",
    tone: "가볍게 시작",
    flavor: "QUICK",
    cue: "생각 없이 눌러도 되는 즉시형",
    description: "1부터 45까지 중복 없이 무작위로 번호를 생성합니다.",
    accent: "border-sky-400/20 bg-[linear-gradient(180deg,rgba(56,189,248,0.10)_0%,rgba(15,23,42,0.92)_100%)]",
    selectedAccent: "border-sky-400 bg-[linear-gradient(180deg,rgba(56,189,248,0.22)_0%,rgba(56,189,248,0.05)_100%)] shadow-[0_18px_38px_rgba(56,189,248,0.12)]",
    signal: ["즉시 생성", "생각 없이", "빠른 스타트"]
  },
  {
    value: "filter",
    label: "필터 추천",
    tone: "직접 설계",
    flavor: "CRAFT",
    cue: "조건을 걸고 맞춤형으로 조정",
    description: "고정수, 제외수, 홀짝, 합계, 연속번호 조건을 넣어 맞춤형으로 생성합니다.",
    accent: "border-fuchsia-400/20 bg-[linear-gradient(180deg,rgba(217,70,239,0.10)_0%,rgba(15,23,42,0.92)_100%)]",
    selectedAccent: "border-fuchsia-400 bg-[linear-gradient(180deg,rgba(217,70,239,0.22)_0%,rgba(217,70,239,0.05)_100%)] shadow-[0_18px_38px_rgba(217,70,239,0.12)]",
    signal: ["조건 직접 설정", "덜 겹치게 설계", "맞춤형"]
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
    const anonymousId = getAnonymousId();

    try {
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy,
          count,
          anonymous_id: anonymousId,
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
      const recordedByApi = payload.data.statsRecorded === true;
      const effectiveTargetRound =
        typeof payload.data.targetRound === "number" ? (payload.data.targetRound as number) : targetRound;
      setSets(nextSets);
      setCopiedId(null);
      setSavedId(null);

      if (recordedByApi) {
        setRecordStatus("recorded");
      } else {
        setRecordStatus("recording");

        void recordGeneratedSets({
          strategy,
          sets: nextSets,
          filters,
          targetRound: effectiveTargetRound
        })
          .then(() => setRecordStatus("recorded"))
          .catch(() => setRecordStatus("failed"));
      }
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
      const { toBlob } = await import("html-to-image");
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
            <p className="eyebrow">전략 무대</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">오늘 어떤 방식으로 뽑을지 먼저 고르세요</h2>
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
                "group rounded-[24px] border px-5 py-5 text-left transition duration-300",
                strategy === item.value
                  ? `${item.selectedAccent} text-white`
                  : `${item.accent} text-slate-300 hover:border-white/25 hover:bg-white/[0.07]`
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500 transition group-hover:text-slate-300">
                    {item.flavor}
                  </div>
                  <div className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500 transition group-hover:text-slate-300">
                    {item.tone}
                  </div>
                  <div className="mt-3 font-medium text-[1.1rem]">{item.label}</div>
                </div>
                <span
                  className={[
                    "rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition",
                    strategy === item.value
                      ? "bg-accent text-slate-950"
                      : "border border-white/10 text-slate-500 group-hover:text-slate-300"
                  ].join(" ")}
                >
                  {strategy === item.value ? "현재 선택" : "전략"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.signal.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-slate-300"
                  >
                    {signal}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-sm font-medium text-slate-200">{item.cue}</div>
              <div className="mt-2 text-sm leading-7 text-slate-400">{item.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel hero-panel">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-[0.72rem]">생성 기준</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">이번 회차 기준으로 바로 생성합니다</h3>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
                {strategy === "filter"
                  ? "조건을 다듬은 뒤 생성하고, 결과는 통계와 저장으로 바로 이어집니다."
                  : "지금 전략으로 바로 생성하고, 나온 결과를 공식 흐름과 유저 흐름으로 이어 봅니다."}
              </p>
            </div>
            <span className="status-badge whitespace-nowrap">Ready</span>
          </div>

          <div className="soft-card">
            <div className="grid gap-6 xl:grid-cols-[0.92fr_1.18fr]">
              <div className="space-y-5 text-sm text-slate-300">
                <div>
                  <span className="eyebrow text-[0.72rem]">기준</span>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="kpi-cell">
                      <p className="text-sm text-slate-400">대상 회차</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{targetRound ? `${targetRound}회` : "준비 중"}</p>
                    </div>
                    <div className="kpi-cell">
                      <p className="text-sm text-slate-400">저장 방식</p>
                      <p className="mt-2 text-2xl font-semibold text-white">익명 반영</p>
                    </div>
                  </div>
                </div>

                <label className="block text-sm text-slate-300">
                  <span className="eyebrow text-[0.72rem]">설정</span>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] sm:items-start">
                    <select
                      value={count}
                      onChange={(event) => setCount(Number(event.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-lg font-semibold text-white"
                    >
                      {[1, 2, 3, 4, 5].map((option) => (
                        <option key={option} value={option}>
                          {option}세트
                        </option>
                      ))}
                    </select>
                    <p className="text-xs leading-6 text-slate-500">
                      한 번에 1세트부터 5세트까지 생성합니다.
                    </p>
                  </div>
                </label>
              </div>

              <div className="border-t border-white/8 pt-1 xl:border-t-0 xl:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow text-[0.72rem]">현재 전략</p>
                    <p className="mt-3 text-base font-semibold text-white">{selectedStrategy?.label ?? strategy}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    {selectedStrategy?.flavor ?? "MODE"}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                  {selectedStrategy?.tone ?? "빠른 선택"}
                </p>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-200">
                  {selectedStrategy?.cue ?? "지금 전략의 성격을 먼저 보고 바로 생성합니다."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(selectedStrategy?.signal ?? []).slice(0, 2).map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-slate-300"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      추천 포인트
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      {selectedStrategy?.signal?.[0] ?? "바로 생성"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      읽는 방식
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      {selectedStrategy?.signal?.[1] ?? "공식 기준 비교"}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {selectedStrategy?.description ?? "현재 전략 설명이 준비되지 않았습니다."}
                </p>
              </div>
            </div>
          </div>

          {strategy === "filter" ? (
            <div className="space-y-4">
              <div className="soft-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="eyebrow text-[0.72rem]">현재 필터 요약</p>
                  <p className="text-xs text-slate-500">
                    고정수 {fixedNumbers.length}개 / 제외수 {excludedNumbers.length}개
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{filterSummary}</p>
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

              <label className="soft-card flex items-center gap-3 text-sm text-slate-300">
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

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="signal-row lg:flex-1">
              <span className="signal-row-dot" />
              <span>
                {targetRound
                  ? `${targetRound}회 대상 번호로 기록되며, 생성 결과는 공개 생성 통계에도 익명으로 반영됩니다.`
                  : "다음 회차 기준을 계산한 뒤 생성 결과를 기록합니다."}
              </span>
            </div>

            <button
              type="button"
              onClick={() => void generate()}
              className="cta-button h-14 w-full text-base lg:w-[18rem]"
              disabled={loading}
            >
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
            <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
              현재 생성 결과는 <strong>{targetRound}회</strong> 대상 번호로 기록됩니다.
            </div>
          ) : null}

          {recordStatus !== "idle" ? (
            <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
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
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-slate-950/40 px-6 py-7">
              <p className="text-base font-semibold text-white">아직 생성된 결과가 없습니다.</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                위에서 전략을 선택하고 번호를 생성하면, 이 영역에 결과와 저장·공유 동작이 함께 나타납니다.
              </p>
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
              <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 px-6 py-7">
                <p className="text-base font-semibold text-white">저장된 번호가 없습니다.</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  생성 결과에서 저장 버튼을 누르면 자주 다시 보고 싶은 번호를 이곳에 최대 8세트까지 보관할 수
                  있습니다.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </div>
  );
}
