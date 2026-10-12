import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { I18nProvider } from "@hustradio/unitary-ui";

export type DocsLanguage = "zh-CN" | "en-US";

const STORAGE_KEY = "unitary-docs-language";
/** 迁移前沿用的键名（Geist 命名），命中后迁移到新键并清理。 */
const LEGACY_STORAGE_KEY = "geist-docs-language";
const DEFAULT_LANGUAGE: DocsLanguage = "zh-CN";

interface LanguageContextValue {
  language: DocsLanguage;
  setLanguage: (language: DocsLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isDocsLanguage(value: string | null): value is DocsLanguage {
  return value === "zh-CN" || value === "en-US";
}

function readUrlLanguage(): DocsLanguage | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang");
  return isDocsLanguage(language) ? language : null;
}

function readStoredLanguage(): DocsLanguage | null {
  if (typeof window === "undefined") return null;
  try {
    const language = window.localStorage.getItem(STORAGE_KEY);
    if (isDocsLanguage(language)) return language;
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (isDocsLanguage(legacy)) {
      window.localStorage.setItem(STORAGE_KEY, legacy);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      return legacy;
    }
    return null;
  } catch {
    return null;
  }
}

export function readDocsLanguage(): DocsLanguage {
  return readUrlLanguage() ?? readStoredLanguage() ?? DEFAULT_LANGUAGE;
}

function writeUrlLanguage(language: DocsLanguage) {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  params.set("lang", language);
  url.search = params.toString();
  window.history.replaceState(null, "", url);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<DocsLanguage>(() => readDocsLanguage());
  document.documentElement.lang = language;

  const setLanguage = useCallback((next: DocsLanguage) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      writeUrlLanguage(next);
    } catch {
      // Persistence failure is non-fatal; the current page still switches language.
    }
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);
  return (
    <LanguageContext.Provider value={value}>
      <I18nProvider locale={language === "zh-CN" ? "zh-CN" : "en"}>{children}</I18nProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a <LanguageProvider>");
  return context;
}
