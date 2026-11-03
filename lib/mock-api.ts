type ShipmentStatus =
  | "In Transit"
  | "Delivered"
  | "Exception"
  | "Customs Hold"
  | "Out for Delivery";

export type LiveOpsRecord = {
  id: string;
  serviceType: string;
  carrier: string;
  region: string;
  route: string;
  status: ShipmentStatus;
};

export type InvoiceRecord = {
  id: string;
  customer: string;
  amount: number;
  status: "Paid" | "Due" | "Overdue";
};

export type ShipmentRecord = {
  id: string;
  origin: string;
  destination: string;
  service: string;
  status: ShipmentStatus;
  eta: string;
  weightKg: number;
  costUsd: number;
  updatedAt: string;
  recipient: string;
};

export type NotificationCategory = "Shipment Updates" | "Billing" | "System" | "Promotions";
export type NotificationRecord = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

export type SpendPoint = { month: string; spendUsd: number };

export type AddressRecord = {
  id: string;
  name: string;
  company?: string;
  country: string;
  city: string;
  address: string;
  phone: string;
};

export type DocumentRecord = {
  id: string;
  type: "Commercial Invoice" | "Customs Form" | "Bill of Lading" | "Delivery Confirmation";
  shipmentId: string;
  filename: string;
  createdAt: string;
};

export type TicketRecord = {
  id: string;
  subject: string;
  shipmentId?: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  lastReplyAt: string;
};

export type ApiUsagePoint = { day: string; calls: number };
export type ApiKeyRecord = { id: string; name: string; createdAt: string; lastUsedAt: string | null; masked: string };

const liveOpsRecords: LiveOpsRecord[] = [
  { id: "TRK-2026-3401", serviceType: "Express Air", carrier: "DHL", region: "EU", route: "LAX -> FRA", status: "In Transit" },
  { id: "TRK-2026-7741", serviceType: "Economy Air", carrier: "UPS", region: "EU", route: "DXB -> LHR", status: "Customs Hold" },
  { id: "TRK-2026-1142", serviceType: "Ground", carrier: "USPS", region: "US", route: "SEA -> DEN", status: "Exception" },
  { id: "TRK-2026-2213", serviceType: "Express Air", carrier: "FedEx", region: "APAC", route: "NRT -> SIN", status: "Delivered" },
  { id: "TRK-2026-8859", serviceType: "Ocean", carrier: "Maersk", region: "APAC", route: "SHA -> LAX", status: "Out for Delivery" }
];

const invoices: InvoiceRecord[] = [
  { id: "INV-80412", customer: "NeoTrade GmbH", amount: 14980, status: "Paid" },
  { id: "INV-80413", customer: "Cascade Labs", amount: 2340, status: "Due" },
  { id: "INV-80414", customer: "Atlas Retail", amount: 6120, status: "Overdue" },
  { id: "INV-80415", customer: "Northline Parts", amount: 7320, status: "Paid" }
];

const shipments: ShipmentRecord[] = [
  {
    id: "TRK-2026-9481132",
    origin: "Los Angeles, USA",
    destination: "Frankfurt, Germany",
    service: "Express Air",
    status: "In Transit",
    eta: "Apr 24, 2026",
    weightKg: 18.5,
    costUsd: 146,
    updatedAt: "Apr 22, 08:50 UTC",
    recipient: "Mia Hartmann"
  },
  {
    id: "TRK-2026-7741",
    origin: "Dubai, UAE",
    destination: "London, UK",
    service: "Economy Air",
    status: "Customs Hold",
    eta: "Apr 26, 2026",
    weightKg: 22.1,
    costUsd: 119,
    updatedAt: "Apr 22, 10:15 UTC",
    recipient: "Finley Brooks"
  },
  {
    id: "TRK-2026-1142",
    origin: "Seattle, USA",
    destination: "Denver, USA",
    service: "Ground",
    status: "Exception",
    eta: "Apr 23, 2026",
    weightKg: 9.2,
    costUsd: 52,
    updatedAt: "Apr 22, 06:20 UTC",
    recipient: "Lila Gomez"
  },
  {
    id: "TRK-2026-2213",
    origin: "Tokyo, Japan",
    destination: "Singapore",
    service: "Express Air",
    status: "Delivered",
    eta: "Delivered Apr 21, 2026",
    weightKg: 14.4,
    costUsd: 132,
    updatedAt: "Apr 21, 16:05 UTC",
    recipient: "Ravi Menon"
  },
  {
    id: "TRK-2026-8859",
    origin: "Shanghai, China",
    destination: "Los Angeles, USA",
    service: "Ocean",
    status: "Out for Delivery",
    eta: "Apr 22, 2026 by 6:00 PM",
    weightKg: 240,
    costUsd: 890,
    updatedAt: "Apr 22, 11:20 UTC",
    recipient: "Pacific Imports LLC"
  }
];

