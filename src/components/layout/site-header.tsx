import Link from "next/link";

import { siteConfig } from "@/lib/site";

const primaryNavigation = [
  { href: "/check", label: "당첨 확인" },
  { href: "/generate", label: "번호 생성" },
  { href: "/draws", label: "회차 조회" },
  { href: "/stats", label: "과거 1등 데이터" },
  { href: "/generated-stats", label: "우리 유저 데이터" }
] as const;

const utilityNavigation = [
  { href: "/", label: "홈" },
  { href: "/guides", label: "가이드" }
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.22)]">
      <div className="mx-auto max-w-6xl px-5 py-3 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-teal/90">Lotto Control Room</p>
                <span className="hidden sm:inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Generate • Check • Analyze
                </span>
              </div>
              <Link
                href="/"
                className="mt-2 block text-[1.45rem] font-semibold tracking-[0.02em] text-mist md:text-[1.9rem]"
              >
                {siteConfig.logoName}
              </Link>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                최신 회차를 확인하고, 공식 당첨 흐름과 유저 군중 흐름을 같이 보며 더 덜 겹치는 선택까지 생각하는 로또 플레이보드.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/generate" className="secondary-button">
                지금 생성
              </Link>
              <div className="hidden sm:flex flex-wrap items-center gap-2">
                {utilityNavigation.map((item) => (
                  <Link key={item.href} href={item.href} className="utility-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2.5">
            {primaryNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="nav-pill nav-pill-primary">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
