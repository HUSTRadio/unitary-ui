import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * OA Workspace — Theme preference system
 *
 * Contract (08_Dev_Handoff.md):
 * - Single canonical UI; Light / Dark are color schemes, not screens.
 * - User preference is tri-state: "light" | "dark" | "system".
 * - "system" is resolved at runtime via prefers-color-scheme — never a
 *   third static palette.
 * - Explicit user choice is persisted; on boot the persisted preference is
 *   read first, then "system" is resolved.
 */

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "unitary-theme-preference";
/**
 * 迁移前沿用的键名（Geist 命名）。只用于回退读取：命中后写入新键并清理旧键，
 * 保证老用户已保存的偏好不丢失，也让 HTML 首帧脚本与运行时保持一致。
 */
const LEGACY_STORAGE_KEY = "geist-theme-preference";
const DARK_QUERY = "(prefers-color-scheme: dark)";

interface ThemeContextValue {
  /** The user's stored preference. */
  preference: ThemePreference;
  /** The theme actually applied after system resolution. */
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isThemePreference(stored)) return stored;
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (isThemePreference(legacy)) {
      window.localStorage.setItem(STORAGE_KEY, legacy);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      return legacy;
    }
    return "system";
  } catch {
    return "system";
  }
}

function resolveSystem(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/**
 * Applies the resolved theme to <html> (both `.dark` class and data-theme),
 * and aligns the browser chrome via <meta name="theme-color">.
 * Run before React mounts to avoid a flash of the wrong theme.
 */
export function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  // Geist guideline: browser UI matches the page background.
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#0a0a0a" : "#ffffff";
}

/**
 * Boot-time init: apply persisted preference (resolving "system") before the
 * first paint. Call once from main.tsx before createRoot().
 */
export function initTheme() {
  const pref = readStoredPreference();
  applyTheme(pref === "system" ? resolveSystem() : pref);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readStoredPreference());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    preference === "system" ? resolveSystem() : preference,
  );

  // Apply to <html> whenever the resolved theme changes.
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Follow OS changes while preference is "system".
  useEffect(() => {
    if (preference !== "system") return;
    const mql = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) =>
      setResolvedTheme(event.matches ? "dark" : "light");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persistence failure is non-fatal; theme still applies for this session.
    }
    setResolvedTheme(next === "system" ? resolveSystem() : next);
  }, []);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return context;
}
