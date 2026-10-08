// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HituPlayer, type HituPlayerProps, type HituPlayerRef, type HituShape } from "../src/components/ui/hitu-player";
import { MotionPolicyProvider } from "../src/lib/motion-policy";
import { HituBox, HituFile } from "../src/vendor/hitu/assets";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const Source = Object.assign((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 20 40"><rect width="20" height="40" /></svg>
), { width: 20, height: 40 });
const shapes: HituShape[] = [{ source: Source, frames: [{ frame: 0, x: 0 }, { frame: 30, x: 90 }] }];

let container: HTMLDivElement;
let root: Root | undefined;
let ref: React.RefObject<HituPlayerRef | null>;
let clock: number;
let sequence: number;
let pending: Map<number, FrameRequestCallback>;
let observers: TestObserver[];
let hidden: boolean;
let reduced: boolean;
let mediaListeners: Set<() => void>;

class TestObserver {
  target?: Element;
  connected = true;
  constructor(readonly callback: IntersectionObserverCallback) { observers.push(this); }
  observe(target: Element) { this.target = target; }
  disconnect() { this.connected = false; }
  unobserve() { this.target = undefined; }
  takeRecords() { return []; }
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
}

function svg() { return container.querySelector<SVGSVGElement>('[data-slot="hitu-player"]')!; }
function current() { return ref.current!.getFramerInfo(); }
function mount(props: Partial<HituPlayerProps> = {}, strict = false) {
  root ??= createRoot(container);
  const player = <HituPlayer ref={ref} width={100} height={80} shapes={shapes} {...props} />;
  act(() => root!.render(strict ? <React.StrictMode>{player}</React.StrictMode> : player));
}
function inViewport(visible: boolean) {
  act(() => {
    for (const observer of observers.filter((item) => item.connected && item.target)) {
      observer.callback([{ target: observer.target, isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }] as IntersectionObserverEntry[], observer as unknown as IntersectionObserver);
    }
  });
}
function pageHidden(value: boolean) {
  hidden = value;
  act(() => document.dispatchEvent(new Event("visibilitychange")));
}
function reduceMotion(value: boolean) {
  reduced = value;
  act(() => mediaListeners.forEach((listener) => listener()));
}
function advance(elapsed = 1000 / 60) {
  clock += elapsed;
  const callbacks = [...pending.values()];
  pending.clear();
  act(() => callbacks.forEach((callback) => callback(clock)));
}
function start(props: Partial<HituPlayerProps> = {}, strict = false) {
  mount({ defaultPlay: true, frames: 30, ...props }, strict);
  inViewport(true);
  advance(0);
}

beforeEach(() => {
  root = undefined;
  ref = React.createRef<HituPlayerRef>();
  clock = 0;
  sequence = 0;
  pending = new Map();
  observers = [];
  hidden = false;
  reduced = false;
  mediaListeners = new Set();
  vi.stubGlobal("IntersectionObserver", TestObserver);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    const id = ++sequence;
    pending.set(id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => pending.delete(id));
  vi.stubGlobal("matchMedia", (query: string) => ({
    media: query,
    get matches() { return query === "(prefers-reduced-motion: reduce)" && reduced; },
    addEventListener: (_name: string, listener: () => void) => mediaListeners.add(listener),
    removeEventListener: (_name: string, listener: () => void) => mediaListeners.delete(listener),
  }));
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  container = document.createElement("div");
  document.body.append(container);
});

