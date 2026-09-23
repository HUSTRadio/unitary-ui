// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { Toasts, createToastStore } from "@/components/ui/toast";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
  vi.useRealTimers();
});

const items = () => Array.from(document.querySelectorAll<HTMLLIElement>('[data-slot="toasts"] li'));

/** HIG-AUD-014：隐藏项移出 Tab/无障碍树 + hover/focus 暂停自动关闭。 */
describe("Toasts visibility & timers", () => {
  test("hidden stack items leave the tab order and the a11y tree", () => {
    const store = createToastStore();
    act(() => root.render(<Toasts store={store} />));

    act(() => {
      for (let i = 0; i < 6; i += 1) store.message({ text: `Toast ${i}` });
    });

    const rendered = items();
    expect(rendered).toHaveLength(6);
    // DOM 顺序 = 入队顺序（旧 → 新）：最旧的两条 d >= MAX_STACK → 视觉隐藏，必须 inert + aria-hidden
    const hidden = rendered.filter((li) => li.hasAttribute("inert"));
    expect(hidden).toHaveLength(2);
    expect(rendered.slice(0, 2).every((li) => li.hasAttribute("inert"))).toBe(true);
    for (const li of hidden) {
      expect(li.getAttribute("aria-hidden")).toBe("true");
    }
    for (const li of rendered.slice(2)) {
      expect(li.hasAttribute("inert")).toBe(false);
      expect(li.hasAttribute("aria-hidden")).toBe(false);
    }
  });

  test("hovering the viewport pauses auto-dismiss and resumes with the remaining time", () => {
    const store = createToastStore();
    act(() => root.render(<Toasts store={store} />));
    act(() => {
      store.message({ text: "Hover me", duration: 1000 });
    });

    const viewport = document.querySelector<HTMLElement>('[data-slot="toasts"]')!;
    // React 的 onMouseEnter/Leave 由 mouseover/mouseout 委托合成
    act(() => {
      viewport.dispatchEvent(
        new MouseEvent("mouseover", { bubbles: true, relatedTarget: document.body }),
      );
    });

    // 悬停期间远超原时长仍不关闭
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(items()).toHaveLength(1);

    // 离开后按**剩余时间**续跑（不是重新计时）：再过 1000ms 进入退场，+400ms 真正出栈
    act(() => {
      viewport.dispatchEvent(
        new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body }),
      );
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(items()).toHaveLength(0);
  });

  test("focus inside a toast keeps it alive well past its duration", () => {
    const store = createToastStore();
    act(() => root.render(<Toasts store={store} />));
    act(() => {
      store.message({ text: "Focus me", duration: 500 });
    });

    const closeButton = document.querySelector<HTMLButtonElement>('[data-slot="toast-close"]')!;
    act(() => {
      closeButton.focus();
    });

    // 验收场景的等价断言：聚焦后停留 10s 不被关闭
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(items()).toHaveLength(1);

    // 焦点离开后按剩余量继续（500ms 内出栈）
    act(() => {
      closeButton.blur();
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(items()).toHaveLength(0);
  });
});
