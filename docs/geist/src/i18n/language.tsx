import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type DocsLanguage = "zh-CN" | "en-US";

const STORAGE_KEY = "geist-docs-language";
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
  const params = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
  const language = params.get("lang");
  return isDocsLanguage(language) ? language : null;
}

function readStoredLanguage(): DocsLanguage | null {
  if (typeof window === "undefined") return null;
  try {
    const language = window.localStorage.getItem(STORAGE_KEY);
    return isDocsLanguage(language) ? language : null;
  } catch {
    return null;
  }
}

export function readDocsLanguage(): DocsLanguage {
  return readUrlLanguage() ?? readStoredLanguage() ?? DEFAULT_LANGUAGE;
}

function writeUrlLanguage(language: DocsLanguage) {
  const hash = window.location.hash || "#/";
  const [route, query = ""] = hash.split("?");
  const params = new URLSearchParams(query);
  params.set("lang", language);
  window.history.replaceState(null, "", `${route}?${params.toString()}`);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<DocsLanguage>(() => readDocsLanguage());

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
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a <LanguageProvider>");
  return context;
}
