import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NumberSet } from "@/components/lotto/number-set";
import { JsonLd } from "@/components/seo/json-ld";
import { drawRepository } from "@/lib/lotto";
import { analyzeDraw, buildDrawAnalysisSummary } from "@/lib/lotto/analysis";
import { createPageMetadata, getSiteUrl, siteConfig } from "@/lib/site";

interface DrawAnalysisPageProps {
  params: Promise<{
    round: string;
  }>;
}

export async function generateMetadata({
  params
}: DrawAnalysisPageProps): Promise<Metadata> {
  const { round: roundParam } = await params;
  const round = Number.parseInt(roundParam, 10);
  const draw = Number.isInteger(round) ? await drawRepository.getByRound(round) : null;

  if (!draw) {
    return createPageMetadata({
      locale: "ko",
      path: "/latest-lotto-results",
      titleKo: "회차 분석",
      titleEn: "Draw Analysis",
      descriptionKo:
        "회차별 로또 번호 패턴과 통계 흐름을 읽는 분석 페이지입니다.",
      descriptionEn: "Round-based Lotto analysis page with number patterns and trend summary."
    });
  }

  return createPageMetadata({
    locale: "ko",
    path: `/draw-analysis/${draw.round}`,
    titleKo: `${draw.round}회 회차 분석`,
    titleEn: `Round ${draw.round} Draw Analysis`,
    descriptionKo: `${draw.round}회 당첨번호의 홀짝, 합계, 저고 분포, 자주 나온 번호 겹침 정도를 정리한 회차 분석 페이지입니다.`,
    descriptionEn: `Round ${draw.round} Lotto analysis with winning numbers, odd-even pattern, sum pattern, and data-based comparison.`
  });
}

