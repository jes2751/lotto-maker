import assert from "node:assert/strict";
import test from "node:test";

import { createPageMetadata, siteConfig } from "../src/lib/site";

test("site metadata prefers Korean search signals", () => {
  const metadata = createPageMetadata({
    locale: "ko",
    path: "/generated-stats",
    titleKo: "사람들 선택 통계",
    titleEn: "Generated Stats",
    descriptionKo: "사람들 선택 통계 페이지입니다.",
    descriptionEn: "Generated stats page."
  });

  assert.equal(metadata.title, `사람들 선택 통계 | ${siteConfig.seoNameKo}`);
  assert.deepEqual(metadata.keywords, siteConfig.keywordsKo);
  assert.equal(metadata.alternates?.languages?.["ko-KR"], "https://lotto-maker.cloud/generated-stats");
});
