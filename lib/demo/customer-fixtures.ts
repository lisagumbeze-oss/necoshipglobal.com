import type { ShipmentStatusCode } from "@/lib/demo/shipment-status";

/** All records in this module are synthetic demonstration fixtures. */
export const DEMO_DATA_NOTICE =
  "Demonstration data — sample records for UI development only. Not live NECO operational or financial activity.";

export type DemoCustomerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string | null;
  accountType: "INDIVIDUAL";
  preferredUnits: "metric" | "imperial";
  city: string;
  country: string;
};

export type DemoTimelineEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  status: ShipmentStatusCode;
  /** Optional demonstration coordinates for MapLibre preview — not live carrier GPS. */
  lat?: number | null;
  lng?: number | null;
};

export type DemoShipment = {
  id: string;
  trackingNumber: string;
  reference: string;
  origin: string;
  destination: string;
  method: string;
  bookingDate: string;
  estimatedDelivery: string | null;
  status: ShipmentStatusCode;
  senderName: string;
  recipientName: string;
  recipientEmail: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  declaredValueUsd: number;
  packageDescription: string;
  currentLocation: string | null;
  events: DemoTimelineEvent[];
  documents: Array<{ id: string; name: string; type: string }>;
  deliveryInfo: string | null;
};

export type DemoQuote = {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  method: string;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "QUOTED" | "EXPIRED";
  createdAt: string;
  notes: string;
  /** Never presented as a final live tariff without confirmation. */
  indicativeNote: string;
};

export type DemoPickup = {
  id: string;
  shipmentReference: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  contactPerson: string;
  phone: string;
  instructions: string;
  status: "REQUESTED" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
};

export type DemoAddress = {
  id: string;
  label: string;
  category: "SENDER" | "RECIPIENT" | "OTHER";
  name: string;
  line1: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
};

export type DemoInvoice = {
  id: string;
  number: string;
  shipmentReference: string;
  invoiceDate: string;
  dueDate: string;
  amountUsd: number;
  currency: "USD";
  status: "DRAFT" | "ISSUED" | "PAID" | "OVERDUE";
  arrangement: "PREPAID_INDIVIDUAL";
  lineItems: Array<{ description: string; amountUsd: number }>;
};

export type DemoPayment = {
  id: string;
  transactionRef: string;
  date: string;
  shipmentReference: string;
  method: string;
  amountUsd: number;
  currency: "USD";
  status: "SUCCEEDED" | "PENDING" | "FAILED";
  arrangement: "PREPAID_INDIVIDUAL";
};

export type DemoClaim = {
  id: string;
  reference: string;
  category: "LOST" | "DAMAGED" | "DELAYED" | "MISSING_ITEMS" | "OTHER";
  shipmentReference: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";
  createdAt: string;
  summary: string;
  documents: string[];
};

export type DemoSupportTicket = {
  id: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
  createdAt: string;
  messages: Array<{ id: string; author: "CUSTOMER" | "SUPPORT"; body: string; at: string }>;
};

export type DemoNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

export const demoCustomer: DemoCustomerProfile = {
  id: "cus_demo_individual_001",
  name: "Jordan Ellis",
  email: "jordan.ellis.demo@example.com",
  phone: "+1 (310) 555-0142",
  companyName: null,
  accountType: "INDIVIDUAL",
  preferredUnits: "metric",
  city: "Los Angeles",
  country: "United States"
};

