// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

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
});
