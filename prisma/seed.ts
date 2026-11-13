import { PrismaClient } from "@prisma/client";
import { hashPassword, isStrongPassword } from "../lib/password";

const prisma = new PrismaClient();

/**
 * Explicit seed only — never runs automatically at app boot.
 *
 * Required for admin creation:
 *   SEED_ADMIN_EMAIL
 *   SEED_ADMIN_PASSWORD  (strong password; defaults from legacy demos are rejected)
 *
 * Optional demo customer (non-production only):
 *   SEED_DEMO_EMAIL
 *   SEED_DEMO_PASSWORD
 */
async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD?.trim();

  if (adminEmail && adminPassword) {
    if (!isStrongPassword(adminPassword)) {
      throw new Error("SEED_ADMIN_PASSWORD must be strong (8+ chars, upper, lower, digit)");
    }
    const blocked = new Set(["Admin123!", "Demo1234!", "demo-password", "password", "Password1"]);
    if (blocked.has(adminPassword)) {
      throw new Error("SEED_ADMIN_PASSWORD rejects known default/demo passwords — choose a unique secret");
    }
    const adminHash = await hashPassword(adminPassword);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash: adminHash,
        role: "ADMIN",
        emailVerifiedAt: new Date()
      },
      create: {
        email: adminEmail,
        name: process.env.SEED_ADMIN_NAME?.trim() || "NecoShip Administrator",
        passwordHash: adminHash,
        role: "ADMIN",
        accountType: "ENTERPRISE",
        emailVerifiedAt: new Date()
      }
    });
    console.log("Provisioned administrator", admin.email);
  } else {
    console.log("Skipping admin user seed (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to provision)");
  }

  if (process.env.NODE_ENV !== "production") {
    const demoEmail = process.env.SEED_DEMO_EMAIL?.trim().toLowerCase();
    const demoPassword = process.env.SEED_DEMO_PASSWORD?.trim();
    if (demoEmail && demoPassword && isStrongPassword(demoPassword)) {
      const demoHash = await hashPassword(demoPassword);
      await prisma.user.upsert({
        where: { email: demoEmail },
        update: {},
        create: {
          email: demoEmail,
          name: "Demo Shipper",
          companyName: "Demo Logistics LLC",
          passwordHash: demoHash,
          role: "CUSTOMER",
          accountType: "BUSINESS",
          emailVerifiedAt: new Date(),
          walletBalanceCents: 0
        }
      });
      console.log("Provisioned demo customer", demoEmail);
    }
  }

  await prisma.rateCard.createMany({
    data: [
      {
        name: "US-EU Express",
        originZone: "US",
        destZone: "EU",
        serviceType: "EXPRESS_AIR",
        carrier: "NecoShip",
        weightMinKg: 0,
        weightMaxKg: 70,
        baseCents: 4200,
        perKgCents: 850
      },
      {
        name: "US Domestic Ground",
        originZone: "US",
        destZone: "US",
        serviceType: "GROUND",
        carrier: "NecoShip",
        weightMinKg: 0,
        weightMaxKg: 70,
        baseCents: 1200,
        perKgCents: 280
      }
    ],
    skipDuplicates: true
  });

  await prisma.promoCode.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off first booking",
      percentOff: 10,
      maxUses: 1000,
      active: true
    }
  });

  await prisma.warehouseLocation.upsert({
    where: { code: "LAX-01" },
    update: {},
    create: {
      code: "LAX-01",
      name: "Los Angeles Hub",
      address: "1 Gateway Blvd, Los Angeles, CA",
      bins: {
        create: [{ code: "A-01" }, { code: "B-02" }]
      }
    }
  });

  console.log("Seed complete (rate cards, promo, sample warehouse). No default passwords were written.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
