import { loadScriptEnv } from "../src/lib/env/load-script-env";
import { syncFirestoreDraws } from "../src/lib/data/firestore-draw-sync";

async function main() {
  loadScriptEnv();
  const forceSeedAll = process.argv.includes("--seed-all");
  const result = await syncFirestoreDraws({ forceSeedAll });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