const notifications: NotificationRecord[] = [
  {
    id: "ntf-001",
    category: "Shipment Updates",
    title: "Customs hold requires documents",
    message: "TRK-2026-7741 is on Customs Hold. Upload invoice + packing list to clear faster.",
    createdAt: "Apr 22, 2026 10:18 UTC",
    read: false,
    href: "/shipments/TRK-2026-7741"
  },
  {
    id: "ntf-002",
    category: "Shipment Updates",
    title: "Out for delivery",
    message: "TRK-2026-8859 is Out for Delivery. Recipient signature may be required.",
    createdAt: "Apr 22, 2026 11:22 UTC",
    read: true,
    href: "/shipments/TRK-2026-8859"
  },
  {
    id: "ntf-003",
    category: "Billing",
    title: "Invoice due soon",
    message: "INV-80413 is due in 3 days. Pay now to avoid service interruption.",
    createdAt: "Apr 21, 2026 14:05 UTC",
    read: false,
    href: "/billing"
  },
  {
    id: "ntf-004",
    category: "System",
    title: "New security option available",
    message: "Enable two-factor authentication for better account protection.",
    createdAt: "Apr 20, 2026 09:44 UTC",
    read: true,
    href: "/settings"
  }
];

const spendSeries: SpendPoint[] = [
  { month: "Nov", spendUsd: 21400 },
  { month: "Dec", spendUsd: 24800 },
  { month: "Jan", spendUsd: 27150 },
  { month: "Feb", spendUsd: 22600 },
  { month: "Mar", spendUsd: 30210 },
  { month: "Apr", spendUsd: 28940 }
];

const addresses: AddressRecord[] = [
  {
    id: "addr-001",
    name: "Mia Hartmann",
    company: "Klein & Co.",
    country: "Germany",
    city: "Frankfurt",
    address: "Taunusanlage 12, 60325 Frankfurt",
    phone: "+49 69 555 0101"
  },
  {
    id: "addr-002",
    name: "Ravi Menon",
    company: "Menon Trading",
    country: "Singapore",
    city: "Singapore",
    address: "10 Changi Business Park, Singapore",
    phone: "+65 6555 0102"
  },
  {
    id: "addr-003",
    name: "Pacific Imports LLC",
    company: "Pacific Imports LLC",
    country: "USA",
    city: "Los Angeles",
    address: "245 Harbor Blvd, Los Angeles, CA",
    phone: "+1 (310) 555-0123"
  }
];

const documents: DocumentRecord[] = [
  { id: "doc-001", type: "Commercial Invoice", shipmentId: "TRK-2026-9481132", filename: "commercial-invoice.pdf", createdAt: "Apr 21, 2026" },
  { id: "doc-002", type: "Bill of Lading", shipmentId: "TRK-2026-8859", filename: "bill-of-lading.pdf", createdAt: "Apr 20, 2026" },
  { id: "doc-003", type: "Customs Form", shipmentId: "TRK-2026-7741", filename: "customs-declaration.pdf", createdAt: "Apr 22, 2026" },
  { id: "doc-004", type: "Delivery Confirmation", shipmentId: "TRK-2026-2213", filename: "proof-of-delivery.pdf", createdAt: "Apr 21, 2026" }
];

