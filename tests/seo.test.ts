import assert from "node:assert/strict";
import test from "node:test";

import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { getSiteUrl } from "../src/lib/site";

test("robots points to sitemap on official domain", () => {
  const result = robots();

  assert.equal(result.sitemap, "https://lotto-maker.cloud/sitemap.xml");
  assert.deepEqual(result.rules, {
    userAgent: "*",
    allow: "/"
  });
});

test("official site url matches the production domain", () => {
  assert.equal(getSiteUrl(), "https://lotto-maker.cloud");
});

test("sitemap includes seo landing and analysis routes", async () => {
  const result = await sitemap();
  const urls = result.map((entry) => entry.url);

  assert.ok(urls.includes("https://lotto-maker.cloud/odd-even-pattern"));
  assert.ok(urls.includes("https://lotto-maker.cloud/sum-pattern"));
  assert.ok(urls.includes("https://lotto-maker.cloud/draw-analysis"));
  assert.ok(urls.includes("https://lotto-maker.cloud/draw-analysis/1169"));
  assert.ok(urls.includes("https://lotto-maker.cloud/privacy"));
  assert.ok(urls.includes("https://lotto-maker.cloud/terms"));
  assert.ok(urls.includes("https://lotto-maker.cloud/faq"));
  assert.ok(urls.includes("https://lotto-maker.cloud/contact"));
});
