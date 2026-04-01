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
      ? "홀짝 비율이 3:3으로 균형을 이룬 회차입니다."
      : analysis.oddCount > analysis.evenCount
        ? `홀수가 ${analysis.oddCount}개로 짝수 ${analysis.evenCount}개보다 많은 회차입니다.`
        : `짝수가 ${analysis.evenCount}개로 홀수 ${analysis.oddCount}개보다 많은 회차입니다.`;

  const sumSummary =
    analysis.sum < 100
      ? `번호 합계 ${analysis.sum}는 비교적 낮은 구간에 속합니다.`
      : analysis.sum <= 160
        ? `번호 합계 ${analysis.sum}는 가장 자주 보이는 중간 구간에 가깝습니다.`
        : `번호 합계 ${analysis.sum}는 비교적 높은 구간에 속합니다.`;

  const trendSummary =
    analysis.hotMatches.length >= 3
      ? `자주 나온 번호와의 겹침이 많은 편입니다: ${analysis.hotMatches.join(", ")}.`
      : analysis.coldMatches.length >= 2
        ? `적게 나온 번호가 두 개 이상 포함돼 있습니다: ${analysis.coldMatches.join(", ")}.`
        : analysis.consecutivePairs.length > 0
          ? `연속번호 조합이 보입니다: ${analysis.consecutivePairs.map((pair) => pair.join("-")).join(", ")}.`
          : "큰 치우침보다는 비교적 고르게 퍼진 조합에 가까운 회차입니다.";

  return {
    oddEvenSummary,
    sumSummary,
    trendSummary
  };
}