export default async function DrawAnalysisPage({
  params
}: DrawAnalysisPageProps) {
  const { round: roundParam } = await params;
  const round = Number.parseInt(roundParam, 10);

  if (!Number.isInteger(round) || round < 1) {
    notFound();
  }

  const draws = await drawRepository.getAll();
  const draw = draws.find((item) => item.round === round);

  if (!draw) {
    notFound();
  }

  const analysis = analyzeDraw(draw, draws);
  const summary = buildDrawAnalysisSummary(analysis);
  const index = draws.findIndex((item) => item.round === draw.round);
  const newer = index > 0 ? draws[index - 1] : null;
  const older = index >= 0 && index < draws.length - 1 ? draws[index + 1] : null;
  const relatedRounds = draws.filter((item) => item.round !== draw.round).slice(0, 3);
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/draw-analysis/${draw.round}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${draw.round} draw analysis`,
      description: `Round ${draw.round} Lotto analysis with number combination summary, odd-even balance, sum range, and recent statistical comparison.`,
      url: pageUrl,
      inLanguage: "ko-KR",
      mainEntityOfPage: pageUrl,
      author: {
        "@type": "Organization",
        name: siteConfig.name
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name
      },
      datePublished: draw.drawDate,
      dateModified: draw.drawDate
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Latest results",
          item: `${siteUrl}/latest-lotto-results`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${draw.round} draw analysis`,
          item: pageUrl
        }
      ]
    }
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <JsonLd data={jsonLd} />

      <section className="panel hero-panel">
        <p className="eyebrow">Round Analysis</p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="section-title text-gradient-silver">{draw.round}회 로또 회차 분석</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              이 페이지는 {draw.round}회 당첨번호 조합을 기준으로 홀짝 비율, 번호 합계, 저고 비율, 연속번호 여부,
              자주 나온 번호와의 겹침 정도를 빠르게 읽을 수 있게 정리한 분석 페이지입니다.
            </p>
            <p className="mt-3 text-sm text-slate-400">{draw.drawDate}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/draws/${draw.round}`} className="cta-button">
              회차 상세 보기
            </Link>
            <Link href="/latest-lotto-results" className="secondary-button">
              최신 결과 허브
            </Link>
          </div>
        </div>
        <div className="mt-6">
          <NumberSet
            numbers={draw.numbers}
            bonus={draw.bonus}
            hrefBuilder={(value) => `/stats/numbers/${value}`}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="panel">
          <p className="eyebrow">Pattern Note</p>
          <div className="soft-card mt-4 text-base leading-8 text-slate-300">{summary.oddEvenSummary}</div>
        </article>
        <article className="panel">
          <p className="eyebrow">Sum Note</p>
          <div className="soft-card mt-4 text-base leading-8 text-slate-300">{summary.sumSummary}</div>
        </article>
        <article className="panel">
          <p className="eyebrow">Trend Note</p>
          <div className="soft-card mt-4 text-base leading-8 text-slate-300">{summary.trendSummary}</div>
        </article>
      </section>

      <section className="panel">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <article className="kpi-cell">
            <p className="eyebrow !text-[0.7rem]">Sum</p>
            <p className="mt-3 text-4xl font-semibold text-white">{analysis.sum}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              번호 6개의 합계로, 합계 패턴 페이지와 비교할 때 가장 먼저 참고할 수 있는 값입니다.
            </p>
          </article>
          <article className="kpi-cell">
            <p className="eyebrow !text-[0.7rem]">Odd / Even</p>
            <p className="mt-3 text-4xl font-semibold text-white">{analysis.oddCount}:{analysis.evenCount}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              홀수 {analysis.oddCount}개, 짝수 {analysis.evenCount}개 조합입니다.
            </p>
          </article>
          <article className="kpi-cell">
            <p className="eyebrow !text-[0.7rem]">Low / High</p>
            <p className="mt-3 text-4xl font-semibold text-white">{analysis.lowCount}:{analysis.highCount}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              1~22를 저구간, 23~45를 고구간으로 나눠 본 비율입니다.
            </p>
          </article>
          <article className="kpi-cell">
            <p className="eyebrow !text-[0.7rem]">Consecutive</p>
            <p className="mt-3 text-4xl font-semibold text-white">{analysis.consecutivePairs.length}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              {analysis.consecutivePairs.length > 0
                ? `연속번호: ${analysis.consecutivePairs.map((pair) => pair.join("-")).join(", ")}`
                : "연속번호는 보이지 않는 회차입니다."}
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="panel">
          <p className="eyebrow">Hot Matches</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">자주 나온 번호와 겹친 숫자</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            전체 회차 기준 상위 빈도 그룹과 비교했을 때{" "}
            {analysis.hotMatches.length > 0
              ? `${analysis.hotMatches.join(", ")}가 함께 포함되었습니다.`
              : "겹치는 번호가 많지 않은 회차입니다."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/hot-numbers" className="secondary-button">
              자주 나온 번호 보기
            </Link>
            <Link href="/stats" className="secondary-button">
              통계 대시보드 보기
            </Link>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Cold Matches</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">적게 나온 번호와 겹친 숫자</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            전체 회차 기준 하위 빈도 그룹과 비교했을 때{" "}
            {analysis.coldMatches.length > 0
              ? `${analysis.coldMatches.join(", ")}가 포함되었습니다.`
              : "낮은 빈도 그룹과 겹치는 번호는 크지 않습니다."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/cold-numbers" className="secondary-button">
              적게 나온 번호 보기
            </Link>
            <Link href="/recent-10-draw-analysis" className="secondary-button">
              최근 10회 분석 보기
            </Link>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Related Analysis</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">비슷한 흐름으로 이어서 보기 좋은 페이지</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              상세 해석을 마친 뒤에는 바로 비교할 통계나 다음 회차 분석으로 짧게 이동하는 편이 더 읽기 좋습니다.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link href={`/draws/${draw.round}`} className="interactive-card">
            <p className="text-lg font-semibold text-white">회차 상세</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">당첨금, 당첨자 수, 원시 회차 정보를 다시 확인합니다.</p>
          </Link>
          <Link href="/odd-even-pattern" className="interactive-card">
            <p className="text-lg font-semibold text-white">홀짝 패턴</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">이번 회차의 홀짝 비율이 전체 흐름에서 어떤 위치인지 비교합니다.</p>
          </Link>
          <Link href="/sum-pattern" className="interactive-card">
            <p className="text-lg font-semibold text-white">합계 패턴</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">이번 회차의 합계가 자주 나오는 구간인지 비교합니다.</p>
          </Link>
          <Link href="/lotto-number-generator" className="interactive-card">
            <p className="text-lg font-semibold text-white">추천기 랜딩</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">회차를 본 뒤 바로 추천 전략을 다시 고를 수 있습니다.</p>
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {relatedRounds.map((item) => (
            <Link key={item.round} href={`/draw-analysis/${item.round}`} className="chip-link">
              <span className="font-semibold text-white">{item.round}회 분석</span>
              <span className="text-slate-400">{item.drawDate}</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={newer ? `/draw-analysis/${newer.round}` : "#"}
            aria-disabled={!newer}
            className={[
              "link-list-item",
              newer
                ? "text-slate-200"
                : "cursor-not-allowed border-white/5 bg-slate-950/20 text-slate-600"
            ].join(" ")}
          >
            {newer ? `더 최신 분석: ${newer.round}회` : "더 최신 분석 없음"}
          </Link>
          <Link
            href={older ? `/draw-analysis/${older.round}` : "#"}
            aria-disabled={!older}
            className={[
              "link-list-item",
              older
                ? "text-slate-200"
                : "cursor-not-allowed border-white/5 bg-slate-950/20 text-slate-600"
            ].join(" ")}
          >
            {older ? `이전 분석: ${older.round}회` : "이전 분석 없음"}
          </Link>
        </div>
      </section>
    </div>
  );
}
