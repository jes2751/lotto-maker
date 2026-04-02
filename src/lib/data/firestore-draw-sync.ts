import { getAllAvailableDraws } from "@/lib/data/remote-draws";
import { fetchOfficialDraw } from "@/lib/data/draw-sync";
import {
  getLatestStoredLottoDraw,
  hasFirestoreAdminEnv,
  settleGeneratedRecordsForDraw,
  upsertLottoDrawRecords
} from "@/lib/firebase/admin";
import type { Draw } from "@/types/lotto";

export interface FirestoreDrawSyncResult {
  mode: "seed" | "sync" | "noop";
  lastKnownRound: number;
  latestRound: number;
  writtenCount: number;
  settledCount: number;
}

export async function getDrawsToSyncFromOfficial(lastKnownRound: number, maxLookahead = 20) {
  const draws: Draw[] = [];

  for (let round = lastKnownRound + 1; round <= lastKnownRound + maxLookahead; round += 1) {
    const draw = await fetchOfficialDraw(round);

    if (!draw) {
      break;
    }

    draws.push(draw);
  }

  return draws;
}

export async function syncFirestoreDraws(options?: { forceSeedAll?: boolean }) {
  if (!hasFirestoreAdminEnv()) {
    throw new Error(
      "Firestore admin environment variables are missing. Set FIREBASE_SERVICE_ACCOUNT_EMAIL and FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY in .env.local."
    );
  }

  const latestStoredDraw = await getLatestStoredLottoDraw();

  if (!latestStoredDraw || options?.forceSeedAll) {
    const allDraws = await getAllAvailableDraws();
    const normalized = [...allDraws].sort((left, right) => left.round - right.round);
    const result = await upsertLottoDrawRecords(normalized);

    return {
      mode: "seed",
      lastKnownRound: latestStoredDraw?.round ?? 0,
      latestRound: normalized.at(-1)?.round ?? 0,
      writtenCount: result.written,
      settledCount: 0
    } satisfies FirestoreDrawSyncResult;
  }

  const incomingDraws = await getDrawsToSyncFromOfficial(latestStoredDraw.round);

  if (incomingDraws.length === 0) {
    return {
      mode: "noop",
      lastKnownRound: latestStoredDraw.round,
      latestRound: latestStoredDraw.round,
      writtenCount: 0,
      settledCount: 0
    } satisfies FirestoreDrawSyncResult;
  }

  const result = await upsertLottoDrawRecords(incomingDraws);
  const settlementResults = await Promise.all(incomingDraws.map((draw) => settleGeneratedRecordsForDraw(draw)));
  const settledCount = settlementResults.reduce((sum, item) => sum + item.settled, 0);

  return {
    mode: "sync",
    lastKnownRound: latestStoredDraw.round,
    latestRound: incomingDraws.at(-1)?.round ?? latestStoredDraw.round,
    writtenCount: result.written,
    settledCount
  } satisfies FirestoreDrawSyncResult;
}
