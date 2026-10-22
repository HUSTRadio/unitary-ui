import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { I18nProvider } from "@hustradio/unitary-ui";

export type WebsiteLanguage = "zh-CN" | "en-US";
const STORAGE_KEY = "unitary-website-language";
const LanguageContext = createContext<{
  language: WebsiteLanguage;
  setLanguage: (language: WebsiteLanguage) => void;
} | null>(null);

export function isWebsiteLanguage(value: string | null): value is WebsiteLanguage {
  return value === "zh-CN" || value === "en-US";
}

export function readWebsiteLanguage(): WebsiteLanguage {
  const query = new URLSearchParams(window.location.search).get("lang");
  if (isWebsiteLanguage(query)) return query;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isWebsiteLanguage(stored)) return stored;
  } catch { /* Preferences still work when storage is unavailable. */ }
  return navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en-US";
}

export function WebsiteLanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState(readWebsiteLanguage);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const setLanguage = (next: WebsiteLanguage) => {
    updateLanguage(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Optional persistence. */ }
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(null, "", url);
  };
  return <LanguageContext.Provider value={{ language, setLanguage }}>
    <I18nProvider locale={language === "zh-CN" ? "zh-CN" : "en"}>{children}</I18nProvider>
  </LanguageContext.Provider>;
}

export function useWebsiteLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("WebsiteLanguageProvider is required");
  return value;
}