export const demoShipments: DemoShipment[] = [
  {
    id: "shp_demo_1",
    trackingNumber: "NS-DEMO-100481",
    reference: "REF-IND-2401",
    origin: "Los Angeles, US",
    destination: "Frankfurt, DE",
    method: "Air Freight",
    bookingDate: "2026-11-02T10:15:00.000Z",
    estimatedDelivery: "2026-11-08T16:00:00.000Z",
    status: "IN_TRANSIT",
    senderName: "Jordan Ellis",
    recipientName: "Mia Hartmann",
    recipientEmail: "mia.hartmann.demo@example.com",
    weightKg: 8.4,
    lengthCm: 40,
    widthCm: 30,
    heightCm: 20,
    declaredValueUsd: 450,
    packageDescription: "Consumer electronics accessories",
    currentLocation: "Gateway hub — demonstration event",
    documents: [
      { id: "doc_1", name: "Commercial invoice (sample).pdf", type: "INVOICE" },
      { id: "doc_2", name: "Label preview (sample).pdf", type: "LABEL" }
    ],
    deliveryInfo: null,
    events: [
      {
        id: "ev1",
        title: "Booking recorded",
        description: "Demonstration booking created for UI preview.",
        location: "Los Angeles, US",
        timestamp: "2026-11-02T10:15:00.000Z",
        status: "BOOKED",
        lat: 34.0522,
        lng: -118.2437
      },
      {
        id: "ev2",
        title: "Collected",
        description: "Sample collection event for timeline display.",
        location: "Los Angeles, US",
        timestamp: "2026-11-03T09:40:00.000Z",
        status: "COLLECTED",
        lat: 33.9425,
        lng: -118.4081
      },
      {
        id: "ev3",
        title: "In transit",
        description: "Sample linehaul event — not a live carrier update.",
        location: "Chicago gateway (demo)",
        timestamp: "2026-11-04T18:20:00.000Z",
        status: "IN_TRANSIT",
        lat: 41.9742,
        lng: -87.9073
      }
    ]
  },
  {
    id: "shp_demo_2",
    trackingNumber: "NS-DEMO-100482",
    reference: "REF-IND-2402",
    origin: "Chicago, US",
    destination: "Toronto, CA",
    method: "Road Transportation",
    bookingDate: "2026-10-28T14:00:00.000Z",
    estimatedDelivery: "2026-11-01T12:00:00.000Z",
    status: "DELIVERED",
    senderName: "Jordan Ellis",
    recipientName: "Sam Rivera",
    recipientEmail: "sam.rivera.demo@example.com",
    weightKg: 3.2,
    lengthCm: 30,
    widthCm: 20,
    heightCm: 15,
    declaredValueUsd: 120,
    packageDescription: "Documents and samples",
    currentLocation: "Delivered — demonstration",
    documents: [{ id: "doc_3", name: "POD preview (sample).pdf", type: "POD" }],
    deliveryInfo: "Signed for by S. Rivera (sample proof-of-delivery preview).",
    events: [
      {
        id: "ev4a",
        title: "Collected",
        description: "Sample collection event for UI only.",
        location: "Chicago, US",
        timestamp: "2026-10-29T09:00:00.000Z",
        status: "COLLECTED",
        lat: 41.8781,
        lng: -87.6298
      },
      {
        id: "ev4",
        title: "Delivered",
        description: "Sample delivery completion event for UI only.",
        location: "Toronto, CA",
        timestamp: "2026-11-01T11:42:00.000Z",
        status: "DELIVERED",
        lat: 43.6532,
        lng: -79.3832
      }
    ]
  },
  {
    id: "shp_demo_3",
    trackingNumber: "NS-DEMO-100483",
    reference: "REF-IND-2403",
    origin: "Los Angeles, US",
    destination: "Singapore, SG",
    method: "Ocean Freight",
    bookingDate: "2026-11-10T08:00:00.000Z",
    estimatedDelivery: "2026-12-05T00:00:00.000Z",
    status: "CUSTOMS_PROCESSING",
    senderName: "Jordan Ellis",
    recipientName: "Aisha Tan",
    recipientEmail: "aisha.tan.demo@example.com",
    weightKg: 22,
    lengthCm: 60,
    widthCm: 40,
    heightCm: 40,
    declaredValueUsd: 980,
    packageDescription: "Apparel samples",
    currentLocation: "Destination customs (demo)",
    documents: [{ id: "doc_4", name: "Packing list (sample).pdf", type: "PACKING" }],
    deliveryInfo: null,
    events: [
      {
        id: "ev5a",
        title: "Departed origin",
        description: "Sample ocean departure for interface preview.",
        location: "Los Angeles, US",
        timestamp: "2026-11-11T08:00:00.000Z",
        status: "IN_TRANSIT",
        lat: 33.7405,
        lng: -118.271
      },
      {
        id: "ev5",
        title: "Customs processing",
        description: "Sample customs milestone for interface preview.",
        location: "Singapore, SG",
        timestamp: "2026-11-14T07:10:00.000Z",
        status: "CUSTOMS_PROCESSING",
        lat: 1.3644,
        lng: 103.9915
      }
    ]
  },
  {
    id: "shp_demo_4",
    trackingNumber: "NS-DEMO-100484",
    reference: "REF-IND-2404",
    origin: "Los Angeles, US",
    destination: "Denver, US",
    method: "Express / Road",
    bookingDate: "2026-11-15T16:30:00.000Z",
    estimatedDelivery: "2026-11-18T18:00:00.000Z",
    status: "PENDING",
    senderName: "Jordan Ellis",
    recipientName: "Casey Ng",
    recipientEmail: "casey.ng.demo@example.com",
    weightKg: 1.5,
    lengthCm: 25,
    widthCm: 18,
    heightCm: 10,
    declaredValueUsd: 75,
    packageDescription: "Personal effects",
    currentLocation: null,
    documents: [],
    deliveryInfo: null,
    events: [
      {
        id: "ev6",
        title: "Pending confirmation",
        description: "Demonstration shipment awaiting quotation confirmation / booking.",
        location: "Los Angeles, US",
        timestamp: "2026-11-15T16:30:00.000Z",
        status: "PENDING"
      }
    ]
  },
  {
    id: "shp_demo_5",
    trackingNumber: "NS-DEMO-100485",
    reference: "REF-IND-2405",
    origin: "Seattle, US",
    destination: "London, GB",
    method: "Air Freight",
    bookingDate: "2026-11-05T11:00:00.000Z",
    estimatedDelivery: "2026-11-09T15:00:00.000Z",
    status: "EXCEPTION",
    senderName: "Jordan Ellis",
    recipientName: "Owen Blake",
    recipientEmail: "owen.blake.demo@example.com",
    weightKg: 5.1,
    lengthCm: 35,
    widthCm: 25,
    heightCm: 18,
    declaredValueUsd: 300,
    packageDescription: "Spare parts",
    currentLocation: "Exception hold (demo)",
    documents: [],
    deliveryInfo: null,
    events: [
      {
        id: "ev7a",
        title: "In transit",
        description: "Sample linehaul before exception — demonstration only.",
        location: "Seattle, US",
        timestamp: "2026-11-06T14:00:00.000Z",
        status: "IN_TRANSIT",
        lat: 47.4502,
        lng: -122.3088
      },
      {
        id: "ev7",
        title: "Exception",
        description: "Sample exception state for UI — address clarification required.",
        location: "London gateway (demo)",
        timestamp: "2026-11-08T09:05:00.000Z",
        status: "EXCEPTION",
        lat: 51.47,
        lng: -0.4543
      }
    ]
  }
];

