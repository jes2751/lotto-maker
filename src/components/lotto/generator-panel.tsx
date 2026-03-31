"use client";

import { useEffect, useState } from "react";

import { NumberSet } from "@/components/lotto/number-set";
import type { GeneratedSet, GenerationStrategy } from "@/types/lotto";

const STORAGE_KEY = "lotto-lab-saved-sets";

const strategies: Array<{ value: GenerationStrategy; label: string; description: string }> = [
  { value: "mixed", label: "혼합형 추천", description: "기존 당첨 데이터 흐름에 무작위 요소를 섞어 기본 추천으로 제공합니다." },
  { value: "frequency", label: "빈도형 추천", description: "기존 당첨 데이터에서 자주 나온 번호에 비중을 둡니다." },
  { value: "random", label: "랜덤 비교", description: "데이터 기반 추천과 비교하기 위한 완전 랜덤 옵션입니다." }
];

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

export function GeneratorPanel() {
  const [strategy, setStrategy] = useState<GenerationStrategy>("mixed");
  const [count, setCount] = useState(2);
  const [includeBonus, setIncludeBonus] = useState(true);
  const [sets, setSets] = useState<GeneratedSet[]>([]);
  const [savedSets, setSavedSets] = useState<GeneratedSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

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
          include_bonus: includeBonus
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
    <div className="grid gap-8 xl:grid-cols-[0.95fr_1.1fr_0.95fr]">
      <section className="panel">
        <p className="eyebrow">Generator</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">지난 당첨 흐름을 참고해 바로 추천</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          전략을 고르고 세트 수를 정하면 바로 추천 결과를 생성합니다. 기본 전략은 `mixed`이며, 필요하면 `frequency` 또는 `random`과 비교할
          수 있습니다.
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

        <button type="button" onClick={() => void generate()} className="cta-button mt-6 w-full" disabled={loading}>
          {loading ? "추천 중..." : "추천 번호 다시 받기"}
        </button>
      </section>

      <section className="panel">
        <p className="eyebrow">Result</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="mt-3 text-2xl font-semibold text-white">이번 추천 조합</h2>
            <p className="mt-2 text-sm text-slate-400">마지막 결과는 유지하고, 새 요청이 성공하면 목록을 교체합니다.</p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-400">
            {sets.length} set
          </span>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-4 text-sm text-rose-200">
            {error}
          </div>
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
                <NumberSet numbers={set.numbers} bonus={set.bonus} />
              </div>
              <p className="mt-4 text-sm text-slate-400">{set.reason}</p>
            </article>
          ))}
          {!error && sets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              아직 생성된 추천 조합이 없습니다. 전략을 선택하고 추천을 실행해 주세요.
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Saved</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">저장한 추천 조합</h2>
        <p className="mt-2 text-sm text-slate-400">브라우저에 최근 저장한 추천 조합을 최대 8개까지 유지합니다.</p>
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
                <NumberSet numbers={set.numbers} bonus={set.bonus} />
              </div>
              <p className="mt-4 text-xs text-slate-500">{new Date(set.generatedAt).toLocaleString("ko-KR")}</p>
            </article>
          ))}
          {savedSets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              저장한 추천 조합이 없습니다. 결과 카드에서 `저장`을 눌러 나중에 다시 확인할 수 있습니다.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
