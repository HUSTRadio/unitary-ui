import { defaultTokens } from "./default";
import type { Mode, SchemeTokens, UiScheme } from "./presets";

export const codeRoles = ["background", "surface", "foreground", "border", "comment", "keyword", "string", "number", "boolean", "function", "property", "type", "variable", "punctuation", "highlight", "added", "removed", "referenced"] as const;
export type CodeRole = typeof codeRoles[number];
export type CodeColors = Record<CodeRole, string>;
export type CodeTheme = { id: string; name: string; mode?: Mode; source?: string; colors?: CodeColors };
const vsSource = "https://github.com/microsoft/vscode/tree/main/extensions/theme-defaults/themes";
const monokaiSource = "https://github.com/microsoft/vscode/blob/main/extensions/theme-monokai/themes/monokai-color-theme.json";
const solarizedSource = "https://ethanschoonover.com/solarized/";

// VS Code Light+/Dark+ and Monokai: exact upstream colors, adapted to Prism roles.
// Line backgrounds for VS Code and Solarized reuse this project's fixed-mode code state tokens.
function lineColors(mode: Mode) {
  const t = defaultTokens[mode];
  return { highlight: t["--code-highlight"], added: t["--code-added"], removed: t["--code-removed"], referenced: t["--code-referenced"] };
}
export const codeThemes: readonly CodeTheme[] = [
  { id: "default", name: "Default" },
  { id: "light", name: "Light (VS Code)", mode: "light", source: vsSource, colors: {
    background: "#ffffff", surface: "#e8e8e8", foreground: "#000000", border: "#d8d8d8", comment: "#008000", keyword: "#af00db", string: "#a31515", number: "#098658", boolean: "#0000ff", function: "#795e26", property: "#001080", type: "#267f99", variable: "#001080", punctuation: "#000000", ...lineColors("light"),
  } },
  { id: "dark", name: "Dark (VS Code)", mode: "dark", source: vsSource, colors: {
    background: "#1e1e1e", surface: "#303031", foreground: "#d4d4d4", border: "#404040", comment: "#6a9955", keyword: "#c586c0", string: "#ce9178", number: "#b5cea8", boolean: "#569cd6", function: "#dcdcaa", property: "#9cdcfe", type: "#4ec9b0", variable: "#9cdcfe", punctuation: "#d4d4d4", ...lineColors("dark"),
  } },
  { id: "monokai", name: "Monokai", mode: "dark", source: monokaiSource, colors: {
    background: "#272822", surface: "#1e1f1c", foreground: "#f8f8f2", border: "#414339", comment: "#88846f", keyword: "#f92672", string: "#e6db74", number: "#ae81ff", boolean: "#ae81ff", function: "#a6e22e", property: "#a6e22e", type: "#66d9ef", variable: "#f8f8f2", punctuation: "#f8f8f2", highlight: "#3e3d32", added: "#4b661680", removed: "#90274a70", referenced: "#414339",
  } },
  ...(["light", "dark"] as const).map(mode => ({
    id: `solarized-${mode}`, name: `Solarized ${mode === "light" ? "Light" : "Dark"}`, mode, source: solarizedSource,
    colors: {
      background: mode === "light" ? "#fdf6e3" : "#002b36", surface: mode === "light" ? "#eee8d5" : "#073642",
      foreground: mode === "light" ? "#657b83" : "#839496", border: mode === "light" ? "#93a1a1" : "#586e75",
      comment: mode === "light" ? "#93a1a1" : "#586e75", keyword: "#859900", string: "#2aa198", number: "#d33682", boolean: "#b58900", function: "#268bd2", property: "#b58900", type: "#cb4b16", variable: mode === "light" ? "#657b83" : "#839496", punctuation: mode === "light" ? "#586e75" : "#93a1a1", ...lineColors(mode),
    },
  })),
];

export function resolveCodeTheme(theme: CodeTheme, ui: UiScheme, uiMode: Mode) {
  const mode = theme.mode ?? uiMode;
  const base: SchemeTokens = theme.id === "default" ? ui.ui[mode] : defaultTokens[mode];
  const colors: CodeColors = theme.colors ?? {
    background: base["--background"]!, surface: base["--background-200"]!, foreground: base["--foreground"]!, border: base["--border"]!,
    comment: base["--uni-gray-900"]!, keyword: base["--uni-pink-900"]!, string: base["--uni-green-900"]!, number: base["--uni-green-900"]!, boolean: base["--uni-green-900"]!, function: base["--uni-purple-900"]!, property: base["--uni-red-900"]!, type: base["--uni-green-900"]!, variable: base["--uni-green-900"]!, punctuation: base["--uni-gray-1000"]!, highlight: base["--code-highlight"]!, added: base["--code-added"]!, removed: base["--code-removed"]!, referenced: base["--code-referenced"]!,
  };
  const tokens: SchemeTokens = theme.id === "default" ? { ...base } : {
    ...base,
    "--background": colors.background, "--card": colors.background, "--background-100": colors.background,
    "--background-200": colors.surface, "--foreground": colors.foreground, "--muted-foreground": colors.comment,
    "--border": colors.border, "--gray-400": colors.border, "--gray-900": colors.comment, "--gray-1000": colors.foreground,
    "--code-highlight": colors.highlight, "--code-added": colors.added, "--code-removed": colors.removed, "--code-referenced": colors.referenced,
  };
  const syntax = Object.fromEntries(codeRoles.map(role => [`--scheme-code-${role}`, colors[role]]));
  return { mode, tokens, colors, syntax };
}

export function inlineColors(theme: CodeTheme, ui: UiScheme, uiMode: Mode) {
  const resolved = resolveCodeTheme(theme, ui, uiMode);
  return theme.id === "default"
    ? { foreground: ui.ui[uiMode]["--foreground"]!, background: "transparent", border: "transparent" }
    : { foreground: resolved.colors.foreground, background: resolved.colors.background, border: resolved.colors.border };
}
