import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await hashPassword("Admin123!");
  const demoHash = await hashPassword("Demo1234!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@necoship.global" },
    update: {
      name: "NecoShip Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      accountType: "ENTERPRISE",
      emailVerifiedAt: new Date(),
      twoFactorEnabled: false,
      twoFactorSecret: null
    },
    create: {
      email: "admin@necoship.global",
      name: "NecoShip Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      accountType: "ENTERPRISE",
      emailVerifiedAt: new Date()
    }
  });

  const demo = await prisma.user.upsert({
    where: { email: "demo@necoship.global" },
    update: {
      name: "Demo Shipper",
      companyName: "Demo Logistics LLC",
      passwordHash: demoHash,
      role: "CUSTOMER",
      accountType: "BUSINESS",
      emailVerifiedAt: new Date(),
      walletBalanceCents: 25000,
      twoFactorEnabled: false,
      twoFactorSecret: null
    },
    create: {
      email: "demo@necoship.global",
      name: "Demo Shipper",
      companyName: "Demo Logistics LLC",
      passwordHash: demoHash,
      role: "CUSTOMER",
      accountType: "BUSINESS",
      emailVerifiedAt: new Date(),
      walletBalanceCents: 25000
    }
  });

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

  await prisma.carrierIntegration.createMany({
    data: [
      { carrier: "FedEx", status: "HEALTHY", latencyMs: 120 },
      { carrier: "UPS", status: "HEALTHY", latencyMs: 140 },
      { carrier: "DHL", status: "DEGRADED", latencyMs: 820 },
      { carrier: "USPS", status: "HEALTHY", latencyMs: 95 },
      { carrier: "ShipEngine", status: "HEALTHY", latencyMs: 110 }
    ],
    skipDuplicates: true
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

  console.log("Seeded users", { admin: admin.email, demo: demo.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
