// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { MotionConfigContext, type Transition } from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MotionProvider, motion, useMotionTransition, type MotionTier } from "../src/lib/motion";
import { useMotionReduced } from "../src/lib/motion-policy";
import { setTokens } from "../src/lib/tokens";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let container: HTMLDivElement;
let root: Root;
let media: MediaQueryList;
let matches: boolean;
let captured: Transition;

function Probe({ tier = "state", target }: { tier?: MotionTier; target?: HTMLElement | null }) {
  captured = useMotionTransition(tier, target === undefined ? {} : { target });
  return <output>{captured.duration}</output>;
}

function preference(reduced: boolean) {
  matches = reduced;
  act(() => media.dispatchEvent(new Event("change")));
}

beforeEach(() => {
  matches = false;
  const events = new EventTarget();
  media = Object.assign(events, { get matches() { return matches; }, media: "(prefers-reduced-motion: reduce)", addListener: vi.fn(), removeListener: vi.fn() }) as unknown as MediaQueryList;
  Object.defineProperty(media, "matches", { get: () => matches });
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  for (const [tier, value] of Object.entries({ feedback: "150ms", state: "250ms", overlay: "350ms", expansive: "500ms" })) {
    document.documentElement.style.setProperty(`--uni-motion-${tier}`, value);
  }
  document.documentElement.style.setProperty("--ease-snap", "cubic-bezier(0.22, 1, 0.36, 1)");
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.documentElement.removeAttribute("style");
  vi.unstubAllGlobals();
});

