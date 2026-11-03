import QRCode from "qrcode";
import { requireSession, jsonError, jsonOk } from "@/lib/api";
import { findUserByEmail, setTwoFactor } from "@/lib/repository/users";
import { BRAND } from "@/lib/brand";
import { buildOtpAuthUri, createTotpSecret } from "@/lib/totp";

function backupCodes(count = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: count }, () =>
    Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("")
  );
}

export async function POST() {
  const { session, error } = await requireSession();
  if (error || !session?.user.email) return error!;

  const user = await findUserByEmail(session.user.email);
  if (!user) return jsonError("User not found", 404);

  const secret = createTotpSecret();
  const otpauth = buildOtpAuthUri({ secret, email: user.email, issuer: BRAND.name });
  const qrDataUrl = await QRCode.toDataURL(otpauth);
  const codes = backupCodes();
  await setTwoFactor(user.id, secret, codes);

  return jsonOk({ secret, otpauth, qrDataUrl, backupCodes: codes });
}
