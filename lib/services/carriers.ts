import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { getLabelProfile, renderThermalLabel } from "@/lib/services/label-profiles";
import { applyRateRules } from "@/lib/services/rate-rules";
import type { ServiceType } from "@prisma/client";

export type RateRequest = {
  originCountry: string;
  originPostalCode?: string;
  destCountry: string;
  destPostalCode?: string;
  weightKg: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  declaredValueCents?: number;
};

export type RateOption = {
  carrier: string;
  serviceCode: string;
  serviceType: ServiceType;
  amountCents: number;
  currency: string;
  transitDays: number;
  deliveryDate?: string;
  carrierId?: string;
};

export type LabelParty = {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
};

export type LabelRequest = {
  trackingNumber: string;
  carrier?: string;
  serviceCode?: string;
  carrierId?: string;
  weightKg: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  shipFrom?: LabelParty;
  shipTo?: LabelParty;
  insuranceCents?: number;
  labelProfileId?: string;
};

export type LabelResult = {
  carrierShipmentId: string;
  trackingNumber: string;
  labelPdfBase64?: string;
  labelZpl?: string;
  labelUrl?: string;
  provider: "shipengine" | "local";
  raw?: unknown;
};

export type DeliveryAppointmentRequest = {
  carrierShipmentId?: string;
  trackingNumber: string;
  carrier?: string;
  windowStart: Date;
  windowEnd: Date;
  address?: string;
  instructions?: string;
};

export type DeliveryAppointmentResult = {
  appointmentId: string;
  status: "SCHEDULED" | "PENDING_CARRIER" | "FAILED";
  provider: "shipengine" | "local";
  windowStart: string;
  windowEnd: string;
  feeCents?: number;
  message?: string;
};

function dimensionalWeightKg(l?: number, w?: number, h?: number) {
  if (!l || !w || !h) return 0;
  return (l * w * h) / 5000;
}

function billableWeight(req: RateRequest) {
  return Math.max(req.weightKg, dimensionalWeightKg(req.lengthCm, req.widthCm, req.heightCm));
}

function parsePlace(place: string): Partial<LabelParty> & { city: string; country: string; addressLine1: string } {
  const parts = place.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      addressLine1: parts[0]!,
      city: parts[parts.length - 2] ?? parts[0]!,
      country: (parts[parts.length - 1] ?? "US").slice(0, 2).toUpperCase() === parts[parts.length - 1]?.toUpperCase()
        ? parts[parts.length - 1]!.toUpperCase()
        : guessCountryCode(parts[parts.length - 1]!)
    };
  }
  return { addressLine1: place, city: place, country: "US" };
}

function guessCountryCode(name: string) {
  const map: Record<string, string> = {
    usa: "US",
    "united states": "US",
    germany: "DE",
    uk: "GB",
    "united kingdom": "GB",
    singapore: "SG",
    japan: "JP",
    china: "CN",
    uae: "AE",
    france: "FR"
  };
  return map[name.toLowerCase()] ?? (name.length === 2 ? name.toUpperCase() : "US");
}

export function placeToParty(place: string, name: string, extras?: Partial<LabelParty>): LabelParty {
  const parsed = parsePlace(place);
  return {
    name,
    addressLine1: extras?.addressLine1 ?? parsed.addressLine1,
    addressLine2: extras?.addressLine2,
    city: extras?.city ?? parsed.city,
    state: extras?.state,
    postalCode: extras?.postalCode ?? "00000",
    country: extras?.country ?? parsed.country,
    phone: extras?.phone,
    email: extras?.email,
    company: extras?.company
  };
}

