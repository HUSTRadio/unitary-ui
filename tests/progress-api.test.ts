/**
 * Progress 契约测试：label/labelPosition API + 动态更新（受控 value）。
 * 渲染断言（renderToStaticMarkup）+ 源码断言双轨。
 */
import { describe, expect, test } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Progress } from "../src/components/ui/progress";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Progress label positions", () => {
  test("no label renders bare progress bar (backward compatible)", () => {
    const html = renderToStaticMarkup(createElement(Progress, { value: 30 }));
    expect(html).toContain('data-slot="progress"');
    expect(html).not.toContain("text-copy-13");
  });

  test("label defaults to bottom-left (label after bar, items-start)", () => {
    const html = renderToStaticMarkup(
      createElement(Progress, { value: 30, label: "30%" }),
    );
    expect(html).toContain("text-copy-13");
    expect(html).toContain("flex-col gap-1.5 items-start");
    // bar 在 label 前（bottom 位置：条在上、字在下）
    expect(html.indexOf('data-slot="progress"')).toBeLessThan(html.indexOf("30%"));
  });

  const POSITIONS = [
    "left",
    "right",
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ] as const;

  test("all 8 label positions render", () => {
    for (const pos of POSITIONS) {
      const html = renderToStaticMarkup(
        createElement(Progress, { value: 30, label: "30%", labelPosition: pos }),
      );
      expect(html, pos).toContain('data-slot="progress"');
      expect(html, pos).toContain("30%");
    }
  });

  test("left/right use inline row with items-center (vertical alignment)", () => {
    for (const pos of ["left", "right"] as const) {
      const html = renderToStaticMarkup(
        createElement(Progress, { value: 30, label: "30%", labelPosition: pos }),
      );
      // 同行 + 垂直居中：flex items-center
      expect(html, pos).toContain("flex items-center gap-2");
      // 进度条占剩余宽度
      expect(html, pos).toContain("min-w-0 flex-1");
    }
  });

  test("left places label before bar; right places label after bar", () => {
    const leftHtml = renderToStaticMarkup(
      createElement(Progress, { value: 30, label: "30%", labelPosition: "left" }),
    );
    const rightHtml = renderToStaticMarkup(
      createElement(Progress, { value: 30, label: "30%", labelPosition: "right" }),
    );
    // left: label 先于 bar
    expect(leftHtml.indexOf("30%")).toBeLessThan(leftHtml.indexOf('data-slot="progress"'));
    // right: bar 先于 label
    expect(rightHtml.indexOf('data-slot="progress"')).toBeLessThan(rightHtml.indexOf("30%"));
  });

  test("top-* places label before bar; bottom-* places label after bar", () => {
    for (const pos of ["top-center", "bottom-center"] as const) {
      const html = renderToStaticMarkup(
        createElement(Progress, { value: 30, label: "30%", labelPosition: pos }),
      );
      const labelIdx = html.indexOf("30%");
      const barIdx = html.indexOf('data-slot="progress"');
      if (pos.startsWith("top")) {
        expect(labelIdx).toBeLessThan(barIdx);
      } else {
        expect(barIdx).toBeLessThan(labelIdx);
      }
    }
  });

  test("horizontal alignment classes per position suffix", () => {
    const cases = {
      "top-left": "items-start",
      "top-center": "items-center",
      "top-right": "items-end",
      "bottom-left": "items-start",
      "bottom-center": "items-center",
      "bottom-right": "items-end",
    } as const;
    for (const [pos, cls] of Object.entries(cases)) {
      const html = renderToStaticMarkup(
        createElement(Progress, { value: 30, label: "30%", labelPosition: pos }),
      );
      expect(html, pos).toContain(cls);
    }
  });
});

describe("Progress dynamic update (controlled value)", () => {
  test("re-render with new value reflects in progress value attribute", () => {
    const v1 = renderToStaticMarkup(createElement(Progress, { value: 10 }));
    const v2 = renderToStaticMarkup(createElement(Progress, { value: 90 }));
    expect(v1).toContain('value="10"');
    expect(v2).toContain('value="90"');
  });

  test("source exports single controlled Progress (no internal state)", async () => {
    const src = await read("src/components/ui/progress.tsx");
    // 受控组件：value 直接来自 props，无内部 useState 驱动 value
    expect(src).toContain("value={value ?? undefined}");
    expect(src).not.toMatch(/useState[^)]*\)[^;]*value/);
    // label API 存在
    expect(src).toContain("labelPosition?: ProgressLabelPosition");
  });
});

describe("Progress stops compatibility with labels", () => {
  test("stops + left label renders core wrapper with flex-1", () => {
    const html = renderToStaticMarkup(
      createElement(Progress, {
        value: 30,
        label: "30%",
        labelPosition: "left",
        stops: [{ value: 50, tooltip: "50%" }],
      }),
    );
    expect(html).toContain("relative");
    expect(html).toContain("min-w-0 flex-1");
    expect(html).toContain("flex items-center gap-2");
  });
});
