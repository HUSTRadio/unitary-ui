// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { ComponentsPage } from "../docs/geist/src/components/docs-components-page";
import { getDocsRoute } from "../docs/geist/src/data/docs-routes";
import { LanguageProvider } from "../docs/geist/src/i18n/language";

let container: HTMLDivElement;
let root: Root;

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
  window.localStorage.clear();
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

  test("passes the canonical detail descriptor to ComponentsPage", () => {
    const appSource = readFileSync(resolve(process.cwd(), "docs/geist/src/App.tsx"), "utf8");

    expect(appSource).toContain('route?.renderer.kind === "component-detail"');
    expect(appSource).toContain("route.renderer.componentName");
    expect(appSource).toContain("<ComponentsPage componentName={componentName} />");
  });
});
