import {
  DatabaseUnavailableError,
  isDatabaseConfigured,
  mustUseDatabase,
  prisma
} from "@/lib/db";
import { allowMemoryStore } from "@/lib/runtime";
import { isAdminConsoleRole } from "@/lib/rbac";
import { memoryStore, type MemoryUser } from "@/lib/repository/memory-store";
import { hashPassword, verifyPassword } from "@/lib/password";

function toMemoryRole(role: string): MemoryUser["role"] {
  const allowed: MemoryUser["role"][] = [
    "CUSTOMER",
    "ADMIN",
    "OPS_MANAGER",
    "SUPPORT_AGENT",
    "FINANCE",
    "CUSTOMS_OFFICER",
    "READ_ONLY",
    "DRIVER"
  ];
  return (allowed.includes(role as MemoryUser["role"]) ? role : "CUSTOMER") as MemoryUser["role"];
}

function rethrowIfDbRequired(error: unknown): never {
  if (mustUseDatabase()) {
    if (error instanceof DatabaseUnavailableError) throw error;
    const detail = error instanceof Error ? error.message : String(error);
    throw new DatabaseUnavailableError(`User repository database failure: ${detail}`);
  }
  throw error;
}

export async function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (isDatabaseConfigured()) {
    try {
      return await prisma.user.findUnique({ where: { email: normalized } });
    } catch (error) {
      if (mustUseDatabase()) rethrowIfDbRequired(error);
    }
  } else if (mustUseDatabase()) {
    throw new DatabaseUnavailableError("DATABASE_URL is required to look up users");
  }
  if (!allowMemoryStore()) {
    throw new DatabaseUnavailableError("Memory user store is disabled");
  }
  return memoryStore.users.find((u) => u.email === normalized) ?? null;
}

export async function findUserById(id: string) {
  if (isDatabaseConfigured()) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      if (mustUseDatabase()) rethrowIfDbRequired(error);
    }
  } else if (mustUseDatabase()) {
    throw new DatabaseUnavailableError("DATABASE_URL is required to look up users");
  }
  if (!allowMemoryStore()) {
    throw new DatabaseUnavailableError("Memory user store is disabled");
  }
  return memoryStore.users.find((u) => u.id === id) ?? null;
}

export async function createUser(input: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  country?: string;
  companyName?: string;
  accountType?: MemoryUser["accountType"];
  role?: MemoryUser["role"];
}) {
  const email = input.email.trim().toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("Email already registered");
  }
  const passwordHash = await hashPassword(input.password);
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    try {
      return await prisma.user.create({
        data: {
          email,
          passwordHash,
          name: input.name,
          phone: input.phone,
          country: input.country,
          companyName: input.companyName,
          accountType: input.accountType ?? "INDIVIDUAL",
          role: input.role ?? "CUSTOMER"
        }
      });
    } catch (error) {
      if (mustUseDatabase()) rethrowIfDbRequired(error);
    }
  } else if (mustUseDatabase()) {
    throw new DatabaseUnavailableError("DATABASE_URL is required to create users");
  }

  if (!allowMemoryStore()) {
    throw new DatabaseUnavailableError("Memory user store is disabled");
  }

  const user: MemoryUser = {
    id: `usr_${Date.now()}`,
    email,
    emailVerifiedAt: null,
    passwordHash,
    name: input.name ?? null,
    phone: input.phone ?? null,
    country: input.country ?? null,
    role: input.role ?? "CUSTOMER",
    accountType: input.accountType ?? "INDIVIDUAL",
    twoFactorEnabled: false,
    twoFactorSecret: null,
    backupCodes: [],
    companyName: input.companyName ?? null,
    ein: null,
    duns: null,
    creditLimitCents: input.accountType === "ENTERPRISE" ? 5000000 : null,
    walletBalanceCents: 0,
    autoPayEnabled: false,
    preferredUnits: "metric",
    stripeCustomerId: null,
    createdAt: now,
    updatedAt: now
  };
  memoryStore.users.push(user);
  return user;
}

