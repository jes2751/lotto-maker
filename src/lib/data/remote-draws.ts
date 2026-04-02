import { unstable_cache } from "next/cache";

import { seedDraws } from "@/lib/data/seed-draws";
import { getAllPublicStoredLottoDraws, getAllStoredLottoDraws, hasFirestoreAdminEnv, hasFirestorePublicEnv } from "@/lib/firebase/admin";
import type { Draw } from "@/types/lotto";

export async function getConfiguredOfficialDraws(): Promise<Draw[]> {
  if (hasFirestoreAdminEnv()) {
    try {
      return await getAllStoredLottoDraws();
    } catch (error) {
      if (hasFirestorePublicEnv()) {
        console.warn("Firestore admin draw fetch failed. Retrying with public Firestore access.", error);
        return getAllPublicStoredLottoDraws();
      }

      throw error;
    }
  }

  if (hasFirestorePublicEnv()) {
    return getAllPublicStoredLottoDraws();
  }

  return [];
}

export const getCachedOfficialDraws = unstable_cache(
  async () => getConfiguredOfficialDraws(),
  ["official-draws-v2"],
  {
    revalidate: 21600 // 6 hours
  }
);

async function getOfficialDraws() {
  try {
    const cachedDraws = await getCachedOfficialDraws();

    if (cachedDraws.length === 0 && (hasFirestoreAdminEnv() || hasFirestorePublicEnv())) {
      return getConfiguredOfficialDraws();
    }

    return cachedDraws;
  } catch (error) {
    if (error instanceof Error && error.message.includes("incrementalCache missing in unstable_cache")) {
      return getConfiguredOfficialDraws();
    }

    throw error;
  }
}

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
    const cachedDraws = await getOfficialDraws();
    return mergeDrawSets(cachedDraws, seedDraws);
  } catch (error) {
    console.warn("Failed to fetch official draws from Firestore. Falling back to seed.", error);
    return [...seedDraws].sort((left, right) => right.round - left.round);
  }
}
