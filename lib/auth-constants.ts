/**
 * Mock session: role stored in a first-party cookie for middleware + client UI.
 * Replace with real auth (session/JWT) in production.
 */
export const MOCK_ROLE_COOKIE = "swiftship_role" as const;

export type MockRole = "guest" | "customer" | "admin";

export function isMockRole(value: string | undefined | null): value is MockRole {
  return value === "guest" || value === "customer" || value === "admin";
}
