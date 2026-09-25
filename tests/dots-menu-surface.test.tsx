// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DotsMenu, DotsMenuItem } from "../src/components/ui/dots-menu";
import { Menu, MenuButton, MenuContainer, MenuItem } from "../src/components/ui/menu";

/**
 * HIG-AUD-032 行为契约：DotsMenu 基于 menu.tsx 封装，浮层表面必须与 Menu 同源
 * （同一 bg-* 表面 token），且触发器不得用显式 aria-haspopup="true" 覆盖 Radix
 * 的 aria-haspopup="menu"（语义降级）。
 *
 * 本文件断言的是运行时可观察契约：
 * - 打开后浮层真实进入 DOM；
 * - 触发器 aria-haspopup 值为 "menu"；
 * - DotsMenu 浮层的表面 token 等于 Menu 浮层的表面 token（且等于 bg-surface）。
 * 不断言无关视觉类名，也不做源字符串契约（HIG-AUD-041）。
 */

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** jsdom 无布局：Radix Popper 需要 ResizeObserver。 */
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

/** 从浮层 className 中提取表面 token（bg-*），其它视觉类忽略。 */
function surfaceToken(el: Element): string {
  return [...el.classList].find((cls) => cls.startsWith("bg-")) ?? "";
}

/** 定位含指定文案的菜单浮层（Radix Portal 到 document.body）。 */
function findPopupByText(text: string): HTMLElement | null {
  return (
    [...document.querySelectorAll<HTMLElement>('[data-slot="menu"]')].find((el) =>
      el.textContent?.includes(text),
    ) ?? null
  );
}

/** 渲染受控打开的最小 Menu，返回其浮层表面 token（menu.tsx 的权威表面）。 */
function referenceMenuSurfaceToken(): string {
  act(() =>
    root.render(
      <MenuContainer open onOpenChange={() => undefined}>
        <MenuButton>Reference</MenuButton>
        <Menu>
          <MenuItem>Menu Reference Item</MenuItem>
        </Menu>
      </MenuContainer>,
    ),
  );
  const popup = findPopupByText("Menu Reference Item");
  expect(popup).not.toBeNull();
  return surfaceToken(popup!);
}

/** 渲染 DotsMenu，并以 Radix 的 pointerdown 语义打开；返回触发器与浮层。 */
function renderDotsMenuOpen() {
  act(() =>
    root.render(
      <DotsMenu>
        <DotsMenuItem>Dots Item</DotsMenuItem>
      </DotsMenu>,
    ),
  );
  const trigger = container.querySelector<HTMLButtonElement>("button");
  expect(trigger).not.toBeNull();
  act(() => {
    trigger!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0 }));
  });
  return { trigger: trigger!, popup: findPopupByText("Dots Item") };
}

describe("DotsMenu 表面与 Menu 同源（HIG-AUD-032）", () => {
  it("打开后浮层进入 DOM，并含可访问的 menuitem", () => {
    const { popup } = renderDotsMenuOpen();
    expect(popup).not.toBeNull();
    expect(popup!.querySelectorAll('[role="menuitem"]').length).toBeGreaterThan(0);
  });

  it("触发器 aria-haspopup 为 menu，未被显式覆盖为 true（语义不被降级）", () => {
    const { trigger } = renderDotsMenuOpen();
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-haspopup")).not.toBe("true");
  });

  it("浮层表面 token 与 Menu 同源（DotsMenu 与 Menu computed 底色一致的类判据）", () => {
    const reference = referenceMenuSurfaceToken();
    // 权威表面：menu.tsx 使用 bg-surface（tests/menu-surface.test.tsx 已锁定）
    expect(reference).toBe("bg-surface");

    const { popup } = renderDotsMenuOpen();
    expect(popup).not.toBeNull();
    expect(surfaceToken(popup!)).toBe(reference);
  });
});
