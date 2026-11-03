"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Input } from "@/components/design-system/ui";
import { apiFetch } from "@/lib/client-api";

export default function AdminCreateShipmentPage() {
  const [origin, setOrigin] = useState("Los Angeles, USA");
  const [destination, setDestination] = useState("London, UK");
  const [recipientName, setRecipientName] = useState("Customer Recipient");
  const [weightKg, setWeightKg] = useState(3);
  const [amountCents, setAmountCents] = useState(9800);
  const [tracking, setTracking] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="space-y-4 p-2">
      <h1 className="font-display text-3xl font-bold text-brand-navy">Create Shipment On Behalf</h1>
      <Card className="grid gap-3 md:grid-cols-2">
        <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" />
        <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
        <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Recipient" />
        <Input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
        <Input type="number" value={amountCents / 100} onChange={(e) => setAmountCents(Math.round(Number(e.target.value) * 100))} />
        <Button
          type="button"
          onClick={async () => {
            setError("");
            const res = await apiFetch<{ trackingNumber: string }>("/api/shipments", {
              method: "POST",
              body: JSON.stringify({
                origin,
                destination,
                recipientName,
                weightKg,
                amountCents,
                paymentMethod: "invoice",
                serviceType: "EXPRESS_AIR"
              })
            });
            if (!res.ok) {
              setError(res.error);
              return;
            }
            setTracking(res.data.trackingNumber);
          }}
        >
          Book for customer
        </Button>
      </Card>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {tracking ? (
        <p className="text-sm">
          Created{" "}
          <Link href={`/admin/shipments/${tracking}` as never} className="font-mono text-brand-blue underline">
            {tracking}
          </Link>
        </p>
      ) : null}
    </main>
  );
}
