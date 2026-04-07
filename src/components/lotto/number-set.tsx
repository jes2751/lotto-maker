import Link from "next/link";

import { NumberBall } from "@/components/lotto/number-ball";

interface NumberSetProps {
  numbers: number[];
  bonus?: number;
  hrefBuilder?: (value: number, isBonus: boolean) => string;
  className?: string;
  wrap?: boolean;
  compact?: boolean;
}

export function NumberSet({
  numbers,
  bonus,
  hrefBuilder,
  className,
  wrap = true,
  compact = false
}: NumberSetProps) {
  const wrapClass = wrap ? "flex-wrap" : "flex-nowrap";
  const gapClass = compact ? "gap-2 p-0.5 sm:gap-2.5 sm:p-1" : "gap-3 p-1 sm:p-2";
  const plusClass = compact
    ? "h-9 w-9 text-base"
    : "h-10 w-10 text-lg";

  return (
    <div className={`flex items-center ${gapClass} ${wrapClass} ${className ?? ""}`.trim()}>
      {numbers.map((number) => {
        const href = hrefBuilder?.(number, false);

        if (!href) {
          return <NumberBall key={number} value={number} size={compact ? "compact" : "default"} />;
        }

        return (
          <Link
            key={number}
            href={href}
            aria-label={`${number}번 번호 통계 보기`}
            className="inline-flex rounded-full"
          >
            <NumberBall value={number} size={compact ? "compact" : "default"} />
          </Link>
        );
      })}

      {typeof bonus === "number" ? (
        <>
          <span
            aria-hidden="true"
            className={`inline-flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 font-semibold text-slate-400 ${plusClass}`}
          >
            +
          </span>
          {hrefBuilder ? (
            <Link
              href={hrefBuilder(bonus, true)}
              aria-label={`보너스 번호 ${bonus} 통계 보기`}
              className="inline-flex rounded-full"
            >
              <NumberBall value={bonus} bonus size={compact ? "compact" : "default"} />
            </Link>
          ) : (
            <NumberBall value={bonus} bonus size={compact ? "compact" : "default"} />
          )}
        </>
      ) : null}
    </div>
  );
}
