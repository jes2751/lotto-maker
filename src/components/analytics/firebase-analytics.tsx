"use client";

import { useEffect } from "react";

export function FirebaseAnalytics() {
  useEffect(() => {
    let cancelled = false;

    async function initializeFirebaseAnalytics() {
      const modules = await Promise.all([
        import("firebase/analytics"),
        import("@/lib/firebase/client")
      ]).catch(() => null);

      if (!modules) {
        return;
      }

      const [analyticsModule, firebaseClientModule] = modules;
      const { getAnalytics, isSupported } = analyticsModule;
      const { getFirebaseApp } = firebaseClientModule;

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