afterEach(() => {
  if (root) act(() => root!.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Hitu SVG layers", () => {
  it("defaults to a static decorative SVG and names meaningful illustrations", () => {
    mount();
    inViewport(true);
    expect(current()).toEqual({ frame: 0, play: false });
    expect(pending.size).toBe(0);
    expect(svg().getAttribute("viewBox")).toBe("0 0 100 80");
    expect(svg().getAttribute("aria-hidden")).toBe("true");
    expect(svg().getAttribute("data-playing")).toBe("false");
    mount({ "aria-label": "An empty box", className: "illustration" });
    expect(svg().getAttribute("aria-hidden")).toBeNull();
    expect(svg().getAttribute("role")).toBe("img");
    expect(svg().getAttribute("aria-label")).toBe("An empty box");
    expect(svg().classList.contains("illustration")).toBe(true);
  });

  it("interpolates sparse transforms and retains origin-relative scale and rotation", () => {
    mount({ frames: 20, defaultFrame: 5, shapes: [{
      source: Source, scaleX: 2, opacity: 0.6,
      frames: [{ frame: 0, rotate: 0 }, { frame: 10, x: 100, rotate: 90 }, { frame: 20, opacity: 1 }],
    }] });
    const layer = svg().querySelector('[data-hitu-layer="0"]')!;
    expect(layer.getAttribute("transform")).toBe("translate(40, -20)");
    expect(layer.getAttribute("opacity")).toBe("0.6");
    expect(layer.children[0].getAttribute("transform")).toBe("matrix(2, 0, 0, 1, -10, 0)");
    expect(layer.children[0].children[0].getAttribute("transform")).toBe("rotate(45, 10, 20)");
    act(() => ref.current!.setFrame(15));
    expect(layer.getAttribute("transform")).toBe("translate(90, -20)");
    expect(Number(layer.getAttribute("opacity"))).toBeCloseTo(0.8);
  });

  it("retains non-linear cubic easing and endpoint clamping", () => {
    mount({ frames: 11, defaultFrame: 5, shapes: [{
      source: Source,
      frames: [{ frame: 0, x: 0, cubic: [0.42, 0, 1, 1] }, { frame: 10, x: 100 }],
    }] });
    const layer = svg().querySelector('[data-hitu-layer="0"]')!;
    const translatedX = () => Number(layer.getAttribute("transform")!.match(/translate\(([^,]+)/)![1]);
    expect(translatedX()).toBeGreaterThan(-10);
    expect(translatedX()).toBeLessThan(40);
    act(() => ref.current!.setFrame(999));
    expect(translatedX()).toBe(90);
    act(() => ref.current!.setFrame(-2));
    expect(translatedX()).toBe(-10);
    act(() => ref.current!.setFrame(Number.NaN));
    expect(current().frame).toBe(0);
  });

  it("renders repeated themed upstream assets without shared SVG IDs", () => {
    mount({ shapes: [
      { source: HituBox, scaleX: 0.1, scaleY: 0.1 },
      { source: HituFile, scaleX: 0.1, scaleY: 0.1 },
      { source: HituBox, scaleX: 0.1, scaleY: 0.1 },
    ] });
    expect(svg().querySelectorAll("[data-hitu-layer]")).toHaveLength(3);
    expect(svg().querySelectorAll("[id]")).toHaveLength(0);
    expect(svg().querySelector("[fill='var(--gray-700)']")).not.toBeNull();
  });
});

describe("Hitu RAF lifecycle", () => {
  it("starts exactly one RAF under StrictMode and cancels queued work on unmount", () => {
    const onFrame = vi.fn();
    const onPlay = vi.fn();
    start({ onFrame, onPlay }, true);
    expect(observers.filter((item) => item.connected)).toHaveLength(1);
    expect(pending.size).toBe(1);
    expect(onPlay.mock.calls).toEqual([[true]]);
    advance();
    expect(current()).toEqual({ frame: 1, play: true });
    expect(pending.size).toBe(1);
    const queued = [...pending.values()];
    const count = onFrame.mock.calls.length;
    act(() => root!.unmount());
    root = undefined;
    expect(pending.size).toBe(0);
    act(() => queued.forEach((callback) => callback(9999)));
    expect(onFrame).toHaveBeenCalledTimes(count);
    expect(pending.size).toBe(0);
    expect(observers.every((item) => !item.connected)).toBe(true);
    expect(mediaListeners.size).toBe(0);
  });

  it("finishes, replays, pauses and toggles requested playback", () => {
    const onPlay = vi.fn();
    start({ frames: 2, onPlay });
    advance(1000 / 30);
    expect(current()).toEqual({ frame: 1, play: false });
    expect(pending.size).toBe(0);
    expect(onPlay.mock.calls).toEqual([[true], [false]]);
    act(() => ref.current!.triggerMotion(true));
    expect(current()).toEqual({ frame: 0, play: true });
    expect(pending.size).toBe(1);
    act(() => ref.current!.triggerMotion(false));
    expect(current().play).toBe(false);
    expect(pending.size).toBe(0);
    act(() => ref.current!.triggerMotion());
    expect(current().play).toBe(true);
    expect(pending.size).toBe(1);
  });

  it("resumes from the paused frame without consuming hidden elapsed time", () => {
    start({ defaultFrame: 2 });
    advance();
    expect(current().frame).toBe(3);
    act(() => ref.current!.triggerMotion(false));
    advance(10_000);
    act(() => ref.current!.triggerMotion(true));
    advance(0);
    expect(current().frame).toBe(3);
    advance();
    expect(current().frame).toBe(4);
  });

  it("loops without creating a second RAF and allows seeking during playback", () => {
    start({ frames: 4, loop: true });
    advance(1000 / 10);
    expect(current()).toEqual({ frame: 2, play: true });
    expect(pending.size).toBe(1);
    act(() => ref.current!.setFrame(3));
    advance(10_000);
    expect(current().frame).toBe(3);
    advance();
    expect(current()).toEqual({ frame: 0, play: true });
    expect(pending.size).toBe(1);
  });

  it("reports every crossed frame in order when a RAF skips ahead", () => {
    const onFrame = vi.fn();
    start({ frames: 4, onFrame });
    advance(100);
    expect(onFrame.mock.calls.map(([frame]) => frame)).toEqual([0, 1, 2, 3]);
    expect(current()).toEqual({ frame: 3, play: false });
    expect(pending.size).toBe(0);
  });

  it("reports crossed frames across loop boundaries without duplicate final notifications", () => {
    const onFrame = vi.fn();
    start({ frames: 4, loop: true, onFrame });
    advance(100);
    expect(onFrame.mock.calls.map(([frame]) => frame)).toEqual([0, 1, 2, 3, 0, 1, 2]);
    expect(current()).toEqual({ frame: 2, play: true });
    expect(pending.size).toBe(1);
  });

  it("stops a skipped-frame callback sequence immediately when a callback pauses", () => {
    const onFrame = vi.fn((frame: number) => { if (frame === 2) ref.current!.triggerMotion(false); });
    start({ onFrame });
    advance(100);
    expect(onFrame.mock.calls.map(([frame]) => frame)).toEqual([0, 1, 2]);
    expect(current()).toEqual({ frame: 2, play: false });
    expect(pending.size).toBe(0);
  });

  it("stops a skipped-frame callback sequence immediately when a callback unmounts", () => {
    const onFrame = vi.fn((frame: number) => {
      if (frame === 2) { root!.unmount(); root = undefined; }
    });
    start({ onFrame });
    advance(100);
    expect(onFrame.mock.calls.map(([frame]) => frame)).toEqual([0, 1, 2]);
    expect(container.children).toHaveLength(0);
    expect(pending.size).toBe(0);
    advance(100);
    expect(onFrame.mock.calls.map(([frame]) => frame)).toEqual([0, 1, 2]);
  });

  it("honors seeking from a frame callback and reports only the explicit seek destination", () => {
    const onFrame = vi.fn((frame: number) => { if (frame === 2) ref.current!.setFrame(10); });
    start({ onFrame });
    advance(100);
    expect(onFrame.mock.calls.map(([frame]) => frame)).toEqual([0, 1, 2, 10]);
    expect(current()).toEqual({ frame: 10, play: true });
    expect(pending.size).toBe(1);
    advance(0);
    advance();
    expect(onFrame.mock.calls.map(([frame]) => frame)).toEqual([0, 1, 2, 10, 11]);
  });

  it("replaces the live frame limit and clamps rather than using the captured old limit", () => {
    start({ frames: 30, defaultFrame: 8 });
    advance();
    expect(current().frame).toBe(9);
    const stale = [...pending.values()];
    mount({ defaultPlay: true, frames: 2, defaultFrame: 8 });
    expect(current().frame).toBe(1);
    expect(pending.size).toBe(1);
    act(() => stale.forEach((callback) => callback(5000)));
    expect(current().frame).toBe(1);
    advance(0);
    advance();
    expect(current()).toEqual({ frame: 1, play: false });
    expect(pending.size).toBe(0);
  });

  it("keeps zero or invalid frame scenes static and starts when a timeline becomes available", () => {
    mount({ defaultPlay: true, frames: 0, defaultFrame: 8 });
    inViewport(true);
    expect(current()).toEqual({ frame: 0, play: false });
    expect(pending.size).toBe(0);
    mount({ defaultPlay: true, frames: Number.NaN });
    expect(current()).toEqual({ frame: 0, play: false });
    mount({ defaultPlay: true, frames: 3 });
    expect(current().play).toBe(true);
    advance(0);
    advance();
    expect(current().frame).toBe(1);
  });

  it("resets scene frames and invalidates the prior scene's queued callback", () => {
    start({ defaultFrame: 2 });
    advance(100);
    expect(current().frame).toBe(8);
    const stale = [...pending.values()];
    mount({ defaultPlay: true, frames: 30, shapes: [{ source: HituFile }], defaultFrame: 2 });
    expect(current()).toEqual({ frame: 2, play: true });
    act(() => stale.forEach((callback) => callback(5000)));
    expect(current().frame).toBe(2);
    expect(pending.size).toBe(1);
  });
});

describe("Hitu motion and visibility policy", () => {
  it("pauses offscreen and in the background while preserving playback intent", () => {
    const onPlay = vi.fn();
    start({ onPlay });
    advance(1000 / 30);
    expect(current().frame).toBe(2);
    inViewport(false);
    expect(current().play).toBe(false);
    expect(pending.size).toBe(0);
    inViewport(true);
    expect(current().play).toBe(true);
    expect(pending.size).toBe(1);
    pageHidden(true);
    expect(current().play).toBe(false);
    expect(pending.size).toBe(0);
    pageHidden(false);
    advance(10_000);
    expect(current().frame).toBe(2);
    advance();
    expect(current().frame).toBe(3);
    expect(onPlay.mock.calls).toEqual([[true], [false], [true], [false], [true]]);
  });

  it("retains a manual pause across viewport and page visibility changes", () => {
    start();
    inViewport(false);
    act(() => ref.current!.triggerMotion(false));
    pageHidden(true);
    inViewport(true);
    pageHidden(false);
    expect(current().play).toBe(false);
    expect(pending.size).toBe(0);
  });

  it("resets to the initial frame when reduced motion changes and prevents playback or seeking", () => {
    start({ defaultFrame: 3 });
    advance(1000 / 30);
    expect(current().frame).toBe(5);
    reduceMotion(true);
    expect(current()).toEqual({ frame: 3, play: false });
    expect(svg().getAttribute("data-frame")).toBe("3");
    expect(pending.size).toBe(0);
    act(() => { ref.current!.setFrame(20); ref.current!.triggerMotion(true); });
    expect(current()).toEqual({ frame: 3, play: false });
    act(() => ref.current!.triggerMotion(false));
    reduceMotion(false);
    expect(current()).toEqual({ frame: 3, play: false });
    expect(pending.size).toBe(0);
  });

  it("honors a forced reduced-motion provider even when the system allows motion", () => {
    root = createRoot(container);
    act(() => root!.render(<MotionPolicyProvider always>
      <HituPlayer ref={ref} width={100} height={80} shapes={shapes} frames={30} defaultPlay defaultFrame={4} />
    </MotionPolicyProvider>));
    inViewport(true);
    expect(current()).toEqual({ frame: 4, play: false });
    act(() => ref.current!.triggerMotion(true));
    expect(pending.size).toBe(0);
  });

  it("renders statically on the server and hydrates the same initial frame", async () => {
    const onFrame = vi.fn();
    const recoverable = vi.fn();
    const node = <HituPlayer ref={ref} width={100} height={80} shapes={shapes} frames={30} defaultFrame={12} defaultPlay onFrame={onFrame} />;
    const html = renderToString(node);
    expect(html).toContain('data-frame="12"');
    expect(html).toContain('data-playing="false"');
    expect(onFrame).not.toHaveBeenCalled();
    expect(pending.size).toBe(0);
    container.innerHTML = html;
    await act(async () => { root = hydrateRoot(container, node, { onRecoverableError: recoverable }); });
    expect(recoverable).not.toHaveBeenCalled();
    expect(current()).toEqual({ frame: 12, play: false });
    inViewport(true);
    expect(current().play).toBe(true);
    expect(current().frame).toBe(12);
  });

  it("plays without IntersectionObserver in environments that do not support it", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    mount({ frames: 5, defaultPlay: true });
    expect(current().play).toBe(true);
    expect(pending.size).toBe(1);
  });
});