const tickets: TicketRecord[] = [
  { id: "TCK-10021", subject: "Customs hold document request", shipmentId: "TRK-2026-7741", status: "Open", createdAt: "Apr 22, 2026", lastReplyAt: "Apr 22, 2026 10:20 UTC" },
  { id: "TCK-10018", subject: "Invoice question for April charges", shipmentId: undefined, status: "In Progress", createdAt: "Apr 21, 2026", lastReplyAt: "Apr 22, 2026 09:15 UTC" },
  { id: "TCK-10012", subject: "Delivery exception — address mismatch", shipmentId: "TRK-2026-1142", status: "Resolved", createdAt: "Apr 20, 2026", lastReplyAt: "Apr 21, 2026 18:02 UTC" }
];

const apiKeys: ApiKeyRecord[] = [
  { id: "key-001", name: "Production", createdAt: "Mar 02, 2026", lastUsedAt: "Apr 22, 2026", masked: "ssk_live_******************a91d" },
  { id: "key-002", name: "Staging", createdAt: "Feb 10, 2026", lastUsedAt: null, masked: "ssk_test_******************3c2f" }
];

const apiUsage: ApiUsagePoint[] = [
  { day: "Apr 16", calls: 1220 },
  { day: "Apr 17", calls: 1380 },
  { day: "Apr 18", calls: 1540 },
  { day: "Apr 19", calls: 1100 },
  { day: "Apr 20", calls: 1720 },
  { day: "Apr 21", calls: 1910 },
  { day: "Apr 22", calls: 2040 }
];

function simulateDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
}

export async function getLiveOperations(params: {
  serviceType?: string;
  carrier?: string;
  region?: string;
}): Promise<LiveOpsRecord[]> {
  const filtered = liveOpsRecords.filter((record) => {
    const byService = params.serviceType ? record.serviceType.toLowerCase().includes(params.serviceType.toLowerCase()) : true;
    const byCarrier = params.carrier ? record.carrier.toLowerCase().includes(params.carrier.toLowerCase()) : true;
    const byRegion = params.region ? record.region.toLowerCase().includes(params.region.toLowerCase()) : true;
    return byService && byCarrier && byRegion;
  });
  return simulateDelay(filtered);
}

export async function getInvoices(params: { invoiceStatus?: string }): Promise<InvoiceRecord[]> {
  const filtered = invoices.filter((invoice) =>
    params.invoiceStatus ? invoice.status.toLowerCase().includes(params.invoiceStatus.toLowerCase()) : true
  );
  return simulateDelay(filtered);
}

export async function getShipments(params: {
  shipmentStatus?: string;
  shipmentSearch?: string;
}): Promise<ShipmentRecord[]> {
  const filtered = shipments.filter((shipment) => {
    const byStatus = params.shipmentStatus
      ? shipment.status.toLowerCase().includes(params.shipmentStatus.toLowerCase())
      : true;
    const bySearch = params.shipmentSearch
      ? [shipment.id, shipment.origin, shipment.destination, shipment.recipient]
          .join(" ")
          .toLowerCase()
          .includes(params.shipmentSearch.toLowerCase())
      : true;
    return byStatus && bySearch;
  });
  return simulateDelay(filtered);
}

export async function getShipmentById(trackingId: string): Promise<ShipmentRecord | null> {
  const shipment = shipments.find((item) => item.id.toLowerCase() === trackingId.toLowerCase()) ?? null;
  return simulateDelay(shipment);
}

export async function getDashboardSummary(): Promise<{
  activeShipments: number;
  deliveredThisMonth: number;
  pendingClearance: number;
  totalSpentMtdUsd: number;
  recentShipments: ShipmentRecord[];
}> {
  const activeShipments = shipments.filter((s) => s.status === "In Transit" || s.status === "Out for Delivery").length;
  const deliveredThisMonth = shipments.filter((s) => s.status === "Delivered").length;
  const pendingClearance = shipments.filter((s) => s.status === "Customs Hold").length;
  const totalSpentMtdUsd = shipments.reduce((sum, s) => sum + s.costUsd, 0);
  const recentShipments = shipments.slice(0, 5);
  return simulateDelay({ activeShipments, deliveredThisMonth, pendingClearance, totalSpentMtdUsd, recentShipments });
}

