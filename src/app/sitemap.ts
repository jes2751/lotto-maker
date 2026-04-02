import type { MetadataRoute } from "next";

import { drawRepository } from "@/lib/lotto";
import { getSiteUrl } from "@/lib/site";

const staticRoutes = [
  "",
  "/generate",
  "/draws",
  "/stats",
  "/generated-stats",
  "/draw-analysis",
  "/lotto-buy-guide",
  "/latest-lotto-results",
  "/lotto-number-generator",
  "/lotto-statistics",
  "/hot-numbers",
  "/cold-numbers",
  "/odd-even-pattern",
  "/sum-pattern",
  "/recent-10-draw-analysis",
  "/guides",
  "/guides/lotto-number-generator-vs-random",
  "/guides/recent-20-hot-numbers",
  "/guides/odd-even-pattern-guide",
  "/policies/ads",
  "/privacy",
  "/terms",
  "/faq",
  "/contact"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const draws = await drawRepository.getAll();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7
  }));

  const drawEntries: MetadataRoute.Sitemap = draws.map((draw) => ({
    url: `${siteUrl}/draws/${draw.round}`,
    lastModified: draw.drawDate,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const analysisEntries: MetadataRoute.Sitemap = draws.map((draw) => ({
    url: `${siteUrl}/draw-analysis/${draw.round}`,
    lastModified: draw.drawDate,
    changeFrequency: "weekly",
    priority: 0.75
  }));

  const numberEntries: MetadataRoute.Sitemap = Array.from({ length: 45 }, (_, index) => ({
    url: `${siteUrl}/stats/numbers/${index + 1}`,
    changeFrequency: "weekly",
    priority: 0.6
  }));

  return [...staticEntries, ...drawEntries, ...analysisEntries, ...numberEntries];
}
