// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { applyColorScheme, applyCodeTheme, createColorSchemeCSS, COLOR_SCHEMES, CODE_THEMES, getColorScheme, getCodeTheme, resolveCodeTheme } from "../src/lib/color-schemes";

describe("public color scheme API", () => {
  it("scopes writes and restores previous values, priorities and attributes", () => {
    const rootBefore = document.documentElement.outerHTML;
    const target = document.createElement("div");
    target.style.setProperty("--primary", "old-primary", "important");
    target.style.width = "280px";
    target.dataset.theme = "system";
    const restore = applyColorScheme(target, { scheme: "unitary-blue", mode: "dark" });
    expect(target.style.getPropertyValue("--primary")).toBe("#0d47a1");
    expect(target.style.getPropertyValue("--focus-ring-outline")).toContain("var(--focus-ring-color)");
    expect(target.style.getPropertyValue("--color-primary")).toBe("var(--primary)");
    expect(target.dataset.theme).toBe("dark");
    restore();
    restore();
    expect(target.style.getPropertyValue("--primary")).toBe("old-primary");
    expect(target.style.getPropertyPriority("--primary")).toBe("important");
    expect(target.style.width).toBe("280px");
    expect(target.dataset.theme).toBe("system");
    expect(target.hasAttribute("data-color-scheme")).toBe(false);
    expect(target.style.getPropertyValue("--color-primary")).toBe("");
    expect(document.documentElement.outerHTML).toBe(rootBefore);
  });
  it("preserves external edits made after applying a scope", () => {
    const target = document.createElement("div");
    const restore = applyColorScheme(target, { scheme: "green", mode: "light" });
    target.style.setProperty("--primary", "external", "important");
    target.dataset.theme = "external";
    restore();
    expect(target.style.getPropertyValue("--primary")).toBe("external");
    expect(target.style.getPropertyPriority("--primary")).toBe("important");
    expect(target.dataset.theme).toBe("external");
  });
  it("applies inline and block themes independently and cleans all owned values", () => {
    const inline = document.createElement("p");
    const block = document.createElement("div");
    const restoreInline = applyCodeTheme(inline, { theme: "light", scheme: "amber", mode: "dark", kind: "inline" });
    const restoreBlock = applyCodeTheme(block, { theme: "monokai", scheme: "green", mode: "light" });
    expect(inline.style.getPropertyValue("--scheme-inline-background")).toBe("#ffffff");
    expect(inline.style.getPropertyValue("--background")).toBe("");
    expect(inline.hasAttribute("data-theme")).toBe(false);
    expect(block.dataset.theme).toBe("dark");
    expect(block.dataset.uiTheme).toBe("light");
    expect(block.style.getPropertyValue("--scheme-code-number")).toBe("#ae81ff");
    restoreInline(); restoreBlock();
    expect(inline.style.length).toBe(0);
    expect(block.style.length).toBe(0);
    expect(block.hasAttribute("data-code-scheme")).toBe(false);
    const restoreDefault = applyCodeTheme(block, { mode: "light" });
    expect(block.dataset.codeScheme).toBe("default");
    expect(block.style.getPropertyValue("--background")).toBe(getColorScheme("default").ui.light["--background"]);
    restoreDefault();
  });
  it("rejects invalid selections before writing and supports null ref targets", () => {
    const target = document.createElement("div");
    const before = target.outerHTML;
    expect(() => applyColorScheme(target, { scheme: "unknown" as never, mode: "light" })).toThrow(/Unknown color scheme/);
    expect(() => applyCodeTheme(target, { theme: "unknown" as never, mode: "light" })).toThrow(/Unknown code theme/);
    expect(() => applyColorScheme(target, { mode: "system" as never })).toThrow(/mode/);
    expect(() => applyCodeTheme(target, { mode: "light", kind: "both" as never })).toThrow(/kind/);
    expect(target.outerHTML).toBe(before);
    applyColorScheme(null, { mode: "light" })();
    applyCodeTheme(null, { mode: "dark" })();
    expect(() => createColorSchemeCSS({ blockTheme: 'x"{}' as never })).toThrow(/Unknown code theme/);
  });
  it("keeps registries immutable and resolver results independent", () => {
    expect(Object.isFrozen(COLOR_SCHEMES)).toBe(true);
    expect(Object.isFrozen(COLOR_SCHEMES[0].ui.light)).toBe(true);
    expect(Object.isFrozen(CODE_THEMES)).toBe(true);
    const result = resolveCodeTheme(getCodeTheme("monokai"), getColorScheme("default"), "light");
    result.colors.number = "changed";
    result.tokens["--background"] = "changed";
    expect(getCodeTheme("monokai").colors!.number).toBe("#ae81ff");
    expect(getColorScheme("default").ui.light["--background"]).toBe("#ffffff");
    expect(createColorSchemeCSS()).toContain('[data-color-scheme="default"][data-theme="dark"]');
  });
});
