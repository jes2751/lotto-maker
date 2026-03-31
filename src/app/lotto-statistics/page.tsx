import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lotto statistics | Hot numbers, cold numbers, and pattern analysis",
  description: "Use the Lotto statistics hub to move into hot numbers, cold numbers, odd-even patterns, sum patterns, and recent draw analysis."
};

export default function LottoStatisticsLandingPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="panel">
        <p className="eyebrow">Lotto Statistics</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Lotto statistics hub</h1>
        <p className="mt-4 leading-8 text-slate-300">
          This hub is built for search entry and internal navigation. Visitors can move into frequency pages, pattern pages,
          and recent-trend pages without needing to understand the full dashboard first.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {[
          ["/hot-numbers", "Hot numbers", "Review the most frequently drawn numbers across the full history."],
          ["/cold-numbers", "Cold numbers", "Check which numbers have appeared relatively less often."],
          ["/odd-even-pattern", "Odd-even pattern", "Review the most common odd-even ratios across all rounds."],
          ["/sum-pattern", "Sum pattern", "Compare the most common number-sum ranges."],
          ["/recent-10-draw-analysis", "Recent 10 draw analysis", "Use a short-term trend page built around the latest 10 rounds."],
          ["/stats", "Full statistics", "Open the full statistics dashboard and number detail drill-down pages."]
        ].map(([href, title, description]) => (
          <Link key={href} href={href} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/30">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
