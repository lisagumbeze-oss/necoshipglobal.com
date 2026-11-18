"use client";

import { useMemo, useState } from "react";
import {
  AlertBanner,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  ChartContainer,
  DataTable,
  DateField,
  EmptyState,
  ErrorState,
  FilterBar,
  FormField,
  IconButton,
  Input,
  KpiCard,
  Modal,
  PageHeader,
  Pagination,
  SearchField,
  Select,
  SkeletonText,
  StatusBadge,
  Tabs,
  Timeline,
  ToastFrame
} from "@/components/design-system";

type DemoRow = { id: string; reference: string; status: string; lane: string };

const DEMO_ROWS: DemoRow[] = [
  { id: "1", reference: "TRK-DEMO-001", status: "In Transit", lane: "LAX → FRA" },
  { id: "2", reference: "TRK-DEMO-002", status: "Delivered", lane: "JFK → LOS" }
];

export function ComponentLibrary() {
  const [tab, setTab] = useState("primitives");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | undefined>("reference");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    const sorted = [...DEMO_ROWS];
    if (sortColumn === "reference") {
      sorted.sort((a, b) =>
        sortDirection === "asc" ? a.reference.localeCompare(b.reference) : b.reference.localeCompare(a.reference)
      );
    }
    return sorted;
  }, [sortColumn, sortDirection]);

  return (
    <section className="space-y-6">
      <PageHeader
        title="NECO design system"
        description="Shared tokens and components for public and authenticated experiences. Demonstration content only."
        breadcrumbs={<Breadcrumbs items={[{ label: "Platform" }, { label: "Design system" }]} />}
        actions={
          <Button type="button" onClick={() => setModalOpen(true)}>
            Open modal
          </Button>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "primitives", label: "Primitives" },
          { id: "data", label: "Data" },
          { id: "feedback", label: "Feedback" }
        ]}
      />

      {tab === "primitives" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="space-y-3">
            <h3 className="ns-card-title">Buttons & badges</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <IconButton label="More actions">⋯</IconButton>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge tone="info">In transit</Badge>
              <Badge tone="success">Delivered</Badge>
              <Badge tone="warning">Customs hold</Badge>
              <Badge tone="danger">Exception</Badge>
              <StatusBadge label="Booked" tone="info" description="Awaiting collection" />
            </div>
          </Card>

          <Card className="space-y-3">
            <h3 className="ns-card-title">Form controls</h3>
            <FormField label="Tracking number" htmlFor="ds-tracking">
              <Input id="ds-tracking" name="tracking" placeholder="Enter tracking number" />
            </FormField>
            <SearchField placeholder="Search records" />
            <FormField label="Service" htmlFor="ds-service">
              <Select id="ds-service" defaultValue="">
                <option value="" disabled>
                  Select service
                </option>
                <option value="express">Express</option>
                <option value="economy">Economy</option>
              </Select>
            </FormField>
            <FormField label="Pickup date" htmlFor="ds-date">
              <DateField id="ds-date" />
            </FormField>
          </Card>

          <div className="space-y-4">
            <KpiCard label="Active shipments" value="—" hint="Live counts require verified data" tone="info" />
            <ChartContainer title="Activity" description="Chart container shell for portal analytics.">
              <div className="flex h-40 items-center justify-center rounded-input bg-brand-surface-muted ns-meta">
                Chart slot
              </div>
            </ChartContainer>
          </div>
        </div>
      ) : null}

      {tab === "data" ? (
        <div className="space-y-4">
          <FilterBar>
            <FormField label="Query" htmlFor="ds-filter-q" className="min-w-[12rem] flex-1">
              <SearchField id="ds-filter-q" placeholder="Filter demonstration rows" />
            </FormField>
            <FormField label="Status" htmlFor="ds-filter-status" className="min-w-[10rem]">
              <Select id="ds-filter-status" defaultValue="all">
                <option value="all">All</option>
                <option value="transit">In transit</option>
              </Select>
            </FormField>
          </FilterBar>

          <DataTable
            rows={rows}
            rowKey={(row) => row.id}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={(id) => {
              if (sortColumn === id) {
                setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
              } else {
                setSortColumn(id);
                setSortDirection("asc");
              }
            }}
            columns={[
              {
                id: "reference",
                header: "Reference",
                sortable: true,
                cell: (row) => <span className="font-mono font-semibold">{row.reference}</span>
              },
              { id: "lane", header: "Lane", cell: (row) => row.lane },
              {
                id: "status",
                header: "Status",
                cell: (row) => (
                  <Badge tone={row.status === "Delivered" ? "success" : "info"}>{row.status}</Badge>
                )
              }
            ]}
          />
          <Pagination page={page} pageCount={3} onPageChange={setPage} summary="Demonstration pagination" />

          <Timeline
            items={[
              {
                id: "t1",
                title: "Collected",
                description: "Package collected at origin hub.",
                meta: "Demonstration timeline",
                badge: "Collected",
                tone: "info"
              },
              {
                id: "t2",
                title: "In transit",
                description: "Moving to destination gateway.",
                meta: "Demonstration timeline",
                badge: "In transit",
                tone: "info"
              }
            ]}
          />
        </div>
      ) : null}

      {tab === "feedback" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <EmptyState
            title="No shipments yet"
            description="Empty states use shared card styling and optional actions."
            action={<Button variant="secondary">Create shipment</Button>}
          />
          <ErrorState description="Use this pattern for recoverable UI failures. Do not expose internal errors." />
          <AlertBanner tone="warning" title="Demonstration notice">
            Figures and rows in this library are placeholders, not live operational data.
          </AlertBanner>
          <div className="space-y-3">
            <SkeletonText lines={4} />
            <ToastFrame tone="success" title="Saved" message="Toast presentation aligned to semantic tones." />
          </div>
        </div>
      ) : null}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Shared modal"
        description="Native dialog with focus handling and accessible labelling."
        footer={
          <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="ns-body">Use modals for short confirmations. Prefer drawers for denser operational panels.</p>
      </Modal>
    </section>
  );
}
