"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { useToast } from "@/components/feedback/toast-provider";

type InventoryRow = {
  locationCode: string;
  locationName: string;
  binCode: string;
  sku: string;
  qty: number;
};

type Wave = {
  id: string;
  name: string;
  locationCode: string;
  status: string;
  lines: Array<{ id: string; sku: string; quantity: number; pickedQty: number; packedQty: number; status: string }>;
};

type WarehousePayload = {
  inventory: InventoryRow[];
  movements: Array<Record<string, unknown>>;
  waves: Wave[];
  locations: Array<{ code: string; name: string }>;
};

export default function WarehouseWmsPage() {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const query = useQuery(["admin-wms"], () => apiQuery<WarehousePayload>("/api/admin/warehouse"));
  const [sku, setSku] = useState("BOX-SM");
  const [qty, setQty] = useState("10");
  const [locationCode, setLocationCode] = useState("LAX-01");
  const [waveName, setWaveName] = useState("Wave A — Express");

  const inventory = query.data?.inventory ?? [];
  const waves = query.data?.waves ?? [];
  const locations = useMemo(
    () => query.data?.locations?.map((l) => String(l.code)) ?? ["LAX-01", "FRA-01"],
    [query.data]
  );

  const postMovement = async (direction: "INBOUND" | "OUTBOUND") => {
    try {
      await apiQuery("/api/admin/warehouse", {
        method: "POST",
        body: JSON.stringify({ direction, sku, quantity: Number(qty), locationCode })
      });
      await queryClient.invalidateQueries(["admin-wms"]);
      pushToast({ tone: "success", title: `${direction} recorded` });
    } catch (err) {
      pushToast({ tone: "error", title: "Movement failed", message: err instanceof Error ? err.message : "" });
    }
  };

  return (
    <main className="space-y-4 p-4 md:p-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-brand-navy">Warehouse WMS</h1>
        <p className="text-sm text-slate-600">Bins, inventory, and pick/pack waves.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-2 lg:col-span-2">
          <p className="font-semibold text-brand-navy">Inventory by bin</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-2">Location</th>
                  <th className="pb-2">Bin</th>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2 text-right">Qty</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((row) => (
                  <tr key={`${row.locationCode}-${row.binCode}-${row.sku}`} className="border-t border-slate-100">
                    <td className="py-2">{row.locationCode}</td>
                    <td className="py-2 font-mono text-xs">{row.binCode}</td>
                    <td className="py-2">{row.sku}</td>
                    <td className="py-2 text-right font-semibold">{row.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="space-y-3">
          <p className="font-semibold text-brand-navy">Record movement</p>
          <select
            className="w-full rounded-input border border-slate-200 px-3 py-2 text-sm"
            value={locationCode}
            onChange={(e) => setLocationCode(e.target.value)}
          >
            {locations.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" />
          <Input value={qty} onChange={(e) => setQty(e.target.value)} type="number" placeholder="Qty" />
          <div className="flex gap-2">
            <Button type="button" onClick={() => void postMovement("INBOUND")}>
              Inbound
            </Button>
            <Button type="button" variant="secondary" onClick={() => void postMovement("OUTBOUND")}>
              Outbound
            </Button>
          </div>
        </Card>
      </div>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-semibold text-brand-navy">Pick / pack waves</p>
            <p className="text-xs text-slate-500">Create a wave, pick lines (deducts inventory), pack, then close.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input value={waveName} onChange={(e) => setWaveName(e.target.value)} placeholder="Wave name" />
            <Button
              type="button"
              onClick={async () => {
                try {
                  await apiQuery("/api/admin/warehouse", {
                    method: "POST",
                    body: JSON.stringify({
                      action: "create_wave",
                      name: waveName,
                      locationCode,
                      lines: [
                        { sku: "BOX-SM", quantity: 2 },
                        { sku: "TAPE-CLR", quantity: 1 }
                      ]
                    })
                  });
                  await queryClient.invalidateQueries(["admin-wms"]);
                  pushToast({ tone: "success", title: "Wave created" });
                } catch (err) {
                  pushToast({ tone: "error", title: "Wave failed", message: err instanceof Error ? err.message : "" });
                }
              }}
            >
              Create wave
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {waves.map((wave) => (
            <div key={wave.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-brand-navy">{wave.name}</p>
                  <p className="text-xs text-slate-500">
                    {wave.locationCode} · {wave.id}
                  </p>
                </div>
                <Badge>{wave.status}</Badge>
              </div>
              <ul className="mt-2 space-y-1 text-sm">
                {wave.lines.map((line) => (
                  <li key={line.id} className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      {line.sku} × {line.quantity} · picked {line.pickedQty} · packed {line.packedQty}{" "}
                      <Badge tone="default">{line.status}</Badge>
                    </span>
                    <span className="flex gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={async () => {
                          await apiQuery("/api/admin/warehouse", {
                            method: "POST",
                            body: JSON.stringify({ action: "pick_line", waveId: wave.id, lineId: line.id })
                          });
                          await queryClient.invalidateQueries(["admin-wms"]);
                        }}
                      >
                        Pick
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={async () => {
                          await apiQuery("/api/admin/warehouse", {
                            method: "POST",
                            body: JSON.stringify({ action: "pack_line", waveId: wave.id, lineId: line.id })
                          });
                          await queryClient.invalidateQueries(["admin-wms"]);
                        }}
                      >
                        Pack
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2">
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      await apiQuery("/api/admin/warehouse", {
                        method: "POST",
                        body: JSON.stringify({ action: "close", waveId: wave.id })
                      });
                      await queryClient.invalidateQueries(["admin-wms"]);
                      pushToast({ tone: "success", title: "Wave closed" });
                    } catch (err) {
                      pushToast({ tone: "error", title: "Close failed", message: err instanceof Error ? err.message : "" });
                    }
                  }}
                >
                  Close wave
                </Button>
              </div>
            </div>
          ))}
          {!waves.length ? <p className="text-sm text-slate-500">No active waves.</p> : null}
        </div>
      </Card>
    </main>
  );
}
