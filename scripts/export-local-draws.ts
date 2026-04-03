import fs from "node:fs";
import path from "node:path";

import { loadScriptEnv } from "../src/lib/env/load-script-env";
import { getAllStoredLottoDraws } from "../src/lib/firebase/admin";
import type { Draw } from "../src/types/lotto";

function isDraw(value: unknown): value is Draw {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Draw>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.round === "number" &&
    typeof candidate.drawDate === "string" &&
    Array.isArray(candidate.numbers) &&
    candidate.numbers.length === 6 &&
    typeof candidate.bonus === "number"
  );
}

function toPlainDraw(draw: {
  id: number;
  round: number;
  drawDate: string;
  numbers: number[];
  bonus: number;
  totalPrize?: number | null;
  firstPrize?: number | null;
  winnerCount?: number | null;
}): Draw {
  return {
    id: Number(draw.id),
    round: Number(draw.round),
    drawDate: String(draw.drawDate),
    numbers: [...draw.numbers].map(Number),
    bonus: Number(draw.bonus),
    totalPrize: draw.totalPrize == null ? null : Number(draw.totalPrize),
    firstPrize: draw.firstPrize == null ? null : Number(draw.firstPrize),
    winnerCount: draw.winnerCount == null ? null : Number(draw.winnerCount)
  };
}

function tryLoadFromOpenNextCache(): Draw[] {
  const fetchCacheDir = path.join(process.cwd(), ".open-next", "cache", "__fetch");

  if (!fs.existsSync(fetchCacheDir)) {
    return [];
  }

  const candidates: Draw[][] = [];
  const stack = [fetchCacheDir];

  while (stack.length > 0) {
    const current = stack.pop()!;

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      try {
        const raw = fs.readFileSync(fullPath, "utf8");
        const payload = JSON.parse(raw) as { data?: { body?: string } };

        if (!payload.data?.body) {
          continue;
        }

        const parsed = JSON.parse(payload.data.body) as unknown;

        if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isDraw)) {
          continue;
        }

        candidates.push(parsed.map((draw) => toPlainDraw(draw)));
      } catch {
        continue;
      }
    }
  }

  return candidates.sort((left, right) => right.length - left.length)[0] ?? [];
}

async function main() {
  loadScriptEnv();
  let draws: Draw[] = [];

  try {
    draws = await getAllStoredLottoDraws();
  } catch (error) {
    console.warn("Firestore export failed, falling back to .open-next fetch cache.", error);
    draws = tryLoadFromOpenNextCache();
  }

  if (draws.length === 0) {
    throw new Error("Could not load draws from Firestore or local .open-next cache.");
  }

  const normalized = draws.map((draw) => toPlainDraw(draw));
  const outputPath = path.join(process.cwd(), "src", "lib", "data", "local-draws.ts");
  const file = `import type { Draw } from "@/types/lotto";

export const localDraws: Draw[] = ${JSON.stringify(normalized, null, 2)};
`;

  fs.writeFileSync(outputPath, file, "utf8");
  console.log(`Wrote ${normalized.length} draws to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
