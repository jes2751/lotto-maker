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
    <article className="soft-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="secondary-button !px-3 !py-1.5 !text-[0.7rem] !tracking-[0.18em] uppercase"
        >
          {copied ? "복사 완료" : "템플릿 복사"}
        </button>
      </div>
      <pre className="mt-4 whitespace-pre-wrap rounded-[1.4rem] border border-white/10 bg-slate-950/60 p-4 text-sm leading-7 text-slate-300">
        {body}
      </pre>
    </article>
  );
}
