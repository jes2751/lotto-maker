import { GeneratorPanel } from "@/components/lotto/generator-panel";

export default function GeneratePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="eyebrow">Generate</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">데이터 기반 번호 추천기</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          v1에서는 과거 당첨 데이터 기반의 `mixed`, `frequency` 추천과 비교용 `random` 전략을 지원합니다.
          결과는 참고용이며 적중을 보장하지 않습니다.
        </p>
      </div>
      <GeneratorPanel />
    </div>
  );
}