export async function getNotifications(params?: { category?: string }): Promise<NotificationRecord[]> {
  const category = params?.category?.trim().toLowerCase();
  const filtered = notifications.filter((n) => (category ? n.category.toLowerCase().includes(category) : true));
  return simulateDelay(filtered);
}

export async function markAllNotificationsRead(): Promise<{ ok: true }> {
  notifications.forEach((n) => (n.read = true));
  return simulateDelay({ ok: true }, 350);
}

export async function getSpendSeries(): Promise<SpendPoint[]> {
  return simulateDelay(spendSeries);
}

export async function getAddresses(params?: { q?: string }): Promise<AddressRecord[]> {
  const q = params?.q?.trim().toLowerCase();
  const filtered = addresses.filter((a) =>
    q ? [a.name, a.company ?? "", a.country, a.city, a.address].join(" ").toLowerCase().includes(q) : true
  );
  return simulateDelay(filtered);
}

export async function getDocuments(params?: { q?: string; type?: string }): Promise<DocumentRecord[]> {
  const q = params?.q?.trim().toLowerCase();
  const type = params?.type?.trim().toLowerCase();
  const filtered = documents.filter((d) => {
    const byType = type ? d.type.toLowerCase().includes(type) : true;
    const byQ = q ? [d.id, d.type, d.shipmentId, d.filename].join(" ").toLowerCase().includes(q) : true;
    return byType && byQ;
  });
  return simulateDelay(filtered);
}

export async function getTickets(params?: { q?: string; status?: string }): Promise<TicketRecord[]> {
  const q = params?.q?.trim().toLowerCase();
  const status = params?.status?.trim().toLowerCase();
  const filtered = tickets.filter((t) => {
    const byStatus = status ? t.status.toLowerCase().includes(status) : true;
    const byQ = q ? [t.id, t.subject, t.shipmentId ?? ""].join(" ").toLowerCase().includes(q) : true;
    return byStatus && byQ;
  });
  return simulateDelay(filtered);
}

export async function getApiKeys(): Promise<ApiKeyRecord[]> {
  return simulateDelay(apiKeys);
}

export async function getApiUsage(): Promise<ApiUsagePoint[]> {
  return simulateDelay(apiUsage);
}

// ----------------------------
// Admin datasets (Section 4)
// ----------------------------

export type AdminShipmentRow = ShipmentRecord & {
  customer: string;
  carrier: string;
  exceptionFlag: boolean;
  originCountry: string;
  destinationCountry: string;
  customsStatus: "Docs Pending" | "Under Review" | "Cleared" | "Rejected" | "Not Applicable";
};

export type AdminKpiSnapshot = {
  createdToday: number;
  inTransit: number;
  deliveredToday: number;
  exceptions: number;
  activeTickets: number;
  revenueTodayUsd: number;
};

export type ExceptionType =
  | "Lost Package"
  | "Customs Hold"
  | "Delivery Failure"
  | "Address Issue"
  | "Damage Reported"
  | "Carrier Delay";

export type ExceptionRecord = {
  id: string; // shipment tracking id
  type: ExceptionType;
  priority: "Low" | "Medium" | "High" | "Critical";
  region: "US" | "EU" | "APAC" | "ME";
  assignee: string;
  raisedAt: string;
  slaMinutes: number;
  note: string;
};

export type CustomerRecord = {
  id: string;
  name: string;
  type: "Individual" | "Business" | "Enterprise";
  country: string;
  joinDate: string;
  status: "Active" | "Suspended";
  totalShipments: number;
  totalRevenueUsd: number;
  creditLimitUsd?: number;
};

export type StaffRole = {
  id: string;
  name: string;
  permissions: Record<string, boolean>;
};

export type StaffRecord = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  lastLogin: string;
  status: "Active" | "Suspended";
};

