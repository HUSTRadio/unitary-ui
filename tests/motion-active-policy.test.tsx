// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { domAnimation, LazyMotion, motionValue, visualElementStore, type MotionValue } from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { motion } from "../src/lib/motion";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let container: HTMLDivElement;
let root: Root;
let media: MediaQueryList;
let reduced: boolean;

beforeEach(() => {
  reduced = false;
  const events = new EventTarget();
  media = Object.assign(events, {
    get matches() { return reduced; },
    media: "(prefers-reduced-motion: reduce)",
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }) as unknown as MediaQueryList;
  Object.defineProperty(media, "matches", { get: () => reduced });
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

function mountMotionValue() {
  const ref = React.createRef<HTMLDivElement>();
  act(() => root.render(<LazyMotion features={domAnimation} strict><motion.div ref={ref} initial={false} /></LazyMotion>));
  const element = ref.current!;
  const visual = visualElementStore.get(element)!;
  expect(visual).toBeDefined();
  const value = motionValue(0);
  visual.addValue("opacity", value);
  return { element, visual, value };
}

function preferReducedMotion() {
  reduced = true;
  act(() => media.dispatchEvent(new Event("change")));
}

// Model the browser's finish() contract: endless effects and zero playback rate
// cannot finish. Motion may create this native animation only when complete()
// resolves its pending keyframes, so getAnimations() starts out empty.
function pendingNativeAnimation(value: MotionValue, iterations: number, playbackRate: number) {
  const timing = { iterations };
  const native = {
    effect: {
      getTiming: () => timing,
      updateTiming: vi.fn((next: { iterations: number }) => { timing.iterations = next.iterations; }),
    },
    playbackRate,
    finish: vi.fn(() => {
      if (timing.iterations === Infinity || native.playbackRate === 0) {
        throw new DOMException("The animation cannot finish", "InvalidStateError");
      }
      value.set(1);
    }),
  };
  const active: Animation[] = [];
  const complete = vi.fn(() => {
    if (active.length === 0) active.push(native as unknown as Animation);
    native.finish();
  });
  value.animation = { complete, stop: vi.fn() } as unknown as MotionValue["animation"];
  return { native, active, complete };
}

describe("live Motion animation completion", () => {
  it.each([
    { iterations: Infinity, playbackRate: 1 },
    { iterations: 1, playbackRate: 0 },
    { iterations: Infinity, playbackRate: 0 },
  ])("finishes a pending native animation with iterations=$iterations and rate=$playbackRate", ({ iterations, playbackRate }) => {
    const { element, visual, value } = mountMotionValue();
    const pending = pendingNativeAnimation(value, iterations, playbackRate);
    Object.defineProperty(element, "getAnimations", { value: () => pending.active });
    expect(pending.active).toHaveLength(0);

    preferReducedMotion();

    expect(pending.complete).toHaveBeenCalledTimes(2);
    expect(pending.native.effect.getTiming().iterations).toBe(1);
    expect(pending.native.playbackRate).toBe(1);
    expect(value.get()).toBe(1);
    expect(visual.shouldSkipAnimations).toBe(true);
    expect(visual.shouldReduceMotion).toBe(true);
  });

  it("leaves CSS animations and transitions unchanged while completing Motion's native effect", () => {
    const { element, value } = mountMotionValue();
    const pending = pendingNativeAnimation(value, Infinity, 0);
    const cssAnimation = {
      animationName: "existing-spinner", playbackRate: 0,
      effect: { getTiming: () => ({ iterations: Infinity }), updateTiming: vi.fn() },
    };
    const cssTransition = {
      transitionProperty: "opacity", playbackRate: 0,
      effect: { getTiming: () => ({ iterations: Infinity }), updateTiming: vi.fn() },
    };
    Object.defineProperty(element, "getAnimations", {
      value: () => [cssAnimation, cssTransition, ...pending.active],
    });

    preferReducedMotion();

    expect(value.get()).toBe(1);
    expect(cssAnimation.effect.updateTiming).not.toHaveBeenCalled();
    expect(cssTransition.effect.updateTiming).not.toHaveBeenCalled();
    expect(cssAnimation.playbackRate).toBe(0);
    expect(cssTransition.playbackRate).toBe(0);
  });

  it("does not inspect or change unrelated native effects when completion succeeds", () => {
    const { element, value } = mountMotionValue();
    const complete = vi.fn(() => value.set(1));
    value.animation = { complete, stop: vi.fn() } as unknown as MotionValue["animation"];
    const getAnimations = vi.fn();
    Object.defineProperty(element, "getAnimations", { value: getAnimations });

    preferReducedMotion();

    expect(complete).toHaveBeenCalledOnce();
    expect(value.get()).toBe(1);
    expect(getAnimations).not.toHaveBeenCalled();
  });

  it("preserves completion errors other than the browser's InvalidStateError", () => {
    const { element, value } = mountMotionValue();
    const failure = new Error("Animation completion failed");
    const complete = vi.fn(() => { throw failure; });
    value.animation = { complete, stop: vi.fn() } as unknown as MotionValue["animation"];
    const getAnimations = vi.fn();
    Object.defineProperty(element, "getAnimations", { value: getAnimations });

    expect(preferReducedMotion).toThrow(failure);

    expect(complete).toHaveBeenCalledOnce();
    expect(getAnimations).not.toHaveBeenCalled();
  });
});
