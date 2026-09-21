// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SidebarNav, type SidebarNavGroup } from "../src/components/ui/sidebar-nav";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const KEY = "unitary.test.sidebar.collapsed";

const GROUPS: SidebarNavGroup[] = [
  {
    id: "foundations",
    label: "Foundations",
    items: [
      { label: "Introduction", to: "/" },
      { label: "Icons", to: "/icons" },
    ],
  },
  {
    id: "components",
    label: "Components",
    items: [{ label: "Button", to: "/components/button" }],
  },
];

let container: HTMLDivElement;
let root: Root;

function renderNav(props: Partial<React.ComponentProps<typeof SidebarNav>> = {}) {
  act(() => {
    root.render(<SidebarNav groups={GROUPS} collapsible persistKey={KEY} {...props} />);
  });
}

function headings(): HTMLButtonElement[] {
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>('[data-slot="sidebar-nav-heading"]'),
  );
}

function contentFor(heading: HTMLButtonElement): HTMLElement {
  // Radix 仅在展开态挂 aria-controls，折叠后需按分组容器取内容节点
  const node = heading
    .closest('[data-slot="sidebar-nav-group"]')
    ?.querySelector<HTMLElement>('[data-slot="sidebar-nav-content"]');
  if (!node) throw new Error("missing collapsible content");
  return node;
}

function click(node: Element) {
  act(() => {
    node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

beforeEach(() => {
  window.localStorage.clear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.localStorage.clear();
});

describe("SidebarNav collapsible groups", () => {
  it("starts fully expanded and wires aria-expanded / aria-controls to the content node", () => {
    renderNav();
    const [first] = headings();

    expect(headings()).toHaveLength(2);
    expect(first.getAttribute("aria-expanded")).toBe("true");
    const content = contentFor(first);
    expect(content.getAttribute("data-slot")).toBe("sidebar-nav-content");
    expect(content.className).toContain("grid-rows-[1fr]");
    expect(content.hasAttribute("inert")).toBe(false);
    // 折叠态关闭 Tab 序：展开态不得 inert
    expect(container.querySelectorAll("a")).toHaveLength(3);
  });

  it("clicking a heading collapses it: aria-expanded=false + grid-rows-[0fr] + inert", () => {
    renderNav();
    const [first] = headings();

    click(first);

    expect(first.getAttribute("aria-expanded")).toBe("false");
    const content = contentFor(first);
    expect(content.className).toContain("grid-rows-[0fr]");
    // 保留内容节点（不卸载链接），但退出焦点序与可访问性树
    expect(content.hasAttribute("inert")).toBe(true);
    expect(content.querySelectorAll("a")).toHaveLength(2);
    // 折叠不改变 aria-current 语义
    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(0);
  });

  it("remembers the collapsed set in localStorage and restores it on the next mount", () => {
    renderNav();
    click(headings()[0]);

    expect(JSON.parse(window.localStorage.getItem(KEY) ?? "[]")).toEqual(["foundations"]);

    act(() => root.unmount());
    root = createRoot(container);
    renderNav();

    expect(headings()[0].getAttribute("aria-expanded")).toBe("false");
    expect(headings()[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("never restores the active page's group as collapsed", () => {
    window.localStorage.setItem(KEY, JSON.stringify(["components"]));

    renderNav({ activeTo: "/components/button" });

    expect(headings()[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("auto-expands the group of a newly active route (current page is never hidden)", () => {
    renderNav({ activeTo: "/" });
    click(headings()[1]);
    expect(headings()[1].getAttribute("aria-expanded")).toBe("false");

    renderNav({ activeTo: "/components/button" });

    expect(headings()[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("writes nothing without persistKey (memory is opt-in)", () => {
    act(() => {
      root.render(<SidebarNav groups={GROUPS} collapsible />);
    });

    click(headings()[0]);

    expect(window.localStorage.getItem(KEY)).toBeNull();
    expect(headings()[0].getAttribute("aria-expanded")).toBe("false");
  });

  it("uses the stable group id (not the localized label) as the memory key", () => {
    renderNav();
    click(headings()[1]);

    expect(JSON.parse(window.localStorage.getItem(KEY) ?? "[]")).toEqual(["components"]);
  });
});
