import { localDraws } from "@/lib/data/local-draws";
import type { Draw } from "@/types/lotto";

function sortByLatest(draws: Draw[]) {
  return [...draws].sort((left, right) => right.round - left.round);
}

export async function getConfiguredOfficialDraws(): Promise<Draw[]> {
  return sortByLatest(localDraws);
}

export async function getAllAvailableDraws(): Promise<Draw[]> {
  return sortByLatest(localDraws);
}
