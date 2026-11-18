"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Badge,
  Card,
  DataTable,
  EmptyState,
  FilterBar,
  Input,
  type DataTableColumn
} from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminStaff, type DemoAdminStaff } from "@/lib/demo/admin-fixtures";
import { hasPermission } from "@/lib/rbac";
import {
  STAFF_ROLE_LABELS,
  grantedPermissionsForRole,
  staffLabelToPersistedRole
} from "@/lib/rbac-matrix";

export default function AdminStaffPage() {
  const { data: session } = useSession();
  const staffRole = session?.user?.staffRole ?? null;
  const canView = !staffRole || hasPermission(staffRole, "staff.view");
  const canManage = staffRole ? hasPermission(staffRole, "staff.manage") : false;

  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("All");
  const [account, setAccount] = useState("All");

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(demoAdminStaff.map((s) => s.department))).sort()],
    []
  );

  const rows = useMemo(() => {
    return demoAdminStaff.filter((s) => {
      if (department !== "All" && s.department !== department) return false;
      if (account !== "All" && s.accountStatus !== account) return false;
      const query = q.trim().toLowerCase();
      if (!query) return true;
      return [s.reference, s.name, s.department, s.title, s.roleLabel, s.email].some((v) =>
        v.toLowerCase().includes(query)
      );
    });
  }, [q, department, account]);

  const columns: DataTableColumn<DemoAdminStaff>[] = [
    {
      id: "reference",
      header: "Reference",
      cell: (s) => <span className="font-mono text-xs font-semibold">{s.reference}</span>
    },
    {
      id: "name",
      header: "Staff",
      cell: (s) => (
        <div>
          <p className="font-semibold text-brand-navy">{s.name}</p>
          <p className="ns-meta">{s.email}</p>
          <p className="ns-meta">{s.phone}</p>
        </div>
      )
    },
    {
      id: "department",
      header: "Department",
      cell: (s) => s.department
    },
    {
      id: "title",
      header: "Job title",
      cell: (s) => s.title
    },
    {
      id: "role",
      header: "Persisted role",
      cell: (s) => {
        const mapped = staffLabelToPersistedRole(s.roleLabel);
        return (
          <div className="space-y-1">
            <p className="text-sm">{s.roleLabel}</p>
            {mapped ? (
              <Badge tone="info">{STAFF_ROLE_LABELS[mapped]} · {mapped}</Badge>
            ) : (
              <Badge tone="warning">Unmapped label</Badge>
            )}
          </div>
        );
      }
    },
    {
      id: "employment",
      header: "Employment",
      cell: (s) => (
        <Badge tone={s.employmentStatus === "Active" ? "success" : "warning"}>{s.employmentStatus}</Badge>
      )
    },
    {
      id: "account",
      header: "Account",
      cell: (s) => (
        <Badge tone={s.accountStatus === "Active" ? "success" : "warning"}>{s.accountStatus}</Badge>
      )
    },
    {
      id: "lastLogin",
      header: "Last login",
      cell: () => <span className="ns-meta">Not available</span>
    },
    {
      id: "actions",
      header: "Profile",
      cell: (s) =>
        canView ? (
          <Link href={`/admin/staff/${s.id}` as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Open
          </Link>
        ) : (
          <span className="ns-meta">Restricted</span>
        )
    }
  ];

  if (!canView) {
    return (
      <section className="mx-auto max-w-ns-xl space-y-6">
        <DashboardPageHeader title="Staff directory" description="staff.view permission required." />
        <EmptyState
          title="Access restricted"
          description="Your session role does not include staff.view. Navigation and APIs remain gated by lib/rbac.ts."
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title="User & staff management"
        description="UI-20 personnel directory. Role chips map demonstration labels to persisted StaffRole values where unambiguous. Passwords and tokens are never shown."
        actions={
          canManage ? (
            <Badge tone="info">staff.manage present — no mutate API on this UI</Badge>
          ) : (
            <Badge tone="warning">View only (no staff.manage)</Badge>
          )
        }
      />

      <AdminUiNote>
        Last-login is not stored on demonstration staff fixtures or exposed by the current staff API — the column shows
        “Not available”. Account secrets are omitted. Privilege changes require authorized backend APIs; this page does
        not assign live roles.
      </AdminUiNote>

      <FilterBar>
        <div className="min-w-[12rem] flex-1">
          <label className="ns-meta uppercase" htmlFor="staff-q">
            Search
          </label>
          <Input
            id="staff-q"
            className="mt-1"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, department, role, email…"
          />
        </div>
        <div>
          <label className="ns-meta uppercase" htmlFor="staff-dept">
            Department
          </label>
          <select
            id="staff-dept"
            className="mt-1 h-11 rounded-input border border-ns-border bg-white px-3 text-sm"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="ns-meta uppercase" htmlFor="staff-account">
            Account status
          </label>
          <select
            id="staff-account"
            className="mt-1 h-11 rounded-input border border-ns-border bg-white px-3 text-sm"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Invited</option>
            <option>Suspended</option>
          </select>
        </div>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(s) => s.id}
        empty="No staff records match the current filters."
      />

      <Card className="space-y-2 text-sm text-slate-600">
        <h2 className="ns-card-title">Persisted role reference</h2>
        <p>
          Mapped grants for directory labels use `lib/rbac.ts` allowlists. Example — Operations Manager (
          <code className="font-mono text-xs">OPS_MANAGER</code>):{" "}
          {grantedPermissionsForRole("OPS_MANAGER").join(", ")}.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={"/admin/roles" as never} className="font-semibold text-brand-navy hover:underline">
            Role catalogue
          </Link>
          <Link href={"/admin/permissions" as never} className="font-semibold text-brand-navy hover:underline">
            Permission matrix
          </Link>
        </div>
      </Card>
    </section>
  );
}
