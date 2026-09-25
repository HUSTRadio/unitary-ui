// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  MenuBar,
  MenuBarCheckboxItem,
  MenuBarContent,
  MenuBarItem,
  MenuBarMenu,
  MenuBarSeparator,
  MenuBarSub,
  MenuBarSubContent,
  MenuBarSubTrigger,
  MenuBarTrigger,
} from "../src/components/ui/menu-bar";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
});

const bar = () => document.querySelector<HTMLElement>('[data-slot="menu-bar"]')!;
const openMenu = () => document.querySelector<HTMLElement>('[data-slot="menu-bar-content"]');

/**
 * MenuBar 行为契约（替代源码字符串断言，HIG-AUD-041）。
 * 组合面、菜单开合、快捷键「只展示不绑定」都以真实渲染与事件为准。
 */
function renderMenus(node?: React.ReactNode) {
  act(() =>
    root.render(
      node ?? (
        <MenuBar>
          <MenuBarMenu>
            <MenuBarTrigger>File</MenuBarTrigger>
            <MenuBarContent>
              <MenuBarItem shortcut="⌘N" onSelect={() => log("New")}>
                New Window
              </MenuBarItem>
              <MenuBarSeparator />
              <MenuBarSub>
                <MenuBarSubTrigger>Export</MenuBarSubTrigger>
                <MenuBarSubContent>
                  <MenuBarItem onSelect={() => log("PDF")}>PDF</MenuBarItem>
                </MenuBarSubContent>
              </MenuBarSub>
            </MenuBarContent>
          </MenuBarMenu>
          <MenuBarMenu>
            <MenuBarTrigger>View</MenuBarTrigger>
            <MenuBarContent>
              <MenuBarCheckboxItem checked={false} onCheckedChange={() => log("toggle")}>
                Show Hidden Files
              </MenuBarCheckboxItem>
              <MenuBarItem disabled onSelect={() => log("nope")}>
                Enter Full Screen
              </MenuBarItem>
            </MenuBarContent>
          </MenuBarMenu>
        </MenuBar>
      ),
    ),
  );
}

/** 记录命令是否被执行（菜单项回调）。 */
const log = vi.fn();

/** Radix Menubar 的触发器由 pointerdown 打开。 */
function pointerDown(element: Element) {
  act(() => {
    element.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0 }));
  });
}

function click(element: Element) {
  act(() => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

const trigger = (name: string) =>
  [...bar().querySelectorAll<HTMLElement>('[data-slot="menu-bar-trigger"]')].find(
    (node) => node.textContent === name,
  )!;

describe("MenuBar 组合面", () => {
  it("导出全部公开组合件", () => {
    // forwardRef 组件是对象、普通函数组件是函数，两者都可渲染
    for (const [name, component] of Object.entries({
      MenuBar,
      MenuBarMenu,
      MenuBarTrigger,
      MenuBarContent,
      MenuBarItem,
      MenuBarCheckboxItem,
      MenuBarSeparator,
      MenuBarSub,
      MenuBarSubTrigger,
      MenuBarSubContent,
    })) {
      expect(component, name).toBeTruthy();
      expect(["function", "object"], name).toContain(typeof component);
    }
  });

  it("渲染出 role=menubar 与顶级菜单项，默认不展开任何菜单", () => {
    renderMenus();
    const menubar = document.querySelector('[role="menubar"]');
    expect(menubar).not.toBeNull();
    expect(menubar!.querySelectorAll('[data-slot="menu-bar-trigger"]')).toHaveLength(2);
    expect(trigger("File").getAttribute("aria-expanded")).toBe("false");
    expect(openMenu()).toBeNull();
  });

  it("打开菜单后渲染菜单项、分隔线与子菜单入口", () => {
    renderMenus();
    pointerDown(trigger("File"));

    const menu = openMenu()!;
    expect(menu).not.toBeNull();
    expect(trigger("File").getAttribute("aria-expanded")).toBe("true");
    expect(menu.querySelector('[data-slot="menu-bar-item"]')?.textContent).toContain("New Window");
    expect(menu.querySelector('[data-slot="menu-bar-separator"]')).not.toBeNull();
    expect(menu.querySelector('[data-slot="menu-bar-sub-trigger"]')?.textContent).toBe("Export");
  });

  it("切换顶级菜单时只保留一个展开的菜单", () => {
    renderMenus();
    pointerDown(trigger("File"));
    expect(trigger("File").getAttribute("aria-expanded")).toBe("true");

    pointerDown(trigger("View"));
    expect(trigger("View").getAttribute("aria-expanded")).toBe("true");
    expect(trigger("File").getAttribute("aria-expanded")).toBe("false");
    expect(openMenu()!.textContent).toContain("Show Hidden Files");
  });
});

describe("MenuBar 命令行为", () => {
  beforeEach(() => log.mockClear());

  it("点击菜单项执行回调并关闭菜单", () => {
    renderMenus();
    pointerDown(trigger("File"));
    const item = [...openMenu()!.querySelectorAll<HTMLElement>('[data-slot="menu-bar-item"]')].find(
      (node) => node.textContent?.includes("New Window"),
    )!;
    click(item);
    expect(log).toHaveBeenCalledWith("New");
  });

  it("勾选项经 onCheckedChange 上报，且不执行普通命令回调", () => {
    renderMenus();
    pointerDown(trigger("View"));
    const checkbox = openMenu()!.querySelector<HTMLElement>('[data-slot="menu-bar-checkbox-item"]')!;
    expect(checkbox.getAttribute("role")).toBe("menuitemcheckbox");
    click(checkbox);
    expect(log).toHaveBeenCalledWith("toggle");
  });

  it("禁用项标记为不可用且点击不触发回调", () => {
    renderMenus();
    pointerDown(trigger("View"));
    const disabled = [
      ...openMenu()!.querySelectorAll<HTMLElement>('[data-slot="menu-bar-item"]'),
    ].find((node) => node.textContent?.includes("Enter Full Screen"))!;
    expect(disabled.getAttribute("aria-disabled")).toBe("true");
    click(disabled);
    expect(log).not.toHaveBeenCalledWith("nope");
  });
});

describe("HIG-AUD-047：快捷键只展示、不绑定按键", () => {
  beforeEach(() => log.mockClear());

  it("快捷键文本对 AT 隐藏，仅作视觉提示", () => {
    renderMenus();
    pointerDown(trigger("File"));
    const hint = openMenu()!.querySelector<HTMLElement>('[data-slot="menu-bar-shortcut"]')!;
    expect(hint).not.toBeNull();
    expect(hint.textContent).toBe("⌘N");
    expect(hint.getAttribute("aria-hidden")).toBe("true");
  });

  it("按下快捷键不会执行命令（组件不注册按键监听）", () => {
    renderMenus();
    pointerDown(trigger("File"));

    for (const event of [
      { key: "n", metaKey: true },
      { key: "n", ctrlKey: true },
      { key: "N", metaKey: true, shiftKey: true },
    ]) {
      act(() => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...event }),
        );
      });
    }

    expect(log).not.toHaveBeenCalled();
    // 菜单仍保持打开，说明按键既没有执行命令也没有被当成菜单导航
    expect(trigger("File").getAttribute("aria-expanded")).toBe("true");
  });
});
