// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { LanguageProvider } from "../docs/geist/src/i18n/language";
import { ThemeProvider } from "../src/lib/theme";
import { DocsBanner } from "../docs/geist/src/components/docs-shell";

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

const shell = readFileSync(
  resolve(process.cwd(), "docs/geist/src/components/docs-shell.tsx"),
  "utf8",
);

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function renderBanner() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <MemoryRouter initialEntries={["/"]}>
        <ThemeProvider>
          <LanguageProvider>
            <DocsBanner onSearchOpen={() => {}} />
          </LanguageProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );
  });
}

/** 打开汉堡抽屉（面板经 Radix Portal 挂在 document.body） */
function openDrawer() {
  const trigger = document.querySelector<HTMLButtonElement>('[data-slot="hamburger-trigger"]');
  act(() => {
    trigger?.click();
  });
}

describe("Docs shell drawer nav tiers (md+ dedup)", () => {
  // 2026-09-23 契约：工具行（搜索/主题/语言）的 md 隐藏由行级规则统一承担，
  // 行内 slots 不再各自带 md:hidden —— 同一意图只保留一处表达。
  test("the toolbar row is the single owner of the md-hidden rule", () => {
    expect(shell).toContain("[&>[data-slot=panel-toolbar]]:md:hidden");
    expect(shell).not.toContain('hover:bg-[var(--uni-gray-alpha-200)] md:hidden');
    expect(shell).not.toContain('className="flex items-center gap-2 md:hidden"');
  });

  test("drawer toolbar hosts the labeled mobile slots", () => {
    renderBanner();
    openDrawer();
    const toolbar = document.querySelector('[data-slot="panel-toolbar"]');
    expect(toolbar).not.toBeNull();
    // slots 内容在 <md 渲染（md 起的隐藏交给行级规则）
    expect(toolbar!.className).not.toContain("md:hidden");
    const labeled = toolbar!.querySelectorAll("button[aria-label]");
    expect(labeled.length).toBeGreaterThanOrEqual(1);
  });

  // belowTopbar 下 topbar 保持可见可交互，其触发按钮打开态即关闭控件；
  // 面板内再渲染一个 X 会与它垂直相邻、功能重复（用户实测 390 视口）。
  test("close control is the topbar trigger — no second X inside the panel", () => {
    renderBanner();
    openDrawer();
    expect(document.querySelector('[data-slot="expand-panel"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="panel-close"]')).toBeNull();

    const trigger = document.querySelector<HTMLButtonElement>(
      '[data-slot="hamburger-trigger"]',
    )!;
    expect(trigger.getAttribute("aria-label")).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    act(() => trigger.click());
    expect(document.querySelector('[data-slot="expand-panel"]')).toBeNull();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
