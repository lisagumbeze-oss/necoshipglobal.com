"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { CheckCircle2, Copy, FileText } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { apiFetch } from "@/lib/client-api";

const steps = ["From / To", "Package", "Service", "Customs", "Review & Pay"];

type BookedShipment = {
  trackingNumber: string;
  labelUrl: string | null;
  eta: string | null;
  recipientToken: string | null;
};

export default function CreateShipmentPage() {
  const [step, setStep] = useState(1);
  const [booked, setBooked] = useState<BookedShipment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [origin, setOrigin] = useState("Los Angeles, USA");
  const [destination, setDestination] = useState("Frankfurt, Germany");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [weightKg, setWeightKg] = useState(5);
  const [dimensions, setDimensions] = useState("40x30x20");
  const [hsCode, setHsCode] = useState("");
  const [commodity, setCommodity] = useState("Electronics");
  const [incoterms, setIncoterms] = useState("DDP");
  const [serviceType, setServiceType] = useState("EXPRESS_AIR");
  const [amountCents, setAmountCents] = useState(12200);
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "invoice">("card");
  const [hazmat, setHazmat] = useState(false);
  const [batteries, setBatteries] = useState(false);
  const [liquids, setLiquids] = useState(false);
  const [signatureRequired, setSignatureRequired] = useState(false);
  const [insuranceCents, setInsuranceCents] = useState(0);

  const parseDims = () => {
    const [l, w, h] = dimensions.split(/[x×]/i).map((n) => Number(n.trim()));
    return {
      lengthCm: Number.isFinite(l) ? l : undefined,
      widthCm: Number.isFinite(w) ? w : undefined,
      heightCm: Number.isFinite(h) ? h : undefined
    };
  };

  const book = async () => {
    setLoading(true);
    setError("");
    const dims = parseDims();
    const result = await apiFetch<BookedShipment>("/api/shipments", {
      method: "POST",
      body: JSON.stringify({
        origin,
        destination,
        recipientName: recipientName || "Recipient",
        recipientEmail: recipientEmail || undefined,
        recipientPhone: recipientPhone || undefined,
        weightKg,
        ...dims,
        commodity,
        hsCode: hsCode || undefined,
        incoterms,
        serviceType,
        amountCents,
        promoCode: promoCode || undefined,
        paymentMethod,
        insuranceCents: insuranceCents || undefined,
        hazmat,
        batteries,
        liquids,
        signatureRequired,
        schedulePickupWindow: {
          start: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          end: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString()
        }
      })
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setBooked(result.data);
  };

  if (booked) {
    return (
      <main className="min-h-screen bg-brand-surface p-4 md:p-8">
        <section className="mx-auto max-w-3xl">
          <Card className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto text-emerald-600" size={36} />
            <h1 className="font-display text-3xl font-bold text-brand-navy">Shipment Booked Successfully</h1>
            <p className="text-slate-600">Label created and pickup window requested with the carrier.</p>
            <div className="rounded-input border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Tracking Number</p>
              <p className="font-mono text-lg font-semibold">{booked.trackingNumber}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                onClick={() => void navigator.clipboard.writeText(booked.trackingNumber)}
              >
                <Copy size={16} /> Copy Tracking Number
              </Button>
              {booked.labelUrl ? (
                <a href={booked.labelUrl} target="_blank" rel="noreferrer">
                  <Button variant="secondary" type="button">
                    <FileText size={16} /> Download Label
                  </Button>
                </a>
              ) : null}
              <Link href={`/shipments/${booked.trackingNumber}` as never}>
                <Button variant="ghost" type="button">
                  Open Shipment Detail
                </Button>
              </Link>
              {booked.recipientToken ? (
                <Link href={`/recipient/${booked.recipientToken}` as never}>
                  <Button variant="ghost" type="button">
                    Recipient Portal
                  </Button>
                </Link>
              ) : null}
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-6xl space-y-5">
        <header>
          <h1 className="font-display text-3xl font-bold text-brand-navy">Create Shipment</h1>
          <p className="text-sm text-slate-600">
            Production booking flow for {BRAND.name}: quote-aligned rates, payment, label, and pickup.
          </p>
        </header>

        <div className="grid gap-2 md:grid-cols-5">
          {steps.map((label, index) => {
            const active = step >= index + 1;
            return (
              <div
                key={label}
                className={`rounded-input px-3 py-2 text-center text-sm ${active ? "bg-brand-blue text-white" : "bg-slate-200 text-slate-600"}`}
              >
                {label}
              </div>
            );
          })}
        </div>

        <Card className="space-y-4">
          {step === 1 && (
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" />
              <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
              <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Recipient name" />
              <Input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="Recipient email" />
              <Input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} placeholder="Recipient phone" />
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                placeholder="Weight (kg)"
              />
              <Input value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="Dimensions LxWxH cm" />
              <Input value={commodity} onChange={(e) => setCommodity(e.target.value)} placeholder="Commodity" />
              <Input value={hsCode} onChange={(e) => setHsCode(e.target.value)} placeholder="HS code" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={batteries} onChange={(e) => setBatteries(e.target.checked)} /> Batteries
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={liquids} onChange={(e) => setLiquids(e.target.checked)} /> Liquids
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={hazmat} onChange={(e) => setHazmat(e.target.checked)} /> Hazmat
              </label>
            </div>
          )}
          {step === 3 && (
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { id: "EXPRESS_AIR", label: "Express Air", cents: 12200 },
                { id: "ECONOMY_AIR", label: "Economy Air", cents: 6800 },
                { id: "GROUND", label: "Ground", cents: 4900 }
              ].map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => {
                    setServiceType(service.id);
                    setAmountCents(service.cents);
                  }}
                  className={`rounded-card border p-4 text-left ${serviceType === service.id ? "border-brand-blue bg-blue-50" : "border-slate-200"}`}
                >
                  <p className="font-semibold">{service.label}</p>
                  <p className="text-sm text-slate-600">${(service.cents / 100).toFixed(2)}</p>
                </button>
              ))}
              <label className="flex items-center gap-2 text-sm md:col-span-3">
                <input
                  type="checkbox"
                  checked={signatureRequired}
                  onChange={(e) => setSignatureRequired(e.target.checked)}
                />
                Signature required
              </label>
              <Input
                type="number"
                value={insuranceCents / 100}
                onChange={(e) => setInsuranceCents(Math.round(Number(e.target.value) * 100))}
                placeholder="Insurance amount (USD)"
              />
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <Input value={incoterms} onChange={(e) => setIncoterms(e.target.value)} placeholder="Incoterms" />
              <Badge>Commercial invoice will be generated after booking</Badge>
              {(batteries || liquids || hazmat) && (
                <p className="rounded-input bg-amber-50 p-3 text-sm text-amber-900">
                  Dangerous goods flags set — complete the DG wizard before tender if required.
                  <Link href={"/dangerous-goods" as never} className="ml-2 underline">
                    Open DG wizard
                  </Link>
                </p>
              )}
            </div>
          )}
          {step === 5 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                {origin} → {destination} · {serviceType.replaceAll("_", " ")} · $
                {(amountCents / 100).toFixed(2)}
              </p>
              <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code (e.g. WELCOME10)" />
              <div className="flex flex-wrap gap-3 text-sm">
                {(["card", "wallet", "invoice"] as const).map((method) => (
                  <label key={method} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    {method}
                  </label>
                ))}
              </div>
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            {step < 5 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button type="button" disabled={loading} onClick={() => void book()}>
                {loading ? "Booking…" : "Book Shipment"}
              </Button>
            )}
          </div>
        </Card>
      </section>
    </main>
  );
}
