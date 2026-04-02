import { createNumberPool, LOTTO_MAX, LOTTO_MIN, MAIN_NUMBER_COUNT, sortNumbers } from "@/lib/lotto/shared";
import type {
  Draw,
  GenerateNumbersInput,
  GeneratedSet,
  GenerationFilters,
  GenerationService,
  OddEvenFilter
} from "@/types/lotto";

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

function createBaseNumbers(
  strategy: "random" | "frequency" | "mixed",
  draws: Draw[],
  pool = createNumberPool()
): number[] {
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

function countOdd(numbers: number[]) {
  return numbers.filter((value) => value % 2 === 1).length;
}

function hasConsecutive(numbers: number[]) {
  for (let index = 1; index < numbers.length; index += 1) {
    if (numbers[index] - numbers[index - 1] === 1) {
      return true;
    }
  }

  return false;
}

function matchesOddEven(numbers: number[], oddEven: OddEvenFilter) {
  if (oddEven === "any") {
    return true;
  }

  const oddCount = countOdd(numbers);
  const evenCount = numbers.length - oddCount;

  if (oddEven === "balanced") {
    return oddCount === 3 && evenCount === 3;
  }

  if (oddEven === "odd-heavy") {
    return oddCount >= 4;
  }

  return evenCount >= 4;
}

function normalizeFilters(filters?: GenerationFilters): Required<GenerationFilters> {
  return {
    fixedNumbers: sortNumbers([...(filters?.fixedNumbers ?? [])]),
    excludedNumbers: sortNumbers([...(filters?.excludedNumbers ?? [])]),
    oddEven: filters?.oddEven ?? "any",
    sumMin: filters?.sumMin ?? null,
    sumMax: filters?.sumMax ?? null,
    allowConsecutive: filters?.allowConsecutive ?? true
  };
}

function validateGeneratedNumbers(numbers: number[], filters: Required<GenerationFilters>) {
  if (numbers.length !== MAIN_NUMBER_COUNT || new Set(numbers).size !== MAIN_NUMBER_COUNT) {
    return false;
  }

  if (!numbers.every((value) => value >= LOTTO_MIN && value <= LOTTO_MAX)) {
    return false;
  }

  if (filters.fixedNumbers.some((value) => !numbers.includes(value))) {
    return false;
  }

  if (filters.excludedNumbers.some((value) => numbers.includes(value))) {
    return false;
  }

  if (!matchesOddEven(numbers, filters.oddEven)) {
    return false;
  }

  const sum = numbers.reduce((accumulator, value) => accumulator + value, 0);

  if (typeof filters.sumMin === "number" && sum < filters.sumMin) {
    return false;
  }

  if (typeof filters.sumMax === "number" && sum > filters.sumMax) {
    return false;
  }

  if (!filters.allowConsecutive && hasConsecutive(numbers)) {
    return false;
  }

  return true;
}

function createFilterNumbers(draws: Draw[], rawFilters?: GenerationFilters): number[] {
  const filters = normalizeFilters(rawFilters);
  const pool = createNumberPool().filter(
    (value) => !filters.fixedNumbers.includes(value) && !filters.excludedNumbers.includes(value)
  );
  const missingCount = MAIN_NUMBER_COUNT - filters.fixedNumbers.length;

  if (missingCount < 0) {
    throw new Error("고정수는 최대 6개까지만 선택할 수 있습니다.");
  }

  for (let attempt = 0; attempt < 800; attempt += 1) {
    const baseStrategy: "mixed" | "frequency" | "random" =
      attempt % 3 === 0 ? "mixed" : attempt % 3 === 1 ? "frequency" : "random";
    const generatedPool =
      baseStrategy === "random"
        ? pickRandomUnique(missingCount, pool)
        : createBaseNumbers(baseStrategy, draws, pool).slice(0, missingCount);
    const numbers = sortNumbers([...filters.fixedNumbers, ...generatedPool]);

    if (validateGeneratedNumbers(numbers, filters)) {
      return numbers;
    }
  }

  throw new Error("선택한 필터 조건에 맞는 조합을 찾지 못했습니다. 조건을 조금 완화해 주세요.");
}

function createBonus(numbers: number[]): number {
  const remainingPool = createNumberPool().filter((number) => !numbers.includes(number));
  return pickRandomUnique(1, remainingPool)[0];
}

function formatOddEven(oddEven: OddEvenFilter) {
  if (oddEven === "balanced") {
    return "홀짝 균형(3:3)";
  }

  if (oddEven === "odd-heavy") {
    return "홀수 우세";
  }

  if (oddEven === "even-heavy") {
    return "짝수 우세";
  }

  return null;
}

function createReason(strategy: GenerateNumbersInput["strategy"], filters?: GenerationFilters): string {
  if (strategy === "random") {
    return "완전 랜덤 기준으로 중복 없이 조합했습니다.";
  }

  if (strategy === "frequency") {
    return "과거 당첨 데이터에서 자주 나온 번호에 가중치를 주고 조합했습니다.";
  }

  if (strategy === "mixed") {
    return "빈도 가중치와 랜덤 조합을 함께 섞어 균형 있게 구성했습니다.";
  }

  const normalized = normalizeFilters(filters);
  const parts: string[] = ["선택한 필터 조건을 반영해 데이터 기반 조합을 만들었습니다."];

  if (normalized.fixedNumbers.length > 0) {
    parts.push(`고정수 ${normalized.fixedNumbers.join(", ")}`);
  }

  if (normalized.excludedNumbers.length > 0) {
    parts.push(`제외수 ${normalized.excludedNumbers.join(", ")}`);
  }

  const oddEven = formatOddEven(normalized.oddEven);

  if (oddEven) {
    parts.push(`홀짝 조건: ${oddEven}`);
  }

  if (typeof normalized.sumMin === "number" || typeof normalized.sumMax === "number") {
    const min = normalized.sumMin ?? LOTTO_MIN * MAIN_NUMBER_COUNT;
    const max = normalized.sumMax ?? LOTTO_MAX * MAIN_NUMBER_COUNT;
    parts.push(`합계 범위: ${min}~${max}`);
  }

  if (!normalized.allowConsecutive) {
    parts.push("연속번호 제외");
  }

  return parts.join(" / ");
}

function createNumbers(strategy: GenerateNumbersInput["strategy"], draws: Draw[], filters?: GenerationFilters): number[] {
  if (strategy === "filter") {
    return createFilterNumbers(draws, filters);
  }

  return createBaseNumbers(strategy, draws);
}

export class StaticGenerationService implements GenerationService {
  constructor(private readonly draws: Draw[]) {}

  async generate(input: GenerateNumbersInput): Promise<GeneratedSet[]> {
    return Array.from({ length: input.count }, (_, index) => {
      const numbers = createNumbers(input.strategy, this.draws, input.filters);

      return {
        id: `gen_${Date.now()}_${index + 1}`,
        strategy: input.strategy,
        numbers,
        bonus: input.includeBonus ? createBonus(numbers) : undefined,
        reason: createReason(input.strategy, input.filters),
        generatedAt: new Date().toISOString()
      };
    });
  }
}
