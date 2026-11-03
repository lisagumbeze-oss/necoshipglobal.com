import { memoryStore } from "@/lib/repository/memory-store";

export type BinRef = { code: string; sku: string; qty: number };

function locations() {
  return memoryStore.warehouseLocations;
}

export function listInventory() {
  return locations().flatMap((loc) => {
    const bins = (loc.bins as BinRef[] | undefined) ?? [];
    return bins.map((b) => ({
      locationId: String(loc.id),
      locationCode: String(loc.code),
      locationName: String(loc.name),
      binCode: b.code,
      sku: b.sku,
      qty: b.qty
    }));
  });
}

export function applyMovement(input: {
  direction: "INBOUND" | "OUTBOUND" | "ADJUST";
  sku: string;
  quantity: number;
  locationCode: string;
  binCode?: string;
  trackingNumber?: string;
  notes?: string;
  waveId?: string;
}) {
  const loc = locations().find((l) => String(l.code) === input.locationCode);
  if (!loc) throw new Error(`Location ${input.locationCode} not found`);
  const bins = ((loc.bins as BinRef[]) ??= []);
  let bin = input.binCode
    ? bins.find((b) => b.code === input.binCode)
    : bins.find((b) => b.sku === input.sku);
  if (!bin) {
    bin = { code: input.binCode ?? `AUTO-${input.sku}`, sku: input.sku, qty: 0 };
    bins.push(bin);
  }
  const delta = input.direction === "INBOUND" ? input.quantity : input.direction === "OUTBOUND" ? -input.quantity : input.quantity;
  if (input.direction === "OUTBOUND" && bin.qty + delta < 0) {
    throw new Error(`Insufficient qty for ${input.sku} in ${bin.code}`);
  }
  if (input.direction !== "ADJUST" || input.notes?.includes("set:")) {
    if (input.direction === "ADJUST" && input.notes?.startsWith("set:")) {
      bin.qty = input.quantity;
    } else {
      bin.qty += delta;
    }
  } else {
    bin.qty += delta;
  }

  const movement = {
    id: `whm_${Date.now()}`,
    locationId: String(loc.id),
    locationCode: input.locationCode,
    binCode: bin.code,
    sku: input.sku,
    qtyDelta: input.direction === "ADJUST" && input.notes?.startsWith("set:") ? input.quantity - (bin.qty - delta) : delta,
    direction: input.direction,
    trackingNumber: input.trackingNumber ?? null,
    notes: input.notes ?? null,
    waveId: input.waveId ?? null,
    createdAt: new Date().toISOString()
  };
  memoryStore.warehouseMovements.unshift(movement);
  return { movement, bin, location: loc };
}

export function createPickWave(input: {
  name: string;
  locationCode: string;
  lines: Array<{ sku: string; quantity: number; trackingNumber?: string; binCode?: string }>;
}) {
  const wave = {
    id: `wave_${Date.now()}`,
    name: input.name,
    locationCode: input.locationCode,
    status: "OPEN" as "OPEN" | "PICKING" | "PACKING" | "CLOSED",
    lines: input.lines.map((l, i) => ({
      id: `wline_${Date.now()}_${i}`,
      ...l,
      pickedQty: 0,
      packedQty: 0,
      status: "PENDING"
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  (memoryStore.pickWaves ??= []).unshift(wave);
  return wave;
}

export function advanceWave(waveId: string, action: "start_pick" | "pick_line" | "pack_line" | "close", lineId?: string, qty?: number) {
  const wave = (memoryStore.pickWaves ?? []).find((w) => w.id === waveId);
  if (!wave) throw new Error("Wave not found");
  const lines = wave.lines as Array<Record<string, unknown>>;

  if (action === "start_pick") {
    wave.status = "PICKING";
  }
  if (action === "pick_line" && lineId) {
    const line = lines.find((l) => l.id === lineId);
    if (!line) throw new Error("Line not found");
    const need = Number(line.quantity);
    const pickQty = qty ?? need;
    applyMovement({
      direction: "OUTBOUND",
      sku: String(line.sku),
      quantity: pickQty,
      locationCode: String(wave.locationCode),
      binCode: line.binCode ? String(line.binCode) : undefined,
      trackingNumber: line.trackingNumber ? String(line.trackingNumber) : undefined,
      notes: `Pick wave ${waveId}`,
      waveId
    });
    line.pickedQty = Number(line.pickedQty ?? 0) + pickQty;
    line.status = Number(line.pickedQty) >= need ? "PICKED" : "PARTIAL";
    wave.status = "PICKING";
  }
  if (action === "pack_line" && lineId) {
    const line = lines.find((l) => l.id === lineId);
    if (!line) throw new Error("Line not found");
    line.packedQty = qty ?? Number(line.pickedQty ?? 0);
    line.status = "PACKED";
    wave.status = "PACKING";
  }
  if (action === "close") {
    const unfinished = lines.some((l) => String(l.status) !== "PACKED");
    if (unfinished) throw new Error("Cannot close wave with unpacked lines");
    wave.status = "CLOSED";
  }
  wave.updatedAt = new Date().toISOString();
  return wave;
}
