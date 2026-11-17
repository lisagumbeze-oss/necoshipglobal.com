/** Module 5 — Super Administrator demonstration fixtures only. */
export const ADMIN_DEMO_NOTICE =
  "Demonstration data — sample platform administration records for UI development only. Not live NECO customers, finance or operational metrics.";

export type DemoAdminCustomer = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  verification: "Verified" | "Pending" | "Unverified";
  status: "Active" | "Suspended" | "Under review";
  shipments: number;
  category: "Individual" | "Business";
};

export type DemoAdminOrganization = {
  id: string;
  reference: string;
  name: string;
  country: string;
  status: "Active" | "Suspended" | "Under review";
  contractStatus: "Active" | "Pending Review" | "Expired" | "None";
  rateStatus: "Configured" | "Pending" | "Not configured";
  creditStatus: "Active" | "Not connected" | "Suspended";
  outstandingLabel: string;
  members: number;
};

export type DemoAdminStaff = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  title: string;
  roleLabel: string;
  employmentStatus: "Active" | "Leave" | "Terminated";
  accountStatus: "Active" | "Invited" | "Suspended";
};

export type DemoPermissionAction = "view" | "create" | "edit" | "approve" | "delete" | "manage";

export type DemoPermissionCategory =
  | "Customer Management"
  | "Corporate Management"
  | "Shipment Management"
  | "Fleet Management"
  | "Warehouse Management"
  | "Dispatch Management"
  | "Delivery Management"
  | "Financial Management"
  | "Pricing Management"
  | "Contract Management"
  | "Claims Management"
  | "Support Management"
  | "Reporting"
  | "System Configuration"
  | "Audit Logs";

export const ADMIN_PERMISSION_CATEGORIES: DemoPermissionCategory[] = [
  "Customer Management",
  "Corporate Management",
  "Shipment Management",
  "Fleet Management",
  "Warehouse Management",
  "Dispatch Management",
  "Delivery Management",
  "Financial Management",
  "Pricing Management",
  "Contract Management",
  "Claims Management",
  "Support Management",
  "Reporting",
  "System Configuration",
  "Audit Logs"
];

export const ADMIN_ROLE_DEFS = [
  { id: "SUPER_ADMIN", label: "Super Administrator", prismaHint: "ADMIN" },
  { id: "SYSTEM_ADMIN", label: "System Administrator", prismaHint: "ADMIN" },
  { id: "OPS_MANAGER", label: "Operations Manager", prismaHint: "OPS_MANAGER" },
  { id: "WAREHOUSE_MANAGER", label: "Warehouse Manager", prismaHint: "StaffProfile" },
  { id: "WAREHOUSE_STAFF", label: "Warehouse Staff", prismaHint: "StaffProfile" },
  { id: "FLEET_MANAGER", label: "Fleet Manager", prismaHint: "OPS_MANAGER" },
  { id: "DISPATCHER", label: "Dispatcher", prismaHint: "StaffProfile" },
  { id: "DELIVERY_AGENT", label: "Delivery Agent", prismaHint: "DRIVER" },
  { id: "FINANCE", label: "Finance Officer", prismaHint: "FINANCE" },
  { id: "SUPPORT", label: "Customer Support Agent", prismaHint: "SUPPORT_AGENT" },
  { id: "CUSTOMS", label: "Customs Officer", prismaHint: "CUSTOMS_OFFICER" },
  { id: "READ_ONLY", label: "Read Only", prismaHint: "READ_ONLY" }
] as const;

