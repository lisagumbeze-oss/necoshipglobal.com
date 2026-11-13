/** Runtime environment helpers for production safety. */

export function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

/**
 * Memory store is allowed only for local demos when Postgres is not configured.
 * Production never uses memory. When DATABASE_URL is set, memory is never a fallback.
 */
export function allowMemoryStore() {
  if (isProductionRuntime()) return false;
  return !Boolean(process.env.DATABASE_URL?.trim());
}

export function isDemoUiAllowed() {
  if (isProductionRuntime()) return false;
  return process.env.ALLOW_DEMO_ROLE_SWITCHER === "true" || !isProductionRuntime();
}

/** Dev-only leakage of OTP / verification codes in API responses. */
export function allowDevSecretLeakage() {
  if (isProductionRuntime()) return false;
  return !Boolean(process.env.RESEND_API_KEY?.trim());
}
