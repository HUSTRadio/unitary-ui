import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

import { Toggle } from "../src/components/ui/toggle";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

const toggle = (props: React.ComponentProps<typeof Toggle>) =>
  renderToStaticMarkup(React.createElement(Toggle, props));

describe("Toggle official API contract (G12)", () => {
  test("G12-TOGGLE-01: color=red uses theme-aware token in checked and unchecked states", async () => {
    const src = await read("src/components/ui/toggle.tsx");
    // Live Geist custom-color demo keeps the red track while unchecked; both states use the theme token.
    expect(src).toContain(
      "data-[state=checked]:bg-[var(--toggle-checked-red)] data-[state=unchecked]:bg-[var(--toggle-checked-red)]",
    );
    expect(src).not.toMatch(/color === "red"[\s\S]{0,180}bg-destructive/);
  });

  test("G12-TOGGLE-01: --toggle-checked-red is #f87275 in light and #e5484d in dark", async () => {
    const css = await read("src/styles/index.css");
    const darkMarker = ".dark,";
    const lightSection = css.slice(0, css.indexOf(darkMarker));
    const darkSection = css.slice(css.indexOf(darkMarker));

    // Light theme (official measured #f87275 / red-400)
    expect(lightSection).toMatch(/--toggle-checked-red:\s*#f87275/);
    expect(lightSection).not.toMatch(/--toggle-checked-red:\s*#e5484d/);
    // Dark theme (official measured #e5484d / red-600)
    expect(darkSection).toMatch(/--toggle-checked-red:\s*#e5484d/);
    expect(darkSection).not.toMatch(/--toggle-checked-red:\s*#f87275/);
  });

  test("G12-TOGGLE-01: SSR renders the checked red toggle with the theme-aware class", () => {
    const markup = toggle({ color: "red", checked: true, "aria-label": "Enable Firewall" });
    expect(markup).toContain('data-state="checked"');
    expect(markup).toContain("data-[state=checked]:bg-[var(--toggle-checked-red)]");
    expect(markup).not.toContain("bg-destructive");
  });

  test("G12-TOGGLE-01: blue is checked-only; amber keeps its custom color in both states", async () => {
    const src = await read("src/components/ui/toggle.tsx");
    expect(src).toMatch(
      /color === "blue" && "data-\[state=checked\]:bg-\[var\(--toggle-checked\)\]"/,
    );
    expect(src).toContain("data-[state=checked]:bg-warning data-[state=unchecked]:bg-warning");

    const blueMarkup = toggle({ color: "blue", checked: true, "aria-label": "Enable Firewall" });
    expect(blueMarkup).toContain("data-[state=checked]:bg-[var(--toggle-checked)]");
    const amberMarkup = toggle({ color: "amber", checked: false, "aria-label": "Enable Firewall" });
    expect(amberMarkup).toContain("data-[state=unchecked]:bg-warning");
  });

  test("G12-TOGGLE-02: with-label uses the measured 12px/18px/500 theme-aware style", async () => {
    const [src, css, manifestSource] = await Promise.all([
      read("src/components/ui/toggle.tsx"),
      read("src/styles/index.css"),
      read("tests/audit/geist-audit-manifest.json"),
    ]);
    const manifest = JSON.parse(manifestSource);
    const toggleComponent = manifest.components.find(
      (component: { slug: string }) => component.slug === "toggle",
    );
    const toggleContract = toggleComponent.acceptanceContracts.find(
      (contract: { demoId: string }) => contract.demoId === "with-label",
    );
    expect(src).toContain("text-toggle-label");
    expect(css).toContain("--toggle-label: #666666");
    expect(css).toContain("--toggle-label: #888888");
    expect(css).toMatch(
      /@utility text-toggle-label \{[\s\S]*?font-size: 0\.75rem;[\s\S]*?line-height: 1\.125rem;[\s\S]*?font-weight: 500;/,
    );
    expect(toggleContract.roles["toggle-label"].selectors.default.local).toBe(
      '[data-demo-container="with-label"] label > span:first-child',
    );
  });

  test("G12-TOGGLE-02: default label order is text then control with official padding and gap", () => {
    const markup = toggle({ checked: false, children: "Enable Firewall" });
    const labelText = markup.indexOf(">Enable Firewall</span>");
    const control = markup.indexOf('data-slot="toggle"');

    expect(markup).toContain("gap-3");
    expect(markup).toContain("py-[3px]");
    expect(labelText).toBeGreaterThan(-1);
    expect(control).toBeGreaterThan(-1);
    expect(labelText).toBeLessThan(control);
  });

  test("G12-TOGGLE-02: unlabeled controls keep the official 20/26/30px line boxes", () => {
    const small = toggle({ checked: false });
    expect(small).toContain('data-slot="toggle-line"');
    expect(small).toContain("flex items-center");
    expect(small).not.toContain("inline-flex items-center");
    expect(small).toContain("h-5");
    expect(toggle({ checked: false, size: "medium" })).toContain("h-[26px]");
    expect(toggle({ checked: false, size: "large" })).toContain("h-[30px]");
  });

  test("G12-TOGGLE-03: sizes demo gives all three variants equal-width columns", async () => {
    const docs = await read("docs/geist/src/components/docs-components-page.tsx");
    const toggleStart = docs.indexOf("function ToggleDemo(");
    const toggleEnd = docs.indexOf("function TooltipDemo(", toggleStart);
    const toggleDemo = docs.slice(toggleStart, toggleEnd);
    const sizesStart = toggleDemo.indexOf('data-demo-card="sizes"');
    const sizesEnd = toggleDemo.indexOf("<ShowCodeFooter", sizesStart);
    const sizesDemo = toggleDemo.slice(sizesStart, sizesEnd);

    expect(toggleStart).toBeGreaterThan(-1);
    expect(toggleEnd).toBeGreaterThan(toggleStart);
    expect(sizesStart).toBeGreaterThan(-1);
    expect(sizesEnd).toBeGreaterThan(sizesStart);
    expect(sizesDemo).toContain('className="flex flex-row flex-wrap"');
    expect(sizesDemo.match(/className="flex-1"/g)).toHaveLength(3);
  });

  test("G12-TOGGLE-03: vertical demos stack line boxes without additional row gaps", async () => {
    const docs = await read("docs/geist/src/components/docs-components-page.tsx");
    const toggleStart = docs.indexOf("function ToggleDemo(");
    const toggleEnd = docs.indexOf("function TooltipDemo(", toggleStart);
    const toggleDemo = docs.slice(toggleStart, toggleEnd);

    expect(toggleDemo.match(/className="flex flex-col"/g)).toHaveLength(3);
    expect(toggleDemo).not.toContain('className="flex flex-col gap-4"');
    expect(toggleDemo).toContain('className="flex flex-col items-start justify-start gap-4"');
  });

  test("G12-TOGGLE-01: Toggle exports and supports size/color/labelCasing/direction props", async () => {
    const src = await read("src/components/ui/toggle.tsx");
    expect(src).toMatch(/export\s*\{\s*Toggle\s*\}/);
    expect(src).toMatch(/color\?: "blue" \| "amber" \| "red"/);
    expect(src).toMatch(/size\?: "small" \| "medium" \| "large"/);
    expect(src).toMatch(/labelCasing\?: "title" \| "normal"/);
    expect(src).toMatch(/direction\?: "ltr" \| "rtl"/);
  });
});
