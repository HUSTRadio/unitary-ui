// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Button } from "../src/components/ui/button";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement, root: Root;
let callbacks: Map<number, FrameRequestCallback>;
beforeEach(() => {
  callbacks = new Map(); let id = 0;
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => { callbacks.set(++id, fn); return id; });
  vi.stubGlobal("cancelAnimationFrame", (key: number) => callbacks.delete(key));
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  document.documentElement.dataset.texture = "glass";
  host = document.createElement("div"); document.body.append(host); root = createRoot(host);
});
afterEach(() => { act(() => root.unmount()); host.remove(); delete document.documentElement.dataset.texture; vi.unstubAllGlobals(); });
function press(button: HTMLElement) {
  const event = new Event("pointerdown", { bubbles: true, cancelable: true });
  Object.assign(event, { button: 0, isPrimary: true, clientX: 5, clientY: 5 });
  act(() => button.dispatchEvent(event));
  act(() => { const batch = [...callbacks.values()]; callbacks.clear(); batch.forEach(fn => fn(0)); });
}
test("secondary contact preserves native events and author geometry without optical animation", () => {
  const action = vi.fn(); act(() => root.render(<Button type="secondary" onClick={action} style={{ transform: "rotate(2deg)" }}>Label</Button>));
  const button = host.querySelector("button")!; press(button);
  expect(button.hasAttribute("data-uni-glass-pressed")).toBe(false);
  expect(button.style.getPropertyValue("--_uni-glass-press")).toBe("");
  expect(callbacks.size).toBe(0);
  expect(button.style.transform).toBe("rotate(2deg)"); expect(action).not.toHaveBeenCalled();
  act(() => button.dispatchEvent(new Event("pointercancel", { bubbles: true })));
  expect(button.hasAttribute("data-uni-glass-pressed")).toBe(false); expect(callbacks.size).toBe(0);
});
test("author cancellation, disabled and primary controls retain their event contracts", () => {
  for (const props of [{ type: "secondary" as const, onPointerDown: (e: { preventDefault(): void }) => e.preventDefault() }, { type: "secondary" as const, disabled: true }, { type: "default" as const }]) {
    act(() => root.render(<Button {...props}>Label</Button>)); const button = host.querySelector("button")!; press(button);
    expect(button.hasAttribute("data-uni-glass-pressed")).toBe(false);
  }
});
test("author pointer cancellation remains observable without a glass event wrapper", () => {
  const cancel=vi.fn((event: {preventDefault():void})=>event.preventDefault());
  act(() => root.render(<Button type="secondary" onPointerDown={cancel}>Label</Button>));
  const event=new Event("pointerdown",{bubbles:true,cancelable:true});
  act(()=>host.querySelector("button")!.dispatchEvent(event));
  expect(cancel).toHaveBeenCalledOnce(); expect(event.defaultPrevented).toBe(true); expect(callbacks.size).toBe(0);
});
