import { ImageResponse } from "next/og";

import { drawRepository } from "@/lib/lotto";
import { siteConfig } from "@/lib/site";
import { OG_SIZE, getBallFill, getBallTextColor } from "@/lib/og-utils";

export const alt = "로또 회차 당첨번호";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ round: string }> }) {
  const { round: roundParam } = await params;
  const round = Number.parseInt(roundParam, 10);
  const draw = Number.isInteger(round) ? await drawRepository.getByRound(round) : null;

  if (!draw) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #050A14 0%, #0a1a30 50%, #050A14 100%)",
            fontFamily: "system-ui, sans-serif"
          }}
        >
          <span style={{ fontSize: "40px", fontWeight: 700, color: "#e2e8f0" }}>
            {siteConfig.logoName}
          </span>
          <p style={{ fontSize: "24px", color: "#94a3b8", marginTop: "16px" }}>
            회차 데이터를 찾을 수 없습니다
          </p>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #050A14 0%, #0a1a30 50%, #050A14 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 700,
              color: "#fff"
            }}
          >
            L
          </div>
          <span style={{ fontSize: "26px", fontWeight: 700, color: "#cbd5e1", letterSpacing: "0.04em" }}>
            {siteConfig.logoName}
          </span>
        </div>

        {/* Round badge */}
        <p style={{ fontSize: "20px", color: "#2dd4bf", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginTop: "24px", marginBottom: "8px" }}>
          제{draw.round}회 당첨번호
        </p>
        <p style={{ fontSize: "18px", color: "#64748b", marginBottom: "32px" }}>
          {draw.drawDate} 추첨
        </p>

        {/* Balls */}
        <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
          {draw.numbers.map((n: number) => (
            <div
              key={n}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: getBallFill(n),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: 700,
                color: getBallTextColor(n),
                boxShadow: "0 6px 20px rgba(0,0,0,0.5)"
              }}
            >
              {n}
            </div>
          ))}
          <span style={{ fontSize: "36px", color: "#475569", fontWeight: 600, margin: "0 4px" }}>+</span>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: getBallFill(draw.bonus),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
              color: getBallTextColor(draw.bonus),
              boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
              border: "3px solid rgba(255,255,255,0.5)"
            }}
          >
            {draw.bonus}
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: "15px", color: "#334155", marginTop: "40px", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
          {siteConfig.domain}
        </p>
      </div>
    ),
    { ...size }
  );
}
