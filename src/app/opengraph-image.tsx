import { ImageResponse } from "next/og";

import { drawRepository } from "@/lib/lotto";
import { siteConfig } from "@/lib/site";
import { OG_SIZE, getBallFill, getBallTextColor } from "@/lib/og-utils";

export const alt = "Lotto Maker Lab — 최신 당첨번호";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage() {
  const draw = await drawRepository.getLatest();

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
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px"
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
              color: "#fff"
            }}
          >
            L
          </div>
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.04em" }}>
            {siteConfig.logoName}
          </span>
        </div>

        {/* Subtext */}
        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px", marginTop: "8px" }}>
          과거 당첨 데이터 기반 추천 · 통계 · 번호 생성
        </p>

        {/* Draw info */}
        {draw ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ fontSize: "22px", color: "#2dd4bf", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: "16px" }}>
              {draw.round}회 당첨번호 · {draw.drawDate}
            </p>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {draw.numbers.map((n: number) => (
                <div
                  key={n}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: getBallFill(n),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: getBallTextColor(n),
                    boxShadow: "0 4px 16px rgba(0,0,0,0.4)"
                  }}
                >
                  {n}
                </div>
              ))}
              <span style={{ fontSize: "32px", color: "#64748b", fontWeight: 600 }}>+</span>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: getBallFill(draw.bonus),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: getBallTextColor(draw.bonus),
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                  border: "3px solid rgba(255,255,255,0.5)"
                }}
              >
                {draw.bonus}
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: "28px", color: "#e2e8f0", fontWeight: 600 }}>무료 로또 번호 추천 웹 서비스</p>
        )}

        {/* Domain */}
        <p style={{ fontSize: "16px", color: "#475569", marginTop: "40px", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
          {siteConfig.domain}
        </p>
      </div>
    ),
    { ...size }
  );
}
