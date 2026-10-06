// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Toggle, type ToggleProps } from "../src/components/ui/toggle";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

type CapturedMotion = {
  target: HTMLElement;
  frames: Keyframe[];
  options: KeyframeAnimationOptions;
  animation: Animation;
  cancel: ReturnType<typeof vi.fn>;
};

const geometries = {
  small: { width: 28, height: 14, thumb: 10, travel: 15 },
  medium: { width: 36, height: 20, thumb: 16, travel: 17 },
  large: { width: 40, height: 24, thumb: 20, travel: 17 },
};

function rect(x: number, y: number, width: number, height: number): DOMRect {
  return { x, y, width, height, left: x, top: y, right: x + width,
    bottom: y + height, toJSON: () => ({}) } as DOMRect;
}

let container: HTMLDivElement;
let root: Root | undefined;
let motions: CapturedMotion[];
let visual: DOMRect | undefined;
let reduced: boolean;
let duration: string;
let easing: string;
let media: MediaQueryList;
let animateDescriptor: PropertyDescriptor | undefined;
let ancestorScale: number;
let activeSize: keyof typeof geometries;

function render(props: ToggleProps = {}) {
  activeSize = props.size ?? "small";
  act(() => root!.render(<Toggle aria-label="Enable Firewall" {...props} />));
}

function input() { return container.querySelector<HTMLInputElement>('input[type="checkbox"]')!; }
function thumb() { return container.querySelector<HTMLElement>('[data-slot="toggle-thumb"]')!; }
function track() { return container.querySelector<HTMLElement>('[data-slot="toggle-track"]')!; }
function click() { act(() => input().click()); }

function naturalBox(checked: boolean) {
  const geometry = geometries[activeSize];
  return rect(100 + (1.5 + (checked ? geometry.travel : 0)) * ancestorScale,
    60 + (geometry.height - geometry.thumb) / 2 * ancestorScale,
    geometry.thumb * ancestorScale, geometry.thumb * ancestorScale);
}

function frameBox(frame: Keyframe) {
  const translation = String(frame.translate).match(/^([-\d.]+)px\s+-50%$/);
  expect(translation, "translation must preserve vertical centering without scaling contents").not.toBeNull();
  const geometry = geometries[activeSize];
  return rect(100 + (1.5 + Number(translation![1])) * ancestorScale,
    60 + (geometry.height - geometry.thumb) / 2 * ancestorScale,
    Number.parseFloat(String(frame.width)) * ancestorScale, geometry.thumb * ancestorScale);
}

function expectBox(actual: DOMRect, expected: DOMRect) {
  for (const property of ["x", "y", "width", "height"] as const) {
    expect(actual[property], property).toBeCloseTo(expected[property], 6);
  }
}

