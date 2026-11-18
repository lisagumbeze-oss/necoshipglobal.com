import type { ShipmentStatusCode } from "@/lib/demo/shipment-status";

/** Synthetic corporate fixtures for Module 3 UI only. */
export const CORPORATE_DEMO_NOTICE =
  "Demonstration data — sample corporate records for UI development only. Not live NECO financial, contractual or operational activity.";

/** Maps to Prisma OrgMemberRole labels for UI presentation (no schema change). */
export type CorporateUiRole = "ORG_ADMIN" | "SHIPPER" | "BILLING" | "VIEWER";

export const CORPORATE_ROLE_LABELS: Record<CorporateUiRole, string> = {
  ORG_ADMIN: "Organization Administrator",
  SHIPPER: "Shipment Manager",
  BILLING: "Billing Manager",
  VIEWER: "Viewer"
};

export type DemoOrganization = {
  id: string;
  registeredName: string;
  tradingName: string;
  registrationNumber: string;
  countryOfRegistration: string;
  businessAddress: string;
  billingAddress: string;
  mainContact: string;
  businessEmail: string;
  telephone: string;
  industry: string;
  accountNumberDemo: string;
  accountStatus: "Active" | "Under review" | "Suspended";
  contractStatus: "Active" | "Expiring Soon" | "Pending Review" | "Draft";
  accountManagerName: string;
  accountManagerEmail: string;
};

export type DemoCorporateShipment = {
  id: string;
  organizationId: string;
  trackingNumber: string;
  reference: string;
  department: string;
  costCentreCode: string;
  costCentreName: string;
  origin: string;
  destination: string;
  method: string;
  bookingDate: string;
  deliveryDate: string | null;
  status: ShipmentStatusCode;
};

export type DemoCorporateQuote = {
  id: string;
  organizationId: string;
  reference: string;
  origin: string;
  destination: string;
  method: string;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "QUOTED" | "EXPIRED";
  createdAt: string;
  notes: string;
};

export type DemoNegotiatedRate = {
  id: string;
  organizationId: string;
  contractReference: string;
  rateCardName: string;
  origin: string;
  destination: string;
  method: string;
  serviceCategory: "Air freight" | "Ocean freight" | "Road freight" | "Last-mile delivery" | "Warehousing" | "Freight forwarding";
  weightBand: string;
  /** Explicitly demonstration — never a live tariff. */
  demoRateLabel: string;
  minimumChargeLabel: string;
  surcharges: string;
  conditions: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  approvalStatus: "Draft" | "Pending Review" | "Approved" | "Expired";
};

export type DemoContractStatus =
  | "Draft"
  | "Pending Review"
  | "Pending Approval"
  | "Active"
  | "Expiring Soon"
  | "Expired"
  | "Suspended";

export type DemoContract = {
  id: string;
  organizationId: string;
  reference: string;
  title: string;
  effectiveFrom: string;
  expiresAt: string;
  status: DemoContractStatus;
  rateCardNames: string[];
  paymentTerms: string;
  specialConditions: string;
  /** Never presented as a signed legal instrument. */
  documentNote: string;
};

export type DemoCreditProfile = {
  organizationId: string;
  connected: boolean;
  approvedLimitLabel: string;
  outstandingBalanceLabel: string;
  availableCreditLabel: string;
  utilizationLabel: string;
  paymentTerms: string;
  overdueInvoicesLabel: string;
  approvalStatus: string;
  reviewDate: string;
  note: string;
};

export type DemoCorporateInvoice = {
  id: string;
  organizationId: string;
  reference: string;
  billingPeriod: string;
  invoiceDate: string;
  dueDate: string;
  subtotalLabel: string;
  taxLabel: string;
  totalLabel: string;
  currency: string;
  outstandingLabel: string;
  status: "Draft" | "Due" | "Paid" | "Overdue" | "Credit note";
};

export type DemoCostCentre = {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  department: string;
  manager: string;
  shipmentCount: number;
  expenditureLabel: string;
  budgetLabel: string;
  remainingLabel: string;
  status: "Active" | "Inactive";
};