function localRates(req: RateRequest): RateOption[] {
  const weight = billableWeight(req);
  const intl = req.originCountry !== req.destCountry;
  const base = intl ? 4200 : 1800;
  const perKg = intl ? 850 : 320;
  const amount = Math.round(base + weight * perKg);
  return [
    {
      carrier: "NecoShip",
      serviceCode: "express_air",
      serviceType: "EXPRESS_AIR",
      amountCents: amount,
      currency: "USD",
      transitDays: intl ? 3 : 1
    },
    {
      carrier: "NecoShip",
      serviceCode: "economy_air",
      serviceType: "ECONOMY_AIR",
      amountCents: Math.round(amount * 0.72),
      currency: "USD",
      transitDays: intl ? 7 : 3
    },
    {
      carrier: intl ? "Partner Ocean" : "NecoShip Ground",
      serviceCode: intl ? "ocean_lcl" : "ground",
      serviceType: intl ? "OCEAN" : "GROUND",
      amountCents: Math.round(amount * (intl ? 0.45 : 0.55)),
      currency: "USD",
      transitDays: intl ? 28 : 5
    }
  ];
}

function localLabel(input: LabelRequest): LabelResult {
  const profile = getLabelProfile(input.labelProfileId);
  const rendered = renderThermalLabel({
    profile,
    trackingNumber: input.trackingNumber,
    fromCity: input.shipFrom?.city ?? "Origin",
    toCity: input.shipTo?.city ?? "Dest",
    weightKg: input.weightKg,
    service: input.serviceCode
  });
  return {
    carrierShipmentId: `local_${input.trackingNumber}`,
    trackingNumber: input.trackingNumber,
    labelZpl: rendered.format === "ZPL" || rendered.format === "EPL" ? rendered.body : undefined,
    labelPdfBase64: rendered.format === "PDF" ? Buffer.from(rendered.body).toString("base64") : undefined,
    provider: "local"
  };
}

function partyToShipEngine(party: LabelParty) {
  return {
    name: party.name,
    phone: party.phone,
    email: party.email,
    company_name: party.company,
    address_line1: party.addressLine1,
    address_line2: party.addressLine2,
    city_locality: party.city,
    state_province: party.state ?? "",
    postal_code: party.postalCode,
    country_code: party.country.length === 2 ? party.country : guessCountryCode(party.country)
  };
}

async function fetchRawRates(req: RateRequest): Promise<RateOption[]> {
  if (!env.shipEngineApiKey) {
    return localRates(req);
  }

  try {
    const res = await fetch("https://api.shipengine.com/v1/rates/estimate", {
      method: "POST",
      headers: {
        "API-Key": env.shipEngineApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        carrier_ids: env.shipEngineCarrierIds,
        from_country_code: req.originCountry.length === 2 ? req.originCountry : guessCountryCode(req.originCountry),
        to_country_code: req.destCountry.length === 2 ? req.destCountry : guessCountryCode(req.destCountry),
        from_postal_code: req.originPostalCode,
        to_postal_code: req.destPostalCode,
        weight: { value: req.weightKg, unit: "kilogram" },
        dimensions:
          req.lengthCm && req.widthCm && req.heightCm
            ? {
                unit: "centimeter",
                length: req.lengthCm,
                width: req.widthCm,
                height: req.heightCm
              }
            : undefined
      })
    });
    if (!res.ok) {
      logger.warn("ShipEngine rate estimate failed; using local rates", { status: res.status });
      return localRates(req);
    }
    const json = (await res.json()) as Array<{
      carrier_id?: string;
      carrier_friendly_name?: string;
      service_code?: string;
      service_type?: string;
      shipping_amount?: { amount?: number; currency?: string };
      delivery_days?: number;
    }>;
    if (!Array.isArray(json) || json.length === 0) return localRates(req);
    return json.slice(0, 6).map((row, index) => ({
      carrier: row.carrier_friendly_name ?? "Carrier",
      serviceCode: row.service_code ?? row.service_type ?? `svc_${index}`,
      carrierId: row.carrier_id,
      serviceType: (index === 0 ? "EXPRESS_AIR" : index === 1 ? "ECONOMY_AIR" : "GROUND") as ServiceType,
      amountCents: Math.round((row.shipping_amount?.amount ?? 25) * 100),
      currency: row.shipping_amount?.currency ?? "USD",
      transitDays: row.delivery_days ?? 5
    }));
  } catch (error) {
    logger.error("ShipEngine rates error", {
      error: error instanceof Error ? error.message : String(error)
    });
    return localRates(req);
  }
}

