import { loadScriptEnv } from "../src/lib/env/load-script-env";
import { getAllStoredLottoDraws, getLatestStoredLottoDraw } from "../src/lib/firebase/admin";

async function main() {
  loadScriptEnv();

  const latest = await getLatestStoredLottoDraw();
  const draws = await getAllStoredLottoDraws();

  console.log(
    JSON.stringify(
      {
        latestRound: latest?.round ?? null,
        count: draws.length,
        topRounds: draws.slice(0, 3).map((draw) => draw.round)
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
