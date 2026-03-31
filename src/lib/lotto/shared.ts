export const LOTTO_MIN = 1;
export const LOTTO_MAX = 45;
export const MAIN_NUMBER_COUNT = 6;

export function createNumberPool(): number[] {
  return Array.from({ length: LOTTO_MAX }, (_, index) => index + LOTTO_MIN);
}

export function sortNumbers(numbers: number[]): number[] {
  return [...numbers].sort((left, right) => left - right);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function isValidStrategy(value: string): value is "random" | "frequency" | "mixed" {
  return value === "random" || value === "frequency" || value === "mixed";
}
