// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { ComponentsPage } from "../docs/geist/src/components/docs-components-page";
import { getDocsRoute } from "../docs/geist/src/data/docs-routes";
import { LanguageProvider } from "../docs/geist/src/i18n/language";
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
  const { default: App } = await import("../docs/geist/src/App");

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
