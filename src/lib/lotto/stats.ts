import type { Draw, FrequencyStat, StatsPeriod } from "@/types/lotto";

export interface OddEvenSummary {
  label: string;
  odds: number;
  evens: number;
  count: number;
  percentage: number;
}

export interface SumRangeSummary {
  label: string;
  min: number;
  max: number | null;
  count: number;
  percentage: number;
}

export interface ConsecutiveSummary {
  count: number;
  percentage: number;
}

export interface DashboardSummary {
  totalDraws: number;
  averageSum: number;
  topNumber: FrequencyStat;
  coldNumber: FrequencyStat;
  recentRepeatNumbers: FrequencyStat[];
  oddEvenBreakdown: OddEvenSummary[];
  sumRangeBreakdown: SumRangeSummary[];
  consecutiveSummary: ConsecutiveSummary;
}

const sumRanges = [
  { min: 60, max: 99 },
  { min: 100, max: 119 },
  { min: 120, max: 139 },
  { min: 140, max: 159 },
  { min: 160, max: 179 },
  { min: 180, max: null }
] as const;

export function selectDrawsByPeriod(draws: Draw[], period: StatsPeriod): Draw[] {
  if (period === "recent_10") {
    return draws.slice(0, 10);
  }

  return draws;
}

export function computeFrequencyStats(draws: Draw[], period: StatsPeriod = "all"): FrequencyStat[] {
  const selected = selectDrawsByPeriod(draws, period);
  const counter = new Map<number, number>();

  for (let number = 1; number <= 45; number += 1) {
    counter.set(number, 0);
  }

  for (const draw of selected) {
    for (const number of draw.numbers) {
      counter.set(number, (counter.get(number) ?? 0) + 1);
    }
  }

  const totalDraws = Math.max(selected.length, 1);

  return Array.from(counter.entries())
    .map(([number, frequency]) => ({
      number,
      frequency,
      percentage: Number(((frequency / totalDraws) * 100).toFixed(1))
    }))
    .sort((left, right) => {
      if (right.frequency === left.frequency) {
        return left.number - right.number;
      }

      return right.frequency - left.frequency;
    });
}

export function getNumberFrequency(draws: Draw[], number: number, period: StatsPeriod = "all"): FrequencyStat {
  const stats = computeFrequencyStats(draws, period);
  return stats.find((item) => item.number === number) ?? { number, frequency: 0, percentage: 0 };
}

export function findDrawsContainingNumber(draws: Draw[], number: number, period: StatsPeriod = "all"): Draw[] {
  return selectDrawsByPeriod(draws, period).filter((draw) => draw.numbers.includes(number));
}

export function computeOddEvenSummary(draws: Draw[], period: StatsPeriod = "all"): OddEvenSummary[] {
  const selected = selectDrawsByPeriod(draws, period);
  const counter = new Map<string, number>();

  for (const draw of selected) {
    const odds = draw.numbers.filter((number) => number % 2 !== 0).length;
    const evens = draw.numbers.length - odds;
    const key = `${odds}:${evens}`;
    counter.set(key, (counter.get(key) ?? 0) + 1);
  }

  const totalDraws = Math.max(selected.length, 1);

  return Array.from(counter.entries())
    .map(([key, count]) => {
      const [odds, evens] = key.split(":").map(Number);
      return {
        label: `${odds}:${evens}`,
        odds,
        evens,
        count,
        percentage: Number(((count / totalDraws) * 100).toFixed(1))
      };
    })
    .sort((left, right) => {
      if (right.count === left.count) {
        return left.odds - right.odds;
      }

      return right.count - left.count;
    });
}

export function computeSumRangeSummary(draws: Draw[], period: StatsPeriod = "all"): SumRangeSummary[] {
  const selected = selectDrawsByPeriod(draws, period);
  const counter = new Map<string, number>();

  for (const range of sumRanges) {
    const label = range.max === null ? `${range.min}+` : `${range.min}-${range.max}`;
    counter.set(label, 0);
  }

  for (const draw of selected) {
    const sum = draw.numbers.reduce((total, number) => total + number, 0);
    const range = sumRanges.find((item) => {
      if (item.max === null) {
        return sum >= item.min;
      }

      return sum >= item.min && sum <= item.max;
    });

    if (!range) {
      continue;
    }

    const label = range.max === null ? `${range.min}+` : `${range.min}-${range.max}`;
    counter.set(label, (counter.get(label) ?? 0) + 1);
  }

  const totalDraws = Math.max(selected.length, 1);

  return sumRanges
    .map((range) => {
      const label = range.max === null ? `${range.min}+` : `${range.min}-${range.max}`;
      const count = counter.get(label) ?? 0;

      return {
        label,
        min: range.min,
        max: range.max,
        count,
        percentage: Number(((count / totalDraws) * 100).toFixed(1))
      };
    })
    .sort((left, right) => right.count - left.count);
}

export function computeConsecutiveSummary(draws: Draw[], period: StatsPeriod = "all"): ConsecutiveSummary {
  const selected = selectDrawsByPeriod(draws, period);
  const count = selected.filter((draw) =>
    draw.numbers.some((number, index, numbers) => index > 0 && number - numbers[index - 1] === 1)
  ).length;

  return {
    count,
    percentage: Number(((count / Math.max(selected.length, 1)) * 100).toFixed(1))
  };
}

export function computeAverageSum(draws: Draw[], period: StatsPeriod = "all"): number {
  const selected = selectDrawsByPeriod(draws, period);

  if (selected.length === 0) {
    return 0;
  }

  const total = selected.reduce(
    (sum, draw) => sum + draw.numbers.reduce((drawSum, number) => drawSum + number, 0),
    0
  );

  return Math.round(total / selected.length);
}

export function computeDashboardSummary(draws: Draw[], period: StatsPeriod = "all"): DashboardSummary {
  const stats = computeFrequencyStats(draws, period);
  const selected = selectDrawsByPeriod(draws, period);
  const recentRepeatNumbers = computeFrequencyStats(draws, "recent_10").slice(0, 5);

  return {
    totalDraws: selected.length,
    averageSum: computeAverageSum(draws, period),
    topNumber: stats[0] ?? { number: 0, frequency: 0, percentage: 0 },
    coldNumber: stats.at(-1) ?? { number: 0, frequency: 0, percentage: 0 },
    recentRepeatNumbers,
    oddEvenBreakdown: computeOddEvenSummary(draws, period),
    sumRangeBreakdown: computeSumRangeSummary(draws, period),
    consecutiveSummary: computeConsecutiveSummary(draws, period)
  };
}