/** Matrix cells are illustrative UI only — not live authorization. */
export function demoPermissionGranted(roleId: string, category: DemoPermissionCategory, action: DemoPermissionAction): boolean {
  if (roleId === "SUPER_ADMIN" || roleId === "SYSTEM_ADMIN") return true;
  if (roleId === "READ_ONLY") return action === "view";
  if (roleId === "FINANCE") {
    return ["Financial Management", "Pricing Management", "Contract Management", "Reporting", "Audit Logs"].includes(category);
  }
  if (roleId === "SUPPORT" || roleId === "CUSTOMS") {
    return ["Claims Management", "Support Management", "Shipment Management", "Customer Management", "Reporting"].includes(
      category
    ) && ["view", "edit", "create"].includes(action);
  }
  if (roleId === "OPS_MANAGER" || roleId === "FLEET_MANAGER" || roleId === "DISPATCHER") {
    return (
      [
        "Shipment Management",
        "Fleet Management",
        "Warehouse Management",
        "Dispatch Management",
        "Delivery Management",
        "Reporting"
      ].includes(category) && action !== "delete"
    );
  }
  return action === "view";
}

export type DemoAdminShipment = {
  id: string;
  trackingNumber: string;
  reference: string;
  customer: string;
  organization: string | null;
  origin: string;
  destination: string;
  method: string;
  bookedAt: string;
  status: string;
  deliveryStatus: string;
};

export type DemoAdminService = {
  id: string;
  reference: string;
  name: string;
  description: string;
  availability: "Available" | "Limited" | "Unavailable";
  routes: string;
  customerCategory: string;
  conditions: string;
};

export type DemoAdminRateCard = {
  id: string;
  reference: string;
  organization: string;
  origin: string;
  destination: string;
  service: string;
  weightBand: string;
  minimumLabel: string;
  surcharges: string;
  currency: string;
  validFrom: string;
  validTo: string;
  approvalStatus: "Draft" | "Pending Review" | "Approved" | "Expired";
};

export type DemoRateApproval = {
  id: string;
  rateCardReference: string;
  proposedLabel: string;
  currentLabel: string;
  reason: string;
  department: string;
  reviewStatus: "Pending Review" | "Pending Approval" | "Approved" | "Rejected";
  authority: string;
};

export type DemoAdminContract = {
  id: string;
  reference: string;
  organization: string;
  agreementType: string;
  effectiveFrom: string;
  expiresAt: string;
  valueLabel: string;
  rates: string;
  paymentTerms: string;
  status: "Draft" | "Pending Review" | "Pending Approval" | "Active" | "Expiring" | "Expired" | "Suspended";
  documentNote: string;
};

export type DemoAdminInvoice = {
  id: string;
  reference: string;
  billingParty: string;
  customerRef: string;
  period: string;
  dueDate: string;
  subtotalLabel: string;
  taxLabel: string;
  totalLabel: string;
  outstandingLabel: string;
  status: "Draft" | "Due" | "Paid" | "Overdue" | "Void";
};

export type DemoAdminPayment = {
  id: string;
  reference: string;
  invoiceRef: string;
  shipmentRef: string | null;
  party: string;
  method: string;
  amountLabel: string;
  currency: string;
  paidAt: string;
  status: "Pending" | "Completed" | "Failed" | "Reversed";
};

export type DemoCreditAccount = {
  id: string;
  organization: string;
  limitLabel: string;
  outstandingLabel: string;
  availableLabel: string;
  terms: string;
  reviewStatus: string;
  approvalHistory: string;
};

export type DemoRefundRequest = {
  id: string;
  reference: string;
  party: string;
  amountLabel: string;
  reason: string;
  status: "Requested" | "Under review" | "Approved" | "Rejected";
};

export type DemoClaimCase = {
  id: string;
  reference: string;
  customer: string;
  organization: string | null;
  shipmentRef: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  assignee: string;
  submittedAt: string;
  status: "Open" | "Investigating" | "Resolved" | "Closed";
  summary: string;
};

export type DemoSupportTicket = {
  id: string;
  reference: string;
  customer: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  assignee: string;
  submittedAt: string;
  status: "Open" | "In progress" | "Escalated" | "Resolved";
  subject: string;
};

export type DemoNetworkLocation = {
  id: string;
  reference: string;
  name: string;
  type: "Warehouse" | "Office" | "Collection point" | "Distribution facility" | "Operational hub";
  status: "Active" | "Planned" | "Inactive";
  region: string;
  note: string;
};

