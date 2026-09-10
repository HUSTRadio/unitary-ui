// @vitest-environment jsdom
// Behaviour tests for the Toast "Action" and "Undo" docs examples.
// Acceptance: both demos must carry real local fence state, and the toast
// action/undo callback must actually flip it (no dead callbacks). The state
// indicator is locale-independent through [data-demo="fence-state"] +
// [data-position] and bilingual through the docs LanguageProvider (?lang=).
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { Toasts } from "@/components/ui/toast";
import { LanguageProvider } from "../docs/geist/src/i18n/language";
import { ToastAction64CFF131Example } from "../docs/geist/src/examples/toast/action-64cff131.example";
import { ToastUndoA8283ADEExample } from "../docs/geist/src/examples/toast/undo-a8283ade.example";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

function setDocsLanguage(language: "zh-CN" | "en-US") {
  window.history.replaceState(null, "", `/?lang=${language}`);
}

function renderExample(node: React.ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <LanguageProvider>
        {node}
        <Toasts />
      </LanguageProvider>,
    );
  });
}

function disposeRender() {
  if (root) act(() => root.unmount());
  container?.remove();
}

function drainToasts() {
  // the toast store is module-global; close anything still on screen
  document.querySelectorAll('[data-slot="toasts"] li').forEach((li) => {
    const close = li.querySelector<HTMLButtonElement>('[data-slot="toast-close"]');
    if (close) act(() => close.click());
  });
}

function clickShowToast() {
  const button = [...container.querySelectorAll<HTMLButtonElement>("button")].find(
    (b) => b.textContent === "Show Toast",
  )!;
  expect(button, "Show Toast button").toBeDefined();
  act(() => button.click());
}

function clickToastAction(label: string) {
  const items = document.querySelectorAll<HTMLElement>('[data-slot="toasts"] li');
  expect(items.length, "visible toast").toBeGreaterThan(0);
  const toast = items[items.length - 1] as HTMLLIElement;
  const action = [...toast.querySelectorAll<HTMLButtonElement>('[data-slot="toast-action"]')].find(
    (b) => b.textContent === label,
  )!;
  expect(action, `toast action button "${label}"`).toBeDefined();
  act(() => action.click());
}

function fencePosition(): string {
  const el = container.querySelector<HTMLElement>('[data-demo="fence-state"]')!;
  expect(el, 'state indicator [data-demo="fence-state"]').toBeDefined();
  return el.dataset.position ?? "";
}

describe.each([
  ["en-US", "Undo", "fence"],
  ["zh-CN", "撤销", "栅栏"],
] as const)("%s locale", (lang, undoLabel, fenceWord) => {
  beforeEach(() => setDocsLanguage(lang));
  afterEach(() => {
    drainToasts();
    disposeRender();
  });

  test("Action example: action button performs the real jump and Undo action reverts it", () => {
    renderExample(<ToastAction64CFF131Example />);
    expect(fencePosition()).toBe("behind");
    // the visible copy is localized through the inline locale table
    expect(
      container.querySelector<HTMLElement>('[data-demo="fence-state"]')!.textContent,
    ).toContain(fenceWord);

    clickShowToast();
    expect(fencePosition()).toBe("over");
    // the toast carries the raw action label from `action: "Undo"`
    clickToastAction("Undo");
    expect(fencePosition()).toBe("behind");
    expect(document.querySelectorAll('[data-slot="toasts"] li').length).toBe(0);
  });

  test("Undo example: onUndoAction reverts the jump through the localized built-in label", () => {
    renderExample(<ToastUndoA8283ADEExample />);
    expect(fencePosition()).toBe("behind");
    clickShowToast();
    expect(fencePosition()).toBe("over");
    // onUndoAction renders t("Undo") -> localized label, not a raw string
    clickToastAction(undoLabel);
    expect(fencePosition()).toBe("behind");
    expect(document.querySelectorAll('[data-slot="toasts"] li').length).toBe(0);
  });
});

describe("Action vs Undo example distinction", () => {
  beforeEach(() => setDocsLanguage("en-US"));
  afterEach(() => {
    drainToasts();
    disposeRender();
  });

  test("undo toast keeps the built-in undo label while action toast uses the custom action string", () => {
    renderExample(<ToastAction64CFF131Example />);
    clickShowToast();
    const actionToast = document.querySelectorAll<HTMLElement>(
      '[data-slot="toasts"] li',
    )[0] as HTMLLIElement;
    expect(
      actionToast.querySelector<HTMLElement>('[data-slot="toast-action"]')!.textContent,
    ).toBe("Undo");
    drainToasts();
    disposeRender();

    renderExample(<ToastUndoA8283ADEExample />);
    clickShowToast();
    const undoToast = document.querySelectorAll<HTMLElement>(
      '[data-slot="toasts"] li',
    )[0] as HTMLLIElement;
    expect(
      undoToast.querySelector<HTMLElement>('[data-slot="toast-action"]')!.textContent,
    ).toBe("Undo");
    expect(undoToast.querySelector('[data-slot="toast-close"]')).toBeTruthy();
    drainToasts();
  });
});
