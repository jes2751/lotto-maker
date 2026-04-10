import fs from "node:fs";
import path from "node:path";

function loadEnvFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_ADMIN_PROJECT_ID;

if (!apiKey || !projectId) {
  console.error("Missing Firebase public env");
  process.exit(1);
}

const documentId = `codex_probe_${Date.now()}`;
const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/generated_records?documentId=${documentId}&key=${apiKey}`;

const body = {
  fields: {
    anonymousId: { stringValue: "codex-probe" },
    strategy: { stringValue: "mixed" },
    numbers: { arrayValue: { values: [{ integerValue: "1" }, { integerValue: "2" }, { integerValue: "3" }, { integerValue: "4" }, { integerValue: "5" }, { integerValue: "6" }] } },
    bonus: { integerValue: "7" },
    reason: { stringValue: "probe" },
    generatedAt: { stringValue: new Date().toISOString() },
    targetRound: { integerValue: "1219" },
    filters: { mapValue: { fields: { fixedNumbers: { arrayValue: { values: [] } }, excludedNumbers: { arrayValue: { values: [] } }, oddEven: { stringValue: "any" }, sumMin: { nullValue: null }, sumMax: { nullValue: null }, allowConsecutive: { booleanValue: true } } } },
    createdAt: { stringValue: new Date().toISOString() },
    createdSource: { stringValue: "generator" },
    matchedRound: { nullValue: null },
    matchCount: { nullValue: null },
    bonusMatched: { booleanValue: false },
    settledAt: { nullValue: null }
  }
};

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

console.log("STATUS", response.status);
console.log(await response.text());
