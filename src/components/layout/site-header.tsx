import Link from "next/link";

import { TodayVisitBadge } from "@/components/layout/today-visit-badge";
import { siteConfig } from "@/lib/site";

const navigation = [
  { href: "/", label: "홈" },
  { href: "/guides", label: "가이드" },
  { href: "/generate", label: "번호 생성기" },
  { href: "/check", label: "당첨 확인" },
  { href: "/draws", label: "회차 조회" },
  { href: "/stats", label: "통계" },
  { href: "/generated-stats", label: "생성 통계" }
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.22)]">
      <div className="mx-auto max-w-6xl px-5 py-3 md:px-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-teal/90">Lotto Control Room</p>
              <Link href="/" className="mt-1 block text-[1.45rem] font-semibold tracking-[0.02em] text-mist md:text-[1.9rem]">
              {siteConfig.logoName}
              </Link>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                최신 회차 확인, 번호 생성, 핵심 통계를 가장 빠르게 보는 로또 컨트롤룸.
              </p>
            </div>
            <div className="flex items-center">
              <TodayVisitBadge />
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="nav-pill">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
