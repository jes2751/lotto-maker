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
    <footer className="border-t border-white/10 bg-slate-950/85">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal/80">{content.introLabel}</p>
          <h2 className="mt-3 text-lg font-semibold text-white">{content.introTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{content.introDescription}</p>
          <p className="mt-2 text-sm text-slate-400">{content.introNote}</p>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {content.linkGroups.map((group) => (
              <nav key={group.title}>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{group.title}</p>
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-slate-300 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>{content.bottom}</p>
          <p>{siteConfig.domain}</p>
        </div>
      </div>
    </footer>
  );
}
