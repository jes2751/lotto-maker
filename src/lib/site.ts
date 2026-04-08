import type { Metadata } from "next";

export type SiteLocale = "ko" | "en";

export const siteConfig = {
  name: "Lotto Maker Lab",
  logoName: "LOTTO MAKER LAB",
  domain: "lotto-maker.cloud",
  defaultUrl: "https://lotto-maker.cloud",
  descriptionKo:
    "로또 당첨번호 조회, 로또 번호 생성기, 공식 통계, 사람들 선택 흐름 비교를 제공하는 무료 로또 웹 서비스입니다.",
  descriptionEn:
    "Free Lotto web service with historical-data-based recommendations, draw lookup, statistics, and generated stats."
};

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.defaultUrl;
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
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
  const title = locale === "ko" ? `${titleKo} | ${siteConfig.name}` : `${titleEn} | ${siteConfig.name}`;
  const description = locale === "ko" ? descriptionKo : descriptionEn;
  const canonical = getAbsoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
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
