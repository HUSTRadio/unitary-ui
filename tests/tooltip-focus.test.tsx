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

  test("does not add a tab stop to non-interactive children (HIG-AUD-015)", () => {
    act(() => {
      root.render(
        <Tooltip text="More context" delay={false}>
          <span>Target</span>
        </Tooltip>,
      );
    });

    // 纯展示子元素：不注入 tabIndex，也不制造焦点（此前为 `?? 0`，会把静态文本塞进 Tab 序列）
    const trigger = container.querySelector<HTMLElement>("span");
    expect(trigger?.hasAttribute("tabindex")).toBe(false);
    expect(trigger?.tabIndex).toBe(-1);
  });

  test("keeps a focusable child keyboard-triggerable", () => {
    act(() => {
      root.render(
        <Tooltip text="More context" delay={false}>
          <button type="button">Target</button>
        </Tooltip>,
      );
    });

    const trigger = container.querySelector<HTMLButtonElement>("button");
    expect(trigger?.tabIndex).toBe(0);
    act(() => trigger?.focus());
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
