import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lotto number generator vs random picks",
  description:
    "Learn the difference between a historical-data-based Lotto number generator and a pure random pick, and when each is useful.",
  alternates: {
    canonical: "/guides/lotto-number-generator-vs-random"
  }
};

export default function GeneratorVsRandomGuidePage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Lotto number generator and random picks are not the same",
          description:
            "Guide article explaining the difference between a historical-data-based Lotto number generator and a pure random pick.",
          url: `${siteUrl}/guides/lotto-number-generator-vs-random`,
          inLanguage: "ko-KR",
          author: {
            "@type": "Organization",
            name: siteConfig.name
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name
          }
        }}
      />

      <section className="panel">
        <p className="eyebrow">Guide</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Lotto number generator and random picks are not the same</h1>
        <p className="mt-4 leading-8 text-slate-300">
          A random pick is useful when you want a clean baseline. A historical-data-based generator is useful when you want
          the result to reflect draw frequency, recent patterns, and reference statistics. Neither can guarantee a winning
          outcome, but they answer different user needs.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="panel">
          <p className="eyebrow">Random Pick</p>
          <p className="mt-3 text-sm leading-8 text-slate-300">
            Pure random generation ignores history and treats every number equally. It is simple, fast, and useful for
            comparison when you want to understand whether a data-based recommendation feels different.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Historical Recommendation</p>
          <p className="mt-3 text-sm leading-8 text-slate-300">
            A data-based generator uses past winning draws, frequency, and mixed strategies to produce sets that feel more
            explainable. The value is in the explanation and the pattern reference, not in certainty.
          </p>
        </article>
      </section>

      <section className="panel">
        <p className="eyebrow">Next Step</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-button">
            Try the generator
          </Link>
          <Link
            href="/lotto-number-generator"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            Generator landing page
          </Link>
        </div>
      </section>
    </div>
  );
}
