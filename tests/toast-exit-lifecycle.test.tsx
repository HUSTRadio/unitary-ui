// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import { Toasts, createToastStore, type ToastRecord, type ToastStore } from "../src/components/ui/toast";
import { Carousel } from "../src/components/ui/carousel";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const host = document.createElement("div");
let root: ReturnType<typeof createRoot>;
afterEach(() => { act(() => root?.unmount()); host.remove(); vi.restoreAllMocks(); });
function render(node: React.ReactNode) {
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => root.render(node));
}

test("a store without mounted viewports has no fixed exit residency", async () => {
  const store = createToastStore(), id = store.success("Done");
  store.dismiss(id);
  expect(store.getSnapshot()[0].exiting).toBe(true);
  await Promise.resolve();
  expect(store.getSnapshot()).toEqual([]);
});

test("custom stores own exiting snapshots and may reverse an exit", async () => {
  const listeners = new Set<() => void>();
  let records: ToastRecord[] = [{ id: 1, kind: "message", text: "External", preserve: true }];
  const api = createToastStore();
  const store: ToastStore = {
    ...api, getSnapshot: () => records,
    subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    dismiss: vi.fn(),
  };
  render(<Toasts store={store} />);
  const publish = async (exiting: boolean) => {
    await act(async () => { records = [{ ...records[0], exiting }]; listeners.forEach(listener => listener()); });
  };
  await publish(true);
  expect(host.querySelector("li")?.hasAttribute("data-exiting")).toBe(true);
  expect(store.getSnapshot()).toBe(records);
  expect(store.dismiss).not.toHaveBeenCalled();
  await publish(false);
  expect(host.querySelector("li")?.style.opacity).toBe("");
  expect(host.querySelector("li")?.hasAttribute("data-exiting")).toBe(false);
});

test("Carousel preserves its public DOM ref while owning animation state", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(<Carousel ref={ref} variant="fade" images={[{ src: "/one.svg", alt: "One" }]} />);
  expect(ref.current).toBe(host.querySelector('[data-slot="carousel"]'));
  act(() => root.unmount());
  expect(ref.current).toBeNull();
});
