"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { useToast } from "@/components/feedback/toast-provider";

type LabelProfile = {
  id: string;
  name: string;
  format: string;
  widthIn: number;
  heightIn: number;
  dpi: number;
  printerLanguage: string;
  isDefault?: boolean;
};

export default function LabelProfilesPage() {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const query = useQuery(["label-profiles"], () => apiQuery<LabelProfile[]>("/api/admin/label-profiles"));
  const [preview, setPreview] = useState<string>("");

  return (
    <main className="space-y-4 p-4 md:p-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-brand-navy">Thermal label profiles</h1>
        <p className="text-sm text-slate-600">ZPL / EPL / PDF profiles with size and DPI for thermal printers.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(query.data ?? []).map((p) => (
          <Card key={p.id} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-brand-navy">{p.name}</p>
              {p.isDefault ? <Badge tone="success">Default</Badge> : <Badge>{p.format}</Badge>}
            </div>
            <p className="text-sm text-slate-600">
              {p.widthIn}×{p.heightIn} in · {p.dpi} dpi · {p.printerLanguage}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  await apiQuery("/api/admin/label-profiles", {
                    method: "POST",
                    body: JSON.stringify({ ...p, isDefault: true })
                  });
                  await queryClient.invalidateQueries(["label-profiles"]);
                  pushToast({ tone: "success", title: "Default profile set" });
                }}
              >
                Make default
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  const res = await apiQuery<{ body: string; format: string }>("/api/admin/label-profiles", {
                    method: "PUT",
                    body: JSON.stringify({ profileId: p.id })
                  });
                  setPreview(res.body);
                  pushToast({ tone: "info", title: `Preview ${res.format}` });
                }}
              >
                Preview
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {preview ? (
        <Card className="space-y-2">
          <p className="font-semibold text-brand-navy">Label preview payload</p>
          <pre className="max-h-80 overflow-auto rounded-input bg-slate-950 p-3 text-xs text-emerald-300">{preview}</pre>
        </Card>
      ) : null}
    </main>
  );
}
