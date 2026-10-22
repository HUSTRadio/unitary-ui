import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Button, I18nProvider, ThemeProvider } from "@hustradio/unitary-ui";

export type Locale = "zh-CN" | "en";
export type Localized = Record<Locale, string>;
const storageKey = "unitary-template-docs-language";
const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({
  locale: "zh-CN",
  setLocale: () => {},
});

export function TemplateProviders({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      return localStorage.getItem(storageKey) === "en" ? "en" : "zh-CN";
    } catch {
      return "zh-CN";
    }
  });
  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(storageKey, locale);
    } catch {
      /* Preferences are optional. */
    }
  }, [locale]);
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <ThemeProvider>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </ThemeProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <Button
      typeName="button"
      type="tertiary"
      size="small"
      aria-label={locale === "zh-CN" ? "Switch to English" : "切换为中文"}
      onClick={() => setLocale(locale === "zh-CN" ? "en" : "zh-CN")}
    >
      {locale === "zh-CN" ? "EN" : "中文"}
    </Button>
  );
}
