import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { GLOBAL_TOKENS } from "../src/lib/token-catalog";
import { defaultTokens } from "../src/lib/color-schemes/default";
import { schemes, brandBlue, type Mode } from "../src/lib/color-schemes/presets";
import { codeThemes, resolveCodeTheme, inlineColors, codeRoles } from "../src/lib/color-schemes/code-themes";
import { selectionCss } from "../src/lib/color-schemes/styles";

function luminance(hex: string) {
  const rgb = hex.slice(1).match(/../g)!.map(v => parseInt(v, 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}

describe("standard UI schemes and independent code themes", () => {
  test("Default preserves all saved docs runtime color tokens", () => {
    expect(schemes[0].id).toBe("default");
    expect(schemes[0].ui).toEqual(defaultTokens);
    for (const mode of ["light", "dark"] as const) {
      const names = Object.entries(GLOBAL_TOKENS).filter(([, t]) => t.kind === "runtime" && t.group === "colors").map(([name]) => name).sort();
      expect(Object.keys(defaultTokens[mode]).sort()).toEqual(names);
    }
  });
  test("Unitary Blue actions use the canonical logo fill", () => {
    const logo = readFileSync(new URL("../brand/unitary-logo-horizontal.svg", import.meta.url), "utf8");
    expect(brandBlue).toBe(logo.match(/fill="(#[\da-f]{6})"/i)?.[1].toLowerCase());
    const blue = schemes.find(s => s.id === "unitary-blue")!;
    for (const mode of ["light", "dark"] as const) expect(blue.ui[mode]["--primary"]).toBe(brandBlue);
  });
  const adoptedValues = new Set([...Object.values(defaultTokens.light), ...Object.values(defaultTokens.dark), brandBlue]);
  for (const ui of schemes) for (const mode of ["light", "dark"] as Mode[]) {
    test(`${ui.id}/${mode}: UI values stay in the adopted project palette`, () => {
      const tokens = ui.ui[mode];
      for (const [name, value] of Object.entries(tokens)) {
        expect(GLOBAL_TOKENS[name as keyof typeof GLOBAL_TOKENS].kind).toBe("runtime");
        expect(adoptedValues.has(value!), `${name}: ${value}`).toBe(true);
      }
      for (const bg of [tokens["--background"]!, tokens["--card"]!, tokens["--secondary"]!]) {
        for (const fg of [tokens["--foreground"]!, tokens["--muted-foreground"]!]) expect(contrast(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
      for (const bg of [tokens["--primary"]!, tokens["--action-hover"]!]) expect(contrast(tokens["--primary-foreground"]!, bg)).toBeGreaterThanOrEqual(4.5);
    });
  }
  for (const theme of codeThemes.filter(t => t.id !== "default")) {
    test(`${theme.id}: code values and mode are independent of UI and UI mode`, () => {
      const expected = resolveCodeTheme(theme, schemes[0], "light");
      for (const ui of schemes) for (const mode of ["light", "dark"] as const) {
        expect(resolveCodeTheme(theme, ui, mode)).toEqual(expected);
        expect(inlineColors(theme, ui, mode)).toEqual(inlineColors(theme, schemes[0], "light"));
      }
      expect(expected.mode).toBe(theme.mode);
      expect(Object.keys(expected.colors).sort()).toEqual([...codeRoles].sort());
      expect(theme.source).toMatch(/^https:\/\//);
    });
  }
  test("Default code follows UI surfaces; Default inline code keeps plain text styling", () => {
    for (const ui of schemes) for (const mode of ["light", "dark"] as const) {
      const code = resolveCodeTheme(codeThemes[0], ui, mode);
      expect(code.mode).toBe(mode);
      expect(code.colors.background).toBe(ui.ui[mode]["--background"]);
      expect(inlineColors(codeThemes[0], ui, mode)).toEqual({ foreground: ui.ui[mode]["--foreground"], background: "transparent", border: "transparent" });
    }
  });
  test("Monokai preserves distinct string and number roles; exports all three scopes", () => {
    const monokai = codeThemes.find(t => t.id === "monokai")!;
    expect(monokai.colors!.string).toBe("#e6db74");
    expect(monokai.colors!.number).toBe("#ae81ff");
    const css = selectionCss(schemes[3], codeThemes[1], monokai);
    expect(css).toContain('[data-color-scheme="amber"][data-theme="dark"]');
    expect(css).toContain('[data-inline-code-theme="light"][data-ui-theme="dark"]');
    expect(css).toContain('[data-code-scheme="monokai"][data-ui-theme="light"]');
    expect(css).toContain("--scheme-code-number: #ae81ff;");
    expect(css).toContain("--scheme-inline-background: #ffffff;");
  });
});
