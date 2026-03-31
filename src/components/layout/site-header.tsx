import Link from "next/link";

const navigation = [
  { href: "/", label: "홈" },
  { href: "/generate", label: "번호 추천" },
  { href: "/draws", label: "회차 조회" },
  { href: "/stats", label: "통계" }
];

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-[0.24em] text-mist">
            LOTTO LAB
          </Link>
          <p className="mt-1 text-xs text-slate-500">과거 당첨 데이터 기반 추천과 통계를 제공하는 무료 로또 웹 서비스</p>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm text-slate-300">
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