function expectStretch(motion: CapturedMotion, from: DOMRect, to: DOMRect) {
  const frames = motion.frames.map(frameBox);
  expectBox(frames[0], from);
  expectBox(frames.at(-1)!, to);
  const peak = frames.reduce((largest, current) => current.width > largest.width ? current : largest);
  expect(peak.width).toBeGreaterThan(to.width);
  expect(peak.width).toBeLessThanOrEqual(to.width * 1.25 + 0.00001);
  for (const frame of frames) {
    expect(frame.height).toBe(to.height);
    expect(frame.y).toBe(to.y);
    expect(frame.left).toBeGreaterThanOrEqual(100 + 1.5 * ancestorScale - 0.00001);
    expect(frame.right).toBeLessThanOrEqual(100 + (geometries[activeSize].width - 1.5) * ancestorScale + 0.00001);
  }
  for (const frame of motion.frames) {
    expect(frame.transform).toBeUndefined();
    expect(frame.scale).toBeUndefined();
    expect(frame.height).toBeUndefined();
  }
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  motions = [];
  visual = undefined;
  reduced = false;
  duration = "250ms";
  easing = "cubic-bezier(0.32, 0.72, 0, 1)";
  ancestorScale = 1;
  activeSize = "small";
  const events = new EventTarget();
  media = Object.assign(events, { media: "(prefers-reduced-motion: reduce)", onchange: null,
    addListener: vi.fn((listener: EventListener) => events.addEventListener("change", listener)),
    removeListener: vi.fn((listener: EventListener) => events.removeEventListener("change", listener)),
  }) as unknown as MediaQueryList;
  Object.defineProperty(media, "matches", { get: () => reduced });
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    if (this.dataset.slot === "toggle-thumb") return visual ?? naturalBox(input().checked);
    const geometry = geometries[activeSize];
    return rect(100, 60, geometry.width * ancestorScale, geometry.height * ancestorScale);
  });
  const nativeStyle = window.getComputedStyle.bind(window);
  vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
    const style = nativeStyle(element, pseudo);
    const isThumb = (element as HTMLElement).dataset.slot === "toggle-thumb";
    const geometry = geometries[activeSize];
    const values: Record<string, string> = {
      width: `${isThumb ? geometry.thumb : geometry.width}px`,
      height: `${isThumb ? geometry.thumb : geometry.height}px`,
      left: isThumb ? "1.5px" : "0px",
      translate: `${isThumb && input()?.checked ? geometry.travel : 0}px -50%`,
      "--uni-motion-state": duration, "--ease-snap": easing,
    };
    return new Proxy(style, { get(target, property) {
      if (property === "getPropertyValue") return (name: string) => values[name] ?? target.getPropertyValue(name);
      return typeof property === "string" && property in values ? values[property] : Reflect.get(target, property);
    } });
  });
  animateDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "animate");
  Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true,
    value: vi.fn(function (this: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) {
      const events = new EventTarget();
      const cancel = vi.fn(() => { visual = undefined; });
      const animation = Object.assign(events, { cancel, onfinish: null, oncancel: null,
        playState: "running", finished: new Promise<Animation>(() => {}),
      }) as unknown as Animation;
      motions.push({ target: this, frames, options, cancel, animation });
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

describe("Toggle thumb motion", () => {
  it.each([false, true])("shows initial checked=%s without an entry animation", (checked) => {
    render({ checked, readOnly: true });
    expect(input().checked).toBe(checked);
    expect(motions).toHaveLength(0);
    expect(thumb().getAttribute("aria-hidden")).toBe("true");
  });

  it.each(Object.keys(geometries) as (keyof typeof geometries)[])("stretches width then settles to a circle in both directions at size=%s", (size) => {
    render({ size, checked: false, readOnly: true });
    const off = naturalBox(false);
    render({ size, checked: true, readOnly: true });
    const on = naturalBox(true);
    expect(motions).toHaveLength(1);
    expectStretch(motions[0], off, on);
    expect(motions[0].target).toBe(thumb());
    expect(motions[0].options).toMatchObject({ duration: 250, easing });
    // The reverse endpoint contract starts after settling; the interrupted
    // contract below supplies a sampled in-flight rectangle separately.
    Object.assign(motions[0].animation, { playState: "finished" });
    render({ size, checked: false, readOnly: true });
    expectStretch(motions[1], on, off);
  });

  it("inherits both motion tokens from the control", () => {
    duration = "0.42s";
    easing = "cubic-bezier(0.3, 0.8, 0.2, 1)";
    render({ checked: false, readOnly: true });
    render({ checked: true, readOnly: true });
    expect(motions[0].options).toMatchObject({ duration: 420, easing });
  });

  it("preserves the sampled position and width when reversing a stretched thumb", () => {
    render({ checked: false, readOnly: true, size: "large" });
    render({ checked: true, readOnly: true, size: "large" });
    const interrupted = frameBox(motions[0].frames[1]);
    visual = interrupted;
    render({ checked: false, readOnly: true, size: "large" });
    expect(motions[0].cancel).toHaveBeenCalledOnce();
    expectBox(frameBox(motions[1].frames[0]), interrupted);
    const widths = motions[1].frames.map((frame) => frameBox(frame).width);
    expect(Math.max(...widths)).toBeLessThanOrEqual(geometries.large.thumb * 1.25 + 0.00001);
    expectBox(frameBox(motions[1].frames.at(-1)!), naturalBox(false));
  });

  it("converts scaled viewport rectangles into local CSS pixels", () => {
    ancestorScale = 1.5;
    render({ checked: false, readOnly: true, size: "medium" });
    const off = naturalBox(false);
    render({ checked: true, readOnly: true, size: "medium" });
    expectStretch(motions[0], off, naturalBox(true));
  });

  it("animates an uncontrolled native change and invokes its callback exactly once", () => {
    const onChange = vi.fn();
    render({ defaultChecked: true, onChange, name: "firewall" });
    expect(input().checked).toBe(true);
    click();
    expect(input().checked).toBe(false);
    expect(onChange).toHaveBeenCalledOnce();
    expect(motions).toHaveLength(1);
    expectStretch(motions[0], naturalBox(true), naturalBox(false));
  });

  it("does not animate a controlled change that the owner declines", () => {
    const onChange = vi.fn();
    render({ checked: false, onChange });
    click();
    expect(input().checked).toBe(false);
    expect(onChange).toHaveBeenCalledOnce();
    expect(motions).toHaveLength(0);
  });

  it("animates an accepted controlled native change once", () => {
    const onChange = vi.fn();
    function Controlled() {
      const [checked, setChecked] = React.useState(false);
      return <Toggle aria-label="Enable Firewall" checked={checked} onChange={() => {
        onChange(); setChecked((value) => !value);
      }} />;
    }
    act(() => root!.render(<Controlled />));
    click();
    expect(input().checked).toBe(true);
    expect(onChange).toHaveBeenCalledOnce();
    expect(motions).toHaveLength(1);
  });

  it("keeps the inherited input ref attached and cleans it up on unmount", () => {
    const inputRef = React.createRef<HTMLInputElement>();
    render({ ref: inputRef });
    expect(inputRef.current).toBe(input());
    inputRef.current?.focus();
    expect(document.activeElement).toBe(input());
    act(() => root!.unmount());
    root = undefined;
    expect(inputRef.current).toBeNull();
  });

  it("preserves callback refs with React 19 cleanup", () => {
    const cleanup = vi.fn();
    const inputRef = vi.fn(() => cleanup);
    render({ ref: inputRef });
    expect(inputRef).toHaveBeenCalledOnce();
    expect(inputRef).toHaveBeenCalledWith(input());
    act(() => root!.unmount());
    root = undefined;
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it("keeps icon contents free of scale transforms while the thumb stretches", () => {
    render({ checked: false, readOnly: true, icon: { checked: <svg data-test-icon="checked" /> } });
    render({ checked: true, readOnly: true, icon: { checked: <svg data-test-icon="checked" /> } });
    const icon = thumb().querySelector("svg")!;
    expect(icon).not.toBeNull();
    expect(icon.style.transform).toBe("");
    expect(motions[0].frames.every((frame) => frame.transform === undefined && frame.scale === undefined)).toBe(true);
    expect(thumb().style.transform).toBe("");
  });

  it("uses immediate state changes for reduced motion, including live changes", () => {
    reduced = true;
    render({ checked: false, readOnly: true });
    render({ checked: true, readOnly: true });
    expect(input().checked).toBe(true);
    expect(motions).toHaveLength(0);
    reduced = false;
    render({ checked: false, readOnly: true });
    expect(motions).toHaveLength(1);
    reduced = true;
    act(() => media.dispatchEvent(new Event("change")));
    expect(motions[0].cancel).toHaveBeenCalledOnce();
    expect(input().checked).toBe(false);
  });

  it("cancels active motion when the control is disabled", () => {
    render({ checked: false, readOnly: true });
    render({ checked: true, readOnly: true });
    render({ checked: true, readOnly: true, disabled: true });
    expect(motions[0].cancel).toHaveBeenCalledOnce();
    render({ checked: false, readOnly: true, disabled: true });
    expect(motions).toHaveLength(1);
  });

  it("cancels active motion on size and window-layout changes", () => {
    render({ checked: false, readOnly: true });
    render({ checked: true, readOnly: true });
    render({ checked: true, readOnly: true, size: "large" });
    expect(motions[0].cancel).toHaveBeenCalledOnce();
    expect(motions).toHaveLength(1);
    render({ checked: false, readOnly: true, size: "large" });
    act(() => window.dispatchEvent(new Event("resize")));
    expect(motions[1].cancel).toHaveBeenCalledOnce();
  });

  it("cancels motion and respects native uncontrolled form reset", async () => {
    act(() => root!.render(<form><Toggle aria-label="Enable Firewall" defaultChecked /></form>));
    click();
    expect(motions).toHaveLength(1);
    await act(async () => {
      container.querySelector("form")!.reset();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(input().checked).toBe(true);
    expect(motions[0].cancel).toHaveBeenCalledOnce();
    expect(motions).toHaveLength(1);
    click();
    expect(motions).toHaveLength(2);
    expectStretch(motions[1], naturalBox(true), naturalBox(false));
  });

  it.each([false, true])("keeps uncontrolled changes animated after label presence changes from %s", (labelled) => {
    render({ defaultChecked: false, children: labelled ? "Enable Firewall" : undefined });
    const oldInput = input();
    render({ defaultChecked: false, children: labelled ? undefined : "Enable Firewall" });
    expect(input()).not.toBe(oldInput);
    click();
    expect(input().checked).toBe(true);
    expect(motions).toHaveLength(1);
    expectStretch(motions[0], naturalBox(false), naturalBox(true));
  });

  it("rebinds native reset when the input moves to a different associated form", async () => {
    function Associated({ form }: { form: string }) {
      return <><form id="previous-form" /><form id="current-form" />
        <Toggle aria-label="Enable Firewall" defaultChecked={false} form={form} /></>;
    }
    act(() => root!.render(<Associated form="previous-form" />));
    const sameInput = input();
    act(() => root!.render(<Associated form="current-form" />));
    expect(input()).toBe(sameInput);
    click();
    expect(input().checked).toBe(true);
    await act(async () => {
      container.querySelector<HTMLFormElement>("#previous-form")!.reset();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(motions[0].cancel).not.toHaveBeenCalled();
    expect(input().checked).toBe(true);
    await act(async () => {
      container.querySelector<HTMLFormElement>("#current-form")!.reset();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(input().checked).toBe(false);
    expect(motions[0].cancel).toHaveBeenCalledOnce();
    expect(motions).toHaveLength(1);
    click();
    expect(motions).toHaveLength(2);
    expectStretch(motions[1], naturalBox(false), naturalBox(true));
  });

  it("cancels active motion on unmount", () => {
    render({ checked: false, readOnly: true });
    render({ checked: true, readOnly: true });
    act(() => root!.unmount());
    root = undefined;
    expect(motions[0].cancel).toHaveBeenCalledOnce();
  });

  it.each(["0ms", "-20ms", "nonsense", ""])("keeps checked state usable with duration=%s", (value) => {
    duration = value;
    render({ checked: false, readOnly: true });
    render({ checked: true, readOnly: true });
    expect(input().checked).toBe(true);
    expect(motions).toHaveLength(0);
  });

  it("keeps state usable if WAAPI is absent or rejects custom easing", () => {
    const animate = HTMLElement.prototype.animate;
    Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, value: undefined });
    render({ checked: false, readOnly: true });
    render({ checked: true, readOnly: true });
    expect(input().checked).toBe(true);
    Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true,
      value: vi.fn(() => { throw new TypeError("Invalid easing"); }),
    });
    expect(() => render({ checked: false, readOnly: true })).not.toThrow();
    expect(input().checked).toBe(false);
    expect(motions).toHaveLength(0);
    Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, value: animate });
  });

  it("renders the native checked input on the server without animation work", () => {
    const markup = renderToStaticMarkup(<Toggle checked readOnly aria-label="Enable Firewall" />);
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('checked=""');
    expect(markup).toContain('data-slot="toggle-thumb"');
    expect(motions).toHaveLength(0);
  });
});
