// @vitest-environment jsdom
import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { Scroller } from "../src/components/ui/scroller";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const ssr = (props: React.ComponentProps<typeof Scroller>, children?: React.ReactNode) =>
  renderToStaticMarkup(React.createElement(Scroller, props, children));

const kids = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    React.createElement("div", { key: i, style: { width: 100, height: 100 } }),
  );

describe("Scroller official API contract (G09)", () => {
  test("G09-SCROLLER-02: direction buttons are 32x32 themed-surface controls (bg-background-100, themed fg, 1px gray-200 ring, rounded-full)", () => {
    const markup = ssr({ withButtons: true }, kids(4));
    const buttons = markup.match(/<button\b[^>]*>/g) ?? [];
    expect(buttons).toHaveLength(2);

    for (const btn of buttons) {
      // 官方实测：跟随主题表面（light #fff / dark #0a0a0a）+ 1px 灰环 + 主题前景图标
      expect(btn).toContain("size-8");
      expect(btn).toContain("bg-background-100");
      expect(btn).toContain("text-gray-1000"); // themed fg — light 黑图标 / dark 白图标
      expect(btn).toContain("border-gray-200"); // 1px hairline 环
      expect(btn).toContain("rounded-full");
      expect(btn).not.toContain("bg-gray-1000"); // 非反色实心
      expect(btn).not.toContain("border-0");
      expect(btn).not.toContain("rounded-[6px]");
    }

    // axis-correct aria labels
    expect(markup).toContain('aria-label="Scroll left"');
    expect(markup).toContain('aria-label="Scroll right"');

    // vertical axis flips the labels
    const vertical = ssr({ overflow: "y", withButtons: true }, kids(4));
    expect(vertical).toContain('aria-label="Scroll up"');
    expect(vertical).toContain('aria-label="Scroll down"');

    // no buttons without withButtons
    expect(ssr({}, kids(2))).not.toContain("<button");
  });

  test("G09-SCROLLER-03: container geometry — height/width pass through style, overflow maps to axis classes", () => {
    const markup = ssr({ height: 220, overflow: "y", width: "100%" }, kids(2));
    expect(markup).toContain('style="height:220px;width:100%"');
    expect(markup).toContain("overflow-y-auto");
    expect(markup).toContain("overflow-x-hidden");

    const horizontal = ssr({ overflow: "x" }, kids(2));
    expect(horizontal).toContain("overflow-x-auto");
    expect(horizontal).toContain("overflow-y-hidden");

    const both = ssr({ overflow: "both" }, kids(2));
    expect(both).toContain("overflow-auto");
  });
});

