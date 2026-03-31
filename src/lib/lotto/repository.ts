import { seedDraws } from "@/lib/data/seed-draws";
import type { Draw, DrawListResult, DrawRepository, ListDrawsOptions } from "@/types/lotto";

function sortByLatest(draws: Draw[]): Draw[] {
  return [...draws].sort((left, right) => right.round - left.round);
}

export class StaticDrawRepository implements DrawRepository {
  constructor(private readonly draws: Draw[]) {}

  async list(options: ListDrawsOptions = {}): Promise<DrawListResult> {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    const ordered = sortByLatest(this.draws);

    return {
      draws: ordered.slice(offset, offset + limit),
      total: ordered.length,
      hasMore: offset + limit < ordered.length
    };
  }

  async getByRound(round: number): Promise<Draw | null> {
    return this.draws.find((draw) => draw.round === round) ?? null;
  }

  async getLatest(): Promise<Draw | null> {
    return sortByLatest(this.draws)[0] ?? null;
  }

  async getAll(): Promise<Draw[]> {
    return sortByLatest(this.draws);
  }
}

export const drawRepository: DrawRepository = new StaticDrawRepository(seedDraws);
