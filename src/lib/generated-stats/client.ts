"use client";

const ANONYMOUS_ID_STORAGE_KEY = "lotto-lab-anonymous-id";

function createRandomId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createRequestId() {
  return createRandomId("req");
}

export function getAnonymousId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const nextValue = createRandomId("anon");
  window.localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, nextValue);
  return nextValue;
}
