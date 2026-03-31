import { GeneratorPanel } from "@/components/lotto/generator-panel";

export default function GeneratePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="panel">
          <p className="eyebrow">Generate</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">데이터 기반 번호 추천기</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            v1에서는 과거 당첨 데이터 기반의 `mixed`, `frequency` 추천과 비교용 `random` 전략을 지원합니다. 결과는 참고용이며 적중을
            보장하지 않습니다.
          </p>
        </div>
        <div className="panel">
          <p className="eyebrow">Guide</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <li>기본 전략은 `mixed`이며 빈도 흐름과 랜덤 요소를 함께 반영합니다.</li>
            <li>세트 수는 한 번에 1개부터 5개까지 생성할 수 있습니다.</li>
            <li>보너스 번호 포함 여부를 선택해 비교용 조합을 바로 확인할 수 있습니다.</li>
          </ul>
        </div>
      </section>
      <GeneratorPanel />
    </div>
  );
}
