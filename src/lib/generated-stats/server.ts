import {
  getGeneratedRoundStats,
  listGeneratedRecordsForRound,
  saveGeneratedRoundStatsSnapshot
} from "@/lib/firebase/admin";
import { buildGeneratedStatsViewModel, getTargetRound, type GeneratedStatsSnapshot } from "@/lib/generated-stats/shared";
import type { Draw } from "@/types/lotto";

export async function getGeneratedStatsSnapshot(latestDraw: Draw | null): Promise<GeneratedStatsSnapshot> {
  const currentTargetRound = getTargetRound(latestDraw);

  if (currentTargetRound) {
    const aggregate = await getGeneratedRoundStats(currentTargetRound);

    if (aggregate) {
      let recentRecords = aggregate.view.recentRecords;

      try {
        const fetchedRecentRecords = await listGeneratedRecordsForRound(currentTargetRound, 4);
        if (fetchedRecentRecords.length > 0) {
          recentRecords = fetchedRecentRecords;
        }
      } catch (error) {
        console.warn("[generated-stats] failed to load recent records for aggregate snapshot", error);
      }

      return {
        ...aggregate,
        view: {
          ...aggregate.view,
          recentRecords
        }
      };
    }
  }

  const [currentRecords, evaluatedRecords] = await Promise.all([
    currentTargetRound ? listGeneratedRecordsForRound(currentTargetRound) : Promise.resolve([]),
    latestDraw ? listGeneratedRecordsForRound(latestDraw.round) : Promise.resolve([])
  ]);

  const recentRecords = currentRecords.slice(0, 4);
  const allRecords = [...currentRecords, ...evaluatedRecords];
  const sourceRecordCount = allRecords.length;
  const recomputedSnapshot: GeneratedStatsSnapshot = {
    source: "recomputed",
    computedAt: sourceRecordCount > 0 ? new Date().toISOString() : null,
    sourceRecordCount,
    view: buildGeneratedStatsViewModel(allRecords, latestDraw, recentRecords)
  };

  if (currentTargetRound && sourceRecordCount > 0) {
    try {
      await saveGeneratedRoundStatsSnapshot(currentTargetRound, recomputedSnapshot);
      return {
        ...recomputedSnapshot,
        source: "aggregate"
      };
    } catch (error) {
      console.warn("[generated-stats] failed to backfill aggregate snapshot", error);
    }
  }

  return {
    ...recomputedSnapshot,
    source: sourceRecordCount > 0 ? "recomputed" : "empty"
  };
}