export type DemoNotificationTemplate = {
  id: string;
  channel: "Email" | "SMS";
  category: string;
  name: string;
  subjectPreview: string;
  status: "Active" | "Draft";
};

export type DemoCmsEntry = {
  id: string;
  section: string;
  title: string;
  status: "Published" | "Draft";
  updatedAt: string;
};

export type DemoAuditEntry = {
  id: string;
  reference: string;
  user: string;
  category: string;
  resource: string;
  at: string;
  summary: string;
  outcome: "Success" | "Denied" | "Error";
};

export const demoAdminCustomers: DemoAdminCustomer[] = [
  {
    id: "acu1",
    reference: "CUS-DEMO-1001",
    name: "Amelia Wright",
    email: "amelia.demo@example.com",
    phone: "+44 7700 900201",
    registeredAt: "2026-03-12",
    verification: "Verified",
    status: "Active",
    shipments: 14,
    category: "Individual"
  },
  {
    id: "acu2",
    reference: "CUS-DEMO-1002",
    name: "Ben Carter",
    email: "ben.demo@example.com",
    phone: "+44 7700 900202",
    registeredAt: "2026-06-01",
    verification: "Pending",
    status: "Under review",
    shipments: 2,
    category: "Individual"
  },
  {
    id: "acu3",
    reference: "CUS-DEMO-1003",
    name: "Chloe Nguyen",
    email: "chloe.demo@example.com",
    phone: "+44 7700 900203",
    registeredAt: "2025-11-20",
    verification: "Verified",
    status: "Suspended",
    shipments: 7,
    category: "Business"
  }
];

export const demoAdminOrganizations: DemoAdminOrganization[] = [
  {
    id: "aorg1",
    reference: "ORG-DEMO-7781",
    name: "Sample Logistics Holdings Ltd",
    country: "United Kingdom",
    status: "Active",
    contractStatus: "Active",
    rateStatus: "Configured",
    creditStatus: "Not connected",
    outstandingLabel: "£68,400 (demo)",
    members: 4
  },
  {
    id: "aorg2",
    reference: "ORG-DEMO-5540",
    name: "Northbridge Trade Co (demo)",
    country: "Ireland",
    status: "Active",
    contractStatus: "Pending Review",
    rateStatus: "Pending",
    creditStatus: "Not connected",
    outstandingLabel: "£12,200 (demo)",
    members: 2
  }
];

export const demoAdminStaff: DemoAdminStaff[] = [
  {
    id: "ast1",
    reference: "STF-DEMO-01",
    name: "Jordan Lee",
    email: "jordan.demo@necoship.example",
    phone: "+44 20 7946 0101",
    department: "Leadership",
    title: "Platform Super Administrator",
    roleLabel: "Super Administrator",
    employmentStatus: "Active",
    accountStatus: "Active"
  },
  {
    id: "ast2",
    reference: "STF-DEMO-02",
    name: "Nadia Brooks",
    email: "nadia.demo@necoship.example",
    phone: "+44 20 7946 0102",
    department: "Operations",
    title: "Operations Manager",
    roleLabel: "Operations Manager",
    employmentStatus: "Active",
    accountStatus: "Active"
  },
  {
    id: "ast3",
    reference: "STF-DEMO-03",
    name: "Priya Shah",
    email: "priya.demo@necoship.example",
    phone: "+44 20 7946 0103",
    department: "Finance",
    title: "Finance Officer",
    roleLabel: "Finance Officer",
    employmentStatus: "Active",
    accountStatus: "Active"
  },
  {
    id: "ast4",
    reference: "STF-DEMO-04",
    name: "Tom Okonkwo",
    email: "tom.demo@necoship.example",
    phone: "+44 20 7946 0104",
    department: "Support",
    title: "Customer Support Agent",
    roleLabel: "Customer Support Agent",
    employmentStatus: "Active",
    accountStatus: "Invited"
  }
];

