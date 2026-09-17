import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  new URL("../src/components/ui/context-menu.tsx", import.meta.url),
  "utf8",
);

/**
 * Quick Actions 是 context-menu 的触屏长按变体（touchscreen only）。
 * 与 context-menu 一致，本文件以源码契约为准：Radix ContextMenu 在 jsdom 下
 * 无法稳定完成右键/长按打开，真实触屏行为由演示页验证。
 */
describe("Context Menu Quick Actions variant", () => {
  test("exports the touch variant alongside the standard primitives", () => {
    expect(source).toContain("const ContextMenuQuickActionsContent = React.forwardRef");
    expect(source).toContain("const ContextMenuQuickActionsItem = React.forwardRef");
    expect(source).toContain("ContextMenuQuickActionsContent,\n  ContextMenuQuickActionsItem,");
    expect(source).toContain("ContextMenuQuickActionsContentProps");
    expect(source).toContain("ContextMenuQuickActionsItemProps");
  });

  test("documents that the variant is touchscreen only", () => {
    expect(source).toContain("touchscreen only");
    expect(source).toContain("桌面右键场景请用 `ContextMenuContent`");
    expect(source).toContain("Home Screen Quick Actions");
  });

  test("renders a fixed-width list with icon, title, and subtitle", () => {
    expect(source).toContain("width = 224");
    expect(source).toContain("size-5");
    expect(source).toContain("text-label-14");
    expect(source).toContain("text-copy-13 text-gray-900");
    expect(source).toContain("max-sm:w-full max-sm:rounded-b-none");
  });

  test("pairs the variant with a blurred backdrop", () => {
    expect(source).toContain("backdropBlur = true");
    expect(source).toContain("data-slot=\"context-menu-quick-actions-overlay\"");
    expect(source).toContain("bg-black/40 backdrop-blur-sm");
    expect(source).toContain("motion-reduce:animate-none");
  });

  test("supports destructive system items and separators", () => {
    expect(source).toContain("destructive && \"text-[#ee0000]\"");
    expect(source).toContain("ContextMenuSeparator");
  });
});
