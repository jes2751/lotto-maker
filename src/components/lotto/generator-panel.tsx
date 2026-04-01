"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { NumberSet } from "@/components/lotto/number-set";
import type { GeneratedSet, GenerationStrategy, OddEvenFilter } from "@/types/lotto";

const STORAGE_KEY = "lotto-lab-saved-sets";

const strategies: Array<{ value: GenerationStrategy; label: string; description: string }> = [
  {
    value: "mixed",
    label: "혼합형 추천",
    description: "과거 당첨 데이터의 빈도와 무작위 요소를 함께 반영하는 기본 추천 전략입니다."
  },
  {
    value: "frequency",
    label: "빈도형 추천",
    description: "과거 당첨 데이터에서 자주 나온 번호에 더 높은 비중을 두는 전략입니다."
  },
  {
    value: "random",
    label: "랜덤 비교",
    description: "데이터 기반 전략과 비교할 수 있도록 완전 랜덤 조합도 제공합니다."
  },
  {
    value: "filter",
    label: "필터 추첨기",
    description: "고정수, 제외수, 홀짝, 합계, 연속번호 조건을 반영해 조건형 조합을 생성합니다."
  }
];

const oddEvenOptions: Array<{ value: OddEvenFilter; label: string }> = [
  { value: "any", label: "제한 없음" },
  { value: "balanced", label: "홀짝 균형(3:3)" },
  { value: "odd-heavy", label: "홀수 우세" },
  { value: "even-heavy", label: "짝수 우세" }
];

function parseNumberInput(value: string) {
  return [...new Set(value
    .split(/[,\s]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item >= 1 && item <= 45))].sort((left, right) => left - right);
}

