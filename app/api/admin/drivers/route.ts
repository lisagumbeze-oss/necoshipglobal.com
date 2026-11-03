import { jsonOk, requireAdminSession } from "@/lib/api";
import { ensureGlobalDemoData } from "@/lib/repository/ensure-demo";
import { memoryStore } from "@/lib/repository/memory-store";

const regionMap: Record<string, "US" | "EU" | "APAC" | "ME"> = {
  LAX: "US",
  JFK: "US",
  ORD: "US",
  FRA: "EU",
  LHR: "EU",
  NRT: "APAC",
  SIN: "APAC",
  DXB: "ME"
};

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  ensureGlobalDemoData();

  const rows = memoryStore.drivers.map((d) => {
    const regionKey = String(d.region ?? "LAX");
    return {
      id: String(d.id),
      name: String(d.name),
      region: regionMap[regionKey] ?? ("US" as const),
      status: (String(d.status ?? "Off Duty") as "On Duty" | "Off Duty"),
      currentAssignments: Number(d.assignments ?? d.currentAssignments ?? 0),
      rating: Number(d.rating ?? 0)
    };
  });

  return jsonOk(rows);
}
