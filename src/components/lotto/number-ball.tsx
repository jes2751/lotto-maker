interface NumberBallProps {
  value: number;
  bonus?: boolean;
}

function getBallColor(value: number): string {
  if (value <= 10) {
    return "bg-gradient-to-br from-[#ffda7a] to-[#ffb020] text-slate-900 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.2),inset_2px_2px_6px_rgba(255,255,255,0.7)]";
  }

  if (value <= 20) {
    return "bg-gradient-to-br from-[#7dd3fc] to-[#0284c7] text-white shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.2),inset_2px_2px_6px_rgba(255,255,255,0.4)]";
  }

  if (value <= 30) {
    return "bg-gradient-to-br from-[#fca5a5] to-[#e11d48] text-white shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.2),inset_2px_2px_6px_rgba(255,255,255,0.4)]";
  }

  if (value <= 40) {
    return "bg-gradient-to-br from-[#6ee7b7] to-[#059669] text-white shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.2),inset_2px_2px_6px_rgba(255,255,255,0.4)]";
  }

  return "bg-gradient-to-br from-[#c4b5fd] to-[#7c3aed] text-white shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.2),inset_2px_2px_6px_rgba(255,255,255,0.4)]";
}

export function NumberBall({ value, bonus = false }: NumberBallProps) {
  return (
    <span
      className={[
        "inline-flex h-11 w-11 items-center justify-center rounded-full text-[1.1rem] font-bold font-outfit shadow-xl transition-all duration-300 hover:scale-[1.15] hover:-translate-y-1 hover:shadow-2xl hover:z-10 relative",
        getBallColor(value),
        bonus ? "ring-[3px] ring-white/60 ring-offset-2 ring-offset-transparent" : ""
      ].join(" ")}
    >
      {value}
    </span>
  );
}
