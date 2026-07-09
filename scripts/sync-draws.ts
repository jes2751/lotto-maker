import { writeFile } from "node:fs/promises";
import path from "node:path";

import { fetchNewOfficialDraws, mergeDraws, serializeDrawsModule, shouldRunSundaySync } from "../src/lib/data/draw-sync";
import { localDraws } from "../src/lib/data/local-draws";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const baseDraws = [...localDraws].sort((left, right) => left.round - right.round);
  const lastKnownRound = Math.max(...baseDraws.map((draw) => draw.round));

  console.log(`Fetching new official draws starting after round ${lastKnownRound}...`);
  const newDraws = await fetchNewOfficialDraws(lastKnownRound);

  if (!shouldRunSundaySync() && !dryRun) {
    console.warn("Warning: draw sync is designed for Sunday runs in Asia/Seoul.");
  }

  if (newDraws.length === 0) {
    console.log(`No new official draws found after round ${lastKnownRound}.`);
    return;
  }

  console.log(`Found ${newDraws.length} new official draw(s).`);

  if (dryRun) {
    console.log("--- Dry-run: Retrieved draws ---");
    for (const draw of newDraws) {
      console.log(`Round ${draw.round} (${draw.drawDate}): numbers=[${draw.numbers.join(", ")}], bonus=${draw.bonus}`);
    }
    return;
  }

  let merged = baseDraws;
  for (const draw of newDraws) {
    merged = mergeDraws(merged, draw);
  }

  const targetPath = path.join(process.cwd(), "src", "lib", "data", "local-draws.ts");
  const descending = [...merged].sort((left, right) => right.round - left.round);
  await writeFile(targetPath, serializeDrawsModule(descending, "localDraws"), "utf8");

  const finalLatestRound = newDraws[newDraws.length - 1].round;
  console.log(`Updated local draw archive through round ${finalLatestRound}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
