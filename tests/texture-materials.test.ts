// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { readFileSync } from "node:fs";
import postcss from "postcss";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { collectGlobalTokens } from "../scripts/generate-token-catalog.mjs";
import { Navbar } from "../src/components/ui/navbar";
import { Toolbar, ToolbarItem } from "../src/components/ui/toolbar";
import { Menu, MenuButton, MenuContainer, MenuItem } from "../src/components/ui/menu";
import { Modal, ModalContent, ModalTitle } from "../src/components/ui/modal";
import { CalendarPanel } from "../src/components/ui/calendar-panel";
import { Tooltip } from "../src/components/ui/tooltip";
import { I18nProvider } from "../src/lib/i18n";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const css = readFileSync("src/styles/index.css", "utf8");
const stylesheet = postcss.parse(css);
let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});

describe("global functional texture materials", () => {
  it("registers material controls without adding palette colors, and bounds blur costs", () => {
    const tokens = collectGlobalTokens(css);
    for (const [name, expected, maximum] of [
      ["--material-texture-hybrid-blur", "8px", 12],
      ["--material-texture-glass-blur", "20px", 20],
      ["--material-texture-mask-blur", "8px", 8],
      ["--material-texture-control-blur", "6px", 8],
    ] as const) {
      expect(tokens[name]).toMatchObject({ kind: "runtime", group: "materials", status: "active" });
      expect(tokens[name].value).toBe(expected);
      expect(Number.parseFloat(tokens[name].value)).toBeLessThanOrEqual(maximum);
    }
    expect(tokens["--material-texture-hybrid-opacity"].value).toBe("80%");
    expect(tokens["--material-texture-glass-opacity"]).toMatchObject({
      value: "60%",
      darkValue: "74%",
    });
    for (const name of Object.keys(tokens)) {
      if (name.startsWith("--material-texture-")) expect(tokens[name].group).toBe("materials");
    }
    expect(tokens["--material-texture-glass-highlight"].darkValue).not.toBe("");
    expect(tokens["--material-texture-glass-edge"].darkValue).not.toBe("");
    expect(tokens["--material-texture-blur"]).toBeUndefined();
    expect(tokens["--material-texture-blur-opacity"]).toBeUndefined();
    expect(tokens["--material-texture-edge-opacity"]).toMatchObject({ value: "10%", darkValue: "12%" });
    expect(tokens["--material-texture-line-opacity"]).toMatchObject({ value: "18%", darkValue: "22%" });
    expect(tokens["--material-texture-mask-opacity"].value).toBe("8%");
    expect(tokens["--material-texture-mask-saturation"].value).toBe("85%");
    expect(tokens["--material-texture-mask-backdrop-opacity"]).toMatchObject({
      status: "deprecated", replacement: "--material-texture-mask-opacity",
      value: "var(--material-texture-mask-opacity)",
    });
    expect(tokens["--material-texture-control-opacity"]).toMatchObject({ value: "72%", darkValue: "80%" });
    for (const role of ["tooltip", "menu", "modal"]) {
      const token = tokens[`--material-texture-shadow-${role}`];
      expect(token.group).toBe("materials");
      for (const value of [token.value, token.darkValue]) {
        for (const layer of postcss.list.comma(value)) {
          expect(layer, `${role} shadow layers must transmit their actual backdrop`).toMatch(/rgb\([^)]*\/\s*\d+%\)/);
          expect(layer).not.toMatch(/\b(?:250|255),\s*(?:250|255),\s*(?:250|255)\b/);
        }
      }
    }
  });

  it("gates new optical effects by global declarations and actual CSS capabilities", () => {
    const enhancement = stylesheet.nodes.find(node => node.type === "atrule" &&
      node.name === "supports" && node.params.includes("backdrop-filter") && node.params.includes("color-mix"));
    expect(enhancement?.type).toBe("atrule");
    if (enhancement?.type !== "atrule") return;
    enhancement.walkRules(rule => {
      expect(rule.selector).toContain("html[data-texture=");
      expect(rule.selector).not.toContain("html[data-texture=\"solid\"]");
      expect(rule.selector).not.toMatch(/\.material-(?:base|small|large)\b/);
    });
    const accessibility = stylesheet.nodes.find(node => node.type === "atrule" &&
      node.name === "media" && node.params.includes("prefers-reduced-transparency"));
    expect(accessibility?.type).toBe("atrule");
    if (accessibility?.type !== "atrule") return;
    expect(accessibility.params).toContain("forced-colors");
    const filters: string[] = [];
    accessibility.walkDecls("backdrop-filter", decl => { filters.push(decl.value); });
    expect(filters.length).toBeGreaterThan(0);
    expect(filters.every(value => value === "none")).toBe(true);
  });

  it("leaves document surfaces flat and makes public floating utilities texture-aware", () => {
    for (const name of ["base", "small", "medium", "large", "tooltip", "menu", "modal", "fullscreen"]) {
      const utility = stylesheet.nodes.find(node => node.type === "atrule" &&
        node.name === "utility" && node.params === `material-${name}`);
      expect(utility?.type).toBe("atrule");
      if (utility?.type !== "atrule") continue;
      const backgrounds: string[] = [];
      utility.walkDecls("background-color", decl => { backgrounds.push(decl.value); });
      const floating = ["tooltip", "menu", "modal", "fullscreen"].includes(name);
      expect(backgrounds.some(value => value.includes("--material-texture-fill"))).toBe(floating);
      expect(backgrounds[0]).toMatch(/^var\(--color-bg-(?:surface|elevated)\)$/);
      const shadows: string[] = [];
      utility.walkDecls("box-shadow", decl => { shadows.push(decl.value); });
      expect(shadows[0]).toBe(`var(--material-shadow-${name})`);
      expect(shadows.some(value => value.includes("--_uni-material-shadow"))).toBe(floating);
    }
  });

  it("limits private shadow consumers to actual default owners and keeps inner canonical tokens intact", () => {
    const inEnhancement = (node: postcss.Node) => {
      let ancestor = node.parent;
      while (ancestor) {
        if (ancestor instanceof postcss.AtRule && ancestor.name === "supports") return true;
        ancestor = ancestor.parent;
      }
      return false;
    };
    const consumers: string[] = [];
    stylesheet.walkDecls(decl => {
      if (!inEnhancement(decl)) return;
      expect(decl.prop).not.toMatch(/^--(?:material-shadow-|uni-shadow-|gray-|border$)/);
      if (decl.prop !== "--tw-shadow") return;
      expect(decl.parent?.type).toBe("rule");
      if (decl.parent?.type !== "rule") return;
      expect(decl.parent.selector).toMatch(/data-material="(?:floating|navigation)"/);
      expect(decl.parent.selector).toMatch(/shadow-/);
      expect(decl.value).toContain("var(--_uni-material-shadow,");
      consumers.push(decl.parent.selector);
    });
    expect(consumers.some(selector => selector.includes("--uni-shadow-menu"))).toBe(true);
    expect(consumers.some(selector => selector.includes("--uni-shadow-modal-elevated"))).toBe(true);
    const mediumConsumers = consumers.filter(selector => selector.includes(".shadow-md"));
    const largeConsumers = consumers.filter(selector => selector.includes(".shadow-lg"));
    expect(mediumConsumers).toEqual([]);
    expect(largeConsumers).toEqual([]);

    const preference = stylesheet.nodes.find(node => node.type === "atrule" &&
      node.name === "media" && node.params.includes("prefers-reduced-transparency"));
    if (preference?.type !== "atrule") throw new Error("Missing preference fallback");
    for (const property of ["--_uni-material-shadow", "--_uni-material-border", "--_uni-material-outline", "--_uni-material-line-opacity"]) {
      const resets: string[] = [];
      preference.walkDecls(property, decl => { resets.push(decl.value); });
      expect(resets).toContain("initial");
    }
  });

  it("does not compound mask alpha and suppresses transmission for accessibility preferences", () => {
    const keyframes = (name: string) => {
      const frame = stylesheet.nodes.find(node => node.type === "atrule" &&
        node.name === "keyframes" && node.params === name);
      if (frame?.type !== "atrule") throw new Error(`Missing ${name}`);
      const values: string[] = [];
      frame.walkDecls("opacity", decl => { values.push(decl.value); });
      return values;
    };
    expect(keyframes("command-menu-overlay-in")).toEqual(["0", "0.8"]);
    expect(keyframes("command-menu-overlay-out")).toEqual(["0.8", "0"]);
    expect(keyframes("material-mask-in")).toEqual(["0", "1"]);
    expect(keyframes("material-mask-out")).toEqual(["1", "0"]);
    const rule = stylesheet.nodes.find(node => node.type === "atrule" &&
      node.name === "media" && node.params.includes("prefers-reduced-transparency"));
    if (rule?.type !== "atrule") throw new Error("Missing mask accessibility policy");
    const animations: string[] = [];
    rule.walkDecls("animation", decl => { animations.push(decl.value); });
    expect(animations).toContain("none");
    const transitions: string[] = [];
    rule.walkDecls("transition", decl => { transitions.push(decl.value); });
    expect(transitions).toContain("none");
  });

  it("marks filled navigation owners while leaving transparent Navbar and controls alone", () => {
    act(() => root.render(React.createElement(React.Fragment, null,
      React.createElement(Navbar, null, "Navigation"),
      React.createElement(Navbar, { variant: "transparent" }, "Transparent"),
      React.createElement(Toolbar, null,
        React.createElement(ToolbarItem, { label: "Save" }, "Save")),
    )));
    const headers = host.querySelectorAll("header");
    expect(headers[0].getAttribute("data-material")).toBe("navigation");
    expect(headers[1].hasAttribute("data-material")).toBe(false);
    expect(host.querySelector('[data-slot="toolbar"]')?.getAttribute("data-material")).toBe("navigation");
    expect(host.querySelector('[data-slot="toolbar-item"]')?.hasAttribute("data-material")).toBe(false);
  });

  it("keeps authored menu fill, style and native menu semantics", () => {
    act(() => root.render(React.createElement(MenuContainer, { open: true, onOpenChange: () => {} },
      React.createElement(MenuButton, null, "Actions"),
      React.createElement(Menu, { className: "bg-red-500 shadow-none border-red-500",
        style: { backgroundColor: "rebeccapurple", boxShadow: "none", borderColor: "hotpink" } },
        React.createElement(MenuItem, null, "Save")),
    )));
    const owner = document.querySelector<HTMLElement>('[data-slot="menu"]')!;
    expect(owner.getAttribute("data-material")).toBe("floating");
    expect(owner.getAttribute("role")).toBe("menu");
    expect(owner.classList.contains("bg-red-500")).toBe(true);
    expect(owner.classList.contains("bg-surface")).toBe(false);
    expect(owner.style.backgroundColor).toBe("rebeccapurple");
    expect(owner.classList.contains("shadow-none")).toBe(true);
    expect(owner.className).not.toContain("shadow-[var(--material-shadow-menu)]");
    expect(owner.style.boxShadow).toBe("none");
    expect(owner.style.borderColor).toBe("hotpink");
    expect(owner.querySelector('[role="menuitem"]')?.hasAttribute("data-material")).toBe(false);
  });

  it("keeps default Tooltip stem ownership, colored semantics and authored shadow precedence", async () => {
    for (const props of [
      { type: "default" as const, tip: true },
      { type: "default" as const, tip: false },
      { type: "warning" as const, tip: true, className: "shadow-none" },
    ]) {
      await act(async () => root.render(React.createElement(Tooltip, {
        ...props, delay: false, text: "More context",
        children: React.createElement("button", null, "Target"),
      })));
      await act(async () => host.querySelector<HTMLButtonElement>("button")?.focus());
      const owner = document.querySelector<HTMLElement>(`[data-material-surface="${props.type}"]`)!;
      expect(owner).not.toBeNull();
      expect(owner.getAttribute("data-material-stem")).toBe(props.tip ? "true" : null);
      expect(owner.querySelector('[data-slot="tooltip-tip"]') !== null).toBe(props.tip);
      expect(owner.style.getPropertyValue("--tooltip-tip-stroke")).toBe("var(--gray-alpha-400)");
      if (props.type === "warning") {
        expect(owner.style.getPropertyValue("--tooltip-background")).toBe("var(--warning)");
        expect(owner.style.getPropertyValue("--tooltip-foreground")).toBe("#0a0a0a");
        expect(owner.classList.contains("shadow-none")).toBe(true);
        expect(owner.className).not.toContain("shadow-[var(--_uni-material-shadow,");
      }
      await act(async () => root.render(null));
    }
  });

  it("preserves shadow sizes and independent shadow colors on actual Menu owners", () => {
    for (const shadow of ["shadow-md", "shadow-lg", "shadow-none"]) {
      act(() => root.render(React.createElement(MenuContainer, { open: true, onOpenChange: () => {} },
        React.createElement(MenuButton, null, "Actions"),
        React.createElement(Menu, { className: `${shadow} shadow-red-500` },
          React.createElement(MenuItem, null, "Save")),
      )));
      const owner = document.querySelector<HTMLElement>('[data-slot="menu"]')!;
      expect(owner.classList.contains(shadow)).toBe(true);
      expect(owner.classList.contains("shadow-red-500")).toBe(true);
      expect(owner.className).not.toContain("shadow-[var(--material-shadow-menu)]");
      act(() => root.render(null));
    }
  });

  it("keeps CalendarPanel date semantics while active adjacent-month dates inherit readable material text", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 15, 12));
    const onValueChange = vi.fn();
    try {
      act(() => root.render(React.createElement(I18nProvider, { locale: "en",
        children: React.createElement(CalendarPanel, {
          locale: "en-US",
          pinnedTimezone: "UTC",
          minValue: new Date(2026, 9, 1),
          maxValue: new Date(2026, 10, 4),
          value: { start: new Date(2026, 9, 10, 12), end: new Date(2026, 9, 12, 12) },
          onValueChange,
        }),
      })));
      const date = (month: number, day: number) => {
        const label = new Date(2026, month, day).toLocaleDateString("en-US");
        const cell = host.querySelector<HTMLElement>(`[role="button"][aria-label="${label}"]`);
        expect(cell, `Expected calendar date ${label}`).not.toBeNull();
        return cell!;
      };
      const materialFallback = "text-[var(--material-texture-muted,var(--gray-700))]";
      const adjacent = date(10, 1);
      expect(adjacent.classList.contains(materialFallback)).toBe(true);
      expect(adjacent.classList.contains("text-gray-700")).toBe(false);
      expect(adjacent.hasAttribute("aria-disabled")).toBe(false);

      const disabled = date(8, 30);
      expect(disabled.getAttribute("aria-disabled")).toBe("true");
      expect(disabled.classList.contains("text-gray-500")).toBe(true);
      expect(disabled.classList.contains(materialFallback)).toBe(false);

      const current = date(9, 15);
      expect(current.classList.contains("text-gray-1000")).toBe(true);
      expect(current.classList.contains(materialFallback)).toBe(false);
      const selected = date(9, 10);
      expect(selected.classList.contains("!text-[var(--calendar-range-selected-fg)]")).toBe(true);
      expect(selected.classList.contains("bg-[var(--calendar-range-selected-bg)]")).toBe(true);
      expect(selected.closest('[role="gridcell"]')?.getAttribute("aria-selected")).toBe("true");
      const range = date(9, 11);
      expect(range.classList.contains("text-[var(--calendar-range-soft-fg)]")).toBe(true);
      expect(range.classList.contains("bg-[var(--calendar-range-soft-bg)]")).toBe(true);
      expect(range.closest('[role="gridcell"]')?.getAttribute("aria-selected")).toBe("true");

      act(() => disabled.dispatchEvent(new MouseEvent("click", { bubbles: true })));
      expect(onValueChange).not.toHaveBeenCalled();
      act(() => adjacent.dispatchEvent(new MouseEvent("click", { bubbles: true })));
      expect(onValueChange).toHaveBeenCalledWith({ start: new Date(2026, 10, 1), end: null });
    } finally {
      vi.useRealTimers();
    }
  });

  it("separates Modal mask and foreground material without moving the dialog DOM", () => {
    act(() => root.render(React.createElement(Modal, { open: true },
      React.createElement(ModalContent, { "aria-describedby": undefined },
        React.createElement(ModalTitle, null, "Confirm")),
    )));
    const dialog = document.querySelector<HTMLElement>('[data-slot="modal-content"]')!;
    expect(dialog.getAttribute("role")).toBe("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("data-material")).toBe("floating");
    expect(dialog.parentElement?.getAttribute("data-material")).toBe("mask-backdrop");
    expect(dialog.parentElement?.className).toContain("bg-[var(--uni-overlay-backdrop)]");
    expect(dialog.parentElement?.className).not.toMatch(/(?:^|\s)opacity-/);
  });
});
