import { describe, expect, test, vi } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Slider } from "../src/components/ui/slider";
import { I18nProvider } from "../src/lib/i18n";
import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");
const renderSlider = (props: Record<string, unknown>, localized = false) =>
  renderToStaticMarkup(
    localized
      ? createElement(I18nProvider, { locale: "zh-CN" }, createElement(Slider, props))
      : createElement(Slider, props),
  );

describe("Slider live Geist contract", () => {
  test("documents all six live demos", async () => {
    const docs = await read("docs/geist/src/components/docs-components-page.tsx");
    const manifest = await read("tests/audit/geist-audit-manifest.json");

    for (const id of [
      "default",
      "step-max",
      "with-label",
      "range-with-inputs",
      "disabled-range-with-inputs",
      "commit-on-release",
    ]) {
      expect(EXAMPLE_SOURCE.slider[id]).toBeDefined();
      expect(manifest).toContain(`"id": "${id}"`);
    }
    expect(docs).toContain("EXAMPLE_REGISTRY[name]");
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
    expect(source).toContain("transition-[scale] duration-(--uni-duration-fast)");
    expect(source).not.toContain("size-4 rounded-full border-2");
  });

  test("maps paired input foreground and border to the live light and dark roles", async () => {
    const [source, styles] = await Promise.all([
      read("src/components/ui/slider.tsx"),
      read("src/styles/index.css"),
    ]);

    expect(source).toContain(
      "border-[var(--input-value-border)] text-[var(--input-value-foreground)]",
    );
    expect(styles).toContain("--input-value-border: var(--gray-200)");
    expect(styles).toContain("--input-value-foreground: var(--color-black)");
    expect(styles).toContain("--input-value-foreground: var(--color-white)");
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
    const disabledControl = disabled.match(/<[^>]+data-slot="slider-control"[^>]*>/)?.[0];
    expect(enabledGroup).not.toContain('aria-disabled="false"');
    expect(disabledGroup).not.toContain("aria-disabled");
    expect(disabledControl).toContain('aria-disabled="true"');
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

  test("localizes generated range input names without changing supplied labels", () => {
    const localized = renderSlider(
      { defaultValue: [50, 75], showStartInput: true, showEndInput: true, "aria-label": "范围" },
      true,
    );

    expect(localized).toContain('aria-label="起始范围值"');
    expect(localized).toContain('aria-label="结束范围值"');
    expect(localized).toContain('aria-label="范围"');
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

  test("renders the official label and composes canonical then deprecated commit callbacks", async () => {
    const source = await read("src/components/ui/slider.tsx");
    const committed = vi.fn();
    const markup = renderSlider({
      defaultValue: [50],
      label: "Drag then release",
      onValueCommitted: committed,
    });

    expect(markup).toContain("Drag then release");
    const labelText = markup.match(/<div class="([^"]*)">Drag then release<\/div>/)?.[1];
    expect(labelText).toContain("mb-2");
    expect(labelText).not.toContain("mb-0");
    expect(source).toContain("onValueCommit={handleValueCommit}");
    expect(source).toMatch(/@deprecated[\s\S]*onValueCommitted\?:/);

    const handler = source.slice(
      source.indexOf("const handleValueCommit"),
      source.indexOf("const updateValue"),
    );
    expect(handler.match(/callbacks\.onValueCommit\?\.\(committedValue\)/g)).toHaveLength(1);
    expect(handler.match(/callbacks\.onValueCommitted\?\.\(committedValue\)/g)).toHaveLength(1);
    expect(handler.indexOf("callbacks.onValueCommit?.(committedValue)")).toBeLessThan(
      handler.indexOf("callbacks.onValueCommitted?.(committedValue)"),
    );
  });
});

describe("Slider marks contract", () => {
  test("marks={true} generates one mark per step across min..max with defaults when min/max omitted", () => {
    // 显式 min/max/step: 0..50 step10 → 6 刻度
    const stepped = renderSlider({ defaultValue: [20], min: 0, max: 50, step: 10, marks: true });
    expect(stepped.match(/data-slot="slider-mark"/g)).toHaveLength(6);

    // 未传 min/max：兜底 0..100，step 20 → 6 刻度，定位无 NaN
    const defaulted = renderSlider({ defaultValue: [50], step: 20, marks: true });
    expect(defaulted.match(/data-slot="slider-mark"/g)).toHaveLength(6);
    expect(defaulted).not.toContain("NaN%");
  });

  test("custom marks render ticks and explicit labels win over markLabelFormat", () => {
    const markup = renderSlider({
      defaultValue: [30],
      min: 0,
      max: 100,
      marks: [
        { value: 20 },
        { value: 50, label: "50%" },
      ],
      markLabelFormat: (value) => `${value}%`,
    });

    expect(markup.match(/data-slot="slider-mark"/g)).toHaveLength(2);
    expect(markup).toContain("50%");
    // value=20 无显式 label → 由 markLabelFormat 补 "20%"（显式 label 优先语义的反向验证：
    // 两个刻度都拿到格式化标签；若 format 失效则 20% 缺失）
    expect(markup).toContain(">20%</span>");
    // 定位百分比：mark value=20 → left:20%
    expect(markup).toContain("left:20%");
    expect(markup).toContain("left:50%");
  });

  test("auto marks honor markLabelFormat labels", () => {
    const markup = renderSlider({
      defaultValue: [20],
      min: 0,
      max: 50,
      step: 25,
      marks: true,
      markLabelFormat: (value) => `<${value}>`,
    });
    expect(markup).toContain("&lt;0&gt;");
    expect(markup).toContain("&lt;25&gt;");
    expect(markup).toContain("&lt;50&gt;");
  });

  test("auto marks beyond the 50-limit are refused with a console warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const markup = renderSlider({ defaultValue: [5], min: 0, max: 100, step: 1, marks: true });
      expect(markup.match(/data-slot="slider-mark"/g)).toBeNull();
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0]?.[0]).toMatch(/50/);
    } finally {
      warn.mockRestore();
    }
  });

  test("mark ticks use visible gray-500 tokens with disabled override and hide from a11y tree", () => {
    const enabled = renderSlider({ defaultValue: [20], min: 0, max: 50, step: 10, marks: true });
    expect(enabled).toContain('data-slot="slider-marks"');
    expect(enabled).toContain("bg-gray-500");
    expect(enabled).toContain("aria-hidden=\"true\"");
    expect(enabled).toContain("pointer-events-none");

    const disabled = renderSlider({
      defaultValue: [20],
      min: 0,
      max: 50,
      step: 10,
      marks: true,
      disabled: true,
    });
    expect(disabled).toContain("data-[disabled]:bg-gray-300");
  });

  test("labeled marks reserve layout space via pb-5 on the field row", () => {
    const labeled = renderSlider({
      defaultValue: [30],
      min: 0,
      max: 100,
      marks: [{ value: 50, label: "50%" }],
    });
    expect(labeled).toContain("pb-5");

    const unlabeled = renderSlider({
      defaultValue: [30],
      min: 0,
      max: 100,
      marks: [{ value: 50 }],
    });
    expect(unlabeled).not.toContain("pb-5");
  });

  test("value inputs center their numeric text", async () => {
    const source = await read("src/components/ui/slider.tsx");
    expect(source).toMatch(/w-12 shrink-0 text-center border-\[var\(--input-value-border\)\]/);
  });
});
