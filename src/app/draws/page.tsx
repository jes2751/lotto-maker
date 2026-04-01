import type { Metadata } from "next";
import Link from "next/link";

import { NumberSet } from "@/components/lotto/number-set";
import { drawRepository } from "@/lib/lotto";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    locale: "ko",
    path: "/draws",
    titleKo: "로또 회차 조회",
    titleEn: "Lotto Draw Archive",
    descriptionKo: "전체 로또 회차를 최신순으로 조회하고 회차 번호 또는 포함 번호로 원하는 결과를 빠르게 찾을 수 있습니다.",
    descriptionEn:
      "Browse the full Lotto round archive, search by round number, and filter draws by included numbers."
  })
};

interface DrawsPageProps {
  searchParams?: {
    round?: string;
    number?: string;
    offset?: string;
    limit?: string;
  };
}

const DEFAULT_LIMIT = 12;

function formatWonAmount(value?: number | null) {
  if (!value) {
    return "정보 없음";
  }

  return `${Math.round(value / 100000000)}억 원`;
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

function parseNumberFilter(value: string | undefined) {
  const raw = value?.trim() ?? "";

  if (!raw) {
    return { raw: "", value: null as number | null };
  }

  const parsed = Number.parseInt(raw, 10);
  const isValid = Number.isInteger(parsed) && parsed >= 1 && parsed <= 45;

  return {
    raw,
    value: isValid ? parsed : null
  };
}

function buildDrawsHref(params: { offset?: number; limit: number; round?: string; number?: string }) {
  const searchParams = new URLSearchParams();

  if (typeof params.offset === "number" && params.offset > 0) {
    searchParams.set("offset", String(params.offset));
  }

  if (params.limit !== DEFAULT_LIMIT) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.round) {
    searchParams.set("round", params.round);
  }

  if (params.number) {
    searchParams.set("number", params.number);
  }

  const query = searchParams.toString();
  return query ? `/draws?${query}` : "/draws";
}

