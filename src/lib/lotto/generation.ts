import { createNumberPool, MAIN_NUMBER_COUNT, sortNumbers } from "@/lib/lotto/shared";
import type { Draw, GenerateNumbersInput, GeneratedSet, GenerationService } from "@/types/lotto";

function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function pickRandomUnique(count: number, pool: number[]): number[] {
  const remaining = [...pool];
  const picked: number[] = [];

  while (picked.length < count && remaining.length > 0) {
    const index = randomIndex(remaining.length);
    const [choice] = remaining.splice(index, 1);
    picked.push(choice);
  }

  return sortNumbers(picked);
}

function buildFrequencyWeights(draws: Draw[]): Map<number, number> {
  const weights = new Map<number, number>();

  for (const number of createNumberPool()) {
    weights.set(number, 1);
  }

  for (const draw of draws) {
    for (const number of draw.numbers) {
      weights.set(number, (weights.get(number) ?? 1) + 1);
    }
  }

  return weights;
}

function pickWeightedUnique(count: number, pool: number[], weights: Map<number, number>): number[] {
  const remaining = [...pool];
  const picked: number[] = [];

  while (picked.length < count && remaining.length > 0) {
    const totalWeight = remaining.reduce((sum, number) => sum + (weights.get(number) ?? 1), 0);
    let cursor = Math.random() * totalWeight;
    let selected = remaining[remaining.length - 1];

    for (const number of remaining) {
      cursor -= weights.get(number) ?? 1;

      if (cursor <= 0) {
        selected = number;
        break;
      }
    }

    picked.push(selected);
    remaining.splice(remaining.indexOf(selected), 1);
  }

  return sortNumbers(picked);
}

function createReason(strategy: GenerateNumbersInput["strategy"]): string {
  if (strategy === "random") {
    return "완전 랜덤 기준으로 중복 없이 조합했습니다.";
  }

  if (strategy === "frequency") {
    return "시드 회차에서 자주 나온 번호에 가중치를 둬 조합했습니다.";
  }

  return "빈도 가중치와 랜덤 조합을 섞어 균형 있게 구성했습니다.";
}

function createNumbers(strategy: GenerateNumbersInput["strategy"], draws: Draw[]): number[] {
  const pool = createNumberPool();

  if (strategy === "random") {
    return pickRandomUnique(MAIN_NUMBER_COUNT, pool);
  }

  const weights = buildFrequencyWeights(draws);

  if (strategy === "frequency") {
    return pickWeightedUnique(MAIN_NUMBER_COUNT, pool, weights);
  }

  const weightedHalf = pickWeightedUnique(3, pool, weights);
  const remainingPool = pool.filter((number) => !weightedHalf.includes(number));
  const randomHalf = pickRandomUnique(3, remainingPool);

  return sortNumbers([...weightedHalf, ...randomHalf]);
}

function createBonus(numbers: number[]): number {
  const remainingPool = createNumberPool().filter((number) => !numbers.includes(number));
  return pickRandomUnique(1, remainingPool)[0];
}

export class StaticGenerationService implements GenerationService {
  constructor(private readonly draws: Draw[]) {}

  async generate(input: GenerateNumbersInput): Promise<GeneratedSet[]> {
    return Array.from({ length: input.count }, (_, index) => {
      const numbers = createNumbers(input.strategy, this.draws);

      return {
        id: `gen_${Date.now()}_${index + 1}`,
        strategy: input.strategy,
        numbers,
        bonus: input.includeBonus ? createBonus(numbers) : undefined,
        reason: createReason(input.strategy),
        generatedAt: new Date().toISOString()
      };
    });
  }
}
