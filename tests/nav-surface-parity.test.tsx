// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { DocsSidebar } from "../docs/site/src/components/docs-shell";
import { LanguageProvider } from "../docs/site/src/i18n/language";
import { HamburgerMenu } from "../src/components/ui/hamburger-menu";
import { SidebarNav, type SidebarNavGroup } from "../src/components/ui/sidebar-nav";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/**
 * 导航排版同源回归（用户实测 2026-09-29）：
 * 侧栏 SidebarNav 与折叠抽屉 HamburgerMenu 是同一份导航数据的两种形态，
 * 排版必须来自同一契约（src/components/ui/nav-layout.ts）。
 * 此前抽屉自带一套几何（16px 内缩、固定 44px 行高、无折叠标题、原生粗滚动条），
 * 一旦侧栏折叠成抽屉就换了一套排版。
 */

const KEY = "unitary.test.nav-surface.collapsed";

const SIDEBAR_GROUPS: SidebarNavGroup[] = [
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
    subgroups: [
      { label: "Actions", items: [{ label: "Button", to: "/components/button" }] },
      { label: "Navigation", items: [{ label: "Tabs", to: "/components/tabs" }] },
    ],
  },
];

/** 同一份数据的抽屉形态（MenuGroup 与 SidebarNavGroup 同构，字段名不同）。 */
const DRAWER_GROUPS = SIDEBAR_GROUPS.map((group) => ({
  id: group.id,
  title: group.label,
  items: group.items.map((item) => ({ label: item.label, to: item.to })),
  ...(group.subgroups
    ? {
        subgroups: group.subgroups.map((subgroup) => ({
          title: subgroup.label,
          items: subgroup.items.map((item) => ({ label: item.label, to: item.to })),
        })),
      }
    : {}),
}));

let container: HTMLDivElement;
let root: Root;