export type DemoEmployee = {
  id: string;
  organizationId: string;
  name: string;
  reference: string;
  department: string;
  email: string;
  phone: string;
  accountStatus: "Active" | "Invited" | "Disabled";
  role: CorporateUiRole;
};

export type DemoCorporateContact = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
};

export const demoOrganization: DemoOrganization = {
  id: "org_demo_neco_enterprise",
  registeredName: "Sample Logistics Holdings Ltd",
  tradingName: "Sample Logistics",
  registrationNumber: "DEMO-REG-004821",
  countryOfRegistration: "United Kingdom",
  businessAddress: "100 Demonstration Quay, London, E14 5AB, United Kingdom",
  billingAddress: "Finance Desk, 100 Demonstration Quay, London, E14 5AB, United Kingdom",
  mainContact: "Alex Morgan",
  businessEmail: "accounts.demo@sample-logistics.example",
  telephone: "+44 20 7946 0000",
  industry: "Wholesale distribution (demonstration)",
  accountNumberDemo: "NSG-CORP-DEMO-7781",
  accountStatus: "Active",
  contractStatus: "Active",
  accountManagerName: "Jordan Lee (NECO demo contact)",
  accountManagerEmail: "account.manager.demo@necoshipglobal.example"
};

export const demoCorporateContacts: DemoCorporateContact[] = [
  {
    id: "cc1",
    name: "Alex Morgan",
    role: "Primary commercial contact",
    email: "alex.morgan@sample-logistics.example",
    phone: "+44 20 7946 0001"
  },
  {
    id: "cc2",
    name: "Priya Shah",
    role: "Billing contact",
    email: "billing@sample-logistics.example",
    phone: "+44 20 7946 0002"
  },
  {
    id: "cc3",
    name: "Marcus Chen",
    role: "Operations contact",
    email: "ops@sample-logistics.example",
    phone: "+44 20 7946 0003"
  }
];

export const demoCorporateShipments: DemoCorporateShipment[] = [
  {
    id: "csh1",
    organizationId: demoOrganization.id,
    trackingNumber: "NS-CORP-220100",
    reference: "PO-88421",
    department: "Procurement",
    costCentreCode: "CC-OPS",
    costCentreName: "Operations",
    origin: "London, GB",
    destination: "Rotterdam, NL",
    method: "Road freight",
    bookingDate: "2026-11-02",
    deliveryDate: null,
    status: "IN_TRANSIT"
  },
  {
    id: "csh2",
    organizationId: demoOrganization.id,
    trackingNumber: "NS-CORP-220101",
    reference: "PO-88455",
    department: "Retail",
    costCentreCode: "CC-RTL",
    costCentreName: "Retail fulfilment",
    origin: "Manchester, GB",
    destination: "Dublin, IE",
    method: "Air freight",
    bookingDate: "2026-11-05",
    deliveryDate: null,
    status: "CUSTOMS_PROCESSING"
  },
  {
    id: "csh3",
    organizationId: demoOrganization.id,
    trackingNumber: "NS-CORP-220102",
    reference: "PO-88390",
    department: "Procurement",
    costCentreCode: "CC-OPS",
    costCentreName: "Operations",
    origin: "Southampton, GB",
    destination: "Hamburg, DE",
    method: "Ocean freight",
    bookingDate: "2026-10-18",
    deliveryDate: "2026-11-08",
    status: "DELIVERED"
  },
  {
    id: "csh4",
    organizationId: demoOrganization.id,
    trackingNumber: "NS-CORP-220103",
    reference: "PO-88501",
    department: "Aftersales",
    costCentreCode: "CC-SVC",
    costCentreName: "Service network",
    origin: "Birmingham, GB",
    destination: "Paris, FR",
    method: "Last-mile delivery",
    bookingDate: "2026-11-10",
    deliveryDate: null,
    status: "EXCEPTION"
  },
  {
    id: "csh5",
    organizationId: demoOrganization.id,
    trackingNumber: "NS-CORP-220104",
    reference: "PO-88512",
    department: "Retail",
    costCentreCode: "CC-RTL",
    costCentreName: "Retail fulfilment",
    origin: "Leeds, GB",
    destination: "Edinburgh, GB",
    method: "Road freight",
    bookingDate: "2026-11-12",
    deliveryDate: null,
    status: "COLLECTED"
  },
  {
    id: "csh6",
    organizationId: demoOrganization.id,
    trackingNumber: "NS-CORP-220105",
    reference: "PO-88530",
    department: "Warehouse",
    costCentreCode: "CC-WH",
    costCentreName: "Central warehouse",
    origin: "Tilbury, GB",
    destination: "Antwerp, BE",
    method: "Freight forwarding",
    bookingDate: "2026-11-14",
    deliveryDate: null,
    status: "PROCESSING"
  },
  {
    id: "csh7",
    organizationId: demoOrganization.id,
    trackingNumber: "NS-CORP-220106",
    reference: "PO-88200",
    department: "Procurement",
    costCentreCode: "CC-OPS",
    costCentreName: "Operations",
    origin: "Felixstowe, GB",
    destination: "Valencia, ES",
    method: "Ocean freight",
    bookingDate: "2026-09-20",
    deliveryDate: "2026-10-15",
    status: "DELIVERED"
  },
  {
    id: "csh8",
    organizationId: demoOrganization.id,
    trackingNumber: "NS-CORP-220107",
    reference: "PO-88540",
    department: "Retail",
    costCentreCode: "CC-RTL",
    costCentreName: "Retail fulfilment",
    origin: "London, GB",
    destination: "Brussels, BE",
    method: "Air freight",
    bookingDate: "2026-11-15",
    deliveryDate: null,
    status: "PENDING"
  }
];