describe("Motion timing and policy", () => {
  it("keeps semantic durations and uses the same settling curve without overshoot", () => {
    for (const [tier, seconds] of Object.entries({ feedback: 0.15, state: 0.25, overlay: 0.35, expansive: 0.5 })) {
      act(() => root.render(<Probe tier={tier as MotionTier} />));
      expect(captured.duration).toBe(seconds);
      expect(captured.ease).toEqual([0.22, 1, 0.36, 1]);
    }
  });

  it("subscribes to scoped token writes and converts seconds", () => {
    container.style.setProperty("--uni-motion-state", "1.2s");
    container.style.setProperty("--ease-snap", "cubic-bezier(0.42, 0, 0.58, 1)");
    act(() => root.render(<Probe target={container} />));
    expect(captured).toMatchObject({ duration: 1.2, ease: [0.42, 0, 0.58, 1] });
    act(() => { setTokens({ "--uni-motion-state": "80ms" }, { target: container }); });
    expect(captured.duration).toBe(0.08);
  });

  it("finishes immediately for missing and malformed tokens", () => {
    for (const duration of ["0ms", "-1s", "NaNs", "Infinitys", "10"]) {
      container.style.setProperty("--uni-motion-state", duration);
      act(() => root.render(<Probe target={container} />));
      expect(captured, duration).toMatchObject({ duration: 0, skipAnimations: true });
    }
    container.style.setProperty("--uni-motion-state", "1s");
    for (const easing of ["bad", "cubic-bezier(0,,1,1)", "cubic-bezier(2,0,1,1)", "cubic-bezier(0,0,1)", "linear", "cubic-bezier(0,0,1,1)", "cubic-bezier(.3,.3,.7,.7)"]) {
      container.style.setProperty("--ease-snap", easing);
      act(() => root.render(<Probe target={container} />));
      expect(captured.duration).toBe(0);
    }
    act(() => root.render(<Probe target={null} />));
    expect(captured.duration).toBe(0);
  });

  it("reacts to system preference changes without remounting content", () => {
    const mounted = vi.fn();
    function Child() { React.useEffect(mounted, []); return <Probe />; }
    act(() => root.render(<MotionProvider><Child /></MotionProvider>));
    expect(captured.duration).toBe(0.25);
    preference(true);
    expect(captured).toMatchObject({ duration: 0, skipAnimations: true });
    preference(false);
    expect(captured.duration).toBe(0.25);
    expect(mounted).toHaveBeenCalledTimes(1);
  });

  it("inherits an enforced static policy and configures opacity as well as transforms", () => {
    let config: React.ContextType<typeof MotionConfigContext>;
    function Config() {
      config = React.useContext(MotionConfigContext);
      return <output>{String(useMotionReduced())}</output>;
    }
    act(() => root.render(<MotionProvider reducedMotion="always"><MotionProvider><Config /></MotionProvider></MotionProvider>));
    expect(container.textContent).toBe("true");
    expect(config!).toMatchObject({ reducedMotion: "always", skipAnimations: true, transition: { duration: 0 } });
  });

  it("preserves SVG refs and child state across live policy changes", () => {
    const ref = React.createRef<SVGSVGElement>();
    const mounted = vi.fn();
    function Child() { React.useEffect(mounted, []); return <text>Stable</text>; }
    act(() => root.render(<MotionProvider><motion.svg ref={ref}><Child /></motion.svg></MotionProvider>));
    const node = ref.current;
    expect(node).toBe(container.querySelector("svg"));
    preference(true);
    preference(false);
    expect(ref.current).toBe(node);
    expect(mounted).toHaveBeenCalledTimes(1);
  });

  it("forwards changing custom component nodes and React 19 callback ref cleanup", () => {
    let swap!: () => void;
    const Custom = React.forwardRef<HTMLElement>((_, ref) => {
      const [tag, setTag] = React.useState<"div" | "span">("div");
      swap = () => setTag("span");
      return React.createElement(tag, { ref }, "Custom");
    });
    const Adapted = motion.create(Custom);
    const firstCleanup = vi.fn();
    const secondCleanup = vi.fn();
    const firstRef = vi.fn((_element: HTMLElement | null) => firstCleanup);
    const secondRef = vi.fn((_element: HTMLElement | null) => secondCleanup);
    act(() => root.render(<MotionProvider reducedMotion="always"><Adapted ref={firstRef} /></MotionProvider>));
    expect(firstRef.mock.calls[0][0]).toBe(container.querySelector("div"));
    act(() => root.render(<MotionProvider reducedMotion="always"><Adapted ref={secondRef} /></MotionProvider>));
    expect(firstCleanup).toHaveBeenCalledTimes(1);
    expect(secondRef.mock.calls[0][0]).toBe(container.querySelector("div"));
    act(() => swap());
    expect(secondCleanup).toHaveBeenCalledTimes(1);
    expect(secondRef.mock.calls.at(-1)![0]).toBe(container.querySelector("span"));
  });

  it("binds only the new ref when the host and ref change together", () => {
    const Custom = React.forwardRef<HTMLElement, { as: "div" | "span" }>(({ as }, ref) => React.createElement(as, { ref }));
    const Adapted = motion.create(Custom);
    const cleanup = vi.fn();
    const oldRef = vi.fn((_element: HTMLElement | null) => cleanup);
    const newRef = React.createRef<HTMLElement>();
    act(() => root.render(<MotionProvider reducedMotion="always"><Adapted as="div" ref={oldRef} /></MotionProvider>));
    act(() => root.render(<MotionProvider reducedMotion="always"><Adapted as="span" ref={newRef} /></MotionProvider>));
    expect(oldRef).toHaveBeenCalledTimes(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(newRef.current).toBe(container.querySelector("span"));
  });

  it("hydrates the deterministic static server snapshot without browser values", async () => {
    act(() => root.unmount());
    const recoverable = vi.fn();
    const tree = <MotionProvider><Probe /></MotionProvider>;
    const html = renderToString(tree);
    expect(html).toBe("<output>0</output>");
    container.innerHTML = html;
    await act(async () => { root = hydrateRoot(container, tree, { onRecoverableError: recoverable }); });
    expect(container.textContent).toBe("0.25");
    expect(recoverable).not.toHaveBeenCalled();
  });
});
