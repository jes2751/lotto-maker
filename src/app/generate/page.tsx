import { GeneratorPanel } from "@/components/lotto/generator-panel";

export default function GeneratePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="panel">
          <p className="eyebrow">Generate</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">데이터 기반 번호 추천기</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            v1에서는 과거 당첨 데이터를 바탕으로 <code>mixed</code>, <code>frequency</code>, <code>random</code>
            전략을 제공합니다. 결과는 참고용이며 당첨을 보장하지 않습니다.
          </p>
        </div>
        <div className="panel">
          <p className="eyebrow">Guide</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <li>기본 전략은 <code>mixed</code>이며, 과거 데이터 흐름과 무작위 요소를 함께 반영합니다.</li>
            <li>한 번에 1세트부터 5세트까지 생성할 수 있습니다.</li>
            <li>결과 카드에서 번호를 누르면 상세 통계로 이동할 수 있고, 광고가 설정되더라도 이 흐름을 가리거나 클릭을 유도하는 위치에는 배치하지 않습니다.</li>
          </ul>
        </div>
      </section>

      <GeneratorPanel />
    </div>
  );
}
