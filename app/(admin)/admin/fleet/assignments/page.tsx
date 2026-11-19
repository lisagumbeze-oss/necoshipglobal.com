"use client";

import { useMemo, useState } from "react";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoAssignments, demoDrivers, demoVehicles } from "@/lib/demo/operations-fixtures";

export default function FleetAssignmentsPage() {
  const [driverId, setDriverId] = useState(demoDrivers[2]?.id ?? "");
  const [vehicleId, setVehicleId] = useState(demoVehicles[2]?.id ?? "");
  const [notice, setNotice] = useState("");

  const conflict = useMemo(() => {
    const driverBusy = demoAssignments.some(
      (a) => a.driverId === driverId && ["PLANNED", "CONFIRMED", "IN_PROGRESS"].includes(a.status)
    );
    const vehicleBusy = demoAssignments.some(
      (a) => a.vehicleId === vehicleId && ["PLANNED", "CONFIRMED", "IN_PROGRESS"].includes(a.status)
    );
    return { driverBusy, vehicleBusy };
  }, [driverId, vehicleId]);

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Driver & vehicle assignments"
        description="Demonstration assignment board. Conflicting selections are highlighted. No live dispatch actions are executed."
      />

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Departure</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoAssignments.map((a) => {
              const driver = demoDrivers.find((d) => d.id === a.driverId);
              const vehicle = demoVehicles.find((v) => v.id === a.vehicleId);
              return (
                <tr key={a.id} className="border-b border-slate-100 align-top last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{a.id}</td>
                  <td className="px-4 py-3">{driver?.name}</td>
                  <td className="px-4 py-3">{vehicle?.reference}</td>
                  <td className="px-4 py-3">
                    {a.routeLabel}
                    <span className="block text-xs text-slate-500">
                      {a.origin} → {a.destination}
                    </span>
                    {a.conflictNote ? <span className="mt-1 block text-xs text-red-700">{a.conflictNote}</span> : null}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">{new Date(a.departureAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <OpsStatusBadge
                      label={a.status.replaceAll("_", " ")}
                      tone={a.status === "CONFLICT" ? "danger" : a.status === "COMPLETED" ? "success" : "info"}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Plan assignment (demo)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm"
            aria-label="Select driver"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
          >
            {demoDrivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm"
            aria-label="Select vehicle"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
          >
            {demoVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.reference} · {v.registration}
              </option>
            ))}
          </select>
        </div>
        {(conflict.driverBusy || conflict.vehicleBusy) && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            Potential conflict detected (demonstration):{" "}
            {[conflict.driverBusy ? "driver already assigned" : null, conflict.vehicleBusy ? "vehicle already assigned" : null]
              .filter(Boolean)
              .join("; ")}
            .
          </p>
        )}
        <Button
          type="button"
          onClick={() =>
            setNotice(
              "Demonstration assignment draft saved locally. No operational dispatch was created."
            )
          }
        >
          Save assignment draft (demo)
        </Button>
        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      </Card>
    </section>
  );
}
