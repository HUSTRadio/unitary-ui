// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { ComponentsPage } from "../docs/site/src/components/docs-components-page";
import { getDocsRoute } from "../docs/site/src/data/docs-routes";
import { LanguageProvider } from "../docs/site/src/i18n/language";
import { ThemeProvider } from "../src/lib/theme";

let container: HTMLDivElement;
let root: Root;
let restorePlatformApis: () => void;

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function stubProperty(target: object, name: string, value: unknown) {
  const descriptor = Object.getOwnPropertyDescriptor(target, name);
  Object.defineProperty(target, name, { configurable: true, writable: true, value });
  return () => {
    if (descriptor) {
      Object.defineProperty(target, name, descriptor);
    } else {
      Reflect.deleteProperty(target, name);
    }
  };
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const restoreMatchMedia = stubProperty(window, "matchMedia", (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
  const restoreScrollTo = stubProperty(window, "scrollTo", () => {});
  const restoreCanvasContext = stubProperty(HTMLCanvasElement.prototype, "getContext", () => null);
  restorePlatformApis = () => {
    restoreCanvasContext();
    restoreScrollTo();
    restoreMatchMedia();
  };
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
  document.documentElement.className = "";
  delete document.documentElement.dataset.theme;
  window.localStorage.clear();
  restorePlatformApis();
});

async function render(componentName?: string) {
  await act(async () => {
    root.render(
      <LanguageProvider>
        <ComponentsPage componentName={componentName} />
      </LanguageProvider>,
    );
  });
}

async function renderApp(pathname: string) {
  const { default: App } = await import("../docs/site/src/App");

  await act(async () => {
    root.render(
      <ThemeProvider>
        <LanguageProvider>
          <MemoryRouter initialEntries={[pathname]}>
            <App />
          </MemoryRouter>
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
}

describe("ComponentsPage canonical route input", () => {
  test("renders a detail page from an explicit component name", async () => {
    await render("avatar");

    expect(container.querySelector("h1")?.textContent).toBe("头像");
    expect(container.querySelector('a[href="#/components"]')).not.toBeNull();
  });

  test("lays out the Navbar demo brand and trailing label in one centered row", async () => {
    await render("navbar");

    const header = container.querySelector<HTMLElement>('[data-demo-card="default"] [data-slot="navbar"]');
    expect(header).not.toBeNull();
    expect(header?.classList.contains("flex")).toBe(true);
    expect(header?.classList.contains("items-center")).toBe(true);
    expect(header?.children[0]?.textContent).toBe("Unitary");
    expect(header?.children[1]?.textContent).toBe("Workspace");
    expect(header?.children[1]?.classList.contains("ml-auto")).toBe(true);
  });

  test("renders the overview when no component name is supplied", async () => {
    await render();

    expect(container.querySelector("h1")?.textContent).toBe("组件");
    expect(container.querySelector('a[href="#/components/avatar"]')).not.toBeNull();
    expect(container.querySelector('a[href="#/components"]')).toBeNull();
  });

  test("preserves a component detail descriptor through trailing-slash canonicalization", () => {
    expect(getDocsRoute("/components/avatar/")?.renderer).toEqual({
      kind: "component-detail",
      componentName: "avatar",
    });
  });

  test("routes a trailing-slash component detail through App", async () => {
    await renderApp("/components/avatar/");

    const pageTitle = container.querySelector("#main-content h1");
    expect(pageTitle?.textContent).toBe("头像");
    expect(pageTitle?.textContent).not.toBe("组件");
    expect(container.querySelector('a[href="#/components"]')).not.toBeNull();
  });
});

/**
 * BackLink 的图标/文本几何契约。
 *
 * 历史缺陷：图标与文本并排放在 `inline-flex items-center` 里。flex 对中的是**行盒**，
 * 而字体度量不对称——当前字体栈下（text-copy-14 = 15px/20px）CJK 字形实测
 * ascent 13 / descent 2，留白几乎全在上方，行盒中心比字形中心高约 1px，图标因此显得偏高。
 * 另外 `whitespace-nowrap` 缺失时 CJK 会在窄容器里逐字换行（"返回组件" 变成竖排多行）。
 */
describe("BackLink icon/text geometry contract", () => {
  test("wraps the icon and label in one nowrap inline-flex box and never overrides the line height", async () => {
    await render("avatar");

    const link = container.querySelector<HTMLAnchorElement>('a[href="#/components"]');
    expect(link).not.toBeNull();

    // 图标与文本必须同处一个 inline-flex 盒子，才能共享同一个行盒作为对中基准。
    const box = link!.querySelector<HTMLElement>("span");
    expect(box).not.toBeNull();
    expect(box!.className).toContain("inline-flex");
    expect(box!.className).toContain("items-center");
    expect(box!.querySelector("svg")).not.toBeNull();
    expect(box!.textContent?.trim().length).toBeGreaterThan(0);

    // CJK 不得逐字换行。
    const nowrapOwner = box!.className.includes("whitespace-nowrap")
      ? box!.className
      : link!.className;
    expect(nowrapOwner).toContain("whitespace-nowrap");

    // 不得覆盖 line-height：行盒高度就是墨迹参考框，压缩它会把图标再往下推。
    // 只看 className 字面量，避免把注释里提到的写法也算进来。
    const source = await import("node:fs/promises").then(({ readFile }) =>
      readFile("docs/site/src/components/docs-components-page.tsx", "utf8"),
    );
    const backLink = source.slice(source.indexOf("function BackLink()"));
    const block = backLink.slice(0, backLink.indexOf("\n}"));
    const classNames = [...block.matchAll(/className="([^"]*)"/g)].map((m) => m[1]).join(" ");
    expect(classNames).not.toMatch(/leading-\[/);
  });
});
