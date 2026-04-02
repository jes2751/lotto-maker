import { ImageResponse } from "next/og";

import { drawRepository } from "@/lib/lotto";
import { siteConfig } from "@/lib/site";
import { OG_SIZE, getBallFill, getBallTextColor } from "@/lib/og-utils";

export const alt = "로또 회차 당첨번호";
export const size = OG_SIZE;
export const contentType = "image/png";

function controlRoomBackground() {
  return "radial-gradient(circle at top left, rgba(255,143,0,0.22) 0%, transparent 28%), radial-gradient(circle at bottom right, rgba(65,201,192,0.16) 0%, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%), #06101b";
}

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
            background: controlRoomBackground(),
            fontFamily: "system-ui, sans-serif"
          }}
        >
          <span style={{ fontSize: "42px", fontWeight: 700, color: "#f8fafc" }}>{siteConfig.logoName}</span>
          <p style={{ fontSize: "24px", color: "#b7c4d3", marginTop: "16px" }}>회차 데이터를 찾을 수 없습니다</p>
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
          justifyContent: "space-between",
          background: controlRoomBackground(),
          fontFamily: "system-ui, sans-serif",
          padding: "56px"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "24px",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", zIndex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#41c9c0",
                letterSpacing: "0.24em",
                textTransform: "uppercase"
              }}
            >
              Lotto Control Room
            </span>
            <span style={{ marginTop: "12px", fontSize: "32px", fontWeight: 700, color: "#e7edf5" }}>
              {siteConfig.logoName}
            </span>
          </div>

          <span
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              fontSize: "14px",
              fontWeight: 700,
              color: "#c9d4e1",
              letterSpacing: "0.16em",
              textTransform: "uppercase"
            }}
          >
            Round {draw.round}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
          <p
            style={{
              fontSize: "18px",
              color: "#ffb020",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "10px"
            }}
          >
            Winning Numbers
          </p>
          <h1 style={{ fontSize: "62px", lineHeight: 1, fontWeight: 800, color: "#f8fafc", margin: 0 }}>
            {draw.round}회 당첨번호
          </h1>
          <p style={{ fontSize: "24px", color: "#b7c4d3", marginTop: "18px", marginBottom: "34px" }}>{draw.drawDate} 추첨</p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "26px 30px",
              borderRadius: "30px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.035)"
            }}
          >
            {draw.numbers.map((n: number) => (
              <div
                key={n}
                style={{
                  width: "82px",
                  height: "82px",
                  borderRadius: "50%",
                  background: getBallFill(n),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "31px",
                  fontWeight: 700,
                  color: getBallTextColor(n),
                  boxShadow: "0 8px 18px rgba(0,0,0,0.28)"
                }}
              >
                {n}
              </div>
            ))}
            <span style={{ fontSize: "36px", color: "#64748b", fontWeight: 700, margin: "0 2px" }}>+</span>
            <div
              style={{
                width: "82px",
                height: "82px",
                borderRadius: "50%",
                background: getBallFill(draw.bonus),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "31px",
                fontWeight: 700,
                color: getBallTextColor(draw.bonus),
                boxShadow: "0 8px 18px rgba(0,0,0,0.28)",
                border: "3px solid rgba(255,176,32,0.72)"
              }}
            >
              {draw.bonus}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            zIndex: 1,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "20px"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span
              style={{
                fontSize: "13px",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.18em"
              }}
            >
              Trusted weekly control board
            </span>
            <span style={{ fontSize: "16px", color: "#cbd5e1" }}>최신 회차, 번호 생성, 핵심 통계를 한 흐름으로</span>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#d7e1eb",
              letterSpacing: "0.2em",
              textTransform: "uppercase"
            }}
          >
            {siteConfig.domain}
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