export type StaffActivityRecord = {
  id: string;
  staffName: string;
  action: string;
  createdAt: string;
};

export type DriverRecord = {
  id: string;
  name: string;
  region: "US" | "EU" | "APAC" | "ME";
  status: "On Duty" | "Off Duty";
  currentAssignments: number;
  rating: number;
};

export type RateCardRow = {
  id: string;
  originZone: string;
  destinationZone: string;
  weightBracketKg: string;
  serviceType: string;
  carrier: string;
  baseRateUsd: number;
  fuelSurchargePct: number;
  effectiveFrom: string;
};

export type PromoCodeRecord = {
  id: string;
  code: string;
  kind: "% Off" | "$ Off" | "Free Service";
  value: number;
  expiry: string;
  usageLimit: number;
  used: number;
  status: "Draft" | "Active" | "Expired";
};

export type ApiLogRecord = {
  id: string;
  direction: "Inbound" | "Outbound";
  path: string;
  status: number;
  latencyMs: number;
  createdAt: string;
  payloadPreview: string;
};

export type WebhookLogRecord = {
  id: string;
  endpoint: string;
  event: string;
  status: "Delivered" | "Retrying" | "Failed";
  attempts: number;
  createdAt: string;
  lastError?: string;
};

export type SystemEventRecord = {
  id: string;
  kind: "Auth" | "Admin" | "Shipment" | "Billing" | "Integration";
  message: string;
  createdAt: string;
};

const adminShipments: AdminShipmentRow[] = shipments.map((s, idx) => {
  const carrierByService: Record<string, string> = {
    "Express Air": "FedEx",
    "Economy Air": "UPS",
    Ground: "USPS",
    Ocean: "Maersk"
  };
  const customerByIdx = ["Cascade Labs", "NeoTrade GmbH", "Atlas Retail", "Menon Trading", "Pacific Imports LLC"];
  const originCountry = s.origin.split(",").at(-1)?.trim() ?? "—";
  const destinationCountry = s.destination.split(",").at(-1)?.trim() ?? "—";
  const exceptionFlag = s.status === "Exception" || s.status === "Customs Hold";
  const customsStatus: AdminShipmentRow["customsStatus"] =
    s.status === "Customs Hold" ? "Docs Pending" : destinationCountry === "USA" ? "Not Applicable" : "Cleared";

  return {
    ...s,
    customer: customerByIdx[idx % customerByIdx.length],
    carrier: carrierByService[s.service] ?? "DHL",
    exceptionFlag,
    originCountry,
    destinationCountry,
    customsStatus
  };
});

const exceptions: ExceptionRecord[] = [
  {
    id: "TRK-2026-7741",
    type: "Customs Hold",
    priority: "High",
    region: "EU",
    assignee: "Unassigned",
    raisedAt: "Apr 22, 2026 10:15 UTC",
    slaMinutes: 180,
    note: "Missing invoice + packing list."
  },
  {
    id: "TRK-2026-1142",
    type: "Address Issue",
    priority: "Medium",
    region: "US",
    assignee: "Alex P.",
    raisedAt: "Apr 22, 2026 06:20 UTC",
    slaMinutes: 360,
    note: "Recipient address mismatch reported by carrier."
  }
];

const customers: CustomerRecord[] = [
  {
    id: "cus-001",
    name: "Cascade Labs",
    type: "Business",
    country: "USA",
    joinDate: "Jan 12, 2026",
    status: "Active",
    totalShipments: 42,
    totalRevenueUsd: 128400
  },
  {
    id: "cus-002",
    name: "NeoTrade GmbH",
    type: "Enterprise",
    country: "Germany",
    joinDate: "Oct 03, 2025",
    status: "Active",
    totalShipments: 318,
    totalRevenueUsd: 892100,
    creditLimitUsd: 150000
  },
  {
    id: "cus-003",
    name: "Pacific Imports LLC",
    type: "Business",
    country: "USA",
    joinDate: "Feb 28, 2026",
    status: "Suspended",
    totalShipments: 16,
    totalRevenueUsd: 40210
  }
];

