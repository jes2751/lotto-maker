"use client";

import { useTransition } from "react";

import type { Locale, ThemeMode } from "@/lib/preferences";
import { preferenceCookie } from "@/lib/preferences";

type PreferenceControlsProps = {
  locale: Locale;
  theme: ThemeMode;
};

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function PreferenceControls({ locale, theme }: PreferenceControlsProps) {
  const [isPending, startTransition] = useTransition();

  function updateTheme(nextTheme: ThemeMode) {
    setCookie(preferenceCookie.theme, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  function updateLocale(nextLocale: Locale) {
    if (nextLocale === locale) {
      return;
    }

    startTransition(() => {
      setCookie(preferenceCookie.locale, nextLocale);
      document.documentElement.lang = nextLocale === "ko" ? "ko" : "en";
      window.location.reload();
    });
  }

  function pillClass(active: boolean) {
    return active
      ? "rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-slate-950"
      : "rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/30";
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2">
        <button type="button" onClick={() => updateTheme("dark")} className={pillClass(theme === "dark")}>
          Dark
        </button>
        <button type="button" onClick={() => updateTheme("light")} className={pillClass(theme === "light")}>
          Light
        </button>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2">
        <button
          type="button"
          onClick={() => updateLocale("ko")}
          className={pillClass(locale === "ko")}
          disabled={isPending}
        >
          한국어
        </button>
        <button
          type="button"
          onClick={() => updateLocale("en")}
          className={pillClass(locale === "en")}
          disabled={isPending}
        >
          ENG
        </button>
      </div>
    </div>
  );
}
