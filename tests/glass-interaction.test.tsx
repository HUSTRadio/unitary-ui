// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Button, ButtonLink } from "../src/components/ui/button";
import { MotionPolicyProvider } from "../src/lib/motion-policy";
import { Switch, SwitchControl } from "../src/components/ui/switch";
import { Toggle } from "../src/components/ui/toggle";
import { Tabs } from "../src/components/ui/tabs";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement, root: Root;
let callbacks: Map<number, FrameRequestCallback>;
let reduced: boolean;
let motionListeners: Set<() => void>;

beforeEach(() => {
  callbacks = new Map();
  motionListeners = new Set();
  reduced = false;
  let id = 0;
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
    callbacks.set(++id, fn);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (key: number) => callbacks.delete(key));
  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() { return query === "(prefers-reduced-motion: reduce)" && reduced; },
    addEventListener(_event: string, listener: () => void) { motionListeners.add(listener); },
    removeEventListener(_event: string, listener: () => void) { motionListeners.delete(listener); },
  }));
  document.documentElement.dataset.texture = "glass";
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  delete document.documentElement.dataset.texture;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function pointer(element: HTMLElement, type: string, values: Record<string, unknown> = {}) {
  // React derives onPointerLeave from a bubbling pointerout event.
  const event = new Event(type === "pointerleave" ? "pointerout" : type, { bubbles: true, cancelable: true });
  Object.assign(event, { button: 0, isPrimary: true, clientX: 25, clientY: 10, pointerType: "mouse", ...values });
  act(() => element.dispatchEvent(event));
  return event;
}

function flushFrame() {
  act(() => {
    const batch = [...callbacks.values()];
    callbacks.clear();
    batch.forEach(fn => fn(0));
  });
}

function surface() {
  const element = host.querySelector<HTMLElement>("[data-uni-glass-interaction]")!;
  expect(element).not.toBeNull();
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 100, height: 40 } as DOMRect);
  return element;
}

const x = (element: HTMLElement) => element.style.getPropertyValue("--_uni-glass-pointer-x");
const y = (element: HTMLElement) => element.style.getPropertyValue("--_uni-glass-pointer-y");

test("direction is bounded and pointer moves share one animation frame and geometry read", () => {
  act(() => root.render(<Button type="secondary">Surface</Button>));
  const button = surface();
  pointer(button, "pointermove", { clientX: 10 });
  pointer(button, "pointermove", { clientX: 200, clientY: -20 });
  expect(callbacks.size).toBe(1);
  expect(button.getBoundingClientRect).not.toHaveBeenCalled();
  flushFrame();
  expect(x(button)).toBe("1");
  expect(y(button)).toBe("-1");
  expect(button.getBoundingClientRect).toHaveBeenCalledOnce();
  expect(callbacks.size).toBe(0);
});

test("contact freezes direction without moving the label, author transform, or native click", () => {
  const action = vi.fn();
  act(() => root.render(<Button type="secondary" onClick={action} style={{ transform: "rotate(2deg)" }}>Label</Button>));
  const button = surface();
  const label = button.querySelector("span");
  pointer(button, "pointerdown");
  flushFrame();
  expect(x(button)).toBe("-0.5");
  pointer(button, "pointermove", { clientX: 99 });
  expect(callbacks.size).toBe(0);
  expect(x(button)).toBe("-0.5");
  expect(button.style.transform).toBe("rotate(2deg)");
  expect(button.querySelector("span")).toBe(label);
  expect(button.hasAttribute("data-uni-glass-pressed")).toBe(false);
  expect(button.style.getPropertyValue("--_uni-glass-press")).toBe("");
  expect(action).not.toHaveBeenCalled();
  pointer(button, "pointerup", { clientX: 75 });
  flushFrame();
  expect(x(button)).toBe("0.5");
  act(() => button.click());
  expect(action).toHaveBeenCalledOnce();
});

