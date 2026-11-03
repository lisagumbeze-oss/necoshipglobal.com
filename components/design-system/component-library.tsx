"use client";

import { Badge, Button, Card, Input } from "@/components/design-system/ui";

export function ComponentLibrary() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <Card className="space-y-3">
        <h3 className="font-display text-lg font-semibold">Buttons & Badges</h3>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Badge>In Transit</Badge>
          <Badge tone="success">Delivered</Badge>
          <Badge tone="warning">Customs Hold</Badge>
          <Badge tone="danger">Exception</Badge>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-display text-lg font-semibold">Inputs & Selectors</h3>
        <Input placeholder="Tracking number" />
        <Input placeholder="Email address" type="email" />
        <Input placeholder="Date picker placeholder" type="date" />
      </Card>

      <Card className="space-y-3">
        <h3 className="font-display text-lg font-semibold">Cards & Data Blocks</h3>
        <div className="rounded-card border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Shipment</p>
          <p className="font-mono text-sm font-semibold">TRK-2026-0011223</p>
          <p className="text-sm text-brand-slate">LAX to FRA - ETA Tomorrow</p>
        </div>
      </Card>
    </section>
  );
}
