interface NumberBallProps {
  value: number;
  bonus?: boolean;
}

function getBallColor(value: number): string {
  if (value <= 10) {
    return "bg-gradient-to-br from-[#f7d372] via-[#e7a62b] to-[#9a5a07] text-slate-950 shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.26),inset_2px_3px_7px_rgba(255,255,255,0.66),0_6px_14px_rgba(154,90,7,0.2)]";
  }

  if (value <= 20) {
    return "bg-gradient-to-br from-[#79c8ef] via-[#2e84bf] to-[#0e4266] text-white shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.35),inset_2px_3px_7px_rgba(255,255,255,0.42),0_6px_14px_rgba(14,66,102,0.22)]";
  }

  if (value <= 30) {
    return "bg-gradient-to-br from-[#e88b98] via-[#b4475d] to-[#6c1d35] text-white shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.34),inset_2px_3px_7px_rgba(255,255,255,0.38),0_6px_14px_rgba(108,29,53,0.2)]";
  }

  if (value <= 40) {
    return "bg-gradient-to-br from-[#7ad3be] via-[#2d9b7d] to-[#0c5a49] text-white shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.34),inset_2px_3px_7px_rgba(255,255,255,0.38),0_6px_14px_rgba(12,90,73,0.22)]";
  }

  return "bg-gradient-to-br from-[#b39ddf] via-[#7553b0] to-[#34225e] text-white shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.34),inset_2px_3px_7px_rgba(255,255,255,0.34),0_6px_14px_rgba(52,34,94,0.22)]";
}

export function NumberBall({ value, bonus = false }: NumberBallProps) {
  return (
    <span
      className={[
        "relative inline-flex h-11 w-11 items-center justify-center rounded-full font-outfit text-[1.1rem] font-bold transition-all duration-300 hover:scale-[1.03] hover:brightness-105",
        getBallColor(value),
        bonus ? "ring-[3px] ring-accent/70 ring-offset-2 ring-offset-transparent" : ""
      ].join(" ")}
    >
      {value}
    </span>
  );
}
