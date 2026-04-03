const fs = require("fs");

function loadEnvFile(path) {
  const entries = fs
    .readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.trim().startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");
      return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
    });

  return Object.fromEntries(entries);
}

async function main() {
  const env = loadEnvFile(".env.local");
  const body = {
    structuredQuery: {
      from: [{ collectionId: "lotto_draws" }],
      orderBy: [{ field: { fieldPath: "round" }, direction: "DESCENDING" }],
      limit: 3
    }
  };

  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery?key=${env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    }
  );

  const text = await response.text();
  console.log(text);
  process.exit(response.ok ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
