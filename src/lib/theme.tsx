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
/** Global material appearance, independent of the light/dark color preference. */
export type TexturePreference = "solid" | "hybrid" | "glass";

export interface ThemeProviderProps {
  children: ReactNode;
  /** Controlled global texture. Nested providers inherit the application root. */
  texture?: TexturePreference;
  /** Initial uncontrolled texture; a valid stored preference takes precedence. */
  defaultTexture?: TexturePreference;
  onTextureChange?: (texture: TexturePreference) => void;
}

const STORAGE_KEY = "unitary-theme-preference";
const TEXTURE_STORAGE_KEY = "unitary-texture-preference";
/**
 * 迁移前沿用的键名（Geist 命名）。只用于回退读取：命中后写入新键并清理旧键，
 * 保证老用户已保存的偏好不丢失，也让 HTML 首帧脚本与运行时保持一致。
 */
const LEGACY_STORAGE_KEY = "geist-theme-preference";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const FORCED_COLORS_QUERY = "(forced-colors: active)";
const REDUCED_TRANSPARENCY_QUERY = "(prefers-reduced-transparency: reduce)";

interface ThemeContextValue {
  /** The user's stored preference. */
  preference: ThemePreference;
  /** The theme actually applied after system resolution. */
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  /** Requested global texture, retained during accessibility/capability fallback. */
  texture: TexturePreference;
  /** Effective texture after accessibility preferences and browser support. */
  resolvedTexture: TexturePreference;
  setTexture: (texture: TexturePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function isTexturePreference(value: unknown): value is TexturePreference {
  return value === "solid" || value === "hybrid" || value === "glass";
}

function validateTexture(value: unknown): asserts value is TexturePreference {
  if (!isTexturePreference(value)) {
    throw new TypeError('Texture must be "solid", "hybrid", or "glass".');
  }
}

function readStoredTexture(fallback: TexturePreference): TexturePreference {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(TEXTURE_STORAGE_KEY);
    return isTexturePreference(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}

interface TextureEnvironment {
  supported: boolean;
  forcedColors: boolean;
  reducedTransparency: boolean;
}

const INITIAL_TEXTURE_ENVIRONMENT: TextureEnvironment = {
  supported: false,
  forcedColors: false,
  reducedTransparency: false,
};

function readTextureEnvironment(): TextureEnvironment {
  if (typeof window === "undefined") return INITIAL_TEXTURE_ENVIRONMENT;
  const supports = window.CSS?.supports?.bind(window.CSS);
  const supported = Boolean(
    supports &&
      (supports("backdrop-filter", "blur(1px)") ||
        supports("-webkit-backdrop-filter", "blur(1px)")) &&
      supports("color", "color-mix(in srgb, white 50%, transparent)"),
  );
  return {
    supported,
    forcedColors: window.matchMedia?.(FORCED_COLORS_QUERY).matches ?? false,
    reducedTransparency: window.matchMedia?.(REDUCED_TRANSPARENCY_QUERY).matches ?? false,
  };
}

function resolveTexture(
  texture: TexturePreference,
  environment: TextureEnvironment,
): TexturePreference {
  return environment.supported && !environment.forcedColors && !environment.reducedTransparency
    ? texture
    : "solid";
}

function applyTexture(texture: TexturePreference, resolvedTexture: TexturePreference) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.texturePreference = texture;
  document.documentElement.dataset.texture = resolvedTexture;
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
  if (typeof document === "undefined") return;
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
  const texture = readStoredTexture("solid");
  applyTexture(texture, resolveTexture(texture, readTextureEnvironment()));
}

export function ThemeProvider({
  children,
  texture: controlledTexture,
  defaultTexture = "solid",
  onTextureChange,
}: ThemeProviderProps) {
  validateTexture(defaultTexture);
  if (controlledTexture !== undefined) validateTexture(controlledTexture);
  const parent = useContext(ThemeContext);
  const ownsTexture = parent === null;
  // Keep server output and the first hydration render identical. HTML boot scripts
  // apply persisted texture before paint; the provider takes ownership after mount.
  const [textureState, setTextureState] = useState<TexturePreference>(defaultTexture);
  const [textureInitialization] = useState(() => ({
    controlled: controlledTexture !== undefined,
    defaultTexture,
  }));
  const [textureEnvironment, setTextureEnvironment] = useState(INITIAL_TEXTURE_ENVIRONMENT);
  const [textureReady, setTextureReady] = useState(false);
  const requestedTexture = controlledTexture ?? textureState;
  const resolvedTexture = resolveTexture(requestedTexture, textureEnvironment);
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

  useEffect(() => {
    if (!ownsTexture) return;
    if (!textureInitialization.controlled) {
      setTextureState(readStoredTexture(textureInitialization.defaultTexture));
    }
    setTextureEnvironment(readTextureEnvironment());
    setTextureReady(true);
    const queries = [FORCED_COLORS_QUERY, REDUCED_TRANSPARENCY_QUERY].map((query) =>
      window.matchMedia?.(query),
    );
    const updateEnvironment = () => setTextureEnvironment(readTextureEnvironment());
    for (const query of queries) query?.addEventListener("change", updateEnvironment);
    return () => {
      for (const query of queries) query?.removeEventListener("change", updateEnvironment);
    };
    // Props are initial values here. Controlled changes are resolved during render;
    // changing defaultTexture after mount does not reset an uncontrolled preference.
  }, [ownsTexture, textureInitialization]);

  useEffect(() => {
    if (ownsTexture && textureReady) applyTexture(requestedTexture, resolvedTexture);
  }, [ownsTexture, textureReady, requestedTexture, resolvedTexture]);

  useEffect(() => {
    if (!ownsTexture || controlledTexture !== undefined) return;
    const onStorage = (event: StorageEvent) => {
      try {
        if (event.storageArea !== null && event.storageArea !== window.localStorage) return;
      } catch {
        return;
      }
      if (event.key === TEXTURE_STORAGE_KEY || event.key === null) {
        setTextureState(readStoredTexture(defaultTexture));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [ownsTexture, controlledTexture, defaultTexture]);

  const setTexture = useCallback(
    (next: TexturePreference) => {
      validateTexture(next);
      if (controlledTexture === undefined) {
        setTextureState(next);
        try {
          window.localStorage.setItem(TEXTURE_STORAGE_KEY, next);
        } catch {
          // Texture still changes when browser storage is unavailable.
        }
      }
      onTextureChange?.(next);
    },
    [controlledTexture, onTextureChange],
  );

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference,
      texture: parent?.texture ?? requestedTexture,
      resolvedTexture: parent?.resolvedTexture ?? resolvedTexture,
      setTexture: parent?.setTexture ?? setTexture,
    }),
    [preference, resolvedTheme, setPreference, parent, requestedTexture, resolvedTexture, setTexture],
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
