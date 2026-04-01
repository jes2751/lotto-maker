import { seedDraws } from "@/lib/data/seed-draws";
import { StaticGenerationService } from "@/lib/lotto/generation";
import { drawRepository } from "@/lib/lotto/repository";

export const generationService = new StaticGenerationService(seedDraws);

export { drawRepository } from "@/lib/lotto/repository";
export {
  computeAverageSum,
  computeConsecutiveSummary,
  computeDashboardSummary,
  computeFrequencyStats,
  computeOddEvenSummary,
  computeSumRangeSummary,
  findDrawsContainingNumber,
  getNumberFrequency,
  selectDrawsByPeriod
} from "@/lib/lotto/stats";
