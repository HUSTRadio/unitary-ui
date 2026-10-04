import { setTokens, type TokenTarget } from "../tokens";
import { getColorScheme, schemes, type ColorSchemeId, type Mode, type SchemeTokens } from "./presets";
import { codeThemes, resolveCodeTheme, type CodeThemeId } from "./code-themes";
import { getCodeTheme, inlineVariables, scopedTokens, scopeBindings, selectionCss } from "./styles";

export { schemes as COLOR_SCHEMES, getColorScheme } from "./presets";
export { codeThemes as CODE_THEMES, resolveCodeTheme, inlineColors as getInlineCodeColors } from "./code-themes";
export { getCodeTheme } from "./styles";
export type { ColorSchemeId, UiScheme as ColorScheme, Mode as ColorSchemeMode, SchemeTokens as ColorSchemeTokens } from "./presets";
export type { CodeThemeId, CodeTheme, CodeRole, CodeColors } from "./code-themes";

// Registry entries are shared across consumers. Resolvers return fresh working values.
for (const scheme of schemes) {
  Object.freeze(scheme.ui.light);
  Object.freeze(scheme.ui.dark);
  Object.freeze(scheme.ui);
  Object.freeze(scheme);
}
Object.freeze(schemes);
for (const theme of codeThemes) {
  if (theme.colors) Object.freeze(theme.colors);
  Object.freeze(theme);
}
Object.freeze(codeThemes);

export interface ColorSchemeSelection {
  scheme?: ColorSchemeId;
  inlineTheme?: CodeThemeId;
  blockTheme?: CodeThemeId;
}

/** Pure, SSR-safe export of both UI modes and independent code scopes. */
export function createColorSchemeCSS({ scheme = "default", inlineTheme = "default", blockTheme = "default" }: ColorSchemeSelection = {}): string {
  return selectionCss(getColorScheme(scheme), getCodeTheme(inlineTheme), getCodeTheme(blockTheme));
}

export interface ApplyColorSchemeOptions {
  scheme?: ColorSchemeId;
  mode: Mode;
}
export interface ApplyCodeThemeOptions extends ApplyColorSchemeOptions {
  theme?: CodeThemeId;
  kind?: "inline" | "block";
}

function validateMode(mode: Mode) {
  if (mode !== "light" && mode !== "dark") throw new TypeError(`Unknown color scheme mode: ${mode}`);
}

/** Restore only properties still owned by this application, preserving subsequent external edits. */
function applyScope(target: TokenTarget | null, attributes: Record<string, string>, tokens: SchemeTokens, extra: Record<string, string>): () => void {
  if (!target) return () => {};
  const variables = { ...tokens, ...extra };
  const previous = Object.entries(variables).map(([name]) => [name, target.style.getPropertyValue(name), target.style.getPropertyPriority(name)] as const);
  const previousAttributes = Object.keys(attributes).map(name => [name, target.getAttribute(name)] as const);
  for (const [name, value] of Object.entries(attributes)) target.setAttribute(name, value);
  for (const [name, value] of Object.entries(extra)) target.style.setProperty(name, value);
  setTokens(tokens, { target });
  const applied = Object.keys(variables).map(name => [name, target.style.getPropertyValue(name), target.style.getPropertyPriority(name)] as const);
  let active = true;
  return () => {
    if (!active) return;
    active = false;
    for (let index = 0; index < previous.length; index++) {
      const [name, value, priority] = previous[index];
      if (target.style.getPropertyValue(name) !== applied[index][1] || target.style.getPropertyPriority(name) !== applied[index][2]) continue;
      if (value) target.style.setProperty(name, value, priority);
      else target.style.removeProperty(name);
    }
    for (const [name, value] of previousAttributes) {
      if (target.getAttribute(name) !== attributes[name]) continue;
      if (value === null) target.removeAttribute(name);
      else target.setAttribute(name, value);
    }
  };
}

/** Applies to an explicit element, never implicitly to document.documentElement. Clean up before reapplying. */
export function applyColorScheme(target: TokenTarget | null, { scheme = "default", mode }: ApplyColorSchemeOptions): () => void {
  validateMode(mode);
  const palette = getColorScheme(scheme);
  return applyScope(target, { "data-color-scheme": scheme, "data-theme": mode }, scopedTokens(palette.ui[mode]), scopeBindings);
}

/** Code scopes have a fixed mode for named editor themes; Default follows the supplied UI mode. */
export function applyCodeTheme(target: TokenTarget | null, { scheme = "default", theme = "default", mode, kind = "block" }: ApplyCodeThemeOptions): () => void {
  validateMode(mode);
  if (kind !== "inline" && kind !== "block") throw new TypeError(`Unknown code theme kind: ${kind}`);
  const palette = getColorScheme(scheme);
  const code = getCodeTheme(theme);
  if (kind === "inline") return applyScope(target, { "data-inline-code-theme": theme, "data-ui-theme": mode }, {}, inlineVariables(code, palette, mode));
  const resolved = resolveCodeTheme(code, palette, mode);
  return applyScope(target, { "data-code-scheme": theme, "data-ui-theme": mode, "data-theme": resolved.mode }, scopedTokens(resolved.tokens), { ...scopeBindings, ...resolved.syntax });
}
