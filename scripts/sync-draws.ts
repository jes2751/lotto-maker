import { writeFile } from "node:fs/promises";
import path from "node:path";

import { fetchLatestOfficialDrawSince, mergeDraws, serializeDrawsModule, shouldRunSundaySync } from "../src/lib/data/draw-sync";
import { localDraws } from "../src/lib/data/local-draws";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const baseDraws = [...localDraws].sort((left, right) => left.round - right.round);
  const lastKnownRound = Math.max(...baseDraws.map((draw) => draw.round));
  const latestDraw = await fetchLatestOfficialDrawSince(lastKnownRound);

  if (!shouldRunSundaySync() && !dryRun) {
    console.warn("Warning: draw sync is designed for Sunday runs in Asia/Seoul.");
  }

  if (!latestDraw) {
    console.log(`No new official draw found after round ${lastKnownRound}.`);
    return;
  }

  const merged = mergeDraws(baseDraws, latestDraw);

  if (dryRun) {
    console.log(`Latest official draw: ${latestDraw.round} (${latestDraw.drawDate})`);
    console.log(JSON.stringify(latestDraw, null, 2));
    return;
  }

  const targetPath = path.join(process.cwd(), "src", "lib", "data", "local-draws.ts");
  const descending = [...merged].sort((left, right) => right.round - left.round);
  await writeFile(targetPath, serializeDrawsModule(descending, "localDraws"), "utf8");
  console.log(`Updated local draw archive through round ${latestDraw.round}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
