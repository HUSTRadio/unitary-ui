// @vitest-environment jsdom
import { createRoot } from "react-dom/client";
import { act } from "react";
import { describe, expect, test } from "vitest";

import { Menu, MenuButton, MenuContainer, MenuDivider, MenuItem } from "@/components/ui/menu";

/**
 * Task 10 / B0 `menu-surface` TDD 契约。
 *
 * 数值来源：官方实时 Context Menu 16/16 视口主题矩阵（phase-e/context-menu，
 * 2026-08-11 06:23Z）+ dots-menu 1440-light 实测 + materials 官方页（material-menu）。
 * - 浮层表面：radius 12px、padding 6px（--uni-popover-padding）、行高 36px
 *   （--uni-popover-row-height）、行圆角 6px、行水平 padding 0 8px。
 * - 阴影：--material-shadow-menu（1px 环 + 4 层 + 外环），不叠加真实 border。
 * - 文字：14px/20px/400（text-label-14）；颜色随语义 token（--popover-foreground）。
 * - 行高亮：Radix 属性为 `data-highlighted`（DropdownMenu 标记），官方视觉为
 *   gray-alpha-100（light rgba(0,0,0,.05) / dark rgba(255,255,255,.06)）。
 * - 移动端：官方 Context Menu 使用 `max-sm:w-full!` + `max-sm:rounded-b-0`。
 *
 * 本切片只锁定 surface/row 的契约 class；菜单触发、定位、Portal 与交互行为
 * 由既有 MenuContainer/Radix 提供并已在 tests/menu.test.ts 覆盖，不在本文件断言。
 */
describe("Menu surface contract (B0 menu-surface)", () => {
  test("content surface uses material-menu: rounded 6px (HIG overlay token), padding 6px, shadow, no border", () => {
    const { content } = renderMenu();
    expect(content).not.toBeNull();
    expect(content!.className).toContain("rounded-overlay");
    expect(content!.className).toContain("p-[var(--uni-popover-padding)]");
    expect(content!.className).toContain("shadow-[var(--material-shadow-menu)]");
    // 官方无真实 border；border 由 --material-shadow-menu 的 1px 环承担
    expect(content!.className).not.toContain("border ");
    expect(content!.className).not.toContain("border-");
  });

  test("content background is surface token (official --uni-background-100: light #ffffff / dark #0a0a0a)", () => {
    const { content } = renderMenu();
    expect(content!.className).toContain("bg-surface");
    expect(content!.className).toContain("text-foreground");
  });

  test("menu animates on open (fade+zoom) and mirrors (fade+zoom) when closing", () => {
    const { content } = renderMenu();
    expect(content!.className).toContain("data-[state=open]:animate-in");
    expect(content!.className).toContain("data-[state=open]:fade-in-0");
    expect(content!.className).toContain("data-[state=open]:zoom-in-95");
    expect(content!.className).toContain("data-[state=closed]:animate-out");
    expect(content!.className).toContain("data-[state=closed]:fade-out-0");
    // HIG-AUD-011 退场镜像 + HIG-AUD-012 时长走 fast 档 token
    expect(content!.className).toContain("data-[state=closed]:zoom-out-95");
    expect(content!.className).toContain("duration-(--uni-duration-fast)");
    expect(content!.className).toContain("motion-reduce:animate-none!");
  });

  test("dark theme background stays surface token (computed #0a0a0a verified in real browser)", () => {
    document.documentElement.classList.add("dark");
    try {
      const { content } = renderMenu();
      // jsdom 不加载 Tailwind CSS，computed 值恒为 transparent；真实色值由浏览器
      // 视觉验证确认（--color-bg-surface dark = #0a0a0a）。此处锁定 token 语义。
      expect(content!.className).toContain("bg-surface");
    } finally {
      document.documentElement.classList.remove("dark");
    }
  });

  test("row contract: height 36px (h-9 fixed + text-label-14 20px), radius 6px, px-2, highlighted bg", () => {
    const { item } = renderMenu();
    expect(item).not.toBeNull();
    expect(item!.className).toContain("text-label-14");
    expect(item!.className).toContain("h-9");
    expect(item!.className).toContain("px-2");
    expect(item!.className).toContain("rounded-overlay-item");
    expect(item!.className).toContain("data-highlighted:bg-gray-alpha-100");
  });

  test("menu stays mounted as Radix dropdown; MenuButton/Container API unchanged", () => {
    const { container, trigger, content } = renderMenu();
    expect(
      Array.from(container.querySelectorAll("*")).some((el) => el.textContent === "Actions"),
    ).toBe(true);
    expect(trigger).not.toBeNull();
    expect(content).not.toBeNull();
  });
});

/** 最小可渲染 Menu：受控 open 的 MenuContainer + MenuButton + Menu（Menu 即 Radix DropdownMenu）。 */
function renderMenu() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <MenuContainer open onOpenChange={() => undefined}>
        <MenuButton>Actions</MenuButton>
        <Menu>
          <MenuItem>One</MenuItem>
          <MenuDivider />
          <MenuItem>Two</MenuItem>
        </Menu>
      </MenuContainer>,
    );
  });
  return {
    container,
    trigger: container.querySelector("button"),
    content: document.querySelector('[data-slot="menu"]'),
    item: document.querySelector('[data-slot="menu-item"]'),
  };
}
