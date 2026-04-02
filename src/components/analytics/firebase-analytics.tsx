"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirebaseApp } from "@/lib/firebase/client";

export function FirebaseAnalytics() {
  useEffect(() => {
    let cancelled = false;

    async function initializeFirebaseAnalytics() {
      const supported = await isSupported().catch(() => false);

      if (!supported || cancelled) {
        return;
      }

      getAnalytics(getFirebaseApp());
    }

    initializeFirebaseAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
