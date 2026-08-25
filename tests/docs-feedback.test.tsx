// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { DocsPagination, FeedbackPanel } from "../docs/geist/src/components/docs-feedback";
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
});

async function render(element: React.ReactElement) {
  await act(async () => {
    root.render(<LanguageProvider>{element}</LanguageProvider>);
  });
}

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
    expect(nav.textContent).toContain("上一页");
    expect(nav.textContent).toContain("下一页");
    expect(nav.querySelectorAll('[role="radio"]')).toHaveLength(4);
  });
});
