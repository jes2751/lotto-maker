import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "LOTTO LAB",
  description: "과거 당첨 데이터 기반 추천, 전체 회차 조회, 번호별 통계를 제공하는 무료 로또 웹 서비스"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <AdSenseScript />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
