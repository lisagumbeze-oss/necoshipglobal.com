import { isMockRole, MOCK_ROLE_COOKIE, type MockRole } from "./auth-constants";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function setMockRoleCookieClient(role: MockRole) {
  if (typeof document === "undefined") return;
  if (role === "guest") {
    document.cookie = `${MOCK_ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }
  document.cookie = `${MOCK_ROLE_COOKIE}=${role}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}

export function readMockRoleFromDocument(): MockRole {
  if (typeof document === "undefined") return "guest";
  const m = document.cookie.match(new RegExp(`(?:^|; )${MOCK_ROLE_COOKIE}=([^;]*)`));
  const raw = m?.[1]?.trim();
  if (raw && isMockRole(raw)) return raw;
  return "guest";
}
