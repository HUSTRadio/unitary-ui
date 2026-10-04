import { GLOBAL_TOKENS } from "../token-catalog";
import { codeThemes, inlineColors, resolveCodeTheme, type CodeTheme } from "./code-themes";
import { toCss, type UiScheme, type Mode } from "./presets";

import roleStyles from "../../styles/color-schemes.css?raw";

// Resolve aliases in the same scope as their runtime palette values.
export const scopeBindings: Readonly<Record<string, string>> = Object.fromEntries(Object.entries(GLOBAL_TOKENS)
  .filter(([, token]) => token.kind === "mapping" && token.group === "colors" && /^var\(--[\w-]+\)$/.test(token.value))
  .map(([name, token]) => [name, token.value]));
export const scopeStyles = toCss("[data-color-scheme], [data-code-scheme]", scopeBindings) + "\n" + roleStyles;

export function inlineVariables(theme: CodeTheme, ui: UiScheme, mode: Mode) {
  return Object.fromEntries(Object.entries(inlineColors(theme, ui, mode)).map(([role, value]) => [`--scheme-inline-${role}`, value]));
}

export function scopedTokens(tokens: Readonly<Record<string, string | undefined>>) {
  return { ...tokens, "--focus-ring-outline": "0 0 0 2px var(--color-bg-surface), 0 0 0 4px var(--focus-ring-color)" };
}

export function selectionCss(ui: UiScheme, inline: CodeTheme, block: CodeTheme) {
  return `/* Unitary palette configuration. Load after library styles. */\n${(["light", "dark"] as const).map(mode => {
    const resolved = resolveCodeTheme(block, ui, mode);
    return [
      toCss(`[data-color-scheme="${ui.id}"][data-theme="${mode}"]`, scopedTokens(ui.ui[mode])),
      toCss(`[data-inline-code-theme="${inline.id}"][data-ui-theme="${mode}"]`, inlineVariables(inline, ui, mode)),
      toCss(`[data-code-scheme="${block.id}"][data-ui-theme="${mode}"]`, { ...scopedTokens(resolved.tokens), ...resolved.syntax }),
    ].join("\n\n");
  }).join("\n\n")}\n\n${scopeStyles}`;
}

export function getCodeTheme(id: string) {
  const theme = codeThemes.find(t => t.id === id);
  if (!theme) throw new TypeError(`Unknown code theme: ${id}`);
  return theme;
}
