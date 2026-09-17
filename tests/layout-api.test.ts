import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("../src/components/ui/layout.tsx", import.meta.url), "utf8");
const routes = readFileSync(
  new URL("../docs/geist/src/data/docs-routes.ts", import.meta.url),
  "utf8",
);

/** 布局原语（HIG Layout & Organization）：SafeArea 与 Stack，均为纯容器。 */
describe("Layout primitives", () => {
  test("SafeArea takes the larger of the spacing step and the device safe area", () => {
    expect(source).toContain("env(safe-area-inset-top)");
    expect(source).toContain("env(safe-area-inset-bottom)");
    expect(source).toContain("max(${spacing}, env(safe-area-inset-top))");
    expect(source).toContain("data-slot=\"safe-area\"");
  });

  test("SafeArea accepts per-edge configuration", () => {
    expect(source).toContain('edges = "all"');
    expect(source).toContain('export type SafeAreaEdge = "top" | "right" | "bottom" | "left" | "all"');
  });

  test("Stack exposes direction, spacing step, alignment, and wrapping", () => {
    expect(source).toContain('direction = "column"');
    expect(source).toContain('gap = "md"');
    expect(source).toContain("items-baseline");
    expect(source).toContain("justify-between");
    expect(source).toContain("wrap && \"flex-wrap\"");
    expect(source).toContain("data-slot=\"stack\"");
  });

  test("uses spacing steps instead of arbitrary values", () => {
    expect(source).toContain('export type LayoutSpacing = "xs" | "sm" | "md" | "lg" | "xl"');
    expect(source).toContain("calc(var(--spacing) * 4)");
  });

  test("groups the primitives under Layout & Organization in the docs", () => {
    expect(routes).toContain('{ id: "layout", title: "Layout & Organization", titleZh: "排版与布局" }');
    expect(routes).toContain('group: "layout"');
    expect(routes).toContain('to: "/typography"');
    expect(routes).toContain('to: "/grid"');
    expect(routes).toContain('new Set(["safe-area", "stack"])');
  });
});
