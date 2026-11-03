import { isDatabaseConfigured, prisma } from "@/lib/db";
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

export async function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (isDatabaseConfigured()) {
    try {
      return await prisma.user.findUnique({ where: { email: normalized } });
    } catch {
      // fall through to memory
    }
  }
  return memoryStore.users.find((u) => u.email === normalized) ?? null;
}

export async function findUserById(id: string) {
  if (isDatabaseConfigured()) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch {
      // fall through
    }
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
    } catch {
      // fall through to memory for local demos
    }
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

export async function authenticateUser(email: string, password: string) {
  await ensureSeedAdmin();
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
    } catch {
      // fall through
    }
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
    } catch {
      // fall through
    }
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
    } catch {
      // fall through
    }
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
    } catch {
      // fall through
    }
  }
  return memoryStore.users;
}

export function mapRoleToAppRole(role: string): "customer" | "admin" {
  if (role === "CUSTOMER") return "customer";
  return "admin";
}

let seedPromise: Promise<void> | null = null;

export async function ensureSeedAdmin() {
  if (memoryStore.users.some((u) => u.email === "admin@necoship.global")) return;
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    if (memoryStore.users.some((u) => u.email === "admin@necoship.global")) return;
    const admin = await createUser({
      email: "admin@necoship.global",
      password: "Admin123!",
      name: "NecoShip Admin",
      role: "ADMIN",
      accountType: "ENTERPRISE"
    });
    await markEmailVerified(admin.id);
    const demo = await createUser({
      email: "demo@necoship.global",
      password: "Demo1234!",
      name: "Demo Shipper",
      role: "CUSTOMER",
      accountType: "BUSINESS",
      companyName: "Demo Logistics LLC"
    });
    await markEmailVerified(demo.id);
  })();
  return seedPromise;
}

void ensureSeedAdmin();

export { toMemoryRole };
