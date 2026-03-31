import Link from "next/link";

const navigation = [
  { href: "/", label: "홈" },
  { href: "/generate", label: "추천기" },
  { href: "/draws", label: "회차 조회" },
  { href: "/stats", label: "통계" }
];

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-[0.24em] text-mist">
            LOTTO LAB
          </Link>
          <p className="mt-1 text-xs text-slate-500">기존 당첨 데이터 기반 추천</p>
        </div>
        <nav className="flex gap-5 text-sm text-slate-300">
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
