import type { MetadataRoute } from "next";

import { drawRepository } from "@/lib/lotto";
import { getSiteUrl } from "@/lib/site";

interface StaticRoute {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
}

const staticRoutes: StaticRoute[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/generate", changeFrequency: "daily", priority: 0.9 },
  { path: "/check", changeFrequency: "daily", priority: 0.9 },
  { path: "/draws", changeFrequency: "daily", priority: 0.85 },
  { path: "/stats", changeFrequency: "weekly", priority: 0.8 },
  { path: "/generated-stats", changeFrequency: "daily", priority: 0.75 },
  { path: "/about", changeFrequency: "monthly", priority: 0.45 },
  { path: "/guides", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/how-to-buy-lotto-online", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/lotto-number-generator-vs-random", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/recent-hot-and-cold-numbers", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/odd-even-pattern-guide", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/lotto-sum-pattern-analysis", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/how-to-buy-lotto-online", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/what-to-do-when-winning-lotto", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/lotto-tax-and-claim-guide", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/the-truth-of-lotto-hotspots", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/lotto-vs-pension-lottery", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/illegal-overseas-lotto", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/unusual-winning-patterns", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/lotto-asset-management", changeFrequency: "monthly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.4 },
  { path: "/policies/ads", changeFrequency: "monthly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.3 }
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const draws = await drawRepository.getAll();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));

  const drawEntries: MetadataRoute.Sitemap = draws.map((draw) => ({
    url: `${siteUrl}/draws/${draw.round}`,
    lastModified: draw.drawDate,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const numberEntries: MetadataRoute.Sitemap = Array.from({ length: 45 }, (_, index) => ({
    url: `${siteUrl}/stats/numbers/${index + 1}`,
    changeFrequency: "weekly",
    priority: 0.6
  }));

  return [...staticEntries, ...drawEntries, ...numberEntries];
}
