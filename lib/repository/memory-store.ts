export type MemoryUser = {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  passwordHash: string | null;
  name: string | null;
  phone: string | null;
  country: string | null;
  role: "CUSTOMER" | "ADMIN" | "OPS_MANAGER" | "SUPPORT_AGENT" | "FINANCE" | "CUSTOMS_OFFICER" | "READ_ONLY" | "DRIVER";
  accountType: "INDIVIDUAL" | "BUSINESS" | "ENTERPRISE";
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  backupCodes: string[];
  companyName: string | null;
  ein: string | null;
  duns: string | null;
  creditLimitCents: number | null;
  walletBalanceCents: number;
  autoPayEnabled: boolean;
  preferredUnits: string;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MemoryShipment = {
  id: string;
  trackingNumber: string;
  userId: string | null;
  organizationId: string | null;
  status: string;
  serviceType: string;
  carrier: string | null;
  carrierShipmentId: string | null;
  origin: string;
  destination: string;
  recipientName: string | null;
  recipientPhone: string | null;
  recipientEmail: string | null;
  deliveryInstructions: string | null;
  weightKg: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  declaredValueCents: number | null;
  commodity: string | null;
  hsCode: string | null;
  incoterms: string | null;
  insuranceCents: number | null;
  amountCents: number | null;
  currency: string;
  promoCode: string | null;
  labelUrl: string | null;
  labelZpl: string | null;
  eta: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  recipientToken: string | null;
  isReturn: boolean;
  parentShipmentId: string | null;
  carbonKg: number | null;
  hazmat: boolean;
  batteries: boolean;
  liquids: boolean;
  signatureRequired: boolean;
  costCenterCode: string | null;
  guestEmail?: string | null;
  quoteId?: string | null;
  labelProvider?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MemoryTrackingEvent = {
  id: string;
  shipmentId: string;
  status: string | null;
  code: string | null;
  description: string;
  location: string | null;
  lat: number | null;
  lng: number | null;
  occurredAt: string;
};

export type MemoryAddress = {
  id: string;
  userId: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type MemoryInvoice = {
  id: string;
  number: string;
  userId: string;
  status: string;
  amountCents: number;
  currency: string;
  dueAt: string | null;
  paidAt: string | null;
  createdAt: string;
};

export type MemoryTicket = {
  id: string;
  number: string;
  userId: string;
  assigneeId: string | null;
  shipmentId: string | null;
  subject: string;
  status: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  messages: Array<{ id: string; authorId: string | null; body: string; isInternal: boolean; createdAt: string }>;
};

export type MemoryNotification = {
  id: string;
  userId: string;
  category: string;
  title: string;
  message: string;
  href?: string;
  read: boolean;
  createdAt: string;
};

export type MemoryDocument = {
  id: string;
  userId: string | null;
  shipmentId: string | null;
  type: string;
  filename: string;
  url: string;
  createdAt: string;
};

export type MemoryClaim = {
  id: string;
  number: string;
  shipmentId: string;
  userId: string;
  type: string;
  description: string;
  amountCents: number | null;
  status: string;
  createdAt: string;
  updatedAt?: string;
};

export type MemoryProofOfDelivery = {
  id: string;
  shipmentId: string;
  signedBy: string | null;
  signatureUrl: string | null;
  photoUrl: string | null;
  notes: string | null;
  capturedAt: string;
};

export type MemoryOrg = {
  id: string;
  name: string;
  accountType: string;
  creditLimitCents: number | null;
  members: Array<{ userId: string; role: string }>;
  costCenters: Array<{ id: string; code: string; name: string }>;
};

type MemoryStore = {
  users: MemoryUser[];
  verificationTokens: Array<{ identifier: string; token: string; type: string; expires: string; userId?: string }>;
  shipments: MemoryShipment[];
  events: MemoryTrackingEvent[];
  addresses: MemoryAddress[];
  invoices: MemoryInvoice[];
  tickets: MemoryTicket[];
  notifications: MemoryNotification[];
  documents: MemoryDocument[];
  claims: MemoryClaim[];
  proofOfDeliveries: MemoryProofOfDelivery[];
  quotes: Array<Record<string, unknown>>;
  apiKeys: Array<{ id: string; userId: string; name: string; keyHash: string; prefix: string; createdAt: string; lastUsedAt: string | null; revokedAt: string | null }>;
  webhookEndpoints: Array<{ id: string; userId: string; url: string; secret: string; events: string[]; active: boolean }>;
  organizations: MemoryOrg[];
  customers: Array<Record<string, unknown>>;
  exceptions: Array<Record<string, unknown>>;
  pickups: Array<Record<string, unknown>>;
  customs: Array<Record<string, unknown>>;
  drivers: Array<Record<string, unknown>>;
  rateCards: Array<Record<string, unknown>>;
  promos: Array<Record<string, unknown>>;
  refunds: Array<Record<string, unknown>>;
  warehouseLocations: Array<Record<string, unknown>>;
  warehouseMovements: Array<Record<string, unknown>>;
  carriers: Array<Record<string, unknown>>;
  carrierInvoices: Array<Record<string, unknown>>;
  blogPosts: Array<Record<string, unknown>>;
  auditLogs: Array<Record<string, unknown>>;
  systemLogs: Array<Record<string, unknown>>;
  templates: Array<Record<string, unknown>>;
  complianceRequests: Array<Record<string, unknown>>;
  notificationPrefs: Array<{ userId: string; eventType: string; email: boolean; sms: boolean; push: boolean }>;
  staff?: Array<Record<string, unknown>>;
  staffRoles?: Array<Record<string, unknown>>;
  staffActivity?: Array<Record<string, unknown>>;
  liveOps?: Array<Record<string, unknown>>;
  apiUsage?: Array<{ day: string; calls: number }>;
  spendSeries?: Array<{ month: string; spendUsd: number }>;
  apiLogs?: Array<Record<string, unknown>>;
  webhookLogs?: Array<Record<string, unknown>>;
  accountSettings?: Record<string, Record<string, unknown>>;
  wallets?: Record<string, number>;
  recurringSchedules: Array<Record<string, unknown>>;
  deliveryAppointments: Array<Record<string, unknown>>;
  pickWaves: Array<Record<string, unknown>>;
  rateRules: Array<Record<string, unknown>>;
  manifests: Array<Record<string, unknown>>;
  labelProfiles: Array<Record<string, unknown>>;
  screeningHits: Array<Record<string, unknown>>;
};

const globalStore = globalThis as unknown as { __necoshipStore?: MemoryStore };

function seedStore(): MemoryStore {
  const now = new Date().toISOString();
  return {
    users: [],
    verificationTokens: [],
    shipments: [],
    events: [],
    addresses: [],
    invoices: [],
    notifications: [],
    documents: [],
    claims: [],
    proofOfDeliveries: [],
    quotes: [],
    apiKeys: [],
    webhookEndpoints: [],
    organizations: [],
    customers: [],
    recurringSchedules: [],
    deliveryAppointments: [],
    pickWaves: [],
    rateRules: [
      {
        id: "rr_prefer_cheapest",
        name: "Prefer cheapest under 5kg",
        priority: 10,
        active: true,
        conditions: { maxWeightKg: 5 },
        actions: { sortBy: "price_asc", preferCarriers: ["USPS", "NecoShip Ground"] }
      },
      {
        id: "rr_express_intl",
        name: "Force express for international high value",
        priority: 20,
        active: true,
        conditions: { international: true, minDeclaredValueCents: 50000 },
        actions: { requireServiceTypes: ["EXPRESS_AIR"], excludeCarriers: ["Partner Ocean"] }
      },
      {
        id: "rr_fuel_surcharge",
        name: "Apply fuel surcharge EU lanes",
        priority: 5,
        active: true,
        conditions: { destZones: ["EU", "DE", "FR", "GB"] },
        actions: { surchargePct: 8.5 }
      }
    ],
    manifests: [],
    labelProfiles: [
      {
        id: "lp_zpl_4x6",
        name: "Zebra 4x6 Thermal",
        format: "ZPL",
        widthIn: 4,
        heightIn: 6,
        dpi: 203,
        printerLanguage: "ZPL II",
        isDefault: true
      },
      {
        id: "lp_pdf_4x6",
        name: "PDF 4x6",
        format: "PDF",
        widthIn: 4,
        heightIn: 6,
        dpi: 300,
        printerLanguage: "PDF",
        isDefault: false
      },
      {
        id: "lp_epl_4x6",
        name: "EPL 4x6 Legacy",
        format: "EPL",
        widthIn: 4,
        heightIn: 6,
        dpi: 203,
        printerLanguage: "EPL2",
        isDefault: false
      }
    ],
    screeningHits: [],
    exceptions: [],
    pickups: [
      {
        id: "pkp_seed_1",
        shipmentId: "shp_seed_1",
        trackingNumber: "NSGUS100000001",
        scheduledStart: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
        scheduledEnd: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
        status: "SCHEDULED",
        address: "1200 Flower St, Los Angeles, CA",
        carrierPickupId: "fx_pkp_seed_1"
      },
      {
        id: "pkp_seed_2",
        shipmentId: "shp_seed_2",
        trackingNumber: "NSGUS100000002",
        scheduledStart: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        scheduledEnd: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
        status: "IN_PROGRESS",
        address: "88 Market St, San Francisco, CA",
        carrierPickupId: "ups_pkp_seed_2"
      },
      {
        id: "pkp_seed_3",
        shipmentId: "shp_seed_3",
        trackingNumber: "NSGEU100000003",
        scheduledStart: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        scheduledEnd: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        status: "COMPLETED",
        address: "Hauptbahnhof 1, Frankfurt, DE",
        carrierPickupId: "dhl_pkp_seed_3"
      }
    ],
    customs: [],
    drivers: [],
    rateCards: [
      {
        id: "rc_1",
        name: "US-EU Express",
        originZone: "US",
        destZone: "EU",
        serviceType: "EXPRESS_AIR",
        carrier: "NecoShip",
        weightMinKg: 0,
        weightMaxKg: 70,
        baseCents: 4200,
        perKgCents: 850
      }
    ],
    promos: [
      {
        id: "promo_1",
        code: "WELCOME10",
        percentOff: 10,
        active: true,
        maxUses: 1000,
        usedCount: 12
      }
    ],
    refunds: [
      {
        id: "ref_seed_1",
        shipmentId: "shp_seed_2",
        trackingNumber: "NSGUS100000002",
        userId: "usr_seed_1",
        amountCents: 4500,
        currency: "USD",
        reason: "Delayed delivery",
        status: "PENDING",
        createdAt: now
      }
    ],
    warehouseLocations: [
      {
        id: "wh_lax",
        code: "LAX-01",
        name: "Los Angeles Hub",
        bins: [
          { code: "A-01", sku: "BOX-SM", qty: 240 },
          { code: "A-02", sku: "BOX-MD", qty: 120 },
          { code: "B-01", sku: "LABEL-ROLL", qty: 80 }
        ]
      },
      {
        id: "wh_fra",
        code: "FRA-01",
        name: "Frankfurt Hub",
        bins: [
          { code: "C-01", sku: "BOX-LG", qty: 64 },
          { code: "C-02", sku: "TAPE-CLR", qty: 200 }
        ]
      }
    ],
    warehouseMovements: [
      {
        id: "wm_seed_1",
        locationId: "wh_lax",
        binCode: "A-01",
        sku: "BOX-SM",
        qtyDelta: -12,
        reason: "Outbound pack",
        createdAt: now
      }
    ],
    carriers: [
      { carrier: "FedEx", status: "HEALTHY", latencyMs: 120 },
      { carrier: "UPS", status: "HEALTHY", latencyMs: 140 },
      { carrier: "DHL", status: "DEGRADED", latencyMs: 820 },
      { carrier: "USPS", status: "HEALTHY", latencyMs: 95 },
      { carrier: "ShipEngine", status: "HEALTHY", latencyMs: 110 }
    ],
    carrierInvoices: [],
    blogPosts: [],
    auditLogs: [],
    systemLogs: [],
    templates: [],
    complianceRequests: [],
    tickets: [
      {
        id: "tkt_seed_1",
        number: "TKT-1001",
        userId: "usr_seed_1",
        assigneeId: null,
        shipmentId: "shp_seed_1",
        subject: "Pickup window missed",
        status: "OPEN",
        priority: 1,
        createdAt: now,
        updatedAt: now,
        messages: []
      },
      {
        id: "tkt_seed_2",
        number: "TKT-1002",
        userId: "usr_seed_1",
        assigneeId: "usr_agent_1",
        shipmentId: "shp_seed_2",
        subject: "Customs hold — docs needed",
        status: "IN_PROGRESS",
        priority: 2,
        createdAt: now,
        updatedAt: now,
        messages: []
      }
    ],
    notificationPrefs: []
  };
}

export const memoryStore: MemoryStore = globalStore.__necoshipStore ?? seedStore();
if (!globalStore.__necoshipStore) {
  globalStore.__necoshipStore = memoryStore;
}
