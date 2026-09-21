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

/** 折叠开关是普通标题（不是 button），这里按元素取。 */
function headings(): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>('[data-slot="sidebar-nav-heading"]'),
  );
}

function contentFor(heading: HTMLElement): HTMLElement {
  // aria-controls 随开合状态保留，但折叠态按分组容器取内容节点更稳
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
  it("keeps the heading a plain non-button title that is still keyboard operable", () => {
    renderNav();
    const [first] = headings();

    // 折叠只是「简单的 collapse」：标题不是 button 元素、没有按钮外观
    expect(first.tagName).not.toBe("BUTTON");
    expect(first.className).not.toContain("hover:bg-");
    // 但 disclosure 语义与键盘开关保留
    expect(first.getAttribute("role")).toBe("button");
    expect(first.getAttribute("tabindex")).toBe("0");

    const press = (key: string) => {
      act(() => {
        first.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
      });
    };

    press("Enter");
    expect(first.getAttribute("aria-expanded")).toBe("false");

    press(" ");
    expect(first.getAttribute("aria-expanded")).toBe("true");

    press("a");
    expect(first.getAttribute("aria-expanded")).toBe("true");
  });

  it("starts fully expanded and wires aria-expanded / aria-controls to the content node", () => {
    renderNav();
    const [first] = headings();

    expect(headings()).toHaveLength(2);
    expect(first.getAttribute("aria-expanded")).toBe("true");
    const content = contentFor(first);
    expect(content.getAttribute("data-slot")).toBe("sidebar-nav-content");
    // 折叠行为来自标准 Collapse：内容常驻 + 标准高度过渡（不再自持 grid-rows 技法）
    expect(content.className).toContain("collapse-content-motion");
    expect(content.className).toContain("data-[state=open]:h-[var(--collapse-content-height)]");
    expect(content.hasAttribute("inert")).toBe(false);
    // 折叠态关闭 Tab 序：展开态不得 inert
    expect(container.querySelectorAll("a")).toHaveLength(3);
  });

  it("clicking a heading collapses it: aria-expanded=false + height-collapsed + inert", async () => {
    renderNav();
    const [first] = headings();

    click(first);
    // 标准 Collapse 用 MutationObserver 同步 data-state 后落 inert：让微/宏任务跑一轮
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(first.getAttribute("aria-expanded")).toBe("false");
    const content = contentFor(first);
    expect(content.getAttribute("data-state")).toBe("closed");
    expect(content.className).toContain("data-[state=closed]:h-0");
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
