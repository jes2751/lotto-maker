import Link from "next/link";

import { siteConfig } from "@/lib/site";

const content = {
  introLabel: "Lotto Maker Lab",
  introTitle: "로또 결과 확인, 번호 생성, 통계를 한 곳에서 빠르게 볼 수 있습니다.",
  introDescription:
    "최신 당첨번호, 번호 생성기, 통계, 생성 통계를 한국어 기준으로 간단하게 정리한 Lotto Maker Lab입니다.",
  introNote: "추천 결과는 참고용이며 당첨을 보장하지 않습니다.",
  linkGroups: [
    {
      title: "서비스",
      links: [
        { href: "/generate", label: "번호 생성기" },
        { href: "/draws", label: "회차 조회" },
        { href: "/stats", label: "통계" },
        { href: "/generated-stats", label: "생성 통계" },
        { href: "/lotto-buy-guide", label: "온라인 구매 안내" }
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
} as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-16 pt-10">
      <div className="mx-auto max-w-6xl px-6 pb-10">
        <div className="panel grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <section className="max-w-lg">
            <p className="font-outfit text-[0.78rem] font-bold uppercase tracking-[0.2em] text-teal/85">
              {content.introLabel}
            </p>
            <h2 className="mt-3 max-w-md text-xl font-bold leading-snug text-white">{content.introTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{content.introDescription}</p>
            <p className="mt-4 text-sm text-slate-400">{content.introNote}</p>
          </section>

          {content.linkGroups.map((group) => (
            <nav key={group.title} className="md:ml-auto">
              <p className="text-sm font-bold text-white">{group.title}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-300 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 bg-ink/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>{content.bottom}</p>
          <p className="font-outfit font-medium tracking-[0.16em] text-slate-300">{siteConfig.domain}</p>
        </div>
      </div>
    </footer>
  );
}
