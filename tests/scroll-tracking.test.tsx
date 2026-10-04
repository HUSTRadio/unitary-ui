// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SidebarNav, type SidebarNavGroup, type SidebarNavProps } from "../src/components/ui/sidebar-nav";
import { Tabs, type TabsTab } from "../src/components/ui/tabs";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

type Mode = "disabled" | "on-reload" | "always";
type Surface = "sidebar" | "tabs";
type Write = { node: HTMLElement; axis: "top" | "left"; value: number };

const groups: SidebarNavGroup[] = [{
  id: "components",
  label: "Components",
  items: ["a", "b", "last"].map((value) => ({ label: value, to: `/${value}` })),
}];
const tabs: TabsTab[] = ["a", "b", "last"].map((value) => ({ title: value, value }));
const itemOffsets: Record<string, number> = { a: 200, b: 360, last: 550, missing: 320 };
const tabOffsets: Record<string, number> = { a: 0, b: 240, last: 510, missing: 340 };
const categories: SidebarNavGroup[] = [
  { ...groups[0], items: groups[0].items.slice(0, 1), subgroups: [{ label: "Shared category", items: groups[0].items.slice(0, 1) }] },
  { id: "other", label: "Other", items: groups[0].items.slice(1), subgroups: [{ label: "Shared category", items: groups[0].items.slice(1) }] },
];
type SidebarOptions = Pick<SidebarNavProps, "groups" | "scrollTrackingTarget">;

let container: HTMLDivElement;
let root: Root | undefined;
let now: number;
let nextFrame: number;
let frames: Map<number, FrameRequestCallback>;
let positions: WeakMap<HTMLElement, { top: number; left: number }>;
let writes: Write[];
let reducedMotion: boolean;
let ownerHidden: boolean;
let direction: "ltr" | "rtl";
let durationToken: string;
let easingToken: string;
let readyState: DocumentReadyState;
let prototypeDescriptors: Map<string, PropertyDescriptor | undefined>;
let readyStateDescriptor: PropertyDescriptor | undefined;

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return { x: left, y: top, left, top, width, height, right: left + width,
    bottom: top + height, toJSON: () => ({}) } as DOMRect;
}

function isOwner(node: HTMLElement): boolean {
  return node.dataset.testOwner !== undefined || node.dataset.slot === "tabs";
}

function currentPosition(node: HTMLElement) {
  let position = positions.get(node);
  if (!position) {
    position = { top: 0, left: 0 };
    positions.set(node, position);
  }
  return position;
}

function ownerOf(node: HTMLElement): HTMLElement | null {
  return node.closest<HTMLElement>('[data-test-owner], [data-slot="tabs"]');
}

function layout(node: HTMLElement): DOMRect {
  if (node.dataset.testOuter !== undefined) return rect(0, 0, 800, 600);
  const owner = ownerOf(node);
  if (!owner || ownerHidden) return rect(0, 0, 0, 0);
  const horizontal = owner.dataset.slot === "tabs";
  if (node === owner) return rect(40, 100, 184, horizontal ? 52 : 124);
  if (node.dataset.slot === "sidebar-nav") {
    return rect(42, 102 - owner.scrollTop, 180, 600);
  }
  if (node.tagName === "A") {
    const value = node.getAttribute("href")?.slice(1) ?? "a";
    return rect(42 - owner.scrollLeft, 102 + (itemOffsets[value] ?? 0) - owner.scrollTop, 160, 36);
  }
  if (node.dataset.slot === "sidebar-nav-heading" || node.dataset.slot === "sidebar-nav-subheading") {
    const category = node.closest('[data-slot="sidebar-nav-subgroup"], [data-slot="sidebar-nav-group"]')!;
    const value = category.querySelector("a")?.getAttribute("href")?.slice(1) ?? "a";
    const offset = (itemOffsets[value] ?? 0) - (node.dataset.slot === "sidebar-nav-heading" ? 60 : 30);
    return rect(42, 102 + offset - owner.scrollTop, 160, 28);
  }
  if (node.getAttribute("role") === "tab") {
    const value = node.textContent ?? "a";
    const offset = tabOffsets[value] ?? 0;
    const left = direction === "rtl"
      ? 222 - offset - owner.scrollLeft - 100
      : 42 + offset - owner.scrollLeft;
    return rect(left, 102 - owner.scrollTop, 100, 48);
  }
  return rect(42, 102 - owner.scrollTop, 180, 36);
}

