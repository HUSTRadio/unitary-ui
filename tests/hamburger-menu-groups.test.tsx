// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { HamburgerMenu } from "../src/components/ui/hamburger-menu";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  document.body.innerHTML = "";
  root = undefined;
  container = undefined;
});

function renderGroupedMenu(props: {
  onNavigate?: (to: string) => void;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root?.render(
      <HamburgerMenu
        anchor="topbar"
        open
        disableSearch
        onNavigate={props.onNavigate}
        onOpenChange={props.onOpenChange}
        groups={[
          {
            title: "Foundations",
            items: [{ label: "Colors", to: "/colors" }],
          },
          {
            title: "Components",
            items: [{ label: "Button", to: "/components/button" }],
          },
        ]}
      />,
    );
  });
}

const groupedLink = (index = 0) =>
  document.querySelectorAll<HTMLAnchorElement>('[data-slot="menu-group"] a')[index]!

describe("HamburgerMenu grouped navigation", () => {
  test("renders every group with a visible heading and labelled group", () => {
    renderGroupedMenu();

    const groups = document.querySelectorAll('[data-slot="menu-group"]');
    const headings = document.querySelectorAll('[data-slot="menu-group-heading"]');
    expect(groups).toHaveLength(2);
    expect(Array.from(headings).map((node) => node.textContent)).toEqual([
      "Foundations",
      "Components",
    ]);
    for (const group of groups) {
      const labelledBy = group.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      expect(document.getElementById(labelledBy!)).toBeTruthy();
    }
  });

  test("keeps grouped links and current-page semantics", () => {
    renderGroupedMenu();
    const links = document.querySelectorAll('[data-slot="menu-group"] a');
    expect(Array.from(links).map((link) => link.textContent)).toEqual(["Colors", "Button"]);
  });

  test("closes the panel when a grouped link is activated (HIG-AUD-017)", () => {
    const onNavigate = vi.fn();
    const onOpenChange = vi.fn();
    renderGroupedMenu({ onNavigate, onOpenChange });

    act(() => {
      groupedLink(1).dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });

    // 既有契约：回调照旧触发；修复点：面板必须随导航收起（此前只有搜索结果项会关）
    expect(onNavigate).toHaveBeenCalledWith("/components/button");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("keeps the panel open for modifier-key activation (new-tab semantics)", () => {
    const onNavigate = vi.fn();
    const onOpenChange = vi.fn();
    renderGroupedMenu({ onNavigate, onOpenChange });

    act(() => {
      groupedLink(0).dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, metaKey: true }),
      );
    });

    expect(onNavigate).toHaveBeenCalledWith("/colors");
    // 修饰键点击是「新标签页」意图：当前面板保留
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
