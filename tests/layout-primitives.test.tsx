import * as React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SafeArea, Stack, type LayoutSpacing } from "../src/components/ui/layout";

/**
 * 布局原语行为契约（替代源码字符串断言，HIG-AUD-041）。
 *
 * 断言对象是**渲染输出**而不是实现文本：SafeArea 的 `style` 与 Stack 的类名是
 * 组件对外可观察的结果，换实现方式（如改用 CSS 自定义属性）时不应需要改测试。
 * 用服务端渲染串做判据，避免 jsdom 对 `max()` / `env()` 的解析差异干扰结论。
 */
const STEPS: readonly LayoutSpacing[] = ["xs", "sm", "md", "lg", "xl"];

const markup = (node: React.ReactElement) => renderToStaticMarkup(node);

/** 取渲染串中某个内边距的值（服务端渲染保留组件给出的完整表达式）。 */
function paddingOf(html: string, edge: "top" | "right" | "bottom" | "left") {
  const match = new RegExp(`padding-${edge}:([^;"']+)`).exec(html);
  return match?.[1]?.trim();
}

const rootTagOf = (html: string) => html;

describe("SafeArea 行为", () => {
  it("默认四边都取「间距档与设备安全区的较大值」", () => {
    const html = markup(<SafeArea />);
    for (const edge of ["top", "right", "bottom", "left"] as const) {
      const value = paddingOf(html, edge);
      expect(value, edge).toBeTruthy();
      expect(value, edge).toMatch(/^max\(.+, env\(safe-area-inset-/);
      expect(value, edge).toContain(`env(safe-area-inset-${edge})`);
    }
  });

  it("edges 可按边启用：只给指定边输出内边距", () => {
    const html = markup(<SafeArea edges="top" />);
    expect(paddingOf(html, "top")).toBeTruthy();
    expect(paddingOf(html, "right")).toBeUndefined();
    expect(paddingOf(html, "bottom")).toBeUndefined();
    expect(paddingOf(html, "left")).toBeUndefined();
    // 多边数组与 data-edges 回显
    const partial = markup(<SafeArea edges={["top", "bottom"]} />);
    expect(paddingOf(partial, "top")).toBeTruthy();
    expect(paddingOf(partial, "bottom")).toBeTruthy();
    expect(paddingOf(partial, "left")).toBeUndefined();
    expect(partial).toContain('data-edges="top bottom"');
  });

  it("padding 档位改变实际内边距（默认 md）", () => {
    const md = paddingOf(markup(<SafeArea />), "top")!;
    const xl = paddingOf(markup(<SafeArea padding="xl" />), "top")!;
    expect(md).not.toBe(xl);
    expect(rootTagOf(markup(<SafeArea />))).toContain('data-slot="safe-area"');
  });

  it("HIG-AUD-045：style 在组件内边距之后展开，因此可覆盖安全区内边距", () => {
    const html = markup(<SafeArea style={{ paddingTop: "0px" }} />);
    // 覆盖生效（组件不合并两者）——这正是双语指南中记录的边界
    expect(paddingOf(html, "top")).toBe("0px");
    // 未被覆盖的边仍保留安全区计算
    expect(paddingOf(html, "left")).toContain("env(safe-area-inset-left)");
  });
});

describe("Stack 行为", () => {
  it("默认纵向堆叠并使用 md 间距档", () => {
    const html = markup(<Stack />);
    expect(html).toContain('data-slot="stack"');
    expect(html).toContain("flex-col");
    expect(html).toContain("gap-4");
  });

  it("direction / align / justify / wrap 落到类名", () => {
    const html = markup(<Stack direction="row" align="baseline" justify="between" wrap />);
    expect(html).toContain("flex-row");
    expect(html).toContain("items-baseline");
    expect(html).toContain("justify-between");
    expect(html).toContain("flex-wrap");
    expect(html).toContain('data-direction="row"');
  });

  it("未传 align / justify / wrap 时不输出对应类", () => {
    const html = markup(<Stack />);
    expect(html).not.toContain("items-");
    expect(html).not.toContain("justify-");
    expect(html).not.toContain("flex-wrap");
  });
});

describe("HIG-AUD-046：SafeArea 与 Stack 的档位表必须逐档同步", () => {
  it("同一档位下 SafeArea 的 --spacing 倍数等于 Stack 的 gap 数字", () => {
    for (const step of STEPS) {
      const padding = paddingOf(markup(<SafeArea padding={step} />), "top")!;
      const multiplier = /calc\(var\(--spacing\) \* (\d+)\)/.exec(padding)?.[1];
      const gapClass = /\bgap-(\d+)\b/.exec(markup(<Stack gap={step} />))?.[1];
      expect(multiplier, `SafeArea 档位 ${step}`).toBeTruthy();
      expect(gapClass, `Stack 档位 ${step}`).toBeTruthy();
      // 两张平行表一旦漂移（例如只改了一处档位），这里立即失败
      expect(`${step}:${multiplier}`).toBe(`${step}:${gapClass}`);
    }
  });

  it("档位是递增的，且默认档与显式 md 一致", () => {
    const values = STEPS.map((step) =>
      Number(/calc\(var\(--spacing\) \* (\d+)\)/.exec(paddingOf(markup(<SafeArea padding={step} />), "top")!)?.[1]),
    );
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(paddingOf(markup(<SafeArea />), "top")).toBe(
      paddingOf(markup(<SafeArea padding="md" />), "top"),
    );
  });
});

describe("布局原语的文档注册", () => {
  const routes = readFileSync(
    new URL("../docs/site/src/data/docs-routes.ts", import.meta.url),
    "utf8",
  );

  it("SafeArea 与 Stack 归入 Layout & Organization 分组", () => {
    expect(routes).toContain('new Set(["safe-area", "stack"])');
    expect(routes).toContain('title: "Layout & Organization"');
    expect(routes).toContain('titleZh: "排版与布局"');
  });
});
