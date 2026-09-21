// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

/**
 * HIG-AUD-002 回归：Radix 的 `ContextMenu.Trigger` 是纯指针原语，
 * 键盘用户此前完全无法打开菜单（无 tabIndex、无键盘入口）。
 *
 * 验收场景（审核原文）：仅用键盘 Tab 聚焦目标行 → `Shift+F10` → 菜单打开
 * → 方向键移动 → `Enter` 选中 → 焦点回到原元素。
 */
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let duplicateSelects = 0;
let removeSelects = 0;

function render(tabIndex?: number) {
  act(() => {
    root.render(
      <ContextMenu>
        <ContextMenuTrigger tabIndex={tabIndex}>Row</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onSelect={() => {
              duplicateSelects += 1;
            }}
          >
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => {
              removeSelects += 1;
            }}
          >
            Remove
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
  });
}

beforeEach(() => {
  duplicateSelects = 0;
  removeSelects = 0;
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  render();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
});

function trigger(): HTMLElement {
  return container.querySelector<HTMLElement>("[data-state]")!;
}

function menu(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[role="menu"]');
}

function menuItems(): HTMLElement[] {
  return [...(menu()?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
}

function pressOn(target: EventTarget, init: KeyboardEventInit) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));
  });
}

function pressOnTrigger(init: KeyboardEventInit) {
  // 真实键盘路径下触发器必然已经获得焦点（否则按键事件不会落在它身上）
  act(() => trigger().focus());
  pressOn(trigger(), init);
}

/**
 * Radix 把两处焦点动作放在 `setTimeout(…, 0)` 里执行，必须多等一个宏任务才能断言，
 * 否则只会看到菜单卸载后留下的 `body` / 尚未移动的焦点：
 * - FocusScope 关闭时归还焦点
 *   （`node_modules/@radix-ui/react-focus-scope/dist/index.mjs:92-104`）；
 * - RovingFocusGroup 的方向键项间移动
 *   （`node_modules/@radix-ui/react-roving-focus/dist/index.mjs:194`）。
 */
async function settleRadixTimers() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("ContextMenu keyboard entry (HIG-AUD-002)", () => {
  test("trigger is in the tab sequence", () => {
    expect(trigger().tabIndex).toBe(0);
  });

  test("an explicit tabIndex is preserved", () => {
    render(-1);
    expect(trigger().tabIndex).toBe(-1);
  });

  test("Shift+F10 opens the menu", () => {
    expect(menu()).toBeNull();
    pressOnTrigger({ key: "F10", shiftKey: true });
    expect(menu()).not.toBeNull();
  });

  test("the dedicated ContextMenu key opens the menu", () => {
    pressOnTrigger({ key: "ContextMenu" });
    expect(menu()).not.toBeNull();
  });

  test("unrelated keys do not open the menu", () => {
    pressOnTrigger({ key: "F10" });
    pressOnTrigger({ key: "Enter" });
    expect(menu()).toBeNull();
  });

  test("Escape closes the menu and returns focus to the trigger", async () => {
    pressOnTrigger({ key: "F10", shiftKey: true });
    expect(menu()).not.toBeNull();
    expect(trigger().getAttribute("data-state")).toBe("open");
    // 打开后焦点应进入菜单（Radix 的 onOpenAutoFocus 会把焦点落到首个菜单项）
    expect(menu()!.contains(document.activeElement)).toBe(true);

    pressOn(document, { key: "Escape" });

    expect(menu()).toBeNull();
    expect(trigger().getAttribute("data-state")).toBe("closed");
    await settleRadixTimers();
    expect(document.activeElement).toBe(trigger());
  });

  test("keyboard open focuses the first item, ArrowDown moves on, Enter selects", async () => {
    pressOnTrigger({ key: "F10", shiftKey: true });

    const [first, second] = menuItems();
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(document.activeElement).toBe(first);

    pressOn(first, { key: "ArrowDown" });
    await settleRadixTimers();
    expect(document.activeElement).toBe(second);

    pressOn(second, { key: "Enter" });

    expect(removeSelects).toBe(1);
    expect(duplicateSelects).toBe(0);
    expect(menu()).toBeNull();
    await settleRadixTimers();
    expect(document.activeElement).toBe(trigger());
  });
});
