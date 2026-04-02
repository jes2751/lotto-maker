import { jsonError, jsonSuccess } from "@/lib/http";
import { getDailyVisitMetric, hasFirestoreAdminEnv, incrementDailyVisitMetric } from "@/lib/firebase/admin";
import { getSeoulDateKey } from "@/lib/site-visits";

function getPayload(count: number, dateKey: string) {
  return {
    dateKey,
    count
  };
}

export async function GET() {
  if (!hasFirestoreAdminEnv()) {
    return jsonSuccess(getPayload(0, getSeoulDateKey()));
  }

  try {
    const dateKey = getSeoulDateKey();
    const metric = await getDailyVisitMetric(dateKey);
    return jsonSuccess(getPayload(metric.count, dateKey));
  } catch {
    return jsonError("VISIT_METRIC_ERROR", "오늘 방문 수를 불러오지 못했습니다.", 500);
  }
}

export async function POST() {
  if (!hasFirestoreAdminEnv()) {
    return jsonSuccess(getPayload(0, getSeoulDateKey()));
  }

  try {
    const dateKey = getSeoulDateKey();
    const metric = await incrementDailyVisitMetric(dateKey);
    return jsonSuccess(getPayload(metric.count, dateKey));
  } catch {
    return jsonError("VISIT_METRIC_ERROR", "오늘 방문 수를 기록하지 못했습니다.", 500);
  }
}
