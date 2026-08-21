import * as React from "react";
import { FRAMEWORK_MESSAGES, type FrameworkLocale } from "@/lib/framework-messages";

type MessageValues = Record<string, string | number>;

interface I18nContextValue {
  locale: FrameworkLocale;
  t: (key: string, values?: MessageValues) => string;
}

const interpolate = (message: string, values?: MessageValues) =>
  message.replace(/\{(\w+)\}/g, (_, name: string) => String(values?.[name] ?? `{${name}}`));

const fallback: I18nContextValue = {
  locale: "en",
  t: (key, values) =>
    interpolate(FRAMEWORK_MESSAGES.en[key as keyof typeof FRAMEWORK_MESSAGES.en] ?? key, values),
};

const I18nContext = React.createContext<I18nContextValue>(fallback);

export function I18nProvider({
  locale = "zh-CN",
  children,
}: {
  locale?: FrameworkLocale;
  children: React.ReactNode;
}) {
  const value = React.useMemo<I18nContextValue>(() => {
    const messages = FRAMEWORK_MESSAGES[locale] ?? FRAMEWORK_MESSAGES.en;
    return {
      locale,
      t: (key, values) => interpolate(messages[key as keyof typeof messages] ?? key, values),
    };
  }, [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return React.useContext(I18nContext);
}
