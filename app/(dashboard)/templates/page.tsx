"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";
import { apiFetch } from "@/lib/client-api";
import { useToast } from "@/components/feedback/toast-provider";

type Template = {
  id: string;
  name: string;
  payload: {
    origin?: string;
    destination?: string;
    recipientName?: string;
    weightKg?: number;
    serviceType?: string;
    commodity?: string;
    hsCode?: string;
    costCenterCode?: string;
    notes?: string;
  };
  createdAt: string;
};

const emptyForm = {
  name: "",
  origin: "",
  destination: "",
  recipientName: "",
  weightKg: "5",
  serviceType: "EXPRESS_AIR",
  commodity: "",
  hsCode: "",
  costCenterCode: "",
  notes: ""
};

export default function TemplatesPage() {
  const { pushToast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const result = await apiFetch<Template[]>("/api/templates");
    setLoading(false);
    if (!result.ok) {
      pushToast({ tone: "error", title: "Failed to load templates", message: result.error });
      return;
    }
    setTemplates(result.data);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setSaving(true);
    const result = await apiFetch<Template>("/api/templates", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        payload: {
          origin: form.origin,
          destination: form.destination,
          recipientName: form.recipientName || undefined,
          weightKg: form.weightKg ? Number(form.weightKg) : undefined,
          serviceType: form.serviceType || undefined,
          commodity: form.commodity || undefined,
          hsCode: form.hsCode || undefined,
          costCenterCode: form.costCenterCode || undefined,
          notes: form.notes || undefined
        }
      })
    });
    setSaving(false);
    if (!result.ok) {
      pushToast({ tone: "error", title: "Save failed", message: result.error });
      return;
    }
    setForm(emptyForm);
    pushToast({ tone: "success", title: "Template saved", message: result.data.name });
    void load();
  };

  const remove = async (id: string) => {
    const result = await apiFetch(`/api/templates?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!result.ok) {
      pushToast({ tone: "error", title: "Delete failed", message: result.error });
      return;
    }
    pushToast({ tone: "info", title: "Template deleted" });
    void load();
  };

  return (
    <PageShell title="Shipment Templates" subtitle="Save reusable From/To, package, and service presets.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="space-y-3">
          <p className="font-semibold text-brand-navy">New template</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Template name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Service type" value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} />
            <Input placeholder="Origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
            <Input
              placeholder="Destination"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
            />
            <Input
              placeholder="Recipient name"
              value={form.recipientName}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Weight kg"
              value={form.weightKg}
              onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
            />
            <Input placeholder="Commodity" value={form.commodity} onChange={(e) => setForm({ ...form, commodity: e.target.value })} />
            <Input placeholder="HS code" value={form.hsCode} onChange={(e) => setForm({ ...form, hsCode: e.target.value })} />
            <Input
              className="md:col-span-2"
              placeholder="Cost center"
              value={form.costCenterCode}
              onChange={(e) => setForm({ ...form, costCenterCode: e.target.value })}
            />
            <textarea
              className="md:col-span-2 min-h-[80px] w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-sm focus-ring"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <Button
            type="button"
            disabled={saving || form.name.length < 1 || form.origin.length < 2 || form.destination.length < 2}
            onClick={() => void save()}
          >
            {saving ? "Saving…" : "Save template"}
          </Button>
        </Card>

        <div className="space-y-3">
          {loading ? (
            <div className="h-40 animate-pulse rounded-input bg-slate-100" />
          ) : templates.length === 0 ? (
            <Card className="text-sm text-slate-600">No templates yet.</Card>
          ) : (
            templates.map((tpl) => (
              <Card key={tpl.id} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-brand-navy">{tpl.name}</p>
                    <p className="text-sm text-slate-600">
                      {tpl.payload?.origin ?? "—"} → {tpl.payload?.destination ?? "—"}
                    </p>
                  </div>
                  <Badge>{tpl.payload?.serviceType ?? "CUSTOM"}</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {tpl.payload?.recipientName ?? "No recipient"} · {tpl.payload?.weightKg ?? "—"} kg ·{" "}
                  {tpl.payload?.commodity ?? "—"}
                </p>
                <Button type="button" variant="danger" onClick={() => void remove(tpl.id)}>
                  Delete
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}
