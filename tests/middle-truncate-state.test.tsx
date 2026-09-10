// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { MiddleTruncate } from "../src/components/ui/middle-truncate";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
});

describe("MiddleTruncate value updates", () => {
  test("clears previously measured visible parts when value becomes empty", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    act(() => root.render(<MiddleTruncate value="feature/long-branch-name" />));
    act(() => root.render(<MiddleTruncate value="" />));

    const node = container.querySelector<HTMLElement>('[data-slot="middle-truncate"]')!;
    expect(node.dataset.value).toBe("");
    expect(node.textContent).toBe("");
  });
});
