import * as React from "react";
import {
  FRAMEWORK_MESSAGES,
  type FrameworkLocale,
  type FrameworkMessageKey,
} from "@/lib/framework-messages";

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
    interpolate(FRAMEWORK_MESSAGES.en[key as FrameworkMessageKey] ?? key, values),
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
    // HIG-AUD-008：键集同构的**编译期**校验点——任一 locale 缺少 `en` 的某个 key
    // （含拼写差异）都会让下面这行注解直接报错，根治「缺 key 静默回显 key 原文」。
    const messages: Record<FrameworkMessageKey, string> =
      FRAMEWORK_MESSAGES[locale] ?? FRAMEWORK_MESSAGES.en;
    return {
      locale,
      t: (key, values) => interpolate(messages[key as FrameworkMessageKey] ?? key, values),
    };
  }, [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return React.useContext(I18nContext);
}
