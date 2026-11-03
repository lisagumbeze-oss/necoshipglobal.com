import { memoryStore } from "@/lib/repository/memory-store";

const globalFlag = globalThis as unknown as { __necoshipDemoSeeded?: boolean; __necoshipUserSeeded?: Set<string> };

function userSeeded() {
  if (!globalFlag.__necoshipUserSeeded) globalFlag.__necoshipUserSeeded = new Set();
  return globalFlag.__necoshipUserSeeded;
}

/** One-time global ops/catalog fixtures (admin + shared). */
export function ensureGlobalDemoData() {
  if (globalFlag.__necoshipDemoSeeded) return;
  globalFlag.__necoshipDemoSeeded = true;

  if (memoryStore.shipments.length === 0) {
    const now = new Date().toISOString();
    const demos = [
      {
        trackingNumber: "TRK-2026-9481132",
        origin: "Los Angeles, USA",
        destination: "Frankfurt, Germany",
        serviceType: "EXPRESS_AIR",
        status: "IN_TRANSIT",
        amountCents: 14600,
        recipientName: "Mia Hartmann"
      },
      {
        trackingNumber: "TRK-2026-7741",
        origin: "Dubai, UAE",
        destination: "London, UK",
        serviceType: "ECONOMY_AIR",
        status: "CUSTOMS_HOLD",
        amountCents: 11900,
        recipientName: "Finley Brooks"
      },
      {
        trackingNumber: "TRK-2026-1142",
        origin: "Seattle, USA",
        destination: "Denver, USA",
        serviceType: "GROUND",
        status: "EXCEPTION",
        amountCents: 5200,
        recipientName: "Lila Gomez"
      },
      {
        trackingNumber: "TRK-2026-2213",
        origin: "Tokyo, Japan",
        destination: "Singapore",
        serviceType: "EXPRESS_AIR",
        status: "DELIVERED",
        amountCents: 13200,
        recipientName: "Ravi Menon"
      },
      {
        trackingNumber: "TRK-2026-8859",
        origin: "Shanghai, China",
        destination: "Los Angeles, USA",
        serviceType: "OCEAN",
        status: "OUT_FOR_DELIVERY",
        amountCents: 89000,
        recipientName: "Pacific Imports LLC"
      }
    ];
    demos.forEach((d, i) => {
      memoryStore.shipments.push({
        id: `shp_demo_${i + 1}`,
        trackingNumber: d.trackingNumber,
        userId: null,
        organizationId: null,
        status: d.status,
        serviceType: d.serviceType,
        carrier: "NecoShip",
        carrierShipmentId: null,
        origin: d.origin,
        destination: d.destination,
        recipientName: d.recipientName,
        recipientPhone: null,
        recipientEmail: null,
        deliveryInstructions: null,
        weightKg: 10 + i,
        lengthCm: null,
        widthCm: null,
        heightCm: null,
        declaredValueCents: 50000,
        commodity: "General",
        hsCode: null,
        incoterms: "DDP",
        insuranceCents: null,
        amountCents: d.amountCents,
        currency: "USD",
        promoCode: null,
        labelUrl: null,
        labelZpl: null,
        eta: new Date(Date.now() + 86400000 * (i + 1)).toISOString(),
        pickedUpAt: null,
        deliveredAt: d.status === "DELIVERED" ? now : null,
        recipientToken: `rcpt_demo_${i + 1}`,
        isReturn: false,
        parentShipmentId: null,
        carbonKg: 2.4,
        hazmat: false,
        batteries: false,
        liquids: false,
        signatureRequired: false,
        costCenterCode: null,
        createdAt: now,
        updatedAt: now
      });
    });
  }

  if (!memoryStore.customers.length) {
    memoryStore.customers = [
      {
        id: "cus_neotrade",
        name: "NeoTrade GmbH",
        type: "Enterprise",
        country: "Germany",
        joinDate: "2024-03-12",
        totalShipments: 842,
        totalRevenueUsd: 482900,
        status: "Active",
        email: "ops@neotrade.de"
      },
      {
        id: "cus_cascade",
        name: "Cascade Labs",
        type: "Business",
        country: "USA",
        joinDate: "2025-01-08",
        totalShipments: 126,
        totalRevenueUsd: 68400,
        status: "Active",
        email: "shipping@cascadelabs.com"
      },
      {
        id: "cus_atlas",
        name: "Atlas Retail",
        type: "Business",
        country: "UK",
        joinDate: "2024-11-02",
        totalShipments: 310,
        totalRevenueUsd: 151200,
        status: "Suspended",
        email: "logistics@atlasretail.co.uk"
      },
      {
        id: "cus_northline",
        name: "Northline Parts",
        type: "Individual",
        country: "USA",
        joinDate: "2025-06-19",
        totalShipments: 44,
        totalRevenueUsd: 18220,
        status: "Active",
        email: "parts@northline.io"
      }
    ];
  }

  if (memoryStore.exceptions.length === 0) {
    memoryStore.exceptions.push(
      {
        id: "exc_001",
        shipmentId: "shp_demo_3",
        trackingNumber: "TRK-2026-1142",
        type: "Address Issue",
        priority: "High",
        region: "US",
        assignee: "Unassigned",
        raisedAt: "Apr 22, 2026 06:30 UTC",
        slaMinutes: 240,
        notes: "Recipient address incomplete"
      },
      {
        id: "exc_002",
        shipmentId: "shp_demo_2",
        trackingNumber: "TRK-2026-7741",
        type: "Customs Hold",
        priority: "Critical",
        region: "EU",
        assignee: "Unassigned",
        raisedAt: "Apr 22, 2026 10:15 UTC",
        slaMinutes: 120,
        notes: "Commercial invoice missing HS codes"
      },
      {
        id: "exc_003",
        shipmentId: "shp_demo_1",
        trackingNumber: "TRK-2026-9481132",
        type: "Carrier Delay",
        priority: "Normal",
        region: "EU",
        assignee: "Jordan Lee",
        raisedAt: "Apr 21, 2026 18:40 UTC",
        slaMinutes: 480,
        notes: "Weather diversion via AMS"
      }
    );
  }

  if (memoryStore.customs.length === 0) {
    memoryStore.customs.push(
      {
        id: "cus_q_1",
        shipmentId: "shp_demo_2",
        trackingNumber: "TRK-2026-7741",
        status: "DOCS_PENDING",
        broker: "NecoShip Brokerage",
        missingDocs: ["Commercial Invoice", "Packing List"],
        updatedAt: new Date().toISOString()
      },
      {
        id: "cus_q_2",
        shipmentId: "shp_demo_1",
        trackingNumber: "TRK-2026-9481132",
        status: "UNDER_REVIEW",
        broker: "EU Clear Partners",
        missingDocs: [],
        updatedAt: new Date().toISOString()
      }
    );
  }

  if (memoryStore.drivers.length === 0) {
    memoryStore.drivers.push(
      { id: "drv_1", name: "Alex Rivera", region: "LAX", status: "On Duty", assignments: 3, rating: 4.9 },
      { id: "drv_2", name: "Sam Okonkwo", region: "JFK", status: "Off Duty", assignments: 0, rating: 4.7 },
      { id: "drv_3", name: "Priya Shah", region: "ORD", status: "On Duty", assignments: 2, rating: 4.8 }
    );
  }

  if (!(memoryStore as { staff?: unknown[] }).staff?.length) {
    (memoryStore as { staff?: Array<Record<string, unknown>> }).staff = [
      { id: "stf_1", name: "Jordan Lee", email: "jordan@necoship.global", role: "Operations Manager", lastLogin: "Apr 22, 2026", status: "Active" },
      { id: "stf_2", name: "Casey Ng", email: "casey@necoship.global", role: "Customer Support Agent", lastLogin: "Apr 22, 2026", status: "Active" },
      { id: "stf_3", name: "Morgan Diaz", email: "morgan@necoship.global", role: "Customs Officer", lastLogin: "Apr 21, 2026", status: "Active" }
    ];
    (memoryStore as { staffRoles?: Array<Record<string, unknown>> }).staffRoles = [
      { id: "role_ops", name: "Operations Manager", permissions: ["shipments", "exceptions", "drivers", "warehouse"] },
      { id: "role_support", name: "Customer Support Agent", permissions: ["tickets", "customers:read", "shipments:read"] },
      { id: "role_customs", name: "Customs Officer", permissions: ["customs", "documents", "shipments:read"] },
      { id: "role_finance", name: "Finance", permissions: ["finance", "refunds", "rate-cards"] }
    ];
    (memoryStore as { staffActivity?: Array<Record<string, unknown>> }).staffActivity = [
      { id: "act_1", staffName: "Jordan Lee", action: "Assigned exception exc_003", createdAt: "Apr 22, 09:12 UTC" },
      { id: "act_2", staffName: "Casey Ng", action: "Replied to TCK-10018", createdAt: "Apr 22, 09:15 UTC" },
      { id: "act_3", staffName: "Morgan Diaz", action: "Moved TRK-2026-7741 to docs pending", createdAt: "Apr 22, 10:18 UTC" }
    ];
  }

  if (!(memoryStore as { liveOps?: unknown[] }).liveOps?.length) {
    (memoryStore as { liveOps?: Array<Record<string, unknown>> }).liveOps = [
      { id: "TRK-2026-3401", serviceType: "Express Air", carrier: "DHL", region: "EU", route: "LAX -> FRA", status: "In Transit" },
      { id: "TRK-2026-7741", serviceType: "Economy Air", carrier: "UPS", region: "EU", route: "DXB -> LHR", status: "Customs Hold" },
      { id: "TRK-2026-1142", serviceType: "Ground", carrier: "USPS", region: "US", route: "SEA -> DEN", status: "Exception" },
      { id: "TRK-2026-2213", serviceType: "Express Air", carrier: "FedEx", region: "APAC", route: "NRT -> SIN", status: "Delivered" },
      { id: "TRK-2026-8859", serviceType: "Ocean", carrier: "Maersk", region: "APAC", route: "SHA -> LAX", status: "Out for Delivery" }
    ];
  }

  if (!(memoryStore as { apiUsage?: unknown[] }).apiUsage?.length) {
    (memoryStore as { apiUsage?: Array<{ day: string; calls: number }> }).apiUsage = [
      { day: "Apr 16", calls: 1220 },
      { day: "Apr 17", calls: 1380 },
      { day: "Apr 18", calls: 1540 },
      { day: "Apr 19", calls: 1100 },
      { day: "Apr 20", calls: 1720 },
      { day: "Apr 21", calls: 1910 },
      { day: "Apr 22", calls: 2040 }
    ];
  }

  if (!(memoryStore as { spendSeries?: unknown[] }).spendSeries?.length) {
    (memoryStore as { spendSeries?: Array<{ month: string; spendUsd: number }> }).spendSeries = [
      { month: "Nov", spendUsd: 21400 },
      { month: "Dec", spendUsd: 24800 },
      { month: "Jan", spendUsd: 27150 },
      { month: "Feb", spendUsd: 22600 },
      { month: "Mar", spendUsd: 30210 },
      { month: "Apr", spendUsd: 28940 }
    ];
  }

  if (memoryStore.systemLogs.length === 0) {
    memoryStore.systemLogs.push(
      { id: "syslog_1", level: "info", source: "auth", message: "Admin login success", createdAt: new Date().toISOString() },
      { id: "syslog_2", level: "warn", source: "carriers", message: "DHL latency elevated", createdAt: new Date().toISOString() },
      { id: "syslog_3", level: "info", source: "billing", message: "Stripe webhook received", createdAt: new Date().toISOString() }
    );
  }

  if (memoryStore.blogPosts.length === 0) {
    memoryStore.blogPosts.push(
      {
        id: "post_1",
        slug: "customs-checklist-2026",
        title: "2026 Customs Checklist for Exporters",
        excerpt: "Docs, HS codes, and Incoterms that clear faster.",
        category: "Customs Guides",
        status: "published",
        publishedAt: "2026-04-10"
      },
      {
        id: "post_2",
        slug: "dimensional-weight-guide",
        title: "Dimensional Weight Explained",
        excerpt: "How billable weight affects your quote.",
        category: "Shipping Tips",
        status: "draft",
        publishedAt: null
      }
    );
  }

  if (!(memoryStore as { apiLogs?: unknown[] }).apiLogs?.length) {
    (memoryStore as { apiLogs?: Array<Record<string, unknown>> }).apiLogs = [
      { id: "apilog_1", method: "POST", path: "/v1/shipments", status: 201, latencyMs: 182, at: "Apr 22, 11:01 UTC" },
      { id: "apilog_2", method: "GET", path: "/v1/tracking", status: 200, latencyMs: 64, at: "Apr 22, 11:05 UTC" },
      { id: "apilog_3", method: "POST", path: "/v1/rates", status: 429, latencyMs: 21, at: "Apr 22, 11:08 UTC" }
    ];
    (memoryStore as { webhookLogs?: Array<Record<string, unknown>> }).webhookLogs = [
      { id: "whlog_1", event: "shipment.status.updated", target: "https://example.com/hooks", success: true, attempts: 1, at: "Apr 22, 11:06 UTC" },
      { id: "whlog_2", event: "shipment.delivered", target: "https://example.com/hooks", success: false, attempts: 3, at: "Apr 22, 10:44 UTC" }
    ];
  }

  if (memoryStore.carrierInvoices.length === 0) {
    memoryStore.carrierInvoices.push(
      { id: "cinv_1", carrier: "DHL", invoiceNumber: "DHL-9921", amountCents: 420000, matched: true, varianceCents: 0 },
      { id: "cinv_2", carrier: "UPS", invoiceNumber: "UPS-4410", amountCents: 188500, matched: false, varianceCents: 2400 }
    );
  }
}