export const demoQuotes: DemoQuote[] = [
  {
    id: "quo_demo_1",
    reference: "QR-DEMO-8811",
    origin: "Los Angeles, US",
    destination: "Dubai, AE",
    method: "Air Freight",
    status: "UNDER_REVIEW",
    createdAt: "2026-11-12T09:00:00.000Z",
    notes: "Waiting for confirmed quotation from commercial team.",
    indicativeNote: "No fabricated final shipping charge is shown."
  },
  {
    id: "quo_demo_2",
    reference: "QR-DEMO-8812",
    origin: "Chicago, US",
    destination: "New York, US",
    method: "Road Transportation",
    status: "QUOTED",
    createdAt: "2026-11-08T13:20:00.000Z",
    notes: "Approved quotation available for review in demonstration UI.",
    indicativeNote: "Confirmed pricing is provided offline / via future secure booking APIs."
  },
  {
    id: "quo_demo_3",
    reference: "QR-DEMO-8813",
    origin: "Los Angeles, US",
    destination: "Singapore, SG",
    method: "Ocean Freight",
    status: "SUBMITTED",
    createdAt: "2026-11-16T08:45:00.000Z",
    notes: "Recently submitted quotation request.",
    indicativeNote: "Customer will receive a confirmed quotation."
  }
];

