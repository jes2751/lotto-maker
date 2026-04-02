"use client";

import { useState } from "react";

type ShareTemplateCardProps = {
  title: string;
  description: string;
  body: string;
};

export function ShareTemplateCard({ title, description, body }: ShareTemplateCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
        >
          {copied ? "복사 완료" : "템플릿 복사"}
        </button>
      </div>
      <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-300">
        {body}
      </pre>
    </article>
  );
}