export const demoCorporateQuotes: DemoCorporateQuote[] = [
  {
    id: "cq1",
    organizationId: demoOrganization.id,
    reference: "CQ-DEM-901",
    origin: "London, GB",
    destination: "Milan, IT",
    method: "Air freight",
    status: "UNDER_REVIEW",
    createdAt: "2026-11-12",
    notes: "Demonstration quotation — awaiting commercial confirmation."
  },
  {
    id: "cq2",
    organizationId: demoOrganization.id,
    reference: "CQ-DEM-880",
    origin: "Liverpool, GB",
    destination: "New York, US",
    method: "Ocean freight",
    status: "QUOTED",
    createdAt: "2026-11-01",
    notes: "Indicative demonstration response only — not a binding tariff."
  },
  {
    id: "cq3",
    organizationId: demoOrganization.id,
    reference: "CQ-DEM-870",
    origin: "Glasgow, GB",
    destination: "Dublin, IE",
    method: "Road freight",
    status: "EXPIRED",
    createdAt: "2026-09-15",
    notes: "Expired demonstration quote."
  }
];

export const demoNegotiatedRates: DemoNegotiatedRate[] = [
  {
    id: "nr1",
    organizationId: demoOrganization.id,
    contractReference: "CTR-DEMO-2026-01",
    rateCardName: "Demo GB–EU Express Air",
    origin: "United Kingdom",
    destination: "European Union",
    method: "Air freight",
    serviceCategory: "Air freight",
    weightBand: "0–50 kg",
    demoRateLabel: "Demonstration band A (not a live rate)",
    minimumChargeLabel: "Demonstration minimum (not live)",
    surcharges: "Fuel and security surcharges apply per NECO commercial confirmation",
    conditions: "Sample lane conditions for UI only",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    approvalStatus: "Approved"
  },
  {
    id: "nr2",
    organizationId: demoOrganization.id,
    contractReference: "CTR-DEMO-2026-01",
    rateCardName: "Demo GB–EU Ocean LCL",
    origin: "United Kingdom",
    destination: "European Union",
    method: "Ocean freight",
    serviceCategory: "Ocean freight",
    weightBand: "1–10 CBM",
    demoRateLabel: "Demonstration band B (not a live rate)",
    minimumChargeLabel: "Demonstration minimum (not live)",
    surcharges: "Bunker adjustment as confirmed commercially",
    conditions: "LCL sample conditions — not contractual",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    approvalStatus: "Approved"
  },
  {
    id: "nr3",
    organizationId: demoOrganization.id,
    contractReference: "CTR-DEMO-2026-01",
    rateCardName: "Demo Domestic Road",
    origin: "United Kingdom",
    destination: "United Kingdom",
    method: "Road freight",
    serviceCategory: "Road freight",
    weightBand: "0–1,000 kg",
    demoRateLabel: "Demonstration band C (not a live rate)",
    minimumChargeLabel: "Demonstration minimum (not live)",
    surcharges: "Congestion surcharge where applicable",
    conditions: "Sample domestic conditions",
    effectiveFrom: "2026-03-01",
    effectiveTo: null,
    approvalStatus: "Pending Review"
  }
];

