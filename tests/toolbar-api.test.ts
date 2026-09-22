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
    expect(source).toContain("if (!isCollapsibleGroup(groupProps)) return;");
    expect(source).toContain("<DotsMenu>");
    expect(source).toContain("prefix={item.icon}");
  });

  test("HIG-AUD-039：溢出项保留 disabled / active，混合内容组不折叠", () => {
    // 状态透传：只复制 label/icon/onSelect 会让「禁用项」在菜单里可点
    expect(source).toContain("disabled: item.props.disabled");
    expect(source).toContain("active: item.props.active");
    expect(source).toContain("disabled={item.disabled}");
    expect(source).toContain('aria-current={item.active ? "true" : undefined}');
    // 混合内容组判定：未显式 collapsible 时，仅全 ToolbarItem 组参与折叠
    expect(source).toContain("function isCollapsibleGroup(props: ToolbarGroupProps): boolean");
    expect(source).toContain("return hasOnlyToolbarItems(props.children);");
    expect(source).toContain("if (collapsed && isCollapsibleGroup({ collapsible, children })) return null;");
    // 显式折叠 + 含非 ToolbarItem 内容时给出 dev 告警（内容无溢出入口）
    expect(source).toContain('"[Toolbar] collapsible={true} 的组内含非 ToolbarItem 内容');
  });

  test("HIG-AUD-050：Fragment 包裹的分组与条目被展平后收集", () => {
    expect(source).toContain("function flattenChildren(children: React.ReactNode): React.ReactNode[]");
    expect(source).toContain("child.type === React.Fragment");
    expect(source).toMatch(/flattenChildren\(groupProps\.children\)/);
    expect(source).toMatch(/flattenChildren\(children\)\.forEach\(\(group/);
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