const staffRoles: StaffRole[] = [
  {
    id: "role-super",
    name: "Super Admin",
    permissions: {
      "shipments.read": true,
      "shipments.write": true,
      "exceptions.manage": true,
      "customs.manage": true,
      "finance.manage": true,
      "support.manage": true,
      "staff.manage": true,
      "rates.manage": true,
      "logs.read": true
    }
  },
  {
    id: "role-ops",
    name: "Operations Manager",
    permissions: {
      "shipments.read": true,
      "shipments.write": true,
      "exceptions.manage": true,
      "customs.manage": true,
      "finance.manage": false,
      "support.manage": false,
      "staff.manage": false,
      "rates.manage": false,
      "logs.read": true
    }
  },
  {
    id: "role-support",
    name: "Customer Support Agent",
    permissions: {
      "shipments.read": true,
      "shipments.write": false,
      "exceptions.manage": false,
      "customs.manage": false,
      "finance.manage": false,
      "support.manage": true,
      "staff.manage": false,
      "rates.manage": false,
      "logs.read": false
    }
  }
];

const staff: StaffRecord[] = [
  { id: "stf-001", name: "Nina V.", email: "nina@necoship.global", roleId: "role-ops", lastLogin: "Apr 22, 2026", status: "Active" },
  { id: "stf-002", name: "Alex P.", email: "alex@necoship.global", roleId: "role-support", lastLogin: "Apr 22, 2026", status: "Active" },
  { id: "stf-003", name: "Sam K.", email: "sam@necoship.global", roleId: "role-super", lastLogin: "Apr 21, 2026", status: "Active" }
];

const staffActivity: StaffActivityRecord[] = [
  { id: "act-001", staffName: "Nina V.", action: "Flagged TRK-2026-7741 for customs docs", createdAt: "Apr 22, 2026 10:18 UTC" },
  { id: "act-002", staffName: "Alex P.", action: "Replied to TCK-10021", createdAt: "Apr 22, 2026 10:22 UTC" },
  { id: "act-003", staffName: "Sam K.", action: "Rotated webhook secret", createdAt: "Apr 22, 2026 09:41 UTC" }
];

const drivers: DriverRecord[] = [
  { id: "drv-001", name: "Ibrahim Saleh", region: "ME", status: "On Duty", currentAssignments: 3, rating: 4.8 },
  { id: "drv-002", name: "Keiko Tanaka", region: "APAC", status: "On Duty", currentAssignments: 2, rating: 4.7 },
  { id: "drv-003", name: "Jordan Reed", region: "US", status: "Off Duty", currentAssignments: 0, rating: 4.6 }
];

const rateCards: RateCardRow[] = [
  {
    id: "rate-001",
    originZone: "US-W",
    destinationZone: "EU-C",
    weightBracketKg: "0–5",
    serviceType: "Express Air",
    carrier: "FedEx",
    baseRateUsd: 78,
    fuelSurchargePct: 12,
    effectiveFrom: "Apr 01, 2026"
  },
  {
    id: "rate-002",
    originZone: "APAC-N",
    destinationZone: "US-W",
    weightBracketKg: "20–50",
    serviceType: "Ocean",
    carrier: "Maersk",
    baseRateUsd: 640,
    fuelSurchargePct: 9,
    effectiveFrom: "Mar 15, 2026"
  }
];

const promoCodes: PromoCodeRecord[] = [
  { id: "prm-001", code: "NECO10", kind: "% Off", value: 10, expiry: "Jun 30, 2026", usageLimit: 1000, used: 214, status: "Active" },
  { id: "prm-002", code: "FREESHIP", kind: "Free Service", value: 1, expiry: "May 15, 2026", usageLimit: 200, used: 188, status: "Active" },
  { id: "prm-003", code: "WELCOME25", kind: "$ Off", value: 25, expiry: "Apr 10, 2026", usageLimit: 500, used: 500, status: "Expired" }
];