function formatCopyText(set: GeneratedSet) {
  const numbers = set.numbers.join(", ");
  const bonus = typeof set.bonus === "number" ? ` | 보너스 ${set.bonus}` : "";
  return `${set.strategy}: ${numbers}${bonus}`;
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

export function GeneratorPanel() {
  const [strategy, setStrategy] = useState<GenerationStrategy>("mixed");
  const [count, setCount] = useState(2);
  const [includeBonus, setIncludeBonus] = useState(true);
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

  const fixedNumbers = useMemo(() => parseNumberInput(fixedNumbersInput), [fixedNumbersInput]);
  const excludedNumbers = useMemo(() => parseNumberInput(excludedNumbersInput), [excludedNumbersInput]);

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

    return parts.length > 0 ? parts.join(" / ") : "선택한 필터 없음";
  }, [allowConsecutive, excludedNumbers, fixedNumbers, oddEven, sumMax, sumMin]);

  async function generate() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          strategy,
          count,
          include_bonus: includeBonus,
          filters: {
            fixed_numbers: fixedNumbers,
            excluded_numbers: excludedNumbers,
            odd_even: oddEven,
            sum_min: sumMin ? Number(sumMin) : null,
            sum_max: sumMax ? Number(sumMax) : null,
            allow_consecutive: allowConsecutive
          }
        })
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message ?? "번호를 생성하지 못했습니다.");
      }

      setSets(payload.data.sets);
      setCopiedId(null);
      setSavedId(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "알 수 없는 오류가 발생했습니다.");
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
      setTimeout(() => setCopiedId((current) => (current === set.id ? null : current)), 1600);
    } catch {
      setError("추천 조합을 복사하지 못했습니다.");
    }
  }

  function saveSet(set: GeneratedSet) {
    const nextSavedSets = [set, ...savedSets.filter((item) => item.id !== set.id)].slice(0, 8);
    setSavedSets(nextSavedSets);
    persistSavedSets(nextSavedSets);
    setSavedId(set.id);
    setTimeout(() => setSavedId((current) => (current === set.id ? null : current)), 1600);
  }

  function removeSavedSet(id: string) {
    const nextSavedSets = savedSets.filter((item) => item.id !== id);
    setSavedSets(nextSavedSets);
    persistSavedSets(nextSavedSets);
  }

  useEffect(() => {
    setSavedSets(loadSavedSets());
    void generate();
  }, []);

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_1.1fr_0.95fr]">
      <section className="panel">
        <p className="eyebrow">추천 설정</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">조건을 정하고 추천 조합 만들기</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          기본 전략으로 바로 추천을 받을 수 있고, 필터 추첨기를 선택하면 고정수, 제외수, 홀짝, 합계, 연속번호 조건을 함께 적용할 수 있습니다.
        </p>

        <div className="mt-6 space-y-4">
          {strategies.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setStrategy(item.value)}
              className={[
                "w-full rounded-2xl border px-4 py-4 text-left transition",
                strategy === item.value
                  ? "border-accent bg-accent/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
              ].join(" ")}
            >
              <div className="font-medium">{item.label}</div>
              <div className="mt-1 text-sm text-slate-400">{item.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <label className="space-y-2 text-sm text-slate-300">
            <span>세트 수</span>
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

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={includeBonus}
              onChange={(event) => setIncludeBonus(event.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            보너스 번호 포함
          </label>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-white">필터 조건 요약</p>
            <p className="text-xs text-slate-500">
              고정수 {fixedNumbers.length}개 / 제외수 {excludedNumbers.length}개
            </p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-400">{filterSummary}</p>
        </div>

        <div className="mt-6 space-y-4">
          <label className="space-y-2 text-sm text-slate-300">
            <span>고정수 입력</span>
            <input
              value={fixedNumbersInput}
              onChange={(event) => setFixedNumbersInput(event.target.value)}
              placeholder="예: 3, 11, 27"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white placeholder:text-slate-500"
            />
            <p className="text-xs text-slate-500">쉼표 또는 공백으로 구분, 최대 5개</p>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>제외수 입력</span>
            <input
              value={excludedNumbersInput}
              onChange={(event) => setExcludedNumbersInput(event.target.value)}
              placeholder="예: 1, 2, 45"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white placeholder:text-slate-500"
            />
            <p className="text-xs text-slate-500">쉼표 또는 공백으로 구분, 최대 35개</p>
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

        <button type="button" onClick={() => void generate()} className="cta-button mt-6 w-full" disabled={loading}>
          {loading ? "추천 생성 중..." : "추천 번호 생성"}
        </button>
      </section>

      <section className="panel">
        <p className="eyebrow">생성 결과</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="mt-3 text-2xl font-semibold text-white">이번 추천 조합</h2>
            <p className="mt-2 text-sm text-slate-400">
              마지막 생성 결과를 유지합니다. 번호를 누르면 상세 통계로 이동할 수 있습니다.
            </p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-400">
            {sets.length} set
          </span>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-4 text-sm text-rose-200">{error}</div>
        ) : null}

        <div className="mt-6 space-y-4">
          {sets.map((set) => (
            <article key={set.id} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-teal">
                  {set.strategy}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{new Date(set.generatedAt).toLocaleString("ko-KR")}</span>
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
                <NumberSet numbers={set.numbers} bonus={set.bonus} hrefBuilder={(value) => buildStatsHref(value)} />
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">{set.reason}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/draws?number=${set.numbers[0]}`} className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30">
                  첫 번호 회차 보기
                </Link>
                <Link href={`/stats/numbers/${set.numbers[0]}`} className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30">
                  첫 번호 통계 보기
                </Link>
              </div>
            </article>
          ))}
          {!error && sets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              아직 생성된 추천 조합이 없습니다. 조건을 정한 뒤 추천을 실행해 주세요.
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">저장한 조합</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">브라우저에 저장한 추천 결과</h2>
        <p className="mt-2 text-sm text-slate-400">최근 저장한 추천 조합을 최대 8개까지 유지합니다.</p>
        <div className="mt-6 space-y-4">
          {savedSets.map((set) => (
            <article key={set.id} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-teal">
                  {set.strategy}
                </span>
                <button
                  type="button"
                  onClick={() => removeSavedSet(set.id)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
                >
                  삭제
                </button>
              </div>
              <div className="mt-4">
                <NumberSet numbers={set.numbers} bonus={set.bonus} hrefBuilder={(value) => buildStatsHref(value)} />
              </div>
              <p className="mt-4 text-xs text-slate-500">{new Date(set.generatedAt).toLocaleString("ko-KR")}</p>
            </article>
          ))}
          {savedSets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              저장한 추천 조합이 없습니다. 결과 카드에서 저장 버튼을 누르면 다시 확인할 수 있습니다.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
