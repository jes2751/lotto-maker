import { jsonError, jsonSuccess } from "@/lib/http";
import { drawRepository } from "@/lib/lotto";

export async function GET(_: Request, context: { params: { round: string } }) {
  const round = Number.parseInt(context.params.round, 10);

  if (Number.isNaN(round) || round < 1) {
    return jsonError("VALIDATION_ERROR", "유효한 회차를 입력해 주세요.");
  }

  const draw = await drawRepository.getByRound(round);

  if (!draw) {
    return jsonError("NOT_FOUND", "해당 회차를 찾을 수 없습니다.", 404);
  }

  return jsonSuccess(draw);
}
