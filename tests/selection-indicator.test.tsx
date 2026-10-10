// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSlidingIndicator } from "../src/lib/selection-indicator";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

type Marker = { key: string; group: string };
type HarnessProps = { activeKey?: string; enabled?: boolean; markers?: Marker[] };
type CapturedAnimation = {
  marker: HTMLElement;
  frames: Keyframe[];
  options: KeyframeAnimationOptions;
  cancel: ReturnType<typeof vi.fn>;
  animation: Animation;
};

const defaultMarkers = [
  { key: "a", group: "first" },
  { key: "b", group: "first" },
  { key: "c", group: "first" },
  { key: "d", group: "second" },
];

function Harness({ activeKey, enabled, markers = defaultMarkers }: HarnessProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  useSlidingIndicator({ rootRef, activeKey, enabled });
  return (
    <div ref={rootRef} data-selection-indicator-group="outer">
      {[...new Set(markers.map((marker) => marker.group))].map((group) => (
        <ul key={group} data-selection-indicator-group={group}>
          {markers.filter((marker) => marker.group === group).map(({ key }) => (
            <li key={key}>
              <span
                data-marker={key}
                data-selection-indicator
                data-slot={activeKey === key ? "test-indicator" : undefined}
                aria-hidden="true"
                style={{ visibility: activeKey === key ? undefined : "hidden" }}
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return { x: left, y: top, left, top, width, height, right: left + width,
    bottom: top + height, toJSON: () => ({}) } as DOMRect;
}

let container: HTMLDivElement;
let root: Root | undefined;
let rectangles: Map<string, DOMRect>;
let animations: CapturedAnimation[];
let events: string[];
let reducedMotion: boolean;
let durationToken: string;
let easingToken: string;
let mediaQuery: MediaQueryList;
let animateDescriptor: PropertyDescriptor | undefined;

function render(props: HarnessProps = {}) {
  act(() => root!.render(<Harness {...props} />));
}

function activeMarker() {
  return container.querySelector<HTMLElement>('[data-selection-indicator][data-slot]');
}

function transformComponents(frame: Keyframe) {
  const transform = String(frame.transform);
  if (transform === "none") return { x: 0, y: 0, scaleX: 1, scaleY: 1 };
  const translation = transform.match(/translate(?:3d)?\(([-\d.]+)px,\s*([-\d.]+)px(?:,\s*0(?:px)?)?\)/);
  const scale = transform.match(/scale(?:3d)?\(([-\d.]+),\s*([-\d.]+)(?:,\s*1)?\)/);
  expect(translation, "the starting frame must preserve the previous visual position").not.toBeNull();
  expect(scale, "the starting frame must preserve the previous indicator dimensions").not.toBeNull();
  return {
    x: Number(translation![1]), y: Number(translation![2]),
    scaleX: Number(scale![1]), scaleY: Number(scale![2]),
  };
}

function frameRectangle(frame: Keyframe, target: DOMRect, ancestorScale = { x: 1, y: 1 }) {
  const transform = transformComponents(frame);
  return rect(
    target.x + transform.x * ancestorScale.x,
    target.y + transform.y * ancestorScale.y,
    target.width * transform.scaleX,
    target.height * transform.scaleY,
  );
}

function expectRectangle(actual: DOMRect, expected: DOMRect) {
  for (const dimension of ["x", "y", "width", "height"] as const) {
    expect(actual[dimension], dimension).toBeCloseTo(expected[dimension], 8);
  }
}

function changeReducedMotion(matches: boolean) {
  reducedMotion = matches;
  const event = new Event("change");
  Object.defineProperties(event, {
    matches: { value: matches }, media: { value: "(prefers-reduced-motion: reduce)" },
  });
  act(() => mediaQuery.dispatchEvent(event));
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  animations = [];
  events = [];
  reducedMotion = false;
  durationToken = "250ms";
  easingToken = "cubic-bezier(0.32, 0.72, 0, 1)";
  rectangles = new Map([
    ["a", rect(10, 20, 4, 14)],
    ["b", rect(10, 60, 4, 14)],
    ["c", rect(10, 100, 4, 14)],
    ["d", rect(10, 160, 4, 14)],
  ]);

  const queryEvents = new EventTarget();
  mediaQuery = Object.assign(queryEvents, {
    media: "(prefers-reduced-motion: reduce)", onchange: null,
    addListener: vi.fn((listener: EventListener) => queryEvents.addEventListener("change", listener)),
    removeListener: vi.fn((listener: EventListener) => queryEvents.removeEventListener("change", listener)),
  }) as unknown as MediaQueryList;
  Object.defineProperty(mediaQuery, "matches", { get: () => reducedMotion });
  vi.stubGlobal("matchMedia", vi.fn(() => mediaQuery));

  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    const key = this.dataset.marker;
    if (key) events.push(`measure:${key}`);
    return rectangles.get(key ?? "") ?? rect(0, 0, 300, 300);
  });
  const nativeComputedStyle = window.getComputedStyle.bind(window);
  vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
    const style = nativeComputedStyle(element, pseudo);
    return new Proxy(style, {
      get(target, property) {
        if (property === "getPropertyValue") return (name: string) => {
          if (name === "--uni-motion-state") return durationToken;
          if (name === "--ease-snap") return easingToken;
          return target.getPropertyValue(name);
        };
        return Reflect.get(target, property);
      },
    });
  });

  animateDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "animate");
  Object.defineProperty(HTMLElement.prototype, "animate", {
    configurable: true,
    value: vi.fn(function (this: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) {
      events.push(`animate:${this.dataset.marker}`);
      const animationEvents = new EventTarget();
      const restingRectangle = rectangles.get(this.dataset.marker ?? "");
      const cancel = vi.fn(() => {
        events.push(`cancel:${this.dataset.marker}`);
        // A real canceled transform exposes the marker's original layout box.
        if (restingRectangle) rectangles.set(this.dataset.marker!, restingRectangle);
      });
      const animation = Object.assign(animationEvents, {
        cancel, onfinish: null, oncancel: null, playState: "running",
        finished: new Promise<Animation>(() => {}),
      }) as unknown as Animation;
      animations.push({ marker: this, frames, options, cancel, animation });
      return animation;
    }),
  });
});

afterEach(() => {
  if (root) act(() => root!.unmount());
  root = undefined;
  container.remove();
  if (animateDescriptor) Object.defineProperty(HTMLElement.prototype, "animate", animateDescriptor);
  else delete (HTMLElement.prototype as { animate?: unknown }).animate;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("sliding selection indicator", () => {
  it("shows the initial selection immediately without animating from another group or page", () => {
    render({ activeKey: "a" });
    expect(animations).toHaveLength(0);
    expect(activeMarker()?.dataset.marker).toBe("a");
  });

  it("moves vertically between nonadjacent siblings using the shared nonlinear motion tokens", () => {
    render({ activeKey: "a" });
    render({ activeKey: "c" });
    expect(animations).toHaveLength(1);
    expect(animations[0].marker).toBe(activeMarker());
    expect(transformComponents(animations[0].frames[0])).toEqual({ x: 0, y: -80, scaleX: 1, scaleY: 1 });
    expect(animations[0].options).toMatchObject({ duration: 250, easing: easingToken });
    expect(animations[0].frames[0].transformOrigin ?? animations[0].marker.style.transformOrigin).toBe("top left");
    expect(activeMarker()?.getAttribute("aria-hidden")).toBe("true");
  });

  it("moves horizontally and resizes to the target indicator without changing layout", () => {
    rectangles.set("a", rect(20, 40, 40, 2));
    rectangles.set("b", rect(100, 40, 80, 2));
    durationToken = "0.3s";
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    expect(transformComponents(animations[0].frames[0])).toEqual({ x: -80, y: 0, scaleX: 0.5, scaleY: 1 });
    expect(animations[0].options.duration).toBe(300);
    expect(activeMarker()?.style.position).toBe("");
  });

  it.each([
    { axis: "vertical", direction: "forward", source: rect(10, 20, 4, 14), target: rect(10, 100, 4, 20) },
    { axis: "vertical", direction: "reverse", source: rect(10, 100, 4, 20), target: rect(10, 20, 4, 14) },
    { axis: "horizontal", direction: "forward", source: rect(20, 40, 40, 2), target: rect(140, 40, 80, 2) },
    { axis: "horizontal", direction: "reverse", source: rect(140, 40, 80, 2), target: rect(20, 40, 40, 2) },
  ])("stretches then contracts along $axis travel in the $direction direction", ({ axis, source, target }) => {
    rectangles.set("a", source);
    rectangles.set("b", target);
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    const { frames, options } = animations[0];
    expect(options.easing).toBe(easingToken);
    const geometry = frames.map((frame) => frameRectangle(frame, target));
    expectRectangle(geometry[0], source);
    expectRectangle(geometry.at(-1)!, target);
    const length = axis === "vertical" ? "height" : "width";
    const thickness = axis === "vertical" ? "width" : "height";
    const position = axis === "vertical" ? "y" : "x";
    const peak = geometry.reduce((longest, current) => current[length] > longest[length] ? current : longest);
    expect(peak[length]).toBeGreaterThan(Math.max(source[length], target[length]));
    for (const frame of geometry) expect(frame[thickness]).toBeCloseTo(target[thickness], 8);
    const sourceCenter = source[position] + source[length] / 2;
    const targetCenter = target[position] + target[length] / 2;
    const peakCenter = peak[position] + peak[length] / 2;
    const travel = (peakCenter - sourceCenter) / (targetCenter - sourceCenter);
    expect(travel).toBeGreaterThan(0);
    expect(travel).toBeLessThan(1);
    const peakFrame = frames[geometry.indexOf(peak)];
    expect(peakFrame.offset).toBeGreaterThan(0);
    expect(peakFrame.offset).toBeLessThan(1);
  });

  it.each([
    { direction: "forward", source: rect(0, 40, 6, 2), target: rect(30, 40, 300, 2) },
    { direction: "reverse", source: rect(30, 40, 300, 2), target: rect(0, 40, 6, 2) },
  ])("keeps the stretched underline within unequal-width endpoint bounds in the $direction direction", ({ source, target }) => {
    rectangles.set("a", source);
    rectangles.set("b", target);
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    const geometry = animations[0].frames.map((frame) => frameRectangle(frame, target));
    const start = Math.min(source.left, target.left);
    const end = Math.max(source.right, target.right);
    expectRectangle(geometry[0], source);
    expectRectangle(geometry.at(-1)!, target);
    for (const frame of geometry) {
      expect(frame.left).toBeGreaterThanOrEqual(start);
      expect(frame.right).toBeLessThanOrEqual(end);
      expect(frame.height).toBeCloseTo(2, 8);
    }
    expect(Math.max(...geometry.map((frame) => frame.width))).toBeGreaterThan(Math.max(source.width, target.width));
  });

  it("retargets a running animation from its current visual rectangle before canceling it", () => {
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    const previous = animations[0];
    rectangles.set("b", rect(55, 40, 8, 11));
    rectangles.set("c", rect(130, 70, 4, 22));
    events = [];
    render({ activeKey: "c" });
    expect(previous.cancel).toHaveBeenCalledOnce();
    expect(events.indexOf("measure:b")).toBeGreaterThanOrEqual(0);
    expect(events.indexOf("measure:b")).toBeLessThan(events.indexOf("cancel:b"));
    expect(animations).toHaveLength(2);
    expect(transformComponents(animations[1].frames[0])).toEqual({ x: -75, y: -30, scaleX: 2, scaleY: 0.5 });
  });

  it("reverses a stretched in-flight marker without compounding its temporary length", () => {
    const naturalTarget = rectangles.get("a")!;
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    const inFlight = rect(10, 47, 4, 21.7);
    rectangles.set("b", inFlight);
    render({ activeKey: "a" });
    const frames = animations[1].frames.map((frame) => frameRectangle(frame, naturalTarget));
    expectRectangle(frames[0], inFlight);
    expectRectangle(frames.at(-1)!, naturalTarget);
    const longest = Math.max(...frames.map((frame) => frame.height));
    expect(longest).toBeLessThanOrEqual(Math.max(inFlight.height, naturalTarget.height * 1.6));
    expect(animations[0].cancel).toHaveBeenCalledOnce();
  });

  it("converts viewport coordinates to local CSS pixels under ancestor scaling", () => {
    rectangles.set("a", rect(20, 40, 8, 28));
    rectangles.set("b", rect(20, 120, 8, 28));
    render({ activeKey: "a" });
    for (const marker of container.querySelectorAll<HTMLElement>("[data-marker]")) {
      marker.style.width = "4px";
      marker.style.height = "14px";
    }
    render({ activeKey: "b" });
    expect(transformComponents(animations[0].frames[0])).toEqual({ x: 0, y: -40, scaleX: 1, scaleY: 1 });
    const geometry = animations[0].frames.map((frame) => frameRectangle(frame, rectangles.get("b")!, { x: 2, y: 2 }));
    expect(Math.max(...geometry.map((frame) => frame.height))).toBeGreaterThan(28);
    for (const frame of geometry) expect(frame.width).toBeCloseTo(8, 8);
    expectRectangle(geometry.at(-1)!, rectangles.get("b")!);
  });

  it("keeps selection working if an inherited easing value is rejected by the browser", () => {
    vi.mocked(HTMLElement.prototype.animate).mockImplementation(() => {
      throw new TypeError("Invalid easing");
    });
    render({ activeKey: "a" });
    expect(() => render({ activeKey: "b" })).not.toThrow();
    expect(activeMarker()?.dataset.marker).toBe("b");
  });

  it("uses the nearest leaf group even when both groups share an outer container", () => {
    render({ activeKey: "a" });
    render({ activeKey: "d" });
    expect(animations).toHaveLength(0);
    expect(activeMarker()?.dataset.marker).toBe("d");
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    expect(animations).toHaveLength(1);
  });

  it("clears continuity when no marker is selected and starts the next selection immediately", () => {
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    render({ activeKey: "missing" });
    expect(animations[0].cancel).toHaveBeenCalledOnce();
    expect(activeMarker()).toBeNull();
    render({ activeKey: "c" });
    expect(animations).toHaveLength(1);
  });

  it("does not animate from an indicator removed by the same render", () => {
    render({ activeKey: "a" });
    render({ activeKey: "b", markers: defaultMarkers.filter(({ key }) => key !== "a") });
    expect(animations).toHaveLength(0);
    expect(activeMarker()?.dataset.marker).toBe("b");
  });

  it.each(["a", "b"])("avoids invalid transforms when the %s marker has zero geometry", (key) => {
    rectangles.set(key, rect(0, 0, 0, 0));
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    expect(animations).toHaveLength(0);
    expect(activeMarker()?.dataset.marker).toBe("b");
  });

  it("honors reduced motion on mount while updating the active marker", () => {
    reducedMotion = true;
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    expect(animations).toHaveLength(0);
    expect(activeMarker()?.dataset.marker).toBe("b");
  });

  it("cancels running motion when the preference changes and resumes on a later selection", () => {
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    changeReducedMotion(true);
    expect(animations[0].cancel).toHaveBeenCalledOnce();
    render({ activeKey: "c" });
    expect(animations).toHaveLength(1);
    changeReducedMotion(false);
    render({ activeKey: "a" });
    expect(animations).toHaveLength(2);
  });

  it.each(["linear", "cubic-bezier(0, 0, 1, 1)", "invalid"])("positions immediately for unsupported easing=%s", (value) => {
    easingToken = value;
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    expect(activeMarker()?.dataset.marker).toBe("b");
    expect(animations).toHaveLength(0);
  });

  it("keeps selection working when the browser has no Web Animations API", () => {
    Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, value: undefined });
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    expect(animations).toHaveLength(0);
    expect(activeMarker()?.dataset.marker).toBe("b");
  });

  it("stops motion when disabled and releases the active animation on unmount", () => {
    render({ activeKey: "a" });
    render({ activeKey: "b" });
    render({ activeKey: "c", enabled: false });
    expect(animations[0].cancel).toHaveBeenCalledOnce();
    expect(animations).toHaveLength(1);
    render({ activeKey: "a", enabled: true });
    render({ activeKey: "b", enabled: true });
    const running = animations.at(-1)!;
    act(() => root!.unmount());
    root = undefined;
    expect(running.cancel).toHaveBeenCalledOnce();
  });

  it("renders the selected marker on the server without layout reads or animation", () => {
    const geometry = vi.mocked(HTMLElement.prototype.getBoundingClientRect);
    const markup = renderToStaticMarkup(<Harness activeKey="b" />);
    expect(markup).toContain('data-marker="b" data-selection-indicator="true" data-slot="test-indicator"');
    expect(geometry).not.toHaveBeenCalled();
    expect(animations).toHaveLength(0);
  });
});