function fixture(surface: Surface, mode?: Mode, active = "a", entries?: string[], sidebarOptions?: SidebarOptions) {
  return (
    <div data-test-outer style={{ overflow: "auto" }}>
      {surface === "sidebar" ? (
        <div data-test-owner style={{ overflowY: "auto", overflowX: "hidden" }}>
          <SidebarNav
            groups={entries ? [{ ...groups[0], items: entries.map((value) => ({ label: value, to: `/${value}` })) }] : groups}
            activeTo={`/${active}`}
            scrollTracking={mode}
            {...sidebarOptions}
          />
        </div>
      ) : (
        <Tabs
          tabs={entries ? entries.map((value) => ({ title: value, value })) : tabs}
          selected={active}
          setSelected={() => {}}
          scrollTracking={mode}
        />
      )}
    </div>
  );
}

function render(surface: Surface, mode?: Mode, active = "a", entries?: string[], sidebarOptions?: SidebarOptions) {
  act(() => root!.render(fixture(surface, mode, active, entries, sidebarOptions)));
  return container.querySelector<HTMLElement>('[data-test-owner], [data-slot="tabs"]')!;
}

function frame(elapsed = 16) {
  now += elapsed;
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach((callback) => callback(now)));
}

function finish() {
  for (let count = 0; frames.size && count < 160; count++) frame();
  expect(frames.size, "tracking must finish rather than continuously lock scrolling").toBe(0);
}

function primeAnimation() {
  // Readiness may defer the first animation by one or more frames. Keeping the
  // same clock value makes the following samples relative to its actual start.
  for (let count = 0; count < 8 && frames.size; count++) frame(0);
}

