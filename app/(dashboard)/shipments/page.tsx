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
import { DEMO_DATA_NOTICE, demoShipments, type DemoShipment } from "@/lib/demo/customer-fixtures";
import { SHIPMENT_STATUSES } from "@/lib/demo/shipment-status";

const PAGE_SIZE = 8;

export default function MyShipmentsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("bookingDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...demoShipments];
    const query = q.trim().toLowerCase();
    if (query) {
      rows = rows.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(query) ||
          s.reference.toLowerCase().includes(query) ||
          s.origin.toLowerCase().includes(query) ||
          s.destination.toLowerCase().includes(query)
      );
    }
    if (status !== "ALL") rows = rows.filter((s) => s.status === status);
    if (from) rows = rows.filter((s) => s.bookingDate.slice(0, 10) >= from);
    if (to) rows = rows.filter((s) => s.bookingDate.slice(0, 10) <= to);

    rows.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortColumn === "trackingNumber") return a.trackingNumber.localeCompare(b.trackingNumber) * dir;
      if (sortColumn === "status") return a.status.localeCompare(b.status) * dir;
      if (sortColumn === "origin") return a.origin.localeCompare(b.origin) * dir;
      return a.bookingDate.localeCompare(b.bookingDate) * dir;
    });
    return rows;
  }, [q, status, from, to, sortColumn, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="My Shipments"
        description="Search and filter demonstration shipment records. UI-08 table hierarchy with NECO branding."
        actions={
          <Link href={"/create-shipment" as never}>
            <Button>New Shipment</Button>
          </Link>
        }
      />

      <p className="rounded-input border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{DEMO_DATA_NOTICE}</p>

      <FilterBar>
        <FormField label="Search" htmlFor="shipments-q" className="min-w-[14rem] flex-1">
          <SearchField
            id="shipments-q"
            placeholder="Tracking, reference, lane…"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />
        </FormField>
        <FormField label="Status" htmlFor="shipments-status" className="min-w-[11rem]">
          <Select
            id="shipments-status"
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
        <FormField label="From" htmlFor="shipments-from" className="min-w-[10rem]">
          <DateField
            id="shipments-from"
            value={from}
            onChange={(e) => {
              setPage(1);
              setFrom(e.target.value);
            }}
          />
        </FormField>
        <FormField label="To" htmlFor="shipments-to" className="min-w-[10rem]">
          <DateField
            id="shipments-to"
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
            <Link href={"/create-shipment" as never}>
              <Button variant="secondary">New Shipment</Button>
            </Link>
          }
        />
      ) : (
        <>
          <DataTable<DemoShipment>
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
                    href={`/shipments/${s.trackingNumber}` as never}
                    className="font-mono text-xs font-semibold text-brand-navy hover:underline"
                  >
                    {s.trackingNumber}
                  </Link>
                )
              },
              { id: "reference", header: "Reference", cell: (s) => s.reference },
              {
                id: "origin",
                header: "Origin",
                sortable: true,
                cell: (s) => s.origin
              },
              { id: "destination", header: "Destination", cell: (s) => s.destination },
              {
                id: "bookingDate",
                header: "Booked",
                sortable: true,
                cell: (s) => new Date(s.bookingDate).toLocaleDateString()
              },
              {
                id: "status",
                header: "Status",
                sortable: true,
                cell: (s) => <ShipmentStatusBadge status={s.status} />
              },
              {
                id: "actions",
                header: "Actions",
                headerClassName: "text-right",
                className: "text-right",
                cell: (s) => (
                  <Link
                    href={`/shipments/${s.trackingNumber}` as never}
                    className="font-semibold text-brand-navy hover:underline"
                  >
                    View
                  </Link>
                )
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
