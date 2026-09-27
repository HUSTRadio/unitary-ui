// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 未实现 matchMedia（ThemeProvider 初始化需要）
if (typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  });
}

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(small = false) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root.render(
      <ThemeProvider>
        <I18nProvider locale="en">
          <ThemeSwitcher small={small} />
        </I18nProvider>
      </ThemeProvider>,
    ),
  );
  return container;
}

describe("ThemeSwitcher system icon", () => {
  test("renders both Monitor and Smartphone icons for the system option (CSS viewport switch)", () => {
    const c = mount();
    const html = c.innerHTML;

    // system 按钮同时携带桌面/手机两个图标，由 max-md / md 工具类按视口切换
    expect(html).toContain("lucide-monitor");
    expect(html).toContain("lucide-smartphone");

    // 手机图标仅在窄视口（<md）显示：max-md:static（占位占高度），md:absolute md:invisible（绝对定位+隐藏）
    // 桌面图标仅 ≥md 显示：max-md:absolute max-md:invisible（隐藏占位），md:visible（可见）
    expect(html).toMatch(/lucide-smartphone[^>]*max-md:static/);
    expect(html).toMatch(/lucide-monitor[^>]*max-md:absolute/);
  });

  test("small variant keeps the same dual-icon behavior with size-3.5", () => {
    const c = mount(true);
    const html = c.innerHTML;
    expect(html).toContain("lucide-monitor");
    expect(html).toContain("lucide-smartphone");
    expect(html).toMatch(/lucide-smartphone[^>]*size-3\.5/);
  });
});
