"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { en } from "@/lib/i18n/en";
import { ms } from "@/lib/i18n/ms";
import { zhCN } from "@/lib/i18n/zh-CN";
import {
  DEFAULT_LOCALE,
  LOCALE_HTML_LANG,
  type Locale,
  type Messages,
} from "@/lib/i18n/types";

const dictionaries: Record<Locale, Messages> = {
  en,
  "zh-CN": zhCN,
  ms,
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  setLocale,
  children,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale] ?? en,
    }),
    [locale, setLocale],
  );

  useEffect(() => {
    document.documentElement.lang = LOCALE_HTML_LANG[locale];
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => undefined,
      t: en,
    };
  }
  return ctx;
}

export function useMessages(): Messages {
  return useLocale().t;
}

/** Replace `{key}` placeholders in a message template. */
export function formatMessage(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}

export { DEFAULT_LOCALE };
export type { Locale, Messages };
