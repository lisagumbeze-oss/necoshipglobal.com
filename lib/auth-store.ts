import { create } from "zustand";
import { readMockRoleFromDocument, setMockRoleCookieClient } from "./auth-cookies-client";
import type { MockRole } from "./auth-constants";

type AuthState = {
  role: MockRole;
  setRole: (role: MockRole) => void;
  /** Sync Zustand from `document.cookie` (e.g. after middleware redirect). */
  hydrateFromCookie: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: "guest",
  setRole: (role) => {
    setMockRoleCookieClient(role);
    set({ role });
  },
  hydrateFromCookie: () => {
    set({ role: readMockRoleFromDocument() });
  }
}));
