export type Locale = "en" | "de" | "fr" | "es";

export const LOCALES: Array<{ code: Locale; label: string }> = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" }
];

export const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AED"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

/** Approximate FX vs USD for display conversion (demo). */
export const FX_TO_USD: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  CAD: 0.74,
  AED: 0.27
};

const catalogs: Record<Locale, Record<string, string>> = {
  en: {
    "nav.overview": "Overview",
    "nav.shipments": "My Shipments",
    "nav.create": "Create Shipment",
    "nav.billing": "Billing",
    "nav.settings": "Settings",
    "settings.language": "Language",
    "settings.currency": "Currency",
    "settings.saved": "Settings saved",
    "compliance.export": "Export my data",
    "compliance.delete": "Delete my account",
    "quote.title": "Get a Quote",
    "common.loading": "Loading…"
  },
  de: {
    "nav.overview": "Übersicht",
    "nav.shipments": "Meine Sendungen",
    "nav.create": "Sendung erstellen",
    "nav.billing": "Abrechnung",
    "nav.settings": "Einstellungen",
    "settings.language": "Sprache",
    "settings.currency": "Währung",
    "settings.saved": "Einstellungen gespeichert",
    "compliance.export": "Meine Daten exportieren",
    "compliance.delete": "Konto löschen",
    "quote.title": "Angebot anfordern",
    "common.loading": "Laden…"
  },
  fr: {
    "nav.overview": "Aperçu",
    "nav.shipments": "Mes envois",
    "nav.create": "Créer un envoi",
    "nav.billing": "Facturation",
    "nav.settings": "Paramètres",
    "settings.language": "Langue",
    "settings.currency": "Devise",
    "settings.saved": "Paramètres enregistrés",
    "compliance.export": "Exporter mes données",
    "compliance.delete": "Supprimer mon compte",
    "quote.title": "Obtenir un devis",
    "common.loading": "Chargement…"
  },
  es: {
    "nav.overview": "Resumen",
    "nav.shipments": "Mis envíos",
    "nav.create": "Crear envío",
    "nav.billing": "Facturación",
    "nav.settings": "Ajustes",
    "settings.language": "Idioma",
    "settings.currency": "Moneda",
    "settings.saved": "Ajustes guardados",
    "compliance.export": "Exportar mis datos",
    "compliance.delete": "Eliminar mi cuenta",
    "quote.title": "Obtener cotización",
    "common.loading": "Cargando…"
  }
};

export function t(locale: Locale | string, key: string) {
  const loc = (["en", "de", "fr", "es"].includes(locale) ? locale : "en") as Locale;
  return catalogs[loc][key] ?? catalogs.en[key] ?? key;
}

export function formatMoney(amount: number, currency: string = "USD", locale: string = "en") {
  const localeTag = locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US";
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2
  }).format(amount);
}

export function convertFromUsd(amountUsd: number, currency: CurrencyCode | string) {
  const rate = FX_TO_USD[(currency as CurrencyCode) ?? "USD"] ?? 1;
  return amountUsd / rate;
}

export function convertToUsd(amount: number, currency: CurrencyCode | string) {
  const rate = FX_TO_USD[(currency as CurrencyCode) ?? "USD"] ?? 1;
  return amount * rate;
}