function classesOf(element: Element | null | undefined): string[] {
  return (element?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
}

function sorted(element: Element | null | undefined): string[] {
  return [...classesOf(element)].sort();
}

function click(node: Element | null) {
  act(() => {
    node?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
}

/** 同时渲染两种形态：抽屉（<lg 折叠形态）+ 侧栏（≥lg 常驻形态）。 */
function renderBothForms() {
  act(() => {
    root.render(
      <MemoryRouter>
        <LanguageProvider>
          <HamburgerMenu
            anchor="topbar"
            open
            groups={DRAWER_GROUPS}
            activeTo="/components/button"
            collapsible
            persistKey={KEY}
          />
          <SidebarNav
            groups={SIDEBAR_GROUPS}
            activeTo="/components/button"
            collapsible
            persistKey={KEY}
          />
        </LanguageProvider>
      </MemoryRouter>,
    );
  });
}

const drawerNav = () => document.querySelector('[data-slot="menu-nav"]');
const sidebarNav = () => document.querySelector('[data-slot="sidebar-nav"]');
const q = (rootNode: Element | null, selector: string) => rootNode?.querySelector(selector) ?? null;

beforeEach(() => {
  window.localStorage.clear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
  window.localStorage.clear();
});

describe("nav surface parity — 抽屉向侧栏排版对齐", () => {
  it("条目行几何完全同源：差异只有「触控高档位」这一条", () => {
    renderBothForms();

    const sidebarItem = q(sidebarNav(), '[data-slot="sidebar-nav-item"]');
    const drawerItem = q(drawerNav(), '[data-slot="menu-group"] a');
    expect(sidebarItem).not.toBeNull();
    expect(drawerItem).not.toBeNull();

    const sidebarClasses = classesOf(sidebarItem);
    const drawerClasses = classesOf(drawerItem);

    // 侧栏的每一条几何/配色类，抽屉都得有（药丸内缩 -mx-1 px-3.5、圆角、字号、焦点环…）
    expect(sidebarClasses.filter((cls) => !drawerClasses.includes(cls))).toEqual([]);
    // 抽屉只多一个自适应高档位：鼠标 36px（= 侧栏）/ 触控 44px（HIG 命中区）
    expect(drawerClasses.filter((cls) => !sidebarClasses.includes(cls))).toEqual([
      "pointer-coarse:nav-item-row-touch",
    ]);
    expect(sidebarClasses).toContain("-mx-1");
    expect(sidebarClasses).toContain("nav-item-row");
  });

  it("分组标题是同一种折叠触发器：元素类型、类名、disclosure 语义与图标一致", () => {
    renderBothForms();

    const sidebarHeading = q(sidebarNav(), '[data-slot="sidebar-nav-heading"]') as HTMLElement | null;
    const drawerHeading = q(drawerNav(), '[data-slot="menu-group-heading"]') as HTMLElement | null;
    expect(sidebarHeading).not.toBeNull();
    expect(drawerHeading).not.toBeNull();

    expect(drawerHeading!.tagName).toBe(sidebarHeading!.tagName);
    expect(sorted(drawerHeading)).toEqual(sorted(sidebarHeading));
    expect(drawerHeading!.getAttribute("role")).toBe(sidebarHeading!.getAttribute("role"));
    expect(drawerHeading!.getAttribute("aria-expanded")).toBe("true");
    // 折叠图标来自同一标准 Collapse，两处都是 inline chevron
    expect(drawerHeading!.getAttribute("data-icon")).toBe("chevron");
    expect(sidebarHeading!.getAttribute("data-icon")).toBe("chevron");
    expect(drawerHeading!.getAttribute("data-indicator-align")).toBe("inline");
  });

  it("分组内容仍包在 px-1 里、二级小组小标题与短分割线同源", () => {
    renderBothForms();

    // px-1 包裹抵消条目的 -mx-1：药丸左缘 = 小标题左缘（层次感来自对齐）
    const drawerGroupBody = q(drawerNav(), '[data-slot="menu-group"] .px-1');
    expect(drawerGroupBody).not.toBeNull();

    const sidebarSubheading = q(sidebarNav(), '[data-slot="sidebar-nav-subheading"]');
    const drawerSubheading = q(drawerNav(), '[data-slot="menu-subgroup-heading"]');
    expect(sorted(drawerSubheading)).toEqual(sorted(sidebarSubheading));

    const sidebarDivider = q(sidebarNav(), '[data-slot="sidebar-nav-subgroup-divider"]');
    const drawerDivider = q(drawerNav(), '[data-slot="menu-subgroup-divider"]');
    for (const dividerClass of ["-ml-1", "nav-space-sibling", "bg-gray-alpha-400"]) {
      expect(classesOf(sidebarDivider)).toContain(dividerClass);
      expect(classesOf(drawerDivider)).toContain(dividerClass);
    }
  });

  it("分组之间的垂直节奏同源（gap-4），选中指示条同一支", () => {
    renderBothForms();

    for (const rhythmClass of ["flex", "flex-col", "gap-4"]) {
      expect(classesOf(sidebarNav())).toContain(rhythmClass);
      expect(classesOf(q(drawerNav(), '[data-slot="menu-list"]'))).toContain(rhythmClass);
    }

    const sidebarIndicator = q(sidebarNav(), '[data-slot="sidebar-nav-indicator"]');
    const drawerIndicator = q(drawerNav(), '[data-slot="menu-item-indicator"]');
    expect(drawerIndicator).not.toBeNull();
    expect(sorted(drawerIndicator)).toEqual(sorted(sidebarIndicator));
    for (const geometryClass of ["w-0.75", "h-3.5", "left-1.5", "top-1/2", "-translate-y-1/2"]) {
      expect(classesOf(sidebarIndicator)).toContain(geometryClass);
      expect(classesOf(drawerIndicator)).toContain(geometryClass);
    }
  });

  it("折叠记忆与侧栏共用同一个键：抽屉里折叠的分组，切到侧栏仍是折叠的", () => {
    renderBothForms();
    click(q(drawerNav(), '[data-slot="menu-group-heading"]'));

    expect(JSON.parse(window.localStorage.getItem(KEY) ?? "[]")).toEqual(["foundations"]);

    // 切到侧栏形态（同一份存储）：同一个分组保持折叠
    act(() => root.unmount());
    root = createRoot(container);
    act(() => {
      root.render(
        <MemoryRouter>
          <LanguageProvider>
            <SidebarNav groups={SIDEBAR_GROUPS} collapsible persistKey={KEY} />
          </LanguageProvider>
        </MemoryRouter>,
      );
    });

    const [firstSidebarHeading] = document.querySelectorAll<HTMLElement>(
      '[data-slot="sidebar-nav-heading"]',
    );
    expect(firstSidebarHeading.getAttribute("aria-expanded")).toBe("false");
  });

  it("docs 外壳：侧栏 aside 与抽屉导航区共用同一内缩与滚动条契约", () => {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={["/"]}>
          <LanguageProvider>
            <DocsSidebar />
            <HamburgerMenu anchor="topbar" open groups={DRAWER_GROUPS} activeTo="/" />
          </LanguageProvider>
        </MemoryRouter>,
      );
    });

    const aside = document.querySelector('[data-slot="docs-sidebar"]');
    const navClasses = classesOf(drawerNav());
    const asideClasses = classesOf(aside);

    // 滚动条契约（细滚动条 + 双侧稳定槽位）与内容内缩都来自库内共享常量/工具类
    expect(asideClasses).toContain("nav-scroll");
    expect(navClasses).toContain("nav-scroll");
    for (const insetClass of ["px-6", "py-4"]) {
      expect(asideClasses).toContain(insetClass);
      expect(navClasses).toContain(insetClass);
    }
  });

  it("几何与折叠记忆只在契约模块实现一次：两个组件不得各留一份", () => {
    const read = (relativePath: string) =>
      readFileSync(resolve(process.cwd(), relativePath), "utf8");
    const components = [
      read("src/components/ui/sidebar-nav.tsx"),
      read("src/components/ui/hamburger-menu.tsx"),
    ];

    for (const source of components) {
      // 两个标准导航组件都从同一契约模块取排版与折叠状态
      expect(source).toContain('from "./nav-layout"');
      // 不得再各自声明条目/包裹内缩常量
      expect(source).not.toMatch(/const ITEM_INSET\s*=/);
      expect(source).not.toMatch(/const GROUP_BODY_INSET\s*=/);
      // 折叠记忆（localStorage 读写）只有契约模块一份实现
      expect(source).not.toContain("localStorage.getItem");
      expect(source).not.toContain("localStorage.setItem");
    }

    const layout = read("src/components/ui/nav-layout.ts");
    expect(layout).toContain('export const NAV_ITEM_INSET = "-mx-1 px-3.5";');
    expect(layout).toContain('export const NAV_INSET_X = "px-6";');
    expect(layout).toContain("export function useNavGroupCollapse(");
  });
});
