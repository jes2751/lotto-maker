"use client";

import { useEffect, useState } from "react";

import { getSeoulDateKey, getTodayVisitStorageKey } from "@/lib/site-visits";

type VisitState = {
  count: number | null;
  error: boolean;
};

export function TodayVisitBadge() {
  const [state, setState] = useState<VisitState>({ count: null, error: false });

  useEffect(() => {
    let ignore = false;
    const dateKey = getSeoulDateKey();
    const storageKey = getTodayVisitStorageKey(dateKey);

    const cleanupOldKeys = () => {
      if (typeof window === "undefined") {
        return;
      }

      for (const key of Object.keys(window.localStorage)) {
        if (key.startsWith("lotto-lab-visit:") && key !== storageKey) {
          window.localStorage.removeItem(key);
        }
      }
    };

    const load = async () => {
      cleanupOldKeys();
      const alreadyRecorded = window.localStorage.getItem(storageKey) === "1";
      const response = await fetch("/api/visits/today", {
        method: alreadyRecorded ? "GET" : "POST"
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        if (!ignore) {
          setState({ count: null, error: true });
        }
        return;
      }

      if (!alreadyRecorded) {
        window.localStorage.setItem(storageKey, "1");
      }

      if (!ignore) {
        setState({ count: Number(payload.data.count ?? 0), error: false });
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  if (state.error) {
    return null;
  }

  return (
    <p className="text-sm text-slate-400">
      today's visitor {state.count == null ? "-" : state.count.toLocaleString("ko-KR")}
    </p>
  );
}