const apiLogs: ApiLogRecord[] = [
  {
    id: "api-001",
    direction: "Inbound",
    path: "/v1/track",
    status: 200,
    latencyMs: 142,
    createdAt: "Apr 22, 2026 11:22 UTC",
    payloadPreview: '{"trackingId":"TRK-2026-8859"}'
  },
  {
    id: "api-002",
    direction: "Outbound",
    path: "UPS /track",
    status: 504,
    latencyMs: 1200,
    createdAt: "Apr 22, 2026 10:52 UTC",
    payloadPreview: '{"carrier":"UPS","trackingId":"TRK-2026-7741"}'
  }
];

const webhookLogs: WebhookLogRecord[] = [
  {
    id: "wh-001",
    endpoint: "https://example.com/webhooks/necoship",
    event: "shipment.status.updated",
    status: "Delivered",
    attempts: 1,
    createdAt: "Apr 22, 2026 11:25 UTC"
  },
  {
    id: "wh-002",
    endpoint: "https://example.com/webhooks/necoship",
    event: "billing.invoice.due",
    status: "Retrying",
    attempts: 3,
    createdAt: "Apr 22, 2026 09:12 UTC",
    lastError: "HTTP 500 from receiver"
  }
];

const systemEvents: SystemEventRecord[] = [
  { id: "evt-001", kind: "Auth", message: "Admin login: sam@necoship.global", createdAt: "Apr 22, 2026 09:40 UTC" },
  { id: "evt-002", kind: "Shipment", message: "Status override applied to TRK-2026-1142", createdAt: "Apr 22, 2026 10:03 UTC" },
  { id: "evt-003", kind: "Integration", message: "UPS integration latency spike detected", createdAt: "Apr 22, 2026 10:55 UTC" }
];

export async function getAdminKpis(): Promise<AdminKpiSnapshot> {
  const createdToday = Math.max(1, shipments.length + 7);
  const inTransit = shipments.filter((s) => s.status === "In Transit" || s.status === "Out for Delivery").length + 412;
  const deliveredToday = shipments.filter((s) => s.status === "Delivered").length + 56;
  const exceptionsCount = shipments.filter((s) => s.status === "Exception" || s.status === "Customs Hold").length + 12;
  const activeTickets = tickets.filter((t) => t.status !== "Resolved").length + 18;
  const revenueTodayUsd = Math.round(shipments.reduce((sum, s) => sum + s.costUsd, 0) * 18);
  return simulateDelay({ createdToday, inTransit, deliveredToday, exceptions: exceptionsCount, activeTickets, revenueTodayUsd }, 350);
}

export async function getAdminShipments(params?: {
  q?: string;
  status?: string;
  customer?: string;
  carrier?: string;
  originCountry?: string;
  destinationCountry?: string;
  exceptionOnly?: boolean;
  customsStatus?: string;
}): Promise<AdminShipmentRow[]> {
  const q = params?.q?.trim().toLowerCase();
  const status = params?.status?.trim().toLowerCase();
  const customer = params?.customer?.trim().toLowerCase();
  const carrier = params?.carrier?.trim().toLowerCase();
  const o = params?.originCountry?.trim().toLowerCase();
  const d = params?.destinationCountry?.trim().toLowerCase();
  const customs = params?.customsStatus?.trim().toLowerCase();
  const exceptionOnly = params?.exceptionOnly ?? false;

  const filtered = adminShipments.filter((s) => {
    const byQ = q ? [s.id, s.customer, s.carrier, s.origin, s.destination, s.recipient].join(" ").toLowerCase().includes(q) : true;
    const byStatus = status ? s.status.toLowerCase().includes(status) : true;
    const byCustomer = customer ? s.customer.toLowerCase().includes(customer) : true;
    const byCarrier = carrier ? s.carrier.toLowerCase().includes(carrier) : true;
    const byO = o ? s.originCountry.toLowerCase().includes(o) : true;
    const byD = d ? s.destinationCountry.toLowerCase().includes(d) : true;
    const byException = exceptionOnly ? s.exceptionFlag : true;
    const byCustoms = customs ? s.customsStatus.toLowerCase().includes(customs) : true;
    return byQ && byStatus && byCustomer && byCarrier && byO && byD && byException && byCustoms;
  });

  return simulateDelay(filtered, 500);
}

