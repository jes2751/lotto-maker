import Link from "next/link";

import { NumberBall } from "@/components/lotto/number-ball";

interface NumberSetProps {
  numbers: number[];
  bonus?: number;
  hrefBuilder?: (value: number, isBonus: boolean) => string;
}

export function NumberSet({ numbers, bonus, hrefBuilder }: NumberSetProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {numbers.map((number) => {
        const href = hrefBuilder?.(number, false);

        if (!href) {
          return <NumberBall key={number} value={number} />;
        }

        return (
          <Link
            key={number}
            href={href}
            aria-label={`${number}번 번호 통계로 이동`}
            className="inline-flex rounded-full"
          >
            <NumberBall value={number} />
          </Link>
        );
      })}
      {typeof bonus === "number" ? (
        <>
          <span className="text-sm text-slate-500">BONUS</span>
          {hrefBuilder ? (
            <Link
              href={hrefBuilder(bonus, true)}
              aria-label={`보너스 번호 ${bonus}번 통계로 이동`}
              className="inline-flex rounded-full"
            >
              <NumberBall value={bonus} bonus />
            </Link>
          ) : (
            <NumberBall value={bonus} bonus />
          )}
        </>
      ) : null}
    </div>
  );
}
