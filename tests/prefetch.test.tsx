// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Prefetch, usePrefetchState } from "../src/components/ui/prefetch";
import { createPrefetch } from "../src/lib/prefetch";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement;
let root: Root;
beforeEach(() => { host = document.createElement("div"); document.body.append(host); root = createRoot(host); });
afterEach(() => { act(() => root.unmount()); host.remove(); vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); });
async function render(node: React.ReactNode) { await act(async () => { root.render(node); }); }
async function pointer(type: string, pointerType = "mouse") {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  await act(async () => { host.querySelector("button")!.dispatchEvent(event); });
}

describe("Prefetch", () => {
  test("preserves children, keyboard semantics and click handlers with asChild", async () => {
    const loader = vi.fn(() => "data");
    const click = vi.fn();
    const resource = createPrefetch(loader);
    await render(<Prefetch resource={resource} asChild><button onClick={click}>Open</button></Prefetch>);
    expect(host.children).toHaveLength(1);
    expect(loader).not.toHaveBeenCalled();
    await act(async () => { host.querySelector("button")!.focus(); });
    expect(loader).toHaveBeenCalledTimes(1);
    await act(async () => { host.querySelector("button")!.click(); });
    expect(click).toHaveBeenCalledTimes(1);
    expect(host.firstElementChild?.getAttribute("data-state")).toBe("ready");
  });

  test("mouse intent and touch press use the same cached resource", async () => {
    const loader = vi.fn(() => "data");
    const resource = createPrefetch(loader);
    await render(<Prefetch resource={resource}><button>Open</button></Prefetch>);
    await pointer("pointerover", "touch");
    expect(loader).not.toHaveBeenCalled();
    await pointer("pointerdown", "touch");
    await pointer("pointerover");
    expect(loader).toHaveBeenCalledTimes(1);
  });

  test("honors prevented consumer intent handlers", async () => {
    const loader = vi.fn(() => "data");
    await render(<Prefetch resource={createPrefetch(loader)} asChild>
      <button onPointerEnter={(event) => event.preventDefault()}>Open</button>
    </Prefetch>);
    await pointer("pointerover");
    expect(loader).not.toHaveBeenCalled();
  });

  test("disabled suppresses automatic work while load remains available", async () => {
    const loader = vi.fn(() => "data");
    const resource = createPrefetch(loader);
    await render(<Prefetch resource={resource} disabled><button>Open</button></Prefetch>);
    await pointer("pointerover");
    expect(loader).not.toHaveBeenCalled();
    await act(async () => { await resource.load(); });
    expect(loader).toHaveBeenCalledTimes(1);
  });

  test("respects data saver with an explicit opt-out", async () => {
    const descriptor = Object.getOwnPropertyDescriptor(navigator, "connection");
    Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
    try {
      const loader = vi.fn(() => "data");
      const resource = createPrefetch(loader);
      await render(<Prefetch resource={resource}><button>Open</button></Prefetch>);
      await pointer("pointerover");
      expect(loader).not.toHaveBeenCalled();
      await render(<Prefetch resource={resource} respectDataSaver={false}><button>Open</button></Prefetch>);
      await pointer("pointerover");
      expect(loader).toHaveBeenCalledTimes(1);
    } finally {
      if (descriptor) Object.defineProperty(navigator, "connection", descriptor);
      else Reflect.deleteProperty(navigator, "connection");
    }
  });

  test("missing observer and idle APIs fall back to a cancellable timer", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("IntersectionObserver", undefined);
    vi.stubGlobal("requestIdleCallback", undefined);
    const loader = vi.fn(() => "data");
    await render(<Prefetch trigger="viewport" resource={createPrefetch(loader)}>Target</Prefetch>);
    await act(async () => { await vi.advanceTimersByTimeAsync(199); });
    expect(loader).not.toHaveBeenCalled();
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(loader).toHaveBeenCalledTimes(1);
  });

  test("idle scheduling is cancelled on unmount and late callbacks do nothing", async () => {
    let callback!: IdleRequestCallback;
    const cancel = vi.fn();
    vi.stubGlobal("requestIdleCallback", vi.fn((next) => { callback = next; return 4; }));
    vi.stubGlobal("cancelIdleCallback", cancel);
    const loader = vi.fn(() => "data");
    await render(<Prefetch trigger="idle" resource={createPrefetch(loader)}><button>Open</button></Prefetch>);
    await render(null);
    expect(cancel).toHaveBeenCalledWith(4);
    await act(async () => { callback({ didTimeout: false, timeRemaining: () => 50 }); });
    expect(loader).not.toHaveBeenCalled();
  });

  test("viewport targets respect intersection thresholds and release the observer", async () => {
    let callback!: IntersectionObserverCallback;
    let options: IntersectionObserverInit | undefined;
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", class {
      constructor(next: IntersectionObserverCallback, value: IntersectionObserverInit) { callback = next; options = value; }
      observe = vi.fn(); disconnect = disconnect;
    });
    const loader = vi.fn(() => "data");
    await render(<Prefetch trigger="viewport" threshold={0.5} resource={createPrefetch(loader)}>Visible target</Prefetch>);
    expect(options).toEqual({ root: null, rootMargin: "200px", threshold: 0.5 });
    await act(async () => { callback([{ isIntersecting: true, intersectionRatio: 0.2 }] as IntersectionObserverEntry[], {} as IntersectionObserver); });
    expect(loader).not.toHaveBeenCalled();
    await act(async () => { callback([{ isIntersecting: true, intersectionRatio: 0.5 }] as IntersectionObserverEntry[], {} as IntersectionObserver); });
    expect(loader).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalled();
  });

  test("server rendering never starts work and supplies a stable idle snapshot", () => {
    const loader = vi.fn(() => "data");
    const resource = createPrefetch(loader);
    function Status() { return <output>{usePrefetchState(resource).status}</output>; }
    expect(renderToString(<Prefetch resource={resource} trigger="idle"><Status /></Prefetch>)).toContain("idle");
    expect(loader).not.toHaveBeenCalled();
  });

  test("unmount preserves in-flight work for another consumer", async () => {
    let finish!: (value: string) => void;
    let signal!: AbortSignal;
    const loader = vi.fn((next: AbortSignal) => {
      signal = next;
      return new Promise<string>((resolve) => { finish = resolve; });
    });
    const resource = createPrefetch(loader);
    await render(<Prefetch resource={resource}><button>Open</button></Prefetch>);
    await pointer("pointerover");
    const shared = resource.load();
    await render(null);
    expect(signal.aborted).toBe(false);
    await render(<Prefetch resource={resource}><button>Another consumer</button></Prefetch>);
    await pointer("pointerover");
    expect(resource.load()).toBe(shared);
    await act(async () => { finish("shared"); await shared; });
    expect(loader).toHaveBeenCalledTimes(1);
    expect(host.firstElementChild?.getAttribute("data-state")).toBe("ready");
  });
});
