"use client";

import { forwardRef } from "react";

import { NumberSet } from "@/components/lotto/number-set";
import type { GeneratedSet } from "@/types/lotto";

interface ShareCardProps {
  id?: string;
  set: GeneratedSet;
  targetRound?: number | null;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ id, set, targetRound }, ref) => {
    return (
      <div
        id={id}
        ref={ref}
        className="fixed left-[-9999px] top-0 flex w-[560px] flex-col overflow-hidden rounded-[2rem] border border-white/10 p-10 shadow-2xl"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(255,143,0,0.18) 0%, transparent 28%), radial-gradient(circle at bottom right, rgba(65,201,192,0.14) 0%, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%), #06101b",
          fontFamily: "\"Outfit\", \"Noto Sans KR\", \"Segoe UI\", sans-serif"
        }}
      >
        <div className="absolute inset-0 rounded-[2rem] border border-white/5" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#41c9c0]">Lotto Control Room</p>
            <span className="mt-2 block text-[1.55rem] font-bold tracking-tight text-white">Lotto Maker Lab</span>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            {targetRound ? `${targetRound}회 대상` : "추천 번호"}
          </span>
        </div>

        <div className="relative z-10 mb-2 mt-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffb020]">{set.strategy} strategy</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-50">
            {targetRound ? `${targetRound}회 컨트롤룸 픽` : "컨트롤룸 추천 조합"}
          </h2>
          <p className="mt-4 max-w-[92%] text-base leading-relaxed text-slate-300">
            {set.reason || "과거 당첨 데이터 기반 추천과 패턴 흐름을 반영한 참고용 번호 조합입니다."}
          </p>
        </div>

        <div className="relative z-10 my-10 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
          <NumberSet numbers={set.numbers} bonus={set.bonus} wrap={true} className="justify-center gap-4" />
        </div>

        <div className="relative z-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.035] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Target</p>
            <p className="mt-2 text-xl font-semibold text-white">{targetRound ? `${targetRound}회` : "-"}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.035] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Strategy</p>
            <p className="mt-2 text-xl font-semibold text-white">{set.strategy}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.035] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Mode</p>
            <p className="mt-2 text-xl font-semibold text-white">참고용</p>
          </div>
        </div>

        <div className="relative z-10 mt-10 flex items-end justify-between border-t border-white/10 pt-6">
          <div className="flex flex-col gap-1.5 text-[0.8rem] text-slate-400">
            <span className="uppercase tracking-[0.18em]">Generated in Control Room</span>
            <span>{new Date(set.generatedAt).toLocaleString("ko-KR")}</span>
          </div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">lotto-maker.cloud</div>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = "ShareCard";
