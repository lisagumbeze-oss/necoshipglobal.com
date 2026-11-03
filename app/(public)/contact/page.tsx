"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { Clock, Mail, Phone } from "lucide-react";

const regions = [
  { region: "USA", phone: "+1 (800) 555-0199", tz: "America/Los_Angeles", label: "Los Angeles (HQ)" },
  { region: "Europe", phone: "+49 69 555 0140", tz: "Europe/Berlin", label: "Frankfurt" },
  { region: "Asia", phone: "+65 6555 0130", tz: "Asia/Singapore", label: "Singapore" },
  { region: "Africa", phone: "+27 11 555 0120", tz: "Africa/Johannesburg", label: "Johannesburg" }
];

function LocalTime({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(id);
  }, []);
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short"
  }).format(now);
  return <span className="font-mono text-sm">{formatted}</span>;
}

export default function ContactPage() {
  const [online] = useState(true);

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-brand-navy">Contact & Support</h1>
          <p className="mt-2 text-slate-600">Reach {BRAND.name} operations, billing, or customs teams by region.</p>
        </header>

        <div
          className={`flex flex-wrap items-center gap-3 rounded-card border p-4 ${
            online ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
          }`}
          role="status"
        >
          <span className={`relative flex h-3 w-3 ${online ? "bg-emerald-500" : "bg-amber-500"} rounded-full`}>
            {online ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /> : null}
          </span>
          <p className="text-sm font-medium text-brand-navy">
            {online ? "We're online now — live chat and phone queues are staffed." : "Currently offline — leave a message and we'll respond within 4 hours."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4">
            <h2 className="font-semibold text-brand-navy">Contact form</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="Full name" autoComplete="name" />
              <Input placeholder="Email" type="email" autoComplete="email" />
              <Input className="sm:col-span-2" placeholder="Tracking number (optional)" />
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">Issue type</label>
                <select className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm">
                  <option>Tracking / delivery</option>
                  <option>Customs / documentation</option>
                  <option>Billing / invoices</option>
                  <option>Technical / API</option>
                  <option>Other</option>
                </select>
              </div>
              <textarea
                className="focus-ring sm:col-span-2 min-h-[120px] w-full rounded-input border border-slate-300 p-3 text-sm"
                placeholder="How can we help?"
              />
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-input border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  <span>Drag & drop files or click to attach</span>
                  <input type="file" className="hidden" multiple />
                </label>
              </div>
            </div>
            <Button type="button" className="w-full sm:w-auto">
              Submit request
            </Button>
          </Card>

          <div className="space-y-4">
            <Card className="space-y-3">
              <h2 className="font-semibold text-brand-navy">Regional offices</h2>
              <p className="text-sm text-slate-600">Local numbers and live clocks for each operations desk.</p>
              <ul className="space-y-3">
                {regions.map((r) => (
                  <li key={r.region} className="rounded-input border border-slate-200 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-brand-navy">{r.region}</p>
                        <p className="text-xs text-slate-500">{r.label}</p>
                      </div>
                      <Badge tone="default">{r.region}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Phone size={14} aria-hidden /> {r.phone}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} aria-hidden />
                        <LocalTime timeZone={r.tz} />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="space-y-2 text-sm text-slate-600">
              <p className="font-semibold text-brand-navy">Email support</p>
              <a
                href={`mailto:${BRAND.supportEmail}`}
                className="inline-flex items-center gap-2 font-medium text-brand-navy hover:underline"
              >
                <Mail size={14} aria-hidden />
                {BRAND.supportEmail}
              </a>
              <p className="text-xs text-slate-500">
                {BRAND.officialName} ({BRAND.shortName}) ·{" "}
                <a href={BRAND.websiteUrl} className="hover:text-brand-navy" rel="noopener noreferrer">
                  {BRAND.websiteHost}
                </a>
              </p>
            </Card>
            <Card className="text-sm text-slate-600">
              <p className="font-semibold text-brand-navy">Live chat</p>
              <p className="mt-1">Use the floating chat widget — agents appear when online with name and avatar.</p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
