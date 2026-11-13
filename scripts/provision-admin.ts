/**
 * One-shot secure administrator provisioning.
 *
 * Usage:
 *   npx tsx scripts/provision-admin.ts --email admin@necoshipglobal.com --password '...' --name 'Ops Admin'
 *
 * Requires DATABASE_URL. Refuses known default passwords.
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword, isStrongPassword } from "../lib/password";

const prisma = new PrismaClient();

function arg(name: string) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx < 0) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  const email = (arg("email") ?? process.env.SEED_ADMIN_EMAIL)?.trim().toLowerCase();
  const password = arg("password") ?? process.env.SEED_ADMIN_PASSWORD;
  const name = arg("name") ?? process.env.SEED_ADMIN_NAME ?? "NecoShip Administrator";

  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("DATABASE_URL is required");
  }
  if (!email || !password) {
    throw new Error("Provide --email and --password (or SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)");
  }
  if (!isStrongPassword(password)) {
    throw new Error("Password must be strong (8+ chars, upper, lower, digit)");
  }
  const blocked = new Set(["Admin123!", "Demo1234!", "demo-password", "password", "Password1"]);
  if (blocked.has(password)) {
    throw new Error("Refusing known default/demo passwords");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN", emailVerifiedAt: new Date(), name },
    create: {
      email,
      name,
      passwordHash,
      role: "ADMIN",
      accountType: "ENTERPRISE",
      emailVerifiedAt: new Date()
    }
  });

  console.log("Administrator ready:", user.email, user.id);
  console.log("Rotate NEXTAUTH_SECRET after any credential incident to invalidate sessions.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
