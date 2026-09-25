// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Toolbar, ToolbarGroup, ToolbarItem } from "../src/components/ui/toolbar";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** jsdom 无布局：mock ResizeObserver，手动给出可用宽度与内容宽度。 */
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

function render(node: React.ReactNode) {
  act(() => root.render(node));
  return document.querySelector<HTMLElement>('[data-slot="toolbar"]')!;
}

/** 给出容器可用宽度与展开态内容宽度（jsdom 无布局，宽度只能注入口径）。 */
function setWidths(toolbar: HTMLElement, available: number, required: number) {
  Object.defineProperty(toolbar, "clientWidth", { configurable: true, value: available });
  Object.defineProperty(toolbar, "scrollWidth", { configurable: true, value: required });
  return toolbar;
}

/** 触发一次测量（HIG-AUD-041：行为化测量，不断言 ResizeObserver 表达式文本）。 */
function measure(toolbar: HTMLElement, available: number, required: number) {
  setWidths(toolbar, available, required);
  act(() => {
    MockResizeObserver.instances.at(-1)!.callback();
  });
  return toolbar;
}

const groupsOf = () => [...document.querySelectorAll<HTMLElement>('[data-slot="toolbar-group"]')];

describe("Toolbar 三段分组（行为契约，替代源码字符串断言）", () => {
  it("导出三个公开组件", () => {
    expect(typeof Toolbar).toBe("function");
    expect(typeof ToolbarGroup).toBe("function");
    expect(typeof ToolbarItem).toBe("function");
  });

  it("slot 落到 DOM 上并默认 leading", () => {
    render(
      <Toolbar>
        <ToolbarGroup slot="center">
          <ToolbarItem label="Play" />
        </ToolbarGroup>
        <ToolbarGroup slot="trailing" data-testid="trailing">
          <ToolbarItem label="Share" />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem label="Reload" />
        </ToolbarGroup>
      </Toolbar>,
    );
    expect(groupsOf().map((group) => group.getAttribute("data-toolbar-slot"))).toEqual([
      "center",
      "trailing",
      // 未传 slot 时默认为 leading（不是 undefined / 空串）
      "leading",
    ]);
  });

  it("iconOnly 项以 label 作为无障碍名称，且不渲染可见文案", () => {
    render(
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem iconOnly label="Bold" icon={<svg />} active />
        </ToolbarGroup>
      </Toolbar>,
    );
    const item = document.querySelector<HTMLButtonElement>('[data-slot="toolbar-item"]')!;
    expect(item.getAttribute("aria-label")).toBe("Bold");
    expect(item.textContent).toBe("");
    // 选中态同时暴露给 AT（aria-pressed）和样式（data-active）
    expect(item.getAttribute("aria-pressed")).toBe("true");
    expect(item.getAttribute("data-active")).toBe("true");
    // 图标是装饰性的，不重复命名
    expect(item.querySelector("span[aria-hidden='true']")).not.toBeNull();
  });

  it("active 未提供时不声明 aria-pressed；显式 false 时声明为 false", () => {
    render(
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem label="Italic" />
          <ToolbarItem label="Underline" active={false} />
        </ToolbarGroup>
      </Toolbar>,
    );
    const [omitted, explicit] = [
      ...document.querySelectorAll<HTMLButtonElement>('[data-slot="toolbar-item"]'),
    ];
    // 未提供 active：不是切换按钮，不声明 aria-pressed，也没有 data-active
    expect(omitted.hasAttribute("aria-pressed")).toBe(false);
    expect(omitted.hasAttribute("data-active")).toBe(false);
    expect(omitted.textContent).toBe("Italic");
    // 显式 active={false}：作为切换按钮声明未按下
    expect(explicit.getAttribute("aria-pressed")).toBe("false");
    expect(explicit.hasAttribute("data-active")).toBe(false);
  });
});

describe("Toolbar 折叠测量（HIG-AUD-041：不再断言 ResizeObserver 表达式文本）", () => {
  it("内容宽于容器时整组收起，并产生溢出入口", () => {
    const toolbar = render(
      <Toolbar>
        <ToolbarGroup slot="trailing" data-testid="trailing-group">
          <ToolbarItem label="Bold" onSelect={() => {}} />
          <ToolbarItem label="Italic" onSelect={() => {}} />
        </ToolbarGroup>
      </Toolbar>,
    );
    measure(toolbar, 100, 300);

    expect(toolbar.getAttribute("data-collapsed")).toBe("true");
    expect(groupsOf()).toHaveLength(0);
    expect(toolbar.querySelector("[aria-haspopup]")).not.toBeNull();
  });

  it("collapse={false} 时放弃测量，即使内容溢出也不折叠", () => {
    const toolbar = render(
      <Toolbar collapse={false}>
        <ToolbarGroup slot="trailing">
          <ToolbarItem label="Bold" onSelect={() => {}} />
        </ToolbarGroup>
      </Toolbar>,
    );
    setWidths(toolbar, 100, 300);

    // 退出折叠即退出测量：不注册 ResizeObserver，也就不会出现折叠态
    expect(MockResizeObserver.instances).toHaveLength(0);
    expect(toolbar.hasAttribute("data-collapsed")).toBe(false);
    expect(groupsOf()).toHaveLength(1);
    expect(toolbar.querySelector("[aria-haspopup]")).toBeNull();
  });

  it("展开带 24px 滞回：仅宽出 10px 时保持折叠，宽出 30px 才展开", () => {
    const toolbar = render(
      <Toolbar>
        <ToolbarGroup slot="trailing">
          <ToolbarItem label="Bold" onSelect={() => {}} />
        </ToolbarGroup>
      </Toolbar>,
    );
    measure(toolbar, 100, 300);
    expect(toolbar.getAttribute("data-collapsed")).toBe("true");

    // 300 + 24 = 324：310 不足以展开，避免临界宽度抖动
    measure(toolbar, 310, 300);
    expect(toolbar.getAttribute("data-collapsed")).toBe("true");

    measure(toolbar, 330, 300);
    expect(toolbar.hasAttribute("data-collapsed")).toBe(false);
    expect(groupsOf()).toHaveLength(1);
  });
});
