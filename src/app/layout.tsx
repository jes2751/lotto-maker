import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { Outfit } from "next/font/google";

import "@/app/globals.css";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { FirebaseAnalytics } from "@/components/analytics/firebase-analytics";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { getRequestPreferences } from "@/lib/server-preferences";
import { SiteHeader } from "@/components/layout/site-header";
import { getAbsoluteUrl, getSiteUrl, siteConfig } from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: siteConfig.name,
  description: siteConfig.descriptionKo,
  alternates: {
    canonical: getAbsoluteUrl("/")
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.descriptionKo,
    url: getAbsoluteUrl("/"),
    siteName: siteConfig.name,
    locale: "ko_KR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.descriptionKo
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  }
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.descriptionKo,
    url: siteUrl,
    inLanguage: "ko-KR"
  };

  return (
    <html lang="ko" data-theme="dark">
      <body className={`font-sans ${outfit.variable}`}>
        <AdSenseScript />
        <FirebaseAnalytics />
        <JsonLd data={structuredData} />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
