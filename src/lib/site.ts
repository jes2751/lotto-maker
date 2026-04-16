import type { Metadata } from "next";

export type SiteLocale = "ko" | "en";

export const siteConfig = {
  name: "Lotto Maker Lab",
  logoName: "LOTTO MAKER LAB",
  seoNameKo: "로또 메이커 랩",
  domain: "lotto-maker.cloud",
  defaultUrl: "https://lotto-maker.cloud",
  descriptionKo:
    "로또 번호 생성기, 당첨번호 조회, 공식 통계, 사람들 선택 비교를 제공하는 한국어 중심 로또 서비스입니다.",
  descriptionEn:
    "Free Lotto web service with historical-data-based recommendations, draw lookup, statistics, and generated stats.",
  keywordsKo: [
    "로또",
    "로또 번호 생성기",
    "로또 당첨번호",
    "로또 통계",
    "로또 회차 분석",
    "사람들 선택",
    "한국 로또",
    "번호 추천"
  ],
  keywordsEn: [
    "Lotto",
    "Lotto number generator",
    "draw lookup",
    "lotto statistics",
    "crowd board",
    "historical data recommendations"
  ]
};

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.defaultUrl;
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function getSiteDisplayName(locale: SiteLocale) {
  return locale === "ko" ? siteConfig.seoNameKo : siteConfig.name;
}

export function getSiteKeywords(locale: SiteLocale) {
  return locale === "ko" ? siteConfig.keywordsKo : siteConfig.keywordsEn;
}

interface PageMetadataInput {
  locale: SiteLocale;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  path?: string;
}

export function createPageMetadata({
  locale,
  titleKo,
  titleEn,
  descriptionKo,
  descriptionEn,
  path = "/"
}: PageMetadataInput): Metadata {
  const siteName = getSiteDisplayName(locale);
  const title = locale === "ko" ? `${titleKo} | ${siteName}` : `${titleEn} | ${siteName}`;
  const description = locale === "ko" ? descriptionKo : descriptionEn;
  const canonical = getAbsoluteUrl(path);

  return {
    title,
    description,
    keywords: getSiteKeywords(locale),
    alternates: {
      canonical,
      languages: {
        "ko-KR": canonical
      }
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: locale === "ko" ? "ko_KR" : "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}
