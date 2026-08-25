// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { DocsCardGrid } from "../docs/geist/src/components/docs-cards";
import { LanguageProvider } from "../docs/geist/src/i18n/language";

let container: HTMLDivElement;
let root: Root;

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  window.localStorage.setItem("geist-docs-language", "en-US");
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
});

async function render() {
  await act(async () => {
    root.render(
      <MemoryRouter>
        <LanguageProvider>
          <DocsCardGrid />
        </LanguageProvider>
      </MemoryRouter>,
    );
  });
}

describe("Introduction Components preview", () => {
  test("is an aria-hidden visual-only preview inside the single Components link", async () => {
    await render();

    const card = container.querySelector<HTMLAnchorElement>('a[href="#/components"]');
    const preview = card?.querySelector<HTMLElement>('[data-slot="components-preview"]');

    expect(card).not.toBeNull();
    expect(preview?.getAttribute("aria-hidden")).toBe("true");
    expect(
      preview?.querySelectorAll(
        'a[href],button,input,textarea,select,[role="button"],[tabindex]:not([tabindex="-1"])',
      ),
    ).toHaveLength(0);
    expect(card?.querySelectorAll('a[href],button,input,textarea,select,[role="button"]')).toHaveLength(
      0,
    );
    expect(preview?.textContent).toContain("$ vp dev docs/geist");
    expect(preview?.textContent).toContain("Collaborate");
    expect(preview?.textContent).toContain("Project name");
    expect(preview?.textContent).toContain("geist-docs");
  });
});
