import type { Draw, FrequencyStat, StatsPeriod } from "@/types/lotto";

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
