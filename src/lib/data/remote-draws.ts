import { seedDraws } from "@/lib/data/seed-draws";
import { validateDraw } from "@/lib/data/draw-sync";
import type { Draw } from "@/types/lotto";

const ALL_DRAWS_URL = "https://smok95.github.io/lotto/results/all.json";

interface RemoteDivision {
  prize?: number;
  winners?: number;
}

interface RemoteDraw {
  draw_no: number;
  numbers: number[];
  bonus_no: number;
  date: string;
  divisions?: RemoteDivision[];
  total_sales_amount?: number;
}

function toDraw(remoteDraw: RemoteDraw): Draw {
  const firstDivision = remoteDraw.divisions?.find((division) => typeof division.prize === "number" || typeof division.winners === "number");

  return validateDraw({
    id: remoteDraw.draw_no,
    round: remoteDraw.draw_no,
    drawDate: remoteDraw.date.slice(0, 10),
    numbers: [...remoteDraw.numbers].sort((left, right) => left - right),
    bonus: remoteDraw.bonus_no,
    totalPrize: remoteDraw.total_sales_amount ?? null,
    firstPrize: firstDivision?.prize ?? null,
    winnerCount: firstDivision?.winners ?? null
  });
}

function mergeDrawSets(remoteDraws: Draw[], fallbackDraws: Draw[]): Draw[] {
  const drawMap = new Map<number, Draw>();

  for (const draw of fallbackDraws) {
    drawMap.set(draw.round, draw);
  }

  for (const draw of remoteDraws) {
    drawMap.set(draw.round, draw);
  }

  return [...drawMap.values()].sort((left, right) => right.round - left.round);
}

export async function fetchAllRemoteDraws(): Promise<Draw[]> {
  const response = await fetch(ALL_DRAWS_URL, {
    headers: {
      Accept: "application/json"
    },
    next: {
      revalidate: 21600
    }
  });

  if (!response.ok) {
    throw new Error(`Remote draw dataset request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as RemoteDraw[];

  if (!Array.isArray(payload)) {
    throw new Error("Remote draw dataset returned an unexpected payload.");
  }

  return payload.map(toDraw);
}

export async function getAllAvailableDraws(): Promise<Draw[]> {
  if (process.env.LOTTO_REMOTE_DATA_DISABLED === "1") {
    return [...seedDraws].sort((left, right) => right.round - left.round);
  }

  try {
    const remoteDraws = await fetchAllRemoteDraws();
    return mergeDrawSets(remoteDraws, seedDraws);
  } catch {
    return [...seedDraws].sort((left, right) => right.round - left.round);
  }
}