export const demoPickups: DemoPickup[] = [
  {
    id: "pkp_demo_1",
    shipmentReference: "REF-IND-2401",
    address: "1200 Demo Ave, Los Angeles, CA 90012",
    preferredDate: "2026-11-03",
    preferredTime: "09:00–12:00",
    contactPerson: "Jordan Ellis",
    phone: "+1 (310) 555-0142",
    instructions: "Call on arrival — lobby reception (demo).",
    status: "COMPLETED"
  },
  {
    id: "pkp_demo_2",
    shipmentReference: "REF-IND-2404",
    address: "1200 Demo Ave, Los Angeles, CA 90012",
    preferredDate: "2026-11-18",
    preferredTime: "13:00–17:00",
    contactPerson: "Jordan Ellis",
    phone: "+1 (310) 555-0142",
    instructions: "Leave with building concierge if unavailable.",
    status: "REQUESTED"
  }
];

export const demoAddresses: DemoAddress[] = [
  {
    id: "addr_demo_1",
    label: "Home (default sender)",
    category: "SENDER",
    name: "Jordan Ellis",
    line1: "1200 Demo Ave",
    city: "Los Angeles",
    country: "United States",
    postalCode: "90012",
    phone: "+1 (310) 555-0142",
    isDefault: true
  },
  {
    id: "addr_demo_2",
    label: "Mia Hartmann",
    category: "RECIPIENT",
    name: "Mia Hartmann",
    line1: "12 Musterstrasse",
    city: "Frankfurt",
    country: "Germany",
    postalCode: "60311",
    phone: "+49 69 555 0100",
    isDefault: false
  },
  {
    id: "addr_demo_3",
    label: "Parents — Denver",
    category: "RECIPIENT",
    name: "Casey Ng",
    line1: "88 Sample Road",
    city: "Denver",
    country: "United States",
    postalCode: "80202",
    phone: "+1 (303) 555-0199",
    isDefault: false
  }
];

export const demoInvoices: DemoInvoice[] = [
  {
    id: "inv_demo_1",
    number: "INV-DEMO-5001",
    shipmentReference: "REF-IND-2402",
    invoiceDate: "2026-11-01",
    dueDate: "2026-11-15",
    amountUsd: 86.5,
    currency: "USD",
    status: "PAID",
    arrangement: "PREPAID_INDIVIDUAL",
    lineItems: [
      { description: "Domestic road service (sample)", amountUsd: 72 },
      { description: "Fuel / handling surcharge (sample)", amountUsd: 14.5 }
    ]
  },
  {
    id: "inv_demo_2",
    number: "INV-DEMO-5002",
    shipmentReference: "REF-IND-2401",
    invoiceDate: "2026-11-04",
    dueDate: "2026-11-18",
    amountUsd: 214,
    currency: "USD",
    status: "ISSUED",
    arrangement: "PREPAID_INDIVIDUAL",
    lineItems: [{ description: "International air service (sample)", amountUsd: 214 }]
  }
];

export const demoPayments: DemoPayment[] = [
  {
    id: "pay_demo_1",
    transactionRef: "TXN-DEMO-9001",
    date: "2026-11-01T15:22:00.000Z",
    shipmentReference: "REF-IND-2402",
    method: "Card (demo)",
    amountUsd: 86.5,
    currency: "USD",
    status: "SUCCEEDED",
    arrangement: "PREPAID_INDIVIDUAL"
  },
  {
    id: "pay_demo_2",
    transactionRef: "TXN-DEMO-9002",
    date: "2026-11-05T10:05:00.000Z",
    shipmentReference: "REF-IND-2401",
    method: "Card (demo)",
    amountUsd: 214,
    currency: "USD",
    status: "PENDING",
    arrangement: "PREPAID_INDIVIDUAL"
  }
];

export const demoClaims: DemoClaim[] = [
  {
    id: "clm_demo_1",
    reference: "CLM-DEMO-301",
    category: "DELAYED",
    shipmentReference: "REF-IND-2405",
    status: "UNDER_REVIEW",
    createdAt: "2026-11-09T12:00:00.000Z",
    summary: "Sample delay claim for UI preview only.",
    documents: ["photos-sample.zip"]
  }
];

