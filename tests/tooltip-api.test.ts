import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Tooltip official single-track API contract", () => {
  test("tooltip.tsx exports Tooltip", async () => {
    const src = await read("src/components/ui/tooltip.tsx");
    expect(src).toMatch(/export\s*\{\s*Tooltip\s*\}/);
  });

  test("Tooltip supports the official prop surface", async () => {
    const src = await read("src/components/ui/tooltip.tsx");
    for (const prop of [
      "text",
      "position",
      "boxAlign",
      "delay",
      "tip",
      "center",
      "type",
      "disableTriggers",
      "className",
    ]) {
      expect(src).toMatch(new RegExp(`${prop}\\??:`));
    }
    // position values: top/bottom/left/right
    expect(src).toMatch(/type TooltipPosition = "top" \| "bottom" \| "left" \| "right";/);
    // boxAlign values: left/center/right
    expect(src).toMatch(/type TooltipBoxAlign = "left" \| "center" \| "right";/);
    // type values include the official custom types
    expect(src).toMatch(
      /type TooltipType = "default" \| "success" \| "error" \| "warning" \| "violet";/,
    );
  });

  test("G12-TOOLTIP-01: default surface uses normal surface (light bg #ffffff fg #171717; dark bg #0a0a0a fg #ededed)", async () => {
    const src = await read("src/components/ui/tooltip.tsx");
    // Default references the normal page surface, not the inverted tokens
    // (official measured: bg var(--ds-background-100) + gray-1000 text)
    expect(src).toMatch(
      /default:\s*\{\s*background:\s*"var\(--background-100\)",\s*foreground:\s*"var\(--foreground\)"/,
    );
    expect(src).not.toMatch(/default:\s*\{\s*background:\s*"var\(--invert-background\)"/);
  });

  test("theme defines the inverted surface tokens for both themes", async () => {
    const css = await read("src/styles/index.css");
    // Light theme (":root"): bg #0a0a0a, fg #ededed
    expect(css).toMatch(/--invert-background:\s*#0a0a0a;/);
    expect(css).toMatch(/--invert-foreground:\s*#ededed;/);
    // Dark theme (".dark"): bg white, fg #0a0a0a
    expect(css).toMatch(/--invert-background:\s*#ffffff;/);
    expect(css).toMatch(/--invert-foreground:\s*#0a0a0a;/);
  });

  test("tooltip content and custom SVG arrow both use --tooltip-background so the surface stays consistent", async () => {
    const src = await read("src/components/ui/tooltip.tsx");
    expect(src).toMatch(/bg-\[var\(--tooltip-background\)\]/);
    expect(src).toMatch(/text-\[var\(--tooltip-foreground\)\]/);
    expect(src).toMatch(/fill="var\(--tooltip-background\)"/);
    expect(src).toMatch(/stroke="var\(--tooltip-tip-stroke\)"/);
  });

  test("typed variants (success/error/warning/violet) are preserved", async () => {
    const src = await read("src/components/ui/tooltip.tsx");
    expect(src).toMatch(/success:\s*\{\s*background:\s*"var\(--success\)"/);
    expect(src).toMatch(/error:\s*\{\s*background:\s*"var\(--destructive\)"/);
    expect(src).toMatch(/warning:\s*\{\s*background:\s*"var\(--warning\)"/);
    expect(src).toMatch(/violet:\s*\{\s*background:\s*"var\(--purple-700\)"/);
  });

  test("surface and behavior stay at official parity (250px, radius 8px, no shadow, sideOffset 10, ~150ms delay)", async () => {
    const src = await read("src/components/ui/tooltip.tsx");
    expect(src).toMatch(/max-w-\[250px\]/);
    expect(src).toMatch(/rounded-\[8px\]/);
    expect(src).not.toMatch(/shadow-\[var\(--material-shadow-tooltip\)\]/);
    expect(src).toMatch(/sideOffset=\{10\}/);
    expect(src).toMatch(/delay \? 150 : 0/);
  });
});
