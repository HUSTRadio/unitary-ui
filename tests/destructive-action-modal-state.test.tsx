// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

function renderModal(open: boolean) {
  act(() =>
    root.render(
      <DestructiveActionModal
        open={open}
        title="Delete project"
        confirmLabel="Delete"
        verificationPhrase="unitary"
      />,
    ),
  );
}

function setInputValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

describe("DestructiveActionModal verification gate", () => {
  test("requires the verification phrase again after reopening", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    renderModal(true);
    const input = document.querySelector<HTMLInputElement>('input[aria-labelledby$="-label"]')!;
    act(() => setInputValue(input, "unitary"));
    expect(document.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(false);

    renderModal(false);
    renderModal(true);

    expect(document.querySelector<HTMLInputElement>('input[aria-labelledby$="-label"]')!.value).toBe("");
    expect(document.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(true);
  });
});
