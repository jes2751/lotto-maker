import { getAllAvailableDraws } from "@/lib/data/remote-draws";
import type { Draw, DrawListResult, DrawRepository, ListDrawsOptions } from "@/types/lotto";

function sortByLatest(draws: Draw[]): Draw[] {
  return [...draws].sort((left, right) => right.round - left.round);
}

export class HybridDrawRepository implements DrawRepository {
  private async loadDraws(): Promise<Draw[]> {
    return getAllAvailableDraws();
  }

  async list(options: ListDrawsOptions = {}): Promise<DrawListResult> {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    const ordered = sortByLatest(await this.loadDraws());

    return {
      draws: ordered.slice(offset, offset + limit),
      total: ordered.length,
      hasMore: offset + limit < ordered.length
    };
  }

  async getByRound(round: number): Promise<Draw | null> {
    const draws = await this.loadDraws();
    return draws.find((draw) => draw.round === round) ?? null;
  }

  async getLatest(): Promise<Draw | null> {
    return (await this.loadDraws())[0] ?? null;
  }

  async getAll(): Promise<Draw[]> {
    return sortByLatest(await this.loadDraws());
  }
}

export const drawRepository: DrawRepository = new HybridDrawRepository();
