"use client";

import type { ThemeMode } from "@/lib/preferences";
import { preferenceCookie } from "@/lib/preferences";

type PreferenceControlsProps = {
  theme: ThemeMode;
};

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function PreferenceControls({ theme }: PreferenceControlsProps) {
  function updateTheme(nextTheme: ThemeMode) {
    setCookie(preferenceCookie.theme, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  function pillClass(active: boolean) {
    return active
      ? "rounded-full bg-accent px-3 py-2 text-sm font-semibold text-slate-950"
      : "rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-white/30";
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2">
        <button type="button" onClick={() => updateTheme("dark")} className={pillClass(theme === "dark")}>
          다크
        </button>
        <button type="button" onClick={() => updateTheme("light")} className={pillClass(theme === "light")}>
          라이트
        </button>
      </div>
    </div>
  );
}
