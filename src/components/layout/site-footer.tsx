import Link from "next/link";

import type { Locale } from "@/lib/preferences";
import { siteConfig } from "@/lib/site";

const content = {
  ko: {
    description: `${siteConfig.name}은 과거 당첨 데이터 기반 추천, 회차 조회, 통계, 생성 통계를 제공하는 무료 로또 웹 서비스입니다.`,
    note: "추천 결과는 참고용이며 당첨을 보장하지 않습니다. 광고는 Google AdSense 설정 전까지 노출되지 않습니다.",
    links: [
      { href: "/community", label: "생성 통계" },
      { href: "/privacy", label: "개인정보처리방침" },
      { href: "/terms", label: "이용약관" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "문의 / 운영 안내" },
      { href: "/policies/ads", label: "광고 안내" }
    ]
  },
  en: {
    description: `${siteConfig.name} is a free Lotto web service built around historical recommendations, draw lookup, statistics, and generated stats.`,
    note: "Recommendations are for reference only and do not guarantee wins. Ads remain hidden until Google AdSense is configured.",
    links: [
      { href: "/community", label: "Generated Stats" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/policies/ads", label: "Ads Policy" }
    ]
  }
} as const;

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const copy = content[locale];

  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p>{copy.description}</p>
          <p>{copy.note}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {copy.links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
