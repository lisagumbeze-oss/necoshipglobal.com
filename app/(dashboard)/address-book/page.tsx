"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ToneBadge } from "@/components/dashboard/status-badge";
import { demoAddresses, type DemoAddress } from "@/lib/demo/customer-fixtures";

const emptyForm = {
  label: "",
  category: "RECIPIENT" as DemoAddress["category"],
  name: "",
  line1: "",
  city: "",
  country: "",
  postalCode: "",
  phone: ""
};

export default function AddressBookPage() {
  const [rows, setRows] = useState<DemoAddress[]>(demoAddresses);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const save = () => {
    if (!form.label || !form.name || !form.line1 || !form.city || !form.country) {
      setNotice("Label, name, address line, city and country are required.");
      return;
    }
    if (editingId) {
      setRows((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
      setNotice("Demonstration address updated locally.");
    } else {
      setRows((prev) => [
        {
          id: `addr_local_${Date.now()}`,
          ...form,
          isDefault: prev.length === 0
        },
        ...prev
      ]);
      setNotice("Demonstration address added locally.");
    }
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Address Book"
        description="Manage sender and recipient sample addresses in local browser state only."
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">{editingId ? "Edit address" : "Add address"}</h2>
          <Input placeholder="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <select
            className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as DemoAddress["category"] })}
          >
            <option value="SENDER">Sender</option>
            <option value="RECIPIENT">Recipient</option>
            <option value="OTHER">Other / saved location</option>
          </select>
          <Input placeholder="Contact name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Address line" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input placeholder="Postal code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
          </div>
          <Input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={save}>
              {editingId ? "Save changes" : "Add address"}
            </Button>
            {editingId ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
          {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Saved shipping locations</h2>
          <ul className="space-y-3">
            {rows.map((addr) => (
              <li key={addr.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-brand-navy">{addr.label}</p>
                  <div className="flex flex-wrap gap-2">
                    <ToneBadge label={addr.category} tone="info" />
                    {addr.isDefault ? <ToneBadge label="Default" tone="success" /> : null}
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {addr.name} · {addr.line1}, {addr.city}, {addr.country} {addr.postalCode}
                </p>
                <p className="text-xs text-slate-500">{addr.phone}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(addr.id);
                      setForm({
                        label: addr.label,
                        category: addr.category,
                        name: addr.name,
                        line1: addr.line1,
                        city: addr.city,
                        country: addr.country,
                        postalCode: addr.postalCode,
                        phone: addr.phone
                      });
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setRows((prev) => prev.map((r) => ({ ...r, isDefault: r.id === addr.id })));
                      setNotice("Default sender address updated locally.");
                    }}
                  >
                    Set default
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setRows((prev) => prev.filter((r) => r.id !== addr.id));
                      setNotice("Demonstration address removed from local state.");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
