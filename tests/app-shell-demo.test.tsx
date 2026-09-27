// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { AppShellDemo } from "../docs/site/src/components/patterns/app-shell-demo";
import { LanguageProvider } from "../docs/site/src/i18n/language";
import { ThemeProvider } from "../src/lib/theme";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 未实现 matchMedia（ThemeProvider 的 system 主题解析需要）
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function renderAppShell(language: "zh-CN" | "en-US") {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <MemoryRouter initialEntries={["/"]}>
        <ThemeProvider>
          <LanguageProvider>
            <AppShellDemo language={language} />
          </LanguageProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );
  });
}

function windowSection(): HTMLElement {
  const section = document.querySelector<HTMLElement>("#demo-window");
  expect(section).not.toBeNull();
  return section as HTMLElement;
}

function toolbarItemByLabel(label: string): HTMLButtonElement {
  const items = Array.from(
    windowSection().querySelectorAll<HTMLButtonElement>('[data-slot="toolbar-item"]'),
  );
  const item = items.find((button) => button.getAttribute("aria-label") === label);
  expect(item, `toolbar item "${label}" 应存在`).toBeTruthy();
  return item as HTMLButtonElement;
}

/**
 * HIG-AUD E11 回归：app-shell pattern 页必须落地 MenuBar + Toolbar 组合演示
 * （浏览器窗口形态），工具栏命令需可观测地反馈到窗口状态行。
 */
describe("AppShellDemo · MenuBar + Toolbar 组合演示", () => {
  it("在浏览器窗口形态段落内同时渲染菜单栏与工具栏", () => {
    renderAppShell("zh-CN");
    const section = windowSection();
    expect(section.querySelector('[data-slot="menu-bar"]')).not.toBeNull();
    expect(section.querySelector('[data-slot="toolbar"]')).not.toBeNull();
    expect(
      section.querySelectorAll('[data-slot="menu-bar-trigger"]').length,
    ).toBeGreaterThanOrEqual(3);
  });

  it("菜单栏按双语目录渲染顶级菜单", () => {
    renderAppShell("zh-CN");
    const text = windowSection().textContent ?? "";
    expect(text).toContain("文件");
    expect(text).toContain("编辑");
    expect(text).toContain("显示");
  });

  it("英文环境渲染英文菜单与工具栏文案", () => {
    renderAppShell("en-US");
    const text = windowSection().textContent ?? "";
    expect(text).toContain("File");
    expect(text).toContain("Edit");
    expect(text).toContain("View");
    expect(toolbarItemByLabel("Grid view")).toBeTruthy();
    expect(toolbarItemByLabel("Share")).toBeTruthy();
  });

  it("工具栏命令反馈到窗口状态行，并切换分段选中态", () => {
    renderAppShell("zh-CN");
    const section = windowSection();
    const grid = toolbarItemByLabel("网格视图");
    const list = toolbarItemByLabel("列表视图");

    // 初始分段选中「网格视图」，状态行为未触发文案
    expect(grid.getAttribute("aria-pressed")).toBe("true");
    expect(list.getAttribute("aria-pressed")).toBe("false");
    expect(section.textContent ?? "").toContain("尚未触发");

    act(() => {
      list.click();
    });

    expect(list.getAttribute("aria-pressed")).toBe("true");
    expect(grid.getAttribute("aria-pressed")).toBe("false");
    expect(section.textContent ?? "").toContain("列表视图");
  });

  it("分段切换让窗口内容区在网格与列表两种排布间切换", () => {
    renderAppShell("zh-CN");
    const preview = () =>
      windowSection().querySelector<HTMLElement>('[data-slot="window-preview"]');
    const list = () => preview()?.querySelector("ul") ?? null;

    expect(preview()).not.toBeNull();
    expect(preview()?.getAttribute("data-view-mode")).toBe("grid");
    expect(preview()?.querySelectorAll('[data-slot="window-preview-item"]').length).toBe(4);
    expect(list()?.className).toContain("grid-cols");

    act(() => {
      toolbarItemByLabel("列表视图").click();
    });

    expect(preview()?.getAttribute("data-view-mode")).toBe("list");
    expect(preview()?.querySelectorAll('[data-slot="window-preview-item"]').length).toBe(4);
    expect(list()?.className).not.toContain("grid-cols");
  });

  // 回归（用户实测 2026-09-28）：整帧滚动时滚动条纵贯 topbar 右侧。根因是滚动 owner
  // 包住了 topbar。壳层必须把滚动限制在 topbar 之下——navbar 是滚动容器的兄弟而非后代，
  // 且自身不再 sticky（sticky 在非滚动祖先下会相对页面视口黏顶）。
  it("滚动 owner 只在 topbar 之下：navbar 不是滚动容器的后代", () => {
    renderAppShell("zh-CN");
    const viewport = document.querySelector('[data-slot="app-shell-viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport!.querySelector('[data-slot="navbar"]')).toBeNull();

    const navbar = document.querySelector<HTMLElement>('[data-slot="navbar"]');
    expect(navbar).not.toBeNull();
    expect(viewport!.previousElementSibling).toBe(navbar);
    expect(navbar!.getAttribute("data-behavior")).toBe("static");
    // 正文与页脚仍由同一个滚动容器承载
    expect(viewport!.querySelector('[data-slot="footer"]')).not.toBeNull();
  });

  it("锚点导航暴露新增的组合演示段落", () => {
    renderAppShell("zh-CN");
    const anchors = document.querySelectorAll('a[href="#demo-window"]');
    expect(anchors.length).toBeGreaterThanOrEqual(1);
  });
});
