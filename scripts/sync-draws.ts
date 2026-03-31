import { writeFile } from "node:fs/promises";
import path from "node:path";

import { seedDraws } from "../src/lib/data/seed-draws";
import { fetchLatestOfficialDrawSince, mergeDraws, serializeSeedDrawsModule, shouldRunSundaySync } from "../src/lib/data/draw-sync";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const lastKnownRound = Math.max(...seedDraws.map((draw) => draw.round));
  const latestDraw = await fetchLatestOfficialDrawSince(lastKnownRound);

  if (!shouldRunSundaySync() && !dryRun) {
    console.warn("Warning: draw sync is designed for Sunday runs in Asia/Seoul.");
  }

  if (!latestDraw) {
    console.log(`No new official draw found after round ${lastKnownRound}.`);
    return;
  }

  const merged = mergeDraws(seedDraws, latestDraw);

  if (dryRun) {
    console.log(`Latest official draw: ${latestDraw.round} (${latestDraw.drawDate})`);
    console.log(JSON.stringify(latestDraw, null, 2));
    return;
  }

  const targetPath = path.join(process.cwd(), "src", "lib", "data", "seed-draws.ts");
  await writeFile(targetPath, serializeSeedDrawsModule(merged), "utf8");
  console.log(`Updated seed data through round ${latestDraw.round}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
