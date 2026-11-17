"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoCustomer } from "@/lib/demo/customer-fixtures";

export default function SettingsPage() {
  const [profile, setProfile] = useState(demoCustomer);
  const [emailPrefs, setEmailPrefs] = useState({
    shipmentUpdates: true,
    marketing: false,
    invoices: true
  });
  const [notice, setNotice] = useState("");

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title="Account Settings"
        description="Personal, notification and security preferences for the demonstration customer profile."
      />

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Personal details</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} aria-label="Name" />
          <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} aria-label="Email" />
          <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} aria-label="Phone" />
          <Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} aria-label="City" />
          <Input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} aria-label="Country" />
          <Input value={profile.accountType} disabled aria-label="Account type" />
        </div>
        <Button
          type="button"
          onClick={() => {
            try {
              window.sessionStorage.setItem("neco_demo_profile", JSON.stringify(profile));
            } catch {
              /* ignore */
            }
            setNotice("Demonstration profile saved locally in this browser.");
          }}
        >
          Save profile (local demo)
        </Button>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Notification preferences</h2>
        {(
          [
            ["shipmentUpdates", "Email shipment updates"],
            ["invoices", "Email invoice notices"],
            ["marketing", "Product updates"]
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={emailPrefs[key]}
              onChange={(e) => setEmailPrefs({ ...emailPrefs, [key]: e.target.checked })}
            />
            {label}
          </label>
        ))}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Security settings</h2>
        <p className="text-sm text-slate-600">
          Password changes, multi-factor authentication and session revocation remain disconnected until secure
          authentication APIs are approved. This screen does not bypass NextAuth.
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setNotice("Security operations are unavailable in this demonstration module.")
          }
        >
          Manage security (unavailable)
        </Button>
      </Card>

      {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
    </section>
  );
}
