"use client";

import { createContext, useContext, useMemo } from "react";
import { CURRENCIES, formatMoney, t, type CurrencyCode, type Locale } from "@/lib/i18n/messages";

type I18nValue = {
  locale: Locale;
  currency: CurrencyCode;
  t: (key: string) => string;
  money: (amount: number, currencyOverride?: string) => string;
};

const I18nContext = createContext<I18nValue>({
  locale: "en",
  currency: "USD",
  t: (key) => t("en", key),
  money: (amount, c) => formatMoney(amount, c ?? "USD", "en")
});

export function I18nProvider({
  locale = "en",
  currency = "USD",
  children
}: {
  locale?: string;
  currency?: string;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nValue>(() => {
    const loc = (["en", "de", "fr", "es"].includes(locale) ? locale : "en") as Locale;
    const cur = (CURRENCIES.includes(currency as CurrencyCode) ? currency : "USD") as CurrencyCode;
    return {
      locale: loc,
      currency: cur,
      t: (key: string) => t(loc, key),
      money: (amount: number, currencyOverride?: string) => formatMoney(amount, currencyOverride ?? cur, loc)
    };
  }, [locale, currency]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
