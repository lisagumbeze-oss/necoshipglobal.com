"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";

const commodities = ["Electronics", "Apparel", "Machinery", "Documents", "Food & Beverage", "Other"];

type RateOption = {
  name: string;
  carrier: string;
  days: string;
  price: string;
  amountCents: number;
  serviceType: string;
  dutyTaxEstimateCents?: number;
  carbonKg?: number;
};

const fallbackServiceOptions: RateOption[] = [
  {
    name: "Economy Air",
    carrier: "NecoShip",
    days: "5-7 days",
    price: "$68.00",
    amountCents: 6800,
    serviceType: "ECONOMY_AIR"
  },
  {
    name: "Express Air",
    carrier: "NecoShip",
    days: "2-3 days",
    price: "$122.00",
    amountCents: 12200,
    serviceType: "EXPRESS_AIR"
  },
  {
    name: "Ground / Ocean",
    carrier: "NecoShip",
    days: "5-28 days",
    price: "$49.00",
    amountCents: 4900,
    serviceType: "GROUND"
  }
];

const shipmentSchema = z.object({
  origin: z.string().min(2, "Origin is required"),
  destination: z.string().min(2, "Destination is required"),
  shipmentType: z.enum(["Document", "Package", "Pallet", "Container"]),
  weight: z.coerce.number().positive("Weight must be greater than 0"),
  dimensions: z.string().min(3, "Dimensions are required"),
  declaredValue: z.coerce.number().min(0, "Declared value cannot be negative"),
  commodity: z.string().min(2, "Commodity is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1")
});

type ShipmentForm = z.infer<typeof shipmentSchema>;

