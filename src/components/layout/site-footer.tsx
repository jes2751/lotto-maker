import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p>LOTTO LAB은 과거 당첨 데이터를 참고한 번호 추천, 회차 조회, 통계를 제공하는 무료 웹 서비스입니다.</p>
          <p>광고는 콘텐츠와 명확히 구분해서 표시하며, 광고 클릭을 유도하거나 핵심 사용 흐름을 막지 않습니다.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/policies/ads" className="transition hover:text-white">
            광고 안내
          </Link>
          <Link href="/draws" className="transition hover:text-white">
            회차 조회
          </Link>
          <Link href="/stats" className="transition hover:text-white">
            통계 보기
          </Link>
        </div>
      </div>
    </footer>
  );
}
