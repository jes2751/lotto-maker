"use client";

import { useEffect, useState } from "react";

import { NumberSet } from "@/components/lotto/number-set";
import type { GeneratedSet, GenerationStrategy } from "@/types/lotto";

const strategies: Array<{ value: GenerationStrategy; label: string; description: string }> = [
  { value: "mixed", label: "혼합형", description: "빈도 가중치와 랜덤을 절반씩 섞습니다." },
  { value: "frequency", label: "빈도형", description: "자주 나온 번호에 비중을 둡니다." },
  { value: "random", label: "랜덤형", description: "가중치 없이 완전 랜덤으로 생성합니다." }
];

export function GeneratorPanel() {
  const [strategy, setStrategy] = useState<GenerationStrategy>("mixed");
  const [count, setCount] = useState(2);
  const [includeBonus, setIncludeBonus] = useState(true);
  const [sets, setSets] = useState<GeneratedSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void generate();
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
      <section className="panel">
        <p className="eyebrow">Generator</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">전략을 고르고 바로 생성</h2>
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
          {loading ? "생성 중..." : "번호 다시 생성"}
        </button>
      </section>

      <section className="panel">
        <p className="eyebrow">Result</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">이번 조합</h2>
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
                <span className="text-xs text-slate-500">{new Date(set.generatedAt).toLocaleString("ko-KR")}</span>
              </div>
              <div className="mt-4">
                <NumberSet numbers={set.numbers} bonus={set.bonus} />
              </div>
              <p className="mt-4 text-sm text-slate-400">{set.reason}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
