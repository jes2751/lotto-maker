import { jsonError, jsonSuccess } from "@/lib/http";
import { generationService } from "@/lib/lotto";
import { isValidStrategy } from "@/lib/lotto/shared";

interface GenerateRequestBody {
  strategy?: string;
  count?: number;
  include_bonus?: boolean;
}

export async function POST(request: Request) {
  let body: GenerateRequestBody;

  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return jsonError("VALIDATION_ERROR", "JSON 본문을 읽을 수 없습니다.");
  }

  const strategy = body.strategy ?? "mixed";
  const count = typeof body.count === "number" ? body.count : 1;
  const includeBonus = body.include_bonus ?? true;

  if (!isValidStrategy(strategy)) {
    return jsonError("VALIDATION_ERROR", "지원하지 않는 생성 전략입니다.");
  }

  if (!Number.isInteger(count) || count < 1 || count > 5) {
    return jsonError("VALIDATION_ERROR", "count는 1 이상 5 이하여야 합니다.");
  }

  const sets = await generationService.generate({
    strategy,
    count,
    includeBonus
  });

  return jsonSuccess({ sets });
}
