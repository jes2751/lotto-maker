import Link from "next/link";

import type { Locale } from "@/lib/preferences";
import { siteConfig } from "@/lib/site";

const content = {
  ko: {
    introLabel: "Lotto Maker Lab",
    introTitle: "로또 결과 확인, 번호 생성, 통계 확인을 빠르게 할 수 있는 서비스",
    introDescription: "최신 당첨번호, 번호 생성기, 통계, 생성 통계를 한곳에서 볼 수 있습니다.",
    introNote: "추천 결과는 참고용이며 당첨을 보장하지 않습니다.",
    linkGroups: [
      {
        title: "서비스",
        links: [
          { href: "/generate", label: "번호 생성기" },
          { href: "/draws", label: "회차 조회" },
          { href: "/stats", label: "통계" },
          { href: "/community", label: "생성 통계" }
        ]
      },
      {
        title: "정책",
        links: [
          { href: "/privacy", label: "개인정보처리방침" },
          { href: "/terms", label: "이용약관" },
          { href: "/faq", label: "FAQ" },
          { href: "/contact", label: "문의 / 운영 안내" },
          { href: "/policies/ads", label: "광고 안내" }
        ]
      }
    ],
    bottom: `© ${new Date().getFullYear()} ${siteConfig.name}.`
  },
  en: {
    introLabel: "Lotto Maker Lab",
    introTitle: "A quick place for latest results, number generation, and statistics",
    introDescription: "Check the latest draw, generate a set, and review public stats in one place.",
    introNote: "Recommendations are for reference only and do not guarantee wins.",
    linkGroups: [
      {
        title: "Service",
        links: [
          { href: "/generate", label: "Generator" },
          { href: "/draws", label: "Draws" },
          { href: "/stats", label: "Statistics" },
          { href: "/community", label: "Generated Stats" }
        ]
      },
      {
        title: "Policy",
        links: [
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
          { href: "/faq", label: "FAQ" },
          { href: "/contact", label: "Contact" },
          { href: "/policies/ads", label: "Ads Policy" }
        ]
      }
    ],
    bottom: `© ${new Date().getFullYear()} ${siteConfig.name}.`
  }
} as const;

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const copy = content[locale];

  return (
    <footer className="border-t border-white/10 bg-slate-950/85">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1.25fr_0.75fr_0.75fr]">
        <section className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal/80">{copy.introLabel}</p>
          <h2 className="mt-3 text-lg font-semibold text-white">{copy.introTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{copy.introDescription}</p>
          <p className="mt-2 text-sm text-slate-400">{copy.introNote}</p>
        </section>

        {copy.linkGroups.map((group) => (
          <nav key={group.title} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{group.title}</p>
            <div className="grid gap-2">
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-slate-300 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>{copy.bottom}</p>
          <p>{siteConfig.domain}</p>
        </div>
      </div>
    </footer>
  );
}