export const demoContracts: DemoContract[] = [
  {
    id: "ct1",
    organizationId: demoOrganization.id,
    reference: "CTR-DEMO-2026-01",
    title: "Sample Logistics master logistics agreement (demonstration)",
    effectiveFrom: "2026-01-01",
    expiresAt: "2026-12-31",
    status: "Active",
    rateCardNames: ["Demo GB–EU Express Air", "Demo GB–EU Ocean LCL", "Demo Domestic Road"],
    paymentTerms: "Net 30 (demonstration terms)",
    specialConditions: "Sample conditions for UI preview. Not a signed agreement.",
    documentNote: "Document preview is synthetic. No legally binding signature workflow in this module."
  },
  {
    id: "ct2",
    organizationId: demoOrganization.id,
    reference: "CTR-DEMO-2025-04",
    title: "Prior-year demonstration schedule",
    effectiveFrom: "2025-01-01",
    expiresAt: "2025-12-31",
    status: "Expired",
    rateCardNames: ["Legacy demo card"],
    paymentTerms: "Net 30 (demonstration)",
    specialConditions: "Historical sample only.",
    documentNote: "Expired demonstration schedule — not active commercial terms."
  }
];

export const demoCreditProfile: DemoCreditProfile = {
  organizationId: demoOrganization.id,
  connected: false,
  approvedLimitLabel: "Demonstration example — £250,000",
  outstandingBalanceLabel: "Demonstration example — £68,400",
  availableCreditLabel: "Demonstration example — £181,600",
  utilizationLabel: "Demonstration example — 27%",
  paymentTerms: "Net 30 (demonstration)",
  overdueInvoicesLabel: "Demonstration example — 1 invoice",
  approvalStatus: "Demonstration — Not connected to live finance",
  reviewDate: "2026-Q4 (sample)",
  note: "Credit figures are synthetic UI examples. Live credit limits cannot be changed by organization users."
};

export const demoCorporateInvoices: DemoCorporateInvoice[] = [
  {
    id: "civ1",
    organizationId: demoOrganization.id,
    reference: "INV-CORP-DEMO-1101",
    billingPeriod: "October 2026",
    invoiceDate: "2026-11-01",
    dueDate: "2026-12-01",
    subtotalLabel: "£42,000 (demo)",
    taxLabel: "£8,400 (demo)",
    totalLabel: "£50,400 (demo)",
    currency: "GBP",
    outstandingLabel: "£50,400 (demo)",
    status: "Due"
  },
  {
    id: "civ2",
    organizationId: demoOrganization.id,
    reference: "INV-CORP-DEMO-1001",
    billingPeriod: "September 2026",
    invoiceDate: "2026-10-01",
    dueDate: "2026-10-31",
    subtotalLabel: "£31,000 (demo)",
    taxLabel: "£6,200 (demo)",
    totalLabel: "£37,200 (demo)",
    currency: "GBP",
    outstandingLabel: "£18,000 (demo)",
    status: "Overdue"
  },
  {
    id: "civ3",
    organizationId: demoOrganization.id,
    reference: "INV-CORP-DEMO-0901",
    billingPeriod: "August 2026",
    invoiceDate: "2026-09-01",
    dueDate: "2026-10-01",
    subtotalLabel: "£28,500 (demo)",
    taxLabel: "£5,700 (demo)",
    totalLabel: "£34,200 (demo)",
    currency: "GBP",
    outstandingLabel: "£0 (demo)",
    status: "Paid"
  },
  {
    id: "civ4",
    organizationId: demoOrganization.id,
    reference: "CN-CORP-DEMO-004",
    billingPeriod: "September 2026",
    invoiceDate: "2026-10-12",
    dueDate: "2026-10-12",
    subtotalLabel: "−£1,200 (demo)",
    taxLabel: "−£240 (demo)",
    totalLabel: "−£1,440 (demo)",
    currency: "GBP",
    outstandingLabel: "£0 (demo)",
    status: "Credit note"
  }
];

