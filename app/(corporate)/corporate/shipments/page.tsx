"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Button,
  DataTable,
  DateField,
  FilterBar,
  FormField,
  Pagination,
  SearchField,
  Select
} from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import {
  demoCorporateShipments,
  demoCostCentres,
  demoOrganization,
  scopeByOrganization,
  type DemoCorporateShipment
} from "@/lib/demo/corporate-fixtures";
import { SHIPMENT_STATUSES } from "@/lib/demo/shipment-status";

const PAGE_SIZE = 5;

export default function CorporateShipmentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [costCentre, setCostCentre] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortColumn, setSortColumn] = useState("bookingDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = scopeByOrganization(demoCorporateShipments, demoOrganization.id);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.trackingNumber.toLowerCase().includes(q) ||
          r.reference.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }
    if (status !== "ALL") rows = rows.filter((r) => r.status === status);
    if (costCentre !== "ALL") rows = rows.filter((r) => r.costCentreCode === costCentre);
    if (from) rows = rows.filter((r) => r.bookingDate >= from);
    if (to) rows = rows.filter((r) => r.bookingDate <= to);
    rows = [...rows].sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortColumn === "trackingNumber") return a.trackingNumber.localeCompare(b.trackingNumber) * dir;
      if (sortColumn === "status") return a.status.localeCompare(b.status) * dir;
      return a.bookingDate.localeCompare(b.bookingDate) * dir;
    });
    return rows;
  }, [query, status, costCentre, from, to, sortColumn, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSort = (columnId: string) => {
    if (sortColumn === columnId) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Company shipments"
        description={`Demonstration shipments for ${demoOrganization.tradingName} only. Scoped by organization membership — other organizations are never shown.`}
        actions={
          <Link href={"/corporate/create-shipment" as never}>
            <Button>New shipment</Button>
          </Link>
        }
      />

      <FilterBar>
        <FormField label="Search" htmlFor="corp-ship-q" className="min-w-[14rem] flex-1">
          <SearchField
            id="corp-ship-q"
            placeholder="Tracking, reference, destination…"
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
          />
        </FormField>
        <FormField label="Status" htmlFor="corp-ship-status" className="min-w-[11rem]">
          <Select
            id="corp-ship-status"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="ALL">All statuses</option>
            {SHIPMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Cost centre" htmlFor="corp-ship-cc" className="min-w-[12rem]">
          <Select
            id="corp-ship-cc"
            value={costCentre}
            onChange={(e) => {
              setPage(1);
              setCostCentre(e.target.value);
            }}
          >
            <option value="ALL">All cost centres</option>
            {demoCostCentres.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="From" htmlFor="corp-ship-from" className="min-w-[10rem]">
          <DateField
            id="corp-ship-from"
            value={from}
            onChange={(e) => {
              setPage(1);
              setFrom(e.target.value);
            }}
          />
        </FormField>
        <FormField label="To" htmlFor="corp-ship-to" className="min-w-[10rem]">
          <DateField
            id="corp-ship-to"
            value={to}
            onChange={(e) => {
              setPage(1);
              setTo(e.target.value);
            }}
          />
        </FormField>
      </FilterBar>

      {pageRows.length === 0 ? (
        <EmptyState
          title="No shipments match"
          description="Adjust filters or create a new demonstration shipment request."
          action={
            <Link href={"/corporate/create-shipment" as never}>
              <Button variant="secondary">New shipment</Button>
            </Link>
          }
        />
      ) : (
        <>
          <DataTable<DemoCorporateShipment>
            rows={pageRows}
            rowKey={(row) => row.id}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={onSort}
            columns={[
              {
                id: "trackingNumber",
                header: "Tracking",
                sortable: true,
                cell: (s) => (
                  <Link
                    href={`/corporate/shipments/${s.trackingNumber}` as never}
                    className="font-mono text-xs font-semibold text-brand-navy hover:underline"
                  >
                    {s.trackingNumber}
                  </Link>
                )
              },
              { id: "reference", header: "Reference", cell: (s) => s.reference },
              { id: "department", header: "Department", cell: (s) => s.department },
              {
                id: "costCentre",
                header: "Cost centre",
                cell: (s) => (
                  <span>
                    {s.costCentreCode}
                    <span className="block text-xs text-slate-500">{s.costCentreName}</span>
                  </span>
                )
              },
              {
                id: "lane",
                header: "Lane",
                cell: (s) => `${s.origin} → ${s.destination}`
              },
              { id: "method", header: "Method", cell: (s) => s.method },
              {
                id: "bookingDate",
                header: "Booked",
                sortable: true,
                cell: (s) => s.bookingDate
              },
              { id: "delivery", header: "Delivery", cell: (s) => s.deliveryDate ?? "—" },
              {
                id: "status",
                header: "Status",
                sortable: true,
                cell: (s) => <ShipmentStatusBadge status={s.status} />
              }
            ]}
          />
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            summary={`Showing ${pageRows.length} of ${filtered.length} demonstration records`}
          />
        </>
      )}
    </section>
  );
}
