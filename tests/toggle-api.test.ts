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
  test("G12-TOGGLE-01: color=red checked uses theme-aware --toggle-checked-red token", async () => {
    const src = await read("src/components/ui/toggle.tsx");
    // Red variant must consume the theme-aware token, not bg-destructive (var(--danger) = #e5484d both themes)
    expect(src).toMatch(
      /color === "red" && "data-\[state=checked\]:bg-\[var\(--toggle-checked-red\)\]"/,
    );
    expect(src).not.toMatch(/color === "red"[\s\S]{0,120}bg-destructive/);
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

  test("G12-TOGGLE-01: blue and amber variants keep their official tokens", async () => {
    const src = await read("src/components/ui/toggle.tsx");
    expect(src).toMatch(
      /color === "blue" && "data-\[state=checked\]:bg-\[var\(--toggle-checked\)\]"/,
    );
    expect(src).toMatch(/color === "amber" && "data-\[state=checked\]:bg-warning"/);

    const blueMarkup = toggle({ color: "blue", checked: true, "aria-label": "Enable Firewall" });
    expect(blueMarkup).toContain("data-[state=checked]:bg-[var(--toggle-checked)]");
    const amberMarkup = toggle({ color: "amber", checked: true, "aria-label": "Enable Firewall" });
    expect(amberMarkup).toContain("data-[state=checked]:bg-warning");
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
