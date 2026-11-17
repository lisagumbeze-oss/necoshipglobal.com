"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { SHIPPING_METHODS } from "@/lib/public-content";

const quoteSchema = z.object({
  originCountry: z.string().min(2, "Origin country is required"),
  originCity: z.string().min(2, "Origin city is required"),
  destinationCountry: z.string().min(2, "Destination country is required"),
  destinationCity: z.string().min(2, "Destination city is required"),
  shippingMethod: z.enum(["AIR", "OCEAN", "ROAD", "EXPRESS", "UNSURE"]),
  weightKg: z.coerce.number().positive("Weight must be greater than 0"),
  lengthCm: z.coerce.number().positive("Length is required"),
  widthCm: z.coerce.number().positive("Width is required"),
  heightCm: z.coerce.number().positive("Height is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  commodity: z.string().min(2, "Commodity description is required"),
  declaredValue: z.coerce.number().min(0, "Declared value cannot be negative"),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Enter a valid email"),
  notes: z.string().optional()
});

type QuoteForm = z.infer<typeof quoteSchema>;

const steps = ["Shipment details", "Cargo profile", "Review & submit"] as const;

export default function QuotePage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const form = useForm<QuoteForm>({
    resolver: zodResolver(quoteSchema),
    mode: "onBlur",
    defaultValues: {
      originCountry: "",
      originCity: "",
      destinationCountry: "",
      destinationCity: "",
      shippingMethod: "AIR",
      weightKg: 10,
      lengthCm: 40,
      widthCm: 30,
      heightCm: 20,
      quantity: 1,
      commodity: "",
      declaredValue: 0,
      contactName: "",
      contactEmail: "",
      notes: ""
    }
  });

  const values = form.watch();
  const methodLabel = useMemo(
    () => SHIPPING_METHODS.find((m) => m.value === values.shippingMethod)?.label ?? values.shippingMethod,
    [values.shippingMethod]
  );

  const goNext = async () => {
    const fieldsByStep: (keyof QuoteForm)[][] = [
      ["originCountry", "originCity", "destinationCountry", "destinationCity", "shippingMethod"],
      ["weightKg", "lengthCm", "widthCm", "heightCm", "quantity", "commodity", "declaredValue"],
      ["contactName", "contactEmail"]
    ];
    const ok = await form.trigger(fieldsByStep[step]);
    if (!ok) return;
    if (step < steps.length - 1) setStep((s) => s + 1);
  };

  const submitRequest = async () => {
    const ok = await form.trigger();
    if (!ok) return;
    const data = form.getValues();
    // Local demonstration fixture only — no booking, payment or live rate claim.
    const id = `QR-${Date.now().toString().slice(-8)}`;
    try {
      window.sessionStorage.setItem(
        "neco_demo_quote_request",
        JSON.stringify({ id, ...data, createdAt: new Date().toISOString(), status: "awaiting_confirmation" })
      );
    } catch {
      /* private mode */
    }
    setReferenceId(id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
        <section className="mx-auto max-w-3xl">
          <Card className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-yellow">Demonstration request</p>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Quotation request received</h1>
            <p className="text-sm text-slate-600">
              Thank you. {BRAND.name} will review your details and provide a <strong>confirmed quotation</strong>. This
              website does not display fabricated final shipping charges when live negotiated rates are unavailable.
            </p>
            <div className="rounded-input border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                Reference: <span className="font-mono font-semibold text-brand-navy">{referenceId}</span>
              </p>
              <p className="mt-2">
                Lane: {values.originCity}, {values.originCountry} → {values.destinationCity},{" "}
                {values.destinationCountry}
              </p>
              <p className="mt-1">Preferred method: {methodLabel}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/tracking">
                <Button variant="secondary">Track a shipment</Button>
              </Link>
              <Link href={"/contact?topic=corporate" as never}>
                <Button>Contact sales</Button>
              </Link>
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setStep(0);
                  form.reset();
                }}
              >
                Start another request
              </Button>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-8 md:px-8">
      <section className="mx-auto max-w-4xl space-y-5">
        <header>
          <h1 className="font-display text-3xl font-bold text-brand-navy">Get a Quote</h1>
          <p className="mt-1 text-sm text-slate-600">
            Progressive quotation request for {BRAND.name}. Final charges are confirmed by our team — not invented on
            this page.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-2" role="list" aria-label="Quote progress">
          {steps.map((label, index) => (
            <div
              key={label}
              role="listitem"
              className={`rounded-input p-2 text-center text-xs font-medium sm:text-sm ${
                step >= index ? "bg-brand-yellow text-brand-navy" : "bg-slate-200 text-slate-600"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {step === 0 ? (
          <Card className="space-y-4">
            <h2 className="font-semibold text-brand-navy">Shipment details</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Origin country" error={form.formState.errors.originCountry?.message}>
                <Input aria-label="Origin country" {...form.register("originCountry")} />
              </Field>
              <Field label="Origin city" error={form.formState.errors.originCity?.message}>
                <Input aria-label="Origin city" {...form.register("originCity")} />
              </Field>
              <Field label="Destination country" error={form.formState.errors.destinationCountry?.message}>
                <Input aria-label="Destination country" {...form.register("destinationCountry")} />
              </Field>
              <Field label="Destination city" error={form.formState.errors.destinationCity?.message}>
                <Input aria-label="Destination city" {...form.register("destinationCity")} />
              </Field>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">Shipping method</label>
                <select
                  className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
                  aria-label="Shipping method"
                  {...form.register("shippingMethod")}
                >
                  {SHIPPING_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={() => void goNext()}>
                Continue
              </Button>
            </div>
          </Card>
        ) : null}

        {step === 1 ? (
          <Card className="space-y-4">
            <h2 className="font-semibold text-brand-navy">Cargo profile</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Package weight (kg)" error={form.formState.errors.weightKg?.message}>
                <Input type="number" min={0.1} step="0.1" aria-label="Package weight in kilograms" {...form.register("weightKg")} />
              </Field>
              <Field label="Package quantity" error={form.formState.errors.quantity?.message}>
                <Input type="number" min={1} aria-label="Package quantity" {...form.register("quantity")} />
              </Field>
              <Field label="Length (cm)" error={form.formState.errors.lengthCm?.message}>
                <Input type="number" min={1} aria-label="Length in centimetres" {...form.register("lengthCm")} />
              </Field>
              <Field label="Width (cm)" error={form.formState.errors.widthCm?.message}>
                <Input type="number" min={1} aria-label="Width in centimetres" {...form.register("widthCm")} />
              </Field>
              <Field label="Height (cm)" error={form.formState.errors.heightCm?.message}>
                <Input type="number" min={1} aria-label="Height in centimetres" {...form.register("heightCm")} />
              </Field>
              <Field label="Declared value (USD)" error={form.formState.errors.declaredValue?.message}>
                <Input type="number" min={0} aria-label="Declared value in USD" {...form.register("declaredValue")} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Commodity description" error={form.formState.errors.commodity?.message}>
                  <Input aria-label="Commodity description" placeholder="e.g. Consumer electronics accessories" {...form.register("commodity")} />
                </Field>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <Button variant="ghost" type="button" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button type="button" onClick={() => void goNext()}>
                Continue
              </Button>
            </div>
          </Card>
        ) : null}

        {step === 2 ? (
          <Card className="space-y-4">
            <h2 className="font-semibold text-brand-navy">Review & submit</h2>
            <div className="rounded-input border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p>
                <span className="font-medium text-brand-navy">Lane:</span> {values.originCity}, {values.originCountry} →{" "}
                {values.destinationCity}, {values.destinationCountry}
              </p>
              <p className="mt-1">
                <span className="font-medium text-brand-navy">Method:</span> {methodLabel}
              </p>
              <p className="mt-1">
                <span className="font-medium text-brand-navy">Cargo:</span> {values.quantity} × {values.weightKg} kg ·{" "}
                {values.lengthCm}×{values.widthCm}×{values.heightCm} cm · {values.commodity || "—"}
              </p>
              <p className="mt-1">
                <span className="font-medium text-brand-navy">Declared value:</span> USD {Number(values.declaredValue || 0).toFixed(2)}
              </p>
            </div>
            <div className="rounded-input border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
              Live rate calculation and negotiated tariffs are not shown as final prices on this page. After submission,
              you will receive a confirmed quotation from NECO.
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Contact name" error={form.formState.errors.contactName?.message}>
                <Input aria-label="Contact name" {...form.register("contactName")} />
              </Field>
              <Field label="Contact email" error={form.formState.errors.contactEmail?.message}>
                <Input type="email" aria-label="Contact email" {...form.register("contactEmail")} />
              </Field>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">Additional notes (optional)</label>
                <textarea
                  className="focus-ring min-h-[96px] w-full rounded-input border border-slate-300 p-3 text-sm"
                  aria-label="Additional notes"
                  {...form.register("notes")}
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <Button variant="ghost" type="button" onClick={() => setStep(1)}>
                Back
              </Button>
              <div className="flex flex-wrap gap-2">
                <Link href={"/contact?topic=corporate" as never}>
                  <Button variant="secondary" type="button">
                    Contact sales
                  </Button>
                </Link>
                <Button type="button" onClick={() => void submitRequest()}>
                  Submit quotation request
                </Button>
              </div>
            </div>
          </Card>
        ) : null}
      </section>
    </main>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
