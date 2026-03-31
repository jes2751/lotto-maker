import type { Draw } from "@/types/lotto";

import { computeFrequencyStats } from "@/lib/lotto/stats";

interface SumRangeStat {
  label: string;
  count: number;
}

export interface DrawAnalysis {
  sum: number;
  oddCount: number;
  evenCount: number;
  lowCount: number;
  highCount: number;
  consecutivePairs: Array<[number, number]>;
  hotMatches: number[];
  coldMatches: number[];
}

export interface DrawAnalysisSummary {
  oddEvenSummary: string;
  sumSummary: string;
  trendSummary: string;
}

export function sumNumbers(numbers: number[]) {
  return numbers.reduce((total, value) => total + value, 0);
}

export function countOddEven(numbers: number[]) {
  const oddCount = numbers.filter((value) => value % 2 === 1).length;

  return {
    oddCount,
    evenCount: numbers.length - oddCount
  };
}

export function countLowHigh(numbers: number[]) {
  const lowCount = numbers.filter((value) => value <= 22).length;

  return {
    lowCount,
    highCount: numbers.length - lowCount
  };
}

export function findConsecutivePairs(numbers: number[]) {
  const ordered = [...numbers].sort((left, right) => left - right);
  const pairs: Array<[number, number]> = [];

  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index] - ordered[index - 1] === 1) {
      pairs.push([ordered[index - 1], ordered[index]]);
    }
  }

  return pairs;
}

export function analyzeDraw(draw: Draw, draws: Draw[]): DrawAnalysis {
  const { oddCount, evenCount } = countOddEven(draw.numbers);
  const { lowCount, highCount } = countLowHigh(draw.numbers);
  const frequency = computeFrequencyStats(draws);
  const hotSet = new Set(frequency.slice(0, 10).map((item) => item.number));
  const coldSet = new Set(frequency.slice(-10).map((item) => item.number));

  return {
    sum: sumNumbers(draw.numbers),
    oddCount,
    evenCount,
    lowCount,
    highCount,
    consecutivePairs: findConsecutivePairs(draw.numbers),
    hotMatches: draw.numbers.filter((value) => hotSet.has(value)),
    coldMatches: draw.numbers.filter((value) => coldSet.has(value))
  };
}

export function computeOddEvenPatterns(draws: Draw[]) {
  const counter = new Map<string, number>();

  for (const draw of draws) {
    const { oddCount, evenCount } = countOddEven(draw.numbers);
    const label = `${oddCount}:${evenCount}`;
    counter.set(label, (counter.get(label) ?? 0) + 1);
  }

  return Array.from(counter.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

export function computeSumRangeStats(draws: Draw[]): SumRangeStat[] {
  const ranges: SumRangeStat[] = [
    { label: "21-80", count: 0 },
    { label: "81-100", count: 0 },
    { label: "101-120", count: 0 },
    { label: "121-140", count: 0 },
    { label: "141-180", count: 0 },
    { label: "181-255", count: 0 }
  ];

  for (const draw of draws) {
    const total = sumNumbers(draw.numbers);

    if (total <= 80) {
      ranges[0].count += 1;
    } else if (total <= 100) {
      ranges[1].count += 1;
    } else if (total <= 120) {
      ranges[2].count += 1;
    } else if (total <= 140) {
      ranges[3].count += 1;
    } else if (total <= 180) {
      ranges[4].count += 1;
    } else {
      ranges[5].count += 1;
    }
  }

  return [...ranges].sort((left, right) => right.count - left.count);
}

export function buildDrawAnalysisSummary(analysis: DrawAnalysis): DrawAnalysisSummary {
  const oddEvenSummary =
    analysis.oddCount === analysis.evenCount
      ? "The set is evenly balanced between odd and even numbers."
      : analysis.oddCount > analysis.evenCount
        ? `The set leans odd with ${analysis.oddCount} odd numbers versus ${analysis.evenCount} even numbers.`
        : `The set leans even with ${analysis.evenCount} even numbers versus ${analysis.oddCount} odd numbers.`;

  const sumSummary =
    analysis.sum < 100
      ? `The total sum is ${analysis.sum}, which falls into a relatively low band for a six-number draw.`
      : analysis.sum <= 160
        ? `The total sum is ${analysis.sum}, which sits in the middle band where many rounds cluster.`
        : `The total sum is ${analysis.sum}, which places this round in a relatively high sum band.`;

  const trendSummary =
    analysis.hotMatches.length >= 3
      ? `This round overlaps heavily with current hot numbers: ${analysis.hotMatches.join(", ")}.`
      : analysis.coldMatches.length >= 2
        ? `This round includes several quieter numbers: ${analysis.coldMatches.join(", ")}.`
        : analysis.consecutivePairs.length > 0
          ? `A visible consecutive pattern appears in ${analysis.consecutivePairs.map((pair) => pair.join("-")).join(", ")}.`
          : "This round is relatively balanced without a single dominant pattern.";

  return {
    oddEvenSummary,
    sumSummary,
    trendSummary
  };
}