describe("Scroller scrollToChild behavior (G09-SCROLLER-03)", () => {
  let container: HTMLDivElement;
  let reactRoot: Root;
  let frames: Map<number, FrameRequestCallback>;
  let nextFrame: number;

  beforeEach(() => {
    frames = new Map();
    nextFrame = 0;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      const id = ++nextFrame;
      frames.set(id, callback);
      return id;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => { frames.delete(id); });
  });

  function render(element: React.ReactElement) {
    container = document.createElement("div");
    document.body.appendChild(container);
    reactRoot = createRoot(container);
    act(() => reactRoot.render(element));
  }

  afterEach(() => {
    act(() => reactRoot.unmount());
    container.remove();
    expect(frames.size).toBe(0);
    vi.restoreAllMocks();
  });

  function scrollEl(): HTMLDivElement {
    // scroll container is the last direct child of [data-slot="scroller"]
    return container.querySelector<HTMLDivElement>("[data-slot='scroller'] > :last-child")!;
  }

  function rect(left: number, top: number, width: number, height: number): DOMRect {
    return {
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
      toJSON: () => ({}),
    } as DOMRect;
  }

  /** Mock layout: one item per viewport, children at content offset stride 100.
   *  Rects are viewport-relative, so they shift by the container's scroll position. */
  function mockLayout(): { scroll: HTMLDivElement; scrollTo: ReturnType<typeof vi.fn> } {
    const scroll = scrollEl();
    const items = Array.from(scroll.children) as HTMLElement[];
    expect(items.length).toBeGreaterThanOrEqual(3);
    vi.spyOn(scroll, "getBoundingClientRect").mockReturnValue(rect(0, 0, 100, 100));
    for (const [key, value] of Object.entries({ clientWidth: 100, clientHeight: 100, scrollWidth: 400, scrollHeight: 400 })) {
      Object.defineProperty(scroll, key, { configurable: true, value });
    }
    items.forEach((item, i) =>
      vi
        .spyOn(item, "getBoundingClientRect")
        .mockImplementation(() =>
          rect(i * 100 - scroll.scrollLeft, i * 100 - scroll.scrollTop, 100, 100),
        ),
    );
    // own property shadows jsdom's unimplemented prototype scrollTo
    const scrollTo = vi.fn();
    Object.defineProperty(scroll, "scrollTo", {
      configurable: true,
      writable: true,
      value: scrollTo,
    });
    return { scroll, scrollTo };
  }

  function clickButton(index: 0 | 1) {
    const buttons = container.querySelectorAll<HTMLButtonElement>("[data-slot='scroller'] button");
    act(() =>
      buttons[index].dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
    );
    const callbacks = [...frames.values()];
    frames.clear();
    act(() => callbacks.forEach((callback) => callback(0)));
  }

  test("horizontal: next/prev buttons scroll to the adjacent direct child", () => {
    render(React.createElement(Scroller, { withButtons: true, overflow: "x" }, kids(4)));
    const { scroll, scrollTo } = mockLayout();

    // at start, "right" advances to the 2nd child (offset 100)
    clickButton(1);
    expect(scroll.scrollLeft).toBe(100);

    // simulate scrolled position -> "right" advances to the 3rd child
    scroll.scrollLeft = 120;
    clickButton(1);
    expect(scroll.scrollLeft).toBe(200);

    // "left" steps back to the 2nd child
    clickButton(0);
    expect(scroll.scrollLeft).toBe(100);

    // at the very start, "left" wraps to the first child
    scroll.scrollLeft = 0;
    clickButton(0);
    expect(scroll.scrollLeft).toBe(0);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  test("vertical: down/up buttons scroll along scrollTop", () => {
    render(React.createElement(Scroller, { withButtons: true, overflow: "y" }, kids(3)));
    const { scroll, scrollTo } = mockLayout();

    clickButton(1); // down -> 2nd child
    expect(scroll.scrollTop).toBe(100);

    scroll.scrollTop = 120;
    clickButton(1); // down -> 3rd child
    expect(scroll.scrollTop).toBe(200);

    clickButton(0); // up -> 2nd child
    expect(scroll.scrollTop).toBe(100);
    expect(scroll.scrollLeft).toBe(0);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  test("RTL steps through direct children using signed browser coordinates", () => {
    render(React.createElement(Scroller, { withButtons: true }, kids(4)));
    const { scroll } = mockLayout();
    scroll.style.direction = "rtl";
    [...scroll.children].forEach((item, i) => {
      vi.spyOn(item, "getBoundingClientRect").mockImplementation(() => rect(-i * 100 - scroll.scrollLeft, 0, 100, 100));
    });
    clickButton(1);
    expect(scroll.scrollLeft).toBe(-100);
    clickButton(1);
    expect(scroll.scrollLeft).toBe(-200);
    clickButton(0);
    expect(scroll.scrollLeft).toBe(-100);
  });

  test("unmount cancels a requested animation without a later write", () => {
    render(React.createElement(Scroller, { withButtons: true }, kids(4)));
    const { scroll } = mockLayout();
    scroll.style.setProperty("--uni-motion-state", "300ms");
    scroll.style.setProperty("--ease-in-out", "cubic-bezier(0.42, 0, 0.58, 1)");
    clickButton(1);
    expect(frames.size).toBe(1);
    const stoppedAt = scroll.scrollLeft;
    act(() => reactRoot.unmount());
    expect(frames.size).toBe(0);
    expect(scroll.scrollLeft).toBe(stoppedAt);
  });
});
