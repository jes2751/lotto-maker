import { loadScriptEnv } from "../src/lib/env/load-script-env";
import { listUnsettledGeneratedRecordsForRound, settleGeneratedRecordsForDraw } from "../src/lib/firebase/admin";
import { localDraws } from "../src/lib/data/local-draws";

async function run() {
  loadScriptEnv();
  const records = await listUnsettledGeneratedRecordsForRound(1219);
  console.log(`Unsettled records for round 1219: ${records.length}`);
  
  const draw1219 = localDraws.find(d => d.round === 1219);
  if (draw1219) {
    console.log(`Settling based on draw: ${JSON.stringify(draw1219)}`);
    const result = await settleGeneratedRecordsForDraw(draw1219);
    console.log(`Settle result: ${JSON.stringify(result)}`);
  }
}

run().catch(console.error);
