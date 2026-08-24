// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HamburgerMenu } from "../src/components/ui/hamburger-menu";

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
});

function renderMenu(node: React.ReactNode) {
  act(() => {
    root.render(node);
  });
}

function panel(): HTMLElement {
  return document.querySelector('[data-slot="expand-panel"]') as HTMLElement;
}

function typeInto(input: HTMLInputElement, text: string) {
  // React 值追踪器会去重直接赋值，必须用原型原生 setter 触发受控 onChange
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )!.set!;
  act(() => {
    setter.call(input, text);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

const ITEMS = [
  { label: "Accordion", to: "/docs/accordion" },
  { label: "Button", to: "/docs/button" },
  { label: "Badge", to: "/docs/badge" },
];

describe("HamburgerMenu", () => {
  it("默认渲染受控 open 的 HamburgerIcon；icon 替换生效", () => {
    renderMenu(<HamburgerMenu anchor="topbar" />);
    expect(document.body.innerHTML).toContain('data-slot="hamburger-icon"');

    act(() => root.unmount());
    root = createRoot(container);
    renderMenu(
      <HamburgerMenu
        anchor="topbar"
        icon={<span data-slot="custom-icon">i</span>}
      />,
    );
    const markup = document.body.innerHTML;
    expect(markup).toContain('data-slot="custom-icon"');
    expect(markup).not.toContain('data-slot="hamburger-icon"');
  });

  it("direction 映射：topbar 默认 down→side=top；sidebar+right→side=right", () => {
    renderMenu(<HamburgerMenu anchor="topbar" />);
    act(() => {
      (
        document.querySelector('[data-slot="hamburger-trigger"]') as HTMLElement
      ).click();
    });
    expect(panel().getAttribute("data-side")).toBe("top");
    // 延伸感：只下圆角 + 共享 border-b、顶部无圆角
    expect(panel().className).toContain("rounded-b-overlay");
    expect(panel().className).toContain("rounded-t-none");

    act(() => root.unmount());
    root = createRoot(container);
    renderMenu(<HamburgerMenu anchor="sidebar" direction="right" />);
    act(() => {
      (
        document.querySelector('[data-slot="hamburger-trigger"]') as HTMLElement
      ).click();
    });
    expect(panel().getAttribute("data-side")).toBe("right");
    expect(panel().className).toContain("rounded-l-overlay");
  });

  it("trigger aria-expanded/aria-haspopup；受控 open 双模回调", () => {
    const onOpenChange = vi.fn();
    renderMenu(
      <HamburgerMenu anchor="topbar" onOpenChange={onOpenChange} />,
    );
    const trigger = document.querySelector(
      '[data-slot="hamburger-trigger"]',
    ) as HTMLElement;
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    act(() => trigger.click());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    act(() => root.unmount());
    root = createRoot(container);
    renderMenu(<HamburgerMenu anchor="topbar" open onOpenChange={onOpenChange} />);
    expect(
      (document.querySelector('[data-slot="hamburger-trigger"]') as HTMLElement)
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("搜索过滤：query 非空收起列表（opacity-0 h-0）并渲染结果区", () => {
    renderMenu(<HamburgerMenu anchor="topbar" items={ITEMS} />);
    act(() => {
      (document.querySelector('[data-slot="hamburger-trigger"]') as HTMLElement).click();
    });
    expect(document.querySelectorAll('[data-slot="menu-list"] li')).toHaveLength(3);

    const input = document.querySelector(
      '[data-slot="menu-search"] input',
    ) as HTMLInputElement;
    typeInto(input, "b");

    const list = document.querySelector('[data-slot="menu-list"]')!;
    expect(list.className).toContain("opacity-0");
    // Task 2（2026-08-24）：搜索收起过渡从 max-h-0 改为 h-0（nav 成为唯一滚动容器，list 去 max-h 裁剪）
    expect(list.className).toContain("h-0");
    expect(list.className).not.toContain("max-h-0");
    expect(list.className).toContain("overflow-hidden");

    // "b" 匹配 Button + Badge → 结果数 2
    const results = document.querySelectorAll('[data-slot="menu-result"]');
    expect(results).toHaveLength(2);
    expect(results[0].getAttribute("href")).toBe("/docs/button");
  });

  it("X 清空钮：query 还原为空、导航列表反向过渡还原", () => {
    renderMenu(<HamburgerMenu anchor="topbar" items={ITEMS} />);
    act(() => {
      (document.querySelector('[data-slot="hamburger-trigger"]') as HTMLElement).click();
    });
    const input = document.querySelector(
      '[data-slot="menu-search"] input',
    ) as HTMLInputElement;
    typeInto(input, "acc");
    expect(document.querySelectorAll('[data-slot="menu-result"]')).toHaveLength(1);

    act(() => {
      (document.querySelector('[data-slot="search-clear"]') as HTMLElement).click();
    });
    expect(input.value).toBe("");
    const list = document.querySelector('[data-slot="menu-list"]')!;
    expect(list.className).not.toContain("opacity-0");
    expect(list.className).not.toContain("max-h-0");
    expect(document.querySelectorAll('[data-slot="menu-list"] li')).toHaveLength(3);
    expect(document.querySelector('[data-slot="menu-results"]')).toBeNull();
  });

  it("kbd Ctrl K 提示包 pointer-fine 变体（触屏不渲染）", () => {
    renderMenu(<HamburgerMenu anchor="topbar" />);
    act(() => {
      (document.querySelector('[data-slot="hamburger-trigger"]') as HTMLElement).click();
    });
    const kbd = document.querySelector('[data-slot="menu-search"] kbd')!;
    expect(kbd.textContent).toContain("Ctrl K");
    expect(kbd.className).toContain("hidden");
    expect(kbd.className).toContain("pointer-fine:inline-block");
  });

  it("items 过滤结果点击触发 onNavigate(to) 并关闭面板", () => {
    const onNavigate = vi.fn();
    renderMenu(
      <HamburgerMenu anchor="topbar" items={ITEMS} onNavigate={onNavigate} />,
    );
    act(() => {
      (document.querySelector('[data-slot="hamburger-trigger"]') as HTMLElement).click();
    });
    const input = document.querySelector(
      '[data-slot="menu-search"] input',
    ) as HTMLInputElement;
    typeInto(input, "accordion");
    act(() => {
      document.querySelector('[data-slot="menu-result"]')!.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });
    expect(onNavigate).toHaveBeenCalledWith("/docs/accordion");
    expect(
      (document.querySelector('[data-slot="hamburger-trigger"]') as HTMLElement)
        .getAttribute("aria-expanded"),
    ).toBe("false");
  });
});
