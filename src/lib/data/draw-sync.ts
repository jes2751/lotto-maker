import type { Draw } from "@/types/lotto";

const OFFICIAL_LOTTO_BASE_URL = "https://www.dhlottery.co.kr/lt645/selectPstLt645Info.do?srchLtEpsd=";

interface NewOfficialLottoDrawResponse {
  resultCode: string | null;
  resultMessage: string | null;
  data?: {
    list?: Array<{
      ltEpsd?: number;
      ltRflYmd?: string;
      tm1WnNo?: number;
      tm2WnNo?: number;
      tm3WnNo?: number;
      tm4WnNo?: number;
      tm5WnNo?: number;
      tm6WnNo?: number;
      bnsWnNo?: number;
      wholEpsdSumNtslAmt?: number;
      rnk1WnAmt?: number;
      rnk1WnNope?: number;
    }>;
  };
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

async function parseOfficialResponse(response: Response): Promise<NewOfficialLottoDrawResponse | null> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (!body.trim()) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(body) as NewOfficialLottoDrawResponse;
  }

  if (looksLikeHtmlResponse(body)) {
    return null;
  }

  try {
    return JSON.parse(body) as NewOfficialLottoDrawResponse;
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

export function normalizeOfficialDraw(payload: NewOfficialLottoDrawResponse): Draw {
  const list = payload.data?.list;
  if (!list || list.length === 0) {
    throw new Error("Official payload does not contain a successful draw.");
  }

  const rawDraw = list[0];
  const round = ensureInteger(rawDraw.ltEpsd, "ltEpsd");
  const numbers = [
    ensureInteger(rawDraw.tm1WnNo, "tm1WnNo"),
    ensureInteger(rawDraw.tm2WnNo, "tm2WnNo"),
    ensureInteger(rawDraw.tm3WnNo, "tm3WnNo"),
    ensureInteger(rawDraw.tm4WnNo, "tm4WnNo"),
    ensureInteger(rawDraw.tm5WnNo, "tm5WnNo"),
    ensureInteger(rawDraw.tm6WnNo, "tm6WnNo")
  ].sort((left, right) => left - right);

  const rawDate = String(rawDraw.ltRflYmd ?? "");
  const formattedDate = rawDate.length === 8
    ? rawDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
    : rawDate;

  const draw: Draw = {
    id: round,
    round,
    drawDate: formattedDate,
    numbers,
    bonus: ensureInteger(rawDraw.bnsWnNo, "bnsWnNo"),
    totalPrize: rawDraw.wholEpsdSumNtslAmt ?? null,
    firstPrize: rawDraw.rnk1WnAmt ?? null,
    winnerCount: rawDraw.rnk1WnNope ?? null
  };

  return validateDraw(draw);
}

export async function fetchOfficialDraw(round: number): Promise<Draw | null> {
  const url = `${OFFICIAL_LOTTO_BASE_URL}${round}&_=${Date.now()}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  if (!response.ok) {
    throw new Error(`Official draw request failed with status ${response.status}.`);
  }

  const payload = await parseOfficialResponse(response);

  if (!payload || !payload.data?.list || payload.data.list.length === 0) {
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

export async function fetchNewOfficialDraws(lastKnownRound: number): Promise<Draw[]> {
  const draws: Draw[] = [];
  let round = lastKnownRound + 1;

  while (true) {
    const draw = await fetchOfficialDraw(round);

    if (!draw) {
      break;
    }

    draws.push(draw);
    round += 1;
    // 과도한 트래픽 차단 방지를 위한 딜레이
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return draws;
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

export function serializeDrawsModule(draws: Draw[], exportName = "seedDraws"): string {
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

  return `import type { Draw } from "@/types/lotto";\n\nexport const ${exportName}: Draw[] = [\n${lines.join(",\n")}\n];\n`;
}

export function serializeSeedDrawsModule(draws: Draw[]): string {
  return serializeDrawsModule(draws, "seedDraws");
}