export const demoCostCentres: DemoCostCentre[] = [
  {
    id: "cc_ops",
    organizationId: demoOrganization.id,
    code: "CC-OPS",
    name: "Operations",
    department: "Procurement",
    manager: "Marcus Chen",
    shipmentCount: 3,
    expenditureLabel: "£86,000 (demo)",
    budgetLabel: "£120,000 (demo)",
    remainingLabel: "£34,000 (demo)",
    status: "Active"
  },
  {
    id: "cc_rtl",
    organizationId: demoOrganization.id,
    code: "CC-RTL",
    name: "Retail fulfilment",
    department: "Retail",
    manager: "Sofia Almeida",
    shipmentCount: 3,
    expenditureLabel: "£54,200 (demo)",
    budgetLabel: "£80,000 (demo)",
    remainingLabel: "£25,800 (demo)",
    status: "Active"
  },
  {
    id: "cc_svc",
    organizationId: demoOrganization.id,
    code: "CC-SVC",
    name: "Service network",
    department: "Aftersales",
    manager: "Tom Okonkwo",
    shipmentCount: 1,
    expenditureLabel: "£9,800 (demo)",
    budgetLabel: "£25,000 (demo)",
    remainingLabel: "£15,200 (demo)",
    status: "Active"
  },
  {
    id: "cc_wh",
    organizationId: demoOrganization.id,
    code: "CC-WH",
    name: "Central warehouse",
    department: "Warehouse",
    manager: "Elena Petrova",
    shipmentCount: 1,
    expenditureLabel: "£12,400 (demo)",
    budgetLabel: "Not configured",
    remainingLabel: "Not configured",
    status: "Active"
  }
];

export const demoEmployees: DemoEmployee[] = [
  {
    id: "emp1",
    organizationId: demoOrganization.id,
    name: "Alex Morgan",
    reference: "EMP-DEMO-01",
    department: "Leadership",
    email: "alex.morgan@sample-logistics.example",
    phone: "+44 20 7946 0001",
    accountStatus: "Active",
    role: "ORG_ADMIN"
  },
  {
    id: "emp2",
    organizationId: demoOrganization.id,
    name: "Marcus Chen",
    reference: "EMP-DEMO-02",
    department: "Procurement",
    email: "ops@sample-logistics.example",
    phone: "+44 20 7946 0003",
    accountStatus: "Active",
    role: "SHIPPER"
  },
  {
    id: "emp3",
    organizationId: demoOrganization.id,
    name: "Priya Shah",
    reference: "EMP-DEMO-03",
    department: "Finance",
    email: "billing@sample-logistics.example",
    phone: "+44 20 7946 0002",
    accountStatus: "Active",
    role: "BILLING"
  },
  {
    id: "emp4",
    organizationId: demoOrganization.id,
    name: "Sofia Almeida",
    reference: "EMP-DEMO-04",
    department: "Retail",
    email: "sofia.almeida@sample-logistics.example",
    phone: "+44 20 7946 0004",
    accountStatus: "Invited",
    role: "VIEWER"
  }
];

/** Analytics series — all demonstration. */
export const demoMonthlyShipments = [
  { month: "Jun", count: 12 },
  { month: "Jul", count: 15 },
  { month: "Aug", count: 14 },
  { month: "Sep", count: 18 },
  { month: "Oct", count: 16 },
  { month: "Nov", count: 11 }
];

