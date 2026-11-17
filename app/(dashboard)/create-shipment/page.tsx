"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { SHIPPING_METHODS } from "@/lib/public-content";

export default function CreateShipmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");

  if (submitted) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader
          title="Demonstration booking draft saved locally"
          description="No real shipment booking, label, or payment was created."
        />
        <Card className="space-y-3">
          <p className="text-sm text-slate-600">
            Local draft reference <span className="font-mono font-semibold text-brand-navy">{refId}</span>. Connect this
            flow to secure booking APIs in a later module.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={"/shipments" as never}>
              <Button variant="secondary">My Shipments</Button>
            </Link>
            <Link href={"/quote" as never}>
              <Button>Request a Quote</Button>
            </Link>
            <Button variant="ghost" type="button" onClick={() => setSubmitted(false)}>
              Start another draft
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <DashboardPageHeader
        title="New Shipment"
        description="Capture shipment details for a demonstration booking draft. Final rates and live bookings stay disconnected."
        actions={
          <Link href={"/quote" as never}>
            <Button variant="secondary">Prefer Get a Quote</Button>
          </Link>
        }
      />

      <Card className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
          Demonstration-only action — submitting stores a local draft reference in this browser and does not create a
          Production shipment.
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Origin">
            <Input defaultValue="Los Angeles, US" aria-label="Origin" />
          </Field>
          <Field label="Destination">
            <Input defaultValue="Frankfurt, DE" aria-label="Destination" />
          </Field>
          <Field label="Shipping method">
            <select className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm" aria-label="Shipping method">
              {SHIPPING_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Package weight (kg)">
            <Input type="number" defaultValue={5} aria-label="Weight" />
          </Field>
          <Field label="Sender contact">
            <Input defaultValue="Jordan Ellis" aria-label="Sender contact" />
          </Field>
          <Field label="Recipient contact">
            <Input defaultValue="Mia Hartmann" aria-label="Recipient contact" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Commodity description">
              <Input defaultValue="Consumer electronics accessories" aria-label="Commodity" />
            </Field>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              const id = `DRAFT-DEMO-${Date.now().toString().slice(-6)}`;
              try {
                window.sessionStorage.setItem("neco_demo_shipment_draft", JSON.stringify({ id, at: new Date().toISOString() }));
              } catch {
                /* ignore */
              }
              setRefId(id);
              setSubmitted(true);
            }}
          >
            Save demonstration draft
          </Button>
          <Link href={"/saved-quotes" as never}>
            <Button variant="ghost">Review quotations</Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}
