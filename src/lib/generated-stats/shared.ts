import type { Draw, GenerationStrategy } from "@/types/lotto";

export interface StoredGeneratedRecord {
  id: string;
  anonymousId: string;
  strategy: GenerationStrategy;
  numbers: number[];
  bonus: number | null;
  reason: string;
  generatedAt: string;
  targetRound: number | null;
  matchedRound?: number | null;
  matchCount?: number | null;
  bonusMatched?: boolean;
  settledAt?: string | null;
  filters: {
    fixedNumbers: number[];
    excludedNumbers: number[];
    oddEven: string;
    sumMin: number | null;
    sumMax: number | null;
    allowConsecutive: boolean;
  };
}

export interface StrategyPerformance {
  strategy: GenerationStrategy;
  totalGenerated: number;
  bestMatch: number;
  threePlusHits: number;
  fourPlusHits: number;
  bonusHits: number;
  averageMatch: number;
  sharePercentage: number;
}

export interface EvaluatedGeneratedRecord extends StoredGeneratedRecord {
  matchCount: number;
  bonusMatched: boolean;
  matchedRound: number | null;
}

export interface NumberUsageSummary {
  number: number;
  count: number;
  percentage: number;
}

export interface MatchDistributionItem {
  label: string;
  count: number;
  percentage: number;
}

export interface GeneratedStatsSummary {
  currentTargetRound: number | null;
  latestEvaluatedRound: number | null;
  currentRecords: StoredGeneratedRecord[];
  evaluatedRecords: EvaluatedGeneratedRecord[];
  strategyBoard: StrategyPerformance[];
  currentStrategyTotals: Array<{
    strategy: GenerationStrategy;
    totalGenerated: number;
    sharePercentage: number;
  }>;
  currentTopNumbers: NumberUsageSummary[];
  matchDistribution: MatchDistributionItem[];
}

export interface GeneratedStatsViewModel {
  currentTargetRound: number | null;
  latestEvaluatedRound: number | null;
  currentTotalGenerated: number;
  threePlusHitCount: number;
  strategyBoard: StrategyPerformance[];
  currentStrategyTotals: Array<{
    strategy: GenerationStrategy;
    totalGenerated: number;
    sharePercentage: number;
  }>;
  currentTopNumbers: NumberUsageSummary[];
  matchDistribution: MatchDistributionItem[];
  recentRecords: StoredGeneratedRecord[];
}

export interface GeneratedStatsSnapshot {
  view: GeneratedStatsViewModel;
  source: "aggregate" | "recomputed" | "empty";
  computedAt: string | null;
  sourceRecordCount: number;
}

const strategyOrder: GenerationStrategy[] = ["mixed", "frequency", "filter", "random"];

export function getStrategyLabel(strategy: GenerationStrategy) {
  switch (strategy) {
    case "mixed":
      return "혼합 추천";
    case "frequency":
      return "빈도 추천";
    case "filter":
      return "필터 추천";
    case "random":
      return "랜덤 추천";
    default:
      return strategy;
  }
}

export function getTargetRound(latestDraw: Draw | null) {
  return latestDraw ? latestDraw.round + 1 : null;
}

export function evaluateGeneratedRecord(record: StoredGeneratedRecord, draw: Draw): EvaluatedGeneratedRecord {
  if (record.matchedRound === draw.round && typeof record.matchCount === "number") {
    return {
      ...record,
      matchCount: record.matchCount,
      bonusMatched: record.bonusMatched === true,
      matchedRound: record.matchedRound
    };
  }

  const matchedMainNumbers = record.numbers.filter((number) => draw.numbers.includes(number)).length;
  const bonusMatched =
    typeof record.bonus === "number" ? record.bonus === draw.bonus : record.numbers.includes(draw.bonus);

  return {
    ...record,
    matchCount: matchedMainNumbers,
    bonusMatched,
    matchedRound: draw.round
  };
}

function buildCurrentTopNumbers(records: StoredGeneratedRecord[]): NumberUsageSummary[] {
  const counter = new Map<number, number>();

  for (const record of records) {
    for (const number of record.numbers) {
      counter.set(number, (counter.get(number) ?? 0) + 1);
    }
  }

  const totalRecords = Math.max(records.length, 1);

  return Array.from(counter.entries())
    .map(([number, count]) => ({
      number,
      count,
      percentage: Number(((count / totalRecords) * 100).toFixed(1))
    }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.number - right.number;
    })
    .slice(0, 10);
}

