"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminNonOperationalNote } from "@/components/admin/admin-ui-note";
import { demoAdminServices } from "@/lib/demo/admin-fixtures";

export default function AdminServicesPage() {
  const [selected, setSelected] = useState(demoAdminServices[0]?.id ?? "");
  const service = demoAdminServices.find((s) => s.id === selected) ?? demoAdminServices[0];

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Service & product management"
        description="Presentation catalogue of NECO shipping services. Configuration previews do not activate commercial settings."
      />
      <AdminNonOperationalNote action="Service activation and commercial configuration" />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="space-y-2 p-3">
          {demoAdminServices.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelected(s.id)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                selected === s.id ? "bg-brand-navy text-white" : "hover:bg-slate-100 text-brand-navy"
              }`}
            >
              {s.name}
            </button>
          ))}
        </Card>

        {service ? (
          <Card className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-bold text-brand-navy">{service.name}</h2>
              <Badge tone={service.availability === "Available" ? "success" : "warning"}>{service.availability}</Badge>
            </div>
            <p className="font-mono text-xs text-slate-500">{service.reference}</p>
            <p>{service.description}</p>
            <p>
              <span className="font-semibold text-brand-navy">Supported routes:</span> {service.routes}
            </p>
            <p>
              <span className="font-semibold text-brand-navy">Customer category:</span> {service.customerCategory}
            </p>
            <p>
              <span className="font-semibold text-brand-navy">Conditions:</span> {service.conditions}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="button" variant="secondary" disabled>
                Edit configuration
              </Button>
              <Button type="button" disabled>
                Activate service
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