export const demoAdminShipments: DemoAdminShipment[] = [
  {
    id: "ash1",
    trackingNumber: "NS-ADM-500101",
    reference: "ADM-REF-101",
    customer: "Amelia Wright",
    organization: null,
    origin: "London, GB",
    destination: "Paris, FR",
    method: "Air freight",
    bookedAt: "2026-11-10",
    status: "IN_TRANSIT",
    deliveryStatus: "In transit"
  },
  {
    id: "ash2",
    trackingNumber: "NS-ADM-500102",
    reference: "ADM-REF-102",
    customer: "Sample Logistics",
    organization: "Sample Logistics Holdings Ltd",
    origin: "Manchester, GB",
    destination: "Dublin, IE",
    method: "Road freight",
    bookedAt: "2026-11-14",
    status: "OUT_FOR_DELIVERY",
    deliveryStatus: "Out for delivery"
  },
  {
    id: "ash3",
    trackingNumber: "NS-ADM-500103",
    reference: "ADM-REF-103",
    customer: "Chloe Nguyen",
    organization: null,
    origin: "Birmingham, GB",
    destination: "Edinburgh, GB",
    method: "Road freight",
    bookedAt: "2026-11-01",
    status: "DELIVERED",
    deliveryStatus: "Delivered"
  },
  {
    id: "ash4",
    trackingNumber: "NS-ADM-500104",
    reference: "ADM-REF-104",
    customer: "Sample Logistics",
    organization: "Sample Logistics Holdings Ltd",
    origin: "Felixstowe, GB",
    destination: "Hamburg, DE",
    method: "Ocean freight (partner)",
    bookedAt: "2026-10-20",
    status: "EXCEPTION",
    deliveryStatus: "Exception"
  }
];

export const demoAdminServices: DemoAdminService[] = [
  {
    id: "svc1",
    reference: "SVC-AIR",
    name: "Air Freight",
    description: "Time-sensitive international air moves",
    availability: "Available",
    routes: "GB ↔ EU / selected international (demo)",
    customerCategory: "Individual & Corporate",
    conditions: "Subject to commercial confirmation"
  },
  {
    id: "svc2",
    reference: "SVC-OCEAN",
    name: "Ocean Freight",
    description: "FCL and LCL ocean programmes",
    availability: "Available",
    routes: "Partner linehaul corridors (demo)",
    customerCategory: "Corporate preferred",
    conditions: "Partner capacity dependent"
  },
  {
    id: "svc3",
    reference: "SVC-ROAD",
    name: "Road Transportation",
    description: "Domestic and regional road haulage",
    availability: "Available",
    routes: "United Kingdom & near EU (demo)",
    customerCategory: "Individual & Corporate",
    conditions: "Fleet and partner mix"
  },
  {
    id: "svc4",
    reference: "SVC-LM",
    name: "Last-Mile Delivery",
    description: "Final delivery and proof of delivery",
    availability: "Available",
    routes: "Selected metro zones (demo)",
    customerCategory: "All",
    conditions: "Attempt windows apply"
  },
  {
    id: "svc5",
    reference: "SVC-FF",
    name: "Freight Forwarding",
    description: "End-to-end forwarding coordination",
    availability: "Limited",
    routes: "By quotation (demo)",
    customerCategory: "Corporate",
    conditions: "Quotation required"
  },
  {
    id: "svc6",
    reference: "SVC-WH",
    name: "Warehousing",
    description: "Storage and fulfilment handling",
    availability: "Available",
    routes: "NECO hubs (demo)",
    customerCategory: "Corporate",
    conditions: "Facility capacity limits"
  },
  {
    id: "svc7",
    reference: "SVC-CUS",
    name: "Customs Coordination",
    description: "Documentation and clearance support",
    availability: "Available",
    routes: "As required by lane",
    customerCategory: "All international",
    conditions: "Customer docs required"
  },
  {
    id: "svc8",
    reference: "SVC-CORP",
    name: "Corporate Logistics",
    description: "Negotiated programmes for businesses",
    availability: "Available",
    routes: "Contract lanes (demo)",
    customerCategory: "Corporate",
    conditions: "Active contract required"
  }
];

