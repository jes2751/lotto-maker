import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { getRequestPreferences } from "@/lib/server-preferences";
import { SiteHeader } from "@/components/layout/site-header";
import { getAbsoluteUrl, getSiteUrl, siteConfig } from "@/lib/site";

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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const siteUrl = getSiteUrl();
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-H6Z8MLCSYK";
  const { locale, theme } = getRequestPreferences();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.descriptionKo,
    url: siteUrl,
    inLanguage: "ko-KR"
  };

  return (
    <html lang={locale} data-theme={theme}>
      <body className="font-sans">
        <AdSenseScript />
        <Script id="theme-preference" strategy="beforeInteractive">
          {`
            (function() {
              var match = document.cookie.match(/(?:^|; )lotto_theme=([^;]+)/);
              var theme = match ? decodeURIComponent(match[1]) : '${theme}';
              document.documentElement.dataset.theme = theme;
            })();
          `}
        </Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `}
        </Script>
        <JsonLd data={structuredData} />
        <div className="flex min-h-screen flex-col">
          <SiteHeader locale={locale} theme={theme} />
          <main className="flex-1">{children}</main>
          <SiteFooter locale={locale} />
        </div>
      </body>
    </html>
  );
}