export default async function DrawsPage({ searchParams }: DrawsPageProps) {
  const limit = Math.min(Math.max(parsePositiveInteger(searchParams?.limit, DEFAULT_LIMIT), 1), 20);
  const offset = parsePositiveInteger(searchParams?.offset, 0);
  const allDraws = await drawRepository.getAll();
  const latest = allDraws[0] ?? null;
  const roundQuery = searchParams?.round?.trim() ?? "";
  const numberFilter = parseNumberFilter(searchParams?.number);
  const selectedNumber = numberFilter.value;
  const requestedRound = Number.parseInt(roundQuery, 10);
  const searchedDraw =
    roundQuery && Number.isInteger(requestedRound) && requestedRound > 0 ? await drawRepository.getByRound(requestedRound) : null;
  const filteredDraws = selectedNumber === null ? allDraws : allDraws.filter((draw) => draw.numbers.includes(selectedNumber));
  const draws = filteredDraws.slice(offset, offset + limit);
  const total = filteredDraws.length;
  const hasMore = offset + limit < total;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const previousOffset = Math.max(offset - limit, 0);
  const nextOffset = offset + limit;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel">
          <p className="eyebrow">Draws</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">전체 회차 조회</h1>
          <p className="mt-3 text-slate-300">전체 회차 데이터를 기준으로 최신부터 페이지 단위로 탐색할 수 있습니다.</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Find Round</p>
          <div className="mt-4 grid gap-3">
            <form action="/draws" className="flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="limit" value={String(limit)} />
              {numberFilter.raw ? <input type="hidden" name="number" value={numberFilter.raw} /> : null}
              <input
                type="number"
                min="1"
                name="round"
                defaultValue={roundQuery}
                placeholder="예: 1169"
                className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500"
              />
              <button type="submit" className="cta-button">
                회차 찾기
              </button>
            </form>
            <form action="/draws" className="flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="limit" value={String(limit)} />
              {roundQuery ? <input type="hidden" name="round" value={roundQuery} /> : null}
              <input
                type="number"
                min="1"
                max="45"
                name="number"
                defaultValue={numberFilter.raw}
                placeholder="포함 번호 예: 7"
                className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500"
              />
              <button type="submit" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30">
                번호 포함 회차 찾기
              </button>
            </form>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">최신 회차</p>
              <p className="mt-2 text-2xl font-semibold text-white">{latest ? `${latest.round}회` : "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">전체 회차 수</p>
              <p className="mt-2 text-2xl font-semibold text-white">{total}개</p>
            </div>
          </div>
        </div>
      </section>

      {roundQuery ? (
        <section className="panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Search Result</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">회차 바로 찾기 결과</h2>
            </div>
            {searchedDraw ? (
              <Link
                href={`/draws/${searchedDraw.round}`}
                className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
              >
                상세 보기
              </Link>
            ) : null}
          </div>
          {searchedDraw ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-2xl font-semibold text-white">{searchedDraw.round}회</p>
                <p className="mt-1 text-sm text-slate-400">{searchedDraw.drawDate}</p>
                <p className="mt-4 text-sm text-slate-300">1등 당첨자 {searchedDraw.winnerCount ?? 0}명</p>
              </div>
              <div>
                <NumberSet numbers={searchedDraw.numbers} bonus={searchedDraw.bonus} hrefBuilder={(value) => `/stats/numbers/${value}`} />
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              입력한 회차를 찾지 못했습니다. 전체 회차 범위 안의 번호를 다시 확인해 주세요.
            </div>
          )}
        </section>
      ) : null}

      {numberFilter.raw ? (
        <section className="panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Number Filter</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {selectedNumber ? `${selectedNumber}번 번호 포함 회차` : "번호 필터 확인 필요"}
              </h2>
            </div>
            {selectedNumber ? <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">{total}개 회차</div> : null}
          </div>
          {selectedNumber ? (
            <p className="mt-4 text-sm text-slate-400">메인 번호 6개 안에 {selectedNumber}번이 포함된 회차만 목록과 페이지 수에 반영합니다.</p>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-5 text-sm text-slate-400">
              번호 필터는 1부터 45 사이 값만 사용할 수 있습니다.
            </div>
          )}
        </section>
      ) : null}

      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Paging</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{selectedNumber ? `${selectedNumber}번 기준 회차 목록` : "회차 목록 페이지"}</h2>
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            {currentPage} / {totalPages} 페이지
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={buildDrawsHref({ offset: previousOffset, limit, round: roundQuery || undefined, number: numberFilter.raw || undefined })}
            aria-disabled={offset === 0}
            className={[
              "rounded-full border px-5 py-3 text-sm transition",
              offset === 0
                ? "pointer-events-none border-white/5 bg-slate-950/20 text-slate-600"
                : "border-white/10 text-slate-200 hover:border-white/30"
            ].join(" ")}
          >
            이전 페이지
          </Link>
          <Link
            href={buildDrawsHref({ offset: nextOffset, limit, round: roundQuery || undefined, number: numberFilter.raw || undefined })}
            aria-disabled={!hasMore}
            className={[
              "rounded-full border px-5 py-3 text-sm transition",
              !hasMore
                ? "pointer-events-none border-white/5 bg-slate-950/20 text-slate-600"
                : "border-white/10 text-slate-200 hover:border-white/30"
            ].join(" ")}
          >
            다음 페이지
          </Link>
        </div>
      </section>

      <div className="grid gap-4">
        {draws.map((draw) => (
          <article key={draw.round} className="panel">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold text-white">{draw.round}회</p>
                <p className="mt-1 text-sm text-slate-400">{draw.drawDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-400">1등 당첨자 {draw.winnerCount ?? 0}명</div>
                <Link
                  href={`/draws/${draw.round}`}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/30"
                >
                  Detail
                </Link>
              </div>
            </div>
            <div className="mt-5">
              <NumberSet numbers={draw.numbers} bonus={draw.bonus} hrefBuilder={(value) => `/stats/numbers/${value}`} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">총 판매금: {formatWonAmount(draw.totalPrize)}</div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">1등 당첨금: {formatWonAmount(draw.firstPrize)}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