beforeEach(() => {
  now = 0;
  nextFrame = 1;
  frames = new Map();
  positions = new WeakMap();
  writes = [];
  reducedMotion = false;
  ownerHidden = false;
  direction = "ltr";
  durationToken = "300ms";
  easingToken = "cubic-bezier(0.4, 0, 0.2, 1)";
  itemOffsets.a = 200;
  readyState = "complete";
  readyStateDescriptor = Object.getOwnPropertyDescriptor(document, "readyState");
  Object.defineProperty(document, "readyState", { configurable: true, get: () => readyState });

  const requestFrame = (callback: FrameRequestCallback) => {
    const id = nextFrame++;
    frames.set(id, callback);
    return id;
  };
  const cancelFrame = (id: number) => { frames.delete(id); };
  vi.stubGlobal("requestAnimationFrame", requestFrame);
  vi.stubGlobal("cancelAnimationFrame", cancelFrame);
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(requestFrame);
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(cancelFrame);
  vi.spyOn(performance, "now").mockImplementation(() => now);
  if (window.performance !== performance) vi.spyOn(window.performance, "now").mockImplementation(() => now);
  vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" && reducedMotion,
    media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  })));

  prototypeDescriptors = new Map();
  const override = (name: string, descriptor: PropertyDescriptor) => {
    prototypeDescriptors.set(name, Object.getOwnPropertyDescriptor(HTMLElement.prototype, name));
    Object.defineProperty(HTMLElement.prototype, name, { configurable: true, ...descriptor });
  };
  for (const [property, axis] of [["scrollTop", "top"], ["scrollLeft", "left"]] as const) {
    override(property, {
      get(this: HTMLElement) { return currentPosition(this)[axis]; },
      set(this: HTMLElement, value: number) {
        currentPosition(this)[axis] = value;
        writes.push({ node: this, axis, value });
      },
    });
  }
  const dimensions: Record<string, (node: HTMLElement) => number> = {
    clientTop: (node) => isOwner(node) ? 2 : 0,
    clientLeft: (node) => isOwner(node) ? 2 : 0,
    clientHeight: (node) => node.dataset.testOuter !== undefined ? 600 : isOwner(node) && !ownerHidden ? node.dataset.slot === "tabs" ? 48 : 120 : 0,
    clientWidth: (node) => node.dataset.testOuter !== undefined ? 800 : isOwner(node) && !ownerHidden ? 180 : 0,
    scrollHeight: (node) => node.dataset.testOuter !== undefined ? 1600 : isOwner(node) ? node.dataset.slot === "tabs" ? 48 : 600 : 0,
    scrollWidth: (node) => node.dataset.testOuter !== undefined ? 1200 : isOwner(node) ? node.dataset.slot === "tabs" ? 660 : 180 : 0,
    offsetHeight: (node) => layout(node).height,
    offsetWidth: (node) => layout(node).width,
  };
  for (const [name, measure] of Object.entries(dimensions)) {
    override(name, { get(this: HTMLElement) { return measure(this); } });
  }
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) { return layout(this); });
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(function (this: HTMLElement) {
    const value = layout(this);
    return { 0: value, length: value.width && value.height ? 1 : 0, item: () => value,
      [Symbol.iterator]: function* () { if (value.width && value.height) yield value; } } as DOMRectList;
  });

  const nativeComputedStyle = window.getComputedStyle.bind(window);
  vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
    const style = nativeComputedStyle(element, pseudo);
    const node = element as HTMLElement;
    const enabled = node.closest('[data-slot="sidebar-nav"], [data-slot="tabs"]')
      ?.getAttribute("data-scroll-tracking") !== "disabled";
    const overrides: Record<string, string> = {
      direction,
      overflowY: node.dataset.testOwner !== undefined || node.dataset.testOuter !== undefined ? "auto" : "visible",
      overflowX: node.dataset.slot === "tabs" || node.dataset.testOuter !== undefined ? "auto" : "visible",
      scrollMarginBlockStart: enabled ? "16px" : "0px",
      scrollMarginInlineStart: enabled ? "16px" : "0px",
      display: ownerHidden && ownerOf(node) ? "none" : style.display,
    };
    return new Proxy(style, {
      get(target, property) {
        if (typeof property === "string" && property in overrides) return overrides[property];
        if (property === "getPropertyValue") return (name: string) => {
          if (name === "--uni-motion-state") return durationToken;
          if (name === "--ease-in-out") return easingToken;
          if (name === "scroll-margin-block-start" || name === "scroll-margin-inline-start") return enabled ? "16px" : "0px";
          return target.getPropertyValue(name);
        };
        const value = Reflect.get(target, property);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
  });

  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  if (root) act(() => root!.unmount());
  root = undefined;
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  for (const [name, descriptor] of prototypeDescriptors) {
    if (descriptor) Object.defineProperty(HTMLElement.prototype, name, descriptor);
    else Reflect.deleteProperty(HTMLElement.prototype, name);
  }
  if (readyStateDescriptor) Object.defineProperty(document, "readyState", readyStateDescriptor);
  else Reflect.deleteProperty(document, "readyState");
});

