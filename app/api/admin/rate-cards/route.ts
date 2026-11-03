import { jsonOk, requireAdminSession } from "@/lib/api";
import { titleStatus } from "@/lib/query-api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const carrier = (searchParams.get("carrier") ?? "").toLowerCase();
  const serviceType = (searchParams.get("serviceType") ?? "").toLowerCase();

  // Seed a few extra cards for the UI if only one exists
  if (memoryStore.rateCards.length < 3) {
    memoryStore.rateCards.push(
      {
        id: "rc_2",
        name: "US Domestic Ground",
        originZone: "US",
        destZone: "US",
        serviceType: "GROUND",
        carrier: "USPS",
        weightMinKg: 0,
        weightMaxKg: 30,
        baseCents: 1200,
        perKgCents: 180
      },
      {
        id: "rc_3",
        name: "APAC Economy",
        originZone: "APAC",
        destZone: "US",
        serviceType: "ECONOMY_AIR",
        carrier: "UPS",
        weightMinKg: 0,
        weightMaxKg: 50,
        baseCents: 2800,
        perKgCents: 420
      }
    );
  }

  let rows = memoryStore.rateCards.map((r) => ({
    id: String(r.id),
    originZone: String(r.originZone ?? ""),
    destinationZone: String(r.destZone ?? r.destinationZone ?? ""),
    weightBracketKg: `${r.weightMinKg ?? 0}–${r.weightMaxKg ?? 70}`,
    serviceType: titleStatus(String(r.serviceType ?? "")),
    carrier: String(r.carrier ?? "NecoShip"),
    baseRateUsd: Number(r.baseCents ?? 0) / 100,
    fuelSurchargePct: 8.5,
    effectiveFrom: String(r.effectiveFrom ?? "2026-01-01")
  }));

  if (q) {
    rows = rows.filter((r) =>
      `${r.originZone} ${r.destinationZone} ${r.weightBracketKg} ${r.serviceType} ${r.carrier}`.toLowerCase().includes(q)
    );
  }
  if (carrier) rows = rows.filter((r) => r.carrier.toLowerCase().includes(carrier));
  if (serviceType) rows = rows.filter((r) => r.serviceType.toLowerCase().includes(serviceType));

  return jsonOk(rows);
}
