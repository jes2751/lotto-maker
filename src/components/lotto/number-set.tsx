import Link from "next/link";

import { NumberBall } from "@/components/lotto/number-ball";

interface NumberSetProps {
  numbers: number[];
  bonus?: number;
  hrefBuilder?: (value: number, isBonus: boolean) => string;
  className?: string;
  wrap?: boolean;
}

export function NumberSet({
  numbers,
  bonus,
  hrefBuilder,
  className,
  wrap = true
}: NumberSetProps) {
  const wrapClass = wrap ? "flex-wrap" : "flex-nowrap";

  return (
    <div className={`flex items-center gap-3 p-1 sm:p-2 ${wrapClass} ${className ?? ""}`.trim()}>
      {numbers.map((number) => {
        const href = hrefBuilder?.(number, false);

        if (!href) {
          return <NumberBall key={number} value={number} />;
        }

        return (
          <Link
            key={number}
            href={href}
            aria-label={`${number}번 번호 통계 보기`}
            className="inline-flex rounded-full"
          >
            <NumberBall value={number} />
          </Link>
        );
      })}

      {typeof bonus === "number" ? (
        <>
          <span
            aria-hidden="true"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-semibold text-slate-400"
          >
            +
          </span>
          {hrefBuilder ? (
            <Link
              href={hrefBuilder(bonus, true)}
              aria-label={`보너스 번호 ${bonus} 통계 보기`}
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