export const demoAdminRateCards: DemoAdminRateCard[] = [
  {
    id: "arc1",
    reference: "RC-DEMO-AIR-01",
    organization: "Sample Logistics Holdings Ltd",
    origin: "United Kingdom",
    destination: "European Union",
    service: "Air Freight",
    weightBand: "0–50 kg",
    minimumLabel: "Demonstration minimum (not live)",
    surcharges: "Fuel / security (demo narrative)",
    currency: "GBP",
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    approvalStatus: "Approved"
  },
  {
    id: "arc2",
    reference: "RC-DEMO-OCN-01",
    organization: "Sample Logistics Holdings Ltd",
    origin: "United Kingdom",
    destination: "European Union",
    service: "Ocean Freight",
    weightBand: "1–10 CBM",
    minimumLabel: "Demonstration minimum (not live)",
    surcharges: "BAF narrative (demo)",
    currency: "GBP",
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    approvalStatus: "Pending Review"
  }
];

export const demoRateApprovals: DemoRateApproval[] = [
  {
    id: "rap1",
    rateCardReference: "RC-DEMO-OCN-01",
    proposedLabel: "Demonstration proposed band (not a live tariff)",
    currentLabel: "Demonstration current band (not a live tariff)",
    reason: "Annual commercial review sample",
    department: "Commercial",
    reviewStatus: "Pending Approval",
    authority: "Finance / Super Administrator (future backend)"
  }
];

export const demoAdminContracts: DemoAdminContract[] = [
  {
    id: "act1",
    reference: "CTR-ADMIN-2026-01",
    organization: "Sample Logistics Holdings Ltd",
    agreementType: "Master logistics agreement (demo)",
    effectiveFrom: "2026-01-01",
    expiresAt: "2026-12-31",
    valueLabel: "Not verified — demonstration placeholder",
    rates: "RC-DEMO-AIR-01, RC-DEMO-OCN-01",
    paymentTerms: "Net 30 (demo)",
    status: "Active",
    documentNote: "Synthetic document preview — not a signed agreement."
  }
];

export const demoAdminInvoices: DemoAdminInvoice[] = [
  {
    id: "ainv1",
    reference: "INV-ADM-1101",
    billingParty: "Sample Logistics Holdings Ltd",
    customerRef: "ORG-DEMO-7781",
    period: "October 2026",
    dueDate: "2026-12-01",
    subtotalLabel: "£42,000 (demo)",
    taxLabel: "£8,400 (demo)",
    totalLabel: "£50,400 (demo)",
    outstandingLabel: "£50,400 (demo)",
    status: "Due"
  },
  {
    id: "ainv2",
    reference: "INV-ADM-1001",
    billingParty: "Amelia Wright",
    customerRef: "CUS-DEMO-1001",
    period: "November 2026",
    dueDate: "2026-11-20",
    subtotalLabel: "£180 (demo)",
    taxLabel: "£36 (demo)",
    totalLabel: "£216 (demo)",
    outstandingLabel: "£0 (demo)",
    status: "Paid"
  },
  {
    id: "ainv3",
    reference: "INV-ADM-0901",
    billingParty: "Northbridge Trade Co (demo)",
    customerRef: "ORG-DEMO-5540",
    period: "September 2026",
    dueDate: "2026-10-15",
    subtotalLabel: "£9,500 (demo)",
    taxLabel: "£1,900 (demo)",
    totalLabel: "£11,400 (demo)",
    outstandingLabel: "£11,400 (demo)",
    status: "Overdue"
  }
];

export const demoAdminPayments: DemoAdminPayment[] = [
  {
    id: "apay1",
    reference: "PAY-ADM-9001",
    invoiceRef: "INV-ADM-1001",
    shipmentRef: "NS-ADM-500103",
    party: "Amelia Wright",
    method: "Card (demo)",
    amountLabel: "£216 (demo)",
    currency: "GBP",
    paidAt: "2026-11-12",
    status: "Completed"
  },
  {
    id: "apay2",
    reference: "PAY-ADM-9002",
    invoiceRef: "INV-ADM-1101",
    shipmentRef: null,
    party: "Sample Logistics Holdings Ltd",
    method: "Bank transfer (demo)",
    amountLabel: "£0 pending (demo)",
    currency: "GBP",
    paidAt: "—",
    status: "Pending"
  }
];