test.each(["pointercancel", "pointerleave", "lostpointercapture", "focusout"])("%s clears contact and pending paint", (event) => {
  act(() => root.render(<Button type="secondary">Surface</Button>));
  const button = surface();
  pointer(button, "pointerdown");
  flushFrame();
  expect(x(button)).not.toBe("");
  pointer(button, event);
  expect(x(button)).toBe("");
  expect(y(button)).toBe("");
  expect(callbacks.size).toBe(0);
  pointer(button, "pointermove", { clientX: 75 });
  flushFrame();
  expect(x(button)).toBe("0.5");
});

test("author cancellation, disabled and primary controls do not schedule glint feedback", () => {
  for (const props of [
    { type: "secondary" as const, onPointerDown: (event: { preventDefault(): void }) => event.preventDefault() },
    { type: "secondary" as const, disabled: true },
    { type: "secondary" as const, loading: true },
    { type: "default" as const },
  ]) {
    act(() => root.render(<Button {...props}>Label</Button>));
    const button = host.querySelector("button")!;
    pointer(button, "pointerdown");
    expect(callbacks.size).toBe(0);
    expect(x(button)).toBe("");
  }
});

test("author handlers run before feedback and cancellation remains observable", () => {
  const cancel = vi.fn((event: { preventDefault(): void }) => event.preventDefault());
  act(() => root.render(<Button type="secondary" onPointerMove={cancel}>Label</Button>));
  const event = pointer(host.querySelector("button")!, "pointermove");
  expect(cancel).toHaveBeenCalledOnce();
  expect(event.defaultPrevented).toBe(true);
  expect(callbacks.size).toBe(0);
});

test("touch only responds to contact and keyboard contact is centered", () => {
  act(() => root.render(<Button type="secondary">Surface</Button>));
  const button = surface();
  pointer(button, "pointermove", { pointerType: "touch" });
  expect(callbacks.size).toBe(0);
  pointer(button, "pointerdown", { pointerType: "touch" });
  flushFrame();
  expect(x(button)).toBe("-0.5");
  pointer(button, "pointerup", { pointerType: "touch" });
  expect(x(button)).toBe("");
  act(() => button.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true })));
  flushFrame();
  expect(x(button)).toBe("0");
  expect(y(button)).toBe("0");
  act(() => button.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true })));
  expect(x(button)).toBe("");
  expect(callbacks.size).toBe(0);
});

test("links use Enter and ignore Space glint activation", () => {
  act(() => root.render(<ButtonLink type="secondary" href="#target">Destination</ButtonLink>));
  const link = surface();
  act(() => link.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true })));
  expect(callbacks.size).toBe(0);
  act(() => link.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
  flushFrame();
  expect(x(link)).toBe("0");
  expect(y(link)).toBe("0");
});

// A11Y-TEST-0047
test.skip("system and provider reduced motion clear pending state and suppress the marker", () => {
  act(() => root.render(<Button type="secondary">Surface</Button>));
  let button = surface();
  pointer(button, "pointermove");
  flushFrame();
  pointer(button, "pointermove", { clientX: 90 });
  act(() => { reduced = true; motionListeners.forEach(listener => listener()); });
  expect(button.hasAttribute("data-uni-glass-interaction")).toBe(false);
  expect(x(button)).toBe("");
  expect(callbacks.size).toBe(0);
  act(() => { reduced = false; motionListeners.forEach(listener => listener()); });
  button = host.querySelector("button")!;
  expect(button.hasAttribute("data-uni-glass-interaction")).toBe(true);
  act(() => root.render(<MotionPolicyProvider always><Button type="secondary">Static</Button></MotionPolicyProvider>));
  button = host.querySelector("button")!;
  expect(button.hasAttribute("data-uni-glass-interaction")).toBe(false);
  pointer(button, "pointerdown");
  expect(callbacks.size).toBe(0);
});

