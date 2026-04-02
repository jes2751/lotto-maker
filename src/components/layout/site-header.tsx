import Link from "next/link";

import { PreferenceControls } from "@/components/layout/preference-controls";
import { TodayVisitBadge } from "@/components/layout/today-visit-badge";
import type { ThemeMode } from "@/lib/preferences";
import { siteConfig } from "@/lib/site";

const navigation = [
  { href: "/", label: "홈" },
  { href: "/guides", label: "가이드" },
  { href: "/generate", label: "번호 생성기" },
  { href: "/draws", label: "회차 조회" },
  { href: "/stats", label: "통계" },
  { href: "/generated-stats", label: "생성 통계" }
] as const;

type SiteHeaderProps = {
  theme: ThemeMode;
};

export function SiteHeader({ theme }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-500 [box-shadow:inset_0_-1px_0_rgba(255,255,255,0.05)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <Link href="/" className="text-[2rem] font-semibold tracking-[0.03em] text-mist md:text-[2.4rem]">
              {siteConfig.logoName}
            </Link>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300 md:text-[0.95rem]">
              과거 당첨 데이터 기반 추천, 회차 조회, 통계, 생성 통계를 한 곳에서 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <PreferenceControls theme={theme} />
            <TodayVisitBadge />
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-7 gap-y-2 text-lg font-medium text-slate-300">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
