"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";
import { apiFetch } from "@/lib/client-api";
import { useToast } from "@/components/feedback/toast-provider";

type Org = {
  id: string;
  name: string;
  accountType: string;
  creditLimitCents: number | null;
  members: Array<{ userId: string; role: string }>;
  costCenters: Array<{ id: string; code: string; name: string }>;
};

export default function OrganizationPage() {
  const { pushToast } = useToast();
  const [organizations, setOrganizations] = useState<Org[]>([]);
  const [orgName, setOrgName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("SHIPPER");
  const [ccCode, setCcCode] = useState("");
  const [ccName, setCcName] = useState("");
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);

  const load = async () => {
    const result = await apiFetch<Org[]>("/api/organization");
    if (!result.ok) {
      pushToast({ tone: "error", title: "Failed to load organization", message: result.error });
      return;
    }
    setOrganizations(result.data);
    if (!activeOrgId && result.data[0]) setActiveOrgId(result.data[0].id);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = organizations.find((o) => o.id === activeOrgId) ?? organizations[0] ?? null;

  const createOrg = async () => {
    const result = await apiFetch<Org>("/api/organization", {
      method: "POST",
      body: JSON.stringify({ action: "create", name: orgName, accountType: "BUSINESS" })
    });
    if (!result.ok) {
      pushToast({ tone: "error", title: "Create failed", message: result.error });
      return;
    }
    setOrgName("");
    setActiveOrgId(result.data.id);
    pushToast({ tone: "success", title: "Organization created", message: result.data.name });
    void load();
  };

  const addMember = async () => {
    if (!active) return;
    const result = await apiFetch("/api/organization", {
      method: "POST",
      body: JSON.stringify({
        action: "add_member",
        organizationId: active.id,
        email: memberEmail,
        role: memberRole
      })
    });
    if (!result.ok) {
      pushToast({ tone: "error", title: "Member not added", message: result.error });
      return;
    }
    setMemberEmail("");
    pushToast({ tone: "success", title: "Member added" });
    void load();
  };

  const addCostCenter = async () => {
    if (!active) return;
    const result = await apiFetch("/api/organization", {
      method: "POST",
      body: JSON.stringify({
        action: "add_cost_center",
        organizationId: active.id,
        code: ccCode,
        name: ccName
      })
    });
    if (!result.ok) {
      pushToast({ tone: "error", title: "Cost center failed", message: result.error });
      return;
    }
    setCcCode("");
    setCcName("");
    pushToast({ tone: "success", title: "Cost center added" });
    void load();
  };

  return (
    <PageShell title="Organization" subtitle="Manage members, roles, and cost centers for business shipping.">
      <div className="space-y-4">
        <Card className="flex flex-wrap items-end gap-3">
          <Input
            className="max-w-sm"
            placeholder="New organization name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
          <Button type="button" disabled={orgName.trim().length < 2} onClick={() => void createOrg()}>
            Create organization
          </Button>
          {organizations.length > 0 ? (
            <select
              className="rounded-input border border-slate-300 bg-white px-3 py-2 text-sm focus-ring"
              value={active?.id ?? ""}
              onChange={(e) => setActiveOrgId(e.target.value)}
              aria-label="Select organization"
            >
              {organizations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          ) : null}
        </Card>

        {!active ? (
          <p className="text-sm text-slate-600">Create an organization to manage members and cost centers.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-brand-navy">{active.name}</p>
                <Badge>{active.accountType}</Badge>
              </div>
              <p className="text-xs text-slate-500">
                Credit limit: $
                {((active.creditLimitCents ?? 0) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <ul className="space-y-2 text-sm">
                {active.members.map((m) => (
                  <li
                    key={`${m.userId}-${m.role}`}
                    className="flex items-center justify-between gap-2 rounded-input border border-slate-200 px-3 py-2"
                  >
                    <span className="truncate">{m.userId}</span>
                    <Badge tone="default">{m.role}</Badge>
                  </li>
                ))}
              </ul>
              <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
                <Input
                  type="email"
                  placeholder="Member email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                />
                <select
                  className="rounded-input border border-slate-300 bg-white px-3 py-2 text-sm focus-ring"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                >
                  {["ORG_ADMIN", "SHIPPER", "BILLING", "VIEWER"].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <Button type="button" disabled={!memberEmail.includes("@")} onClick={() => void addMember()}>
                  Add
                </Button>
              </div>
            </Card>

            <Card className="space-y-3">
              <p className="font-semibold text-brand-navy">Cost centers</p>
              <ul className="space-y-2 text-sm">
                {active.costCenters.map((c) => (
                  <li key={c.id} className="flex justify-between gap-2 rounded-input border border-slate-200 px-3 py-2">
                    <span className="font-mono">{c.code}</span>
                    <span className="text-slate-600">{c.name}</span>
                  </li>
                ))}
              </ul>
              <div className="grid gap-2 md:grid-cols-2">
                <Input placeholder="Code" value={ccCode} onChange={(e) => setCcCode(e.target.value)} />
                <Input placeholder="Name" value={ccName} onChange={(e) => setCcName(e.target.value)} />
              </div>
              <Button type="button" disabled={!ccCode || !ccName} onClick={() => void addCostCenter()}>
                Add cost center
              </Button>
            </Card>
          </div>
        )}
      </div>
    </PageShell>
  );
}