export const demoMethodDistribution = [
  { method: "Air", value: 28 },
  { method: "Ocean", value: 22 },
  { method: "Road", value: 35 },
  { method: "Last-mile", value: 10 },
  { method: "Forwarding", value: 5 }
];

export const demoDestinationSpend = [
  { destination: "Netherlands", spend: 42 },
  { destination: "Germany", spend: 31 },
  { destination: "Ireland", spend: 18 },
  { destination: "France", spend: 14 },
  { destination: "Belgium", spend: 12 }
];

export const demoInvoiceAging = [
  { bucket: "Current", amount: 50 },
  { bucket: "1–30 days", amount: 18 },
  { bucket: "31–60 days", amount: 8 },
  { bucket: "60+ days", amount: 0 }
];

export function scopeByOrganization<T extends { organizationId: string }>(
  rows: T[],
  organizationId: string = demoOrganization.id
): T[] {
  return rows.filter((r) => r.organizationId === organizationId);
}

export function getCorporateShipment(idOrTracking: string): DemoCorporateShipment | null {
  const key = idOrTracking.toUpperCase();
  return (
    demoCorporateShipments.find(
      (s) =>
        s.organizationId === demoOrganization.id &&
        (s.id.toUpperCase() === key || s.trackingNumber.toUpperCase() === key)
    ) ?? null
  );
}

export function getCorporateOverviewStats() {
  const rows = scopeByOrganization(demoCorporateShipments);
  const count = (status: ShipmentStatusCode | ShipmentStatusCode[]) => {
    const set = Array.isArray(status) ? status : [status];
    return rows.filter((r) => set.includes(r.status)).length;
  };
  const centres = scopeByOrganization(demoCostCentres);
  return {
    total: rows.length,
    inTransit: count(["IN_TRANSIT", "CUSTOMS_PROCESSING", "OUT_FOR_DELIVERY", "PROCESSING", "COLLECTED"]),
    delivered: count("DELIVERED"),
    pendingQuotes: scopeByOrganization(demoCorporateQuotes).filter((q) =>
      ["SUBMITTED", "UNDER_REVIEW", "QUOTED"].includes(q.status)
    ).length,
    outstandingInvoices: scopeByOrganization(demoCorporateInvoices).filter((i) =>
      ["Due", "Overdue"].includes(i.status)
    ).length,
    pendingCollection: count(["PENDING", "BOOKED"]),
    processing: count("PROCESSING"),
    inTransitExact: count("IN_TRANSIT"),
    customs: count("CUSTOMS_PROCESSING"),
    outForDelivery: count("OUT_FOR_DELIVERY"),
    exceptions: count("EXCEPTION"),
    activeCostCentres: centres.filter((c) => c.status === "Active").length,
    approvedRateCards: scopeByOrganization(demoNegotiatedRates).filter((r) => r.approvalStatus === "Approved")
      .length,
    pendingRateReviews: scopeByOrganization(demoNegotiatedRates).filter((r) => r.approvalStatus === "Pending Review")
      .length
  };
}

/** UI-50 — synthetic rate revision / approval timeline. Not live commercial workflow. */
export type DemoRateRevision = {
  id: string;
  organizationId: string;
  rateCardId: string;
  rateCardName: string;
  revisionLabel: string;
  status: "Draft" | "Pending Review" | "Approved" | "Rejected" | "Expired";
  effectiveFrom: string;
  effectiveTo: string | null;
  requestedBy: string;
  reviewedBy: string | null;
  summary: string;
  timeline: Array<{
    id: string;
    title: string;
    at: string;
    detail: string;
  }>;
};

