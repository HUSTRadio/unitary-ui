// @vitest-environment jsdom
import { readFile } from "node:fs/promises";
import * as path from "node:path";

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
    const staggered = document.querySelectorAll<HTMLElement>("[data-staggered]");
    expect(staggered).toHaveLength(8);
    expect(staggered[0].style.animationDelay).toBe("0ms");
    // Task 5b（2026-08-24）：stagger 提速——间隔 40→20ms
    expect(staggered[7].style.animationDelay).toBe("140ms");
    expect(
      document.querySelector('[data-slot="menu-list"]')!.className,
    ).toContain("pointer-events-none");
    // 第 9 项及以后不参与动画（滚动后直接呈现）
    expect(staggered[0].parentElement!.children[8].hasAttribute("data-staggered")).toBe(false);
    // 动画完结：恢复可点，data-staggered 全部移除（8*20+240=400ms 禁点解除）
    act(() => {
      vi.advanceTimersByTime(8 * 20 + 240 + 10);
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
        <HamburgerMenu anchor="topbar" belowTopbar direction="left" open />,
      );
    });
    const panel = document.querySelector('[data-slot="expand-panel"]');
    expect(panel).not.toBeNull();
    expect(panel!.hasAttribute("data-below-topbar")).toBe(true);
  });

  // 用户实测（2026-09-23，390 视口）：belowTopbar 下面板首行的 X 与 topbar 触发按钮
  // （打开态同为 X，x 坐标相同、垂直相距 64px）构成重复关闭入口。契约：belowTopbar
  // 时 topbar 保持可见可交互，触发按钮即关闭控件，面板内不再渲染第二个。
  it("belowTopbar suppresses showCloseButton — trigger is the single close control", () => {
    renderMenu({
      belowTopbar: true,
      direction: "left",
      showCloseButton: true,
      toolbarLeft: <button data-testid="tl">L</button>,
      toolbarRight: <button data-testid="tr">R</button>,
    });
    expect(document.querySelector('[data-slot="panel-close"]')).toBeNull();
    // 工具行本身仍在（slots 有内容），且左内边距与右端对称（关闭按钮缺席时不再贴边）
    const toolbar = document.querySelector('[data-slot="panel-toolbar"]');
    expect(toolbar).not.toBeNull();
    expect(toolbar!.className).toContain("pl-4");
    expect(toolbar!.querySelector('[data-testid="tl"]')).not.toBeNull();
    expect(toolbar!.querySelector('[data-testid="tr"]')).not.toBeNull();
  });

  it("trigger exposes an accessible name that flips with the open state", () => {
    act(() => {
      root.render(<HamburgerMenu anchor="topbar" items={ITEMS} />);
    });
    const trigger = () =>
      document.querySelector<HTMLButtonElement>('[data-slot="hamburger-trigger"]')!;
    // 图标本身 aria-hidden，若无 aria-label 则按钮无可访问名称
    expect(trigger().getAttribute("aria-label")).toBe("Menu");
    act(() => trigger().click());
    expect(trigger().getAttribute("aria-label")).toBe("Close menu");
  });

  // Task 2（2026-08-24）：抽屉 81 项只有 ~13 项可达——list 自身 max-h-[60vh]+overflow-hidden
  // 在 506px 硬裁剪，面板 scrollHeight===clientHeight 无从滚动。契约：nav 是唯一滚动容器。
  describe("scroll reachability (Task 2)", () => {
    const readSource = async () =>
      readFile(
        path.resolve(__dirname, "../src/components/ui/hamburger-menu.tsx"),
        "utf8",
      );

    it("menu-nav is the flex-1 scroll container", async () => {
      const src = await readSource();
      // px-4：列表容器水平内边距与 toolbar 的 pr-4 同一栅格（8px 时分组标题贴面板左缘）
      expect(src).toMatch(
        /<nav\s+data-slot="menu-nav"\s+className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2"/,
      );
    });

    it("list has no max-h clip — search collapse uses h-0 + opacity instead", async () => {
      const src = await readSource();
      expect(src).not.toContain("max-h-[60vh]");
      expect(src).toContain('"pointer-events-none opacity-0 h-0 overflow-hidden"');
      expect(src).toContain('"opacity-100"');
    });

    it("panel content is a flex column for non-top sides so flex-1 works", async () => {
      const src = await readSource();
      expect(src).toContain('side !== "top" && "flex flex-col"');
    });
  });

  // Task 4（2026-08-24）：抽屉内无当前页指示——对齐桌面 sidebar active 态
  describe("activeTo current-page indicator (Task 4)", () => {
    const ICON_ITEMS = [{ label: "Icons", to: "/icons" }];

    function renderActive(props: Partial<React.ComponentProps<typeof HamburgerMenu>> = {}) {
      act(() => {
        root.render(
          <HamburgerMenu
            anchor="topbar"
            items={ICON_ITEMS}
            open
            activeTo="/icons"
            {...props}
          />,
        );
      });
    }

    it("marks the active list item with aria-current=page and painted background", () => {
      renderActive();
      const active = document.querySelector('a[aria-current="page"]');
      expect(active).not.toBeNull();
      expect(active!.textContent).toBe("Icons");
      // 选中态 = 与悬停同底色（Tremor 签名式）+ 左侧指示条，文字由 gray-1000 承担强调
      expect(active!.className).toContain("bg-gray-100");
      expect(active!.className).toContain("text-gray-1000");
      expect(active!.querySelector('[data-slot="menu-item-indicator"]')).not.toBeNull();
      // 非激活项不得带高亮/aria-current
      expect(document.querySelectorAll('a[aria-current="page"]')).toHaveLength(1);
    });

    it("no activeTo → no aria-current anywhere", () => {
      act(() => {
        root.render(
          <HamburgerMenu anchor="topbar" items={ICON_ITEMS} open />,
        );
      });
      expect(document.querySelector('a[aria-current="page"]')).toBeNull();
    });

    it("search results carry the same indicator", () => {
      renderActive();
      const input = document.querySelector(
        '[data-slot="menu-search"] input',
      ) as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      act(() => {
        setter.call(input, "ico");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      const result = document.querySelector(
        '[data-slot="menu-result"][aria-current="page"]',
      );
      expect(result).not.toBeNull();
      expect(result!.className).toContain("bg-gray-100");
      expect(result!.querySelector('[data-slot="menu-item-indicator"]')).not.toBeNull();
    });
  });

  // Task 5（2026-08-24）：关闭钮与 topbar trigger 同轴 + stagger 提速
  describe("close-button axis & stagger timing (Task 5)", () => {
    it("toolbar keeps the close button on the trigger axis, else symmetric insets", async () => {
      const src = await readFile(
        path.resolve(__dirname, "../src/components/ui/hamburger-menu.tsx"),
        "utf8",
      );
      expect(src).not.toContain("pl-[23px]");
      // 有关闭按钮时 pl-0（与 topbar trigger 同轴）；无关闭按钮时 pl-4 与右端 pr-4 对称
      // （2026-09-23：belowTopbar 抑制关闭按钮后，首个 slot 不再贴边）
      expect(src).toMatch(
        /"flex h-16 items-center justify-between border-b border-gray-alpha-400 pr-4"/,
      );
      expect(src).toContain('renderCloseButton ? "pl-0" : "pl-4"');
    });

    it("stagger constants are extracted and sped up (20ms interval / 240ms item)", async () => {
      const src = await readFile(
        path.resolve(__dirname, "../src/components/ui/hamburger-menu.tsx"),
        "utf8",
      );
      expect(src).toContain("const STAGGER_INTERVAL_MS = 20;");
      expect(src).toContain("const STAGGER_ITEM_DURATION_MS = 240;");
      // 计时器与内联样式均引用常量，无魔法数残留
      expect(src).toContain("staggerCount * STAGGER_INTERVAL_MS + STAGGER_ITEM_DURATION_MS");
      expect(src).not.toMatch(/staggerCount \* 40/);
      expect(src).not.toContain("+ 320");
      expect(src).not.toContain("320ms");
    });
  });
});
