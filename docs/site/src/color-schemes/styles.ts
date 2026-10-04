import { GLOBAL_TOKENS } from "@/lib/token-catalog";
import { codeThemes, inlineColors, resolveCodeTheme, type CodeTheme } from "./code-themes";
import { toCss, type UiScheme, type Mode } from "./presets";

// Local aliases must resolve where palette tokens are overridden, including in downloaded CSS.
const bindings = Object.entries(GLOBAL_TOKENS)
  .filter(([, token]) => token.kind === "mapping" && token.group === "colors" && /^var\(--[\w-]+\)$/.test(token.value))
  .map(([name, token]) => `  ${name}: ${token.value};`).join("\n");
export const scopeStyles = `[data-color-scheme], [data-code-scheme] {
  color: var(--foreground);
${bindings}
  --focus-ring-outline: 0 0 0 2px var(--color-bg-surface), 0 0 0 4px var(--focus-ring-color);
}
[data-color-scheme]:not([data-color-scheme="default"]) { --theme-accent: var(--link); --color-theme-accent: var(--link); }
[data-color-scheme][data-theme="light"], [data-code-scheme][data-theme="light"] { color-scheme: light; }
[data-color-scheme][data-theme="dark"], [data-code-scheme][data-theme="dark"] { color-scheme: dark; }
[data-inline-code-theme]:not([data-inline-code-theme="default"]) [data-slot="inline-code"] {
  color: var(--scheme-inline-foreground); background: var(--scheme-inline-background);
  border: 1px solid var(--scheme-inline-border); border-radius: var(--radius); padding: 0.1em 0.35em; overflow-wrap: anywhere;
}
${["comment", "keyword", "string", "number", "boolean", "function", "property", "variable", "punctuation"].map(role => `[data-code-scheme]:not([data-code-scheme="default"]) .token.${role} { color: var(--scheme-code-${role}); }`).join("\n")}
[data-code-scheme]:not([data-code-scheme="default"]) .token.class-name,
[data-code-scheme]:not([data-code-scheme="default"]) .token.builtin { color: var(--scheme-code-type); }
[data-code-scheme]:not([data-code-scheme="default"]) .token.operator { color: var(--scheme-code-punctuation); }
[data-code-scheme]:not([data-code-scheme="default"]) .token.tag { color: var(--scheme-code-keyword); }
[data-code-scheme]:not([data-code-scheme="default"]) .token.attr-name { color: var(--scheme-code-property); }
[data-code-scheme]:not([data-code-scheme="default"]) .token.attr-value { color: var(--scheme-code-string); }
`;

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
