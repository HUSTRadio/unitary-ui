import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("../src/components/ui/toolbar.tsx", import.meta.url), "utf8");

/** Toolbar —— HIG 工具栏：三段分组 + 空间不足折叠为溢出菜单。 */
describe("Toolbar contract", () => {
  test("exposes three-slot grouping", () => {
    expect(source).toContain('export type ToolbarSlot = "leading" | "center" | "trailing"');
    expect(source).toContain('data-toolbar-slot={slot}');
    expect(source).toContain('center: "mx-auto"');
    expect(source).toContain('trailing: "ml-auto"');
  });

  test("collapses by group through ResizeObserver with hysteresis", () => {
    expect(source).toContain("new ResizeObserver(update)");
    expect(source).toContain("requiredWidthRef");
    expect(source).toContain("requiredWidthRef.current + 24");
    expect(source).toContain("ToolbarCollapsedContext");
  });

  test("moves only ToolbarItem into the overflow menu", () => {
    expect(source).toContain("node.type === ToolbarItem");
    expect(source).toContain("if (groupProps.collapsible === false) return;");
    expect(source).toContain("<DotsMenu>");
    expect(source).toContain("prefix={item.icon}");
  });

  test("keeps tool items accessible when collapsed or icon-only", () => {
    expect(source).toContain('aria-label={typeof label === "string" ? label : undefined}');
    expect(source).toContain("aria-pressed={active}");
  });

  test("documents the boundary against Navbar", () => {
    expect(source).toContain("Navbar");
    expect(source).toContain("窗口级工具操作组");
  });
});
