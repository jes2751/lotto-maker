import { writeFile } from "node:fs/promises";
import path from "node:path";
import { mergeDraws, serializeDrawsModule } from "../src/lib/data/draw-sync";
import { localDraws } from "../src/lib/data/local-draws";
import type { Draw } from "../src/types/lotto";
import { loadScriptEnv } from "../src/lib/env/load-script-env";
import { settleGeneratedRecordsForDraw, upsertLottoDrawRecords } from "../src/lib/firebase/admin";
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 8) {
    console.error("Usage: npm run sync:manual <round> <date:YYYY-MM-DD> <num1,num2,num3,num4,num5,num6> <bonus> <totalPrize> <firstPrize> <winnerCount>");
    console.error("Example: npm run sync:manual 1220 2026-04-18 5,10,15,20,30,40 45 10000000000 2000000000 5");
    process.exit(1);
  }

  const round = parseInt(args[0], 10);
  const drawDate = args[1];
  const numbers = args[2].split(",").map((n) => parseInt(n.trim(), 10)).sort((a, b) => a - b);
  const bonus = parseInt(args[3], 10);
  const totalPrize = parseInt(args[4], 10);
  const firstPrize = parseInt(args[5], 10);
  const winnerCount = parseInt(args[6], 10);

  const incomingDraw: Draw = {
    id: round,
    round,
    drawDate,
    numbers,
    bonus,
    totalPrize,
    firstPrize,
    winnerCount
  };

  const baseDraws = [...localDraws].sort((left, right) => left.round - right.round);
  
  // Merge and validate
  const merged = mergeDraws(baseDraws, incomingDraw);
  const descending = [...merged].sort((left, right) => right.round - left.round);
  
  const targetPath = path.join(process.cwd(), "src", "lib", "data", "local-draws.ts");
  await writeFile(targetPath, serializeDrawsModule(descending, "localDraws"), "utf8");
  console.log(`✅ Successfully injected manual draw data for round ${round} into local-draws.ts!`);
  
  console.log("==> Starting Firestore Sync & Settling...");
  loadScriptEnv();
  
  // 1. Push draw to Firestore
  try {
    await upsertLottoDrawRecords([incomingDraw]);
    console.log(`✅ Successfully pushed draw ${round} to Firestore.`);
  } catch (error) {
    console.error("❌ Failed to push draw to Firestore. Did you set .env.local credentials?", error);
    process.exit(1);
  }

  // 2. Settle Generated Records
  try {
    const settleResult = await settleGeneratedRecordsForDraw(incomingDraw);
    console.log(`✅ Successfully settled ${settleResult.settled} records for round ${round}!`);
  } catch (error) {
    console.error("❌ Failed to settle generated records.", error);
    process.exit(1);
  }

  console.log(`\n🎉 All done! Next step: Commit the modified local-draws.ts to Git.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