export const demoCreditAccounts: DemoCreditAccount[] = [
  {
    id: "acr1",
    organization: "Sample Logistics Holdings Ltd",
    limitLabel: "Demonstration example — £250,000",
    outstandingLabel: "Demonstration example — £68,400",
    availableLabel: "Demonstration example — £181,600",
    terms: "Net 30 (demo)",
    reviewStatus: "Not connected to live finance",
    approvalHistory: "No live approval history in this module"
  }
];

export const demoRefundRequests: DemoRefundRequest[] = [
  {
    id: "arf1",
    reference: "RFD-DEMO-01",
    party: "Chloe Nguyen",
    amountLabel: "£45 (demo)",
    reason: "Duplicate charge review (demo)",
    status: "Under review"
  }
];

export const demoClaimCases: DemoClaimCase[] = [
  {
    id: "acl1",
    reference: "CLM-ADM-01",
    customer: "Amelia Wright",
    organization: null,
    shipmentRef: "NS-ADM-500101",
    category: "Delayed shipment",
    priority: "Medium",
    assignee: "Tom Okonkwo",
    submittedAt: "2026-11-15",
    status: "Investigating",
    summary: "Demonstration delay enquiry — not a live claim conversation."
  },
  {
    id: "acl2",
    reference: "CLM-ADM-02",
    customer: "Sample Logistics",
    organization: "Sample Logistics Holdings Ltd",
    shipmentRef: "NS-ADM-500104",
    category: "Damaged package",
    priority: "High",
    assignee: "Nadia Brooks",
    submittedAt: "2026-11-16",
    status: "Open",
    summary: "Demonstration damage claim placeholder."
  }
];

export const demoSupportTickets: DemoSupportTicket[] = [
  {
    id: "atk1",
    reference: "TKT-ADM-01",
    customer: "Ben Carter",
    category: "Account verification",
    priority: "Medium",
    assignee: "Tom Okonkwo",
    submittedAt: "2026-11-14",
    status: "Escalated",
    subject: "Demonstration verification follow-up"
  },
  {
    id: "atk2",
    reference: "TKT-ADM-02",
    customer: "Sample Logistics",
    category: "Billing",
    priority: "Low",
    assignee: "Priya Shah",
    submittedAt: "2026-11-13",
    status: "In progress",
    subject: "Demonstration invoice query"
  }
];

export const demoNetworkLocations: DemoNetworkLocation[] = [
  {
    id: "aloc1",
    reference: "LOC-WH-LON",
    name: "London Gateway Hub (demo)",
    type: "Warehouse",
    status: "Active",
    region: "South East GB",
    note: "Demonstration facility label — confirm before public listing."
  },
  {
    id: "aloc2",
    reference: "LOC-OFF-LON",
    name: "NECO HQ (demo label)",
    type: "Office",
    status: "Active",
    region: "London",
    note: "Use approved public address content only on the marketing site."
  },
  {
    id: "aloc3",
    reference: "LOC-CP-MAN",
    name: "Manchester collection point (demo)",
    type: "Collection point",
    status: "Planned",
    region: "North West GB",
    note: "Planned — not an operating public facility yet."
  }
];

export const demoNotificationTemplates: DemoNotificationTemplate[] = [
  {
    id: "ant1",
    channel: "Email",
    category: "Tracking",
    name: "Shipment in transit",
    subjectPreview: "Your NECO shipment is moving (demo)",
    status: "Active"
  },
  {
    id: "ant2",
    channel: "SMS",
    category: "Delivery",
    name: "Out for delivery",
    subjectPreview: "NECO: out for delivery today (demo)",
    status: "Draft"
  },
  {
    id: "ant3",
    channel: "Email",
    category: "Billing",
    name: "Invoice available",
    subjectPreview: "Your invoice is ready (demo)",
    status: "Active"
  }
];

