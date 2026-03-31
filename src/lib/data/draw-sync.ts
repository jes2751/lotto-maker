import type { Draw } from "@/types/lotto";

const OFFICIAL_LOTTO_BASE_URL = "https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=";

interface OfficialLottoDrawResponse {
  returnValue?: string;
  drwNo?: number;
  drwNoDate?: string;
  drwtNo1?: number;
  drwtNo2?: number;
  drwtNo3?: number;
  drwtNo4?: number;
  drwtNo5?: number;
  drwtNo6?: number;
  bnusNo?: number;
  totSellamnt?: number;
  firstWinamnt?: number;
  firstPrzwnerCo?: number;
}

function ensureInteger(value: unknown, fieldName: string): number {
  if (!Number.isInteger(value)) {
    throw new Error(`${fieldName} must be an integer.`);
  }

  return value as number;
}

function validateNumberRange(value: number, fieldName: string) {
  if (value < 1 || value > 45) {
    throw new Error(`${fieldName} must be between 1 and 45.`);
  }
}

function looksLikeHtmlResponse(body: string): boolean {
  const trimmed = body.trimStart();
  return trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || trimmed.startsWith("<");
}

async function parseOfficialResponse(response: Response): Promise<OfficialLottoDrawResponse | null> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (!body.trim()) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(body) as OfficialLottoDrawResponse;
  }

  if (looksLikeHtmlResponse(body)) {
    return null;
  }

  try {
    return JSON.parse(body) as OfficialLottoDrawResponse;
  } catch {
    return null;
  }
}

export function validateDraw(draw: Draw): Draw {
  if (!Number.isInteger(draw.round) || draw.round < 1) {
    throw new Error("round must be a positive integer.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(draw.drawDate)) {
    throw new Error("drawDate must use YYYY-MM-DD.");
  }

  if (draw.numbers.length !== 6) {
    throw new Error("numbers must contain exactly six values.");
  }

  draw.numbers.forEach((number, index) => validateNumberRange(number, `numbers[${index}]`));
  validateNumberRange(draw.bonus, "bonus");

  const sortedNumbers = [...draw.numbers].sort((left, right) => left - right);
  if (sortedNumbers.some((number, index) => number !== draw.numbers[index])) {
    throw new Error("numbers must be sorted in ascending order.");
  }

  if (new Set(draw.numbers).size !== draw.numbers.length) {
    throw new Error("numbers must not contain duplicates.");
  }

  if (draw.numbers.includes(draw.bonus)) {
    throw new Error("bonus must not duplicate a main number.");
  }

  return draw;
}

export function normalizeOfficialDraw(payload: OfficialLottoDrawResponse): Draw {
  if (payload.returnValue !== "success") {
    throw new Error("Official payload does not contain a successful draw.");
  }

  const round = ensureInteger(payload.drwNo, "drwNo");
  const numbers = [
    ensureInteger(payload.drwtNo1, "drwtNo1"),
    ensureInteger(payload.drwtNo2, "drwtNo2"),
    ensureInteger(payload.drwtNo3, "drwtNo3"),
    ensureInteger(payload.drwtNo4, "drwtNo4"),
    ensureInteger(payload.drwtNo5, "drwtNo5"),
    ensureInteger(payload.drwtNo6, "drwtNo6")
  ].sort((left, right) => left - right);

  const draw: Draw = {
    id: round,
    round,
    drawDate: String(payload.drwNoDate ?? ""),
    numbers,
    bonus: ensureInteger(payload.bnusNo, "bnusNo"),
    totalPrize: payload.totSellamnt ?? null,
    firstPrize: payload.firstWinamnt ?? null,
    winnerCount: payload.firstPrzwnerCo ?? null
  };

  return validateDraw(draw);
}

export async function fetchOfficialDraw(round: number): Promise<Draw | null> {
  const response = await fetch(`${OFFICIAL_LOTTO_BASE_URL}${round}`, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Official draw request failed with status ${response.status}.`);
  }

  const payload = await parseOfficialResponse(response);

  if (!payload || payload.returnValue !== "success") {
    return null;
  }

  return normalizeOfficialDraw(payload);
}

export async function fetchLatestOfficialDrawSince(lastKnownRound: number, maxLookahead = 4): Promise<Draw | null> {
  let latestDraw: Draw | null = null;

  for (let round = lastKnownRound + 1; round <= lastKnownRound + maxLookahead; round += 1) {
    const draw = await fetchOfficialDraw(round);

    if (!draw) {
      break;
    }

    latestDraw = draw;
  }

  return latestDraw;
}

export function mergeDraws(existing: Draw[], incoming: Draw): Draw[] {
  const filtered = existing.filter((draw) => draw.round !== incoming.round);
  const merged = [...filtered, incoming].sort((left, right) => left.round - right.round);

  const seen = new Set<number>();
  for (const draw of merged) {
    if (seen.has(draw.round)) {
      throw new Error(`Duplicate round detected: ${draw.round}`);
    }

    seen.add(draw.round);
    validateDraw(draw);
  }

  return merged;
}

export function shouldRunSundaySync(date = new Date(), timeZone = "Asia/Seoul"): boolean {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone
  });

  return formatter.format(date) === "Sun";
}

export function serializeSeedDrawsModule(draws: Draw[]): string {
  const lines = draws.map((draw) => {
    const optionalFields = [
      draw.totalPrize != null ? `totalPrize: ${draw.totalPrize}` : null,
      draw.firstPrize != null ? `firstPrize: ${draw.firstPrize}` : null,
      draw.winnerCount != null ? `winnerCount: ${draw.winnerCount}` : null
    ]
      .filter(Boolean)
      .join(", ");

    const suffix = optionalFields ? `, ${optionalFields}` : "";

    return `  { id: ${draw.id}, round: ${draw.round}, drawDate: "${draw.drawDate}", numbers: [${draw.numbers.join(", ")}], bonus: ${draw.bonus}${suffix} }`;
  });

  return `import type { Draw } from "@/types/lotto";\n\nexport const seedDraws: Draw[] = [\n${lines.join(",\n")}\n];\n`;
}
