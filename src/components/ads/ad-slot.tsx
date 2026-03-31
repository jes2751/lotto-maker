"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  label?: string;
  className?: string;
}

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdSlot({
  slot,
  format = "auto",
  label = "Advertisement",
  className = ""
}: AdSlotProps) {
  const adSlot = slot ?? process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE;

  useEffect(() => {
    if (!clientId || !adSlot) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense script can fail silently in local/dev or blocked environments.
    }
  }, [adSlot]);

  if (!clientId || !adSlot) {
    return (
      <div className={`rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-5 ${className}`}>
        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{label}</p>
        <p className="mt-3 text-sm text-slate-400">광고 슬롯 준비 영역입니다. AdSense 환경변수가 설정되면 실제 광고가 여기에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-[28px] border border-white/10 bg-white/[0.03] p-5 ${className}`}>
      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <ins
        className="adsbygoogle mt-4 block overflow-hidden rounded-2xl bg-slate-950/50"
        style={{ display: "block", minHeight: "120px" }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
