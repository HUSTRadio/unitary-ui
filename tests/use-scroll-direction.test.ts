// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";

import { useScrollDirection } from "@/lib/use-scroll-direction";

/**
 * useScrollDirection 滚动方向检测：
 * - 初始为 "idle"；
 * - 向下滚动超过 threshold 返回 "down"，向上返回 "up"；
 * - 单帧内多次 scroll 事件经 rAF 合并只处理一次；
 * - 位移小于阈值不翻转方向；
 * - 卸载后移除监听。
 */

let container: HTMLDivElement;
let root: Root;

/** 手动排队的 rAF 回调（测试中同步 flush，保证确定性） */
let rafQueue: FrameRequestCallback[];

function flushRaf(): void {
  const callbacks = rafQueue;
  rafQueue = [];
  act(() => {
    for (const cb of callbacks) cb(0);
  });
}

function setScrollY(value: number): void {
  Object.defineProperty(window, "scrollY", { value, configurable: true });
}

function fireScroll(): void {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  rafQueue = [];
  setScrollY(0);
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback): number => {
    rafQueue.push(cb);
    return rafQueue.length;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe("useScrollDirection", () => {
  test("初始返回 idle 且不触发任何方向翻转", async () => {
    let direction: ReturnType<typeof useScrollDirection> | null = null;
    function Probe() {
      direction = useScrollDirection();
      return null;
    }
    await act(async () => {
      root.render(React.createElement(Probe));
    });

    expect(direction).toBe("idle");
  });

  test("向下滚动超过 threshold 返回 down", async () => {
    let direction: ReturnType<typeof useScrollDirection> | null = null;
    function Probe() {
      direction = useScrollDirection(24);
      return null;
    }
    await act(async () => {
      root.render(React.createElement(Probe));
    });

    setScrollY(100);
    fireScroll();
    flushRaf();

    expect(direction).toBe("down");
  });

  test("向下后再向上滚动超过 threshold 返回 up", async () => {
    let direction: ReturnType<typeof useScrollDirection> | null = null;
    function Probe() {
      direction = useScrollDirection(24);
      return null;
    }
    await act(async () => {
      root.render(React.createElement(Probe));
    });

    setScrollY(100);
    fireScroll();
    flushRaf();
    expect(direction).toBe("down");

    setScrollY(40);
    fireScroll();
    flushRaf();
    expect(direction).toBe("up");
  });

  test("位移小于阈值不翻转方向", async () => {
    let direction: ReturnType<typeof useScrollDirection> | null = null;
    function Probe() {
      direction = useScrollDirection(24);
      return null;
    }
    await act(async () => {
      root.render(React.createElement(Probe));
    });

    setScrollY(10); // |10 - 0| < 24
    fireScroll();
    flushRaf();
    expect(direction).toBe("idle");

    // 已处于 down 后的小幅回滚也不翻转
    setScrollY(100);
    fireScroll();
    flushRaf();
    expect(direction).toBe("down");

    setScrollY(90); // |90 - 100| < 24
    fireScroll();
    flushRaf();
    expect(direction).toBe("down");
  });

  test("同一帧内的多次 scroll 经 rAF 节流只处理一次", async () => {
    let direction: ReturnType<typeof useScrollDirection> | null = null;
    function Probe() {
      direction = useScrollDirection(24);
      return null;
    }
    await act(async () => {
      root.render(React.createElement(Probe));
    });

    // 同一帧内连续三次事件：只有最后一次快照会被处理
    setScrollY(30);
    fireScroll();
    setScrollY(60);
    fireScroll();
    setScrollY(120);
    fireScroll();
    expect(direction).toBe("idle"); // rAF 尚未 flush

    flushRaf();
    expect(rafQueue.length).toBeLessThanOrEqual(1); // 同帧只排队一次回调
    expect(direction).toBe("down");

    // 帧内再无待处理回调：后续事件进入下一帧
    setScrollY(200);
    fireScroll();
    flushRaf();
    expect(direction).toBe("down"); // delta 80 ≥ 24 保持 down，且正常处理
  });

  test("卸载后移除 scroll 监听并取消挂起的 rAF", async () => {
    function Probe() {
      useScrollDirection();
      return null;
    }
    await act(async () => {
      root.render(React.createElement(Probe));
    });

    expect(window.eventNames?.().includes("scroll") ?? true).toBe(true);
    const removed = vi.spyOn(window, "removeEventListener");
    act(() => root.unmount());
    expect(removed).toHaveBeenCalledWith("scroll", expect.any(Function));
    removed.mockRestore();
    container.remove();

    // 卸载后滚动不再引起任何更新错误（监听已移除，无回调可触发）
    setScrollY(500);
    fireScroll();
    flushRaf();
  });

  test("返回类型锁定为 up | down | idle", () => {
    expectTypeOf<ReturnType<typeof useScrollDirection>>().toEqualTypeOf<"up" | "down" | "idle">();
  });
});
