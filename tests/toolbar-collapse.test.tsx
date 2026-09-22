// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Toolbar, ToolbarGroup, ToolbarItem } from "../src/components/ui/toolbar";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** jsdom 无布局：mock ResizeObserver，手动触发测量回调进入折叠态。 */
class MockResizeObserver {
  static instances: MockResizeObserver[] = [];
  callback: () => void;
  constructor(callback: () => void) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  MockResizeObserver.instances = [];
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

/** 渲染后把容器 mock 成宽度不足并触发测量 → 进入折叠态。 */
function renderCollapsed(node: React.ReactNode) {
  act(() => root.render(node));
  const toolbar = document.querySelector<HTMLElement>('[data-slot="toolbar"]')!;
  Object.defineProperty(toolbar, "clientWidth", { configurable: true, value: 100 });
  Object.defineProperty(toolbar, "scrollWidth", { configurable: true, value: 300 });
  act(() => {
    MockResizeObserver.instances.at(-1)!.callback();
  });
  return toolbar;
}

/** 打开 DotsMenu 溢出菜单（Radix DropdownMenu：pointerdown 打开）。 */
function openOverflowMenu() {
  const trigger = document.querySelector<HTMLButtonElement>(
    '[data-slot="toolbar"] [aria-haspopup="true"]',
  )!;
  expect(trigger).not.toBeNull();
  act(() => {
    trigger.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0 }));
  });
  return [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')];
}

describe("Toolbar 折叠溢出（HIG-AUD-039/050）", () => {
  it("折叠后溢出项保留 disabled 与 active（不再只复制文案与回调）", () => {
    renderCollapsed(
      <Toolbar>
        <ToolbarGroup slot="trailing">
          <ToolbarItem label="Bold" active onSelect={() => {}} />
          <ToolbarItem label="Italic" disabled onSelect={() => {}} />
        </ToolbarGroup>
      </Toolbar>,
    );
    // 组已折叠为溢出入口
    expect(document.querySelector('[data-slot="toolbar-group"]')).toBeNull();

    const items = openOverflowMenu();
    expect(items).toHaveLength(2);

    const bold = items.find((item) => item.textContent?.includes("Bold"))!;
    const italic = items.find((item) => item.textContent?.includes("Italic"))!;
    // active：data-active + aria-current（与 ToolbarItem 的选中态一致）
    expect(bold.getAttribute("data-active")).toBe("true");
    expect(bold.getAttribute("aria-current")).toBe("true");
    // disabled：Radix Item 渲染 data-disabled + aria-disabled
    expect(italic.hasAttribute("data-disabled")).toBe(true);
    expect(italic.getAttribute("aria-disabled")).toBe("true");
  });

  it("点击被禁用的溢出项不触发 onSelect", () => {
    const onSelect = vi.fn();
    renderCollapsed(
      <Toolbar>
        <ToolbarGroup slot="trailing">
          <ToolbarItem label="Delete" disabled onSelect={onSelect} />
        </ToolbarGroup>
      </Toolbar>,
    );
    const [item] = openOverflowMenu();
    act(() => {
      item.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("含非 ToolbarItem 内容的组默认常驻（折叠态下搜索框不消失）", () => {
    renderCollapsed(
      <Toolbar>
        <ToolbarGroup slot="trailing">
          <input aria-label="Search" data-testid="toolbar-search" />
          <ToolbarItem label="Filter" onSelect={() => {}} />
        </ToolbarGroup>
      </Toolbar>,
    );
    // 混合组保持渲染：搜索框仍在 DOM，且不产生「无入口」的静默消失
    expect(document.querySelector('[data-testid="toolbar-search"]')).not.toBeNull();
    // 该组不产生溢出菜单（内容没有溢出入口，整组常驻）
    expect(document.querySelector('[data-slot="toolbar"] [aria-haspopup="true"]')).toBeNull();
  });

  it("显式 collapsible={false} 的组常驻（对照）", () => {
    renderCollapsed(
      <Toolbar>
        <ToolbarGroup slot="trailing" collapsible={false}>
          <ToolbarItem label="Pin" onSelect={() => {}} />
        </ToolbarGroup>
      </Toolbar>,
    );
    expect(document.querySelector('[data-slot="toolbar-group"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="toolbar"] [aria-haspopup="true"]')).toBeNull();
  });

  it("HIG-AUD-050：Fragment 包裹的分组与条目同样被收集", () => {
    renderCollapsed(
      <Toolbar>
        <>
          <ToolbarGroup slot="trailing">
            <>
              <ToolbarItem label="Share" onSelect={() => {}} />
            </>
          </ToolbarGroup>
        </>
      </Toolbar>,
    );
    const items = openOverflowMenu();
    expect(items.map((item) => item.textContent)).toEqual(["Share"]);
  });

  it("显式 collapsible={true} 且含非 ToolbarItem 内容 → dev 告警（内容无溢出入口）", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    act(() =>
      root.render(
        <Toolbar>
          <ToolbarGroup slot="trailing" collapsible>
            <input aria-label="Search" />
          </ToolbarGroup>
        </Toolbar>,
      ),
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("collapsible={true}"));
    warn.mockRestore();
  });
});