export default function QuotePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [serviceOptions, setServiceOptions] = useState<RateOption[]>(fallbackServiceOptions);
  const [selectedService, setSelectedService] = useState(fallbackServiceOptions[1]!.name);
  const [quoteMeta, setQuoteMeta] = useState<{ dutyTaxEstimateCents?: number; carbonKg?: number; quoteId?: string }>({});
  const [quoteError, setQuoteError] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const form = useForm<ShipmentForm>({
    resolver: zodResolver(shipmentSchema),
    mode: "onBlur",
    defaultValues: {
      origin: "",
      destination: "",
      shipmentType: "Package",
      weight: 10,
      dimensions: "40 x 30 x 20 cm",
      declaredValue: 1000,
      commodity: "Electronics",
      quantity: 1
    }
  });

  const chosen = serviceOptions.find((s) => s.name === selectedService) ?? serviceOptions[1]!;

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-8 md:px-8">
      <section className="mx-auto max-w-6xl space-y-5">
        <header>
          <h1 className="font-display text-3xl font-bold text-brand-navy">Get a Quote</h1>
          <p className="text-sm text-slate-600">
            Multi-step wizard for {BRAND.name} — shipment details, ranked services, and booking handoff.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-2" role="list" aria-label="Quote progress">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              role="listitem"
              className={`rounded-input p-2 text-center text-sm font-medium ${step >= s ? "bg-brand-yellow text-brand-navy" : "bg-slate-200 text-slate-600"}`}
            >
              Step {s}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <Card className="space-y-4">
            <h2 className="font-semibold text-brand-navy">Step 1 — Shipment Details</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Input placeholder="Origin country / city" aria-label="Origin" {...form.register("origin")} />
                {form.formState.errors.origin ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.origin.message}</p> : null}
              </div>
              <div>
                <Input placeholder="Destination country / city" aria-label="Destination" {...form.register("destination")} />
                {form.formState.errors.destination ? (
                  <p className="mt-1 text-xs text-red-700">{form.formState.errors.destination.message}</p>
                ) : null}
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">Shipment type</label>
                <select
                  className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
                  aria-label="Shipment type"
                  {...form.register("shipmentType")}
                >
                  <option>Document</option>
                  <option>Package</option>
                  <option>Pallet</option>
                  <option>Container</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Weight</label>
                <div className="flex gap-2">
                  <Input className="flex-1" placeholder={unit === "lbs" ? "Weight (lbs)" : "Weight (kg)"} type="number" min={0} {...form.register("weight")} />
                  <div className="flex rounded-input border border-slate-300 p-1 text-xs">
                    <button
                      type="button"
                      className={`rounded-button px-2 py-1 ${unit === "lbs" ? "bg-brand-navy text-white" : ""}`}
                      onClick={() => setUnit("lbs")}
                    >
                      lbs
                    </button>
                    <button
                      type="button"
                      className={`rounded-button px-2 py-1 ${unit === "kg" ? "bg-brand-navy text-white" : ""}`}
                      onClick={() => setUnit("kg")}
                    >
                      kg
                    </button>
                  </div>
                </div>
                {form.formState.errors.weight ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.weight.message}</p> : null}
              </div>
              <div>
                <Input placeholder="Dimensions (L x W x H)" aria-label="Dimensions" {...form.register("dimensions")} />
                {form.formState.errors.dimensions ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.dimensions.message}</p> : null}
              </div>
              <div>
                <Input placeholder="Declared value (USD)" type="number" min={0} aria-label="Declared value" {...form.register("declaredValue")} />
                {form.formState.errors.declaredValue ? (
                  <p className="mt-1 text-xs text-red-700">{form.formState.errors.declaredValue.message}</p>
                ) : null}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Commodity type</label>
                <select
                  className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
                  aria-label="Commodity type"
                  {...form.register("commodity")}
                >
                  {commodities.map((c) => (
                    <option key={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Input placeholder="Quantity" type="number" min={1} aria-label="Quantity" {...form.register("quantity")} />
                {form.formState.errors.quantity ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.quantity.message}</p> : null}
              </div>
            </div>
            {quoteError ? <p className="text-sm text-red-700">{quoteError}</p> : null}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={async () => {
                  const ok = await form.trigger();
                  if (!ok) return;
                  setQuoteError("");
                  const values = form.getValues();
                  const weightKg = unit === "lbs" ? Number(values.weight) * 0.453592 : Number(values.weight);
                  const [originCity, originCountry] = values.origin.split(",").map((s) => s.trim());
                  const [destCity, destCountry] = values.destination.split(",").map((s) => s.trim());
                  const dims = values.dimensions.split(/[x×]/i).map((n) => Number(n.trim()));
                  const res = await fetch("/api/quotes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      originCountry: originCountry || originCity || "US",
                      originCity: originCity || values.origin,
                      destCountry: destCountry || destCity || "DE",
                      destCity: destCity || values.destination,
                      packageType: values.shipmentType === "Document" ? "ENVELOPE" : values.shipmentType === "Pallet" ? "PALLET" : values.shipmentType === "Container" ? "CONTAINER" : "BOX",
                      weightKg,
                      lengthCm: dims[0],
                      widthCm: dims[1],
                      heightCm: dims[2],
                      declaredValueCents: Math.round(Number(values.declaredValue) * 100),
                      commodity: values.commodity,
                      quantity: values.quantity
                    })
                  });
                  const json = await res.json();
                  if (!json.ok) {
                    setQuoteError(json.error ?? "Unable to fetch rates");
                    setServiceOptions(fallbackServiceOptions);
                  } else {
                    const rates = (json.data.rates as Array<{
                      carrier: string;
                      serviceType: string;
                      amountCents: number;
                      transitDays: number;
                    }>).map((rate) => ({
                      name: rate.serviceType.replaceAll("_", " "),
                      carrier: rate.carrier,
                      days: `${rate.transitDays} days`,
                      price: `$${(rate.amountCents / 100).toFixed(2)}`,
                      amountCents: rate.amountCents,
                      serviceType: rate.serviceType
                    }));
                    setServiceOptions(rates.length ? rates : fallbackServiceOptions);
                    setSelectedService((rates[0] ?? fallbackServiceOptions[0]!).name);
                    setQuoteMeta({
                      dutyTaxEstimateCents: json.data.dutyTaxEstimateCents,
                      carbonKg: json.data.carbonKg,
                      quoteId: json.data.id
                    });
                  }
                  setStep(2);
                }}
              >
                Continue to Service Options
              </Button>
            </div>
          </Card>
        ) : null}

        {step === 2 ? (
          <Card className="space-y-4">
            <h2 className="font-semibold text-brand-navy">Step 2 — Service Options</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {serviceOptions.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setSelectedService(option.name)}
                  className={`flex flex-col rounded-card border p-4 text-left ${
                    selectedService === option.name ? "border-brand-yellow bg-yellow-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{option.name}</p>
                    <Badge>{option.carrier}</Badge>
                  </div>
                  <p className="text-sm text-slate-500">{option.days}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-brand-navy">{option.price}</p>
                  <p className="text-xs text-slate-500">Est. transit: {option.days}</p>
                  {selectedService === option.name ? <Badge className="mt-2 w-fit">Selected</Badge> : null}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <Button variant="ghost" type="button" onClick={() => setStep(1)}>
                Back
              </Button>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={async () => {
                    if (!quoteMeta.quoteId) {
                      setQuoteError("Generate rates first, then save.");
                      return;
                    }
                    const res = await fetch(`/api/quotes/${quoteMeta.quoteId}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        saved: true,
                        selectedService: chosen.serviceType,
                        amountCents: chosen.amountCents
                      })
                    });
                    const json = await res.json();
                    setCheckoutMessage(
                      json.ok ? "Quote saved to your account." : json.error ?? "Sign in to save quotes."
                    );
                  }}
                >
                  Save quote
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  Review & Book
                </Button>
              </div>
            </div>
          </Card>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.85fr]">
            <Card className="space-y-4">
              <h2 className="font-semibold text-brand-navy">Step 3 — Review + Book</h2>
              <div className="rounded-input border border-slate-200 p-3 text-sm text-slate-700">
                {form.getValues("origin")} -&gt; {form.getValues("destination")} · {form.getValues("weight")} {unit} · {chosen.name}
              </div>
              <div className="rounded-input border border-slate-200 p-3 text-sm text-slate-700">
                Estimated total: <span className="font-semibold text-brand-navy">{chosen.price}</span>
              </div>
              {quoteMeta.dutyTaxEstimateCents ? (
                <p className="text-sm text-slate-600">
                  Est. duty/tax: ${(quoteMeta.dutyTaxEstimateCents / 100).toFixed(2)}
                </p>
              ) : null}
              {quoteMeta.carbonKg ? (
                <p className="text-sm text-slate-600">Est. carbon: {quoteMeta.carbonKg} kg CO₂e</p>
              ) : null}

              <div className="space-y-2 rounded-input border border-dashed border-slate-300 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-brand-navy">Continue as guest</p>
                <p className="text-xs text-slate-500">Pay now without creating an account. We’ll email your tracking number.</p>
                <Input
                  placeholder="Your email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  aria-label="Guest email"
                />
                <Input
                  placeholder="Recipient / your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  aria-label="Guest name"
                />
              </div>

              {checkoutMessage ? <p className="text-sm text-slate-700">{checkoutMessage}</p> : null}
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                <Button
                  type="button"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={checkoutBusy}
                  onClick={async () => {
                    if (!guestEmail.trim()) {
                      setCheckoutMessage("Enter an email to continue as guest.");
                      return;
                    }
                    setCheckoutBusy(true);
                    setCheckoutMessage("");
                    const values = form.getValues();
                    const weightKg = unit === "lbs" ? Number(values.weight) * 0.453592 : Number(values.weight);
                    try {
                      const res = await fetch("/api/checkout/guest", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          quoteId: quoteMeta.quoteId,
                          guestEmail: guestEmail.trim(),
                          guestName: guestName.trim() || values.commodity,
                          origin: values.origin,
                          destination: values.destination,
                          recipientName: guestName.trim() || "Guest recipient",
                          recipientEmail: guestEmail.trim(),
                          weightKg,
                          declaredValueCents: Math.round(Number(values.declaredValue) * 100),
                          commodity: values.commodity,
                          quantity: values.quantity,
                          serviceType: chosen.serviceType,
                          carrier: chosen.carrier,
                          amountCents: chosen.amountCents,
                          completePayment: true
                        })
                      });
                      const json = await res.json();
                      if (!json.ok) {
                        setCheckoutMessage(json.error ?? "Checkout failed");
                        return;
                      }
                      if (json.data.status === "booked") {
                        const params = new URLSearchParams({
                          service: chosen.name,
                          total: chosen.price,
                          origin: values.origin,
                          destination: values.destination,
                          tracking: json.data.trackingNumber,
                          recipientToken: json.data.recipientToken ?? ""
                        });
                        void router.push(`/booking-confirmation?${params.toString()}`);
                        return;
                      }
                      setCheckoutMessage("Payment required — complete card entry, then we’ll book your label.");
                    } catch {
                      setCheckoutMessage("Network error during checkout.");
                    } finally {
                      setCheckoutBusy(false);
                    }
                  }}
                >
                  {checkoutBusy ? "Processing…" : "Pay Now (Guest)"}
                </Button>
                <Button variant="secondary" type="button" onClick={() => setCheckoutMessage("Enterprise invoice request logged — our team will follow up.")}>
                  Request Invoice (Enterprise)
                </Button>
                <Button variant="ghost" type="button" onClick={() => setStep(2)}>
                  Back
                </Button>
              </div>
            </Card>
            <Card className="space-y-3 self-start">
              <p className="font-semibold text-brand-navy">Order summary</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between">
                  <span>Service</span>
                  <span className="font-medium">{chosen.name}</span>
                </li>
                <li className="flex justify-between">
                  <span>Transit</span>
                  <span className="font-medium">{chosen.days}</span>
                </li>
                <li className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-brand-navy">
                  <span>Total</span>
                  <span>{chosen.price}</span>
                </li>
              </ul>
              <Link href="/create-shipment">
                <Button className="w-full" type="button">
                  Create account & book
                </Button>
              </Link>
              <Link href={"/saved-quotes" as never}>
                <Button variant="secondary" className="w-full" type="button">
                  View saved quotes
                </Button>
              </Link>
            </Card>
          </div>
        ) : null}
      </section>
    </main>
  );
}
