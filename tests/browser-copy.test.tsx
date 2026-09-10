// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Browser } from "@/components/ui/browser";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

function mount() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<Browser address="https://example.com" />));
  return container.querySelector<HTMLButtonElement>('button[aria-label="Copy"]')!;
}

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  vi.restoreAllMocks();
});

describe("Browser copy feedback", () => {
  test("does not claim success when the Clipboard API is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    const button = mount();

    await act(async () => button.click());

    expect(button.getAttribute("aria-label")).toBe("Copy");
  });

  test("does not claim success when clipboard writing rejects", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    const button = mount();

    await act(async () => button.click());

    expect(button.getAttribute("aria-label")).toBe("Copy");
  });
});
