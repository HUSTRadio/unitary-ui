import { describe, expect, test, vi } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Slider } from "../src/components/ui/slider";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");
const renderSlider = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(Slider, props));

describe("Slider live Geist contract", () => {
  test("documents all five live demos", async () => {
    const docs = await read("docs/geist/src/components/docs-components-page.tsx");
    const manifest = await read("tests/audit/geist-audit-manifest.json");

    for (const id of [
      "default",
      "with-label",
      "range-with-inputs",
      "disabled-range-with-inputs",
      "commit-on-release",
    ]) {
      expect(docs).toContain(`id: "${id}"`);
      expect(manifest).toContain(`"id": "${id}"`);
    }
  });

  test("uses the live 8px track and 6 by 14px rectangular thumb geometry", async () => {
    const source = await read("src/components/ui/slider.tsx");

    expect(source).toContain('data-slot="slider"');
    expect(source).toContain('data-slot="slider-track"');
    expect(source).toContain('data-slot="slider-indicator"');
    expect(source).toContain('data-slot="slider-thumb"');
    expect(source).toContain("min-w-54");
    expect(source).toContain("h-2 min-w-54");
    expect(source).toContain("h-2 grow rounded-full bg-gray-200");
    expect(source).toContain("[&>span:has([data-slot=slider-thumb])]:-top-[3px]");
    expect(source).toContain("h-3.5 w-1.5 shrink-0 rounded-[1px]");
    expect(source).toContain("ring-1 ring-gray-alpha-500");
    expect(source).toContain("transition-[scale] duration-100");
    expect(source).not.toContain("size-4 rounded-full border-2");
  });

  test("uses the official group, control, track hierarchy and disabled ARIA", () => {
    const enabled = renderSlider({ defaultValue: [50], "aria-label": "Volume" });
    const disabled = renderSlider({ defaultValue: [50], disabled: true, "aria-label": "Volume" });

    expect(enabled).toMatch(
      /data-slot="slider"[^>]*role="group"|role="group"[^>]*data-slot="slider"/,
    );
    expect(enabled).toContain('data-slot="slider-control"');
    expect(enabled.indexOf('data-slot="slider-control"')).toBeGreaterThan(
      enabled.indexOf('data-slot="slider"'),
    );
    const enabledGroup = enabled.match(/<[^>]+data-slot="slider"[^>]*>/)?.[0];
    const disabledGroup = disabled.match(/<[^>]+data-slot="slider"[^>]*>/)?.[0];
    expect(enabledGroup).not.toContain('aria-disabled="false"');
    expect(disabledGroup).toContain('aria-disabled="true"');
  });

  test("renders one thumb by default and two thumbs for a range", () => {
    const single = renderSlider({ defaultValue: [50], "aria-label": "Volume" });
    const range = renderSlider({
      defaultValue: [50, 75],
      showStartInput: true,
      showEndInput: true,
      "aria-label": "Range",
    });

    expect(single.match(/data-slot="slider-thumb"/g)).toHaveLength(1);
    expect(range.match(/data-slot="slider-thumb"/g)).toHaveLength(2);
    expect(range).toContain('aria-label="Starting range value"');
    expect(range).toContain('aria-label="Ending range value"');
  });

  test("uses 48px value inputs and propagates disabled state", async () => {
    const source = await read("src/components/ui/slider.tsx");
    const markup = renderSlider({
      defaultValue: [50, 75],
      showStartInput: true,
      showEndInput: true,
      disabled: true,
      "aria-label": "Range",
    });

    expect(source).toContain('className="w-12 shrink-0');
    expect(source).toContain('size="small"');
    expect(markup.match(/disabled=""/g)?.length).toBeGreaterThanOrEqual(3);
    expect(markup).toContain('data-slot="slider"');
  });

  test("renders the official label and maps release commits to Radix", async () => {
    const source = await read("src/components/ui/slider.tsx");
    const committed = vi.fn();
    const markup = renderSlider({
      defaultValue: [50],
      label: "Drag then release",
      onValueCommitted: committed,
    });

    expect(markup).toContain("Drag then release");
    expect(source).toContain("onValueCommit={onValueCommitted}");
  });
});
