export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>과거 당첨 흐름을 참고하는 데이터 기반 추천 서비스</p>
        <p>v1은 정적 시드 데이터와 주간 동기화 초안 기준으로 동작합니다.</p>
      </div>
    </footer>
  );
}