function buildMatchDistribution(records: EvaluatedGeneratedRecord[]): MatchDistributionItem[] {
  const totalRecords = Math.max(records.length, 1);

  return Array.from({ length: 7 }, (_, matchCount) => {
    const count = records.filter((record) => record.matchCount === matchCount).length;

    return {
      label: `${matchCount}개 일치`,
      count,
      percentage: Number(((count / totalRecords) * 100).toFixed(1))
    };
  }).reverse();
}

export function buildGeneratedStatsSummary(
  records: StoredGeneratedRecord[],
  latestDraw: Draw | null
): GeneratedStatsSummary {
  const currentTargetRound = getTargetRound(latestDraw);
  const currentRecords =
    currentTargetRound === null ? [] : records.filter((record) => record.targetRound === currentTargetRound);

  const evaluatedRecords =
    latestDraw === null
      ? []
      : records
          .filter((record) => record.targetRound === latestDraw.round)
          .map((record) => evaluateGeneratedRecord(record, latestDraw));

  const currentStrategyTotals = strategyOrder
    .map((strategy) => {
      const totalGenerated = currentRecords.filter((record) => record.strategy === strategy).length;
      const sharePercentage =
        currentRecords.length === 0 ? 0 : Number(((totalGenerated / currentRecords.length) * 100).toFixed(1));

      return {
        strategy,
        totalGenerated,
        sharePercentage
      };
    })
    .filter((item) => item.totalGenerated > 0);

  const strategyBoard = strategyOrder
    .map((strategy) => {
      const matched = evaluatedRecords.filter((record) => record.strategy === strategy);

      if (matched.length === 0) {
        return null;
      }

      const totalMatchCount = matched.reduce((sum, record) => sum + record.matchCount, 0);
      const sharePercentage =
        evaluatedRecords.length === 0 ? 0 : Number(((matched.length / evaluatedRecords.length) * 100).toFixed(1));

      return {
        strategy,
        totalGenerated: matched.length,
        bestMatch: matched.reduce((best, record) => Math.max(best, record.matchCount), 0),
        threePlusHits: matched.filter((record) => record.matchCount >= 3).length,
        fourPlusHits: matched.filter((record) => record.matchCount >= 4).length,
        bonusHits: matched.filter((record) => record.bonusMatched).length,
        averageMatch: Number((totalMatchCount / matched.length).toFixed(2)),
        sharePercentage
      } satisfies StrategyPerformance;
    })
    .filter((item): item is StrategyPerformance => item !== null)
    .sort((left, right) => {
      if (right.bestMatch !== left.bestMatch) {
        return right.bestMatch - left.bestMatch;
      }

      if (right.threePlusHits !== left.threePlusHits) {
        return right.threePlusHits - left.threePlusHits;
      }

      return right.totalGenerated - left.totalGenerated;
    });

  return {
    currentTargetRound,
    latestEvaluatedRound: latestDraw?.round ?? null,
    currentRecords,
    evaluatedRecords,
    strategyBoard,
    currentStrategyTotals,
    currentTopNumbers: buildCurrentTopNumbers(currentRecords),
    matchDistribution: buildMatchDistribution(evaluatedRecords)
  };
}

export function buildGeneratedStatsViewModel(
  records: StoredGeneratedRecord[],
  latestDraw: Draw | null,
  recentRecords?: StoredGeneratedRecord[]
): GeneratedStatsViewModel {
  const summary = buildGeneratedStatsSummary(records, latestDraw);

  return {
    currentTargetRound: summary.currentTargetRound,
    latestEvaluatedRound: summary.latestEvaluatedRound,
    currentTotalGenerated: summary.currentRecords.length,
    threePlusHitCount: summary.evaluatedRecords.filter((record) => record.matchCount >= 3).length,
    strategyBoard: summary.strategyBoard,
    currentStrategyTotals: summary.currentStrategyTotals,
    currentTopNumbers: summary.currentTopNumbers,
    matchDistribution: summary.matchDistribution,
    recentRecords: recentRecords ?? summary.currentRecords.slice(0, 4)
  };
}
