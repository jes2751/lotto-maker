interface NumberBallProps {
  value: number;
  bonus?: boolean;
}

function getBallColor(value: number): string {
  if (value <= 10) {
    return "bg-amber-400 text-slate-950";
  }

  if (value <= 20) {
    return "bg-sky-400 text-slate-950";
  }

  if (value <= 30) {
    return "bg-rose-400 text-slate-950";
  }

  if (value <= 40) {
    return "bg-emerald-400 text-slate-950";
  }

  return "bg-violet-400 text-slate-950";
}

export function NumberBall({ value, bonus = false }: NumberBallProps) {
  return (
    <span
      className={[
        "inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold shadow-lg shadow-black/20",
        getBallColor(value),
        bonus ? "ring-2 ring-white/60" : ""
      ].join(" ")}
    >
      {value}
    </span>
  );
}
