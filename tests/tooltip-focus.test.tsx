// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { Tooltip } from "@/components/ui/tooltip";

describe("Tooltip keyboard trigger contract", () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalResizeObserver: typeof ResizeObserver | undefined;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    originalResizeObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as typeof ResizeObserver;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    if (originalResizeObserver) globalThis.ResizeObserver = originalResizeObserver;
    else delete (globalThis as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  test("makes a non-interactive element child keyboard-focusable", () => {
    act(() => {
      root.render(
        <Tooltip text="More context" delay={false}>
          <span>Target</span>
        </Tooltip>,
      );
    });

    const trigger = container.querySelector<HTMLElement>("span");
    expect(trigger?.tabIndex).toBe(0);
    trigger?.focus();
    expect(document.activeElement).toBe(trigger);
  });

  test("preserves an explicit consumer tabIndex", () => {
    act(() => {
      root.render(
        <Tooltip text="More context" delay={false}>
          <span tabIndex={-1}>Programmatic target</span>
        </Tooltip>,
      );
    });

    expect(container.querySelector<HTMLElement>("span")?.tabIndex).toBe(-1);
  });
});
