"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoCorporateContacts, demoOrganization } from "@/lib/demo/corporate-fixtures";

export default function CorporateSettingsPage() {
  const [notice, setNotice] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [exceptionAlerts, setExceptionAlerts] = useState(true);

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <DashboardPageHeader
        title="Corporate account settings"
        description="Company preferences for the demonstration organization. Visually aligned with the individual customer portal."
      />

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Company profile</h2>
        <Input defaultValue={demoOrganization.tradingName} aria-label="Trading name" />
        <Input defaultValue={demoOrganization.businessEmail} aria-label="Business email" />
        <Input defaultValue={demoOrganization.telephone} aria-label="Telephone" />
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Billing information</h2>
        <textarea
          className="focus-ring min-h-[80px] w-full rounded-input border border-slate-300 p-3 text-sm"
          defaultValue={demoOrganization.billingAddress}
          aria-label="Billing address"
        />
        <p className="text-xs text-slate-500">Corporate credit billing — distinct from individual prepaid wallets.</p>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Shipping addresses</h2>
        <textarea
          className="focus-ring min-h-[80px] w-full rounded-input border border-slate-300 p-3 text-sm"
          defaultValue={demoOrganization.businessAddress}
          aria-label="Primary shipping address"
        />
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Notification preferences</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
          Email operational alerts (demo)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={exceptionAlerts} onChange={(e) => setExceptionAlerts(e.target.checked)} />
          Exception notifications (demo)
        </label>
      </Card>

      <Card className="space-y-2">
        <h2 className="font-semibold text-brand-navy">Authorized contacts</h2>
        <ul className="space-y-2 text-sm">
          {demoCorporateContacts.map((c) => (
            <li key={c.id} className="rounded-xl border border-slate-200 px-3 py-2">
              <p className="font-medium text-brand-navy">{c.name}</p>
              <p className="text-slate-600">
                {c.role} · {c.email}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-2 text-sm text-slate-600">
        <h2 className="font-semibold text-brand-navy">Security settings</h2>
        <p>
          Authentication and permission changes are managed outside this demonstration module. Contact account support
          for production security changes.
        </p>
        <p className="text-xs">
          Account manager (demo): {demoOrganization.accountManagerName} · {demoOrganization.accountManagerEmail}
        </p>
      </Card>

      <Button
        type="button"
        onClick={() => setNotice("Demonstration preferences saved locally — not written to Production.")}
      >
        Save settings (local demo)
      </Button>
      {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
    </section>
  );
}
