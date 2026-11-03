import { generateSecret, generateURI, verifySync } from "otplib";

export function createTotpSecret() {
  return generateSecret();
}

export function buildOtpAuthUri(input: { secret: string; email: string; issuer: string }) {
  return generateURI({
    secret: input.secret,
    label: input.email,
    issuer: input.issuer
  });
}

export function verifyTotp(token: string, secret: string) {
  try {
    const result = verifySync({ token, secret });
    if (typeof result === "boolean") return result;
    if (result && typeof result === "object" && "valid" in result) {
      return Boolean((result as { valid?: boolean }).valid);
    }
    return Boolean(result);
  } catch {
    return false;
  }
}
