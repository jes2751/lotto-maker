export type GenerationStrategy = "random" | "frequency" | "mixed" | "filter";
export type StatsPeriod = "all" | "recent_10";
export type OddEvenFilter = "any" | "balanced" | "odd-heavy" | "even-heavy";

export interface GenerationFilters {
  fixedNumbers?: number[];
  excludedNumbers?: number[];
  oddEven?: OddEvenFilter;
  sumMin?: number | null;
  sumMax?: number | null;
  allowConsecutive?: boolean;
}

export interface Draw {
  id: number;
  round: number;
  drawDate: string;
  numbers: number[];
  bonus: number;
  totalPrize?: number | null;
  firstPrize?: number | null;
  winnerCount?: number | null;
}

export interface GeneratedSet {
  id: string;
  strategy: GenerationStrategy;
  numbers: number[];
  bonus?: number;
  reason: string;
  generatedAt: string;
}

export interface FrequencyStat {
  number: number;
  frequency: number;
  percentage: number;
}

export interface ListDrawsOptions {
  limit?: number;
  offset?: number;
}

export interface DrawListResult {
  draws: Draw[];
  total: number;
  hasMore: boolean;
}

export interface DrawRepository {
  list(options?: ListDrawsOptions): Promise<DrawListResult>;
  getByRound(round: number): Promise<Draw | null>;
  getLatest(): Promise<Draw | null>;
  getAll(): Promise<Draw[]>;
}

export interface GenerateNumbersInput {
  strategy: GenerationStrategy;
  count: number;
  filters?: GenerationFilters;
}

export interface GenerationService {
  generate(input: GenerateNumbersInput): Promise<GeneratedSet[]>;
}