export async function getExceptions(params?: { q?: string; type?: string; region?: string; assignee?: string }): Promise<ExceptionRecord[]> {
  const q = params?.q?.trim().toLowerCase();
  const type = params?.type?.trim().toLowerCase();
  const region = params?.region?.trim().toLowerCase();
  const assignee = params?.assignee?.trim().toLowerCase();
  const filtered = exceptions.filter((e) => {
    const byQ = q ? [e.id, e.type, e.note].join(" ").toLowerCase().includes(q) : true;
    const byType = type ? e.type.toLowerCase().includes(type) : true;
    const byRegion = region ? e.region.toLowerCase().includes(region) : true;
    const byAssignee = assignee ? e.assignee.toLowerCase().includes(assignee) : true;
    return byQ && byType && byRegion && byAssignee;
  });
  return simulateDelay(filtered, 450);
}

export async function getCustomers(params?: { q?: string; type?: string; status?: string }): Promise<CustomerRecord[]> {
  const q = params?.q?.trim().toLowerCase();
  const type = params?.type?.trim().toLowerCase();
  const status = params?.status?.trim().toLowerCase();
  const filtered = customers.filter((c) => {
    const byQ = q ? [c.id, c.name, c.country].join(" ").toLowerCase().includes(q) : true;
    const byType = type ? c.type.toLowerCase().includes(type) : true;
    const byStatus = status ? c.status.toLowerCase().includes(status) : true;
    return byQ && byType && byStatus;
  });
  return simulateDelay(filtered, 500);
}

export async function getCustomerById(customerId: string): Promise<CustomerRecord | null> {
  const found = customers.find((c) => c.id.toLowerCase() === customerId.toLowerCase()) ?? null;
  return simulateDelay(found, 450);
}

export async function getStaff(): Promise<StaffRecord[]> {
  return simulateDelay(staff, 450);
}

export async function getStaffRoles(): Promise<StaffRole[]> {
  return simulateDelay(staffRoles, 450);
}

export async function getStaffActivity(): Promise<StaffActivityRecord[]> {
  return simulateDelay(staffActivity, 450);
}

export async function getDrivers(): Promise<DriverRecord[]> {
  return simulateDelay(drivers, 450);
}

export async function getRateCards(params?: { q?: string; carrier?: string; serviceType?: string }): Promise<RateCardRow[]> {
  const q = params?.q?.trim().toLowerCase();
  const carrier = params?.carrier?.trim().toLowerCase();
  const serviceType = params?.serviceType?.trim().toLowerCase();
  const filtered = rateCards.filter((r) => {
    const byQ = q ? [r.originZone, r.destinationZone, r.weightBracketKg, r.serviceType, r.carrier].join(" ").toLowerCase().includes(q) : true;
    const byCarrier = carrier ? r.carrier.toLowerCase().includes(carrier) : true;
    const byService = serviceType ? r.serviceType.toLowerCase().includes(serviceType) : true;
    return byQ && byCarrier && byService;
  });
  return simulateDelay(filtered, 500);
}

export async function getPromoCodes(params?: { q?: string; status?: string }): Promise<PromoCodeRecord[]> {
  const q = params?.q?.trim().toLowerCase();
  const status = params?.status?.trim().toLowerCase();
  const filtered = promoCodes.filter((p) => {
    const byQ = q ? [p.code, p.kind].join(" ").toLowerCase().includes(q) : true;
    const byStatus = status ? p.status.toLowerCase().includes(status) : true;
    return byQ && byQ && byStatus;
  });
  return simulateDelay(filtered, 450);
}

export async function getApiLogs(): Promise<ApiLogRecord[]> {
  return simulateDelay(apiLogs, 500);
}

export async function getWebhookLogs(): Promise<WebhookLogRecord[]> {
  return simulateDelay(webhookLogs, 500);
}

export async function getSystemEvents(): Promise<SystemEventRecord[]> {
  return simulateDelay(systemEvents, 500);
}
