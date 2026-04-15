import { getGeneratedRoundStats, listGeneratedRecordsForRound } from "@/lib/firebase/admin";
import { buildGeneratedStatsViewModel, getTargetRound, type GeneratedStatsSnapshot } from "@/lib/generated-stats/shared";
import type { Draw } from "@/types/lotto";

export async function getGeneratedStatsSnapshot(latestDraw: Draw | null): Promise<GeneratedStatsSnapshot> {
  const currentTargetRound = getTargetRound(latestDraw);

  if (currentTargetRound) {
    const aggregate = await getGeneratedRoundStats(currentTargetRound);
    const recentRecords = await listGeneratedRecordsForRound(currentTargetRound, 4);

    if (aggregate) {
      return {
        ...aggregate,
        view: {
          ...aggregate.view,
          recentRecords: recentRecords.length > 0 ? recentRecords : aggregate.view.recentRecords
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

  return {
    source: sourceRecordCount > 0 ? "recomputed" : "empty",
    computedAt: sourceRecordCount > 0 ? new Date().toISOString() : null,
    sourceRecordCount,
    view: buildGeneratedStatsViewModel(allRecords, latestDraw, recentRecords)
  };
}
