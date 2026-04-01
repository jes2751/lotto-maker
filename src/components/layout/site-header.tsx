import Link from "next/link";

import { PreferenceControls } from "@/components/layout/preference-controls";
import type { Locale, ThemeMode } from "@/lib/preferences";
import { siteConfig } from "@/lib/site";

const content = {
  ko: {
    tagline: "과거 당첨 데이터 기반 추천, 회차 조회, 통계를 제공하는 무료 로또 웹 서비스",
    navigation: [
      { href: "/", label: "홈" },
      { href: "/generate", label: "추천기" },
      { href: "/draws", label: "회차 조회" },
      { href: "/stats", label: "통계" },
      { href: "/guides", label: "가이드" }
    ]
  },
  en: {
    tagline: "Free Lotto web service for historical recommendations, draw lookup, and statistics",
    navigation: [
      { href: "/", label: "Home" },
      { href: "/generate", label: "Generator" },
      { href: "/draws", label: "Draws" },
      { href: "/stats", label: "Stats" },
      { href: "/guides", label: "Guides" }
    ]
  }
} as const;

type SiteHeaderProps = {
  locale: Locale;
  theme: ThemeMode;
};

export function SiteHeader({ locale, theme }: SiteHeaderProps) {
  const copy = content[locale];

  return (
    <header className="border-b border-white/10 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-[0.24em] text-mist">
              {siteConfig.logoName}
            </Link>
            <p className="mt-1 text-xs text-slate-500">{copy.tagline}</p>
          </div>
          <PreferenceControls locale={locale} theme={theme} />
        </div>
        <nav className="flex flex-wrap gap-5 text-sm text-slate-300">
          {copy.navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