export const demoTickets: DemoSupportTicket[] = [
  {
    id: "tkt_demo_1",
    subject: "Question about customs documents (demo)",
    category: "Documentation",
    priority: "MEDIUM",
    status: "OPEN",
    createdAt: "2026-11-11T09:30:00.000Z",
    messages: [
      {
        id: "msg1",
        author: "CUSTOMER",
        body: "Sample customer message asking which commercial invoice fields are required.",
        at: "2026-11-11T09:30:00.000Z"
      },
      {
        id: "msg2",
        author: "SUPPORT",
        body: "Sample support reply explaining documentation checklist (demonstration only).",
        at: "2026-11-11T14:10:00.000Z"
      }
    ]
  }
];

export const demoNotifications: DemoNotification[] = [
  {
    id: "ntf_demo_1",
    title: "Shipment in transit (demo)",
    message: "NS-DEMO-100481 has a new demonstration timeline event.",
    createdAt: "2026-11-04T18:25:00.000Z",
    read: false,
    href: "/shipments/NS-DEMO-100481"
  },
  {
    id: "ntf_demo_2",
    title: "Quotation under review (demo)",
    message: "QR-DEMO-8811 is awaiting a confirmed quotation.",
    createdAt: "2026-11-12T09:05:00.000Z",
    read: true,
    href: "/saved-quotes"
  },
  {
    id: "ntf_demo_3",
    title: "Invoice issued (demo)",
    message: "INV-DEMO-5002 is available in the invoices list.",
    createdAt: "2026-11-04T11:00:00.000Z",
    read: false,
    href: "/billing"
  }
];

export type DemoRecipientPortal = {
  accessMode: "TOKEN_READY_ARCHITECTURE";
  tokenHint: string;
  trackingNumber: string;
  reference: string;
  status: ShipmentStatusCode;
  origin: string;
  destination: string;
  estimatedDelivery: string | null;
  recipientName: string;
  deliveryInstructions: string;
  exceptionMessage: string | null;
  collectionPoints: Array<{ id: string; name: string; address: string; hours: string }>;
  events: DemoTimelineEvent[];
  proofOfDelivery: { signedBy: string; capturedAt: string; notes: string } | null;
};

export const demoRecipientPortal: DemoRecipientPortal = {
  accessMode: "TOKEN_READY_ARCHITECTURE",
  tokenHint: "Future access will require a secure shipment token — not tracking number alone.",
  trackingNumber: "NS-DEMO-100482",
  reference: "REF-IND-2402",
  status: "DELIVERED",
  origin: "Chicago, US",
  destination: "Toronto, CA",
  estimatedDelivery: "2026-11-01T12:00:00.000Z",
  recipientName: "Sam Rivera",
  deliveryInstructions: "Leave with concierge if unavailable (sample preference).",
  exceptionMessage: null,
  collectionPoints: [
    {
      id: "cp1",
      name: "Downtown Collection Point (demo)",
      address: "100 Sample St, Toronto",
      hours: "Mon–Fri 09:00–18:00"
    },
    {
      id: "cp2",
      name: "Airport Locker Hub (demo)",
      address: "YYZ Demo Locker Bank",
      hours: "24/7"
    }
  ],
  events: demoShipments[1]!.events,
  proofOfDelivery: {
    signedBy: "S. Rivera",
    capturedAt: "2026-11-01T11:42:00.000Z",
    notes: "Sample POD preview for authorized recipient UI only."
  }
};

export function getDemoShipment(trackingOrId: string) {
  const key = trackingOrId.trim().toUpperCase();
  return (
    demoShipments.find((s) => s.trackingNumber.toUpperCase() === key || s.id.toUpperCase() === key) ?? null
  );
}

export function getDemoOverviewStats() {
  const total = demoShipments.length;
  const pending = demoShipments.filter((s) => s.status === "PENDING" || s.status === "BOOKED").length;
  const inTransit = demoShipments.filter((s) =>
    ["COLLECTED", "PROCESSING", "IN_TRANSIT", "CUSTOMS_PROCESSING", "OUT_FOR_DELIVERY"].includes(s.status)
  ).length;
  const delivered = demoShipments.filter((s) => s.status === "DELIVERED").length;
  const pendingQuotes = demoQuotes.filter((q) => q.status === "SUBMITTED" || q.status === "UNDER_REVIEW").length;
  return { total, pending, inTransit, delivered, pendingQuotes };
}
