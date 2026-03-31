import { jsonSuccess } from "@/lib/http";
import { drawRepository } from "@/lib/lotto";

export async function GET() {
  const latest = await drawRepository.getLatest();

  return jsonSuccess({
    status: "healthy",
    dataSource: "seed",
    lastDrawUpdate: latest?.drawDate ?? null,
    version: "1.0.0"
  });
}
