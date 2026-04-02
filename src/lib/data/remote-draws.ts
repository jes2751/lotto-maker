import { unstable_cache } from "next/cache";

import { seedDraws } from "@/lib/data/seed-draws";
import { getAllStoredLottoDraws, hasFirestoreAdminEnv } from "@/lib/firebase/admin";
import type { Draw } from "@/types/lotto";

export const getCachedOfficialDraws = unstable_cache(
  async () => {
    if (!hasFirestoreAdminEnv()) {
      return [];
    }
    const stored = await getAllStoredLottoDraws();
    return stored;
  },
  ["official-draws-v1"],
  {
    revalidate: 21600 // 6 hours
  }
);

function mergeDrawSets(primaryDraws: Draw[], fallbackDraws: Draw[]): Draw[] {
  const drawMap = new Map<number, Draw>();

  for (const draw of fallbackDraws) {
    drawMap.set(draw.round, draw);
  }

  for (const draw of primaryDraws) {
    drawMap.set(draw.round, draw);
  }

  return [...drawMap.values()].sort((left, right) => right.round - left.round);
}

export async function getAllAvailableDraws(): Promise<Draw[]> {
  if (process.env.LOTTO_REMOTE_DATA_DISABLED === "1") {
    return [...seedDraws].sort((left, right) => right.round - left.round);
  }

  try {
    const cachedDraws = await getCachedOfficialDraws();
    return mergeDrawSets(cachedDraws, seedDraws);
  } catch (error) {
    console.warn("Failed to fetch official draws from Firestore cache. Falling back to seed.", error);
    return [...seedDraws].sort((left, right) => right.round - left.round);
  }
}
