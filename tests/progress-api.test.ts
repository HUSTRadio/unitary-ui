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

import { EXAMPLE_SOURCE } from "../docs/site/src/examples/registry";

import { Progress, type ProgressLabelPosition } from "../src/components/ui/progress";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Progress label positions", () => {
  test("no label renders bare progress bar (backward compatible)", () => {
    const html = renderToStaticMarkup(createElement(Progress, { value: 30 }));
    expect(html).toContain('data-slot="progress"');
    expect(html).not.toContain("text-copy-13");
  });

  test("label defaults to bottom-left (label after bar, items-start)", () => {
    const html = renderToStaticMarkup(createElement(Progress, { value: 30, label: "30%" }));
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
      // 同行 + 垂直居中：flex items-center；w-full 保证包裹层在 items-start 容器中不被收缩（进度条 flex-1 才能占满）
      expect(html, pos).toContain("flex w-full items-center gap-2");
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
    for (const [pos, cls] of Object.entries(cases) as Array<[ProgressLabelPosition, string]>) {
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

describe("Progress animated transition", () => {
  test("animated defaults to true: fill has transition classes", () => {
    const html = renderToStaticMarkup(createElement(Progress, { value: 30 }));
    // 属性中 & 被转义为 &amp;；webkit 与 moz 填充伪元素均带 width+background-color 过渡
    // （变色过渡：Dynamic colors 阈值切换时填充色随宽度平滑过渡）+ reduced-motion 降级
    expect(html).toContain("[&amp;::-webkit-progress-value]:transition-[width,background-color]");
    expect(html).toContain("[&amp;::-webkit-progress-value]:duration-(--uni-duration-slow)");
    expect(html).toContain("[&amp;::-moz-progress-bar]:transition-[width,background-color]");
    expect(html).toContain("motion-reduce:transition-none");
  });

  test("animated={false} omits transition classes (instant update)", () => {
    const html = renderToStaticMarkup(createElement(Progress, { value: 30, animated: false }));
    expect(html).not.toContain("transition-[width]");
    expect(html).toContain('value="30"');
  });

  test("source declares animated prop with default true", async () => {
    const src = await read("src/components/ui/progress.tsx");
    expect(src).toContain("animated?: boolean");
    expect(src).toContain("animated = true");
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
    expect(html).toContain("flex w-full items-center gap-2");
  });
});

describe("Progress Dynamic colors demo pink band (E1)", () => {
  // 官方实测（vercel.com/geist/progress，双主题一致）：75 档 = --geist-highlight-pink = #ff0080。
  // 本地 pink 色阶无精确对应（pink-800 #d9216e 欧氏色距 53.5），2026-08-23 决定直接采用官方原值。
  test("docs Dynamic colors demo uses official highlight-pink #ff0080 verbatim", () => {
    const example = EXAMPLE_SOURCE["progress"]?.["Dynamic colors"];
    expect(example).toBeDefined();
    expect(example).toContain('75: "#ff0080"');
    expect(example).not.toContain('75: "var(--color-pink-600)"');
    expect(example).not.toContain('75: "var(--color-pink-800)"');
  });
});

describe("Progress stop ariaLabel (E4)", () => {
  test("stop ariaLabel renders as aria-label on the focusable trigger span", () => {
    const html = renderToStaticMarkup(
      createElement(Progress, {
        value: 30,
        stops: [
          { value: 10, tooltip: "10%", ariaLabel: "Build complete" },
          { value: 20, tooltip: "20%" },
        ],
      }),
    );
    expect(html).toContain('aria-label="Build complete"');
    // 无 ariaLabel 的 stop 不渲染空 aria-label
    expect(html).not.toContain('aria-label="20%"');
  });

  test("source declares optional ariaLabel on ProgressStop", async () => {
    const src = await read("src/components/ui/progress.tsx");
    expect(src).toContain("ariaLabel?: string;");
    expect(src).toContain("aria-label={stop.ariaLabel}");
  });
});
