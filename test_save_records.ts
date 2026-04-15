import { loadScriptEnv } from "./src/lib/env/load-script-env";
import { saveGeneratedRecords } from "./src/lib/firebase/admin";

async function run() {
  loadScriptEnv();
  const generatedAt = new Date().toISOString();

  try {
    const res = await saveGeneratedRecords({
      requestId: `manual-test-${Date.now()}`,
      responseSets: [
        {
          id: "manual-test-set-0",
          strategy: "filter",
          numbers: [1, 2, 3, 4, 5, 6],
          bonus: undefined,
          reason: "test",
          generatedAt
        }
      ],
      records: [
        {
          anonymousId: "test-anon",
          strategy: "filter",
          numbers: [1, 2, 3, 4, 5, 6],
          bonus: null,
          reason: "test",
          generatedAt,
          targetRound: 1220,
          filters: {
            fixedNumbers: [1, 2, 3, 4, 5, 6],
            excludedNumbers: [],
            oddEven: "any",
            sumMin: null,
            sumMax: null,
            allowConsecutive: true
          }
        }
      ]
    });
    console.log("Success:", res);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