export const demoRateRevisions: DemoRateRevision[] = [
  {
    id: "rr1",
    organizationId: demoOrganization.id,
    rateCardId: "nr3",
    rateCardName: "Demo Domestic Road",
    revisionLabel: "REV-DEMO-2026-11",
    status: "Pending Review",
    effectiveFrom: "2026-12-01",
    effectiveTo: null,
    requestedBy: "Marcus Chen (SHIPPER — demo)",
    reviewedBy: null,
    summary: "Demonstration request to refresh domestic road weight bands. Not a live tariff change.",
    timeline: [
      {
        id: "rr1a",
        title: "Draft created",
        at: "2026-11-10T09:00:00.000Z",
        detail: "Sample draft prepared in corporate rate workspace."
      },
      {
        id: "rr1b",
        title: "Submitted for review",
        at: "2026-11-12T14:30:00.000Z",
        detail: "Awaiting NECO commercial confirmation — approval actions are disabled in this UI."
      }
    ]
  },
  {
    id: "rr2",
    organizationId: demoOrganization.id,
    rateCardId: "nr1",
    rateCardName: "Demo GB–EU Express Air",
    revisionLabel: "REV-DEMO-2026-01",
    status: "Approved",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    requestedBy: "Alex Morgan (ORG_ADMIN — demo)",
    reviewedBy: "NECO Commercial (demo contact)",
    summary: "Historical demonstration approval for the sample air rate card.",
    timeline: [
      {
        id: "rr2a",
        title: "Draft created",
        at: "2025-12-01T10:00:00.000Z",
        detail: "Sample revision drafted for UI history."
      },
      {
        id: "rr2b",
        title: "Pending review",
        at: "2025-12-08T11:00:00.000Z",
        detail: "Demonstration review state."
      },
      {
        id: "rr2c",
        title: "Approved",
        at: "2025-12-15T16:00:00.000Z",
        detail: "Marked approved for demonstration history only — not a live commercial decision."
      }
    ]
  },
  {
    id: "rr3",
    organizationId: demoOrganization.id,
    rateCardId: "nr2",
    rateCardName: "Demo GB–EU Ocean LCL",
    revisionLabel: "REV-DEMO-2025-06",
    status: "Expired",
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
    requestedBy: "Priya Shah (BILLING — demo)",
    reviewedBy: "NECO Commercial (demo contact)",
    summary: "Expired demonstration schedule retained for history layout only.",
    timeline: [
      {
        id: "rr3a",
        title: "Approved (historical)",
        at: "2024-12-20T12:00:00.000Z",
        detail: "Sample historical approval."
      },
      {
        id: "rr3b",
        title: "Expired",
        at: "2025-12-31T23:59:00.000Z",
        detail: "Validity window closed — demonstration record."
      }
    ]
  }
];

/**
 * Presentation-only nav affinity for corporate UI roles.
 * Not authorization — server org membership and APIs remain authoritative.
 */
export const CORPORATE_ROLE_NAV: Record<
  CorporateUiRole,
  { primary: string[]; note: string }
> = {
  ORG_ADMIN: {
    primary: ["overview", "shipments", "rates", "contracts", "employees", "organization", "settings", "reports"],
    note: "Organization Administrator — full corporate overview presentation."
  },
  SHIPPER: {
    primary: ["overview", "shipments", "create", "bulk", "quotations", "rates", "cost-centres"],
    note: "Shipment Manager — operations and quotation focus."
  },
  BILLING: {
    primary: ["overview", "invoices", "statements", "credit", "contracts", "rates", "reports"],
    note: "Billing Manager — commercial and financial presentation."
  },
  VIEWER: {
    primary: ["overview", "shipments", "quotations", "invoices", "reports"],
    note: "Viewer — read-only presentation. Mutations remain demo-disabled."
  }
};

/** Fixed demo session persona for UI presentation (not signed-in auth). */
export const demoCorporateSession = {
  organizationId: demoOrganization.id,
  employeeId: "emp1",
  role: "ORG_ADMIN" as CorporateUiRole,
  displayName: "Alex Morgan"
};

export function getDemoCorporateSession() {
  return demoCorporateSession;
}

export function revisionTone(status: DemoRateRevision["status"]): "default" | "success" | "warning" | "danger" | "info" {
  if (status === "Approved") return "success";
  if (status === "Pending Review" || status === "Draft") return "warning";
  if (status === "Rejected") return "danger";
  if (status === "Expired") return "default";
  return "info";
}
