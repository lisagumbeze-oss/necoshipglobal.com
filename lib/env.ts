function optional(name: string) {
  return process.env[name]?.trim() || undefined;
}

const DEV_NEXTAUTH_FALLBACK = "dev-nextauth-secret";

/**
 * Resolve NextAuth secret. Development may use a local fallback.
 * Production must set NEXTAUTH_SECRET — validated by assertProductionEnv() at boot.
 */
function resolveNextAuthSecret() {
  const value = optional("NEXTAUTH_SECRET");
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    // Do not embed a forgeable default in production bundles used at runtime.
    // assertProductionEnv() fails boot; middleware also refuses the known default.
    return "";
  }
  return DEV_NEXTAUTH_FALLBACK;
}

export const env = {
  databaseUrl: optional("DATABASE_URL"),
  nextAuthSecret: resolveNextAuthSecret(),
  nextAuthUrl: optional("NEXTAUTH_URL") ?? "http://localhost:3000",
  googleClientId: optional("GOOGLE_CLIENT_ID"),
  googleClientSecret: optional("GOOGLE_CLIENT_SECRET"),
  stripeSecretKey: optional("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: optional("STRIPE_WEBHOOK_SECRET"),
  stripePublishableKey: optional("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
  shipEngineApiKey: optional("SHIPENGINE_API_KEY"),
  shipEngineCarrierIds: (optional("SHIPENGINE_CARRIER_IDS") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  sanctionsApiUrl: optional("SANCTIONS_API_URL"),
  sanctionsApiKey: optional("SANCTIONS_API_KEY"),
  mapboxToken: optional("NEXT_PUBLIC_MAPBOX_TOKEN"),
  resendApiKey: optional("RESEND_API_KEY"),
  emailFrom: optional("EMAIL_FROM") ?? "Neco Ship Global <support@necoshipglobal.com>",
  twilioAccountSid: optional("TWILIO_ACCOUNT_SID"),
  twilioAuthToken: optional("TWILIO_AUTH_TOKEN"),
  twilioFromNumber: optional("TWILIO_FROM_NUMBER"),
  r2Endpoint: optional("R2_ENDPOINT"),
  r2AccessKeyId: optional("R2_ACCESS_KEY_ID"),
  r2SecretAccessKey: optional("R2_SECRET_ACCESS_KEY"),
  r2Bucket: optional("R2_BUCKET") ?? "necoship",
  r2PublicBaseUrl: optional("R2_PUBLIC_BASE_URL"),
  pusherAppId: optional("PUSHER_APP_ID"),
  pusherKey: optional("NEXT_PUBLIC_PUSHER_KEY"),
  pusherSecret: optional("PUSHER_SECRET"),
  pusherCluster: optional("NEXT_PUBLIC_PUSHER_CLUSTER") ?? "eu",
  /** @deprecated use resolveNextAuthSecret / assertProductionEnv — exposed for tests */
  __devNextAuthFallback: DEV_NEXTAUTH_FALLBACK
};

export function missingProductionSecrets() {
  const required = ["DATABASE_URL", "NEXTAUTH_SECRET"] as const;
  return required.filter((key) => !process.env[key]?.trim());
}

/** Fail-fast for production boot. Safe to call repeatedly. */
export function assertProductionEnv() {
  if (process.env.NODE_ENV !== "production") return;
  const missing = missingProductionSecrets();
  if (missing.length) {
    throw new Error(
      `Production startup blocked. Missing required secrets: ${missing.join(", ")}. ` +
        `Set them in the host environment and rotate any previously used defaults.`
    );
  }
  const secret = process.env.NEXTAUTH_SECRET!.trim();
  if (secret === DEV_NEXTAUTH_FALLBACK || secret.length < 32) {
    throw new Error(
      "Production startup blocked. NEXTAUTH_SECRET must be a strong unique value (min 32 chars), not a development default."
    );
  }
}
