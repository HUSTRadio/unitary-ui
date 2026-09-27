// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";

import { getVisibleViewport, subscribeToVisualViewport } from "../src/lib/visual-viewport";

/**
 * HIG-AUD-029 共享契约：可见视口（visual viewport）。
 *
 * 移动端软键盘弹起与双指缩放改变的是视觉视口，布局视口往往不变、`window` 也不一定
 * 派发 `resize`；浮层若只订阅布局视口就会停在旧位置。本文件把契约钉在可执行断言上，
 * e2e 行为侧见 `tests/e2e/edit-menu.spec.ts` 的 HIG-AUD-029 段。
 */

interface FakeVisualViewport {
  offsetLeft: number;
  offsetTop: number;
  width: number;
  height: number;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
}

function setVisualViewport(view: Partial<FakeVisualViewport> | undefined) {
  Object.defineProperty(window, "visualViewport", { configurable: true, value: view });
}

function makeVisualViewport(overrides: Partial<FakeVisualViewport> = {}): FakeVisualViewport {
  return {
    offsetLeft: 0,
    offsetTop: 0,
    width: 390,
    height: 440,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    ...overrides,
  };
}

afterEach(() => {
  // jsdom 默认没有 visualViewport；删掉自定义属性即回到「不支持」环境
  delete (window as unknown as { visualViewport?: unknown }).visualViewport;
  vi.restoreAllMocks();
});

describe("getVisibleViewport", () => {
  test("无 visualViewport 时回退到布局视口（SSR / jsdom 安全）", () => {
    setVisualViewport(undefined);

    const viewport = getVisibleViewport();

    expect(viewport.left).toBe(0);
    expect(viewport.top).toBe(0);
    expect(viewport.width).toBe(window.innerWidth);
    expect(viewport.height).toBe(window.innerHeight);
    expect(viewport.right).toBe(window.innerWidth);
    expect(viewport.bottom).toBe(window.innerHeight);
  });

  test("有 visualViewport 时以可见视口为准，而不是布局视口", () => {
    // 软键盘弹起 + 页面被平移：可见区变小且偏移
    setVisualViewport(makeVisualViewport({ offsetLeft: 24, offsetTop: 260, width: 390, height: 440 }));

    const viewport = getVisibleViewport();

    expect(viewport).toEqual({ left: 24, top: 260, right: 414, bottom: 700, width: 390, height: 440 });
  });
});

describe("subscribeToVisualViewport", () => {
  test("同时订阅布局视口与视觉视口的变化，并在取消时全部摘除", () => {
    const visualViewport = makeVisualViewport();
    setVisualViewport(visualViewport);
    const addWindow = vi.spyOn(window, "addEventListener");
    const removeWindow = vi.spyOn(window, "removeEventListener");
    const onChange = vi.fn();

    const unsubscribe = subscribeToVisualViewport(onChange);

    // 布局视口：resize + 捕获阶段 scroll（覆盖内部滚动容器）
    expect(addWindow).toHaveBeenCalledWith("resize", onChange);
    expect(addWindow).toHaveBeenCalledWith("scroll", onChange, true);
    // 视觉视口：软键盘弹起 / 双指缩放的两个信号
    expect(visualViewport.addEventListener).toHaveBeenCalledWith("resize", onChange);
    expect(visualViewport.addEventListener).toHaveBeenCalledWith("scroll", onChange);

    unsubscribe();

    expect(removeWindow).toHaveBeenCalledWith("resize", onChange);
    expect(removeWindow).toHaveBeenCalledWith("scroll", onChange, true);
    expect(visualViewport.removeEventListener).toHaveBeenCalledWith("resize", onChange);
    expect(visualViewport.removeEventListener).toHaveBeenCalledWith("scroll", onChange);
  });

  test("不支持 visualViewport 的环境不抛错，仅订阅布局视口", () => {
    setVisualViewport(undefined);
    const addWindow = vi.spyOn(window, "addEventListener");

    expect(() => subscribeToVisualViewport(vi.fn())()).not.toThrow();

    expect(addWindow).toHaveBeenCalledTimes(2);
  });
});
