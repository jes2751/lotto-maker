interface NumberBallProps {
  value: number;
  bonus?: boolean;
}

function getBallColor(value: number): string {
  if (value <= 10) {
    return "bg-gradient-to-br from-[#fcd34d] to-[#d97706] text-slate-950 shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.3),inset_2px_4px_8px_rgba(255,255,255,0.8),0_4px_12px_rgba(217,119,6,0.3)]";
  }

  if (value <= 20) {
    return "bg-gradient-to-br from-[#38bdf8] to-[#0369a1] text-white shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.4),inset_2px_4px_8px_rgba(255,255,255,0.6),0_4px_12px_rgba(3,105,161,0.3)]";
  }

  if (value <= 30) {
    return "bg-gradient-to-br from-[#fb7185] to-[#be123c] text-white shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.4),inset_2px_4px_8px_rgba(255,255,255,0.6),0_4px_12px_rgba(190,18,60,0.3)]";
  }

  if (value <= 40) {
    return "bg-gradient-to-br from-[#34d399] to-[#047857] text-white shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.4),inset_2px_4px_8px_rgba(255,255,255,0.6),0_4px_12px_rgba(4,120,87,0.3)]";
  }

  return "bg-gradient-to-br from-[#a78bfa] to-[#5b21b6] text-white shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.4),inset_2px_4px_8px_rgba(255,255,255,0.6),0_4px_12px_rgba(91,33,182,0.3)]";
}

export function NumberBall({ value, bonus = false }: NumberBallProps) {
  return (
    <span
      className={[
        "inline-flex h-11 w-11 items-center justify-center rounded-full text-[1.1rem] font-bold font-outfit transition-all duration-300 hover:brightness-110 relative",
        getBallColor(value),
        bonus ? "ring-[3px] ring-white/60 ring-offset-2 ring-offset-transparent" : ""
      ].join(" ")}
    >
      {value}
    </span>
  );
}
