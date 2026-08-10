import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ClearableInput } from "../src/components/ui/clearable-input";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

const renderClearableInput = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(ClearableInput, props));

describe("ClearableInput official API contract (G02 audit fixes)", () => {
  test("G02-CLI-01: clear button is an INLINE full-height right segment, not an absolute 32x32 float", async () => {
    const src = await read("src/components/ui/clearable-input.tsx");
    // Inline segment contract: px-2.5 + rounded-r-md + h-full inside the bordered wrapper
    expect(src).toMatch(/px-2\.5/);
    expect(src).toMatch(/rounded-r-md/);
    expect(src).toMatch(/h-full/);
    // No absolute positioning and no 32x32 (size-8) floating button
    expect(src).not.toMatch(/absolute/);
    expect(src).not.toMatch(/size-8/);
    // No right-padding hack reserving space for a floating button
    expect(src).not.toMatch(/pr-10/);
    expect(src).not.toMatch(/pr-9/);
  });

  test("G02-CLI-01: button renders after the input inside the same ring-bordered wrapper", () => {
    const markup = renderClearableInput({
      "aria-label": "Demo",
      value: "hello geist",
      onChange: () => {},
    });
    const wrapperSlot = markup.indexOf('data-slot="clearable-input-wrapper"');
    const inputSlot = markup.indexOf('data-slot="input"');
    const buttonSlot = markup.indexOf('aria-label="Clear input"');
    expect(wrapperSlot).toBeGreaterThan(-1);
    expect(inputSlot).toBeGreaterThan(wrapperSlot);
    expect(buttonSlot).toBeGreaterThan(inputSlot);
  });

  test("G02-CLI-01: rendered button carries the official inline-segment classes", () => {
    const markup = renderClearableInput({
      "aria-label": "Demo",
      value: "hello geist",
      onChange: () => {},
    });
    const button = markup.slice(markup.indexOf('aria-label="Clear input"'));
    expect(button).toMatch(/px-2\.5/);
    expect(button).toMatch(/rounded-r-md/);
    expect(button).toMatch(/h-full/);
    expect(button).toMatch(/pointer-coarse:hidden/);
    expect(button).not.toMatch(/absolute/);
  });

  test("G02-CLI-02: clear button is hidden on coarse pointers (pointer-coarse:hidden)", async () => {
    const src = await read("src/components/ui/clearable-input.tsx");
    expect(src).toMatch(/pointer-coarse:hidden/);
    // The wrapper still provides the ring border + focus-within ring (input border geometry)
    expect(src).toMatch(/border-gray-alpha-400/);
    expect(src).toMatch(/focus-within/);
  });

  test("clear button is hidden when the value is empty", () => {
    const markup = renderClearableInput({ "aria-label": "Demo", value: "" });
    expect(markup).not.toContain('aria-label="Clear input"');
  });

  test("controlled value renders and shows the clear button", () => {
    const markup = renderClearableInput({
      "aria-label": "Demo",
      value: "geist-style-framework",
      onChange: () => {},
    });
    expect(markup).toContain('value="geist-style-framework"');
    expect(markup).toContain('aria-label="Clear input"');
  });

  test("uncontrolled defaultValue renders and shows the clear button", () => {
    const markup = renderClearableInput({ defaultValue: "Project A" });
    expect(markup).toContain('value="Project A"');
    expect(markup).toContain('aria-label="Clear input"');
  });

  test("Escape resets the value (official headline behavior) and onClear is wired", async () => {
    const src = await read("src/components/ui/clearable-input.tsx");
    // Manual Escape handler is required (plain text input, not type=search)
    expect(src).toMatch(/onKeyDown/);
    expect(src).toMatch(/Escape/);
    expect(src).toMatch(/onClear/);
  });
});
