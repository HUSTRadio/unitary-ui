// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { animateScroll, inlineScrollLeft, inlineScrollPosition, scrollIntoViewWithMotion, type ScrollAnimation } from "../src/lib/scroll-animation";

let owner: HTMLDivElement;
let frames: Map<number, FrameRequestCallback>;
let clock: number;
let nextFrame: number;
let reduced: boolean;
let listeners: Set<() => void>;
let animations: ScrollAnimation[];

function frame(elapsed = 0) {
  clock += elapsed;
  const callbacks = [...frames.values()];
  frames.clear();
  callbacks.forEach((callback) => callback(clock));
}

function start(options: Parameters<typeof animateScroll>[1]) {
  const animation = animateScroll(owner, options);
  animations.push(animation);
  return animation;
}

beforeEach(() => {
  frames = new Map();
  listeners = new Set();
  animations = [];
  clock = 0;
  nextFrame = 0;
  reduced = false;
  owner = document.createElement("div");
  document.body.appendChild(owner);
  owner.style.setProperty("--uni-motion-state", "300ms");
  owner.style.setProperty("--ease-in-out", "cubic-bezier(0.42, 0, 0.58, 1)");
  for (const [key, value] of Object.entries({ clientWidth: 100, clientHeight: 100, scrollWidth: 600, scrollHeight: 600 })) {
    Object.defineProperty(owner, key, { configurable: true, value });
  }
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => { frames.delete(id); });
  vi.spyOn(window.performance, "now").mockImplementation(() => clock);
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    get matches() { return reduced; },
    addEventListener: (_event: string, listener: () => void) => { listeners.add(listener); },
    removeEventListener: (_event: string, listener: () => void) => { listeners.delete(listener); },
  })));
});

