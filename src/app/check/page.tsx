import type { Metadata } from "next";

import { CheckerPanel } from "@/components/lotto/checker-panel";
import { JsonLd } from "@/components/seo/json-ld";
import { drawRepository } from "@/lib/lotto";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";
import { getRequestPreferences } from "@/lib/server-preferences";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getRequestPreferences();

  return createPageMetadata({
    locale,
    path: "/check",
    titleKo: "내 당첨 확인기",
    titleEn: "Lotto Winning Checker",
    descriptionKo:
      "내가 구매한 로또 번호를 입력하면 특정 회차의 당첨번호와 비교하여 당첨 여부와 등수를 즉시 확인할 수 있습니다.",
    descriptionEn:
      "Enter your lotto numbers and instantly check your winning status and prize rank against any draw round."
  });
}

export default async function CheckPage() {
  const latestDraw = await drawRepository.getLatest();
  const siteUrl = getSiteUrl();

  if (!latestDraw) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <section className="panel">
          <p className="eyebrow">내 당첨 확인기</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">
            당첨 데이터 준비 중
          </h1>
          <p className="mt-4 leading-8 text-slate-300">
            아직 당첨번호 데이터가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "내 당첨 확인기",
          description:
            "로또 번호를 입력하면 특정 회차의 당첨번호와 비교하여 당첨 여부를 즉시 확인합니다.",
          url: `${siteUrl}/check`,
          applicationCategory: "Utility",
          operatingSystem: "All",
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteUrl
          }
        }}
      />

      <div>
        <p className="eyebrow">Winning Checker</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">
          내 당첨 확인기
        </h1>
        <p className="mt-4 leading-8 text-slate-300">
          구매한 로또 번호를 입력하면 해당 회차의 당첨번호와 비교하여 당첨 여부와 등수를 즉시 확인할 수 있습니다.
        </p>
      </div>

      <CheckerPanel latestDraw={latestDraw} />
    </div>
  );
}