test("leaving Glass clears touched directions and unmount cancels the final frame", () => {
  act(() => root.render(<Button type="secondary">Surface</Button>));
  const button = surface();
  pointer(button, "pointermove");
  flushFrame();
  document.documentElement.dataset.texture = "aero";
  pointer(button, "pointermove");
  expect(x(button)).toBe("");
  expect(callbacks.size).toBe(0);
  document.documentElement.dataset.texture = "glass";
  pointer(button, "pointermove");
  expect(callbacks.size).toBe(1);
  act(() => root.render(null));
  expect(x(button)).toBe("");
  expect(callbacks.size).toBe(0);
});

test.each([{ phase: "pending", painted: false }, { phase: "painted", painted: true }])("disabling one Tab clears its $phase contact and restores tracking when enabled again", ({ painted }) => {
  const select = vi.fn();
  const render = (disabled: boolean) => act(() => root.render(<Tabs variant="secondary" ariaLabel="Views" selected="one" setSelected={select}
    tabs={[{ title: "One", value: "one", disabled }, { title: "Two", value: "two" }]} />));
  render(false);
  const button = surface();
  pointer(button, "pointerdown");
  if (painted) flushFrame();
  expect(button.hasAttribute("data-uni-glass-contact")).toBe(true);
  render(true);
  expect(host.querySelector('[role="tab"]')).toBe(button);
  expect(button.hasAttribute("disabled")).toBe(true);
  expect(button.hasAttribute("data-uni-glass-contact")).toBe(false);
  expect(x(button)).toBe("");
  expect(y(button)).toBe("");
  expect(callbacks.size).toBe(0);
  render(false);
  pointer(button, "pointermove", { clientX: 75 });
  flushFrame();
  expect(x(button)).toBe("0.5");
  expect(select).not.toHaveBeenCalled();
});

test("disabling one Tab preserves another Tab's queued direction", () => {
  const render = (disabled: boolean) => act(() => root.render(<Tabs variant="secondary" ariaLabel="Views" selected="one" setSelected={() => {}}
    tabs={[{ title: "One", value: "one", disabled }, { title: "Two", value: "two" }]} />));
  render(false);
  const first = surface();
  const second = host.querySelectorAll<HTMLButtonElement>('[role="tab"]')[1];
  vi.spyOn(second, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 100, height: 40 } as DOMRect);
  pointer(first, "pointerdown");
  flushFrame();
  pointer(second, "pointermove", { clientX: 75 });
  render(true);
  expect(first.hasAttribute("data-uni-glass-contact")).toBe(false);
  expect(callbacks.size).toBe(1);
  flushFrame();
  expect(x(first)).toBe("");
  expect(x(second)).toBe("0.5");
});

test("glint does not dispatch the removed document optical event bus", () => {
  const input = vi.fn(), state = vi.fn();
  document.addEventListener("unitary:glass-input", input);
  document.addEventListener("unitary:glass-state", state);
  try {
    act(() => root.render(<Button type="secondary">Surface</Button>));
    const button = surface();
    pointer(button, "pointermove");
    flushFrame();
    pointer(button, "pointerdown");
    flushFrame();
    act(() => root.render(null));
    expect(input).not.toHaveBeenCalled();
    expect(state).not.toHaveBeenCalled();
  } finally {
    document.removeEventListener("unitary:glass-input", input);
    document.removeEventListener("unitary:glass-state", state);
  }
});

test("authored control backgrounds retain their existing CSS ownership", () => {
  act(() => root.render(<><Switch name="authored"><SwitchControl label="Choice" value="one" className="bg-red-500 rounded-full" /></Switch><Toggle className="hover:bg-blue-500" aria-label="Toggle" /></>));
  const choice = host.querySelector('[data-slot="switch-control"]')!;
  const track = host.querySelector('[data-slot="toggle-track"]')!;
  expect(choice.classList.contains("bg-red-500")).toBe(true);
  expect(track.classList.contains("hover:bg-blue-500")).toBe(true);
  expect(choice.hasAttribute("data-uni-glass-surface")).toBe(false);
  expect(track.hasAttribute("data-uni-glass-surface")).toBe(false);
});