afterEach(() => {
  animations.forEach((animation) => animation.cancel());
  owner.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("shared programmatic scroll timeline", () => {
  it("uses nonlinear progress, exact endpoints and leaves the other axis unchanged", () => {
    owner.scrollLeft = 35;
    const finish = vi.fn();
    start({ destination: { top: 500 }, onFinish: finish });
    frame();
    expect(owner.scrollTop).toBe(0);
    frame(75);
    expect(owner.scrollTop).toBeCloseTo(64.58, 1);
    frame(75);
    expect(owner.scrollTop).toBeCloseTo(250, 5);
    frame(150);
    expect(owner.scrollTop).toBe(500);
    expect(owner.scrollLeft).toBe(35);
    expect(frames.size).toBe(0);
    expect(listeners.size).toBe(0);
    expect(finish).toHaveBeenCalledExactlyOnceWith(true);
  });

  it("replaces an in-flight request from its current position and keeps one RAF", () => {
    const firstFinish = vi.fn();
    start({ destination: { top: 500 }, onFinish: firstFinish });
    frame();
    frame(150);
    const interrupted = owner.scrollTop;
    expect(interrupted).toBeCloseTo(250, 5);
    start({ destination: { top: 0 } });
    expect(firstFinish).toHaveBeenCalledExactlyOnceWith(false);
    expect(frames.size).toBe(1);
    frame();
    expect(owner.scrollTop).toBe(interrupted);
    frame(150);
    expect(owner.scrollTop).toBeCloseTo(interrupted / 2, 5);
    frame(150);
    expect(owner.scrollTop).toBe(0);
    expect(frames.size).toBe(0);
  });

  it.each(["wheel", "touchstart", "pointerdown", "keydown"])("%s cancels without jumping to the destination or retaining listeners", (event) => {
    const finished = vi.fn();
    start({ destination: { top: 500 }, onFinish: finished });
    frame();
    frame(75);
    const interrupted = owner.scrollTop;
    owner.dispatchEvent(event === "keydown" ? new KeyboardEvent(event, { key: "PageDown" }) : new Event(event));
    expect(frames.size).toBe(0);
    expect(owner.scrollTop).toBe(interrupted);
    expect(finished).toHaveBeenCalledExactlyOnceWith(false);
    expect(listeners.size).toBe(0);
  });

  it("dynamic reduced motion immediately reaches the target and releases RAF", () => {
    start({ destination: { top: 500 } });
    frame();
    frame(75);
    reduced = true;
    [...listeners].forEach((listener) => listener());
    expect(owner.scrollTop).toBe(500);
    expect(frames.size).toBe(0);
    expect(listeners.size).toBe(0);
  });

  it.each(["linear", "cubic-bezier(0, 0, 1, 1)", "invalid", ""])("invalid or linear curve %s completes without intermediate movement", (curve) => {
    owner.style.setProperty("--ease-in-out", curve);
    start({ destination: { top: 500 } });
    frame();
    expect(owner.scrollTop).toBe(500);
    expect(frames.size).toBe(0);
  });

  it("consumes seconds and the target's scoped timing rather than a numeric fallback", () => {
    const target = document.createElement("div");
    target.style.setProperty("--uni-motion-state", "0.6s");
    target.style.setProperty("--ease-in-out", "cubic-bezier(0.42, 0, 0.58, 1)");
    owner.appendChild(target);
    start({ target, destination: { top: 500 } });
    frame();
    frame(150);
    expect(owner.scrollTop).toBeCloseTo(64.58, 1);
    frame(450);
    expect(owner.scrollTop).toBe(500);
  });

  it("preserves native scroll-behavior and its priority after replacement and cancellation", () => {
    owner.style.setProperty("scroll-behavior", "smooth", "important");
    const first = start({ destination: { top: 500 } });
    expect(owner.style.getPropertyValue("scroll-behavior")).toBe("auto");
    const second = start({ destination: { top: 0 } });
    first.cancel();
    expect(owner.style.getPropertyValue("scroll-behavior")).toBe("auto");
    second.cancel();
    expect(owner.style.getPropertyValue("scroll-behavior")).toBe("smooth");
    expect(owner.style.getPropertyPriority("scroll-behavior")).toBe("important");
    expect(frames.size).toBe(0);
  });

  it("clamps RTL inline destinations without modifying vertical position", () => {
    owner.style.direction = "rtl";
    owner.scrollTop = 35;
    start({ destination: { left: inlineScrollLeft(owner, 900) } });
    frame();
    frame(300);
    expect(owner.scrollLeft).toBe(-500);
    expect(inlineScrollPosition(owner)).toBe(500);
    expect(owner.scrollTop).toBe(35);
  });

  it("waits without polling for pending layout and continues measuring an unsettled target", () => {
    let destination: { top: number } | null = null;
    let settled = false;
    const animation = start({ destination: () => destination, settled: () => settled });
    frame();
    expect(frames.size).toBe(0);
    destination = { top: 300 };
    animation.refresh();
    frame();
    frame(300);
    expect(owner.scrollTop).toBe(300);
    expect(frames.size).toBe(1);
    destination = { top: 400 };
    settled = true;
    frame(16);
    expect(owner.scrollTop).toBe(400);
    expect(frames.size).toBe(0);
  });

  it("explicit cancellation prevents all later writes and completion callbacks", () => {
    const finished = vi.fn();
    const animation = start({ destination: { top: 500 }, onFinish: finished });
    frame();
    frame(75);
    const stoppedAt = owner.scrollTop;
    animation.cancel();
    frame(500);
    expect(owner.scrollTop).toBe(stoppedAt);
    expect(finished).toHaveBeenCalledExactlyOnceWith(false);
    expect(frames.size).toBe(0);
  });

  it("anchor navigation uses the nearest local owner and respects scroll margins", () => {
    const outer = document.createElement("div");
    outer.style.overflowY = "auto";
    owner.replaceWith(outer);
    outer.appendChild(owner);
    owner.style.overflowY = "auto";
    owner.style.scrollPaddingBlockStart = "10px";
    const target = document.createElement("section");
    target.style.scrollMarginBlockStart = "24px";
    target.style.setProperty("--uni-motion-state", "0ms");
    owner.appendChild(target);
    vi.spyOn(owner, "getBoundingClientRect").mockReturnValue({ top: 100 } as DOMRect);
    vi.spyOn(target, "getBoundingClientRect").mockImplementation(() => ({ top: 300 - owner.scrollTop, height: 50 } as DOMRect));
    animations.push(scrollIntoViewWithMotion(target));
    frame();
    expect(owner.scrollTop).toBe(166);
    expect(outer.scrollTop).toBe(0);
    outer.remove();
  });
  it("centers the target's margin box inside the owner's padded scrollport", () => {
    owner.style.overflowY = "auto";
    owner.style.scrollPaddingBlockStart = "64px";
    owner.style.scrollPaddingBlockEnd = "16px";
    Object.defineProperty(owner, "clientHeight", { configurable: true, value: 200 });
    const target = document.createElement("section");
    target.style.scrollMarginBlockStart = "12px";
    target.style.scrollMarginBlockEnd = "4px";
    target.style.setProperty("--uni-motion-state", "0ms");
    owner.appendChild(target);
    vi.spyOn(owner, "getBoundingClientRect").mockReturnValue({ top: 100 } as DOMRect);
    vi.spyOn(target, "getBoundingClientRect").mockImplementation(() => ({ top: 300 - owner.scrollTop, height: 40 } as DOMRect));
    animations.push(scrollIntoViewWithMotion(target, "center"));
    frame();
    expect(owner.scrollTop).toBe(92);
    expect(frames.size).toBe(0);
  });
  it("keeps only the newest request when cancellation starts another animation", () => {
    start({ destination: { top: 500 }, onFinish: completed => {
      if (!completed) start({ destination: { top: 100 } });
    } });
    frame();
    const displaced = start({ destination: { top: 300 } });
    expect(frames.size).toBe(1);
    displaced.cancel();
    frame();
    frame(300);
    expect(owner.scrollTop).toBe(100);
    expect(frames.size).toBe(0);
  });
});
