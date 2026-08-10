import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Input official API contract (G06 audit fixes)", () => {
  test("G06-INPUT-01: sizes are small/default/large mapped to h-8/h-9/h-10, no 'medium'", async () => {
    const src = await read("src/components/ui/input.tsx");
    // Size name union is small | default | large (official has no 'medium')
    expect(src).toMatch(/InputSize\s*=\s*"small"\s*\|\s*"default"\s*\|\s*"large"/);
    // No "medium" size name anywhere (font-medium is a font-weight class, allowed)
    expect(src).not.toMatch(/["']medium["']/);
    // Height map: small -> h-8 (32px), default -> h-9 (36px), large -> h-10 (40px)
    expect(src).toMatch(/size === "small" \? "h-8"/);
    expect(src).toMatch(/size === "large" \? "h-10"/);
    expect(src).toMatch(/"h-9"/);
    // Default size prop is "default" (36px), NOT "medium" (32px)
    expect(src).toMatch(/size = "default"/);
    // The fallback (no size / unknown) must not be h-8
    expect(src).not.toMatch(/size === "large" \? "h-10" : "h-8"/);
  });

  test("G06-INPUT-02: prefix/suffix/rounded/prefixStyling/suffixStyling props with correct render order", async () => {
    const src = await read("src/components/ui/input.tsx");
    expect(src).toMatch(/prefix\??:/);
    expect(src).toMatch(/suffix\??:/);
    expect(src).toMatch(/prefixStyling\??:/);
    expect(src).toMatch(/suffixStyling\??:/);
    expect(src).toMatch(/rounded\??:/);
    // prefix renders before input content, suffix after (inner input is the last data-slot="input")
    const prefixSlot = src.indexOf('data-slot="input-prefix"');
    const inputSlot = src.lastIndexOf('data-slot="input"');
    const suffixSlot = src.indexOf('data-slot="input-suffix"');
    expect(prefixSlot).toBeGreaterThan(-1);
    expect(suffixSlot).toBeGreaterThan(-1);
    expect(inputSlot).toBeGreaterThan(-1);
    expect(prefixSlot).toBeLessThan(inputSlot);
    expect(inputSlot).toBeLessThan(suffixSlot);
  });

  test("G06-INPUT-03: label prop renders an associated <label htmlFor>", async () => {
    const src = await read("src/components/ui/input.tsx");
    expect(src).toMatch(/label\??:/);
    expect(src).toMatch(/<label/);
    expect(src).toMatch(/htmlFor/);
    expect(src).toMatch(/data-slot="input-label"/);
  });

  test("G06-INPUT-04: large size radius is rounded-lg (8px), small/default stay 6px", async () => {
    const src = await read("src/components/ui/input.tsx");
    expect(src).toMatch(/size === "large" \? "rounded-lg"/);
    expect(src).toContain("rounded-lg");
    expect(src).toContain("rounded-[6px]");
  });

  test("G06-INPUT-06: error alert is mt-2 (8px) with color #cb2a2f", async () => {
    const src = await read("src/components/ui/input.tsx");
    const alertStart = src.indexOf('role="alert"');
    expect(alertStart).toBeGreaterThan(-1);
    const alertBlock = src.slice(alertStart, alertStart + 500);
    expect(alertBlock).toMatch(/mt-2/);
    expect(alertBlock).not.toMatch(/mt-1\b/);
    expect(alertBlock).toMatch(/#cb2a2f/);
  });

  test("slider.tsx stays compatible with the Input API change", async () => {
    const slider = await read("src/components/ui/slider.tsx");
    expect(slider).toMatch(/from "@\/components\/ui\/input"/);
    // Slider's ValueInput must not rely on the removed 'medium' size name
    expect(slider).not.toMatch(/size=/);
    expect(slider).not.toContain("medium");
  });
});
