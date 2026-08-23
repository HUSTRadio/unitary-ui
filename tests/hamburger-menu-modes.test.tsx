// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HamburgerMenu } from "../src/components/ui/hamburger-menu";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

const ITEMS = [
  { label: "Components", to: "/components" },
  { label: "Colors", to: "/colors" },
];

function renderMenu(props: Partial<React.ComponentProps<typeof HamburgerMenu>> = {}) {
  act(() => {
    root.render(
      <HamburgerMenu anchor="topbar" items={ITEMS} open {...props} />,
    );
  });
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("HamburgerMenu side-slide modes (Task 3)", () => {
  it("showCloseButton renders an X button with aria-label in the first row", () => {
    renderMenu({ showCloseButton: true });
    const close = document.querySelector('[data-slot="panel-close"]');
    expect(close).not.toBeNull();
    expect(close!.getAttribute("aria-label")).toBe("Close menu");
    // 命中区 44×44
    expect(close!.className).toContain("size-11");
  });

  it("disableSearch removes the search row entirely", () => {
    renderMenu({ disableSearch: true });
    expect(document.querySelector('[data-slot="menu-search"]')).toBeNull();
  });

  it("default (no disableSearch) keeps the search row — backward compat", () => {
    renderMenu({});
    expect(
      document.querySelector('[data-slot="menu-search"]'),
    ).not.toBeNull();
  });

  it("focus-driven search: blur exits search even when query is non-empty", () => {
    renderMenu({ disableSearch: false, searchMode: "toolbar" });
    const input = document.querySelector(
      '[data-slot="menu-search"] input',
    ) as HTMLInputElement | null;
    expect(input).not.toBeNull();

    // 聚焦 → 进入搜索视图（导航列表收起：max-h-0 + opacity-0）
    act(() => input!.dispatchEvent(new FocusEvent("focus")));
    const navList = () => document.querySelector('[data-slot="menu-list"]')!;
    expect(navList().className).toContain("opacity-0");

    // 输入非空 query 后失焦 → 必须回到导航列表（反向过渡展开）
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!;
    act(() => {
      setter.call(input!, "co");
      input!.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(navList().className).toContain("opacity-0"); // query 非空维持搜索
    act(() => input!.blur());
    expect(navList().className).toContain("opacity-100"); // 失焦退出（query 保持 "co"）
  });

  it("query-driven search still works without toolbar mode — backward compat", () => {
    renderMenu({});
    const input = document.querySelector(
      '[data-slot="menu-search"] input',
    ) as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!;
    act(() => {
      setter.call(input, "co");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    // 非空即搜索，无需焦点
    expect(document.querySelector('[data-slot="menu-results"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="menu-result"]')).not.toBeNull();
  });

  it("toolbar slots render inside the panel toolbar row", () => {
    renderMenu({
      showCloseButton: true,
      toolbarLeft: <button data-testid="tl">L</button>,
      toolbarRight: <button data-testid="tr">R</button>,
    });
    const toolbar = document.querySelector('[data-slot="panel-toolbar"]');
    expect(toolbar).not.toBeNull();
    expect(toolbar!.querySelector('[data-testid="tl"]')).not.toBeNull();
    expect(toolbar!.querySelector('[data-testid="tr"]')).not.toBeNull();
  });

  it("openSearch ref handle enters search view and focuses the input", () => {
    const ref = React.createRef<{ openSearch: () => void }>();
    act(() => {
      root.render(
        <HamburgerMenu
          ref={ref}
          anchor="topbar"
          items={ITEMS}
          open
          searchMode="toolbar"
        />,
      );
    });
    act(() => ref.current?.openSearch());
    const navList = document.querySelector('[data-slot="menu-list"]')!;
    expect(navList.className).toContain("opacity-0");
    const active = document.activeElement;
    expect(active?.getAttribute("role")).toBe("searchbox");
  });

  it("staggerIn: first N items get stagger animation while active, later items none (Task 10)", () => {
    vi.useFakeTimers();
    const many = Array.from({ length: 14 }, (_, i) => ({
      label: `Item ${i}`,
      to: `/item-${i}`,
    }));
    act(() => {
      root.render(
        <HamburgerMenu anchor="topbar" items={many} staggerIn staggerCount={8} />,
      );
    });
    // 打开前：无动画
    expect(document.querySelectorAll("[data-staggered]")).toHaveLength(0);
    act(() => {
      document
        .querySelector<HTMLButtonElement>('[data-slot="hamburger-trigger"]')!
        .click();
    });
    // 动画期：仅前 8 项带 data-staggered，且列表禁点
    const staggered = document.querySelectorAll("[data-staggered]");
    expect(staggered).toHaveLength(8);
    expect(staggered[0].style.animationDelay).toBe("0ms");
    expect(staggered[7].style.animationDelay).toBe("280ms");
    expect(
      document.querySelector('[data-slot="menu-list"]')!.className,
    ).toContain("pointer-events-none");
    // 第 9 项及以后不参与动画（滚动后直接呈现）
    expect(staggered[0].parentElement!.children[8].hasAttribute("data-staggered")).toBe(false);
    // 动画完结：恢复可点，data-staggered 全部移除
    act(() => {
      vi.advanceTimersByTime(8 * 40 + 320 + 10);
    });
    expect(document.querySelectorAll("[data-staggered]")).toHaveLength(0);
    expect(
      document.querySelector('[data-slot="menu-list"]')!.className,
    ).not.toContain("pointer-events-none");
    vi.useRealTimers();
  });

  it("belowTopbar forwards to ExpandPanel data attribute (Task 10)", () => {
    act(() => {
      root.render(
        <HamburgerMenu anchor="topbar" belowTopbar side="left" open />,
      );
    });
    const panel = document.querySelector('[data-slot="expand-panel"]');
    expect(panel).not.toBeNull();
    expect(panel!.hasAttribute("data-below-topbar")).toBe(true);
  });
});
