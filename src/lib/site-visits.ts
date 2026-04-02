export const SITE_VISIT_TIMEZONE = "Asia/Seoul";
export const SITE_VISIT_STORAGE_PREFIX = "lotto-lab-visit";

export function getSeoulDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_VISIT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function getTodayVisitStorageKey(dateKey: string) {
  return `${SITE_VISIT_STORAGE_PREFIX}:${dateKey}`;
}