export const demoCmsEntries: DemoCmsEntry[] = [
  {
    id: "acm1",
    section: "Homepage",
    title: "Hero headline",
    status: "Published",
    updatedAt: "2026-11-01"
  },
  {
    id: "acm2",
    section: "Services",
    title: "Air freight description",
    status: "Draft",
    updatedAt: "2026-11-10"
  },
  {
    id: "acm3",
    section: "FAQ",
    title: "Tracking help",
    status: "Published",
    updatedAt: "2026-10-22"
  }
];

export const demoAuditEntries: DemoAuditEntry[] = [
  {
    id: "aud1",
    reference: "AUD-DEMO-1001",
    user: "Jordan Lee",
    category: "Auth",
    resource: "/admin/dashboard",
    at: "2026-11-17T09:00:00Z",
    summary: "Administrator session opened (demo)",
    outcome: "Success"
  },
  {
    id: "aud2",
    reference: "AUD-DEMO-1002",
    user: "Priya Shah",
    category: "Finance",
    resource: "INV-ADM-1101",
    at: "2026-11-17T10:15:00Z",
    summary: "Invoice detail viewed (demo)",
    outcome: "Success"
  },
  {
    id: "aud3",
    reference: "AUD-DEMO-1003",
    user: "guest",
    category: "Auth",
    resource: "/admin/staff",
    at: "2026-11-17T11:00:00Z",
    summary: "Unauthorized access attempt blocked (demo)",
    outcome: "Denied"
  }
];

export const demoAdminMonthlyShipments = [
  { month: "Jun", count: 120 },
  { month: "Jul", count: 132 },
  { month: "Aug", count: 128 },
  { month: "Sep", count: 141 },
  { month: "Oct", count: 150 },
  { month: "Nov", count: 98 }
];

export const demoAdminRevenueIndex = [
  { month: "Jun", index: 40 },
  { month: "Jul", index: 44 },
  { month: "Aug", index: 42 },
  { month: "Sep", index: 48 },
  { month: "Oct", index: 52 },
  { month: "Nov", index: 37 }
];

export function getAdminOverviewStats() {
  return {
    customers: demoAdminCustomers.length,
    organizations: demoAdminOrganizations.length,
    staffActive: demoAdminStaff.filter((s) => s.accountStatus === "Active").length,
    shipments: demoAdminShipments.length,
    activeShipments: demoAdminShipments.filter((s) => !["DELIVERED", "CANCELLED"].includes(s.status)).length,
    delivered: demoAdminShipments.filter((s) => s.status === "DELIVERED").length,
    exceptions: demoAdminShipments.filter((s) => s.status === "EXCEPTION").length,
    invoicedLabel: "£62,016 (demo index)",
    outstandingLabel: "£61,800 (demo index)",
    collectionsLabel: "£216 (demo index)",
    creditUtilizationLabel: "Not connected / demo illustration 27%",
    openClaims: demoClaimCases.filter((c) => ["Open", "Investigating"].includes(c.status)).length,
    pendingApprovals: demoRateApprovals.filter((r) => r.reviewStatus.includes("Pending")).length
  };
}

export function getAdminCustomer(id: string) {
  return demoAdminCustomers.find((c) => c.id === id || c.reference === id) ?? null;
}

export function getAdminOrganization(id: string) {
  return demoAdminOrganizations.find((o) => o.id === id || o.reference === id) ?? null;
}

export function getAdminStaff(id: string) {
  return demoAdminStaff.find((s) => s.id === id || s.reference === id) ?? null;
}

export function getAdminShipment(id: string) {
  const key = id.toUpperCase();
  return (
    demoAdminShipments.find(
      (s) => s.id.toUpperCase() === key || s.trackingNumber.toUpperCase() === key || s.reference.toUpperCase() === key
    ) ?? null
  );
}

export function getAdminContract(id: string) {
  return demoAdminContracts.find((c) => c.id === id || c.reference === id) ?? null;
}