/** Per-user fixtures so authenticated shipper pages have data. */
export function ensureUserDemoData(userId: string) {
  ensureGlobalDemoData();
  const seeded = userSeeded();
  if (seeded.has(userId)) return;
  seeded.add(userId);

  // Attach orphan demo shipments to this user for dashboard realism
  memoryStore.shipments.forEach((s) => {
    if (!s.userId) s.userId = userId;
  });

  if (!memoryStore.addresses.some((a) => a.userId === userId)) {
    memoryStore.addresses.push(
      {
        id: `addr_${userId}_1`,
        userId,
        name: "Mia Hartmann",
        company: "Klein & Co.",
        country: "Germany",
        city: "Frankfurt",
        line1: "Taunusanlage 12",
        postalCode: "60325",
        phone: "+49 69 555 0101",
        isDefault: true
      },
      {
        id: `addr_${userId}_2`,
        userId,
        name: "Ravi Menon",
        company: "Menon Trading",
        country: "Singapore",
        city: "Singapore",
        line1: "10 Changi Business Park",
        postalCode: "486030",
        phone: "+65 6555 0102",
        isDefault: false
      },
      {
        id: `addr_${userId}_3`,
        userId,
        name: "Pacific Imports LLC",
        company: "Pacific Imports LLC",
        country: "USA",
        city: "Los Angeles",
        line1: "245 Harbor Blvd",
        postalCode: "90731",
        phone: "+1 (310) 555-0123",
        isDefault: false
      }
    );
  }

  if (!memoryStore.invoices.some((i) => i.userId === userId)) {
    memoryStore.invoices.push(
      {
        id: `inv_${userId}_1`,
        number: "INV-80412",
        userId,
        status: "PAID",
        amountCents: 1498000,
        currency: "USD",
        dueAt: null,
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: `inv_${userId}_2`,
        number: "INV-80413",
        userId,
        status: "DUE",
        amountCents: 234000,
        currency: "USD",
        dueAt: new Date(Date.now() + 3 * 86400000).toISOString(),
        paidAt: null,
        createdAt: new Date().toISOString()
      },
      {
        id: `inv_${userId}_3`,
        number: "INV-80414",
        userId,
        status: "OVERDUE",
        amountCents: 612000,
        currency: "USD",
        dueAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        paidAt: null,
        createdAt: new Date().toISOString()
      }
    );
  }

  if (!memoryStore.notifications.some((n) => n.userId === userId)) {
    memoryStore.notifications.push(
      {
        id: `ntf_${userId}_1`,
        userId,
        category: "Shipment Updates",
        title: "Customs hold requires documents",
        message: "TRK-2026-7741 is on Customs Hold. Upload invoice + packing list to clear faster.",
        href: "/shipments/TRK-2026-7741",
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: `ntf_${userId}_2`,
        userId,
        category: "Billing",
        title: "Invoice due soon",
        message: "INV-80413 is due in 3 days. Pay now to avoid service interruption.",
        href: "/billing",
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: `ntf_${userId}_3`,
        userId,
        category: "System",
        title: "New security option available",
        message: "Enable two-factor authentication for better account protection.",
        href: "/settings",
        read: true,
        createdAt: new Date().toISOString()
      }
    );
  }

  if (!memoryStore.documents.some((d) => d.userId === userId)) {
    memoryStore.documents.push(
      {
        id: `doc_${userId}_1`,
        userId,
        shipmentId: "shp_demo_1",
        type: "COMMERCIAL_INVOICE",
        filename: "commercial-invoice.pdf",
        url: "#",
        createdAt: new Date().toISOString()
      },
      {
        id: `doc_${userId}_2`,
        userId,
        shipmentId: "shp_demo_5",
        type: "BILL_OF_LADING",
        filename: "bill-of-lading.pdf",
        url: "#",
        createdAt: new Date().toISOString()
      },
      {
        id: `doc_${userId}_3`,
        userId,
        shipmentId: "shp_demo_2",
        type: "CUSTOMS_FORM",
        filename: "customs-declaration.pdf",
        url: "#",
        createdAt: new Date().toISOString()
      },
      {
        id: `doc_${userId}_4`,
        userId,
        shipmentId: "shp_demo_4",
        type: "DELIVERY_CONFIRMATION",
        filename: "proof-of-delivery.pdf",
        url: "#",
        createdAt: new Date().toISOString()
      }
    );
  }

  if (!memoryStore.tickets.some((t) => t.userId === userId)) {
    const now = new Date().toISOString();
    memoryStore.tickets.push(
      {
        id: `tkt_${userId}_1`,
        number: "TCK-10021",
        userId,
        assigneeId: null,
        shipmentId: "shp_demo_2",
        subject: "Customs hold document request",
        status: "Open",
        priority: 1,
        createdAt: now,
        updatedAt: now,
        messages: [{ id: "msg1", authorId: userId, body: "Need help clearing customs hold.", isInternal: false, createdAt: now }]
      },
      {
        id: `tkt_${userId}_2`,
        number: "TCK-10018",
        userId,
        assigneeId: null,
        shipmentId: null,
        subject: "Invoice question for April charges",
        status: "In Progress",
        priority: 2,
        createdAt: now,
        updatedAt: now,
        messages: [{ id: "msg2", authorId: userId, body: "Can you break down fuel surcharge?", isInternal: false, createdAt: now }]
      },
      {
        id: `tkt_${userId}_3`,
        number: "TCK-10012",
        userId,
        assigneeId: null,
        shipmentId: "shp_demo_3",
        subject: "Delivery exception — address mismatch",
        status: "Resolved",
        priority: 2,
        createdAt: now,
        updatedAt: now,
        messages: [{ id: "msg3", authorId: userId, body: "Address corrected.", isInternal: false, createdAt: now }]
      }
    );
  }

  if (!memoryStore.apiKeys.some((k) => k.userId === userId)) {
    memoryStore.apiKeys.push(
      {
        id: `key_${userId}_1`,
        userId,
        name: "Production",
        keyHash: "hash_live",
        prefix: "nsk_live_",
        createdAt: "2026-03-02T00:00:00.000Z",
        lastUsedAt: new Date().toISOString(),
        revokedAt: null
      },
      {
        id: `key_${userId}_2`,
        userId,
        name: "Staging",
        keyHash: "hash_test",
        prefix: "nsk_test_",
        createdAt: "2026-02-10T00:00:00.000Z",
        lastUsedAt: null,
        revokedAt: null
      }
    );
  }

  if (!memoryStore.webhookEndpoints.some((w) => w.userId === userId)) {
    memoryStore.webhookEndpoints.push({
      id: `wh_${userId}_1`,
      userId,
      url: "https://example.com/webhooks/necoship",
      secret: "whsec_demo_secret",
      events: ["shipment.created", "shipment.status.updated", "shipment.delivered", "billing.invoice.due"],
      active: true
    });
  }

  const wallets = ((memoryStore as { wallets?: Record<string, number> }).wallets ??= {});
  if (wallets[userId] == null) wallets[userId] = 1250000;

  const settings = ((memoryStore as { accountSettings?: Record<string, Record<string, unknown>> }).accountSettings ??=
    {});
  if (!settings[userId]) {
    settings[userId] = {
      autoPay: true,
      defaultPaymentMethod: "card",
      preferredUnits: "metric",
      language: "en",
      timezone: "UTC"
    };
  }
}
