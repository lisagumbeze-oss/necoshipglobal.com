"use client";

import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";
import { useQueryClient } from "react-query";

type AddressRecord = {
  id: string;
  name: string;
  company?: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  isDefault?: boolean;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

function AddressModal({
  title,
  initial,
  onClose,
  onSave
}: {
  title: string;
  initial?: Partial<AddressRecord>;
  onClose: () => void;
  onSave: (draft: Partial<AddressRecord>) => void;
}) {
  const [draft, setDraft] = useState<Partial<AddressRecord>>({
    name: initial?.name ?? "",
    company: initial?.company ?? "",
    country: initial?.country ?? "",
    city: initial?.city ?? "",
    address: initial?.address ?? "",
    phone: initial?.phone ?? ""
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-label={title}>
      <Card className="w-full max-w-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Address</p>
            <p className="font-display text-xl font-bold text-brand-navy">{title}</p>
          </div>
          <Button variant="ghost" type="button" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Name" value={draft.name ?? ""} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
          <Input
            placeholder="Company (optional)"
            value={draft.company ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
          />
          <Input
            placeholder="Country"
            value={draft.country ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))}
          />
          <Input placeholder="City" value={draft.city ?? ""} onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))} />
          <Input
            className="md:col-span-2"
            placeholder="Street address"
            value={draft.address ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
          />
          <Input
            className="md:col-span-2"
            placeholder="Phone"
            value={draft.phone ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => onSave(draft)}>
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function AddressBookPage() {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);

  const [modal, setModal] = useState<null | { mode: "add" | "edit"; record?: AddressRecord }>(null);

  const query = useQuery(["addresses"], () => apiQuery<AddressRecord[]>("/api/addresses"));

  const filtered = useMemo(() => {
    let items = query.data ?? [];
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      items = items.filter((a) =>
        `${a.name} ${a.company ?? ""} ${a.city} ${a.country} ${a.address} ${a.phone}`.toLowerCase().includes(s)
      );
    }
    if (!letter) return items;
    return items.filter((a) => (a.name ?? "").toUpperCase().startsWith(letter));
  }, [query.data, letter, q]);

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Address Book</h1>
            <p className="text-sm text-slate-600">Reusable recipients and senders for faster booking.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" type="button" onClick={() => setShowImport(true)}>
              <Upload size={16} aria-hidden /> Import CSV
            </Button>
            <Button type="button" onClick={() => setModal({ mode: "add" })}>
              <Plus size={16} aria-hidden /> Add Address
            </Button>
          </div>
        </header>

        <Card className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input placeholder="Search name, company, city, country, address..." value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="flex items-center justify-end gap-2">
            <Badge tone="default">{filtered.length} results</Badge>
            <Button variant="ghost" type="button" onClick={() => setLetter(null)}>
              Clear A–Z
            </Button>
          </div>
        </Card>

        <Card className="flex flex-wrap gap-2">
          {alphabet.map((l) => (
            <button
              key={l}
              type="button"
              className={`focus-ring rounded-button px-3 py-2 text-xs font-semibold ${
                letter === l ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              onClick={() => setLetter((prev) => (prev === l ? null : l))}
              aria-pressed={letter === l}
            >
              {l}
            </button>
          ))}
        </Card>

        {query.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-card bg-slate-100" />
            ))}
          </div>
        ) : query.isError ? (
          <Card className="text-sm text-red-700">Failed to load addresses. Please try again.</Card>
        ) : filtered.length === 0 ? (
          <Card className="text-sm text-slate-600">
            No contacts yet. Add an address or import contacts from CSV.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Card key={a.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                      {initials(a.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy">{a.name}</p>
                      <p className="text-xs text-slate-500">{a.company ?? "—"}</p>
                    </div>
                  </div>
                  <Badge tone="default">{a.country}</Badge>
                </div>

                <div className="text-sm text-slate-600">
                  <p className="font-medium text-brand-navy">{a.city}</p>
                  <p className="text-xs text-slate-500">{a.address}</p>
                  <p className="mt-2 text-xs text-slate-500">{a.phone}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="button" className="flex-1">
                    Quick-Ship
                  </Button>
                  <Button variant="secondary" type="button" onClick={() => setModal({ mode: "edit", record: a })}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    type="button"
                    onClick={() => {
                      // Prototype delete: just show a confirmation prompt UI
                      // (real implementation would call API + invalidate query)
                      pushToast({ tone: "info", title: "Address removed", message: a.name });
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {showImport ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-label="Import CSV">
            <Card className="w-full max-w-2xl space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Import</p>
                  <p className="font-display text-xl font-bold text-brand-navy">Import Contacts (CSV)</p>
                </div>
                <Button variant="ghost" type="button" onClick={() => setShowImport(false)}>
                  Close
                </Button>
              </div>
              <div className="rounded-card border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                Drag & drop a CSV here, then map columns to Name / Company / Country / City / Address / Phone.
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-input border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-brand-navy">Column mapper (stub)</p>
                  <p className="mt-1 text-slate-600">Name → “full_name”</p>
                  <p className="text-slate-600">Phone → “phone_number”</p>
                </div>
                <div className="rounded-input border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-brand-navy">Validation report (stub)</p>
                  <p className="mt-1 text-slate-600">0 invalid rows · 0 duplicates</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" type="button" onClick={() => setShowImport(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setShowImport(false)}>
                  Import
                </Button>
              </div>
            </Card>
          </div>
        ) : null}

        {modal ? (
          <AddressModal
            title={modal.mode === "add" ? "Add address" : "Edit address"}
            initial={modal.record}
            onClose={() => setModal(null)}
            onSave={async (draft) => {
              try {
                await apiQuery("/api/addresses", {
                  method: "POST",
                  body: JSON.stringify({
                    name: draft.name ?? "",
                    company: draft.company || undefined,
                    country: draft.country ?? "",
                    city: draft.city ?? "",
                    line1: draft.address ?? "",
                    postalCode: "00000",
                    phone: draft.phone || undefined,
                    isDefault: false
                  })
                });
                await queryClient.invalidateQueries(["addresses"]);
                pushToast({ tone: "success", title: "Address saved", message: draft.name });
                setModal(null);
              } catch (err) {
                pushToast({
                  tone: "error",
                  title: "Could not save address",
                  message: err instanceof Error ? err.message : "Try again"
                });
              }
            }}
          />
        ) : null}
      </section>
    </main>
  );
}
