import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to read odd-even patterns in Lotto",
  description:
    "Understand how odd-even splits are used in Lotto statistics and how to connect them with round analysis and generator decisions.",
  alternates: {
    canonical: "/guides/odd-even-pattern-guide"
  }
};

export default function OddEvenPatternGuidePage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to read odd-even patterns in Lotto",
          description:
            "Guide article explaining how odd-even patterns are used in Lotto statistics and round analysis.",
          url: `${siteUrl}/guides/odd-even-pattern-guide`,
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
        <h1 className="mt-4 text-4xl font-semibold text-white">How to read odd-even patterns in Lotto</h1>
        <p className="mt-4 leading-8 text-slate-300">
          Odd-even splits are one of the easiest pattern summaries for Lotto users to understand. They do not predict future
          results on their own, but they help explain whether a round or a generated set looks balanced or skewed.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="panel">
          <p className="eyebrow">Balanced</p>
          <p className="mt-3 text-sm leading-8 text-slate-300">
            A 3:3 split often feels balanced because odd and even numbers are distributed evenly across the six-number set.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Leaning Odd</p>
          <p className="mt-3 text-sm leading-8 text-slate-300">
            A 4:2 or 5:1 odd-heavy split is less balanced, but it still appears in historical results and should be viewed as
            part of the overall distribution.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Leaning Even</p>
          <p className="mt-3 text-sm leading-8 text-slate-300">
            An even-heavy split works the same way. It becomes meaningful when you compare it against the full-history
            pattern page and recent round analysis.
          </p>
        </article>
      </section>

      <section className="panel">
        <p className="eyebrow">Next Step</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/odd-even-pattern" className="cta-button">
            Open odd-even pattern page
          </Link>
          <Link
            href="/lotto-statistics"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30"
          >
            Statistics hub
          </Link>
        </div>
      </section>
    </div>
  );
}
