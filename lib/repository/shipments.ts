import { isDatabaseConfigured, prisma } from "@/lib/db";
import { memoryStore, type MemoryShipment, type MemoryTrackingEvent } from "@/lib/repository/memory-store";
import {
  generateRecipientToken,
  generateTrackingNumber
} from "@/lib/tracking-number";
import {
  createLabel,
  estimateCarbonKg,
  estimateDutyTaxCents,
  getRates,
  placeToParty,
  schedulePickup
} from "@/lib/services/carriers";
import { defaultDocsChecklist, generateAndStoreCommercialInvoice } from "@/lib/services/customs-documents";
import { recordScreening, screenParty } from "@/lib/services/sanctions";
import { storeObject } from "@/lib/services/storage";
import { publishEvent, trackingChannel, adminOpsChannel } from "@/lib/services/realtime";
import { sendEmail } from "@/lib/services/email";
import { sendSms } from "@/lib/services/sms";
import type { ServiceType } from "@prisma/client";

export async function listShipments(filter?: { userId?: string; status?: string; q?: string }) {
  if (isDatabaseConfigured()) {
    try {
      return await prisma.shipment.findMany({
        where: {
          userId: filter?.userId,
          status: filter?.status as never,
          OR: filter?.q
            ? [
                { trackingNumber: { contains: filter.q, mode: "insensitive" } },
                { recipientName: { contains: filter.q, mode: "insensitive" } }
              ]
            : undefined
        },
        orderBy: { createdAt: "desc" },
        include: { events: { orderBy: { occurredAt: "desc" }, take: 5 } }
      });
    } catch {
      // fall through
    }
  }
  return memoryStore.shipments
    .filter((s) => (filter?.userId ? s.userId === filter.userId : true))
    .filter((s) => (filter?.status ? s.status === filter.status : true))
    .filter((s) => {
      if (!filter?.q) return true;
      const q = filter.q.toLowerCase();
      return (
        s.trackingNumber.toLowerCase().includes(q) ||
        (s.recipientName ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getShipmentByTracking(trackingNumber: string) {
  const id = trackingNumber.trim().toUpperCase();
  if (isDatabaseConfigured()) {
    try {
      return await prisma.shipment.findFirst({
        where: { trackingNumber: { equals: id, mode: "insensitive" } },
        include: {
          events: { orderBy: { occurredAt: "asc" } },
          documents: true,
          proofOfDelivery: true,
          exceptions: true
        }
      });
    } catch {
      // fall through
    }
  }
  const shipment = memoryStore.shipments.find((s) => s.trackingNumber.toUpperCase() === id);
  if (!shipment) return null;
  const events = memoryStore.events
    .filter((e) => e.shipmentId === shipment.id)
    .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  const documents = memoryStore.documents.filter((d) => d.shipmentId === shipment.id);
  return { ...shipment, events, documents, proofOfDelivery: null, exceptions: memoryStore.exceptions.filter((e) => e.shipmentId === shipment.id) };
}

export async function getShipmentByRecipientToken(token: string) {
  if (isDatabaseConfigured()) {
    try {
      return await prisma.shipment.findUnique({
        where: { recipientToken: token },
        include: { events: { orderBy: { occurredAt: "asc" } }, proofOfDelivery: true }
      });
    } catch {
      // fall through
    }
  }
  const shipment = memoryStore.shipments.find((s) => s.recipientToken === token);
  if (!shipment) return null;
  return {
    ...shipment,
    events: memoryStore.events.filter((e) => e.shipmentId === shipment.id),
    proofOfDelivery: memoryStore.proofOfDeliveries.find((p) => p.shipmentId === shipment.id) ?? null,
    recipientRequests: memoryStore.exceptions.filter(
      (e) => e.shipmentId === shipment.id && String(e.source ?? "") === "recipient"
    )
  };
}

export async function createQuote(input: {
  userId?: string;
  originCountry: string;
  originCity: string;
  destCountry: string;
  destCity: string;
  packageType?: string;
  weightKg: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  declaredValueCents?: number;
  commodity?: string;
  quantity?: number;
}) {
  const rates = await getRates({
    originCountry: input.originCountry,
    destCountry: input.destCountry,
    weightKg: input.weightKg,
    lengthCm: input.lengthCm,
    widthCm: input.widthCm,
    heightCm: input.heightCm,
    declaredValueCents: input.declaredValueCents
  });
  const dutyTaxEstimateCents = estimateDutyTaxCents(input.declaredValueCents ?? 0, input.destCountry);
  const quote = {
    id: `quo_${Date.now()}`,
    ...input,
    packageType: input.packageType ?? "BOX",
    rates,
    selectedService: null as string | null,
    amountCents: null as number | null,
    saved: false,
    dutyTaxEstimateCents,
    carbonKg: estimateCarbonKg(input.weightKg, "EXPRESS_AIR"),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  };
  memoryStore.quotes.push(quote);
  return quote;
}

export function listQuotes(filter?: { userId?: string; savedOnly?: boolean }) {
  return memoryStore.quotes
    .filter((q) => {
      const row = q as Record<string, unknown>;
      if (filter?.userId && row.userId !== filter.userId) return false;
      if (filter?.savedOnly && !row.saved) return false;
      return true;
    })
    .sort((a, b) => String((b as { createdAt?: string }).createdAt ?? "").localeCompare(String((a as { createdAt?: string }).createdAt ?? "")));
}

export function getQuoteById(id: string) {
  return memoryStore.quotes.find((q) => String((q as { id?: string }).id) === id) ?? null;
}

export function updateQuote(
  id: string,
  patch: { saved?: boolean; selectedService?: string; amountCents?: number; userId?: string }
) {
  const quote = getQuoteById(id) as Record<string, unknown> | null;
  if (!quote) return null;
  if (patch.saved != null) quote.saved = patch.saved;
  if (patch.selectedService != null) quote.selectedService = patch.selectedService;
  if (patch.amountCents != null) quote.amountCents = patch.amountCents;
  if (patch.userId != null) quote.userId = patch.userId;
  return quote;
}

export async function bookShipment(input: {
  userId?: string;
  guestEmail?: string;
  quoteId?: string;
  origin: string;
  destination: string;
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  deliveryInstructions?: string;
  weightKg: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  declaredValueCents?: number;
  commodity?: string;
  hsCode?: string;
  incoterms?: string;
  serviceType?: ServiceType | string;
  serviceCode?: string;
  carrier?: string;
  carrierId?: string;
  amountCents: number;
  currency?: string;
  promoCode?: string;
  insuranceCents?: number;
  hazmat?: boolean;
  batteries?: boolean;
  liquids?: boolean;
  signatureRequired?: boolean;
  costCenterCode?: string;
  schedulePickupWindow?: { start: string; end: string };
  payWithWallet?: boolean;
  paymentIntentId?: string;
  quantity?: number;
  labelProfileId?: string;
  skipSanctionsScreen?: boolean;
}) {
  const trackingNumber = generateTrackingNumber();
  const recipientToken = generateRecipientToken();
  const serviceType = (input.serviceType ?? "EXPRESS_AIR") as ServiceType;
  const shipFrom = placeToParty(input.origin, "Shipper", { phone: undefined });
  const shipTo = placeToParty(input.destination, input.recipientName, {
    phone: input.recipientPhone,
    email: input.recipientEmail
  });

  if (!input.skipSanctionsScreen) {
    const screening = await screenParty({
      name: input.recipientName,
      company: input.recipientName,
      country: shipTo.country,
      address: input.destination
    });
    recordScreening(null, screening, input.recipientName);
    if (!screening.cleared) {
      throw new Error(
        `Sanctions screening blocked this shipment: ${screening.hits.map((h) => h.reason).join("; ")}`
      );
    }
  }

  const label = await createLabel({
    trackingNumber,
    carrier: input.carrier,
    serviceCode: input.serviceCode,
    carrierId: input.carrierId,
    weightKg: input.weightKg,
    lengthCm: input.lengthCm,
    widthCm: input.widthCm,
    heightCm: input.heightCm,
    shipFrom,
    shipTo,
    insuranceCents: input.insuranceCents,
    labelProfileId: input.labelProfileId
  });

  let stored;
  if (label.labelPdfBase64) {
    stored = await storeObject({
      folder: "labels",
      body: Buffer.from(label.labelPdfBase64, "base64"),
      mimeType: "application/pdf",
      key: `labels/${trackingNumber}.pdf`
    });
  } else {
    stored = await storeObject({
      folder: "labels",
      body: label.labelZpl ?? trackingNumber,
      mimeType: "text/plain",
      key: `labels/${trackingNumber}.zpl`
    });
  }

  const now = new Date().toISOString();
  const shipment: MemoryShipment = {
    id: `shp_${Date.now()}`,
    trackingNumber,
    userId: input.userId ?? null,
    organizationId: null,
    status: "LABEL_CREATED",
    serviceType,
    carrier: input.carrier ?? "NecoShip",
    carrierShipmentId: label.carrierShipmentId,
    origin: input.origin,
    destination: input.destination,
    recipientName: input.recipientName,
    recipientPhone: input.recipientPhone ?? null,
    recipientEmail: input.recipientEmail ?? null,
    deliveryInstructions: input.deliveryInstructions ?? null,
    weightKg: input.weightKg,
    lengthCm: input.lengthCm ?? null,
    widthCm: input.widthCm ?? null,
    heightCm: input.heightCm ?? null,
    declaredValueCents: input.declaredValueCents ?? null,
    commodity: input.commodity ?? null,
    hsCode: input.hsCode ?? null,
    incoterms: input.incoterms ?? null,
    insuranceCents: input.insuranceCents ?? null,
    amountCents: input.amountCents,
    currency: input.currency ?? "USD",
    promoCode: input.promoCode ?? null,
    labelUrl: stored.url,
    labelZpl: label.labelZpl ?? null,
    eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    pickedUpAt: null,
    deliveredAt: null,
    recipientToken,
    isReturn: false,
    parentShipmentId: null,
    carbonKg: estimateCarbonKg(input.weightKg, serviceType),
    hazmat: Boolean(input.hazmat),
    batteries: Boolean(input.batteries),
    liquids: Boolean(input.liquids),
    signatureRequired: Boolean(input.signatureRequired),
    costCenterCode: input.costCenterCode ?? null,
    guestEmail: input.guestEmail ?? null,
    quoteId: input.quoteId ?? null,
    labelProvider: label.provider,
    createdAt: now,
    updatedAt: now
  };

  memoryStore.shipments.unshift(shipment);
  const event: MemoryTrackingEvent = {
    id: `evt_${Date.now()}`,
    shipmentId: shipment.id,
    status: "LABEL_CREATED",
    code: "LABEL",
    description:
      label.provider === "shipengine"
        ? "Carrier shipping label purchased"
        : "Shipping label created (local adapter)",
    location: input.origin,
    lat: null,
    lng: null,
    occurredAt: now
  };
  memoryStore.events.push(event);
  const labelFilename =
    stored.mimeType === "application/pdf" ? `${trackingNumber}.pdf` : `${trackingNumber}.zpl`;
  memoryStore.documents.push({
    id: `doc_${Date.now()}`,
    userId: input.userId ?? null,
    shipmentId: shipment.id,
    type: "SHIPPING_LABEL",
    filename: labelFilename,
    url: stored.url,
    createdAt: now
  });

  const intl = shipFrom.country.toUpperCase() !== shipTo.country.toUpperCase();
  if (intl) {
    const invoice = await generateAndStoreCommercialInvoice({
      trackingNumber,
      invoiceNumber: `CI-${trackingNumber}`,
      shipperName: shipFrom.name,
      shipperAddress: input.origin,
      consigneeName: input.recipientName,
      consigneeAddress: input.destination,
      commodity: input.commodity ?? "General merchandise",
      hsCode: input.hsCode,
      quantity: input.quantity ?? 1,
      weightKg: input.weightKg,
      declaredValueCents: input.declaredValueCents ?? input.amountCents,
      currency: input.currency ?? "USD",
      incoterms: input.incoterms ?? "DDP",
      originCountry: shipFrom.country,
      destCountry: shipTo.country
    });
    memoryStore.documents.push({
      id: `doc_ci_${Date.now()}`,
      userId: input.userId ?? null,
      shipmentId: shipment.id,
      type: "COMMERCIAL_INVOICE",
      filename: invoice.filename,
      url: invoice.url,
      createdAt: now
    });
    const checklist = defaultDocsChecklist(true);
    memoryStore.customs.push({
      id: `cus_${Date.now()}`,
      shipmentId: shipment.id,
      trackingNumber,
      status: "DOCS_PENDING",
      broker: "NecoShip Brokerage",
      brokerNotes: null,
      missingDocs: checklist.required.filter((d) => !checklist.received.includes(d)),
      docsChecklist: checklist,
      updatedAt: now
    });
  }

  if (input.quoteId) {
    updateQuote(input.quoteId, {
      selectedService: String(serviceType),
      amountCents: input.amountCents
    });
  }

  if (input.schedulePickupWindow) {
    const pickup = await schedulePickup({
      trackingNumber,
      windowStart: new Date(input.schedulePickupWindow.start),
      windowEnd: new Date(input.schedulePickupWindow.end),
      carrierShipmentId: label.carrierShipmentId
    });
    memoryStore.pickups.push({
      id: `pkp_${Date.now()}`,
      shipmentId: shipment.id,
      trackingNumber,
      scheduledStart: input.schedulePickupWindow.start,
      scheduledEnd: input.schedulePickupWindow.end,
      status: pickup.status,
      carrierPickupId: pickup.carrierPickupId,
      provider: pickup.provider
    });
  }

  if (isDatabaseConfigured()) {
    try {
      await prisma.shipment.create({
        data: {
          trackingNumber,
          userId: input.userId,
          status: "LABEL_CREATED",
          serviceType,
          carrier: shipment.carrier ?? undefined,
          carrierShipmentId: shipment.carrierShipmentId ?? undefined,
          recipientName: input.recipientName,
          recipientPhone: input.recipientPhone,
          recipientEmail: input.recipientEmail,
          deliveryInstructions: input.deliveryInstructions,
          weightKg: input.weightKg,
          lengthCm: input.lengthCm,
          widthCm: input.widthCm,
          heightCm: input.heightCm,
          declaredValueCents: input.declaredValueCents,
          commodity: input.commodity,
          hsCode: input.hsCode,
          incoterms: input.incoterms,
          insuranceCents: input.insuranceCents,
          amountCents: input.amountCents,
          currency: shipment.currency,
          promoCode: input.promoCode,
          labelUrl: stored.url,
          labelZpl: label.labelZpl,
          eta: shipment.eta ? new Date(shipment.eta) : undefined,
          recipientToken,
          carbonKg: shipment.carbonKg ?? undefined,
          hazmat: shipment.hazmat,
          batteries: shipment.batteries,
          liquids: shipment.liquids,
          signatureRequired: shipment.signatureRequired,
          events: {
            create: {
              status: "LABEL_CREATED",
              code: "LABEL",
              description: "Shipping label created",
              location: input.origin
            }
          }
        }
      });
    } catch {
      // memory already holds the shipment for local/demo
    }
  }

  await publishEvent(trackingChannel(trackingNumber), "status", {
    trackingNumber,
    status: shipment.status
  });
  await publishEvent(adminOpsChannel(), "shipment.created", { trackingNumber, status: shipment.status });

  const notifyEmail = input.recipientEmail ?? input.guestEmail;
  if (notifyEmail) {
    await sendEmail({
      to: notifyEmail,
      subject: `Your NecoShip shipment ${trackingNumber}`,
      html: `<p>Your shipment is booked. Track it at /tracking?id=${trackingNumber} or manage delivery at /recipient/${recipientToken}</p>`
    });
  }
  if (input.recipientPhone) {
    await sendSms({
      to: input.recipientPhone,
      body: `NecoShip: shipment ${trackingNumber} booked. Track: /tracking?id=${trackingNumber}`
    });
  }

  return shipment;
}

export async function addTrackingEvent(input: {
  trackingNumber: string;
  status?: string;
  description: string;
  location?: string;
  lat?: number;
  lng?: number;
}) {
  const shipment = await getShipmentByTracking(input.trackingNumber);
  if (!shipment) throw new Error("Shipment not found");
  const now = new Date().toISOString();
  const event: MemoryTrackingEvent = {
    id: `evt_${Date.now()}`,
    shipmentId: shipment.id,
    status: input.status ?? null,
    code: input.status ?? "UPDATE",
    description: input.description,
    location: input.location ?? null,
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    occurredAt: now
  };
  memoryStore.events.push(event);
  const mem = memoryStore.shipments.find((s) => s.id === shipment.id);
  if (mem && input.status) {
    mem.status = input.status;
    mem.updatedAt = now;
    if (input.status === "DELIVERED") mem.deliveredAt = now;
    if (input.status === "PICKED_UP") mem.pickedUpAt = now;
  }
  if (isDatabaseConfigured()) {
    try {
      await prisma.trackingEvent.create({
        data: {
          shipmentId: shipment.id,
          status: input.status as never,
          code: input.status,
          description: input.description,
          location: input.location,
          lat: input.lat,
          lng: input.lng
        }
      });
      if (input.status) {
        await prisma.shipment.update({
          where: { id: shipment.id },
          data: {
            status: input.status as never,
            deliveredAt: input.status === "DELIVERED" ? new Date() : undefined,
            pickedUpAt: input.status === "PICKED_UP" ? new Date() : undefined
          }
        });
      }
    } catch {
      // memory path already updated
    }
  }
  await publishEvent(trackingChannel(input.trackingNumber), "status", {
    trackingNumber: input.trackingNumber,
    status: input.status,
    description: input.description
  });
  return event;
}

export async function createReturnShipment(parentTrackingNumber: string, userId?: string) {
  const parent = await getShipmentByTracking(parentTrackingNumber);
  if (!parent) throw new Error("Parent shipment not found");
  const origin = "origin" in parent ? parent.destination : "";
  const destination = "origin" in parent ? parent.origin : "";
  return bookShipment({
    userId,
    origin: String(origin),
    destination: String(destination),
    recipientName: "Returns Desk",
    weightKg: Number(parent.weightKg ?? 1),
    amountCents: Math.round(Number(parent.amountCents ?? 2000) * 0.6),
    serviceType: parent.serviceType as ServiceType,
    carrier: parent.carrier ?? undefined
  }).then((shipment) => {
    const mem = memoryStore.shipments.find((s) => s.id === shipment.id);
    if (mem) {
      mem.isReturn = true;
      mem.parentShipmentId = parent.id;
    }
    return { ...shipment, isReturn: true, parentShipmentId: parent.id };
  });
}
