import type { RuntimeTokenName } from "@/lib/token-catalog";
import { defaultTokens } from "./default";

export type SchemeTokens = Partial<Record<RuntimeTokenName, string>>;
export type Mode = "light" | "dark";
export const brandBlue = "#0d47a1"; // brand/unitary-logo-horizontal.svg and docs' --theme-accent.

// Every UI color is selected from the current project palette (or the canonical brand mark).
function themedUi(hue: "blue" | "green" | "amber", mode: Mode): SchemeTokens {
  const base = defaultTokens[mode];
  const canvas = base[`--${hue}-100`];
  const soft = base[`--${hue}-200`];
  const action = hue === "blue" ? brandBlue : base[`--${hue}-900`];
  const actionText = hue === "blue" || mode === "light" ? defaultTokens.light["--background"] : base["--background"];
  const hover = hue === "blue" ? base["--blue-800"] : base[`--${hue}-1000`];
  const link = base[`--${hue}-900`];
  return {
    ...base,
    "--color-bg-canvas": canvas, "--background": canvas,
    "--color-bg-subtle": soft, "--background-200": soft,
    "--color-bg-hover": soft, "--color-bg-selected": soft,
    "--secondary": soft, "--muted": soft, "--accent": soft,
    "--action-primary": action, "--primary": action,
    "--primary-foreground": actionText, "--color-text-inverse": actionText,
    "--action-hover": hover, "--action-pressed": hover, "--action-soft": soft,
    "--link": link, "--ring": link, "--color-focus-ring": link,
    "--focus-ring-color": link, "--uni-focus-color": link,
    "--input-focus-border": link,
  };
}

export const schemes = [
  { id: "default", name: "默认", english: "Default", description: "当前文档的标准配色", descriptionEn: "The current docs configuration", ui: defaultTokens },
  { id: "unitary-blue", name: "品牌蓝", english: "Unitary Blue", description: "标准蓝色阶与 Unitary logo 蓝", descriptionEn: "Standard blue scale and Unitary logo blue", ui: { light: themedUi("blue", "light"), dark: themedUi("blue", "dark") } },
  { id: "green", name: "绿色", english: "Green", description: "项目现有绿色阶", descriptionEn: "The project's existing green scale", ui: { light: themedUi("green", "light"), dark: themedUi("green", "dark") } },
  { id: "amber", name: "琥珀", english: "Amber", description: "项目现有琥珀色阶", descriptionEn: "The project's existing amber scale", ui: { light: themedUi("amber", "light"), dark: themedUi("amber", "dark") } },
];
export type UiScheme = typeof schemes[number];

export function toCss(selector: string, tokens: Readonly<Record<string, string | undefined>>): string {
  return `${selector} {\n${Object.entries(tokens).map(([name, value]) => `  ${name}: ${value};`).join("\n")}\n}`;
}
