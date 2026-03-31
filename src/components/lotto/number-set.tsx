import { NumberBall } from "@/components/lotto/number-ball";

interface NumberSetProps {
  numbers: number[];
  bonus?: number;
}

export function NumberSet({ numbers, bonus }: NumberSetProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {numbers.map((number) => (
        <NumberBall key={number} value={number} />
      ))}
      {typeof bonus === "number" ? (
        <>
          <span className="text-sm text-slate-500">BONUS</span>
          <NumberBall value={bonus} bonus />
        </>
      ) : null}
    </div>
  );
}
