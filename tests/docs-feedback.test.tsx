// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { DocsPagination, FeedbackPanel } from "../docs/geist/src/components/docs-feedback";
import { DOCS_ROUTE_SEQUENCE } from "../docs/geist/src/data/docs-routes";
import { LanguageProvider, type DocsLanguage } from "../docs/geist/src/i18n/language";

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
  window.history.replaceState(null, "", "/");
});

async function render(element: React.ReactElement, language: DocsLanguage = "zh-CN") {
  window.localStorage.setItem("geist-docs-language", language);
  await act(async () => {
    root.render(<LanguageProvider>{element}</LanguageProvider>);
  });
}

const componentDetailIndex = DOCS_ROUTE_SEQUENCE.findIndex(
  (route) => route.renderer.kind === "component-detail",
);
const componentDetailRoute = DOCS_ROUTE_SEQUENCE[componentDetailIndex]!;
const componentDetailPrevious = DOCS_ROUTE_SEQUENCE[componentDetailIndex - 1]!;
const componentDetailNext = DOCS_ROUTE_SEQUENCE[componentDetailIndex + 1]!;
const appShellPrevious = DOCS_ROUTE_SEQUENCE[DOCS_ROUTE_SEQUENCE.length - 2]!;

const paginationCases = [
  { pathname: "/", previous: null, next: "/icons" },
  { pathname: "/introduction", previous: null, next: "/icons" },
  { pathname: "/icons", previous: "/", next: "/colors" },
  {
    pathname: componentDetailRoute.to,
    previous: componentDetailPrevious.to,
    next: componentDetailNext.to,
  },
  { pathname: "/patterns/app-shell", previous: appShellPrevious.to, next: null },
  { pathname: "/not-a-doc-route", previous: null, next: null },
] as const;

describe("docs feedback", () => {
  test("shows all four ratings by default instead of a modal trigger", async () => {
    await render(<FeedbackPanel />);

    expect(container.querySelectorAll('[role="radio"]')).toHaveLength(4);
    expect(container.querySelector('[data-slot="feedback-popup"]')).toBeNull();
    expect(document.querySelector('[data-slot="modal-overlay"]')).toBeNull();
  });

  test("rating opens an anchored local popup without a global overlay or scroll lock", async () => {
    await render(<FeedbackPanel />);
    const rating = container.querySelectorAll<HTMLButtonElement>('[role="radio"]')[3];

    await act(async () => rating.click());

    const popup = container.querySelector<HTMLElement>('[data-slot="feedback-popup"]');
    expect(popup?.getAttribute("role")).toBe("dialog");
    expect(popup?.parentElement?.getAttribute("data-slot")).toBe("feedback-anchor");
    expect(document.querySelector('[data-slot="modal-overlay"]')).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  test("keeps previous, feedback and next in one desktop grid and moves feedback above paging on narrow screens", async () => {
    await render(
      <MemoryRouter initialEntries={["/colors"]}>
        <DocsPagination />
      </MemoryRouter>,
    );

    const nav = container.querySelector("nav")!;
    expect(nav.className).toContain("grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]");
    expect(nav.className).toContain("max-[480px]:grid-cols-2");
    expect(nav.getAttribute("aria-label")).toBe("文档分页");
    expect(nav.textContent).toContain("上一页");
    expect(nav.textContent).toContain("下一页");
    expect(nav.querySelectorAll('[role="radio"]')).toHaveLength(4);
  });

  test.each(paginationCases)(
    "renders canonical pagination and feedback for $pathname",
    async ({ pathname, previous, next }) => {
      await render(
        <MemoryRouter key={pathname} initialEntries={[pathname]}>
          <DocsPagination />
        </MemoryRouter>,
      );

      const feedback = container.querySelector('[data-slot="feedback-anchor"]');
      const previousLink = container.querySelector("div.col-start-1 > a");
      const nextLink = container.querySelector("div.col-start-3 > a");
      const links = Array.from(container.querySelectorAll("a")).map((anchor) =>
        anchor.getAttribute("href"),
      );
      expect(feedback).not.toBeNull();
      expect(links).toEqual([previous, next].filter((href): href is string => href !== null));

      if (previous === null) {
        expect(previousLink).toBeNull();
      } else {
        expect(previousLink).not.toBeNull();
        expect(previousLink?.getAttribute("href")).toBe(previous);
      }

      if (next === null) {
        expect(nextLink).toBeNull();
      } else {
        expect(nextLink).not.toBeNull();
        expect(nextLink?.getAttribute("href")).toBe(next);
      }
    },
  );

  test("localizes the pagination landmark independently from the next-link label", async () => {
    await render(
      <MemoryRouter initialEntries={["/icons"]}>
        <DocsPagination />
      </MemoryRouter>,
      "en-US",
    );

    const nav = container.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe("Documentation pagination");
    expect(nav?.textContent).toContain("Previous");
    expect(nav?.textContent).toContain("Next");
  });
});
