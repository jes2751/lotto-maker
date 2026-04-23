import type { NumberUsageSummary } from "@/lib/generated-stats/shared";

export type OverlapLevel = "safe" | "warning" | "danger";

export interface OverlapResult {
  score: number;
  level: OverlapLevel;
  message: string;
}

/**
 * Calculates how much a generated set of numbers overlaps with the crowd's most picked numbers.
 * The score is the sum of the percentages of the overlapping numbers.
 * e.g., If the user picked 7 (chosen by 15% of crowd) and 12 (chosen by 10%), the score is 25.
 */
export function calculateCrowdOverlap(numbers: number[], topCrowdNumbers: NumberUsageSummary[]): number {
  let score = 0;
  
  for (const number of numbers) {
    const crowdStat = topCrowdNumbers.find((stat) => stat.number === number);
    if (crowdStat) {
      score += crowdStat.percentage;
    }
  }
  
  return Number(score.toFixed(1));
}

/**
 * Returns a warning level based on the crowd overlap score.
 * Thresholds:
 * - >= 20: danger (Multiple highly picked numbers)
 * - >= 10: warning (Some overlap)
 * - < 10: safe (Low overlap, good EV)
 */
export function getOverlapWarning(score: number): OverlapResult {
  if (score >= 20) {
    return {
      score,
      level: "danger",
      message: "이 조합은 이번 주 다른 유저들이 가장 많이 뽑은 번호들이 다수 포함되어 있습니다. 독식 확률이 매우 낮습니다."
    };
  }
  
  if (score >= 10) {
    return {
      score,
      level: "warning",
      message: "유행하는 번호가 일부 포함되어 있습니다. 당첨 시 기댓값이 다소 낮아질 수 있습니다."
    };
  }
  
  return {
    score,
    level: "safe",
    message: "군중 중복도가 낮습니다. 당첨 시 기댓값이 매우 유리한 조합입니다."
  };
}
