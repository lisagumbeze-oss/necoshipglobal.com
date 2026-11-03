"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

/**
 * Keeps Zustand role in sync with the mock cookie on first paint and when returning from server navigations.
 */
export function AuthSync() {
  const hydrate = useAuthStore((s) => s.hydrateFromCookie);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
