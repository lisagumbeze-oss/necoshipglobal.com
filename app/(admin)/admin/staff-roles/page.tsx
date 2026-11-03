"use client";

import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { Plus, ShieldCheck, UserPlus } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type StaffRole = {
  id: string;
  name: string;
  permissions: Record<string, boolean>;
};

type StaffRecord = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  lastLogin: string;
  status: "Active" | "Suspended";
};

type StaffActivityRecord = {
  id: string;
  staffName: string;
  action: string;
  createdAt: string;
};

const permissionLabels: Record<string, string> = {
  "shipments.read": "Read shipments",
  "shipments.write": "Edit shipments",
  "exceptions.manage": "Manage exceptions",
  "customs.manage": "Manage customs queue",
  "finance.manage": "Finance & refunds",
  "support.manage": "Support dashboard",
  "staff.manage": "Staff & roles",
  "rates.manage": "Rate cards",
  "logs.read": "View system logs"
};

function RoleModal({
  role,
  onClose,
  onNotify
}: {
  role: StaffRole;
  onClose: () => void;
  onNotify: (title: string, message?: string) => void;
}) {
  const keys = Object.keys(role.permissions);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-label="Role permissions">
      <Card className="w-full max-w-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <p className="font-display text-xl font-bold text-brand-navy">{role.name}</p>
          </div>
          <Button variant="ghost" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="rounded-card border border-slate-200 bg-white">
          {keys.map((k) => (
            <div key={k} className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm first:border-t-0">
              <div>
                <p className="font-semibold text-brand-navy">{permissionLabels[k] ?? k}</p>
                <p className="mt-1 text-xs text-slate-500">{k}</p>
              </div>
              <Badge tone={role.permissions[k] ? "success" : "default"}>{role.permissions[k] ? "Allowed" : "Denied"}</Badge>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={() => onNotify("Role permission editor opened", role.name)}>
            Edit permissions
          </Button>
          <Button type="button" onClick={() => onNotify("Role saved", role.name)}>
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
}

function InviteModal({
  onClose,
  onNotify
}: {
  onClose: () => void;
  onNotify: (title: string, message?: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Customer Support Agent");
  const canSend = email.includes("@") && email.includes(".");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-label="Invite staff member">
      <Card className="w-full max-w-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Staff</p>
            <p className="font-display text-xl font-bold text-brand-navy">Invite staff member</p>
          </div>
          <Button variant="ghost" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
        <label className="text-xs font-semibold text-slate-600">
          Email
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@necoship.global" />
        </label>
        <label className="text-xs font-semibold text-slate-600">
          Role
          <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role name" />
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canSend}
            onClick={() => {
              onNotify("Invite sent", `${email} (${role})`);
              onClose();
            }}
          >
            <UserPlus size={16} aria-hidden /> Send invite
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function StaffRolesPage() {
  const { pushToast } = useToast();
  const onNotify = (title: string, message?: string) => pushToast({ tone: "info", title, message });
  const [q, setQ] = useState("");
  const [activeRole, setActiveRole] = useState<StaffRole | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const staffBundle = useQuery(["admin-staff-bundle"], () =>
    apiQuery<{ staff: StaffRecord[]; roles: StaffRole[]; activity: StaffActivityRecord[] }>("/api/admin/staff")
  );

  const rolesById = useMemo(
    () => new Map((staffBundle.data?.roles ?? []).map((r) => [r.id, r])),
    [staffBundle.data?.roles]
  );

  const rows = useMemo(() => {
    const list = staffBundle.data?.staff ?? [];
    if (!q.trim()) return list;
    const s = q.trim().toLowerCase();
    return list.filter((m) => `${m.name} ${m.email} ${m.id}`.toLowerCase().includes(s));
  }, [q, staffBundle.data?.staff]);

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Staff & Roles</h1>
            <p className="text-sm text-slate-600">Admin workforce management with granular permissions and activity logs.</p>
          </div>
          <Button type="button" onClick={() => setShowInvite(true)}>
            <Plus size={16} aria-hidden /> Invite Staff Member
          </Button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search staff name, email, ID…" />
              <Badge tone="default">{rows.length} staff</Badge>
            </Card>

            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                <div className="col-span-4">Staff</div>
                <div className="col-span-3">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3 text-right">Last login</div>
              </div>

              {staffBundle.isLoading ? (
                <div className="space-y-2 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-input bg-slate-100" />
                  ))}
                </div>
              ) : staffBundle.isError ? (
                <div className="p-4 text-sm text-red-700">Failed to load staff directory.</div>
              ) : rows.length === 0 ? (
                <div className="p-6 text-sm text-slate-600">No staff match your search.</div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {rows.map((m) => {
                    const role = rolesById.get(m.roleId);
                    return (
                      <div key={m.id} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                        <div className="col-span-4">
                          <p className="font-semibold text-brand-navy">{m.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{m.email}</p>
                        </div>
                        <div className="col-span-3">
                          <button
                            type="button"
                            className="focus-ring inline-flex items-center gap-2 rounded-button bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                            onClick={() => role && setActiveRole(role)}
                            disabled={!role}
                          >
                            <ShieldCheck size={14} aria-hidden /> {role?.name ?? "—"}
                          </button>
                        </div>
                        <div className="col-span-2">
                          <Badge tone={m.status === "Active" ? "success" : "danger"}>{m.status}</Badge>
                        </div>
                        <div className="col-span-3 text-right text-xs text-slate-500">{m.lastLogin}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Role templates</p>
              <p className="text-sm text-slate-600">Start from a template, then tune permissions by team.</p>
              <div className="space-y-2">
                {(staffBundle.data?.roles ?? []).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className="focus-ring flex w-full items-center justify-between rounded-input border border-slate-200 bg-white px-3 py-3 text-left text-sm hover:bg-slate-50"
                    onClick={() => setActiveRole(r)}
                  >
                    <span className="font-semibold text-brand-navy">{r.name}</span>
                    <Badge tone="default">{Object.values(r.permissions).filter(Boolean).length} perms</Badge>
                  </button>
                ))}
              </div>
              <Button variant="secondary" type="button" onClick={() => onNotify("Create role dialog opened")}>
                Create role
              </Button>
            </Card>

            <Card className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-brand-navy">Activity feed</p>
                <Badge tone="default">{(staffBundle.data?.activity ?? []).length} events</Badge>
              </div>
              {staffBundle.isLoading ? (
                <div className="h-10 animate-pulse rounded-input bg-slate-100" />
              ) : (
                <div className="space-y-2">
                  {(staffBundle.data?.activity ?? []).slice(0, 4).map((a) => (
                    <div key={a.id} className="rounded-input border border-slate-200 p-3 text-sm">
                      <p className="font-semibold text-brand-navy">{a.staffName}</p>
                      <p className="mt-1 text-xs text-slate-600">{a.action}</p>
                      <p className="mt-1 text-xs text-slate-500">{a.createdAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {activeRole ? <RoleModal role={activeRole} onClose={() => setActiveRole(null)} onNotify={onNotify} /> : null}
        {showInvite ? <InviteModal onClose={() => setShowInvite(false)} onNotify={onNotify} /> : null}
      </section>
    </main>
  );
}
