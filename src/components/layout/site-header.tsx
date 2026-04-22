"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/lib/site";

const primaryNavigation = [
  { href: "/generate", label: "생성기" },
  { href: "/check", label: "당첨 확인" },
  { href: "/draws", label: "회차" },
  { href: "/stats", label: "공식 통계" },
  { href: "/generated-stats", label: "유저 통계" },
  { href: "/guides", label: "가이드" }
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.22)]">
      <div className="mx-auto max-w-6xl px-5 py-3 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-teal/90 md:text-[0.72rem] md:tracking-[0.18em]">
                로또 통계 플레이보드
              </p>
              <span className="hidden md:inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-semibold tracking-[0.08em] text-slate-300">
                번호 생성 · 당첨 확인 · 통계 비교
              </span>
            </div>
            <Link
              href="/"
              className="mt-2 block text-[1.25rem] font-semibold tracking-[0.02em] text-mist sm:text-[1.35rem] md:text-[1.9rem]"
            >
              {siteConfig.logoName}
            </Link>
            <p className="mt-1 hidden max-w-4xl text-sm leading-6 text-slate-400 sm:block">
              최신 로또 당첨번호 확인, 번호 생성, 공식 통계와 사람들 선택 비교를 한 곳에서 보는 로또 서비스.
            </p>
          </div>

          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
            {primaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={
                  isActive(item.href)
                    ? "nav-pill nav-pill-primary nav-pill-active whitespace-nowrap px-4"
                    : "nav-pill nav-pill-primary whitespace-nowrap px-4"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