const BLOCKED_DEMO_EMAILS = new Set(["admin@necoship.global", "demo@necoship.global", "customer@necoship.global"]);
const BLOCKED_DEMO_PASSWORDS = new Set(["Admin123!", "Demo1234!", "demo-password", "password", "Password1"]);

export function isBlockedDemoCredential(email: string, password?: string) {
  const normalized = email.trim().toLowerCase();
  if (BLOCKED_DEMO_EMAILS.has(normalized)) return true;
  if (password && BLOCKED_DEMO_PASSWORDS.has(password)) return true;
  return false;
}

export async function authenticateUser(email: string, password: string) {
  if (process.env.NODE_ENV === "production" && isBlockedDemoCredential(email, password)) {
    return null;
  }
  const user = await findUserByEmail(email);
  if (!user || !("passwordHash" in user) || !user.passwordHash) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export async function markEmailVerified(userId: string) {
  if (isDatabaseConfigured()) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { emailVerifiedAt: new Date() }
      });
    } catch (error) {
      if (mustUseDatabase()) rethrowIfDbRequired(error);
    }
  } else if (mustUseDatabase()) {
    throw new DatabaseUnavailableError("DATABASE_URL is required");
  }
  if (!allowMemoryStore()) {
    throw new DatabaseUnavailableError("Memory user store is disabled");
  }
  const user = memoryStore.users.find((u) => u.id === userId);
  if (user) {
    user.emailVerifiedAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
  }
  return user;
}

export async function updateUserPassword(userId: string, password: string) {
  const passwordHash = await hashPassword(password);
  if (isDatabaseConfigured()) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { passwordHash }
      });
    } catch (error) {
      if (mustUseDatabase()) rethrowIfDbRequired(error);
    }
  } else if (mustUseDatabase()) {
    throw new DatabaseUnavailableError("DATABASE_URL is required");
  }
  if (!allowMemoryStore()) {
    throw new DatabaseUnavailableError("Memory user store is disabled");
  }
  const user = memoryStore.users.find((u) => u.id === userId);
  if (user) {
    user.passwordHash = passwordHash;
    user.updatedAt = new Date().toISOString();
  }
  return user;
}

export async function setTwoFactor(userId: string, secret: string, backupCodes: string[]) {
  if (isDatabaseConfigured()) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true, twoFactorSecret: secret, backupCodes }
      });
    } catch (error) {
      if (mustUseDatabase()) rethrowIfDbRequired(error);
    }
  } else if (mustUseDatabase()) {
    throw new DatabaseUnavailableError("DATABASE_URL is required");
  }
  if (!allowMemoryStore()) {
    throw new DatabaseUnavailableError("Memory user store is disabled");
  }
  const user = memoryStore.users.find((u) => u.id === userId);
  if (user) {
    user.twoFactorEnabled = true;
    user.twoFactorSecret = secret;
    user.backupCodes = backupCodes;
    user.updatedAt = new Date().toISOString();
  }
  return user;
}

export async function listUsers() {
  if (isDatabaseConfigured()) {
    try {
      return await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    } catch (error) {
      if (mustUseDatabase()) rethrowIfDbRequired(error);
    }
  } else if (mustUseDatabase()) {
    throw new DatabaseUnavailableError("DATABASE_URL is required");
  }
  if (!allowMemoryStore()) {
    throw new DatabaseUnavailableError("Memory user store is disabled");
  }
  return memoryStore.users;
}

/**
 * Only roles with admin console access map to the NextAuth "admin" app role.
 * DRIVER / READ_ONLY / CUSTOMER never receive full admin.
 */
export function mapRoleToAppRole(role: string): "customer" | "admin" {
  return isAdminConsoleRole(role) ? "admin" : "customer";
}

/**
 * @deprecated Runtime auto-seeding of default administrators is removed.
 * Use `npm run db:seed` or `scripts/provision-admin.ts` with explicit credentials.
 */
export async function ensureSeedAdmin() {
  return;
}

export { toMemoryRole };