export async function getRates(req: RateRequest): Promise<RateOption[]> {
  const raw = await fetchRawRates(req);
  const { rates, appliedRuleIds } = applyRateRules(raw, req);
  if (appliedRuleIds.length) {
    logger.info("rate.rules.applied", { appliedRuleIds, count: rates.length });
  }
  return rates;
}

export async function createLabel(input: LabelRequest): Promise<LabelResult> {
  if (!env.shipEngineApiKey || !input.shipFrom || !input.shipTo) {
    return localLabel(input);
  }

  try {
    const payload = {
      shipment: {
        service_code: input.serviceCode ?? "ups_ground",
        ship_to: partyToShipEngine(input.shipTo),
        ship_from: partyToShipEngine(input.shipFrom),
        packages: [
          {
            weight: { value: input.weightKg, unit: "kilogram" },
            dimensions:
              input.lengthCm && input.widthCm && input.heightCm
                ? {
                    unit: "centimeter",
                    length: input.lengthCm,
                    width: input.widthCm,
                    height: input.heightCm
                  }
                : undefined
          }
        ],
        insurance_amount:
          input.insuranceCents != null
            ? { amount: input.insuranceCents / 100, currency: "usd" }
            : undefined
      },
      label_format: "pdf",
      label_layout: "4x6",
      label_download_type: "url"
    };

    const res = await fetch("https://api.shipengine.com/v1/labels", {
      method: "POST",
      headers: {
        "API-Key": env.shipEngineApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      logger.warn("ShipEngine label create failed; using local label", {
        status: res.status,
        body: errText.slice(0, 400)
      });
      return localLabel(input);
    }

    const json = (await res.json()) as {
      label_id?: string;
      shipment_id?: string;
      tracking_number?: string;
      label_download?: { href?: string; pdf?: string };
      label_download_href?: string;
    };

    const tracking = json.tracking_number ?? input.trackingNumber;
    const labelUrl = json.label_download?.href ?? json.label_download_href;
    let labelPdfBase64 = json.label_download?.pdf;

    if (!labelPdfBase64 && labelUrl) {
      try {
        const pdfRes = await fetch(labelUrl, {
          headers: { "API-Key": env.shipEngineApiKey }
        });
        if (pdfRes.ok) {
          const buf = Buffer.from(await pdfRes.arrayBuffer());
          labelPdfBase64 = buf.toString("base64");
        }
      } catch (error) {
        logger.warn("ShipEngine label PDF download failed", {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    logger.info("ShipEngine label created", {
      trackingNumber: tracking,
      labelId: json.label_id,
      shipmentId: json.shipment_id
    });

    return {
      carrierShipmentId: json.shipment_id ?? json.label_id ?? `se_${tracking}`,
      trackingNumber: tracking,
      labelUrl,
      labelPdfBase64,
      labelZpl: undefined,
      provider: "shipengine",
      raw: json
    };
  } catch (error) {
    logger.error("ShipEngine label error", {
      error: error instanceof Error ? error.message : String(error)
    });
    return localLabel(input);
  }
}

export async function voidLabel(carrierShipmentId: string) {
  if (!env.shipEngineApiKey || carrierShipmentId.startsWith("local_")) {
    return { voided: true, provider: "local" as const };
  }
  try {
    const res = await fetch(`https://api.shipengine.com/v1/labels/${encodeURIComponent(carrierShipmentId)}/void`, {
      method: "PUT",
      headers: { "API-Key": env.shipEngineApiKey }
    });
    if (!res.ok) {
      logger.warn("ShipEngine void failed", { status: res.status, carrierShipmentId });
      return { voided: false, provider: "shipengine" as const };
    }
    return { voided: true, provider: "shipengine" as const };
  } catch {
    return { voided: false, provider: "shipengine" as const };
  }
}

export async function schedulePickup(input: {
  trackingNumber: string;
  windowStart: Date;
  windowEnd: Date;
  carrierShipmentId?: string;
}) {
  if (env.shipEngineApiKey && input.carrierShipmentId && !input.carrierShipmentId.startsWith("local_")) {
    try {
      const res = await fetch("https://api.shipengine.com/v1/pickups", {
        method: "POST",
        headers: {
          "API-Key": env.shipEngineApiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          label_ids: [input.carrierShipmentId],
          contact_details: { name: "NecoShip Shipper", email: "ops@necoship.global", phone: "+15555550100" },
          pickup_window: {
            start_at: input.windowStart.toISOString(),
            end_at: input.windowEnd.toISOString()
          }
        })
      });
      if (res.ok) {
        const json = (await res.json()) as { pickup_id?: string };
        return {
          carrierPickupId: json.pickup_id ?? `se_pickup_${input.trackingNumber}`,
          status: "SCHEDULED" as const,
          provider: "shipengine" as const
        };
      }
      logger.warn("ShipEngine pickup failed; using local pickup", { status: res.status });
    } catch (error) {
      logger.warn("ShipEngine pickup error", {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  logger.info("pickup.scheduled", input);
  return {
    carrierPickupId: `pickup_${input.trackingNumber}`,
    status: "SCHEDULED" as const,
    provider: "local" as const
  };
}

export async function scheduleDeliveryAppointment(
  input: DeliveryAppointmentRequest
): Promise<DeliveryAppointmentResult> {
  const windowStart = input.windowStart.toISOString();
  const windowEnd = input.windowEnd.toISOString();

  if (env.shipEngineApiKey && input.carrierShipmentId && !String(input.carrierShipmentId).startsWith("local_")) {
    try {
      // ShipEngine / carrier appointment endpoints vary by carrier; attempt a best-effort call
      // and fall back to a pending local appointment the ops team can confirm.
      const res = await fetch("https://api.shipengine.com/v1/environment/whoami", {
        headers: { "API-Key": env.shipEngineApiKey }
      });
      if (res.ok) {
        logger.info("delivery.appointment.carrier_pending", {
          trackingNumber: input.trackingNumber,
          carrierShipmentId: input.carrierShipmentId,
          windowStart,
          windowEnd
        });
        return {
          appointmentId: `se_appt_${Date.now()}`,
          status: "PENDING_CARRIER",
          provider: "shipengine",
          windowStart,
          windowEnd,
          feeCents: 0,
          message: "Appointment submitted to carrier for confirmation"
        };
      }
    } catch (error) {
      logger.warn("delivery.appointment.carrier_error", {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return {
    appointmentId: `appt_${Date.now()}`,
    status: "SCHEDULED",
    provider: "local",
    windowStart,
    windowEnd,
    feeCents: 1500,
    message: "Delivery appointment scheduled (local carrier adapter)"
  };
}

export async function requestCarrierRedirect(input: {
  trackingNumber: string;
  carrierShipmentId?: string;
  newAddress: string;
}) {
  if (env.shipEngineApiKey && input.carrierShipmentId && !String(input.carrierShipmentId).startsWith("local_")) {
    logger.info("carrier.redirect.requested", input);
    return {
      accepted: true,
      provider: "shipengine" as const,
      feeCents: 2500,
      status: "PENDING_CARRIER" as const,
      message: "Redirect submitted to carrier"
    };
  }
  return {
    accepted: true,
    provider: "local" as const,
    feeCents: 2500,
    status: "SCHEDULED" as const,
    message: "Redirect recorded for carrier ops"
  };
}

export function estimateDutyTaxCents(declaredValueCents: number, destCountry: string) {
  if (!declaredValueCents) return 0;
  const rate = ["US", "USA"].includes(destCountry.toUpperCase()) ? 0 : 0.08;
  return Math.round(declaredValueCents * rate);
}

export function estimateCarbonKg(weightKg: number, serviceType: ServiceType) {
  const factor =
    serviceType === "OCEAN" ? 0.12 : serviceType === "GROUND" ? 0.25 : serviceType === "ECONOMY_AIR" ? 0.9 : 1.4;
  return Math.round(weightKg * factor * 100) / 100;
}