describe("optional active-item scroll tracking", () => {
  it("aligns the active subgroup heading even when another group has the same category label", () => {
    const owner = render("sidebar", "always", "b", undefined, { groups: categories, scrollTrackingTarget: "category" });
    finish();
    expect(owner.scrollTop).toBe(314);
    const target = container.querySelector<HTMLElement>('[data-scroll-tracking-category]')!;
    expect(target.closest('[data-slot="sidebar-nav-group"]')?.textContent).toContain("Other");
    expect(layout(target).top - layout(owner).top - owner.clientTop).toBe(16);
    expect(container.querySelector('[aria-current="page"]')?.getAttribute("href")).toBe("/b");
    expect(document.activeElement).toBe(document.body);
    owner.scrollTop = 70;
    render("sidebar", "always", "b", undefined, { groups: categories, scrollTrackingTarget: "category" });
    finish();
    expect(owner.scrollTop).toBe(70);
    render("sidebar", "always", "a", undefined, { groups: categories, scrollTrackingTarget: "category" });
    finish();
    expect(owner.scrollTop).toBe(154);
  });

  it("falls back to the group heading when there are no subgroups", () => {
    const owner = render("sidebar", "on-reload", "b", undefined, { groups, scrollTrackingTarget: "category" });
    finish();
    expect(owner.scrollTop).toBe(124);
    expect(container.querySelector('[data-scroll-tracking-category]')?.getAttribute("data-slot")).toBe("sidebar-nav-heading");
  });

  it("always realigns when the target option changes and keeps item alignment as the default", () => {
    const owner = render("sidebar", "always", "b", undefined, { groups: categories });
    finish();
    expect(owner.scrollTop).toBe(344);
    render("sidebar", "always", "b", undefined, { groups: categories, scrollTrackingTarget: "category" });
    finish();
    expect(owner.scrollTop).toBe(314);
    render("sidebar", "always", "b", undefined, { groups: categories, scrollTrackingTarget: "item" });
    finish();
    expect(owner.scrollTop).toBe(344);
  });

  it("on-reload does not repeat on category, route or target-option changes", () => {
    const owner = render("sidebar", "on-reload", "b", undefined, { groups: categories, scrollTrackingTarget: "category" });
    finish();
    owner.scrollTop = 70;
    writes = [];
    render("sidebar", "on-reload", "a", undefined, { groups: categories, scrollTrackingTarget: "category" });
    finish();
    render("sidebar", "on-reload", "a", undefined, { groups: categories, scrollTrackingTarget: "item" });
    finish();
    expect(owner.scrollTop).toBe(70);
    expect(writes).toEqual([]);
  });

  it("category selection leaves disabled tracking alone", () => {
    const owner = render("sidebar", "disabled", "b", undefined, { groups: categories, scrollTrackingTarget: "category" });
    owner.scrollTop = 70;
    writes = [];
    render("sidebar", "disabled", "a", undefined, { groups: categories, scrollTrackingTarget: "category" });
    finish();
    expect(owner.scrollTop).toBe(70);
    expect(writes).toEqual([]);
  });

  it("waits for a matching category instead of scrolling an unrelated heading", async () => {
    const owner = render("sidebar", "on-reload", "missing", undefined, { groups: categories, scrollTrackingTarget: "category" });
    primeAnimation();
    expect(writes).toEqual([]);
    const updated = [...categories, { id: "late", label: "Late", items: [{ label: "missing", to: "/missing" }] }];
    render("sidebar", "on-reload", "missing", undefined, { groups: updated, scrollTrackingTarget: "category" });
    await act(async () => { await Promise.resolve(); });
    finish();
    expect(owner.scrollTop).toBe(244);
  });

  it.each(["sidebar", "tabs"] as const)("%s leaves scrolling alone by default and when disabled", (surface) => {
    const owner = render(surface, undefined, "b");
    owner.scrollTop = 47;
    owner.scrollLeft = 39;
    writes = [];
    finish();
    render(surface, "disabled", "last");
    finish();
    expect(writes).toEqual([]);
    expect(owner.scrollTop).toBe(47);
    expect(owner.scrollLeft).toBe(39);
  });

  it("aligns the SidebarNav item inside its nearest owner's content box without moving ancestors or the other axis", () => {
    const owner = render("sidebar", "on-reload");
    const outer = container.querySelector<HTMLElement>("[data-test-outer]")!;
    outer.scrollTop = 70;
    owner.scrollLeft = 25;
    writes = [];
    finish();
    expect(owner.scrollTop).toBe(184);
    expect(layout(container.querySelector("a")!).top - (layout(owner).top + owner.clientTop)).toBe(16);
    expect(owner.scrollLeft).toBe(25);
    expect(outer.scrollTop).toBe(70);
    expect(writes.every((write) => write.node === owner && write.axis === "top")).toBe(true);
  });

  it.each([["a", 0], ["last", 480]] as const)("clamps vertical target %s to reachable position %s", (active, expected) => {
    itemOffsets.a = 0;
    const owner = render("sidebar", "always", active);
    owner.scrollTop = 300;
    finish();
    expect(owner.scrollTop).toBe(expected);
    expect(writes.filter((write) => write.node === owner).every((write) => write.value >= 0 && write.value <= 480)).toBe(true);
    itemOffsets.a = 200;
  });

  it.each([[12.5, 8], [4.5, 4]] as const)("uses a spacing inset of %spx clearance → %spx without exposing preceding sidebar text", (clearance, inset) => {
    const owner = render("sidebar", "on-reload", "b");
    const target = container.querySelector<HTMLElement>('[aria-current="page"]')!;
    vi.spyOn(document, "createRange").mockImplementation(() => ({
      selectNodeContents() {},
      getBoundingClientRect: () => {
        const box = layout(target);
        return rect(box.left, box.top - clearance - 20, 80, 20);
      },
    }) as unknown as Range);
    finish();
    const viewportTop = layout(owner).top + owner.clientTop;
    expect(layout(target).top - viewportTop).toBe(inset);
    expect(layout(target).top - clearance).toBeLessThan(viewportTop);
  });

  it.each(["ltr", "rtl"] as const)("reduces the inline inset without exposing the preceding tab content in %s", (dir) => {
    direction = dir;
    const owner = render("tabs", "always", "b");
    const target = container.querySelector<HTMLElement>('[aria-selected="true"]')!;
    vi.spyOn(document, "createRange").mockImplementation(() => ({
      selectNodeContents() {},
      getBoundingClientRect: () => {
        const box = layout(target);
        return rect(dir === "rtl" ? box.right + 14 : box.left - 14 - 80, box.top, 80, 20);
      },
    }) as unknown as Range);
    finish();
    expect(owner.scrollLeft).toBe(dir === "rtl" ? -232 : 232);
  });

  it("aligns horizontal Tabs in their own owner and clamps the final tab", () => {
    const owner = render("tabs", "always", "b");
    const outer = container.querySelector<HTMLElement>("[data-test-outer]")!;
    outer.scrollLeft = 33;
    owner.scrollTop = 7;
    writes = [];
    finish();
    expect(owner.scrollLeft).toBe(224);
    expect(owner.scrollTop).toBe(7);
    expect(outer.scrollLeft).toBe(33);
    expect(writes.every((write) => write.node === owner && write.axis === "left")).toBe(true);
    render("tabs", "always", "last");
    finish();
    expect(owner.scrollLeft).toBe(480);
  });

  it("aligns RTL Tabs at inline-start with negative scrollLeft", () => {
    direction = "rtl";
    const owner = render("tabs", "always", "b");
    finish();
    expect(owner.scrollLeft).toBe(-224);
    const selected = container.querySelector<HTMLElement>('[aria-selected="true"]')!;
    expect(layout(owner).right - owner.clientLeft - layout(selected).right).toBe(16);
  });

  it.each(["sidebar", "tabs"] as const)("%s on-reload aligns once and preserves later manual scrolling on active changes", (surface) => {
    const owner = render(surface, "on-reload", "b");
    finish();
    const property = surface === "sidebar" ? "scrollTop" : "scrollLeft";
    expect(owner[property]).toBe(surface === "sidebar" ? 344 : 224);
    owner[property] = 63;
    writes = [];
    render(surface, "on-reload", "last");
    finish();
    expect(owner[property]).toBe(63);
    expect(writes).toEqual([]);
  });

  it.each(["sidebar", "tabs"] as const)("%s always follows externally controlled activation and mode entry", (surface) => {
    const owner = render(surface, "disabled", "b");
    finish();
    render(surface, "always", "b");
    finish();
    expect(owner[surface === "sidebar" ? "scrollTop" : "scrollLeft"]).toBe(surface === "sidebar" ? 344 : 224);
    render(surface, "always", "last");
    finish();
    expect(owner[surface === "sidebar" ? "scrollTop" : "scrollLeft"]).toBe(480);
  });

  it.each(["sidebar", "tabs"] as const)("%s waits for an initially missing target instead of consuming on-reload", async (surface) => {
    const owner = render(surface, "on-reload", "missing");
    primeAnimation();
    expect(writes).toEqual([]);
    render(surface, "on-reload", "missing", ["a", "b", "last", "missing"]);
    await act(async () => { await Promise.resolve(); });
    finish();
    expect(owner[surface === "sidebar" ? "scrollTop" : "scrollLeft"]).toBe(surface === "sidebar" ? 304 : 324);
  });

  it("waits for DOM readiness on an initial direct-link load", () => {
    readyState = "loading";
    const owner = render("sidebar", "on-reload");
    primeAnimation();
    frame(350);
    expect(owner.scrollTop).toBe(0);
    readyState = "interactive";
    act(() => document.dispatchEvent(new Event("DOMContentLoaded")));
    finish();
    expect(owner.scrollTop).toBe(184);
  });

  it("waits for a hidden initial target to become measurable", async () => {
    ownerHidden = true;
    const owner = render("sidebar", "on-reload");
    const target = container.querySelector<HTMLElement>('a[aria-current="page"]')!;
    target.hidden = true;
    frame();
    expect(writes).toEqual([]);
    ownerHidden = false;
    await act(async () => {
      target.hidden = false;
      await Promise.resolve();
    });
    finish();
    expect(owner.scrollTop).toBe(184);
  });

  it("consumes an interrupted on-reload attempt even before its target appears", async () => {
    const owner = render("sidebar", "on-reload", "missing");
    primeAnimation();
    act(() => owner.dispatchEvent(new WheelEvent("wheel", { deltaY: 20, bubbles: true })));
    render("sidebar", "on-reload", "missing", ["a", "b", "last", "missing"]);
    await act(async () => { await Promise.resolve(); });
    finish();
    expect(owner.scrollTop).toBe(0);
    expect(writes).toEqual([]);
  });

  it("follows changing layout during its alignment and releases the item after completion", () => {
    const owner = render("sidebar", "on-reload");
    primeAnimation();
    frame(75);
    itemOffsets.a = 260;
    frame(75);
    finish();
    expect(owner.scrollTop).toBe(244);
    owner.scrollTop = 81;
    writes = [];
    itemOffsets.a = 280;
    render("sidebar", "on-reload");
    finish();
    expect(owner.scrollTop).toBe(81);
    expect(writes).toEqual([]);
  });

  it.each(["always", "on-reload"] as const)("Tabs preserves keyboard activation and focus with %s tracking", (mode) => {
    const setSelected = vi.fn();
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    act(() => root!.render(
      <div data-test-outer>
        <Tabs tabs={tabs} selected="a" setSelected={setSelected} scrollTracking={mode} />
      </div>,
    ));
    finish();
    expect(setSelected).not.toHaveBeenCalled();
    const list = container.querySelector<HTMLElement>('[role="tablist"]')!;
    act(() => list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true })));
    expect(setSelected).toHaveBeenCalledOnce();
    expect(setSelected).toHaveBeenCalledWith("b");
    expect(document.activeElement).toBe(container.querySelectorAll('[role="tab"]')[1]);
    if (mode === "always") expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    else expect(focus.mock.calls.at(-1)?.[0]?.preventScroll ?? false).toBe(false);
  });

  it("uses the project's nonlinear easing rather than a linear scroll", () => {
    const owner = render("sidebar", "always");
    primeAnimation();
    frame(75);
    // cubic-bezier(0.4, 0, 0.2, 1) reaches approximately 0.2366 at 25% time.
    expect(owner.scrollTop).toBeCloseTo(184 * 0.236587, 0);
    frame(75);
    expect(owner.scrollTop).toBeCloseTo(184 * 0.775561, 0);
    finish();
    expect(owner.scrollTop).toBe(184);
  });

  it("honors computed duration tokens expressed in seconds and a changed easing token", () => {
    durationToken = "0.6s";
    easingToken = "cubic-bezier(0, 0, 1, 1)";
    const owner = render("sidebar", "always");
    primeAnimation();
    frame(150);
    expect(owner.scrollTop).toBeCloseTo(46, 0);
    frame(150);
    expect(owner.scrollTop).toBeCloseTo(92, 0);
    frame(300);
    finish();
    expect(owner.scrollTop).toBe(184);
  });

  it("aligns without intermediate movement when reduced motion is requested", () => {
    reducedMotion = true;
    const owner = render("sidebar", "always");
    finish();
    expect(owner.scrollTop).toBe(184);
    expect(writes.filter((write) => write.axis === "top").every((write) => write.value === 184)).toBe(true);
  });

  it("temporarily suppresses native smooth scrolling and restores its value and priority on completion and interruption", () => {
    const owner = render("sidebar", "disabled");
    owner.style.setProperty("scroll-behavior", "smooth", "important");
    render("sidebar", "always");
    expect(owner.style.getPropertyValue("scroll-behavior")).toBe("auto");
    expect(owner.style.getPropertyPriority("scroll-behavior")).toBe("important");
    finish();
    expect(owner.style.getPropertyValue("scroll-behavior")).toBe("smooth");
    expect(owner.style.getPropertyPriority("scroll-behavior")).toBe("important");
    render("sidebar", "always", "b");
    primeAnimation();
    frame(75);
    expect(owner.style.getPropertyValue("scroll-behavior")).toBe("auto");
    act(() => owner.dispatchEvent(new WheelEvent("wheel", { deltaY: 20, bubbles: true })));
    expect(owner.style.getPropertyValue("scroll-behavior")).toBe("smooth");
    expect(owner.style.getPropertyPriority("scroll-behavior")).toBe("important");
    finish();
  });

  it("wheel input interrupts and consumes the initial on-reload attempt", () => {
    const owner = render("sidebar", "on-reload");
    primeAnimation();
    frame(75);
    const interrupted = owner.scrollTop;
    expect(interrupted).toBeGreaterThan(0);
    expect(interrupted).toBeLessThan(184);
    act(() => owner.dispatchEvent(new WheelEvent("wheel", { deltaY: 20, bubbles: true })));
    writes = [];
    finish();
    expect(owner.scrollTop).toBe(interrupted);
    expect(writes).toEqual([]);
    owner.scrollTop = 61;
    writes = [];
    render("sidebar", "on-reload", "b");
    finish();
    expect(owner.scrollTop).toBe(61);
    expect(writes).toEqual([]);
  });

  it.each([false, true])("always cancels the previous animation and follows the new item after wheel interruption=%s", (wheel) => {
    const owner = render("sidebar", "always");
    primeAnimation();
    frame(75);
    if (wheel) act(() => owner.dispatchEvent(new WheelEvent("wheel", { deltaY: 20, bubbles: true })));
    const interrupted = owner.scrollTop;
    render("sidebar", "always", "b");
    expect(owner.scrollTop).toBe(interrupted);
    finish();
    expect(owner.scrollTop).toBe(344);
  });

  it("cancels all scheduled writes when disabled or unmounted", () => {
    const owner = render("sidebar", "always");
    primeAnimation();
    frame(75);
    const interrupted = owner.scrollTop;
    render("sidebar", "disabled", "b");
    writes = [];
    finish();
    expect(owner.scrollTop).toBe(interrupted);
    expect(writes).toEqual([]);
    render("sidebar", "always", "b");
    primeAnimation();
    frame(75);
    act(() => root!.unmount());
    root = undefined;
    writes = [];
    finish();
    expect(writes).toEqual([]);
  });
});
