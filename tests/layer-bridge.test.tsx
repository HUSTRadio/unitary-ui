// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withLayerBridge } from "../src/lib/layer-bridge";
import { LayerScope } from "../src/components/ui/layer";
import { setToken } from "../src/lib/tokens";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let root: Root, host: HTMLElement, renders: number;
let frames: Map<number, FrameRequestCallback>, nextFrame: number;
const Primitive = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  renders++;
  return <div data-radix-popper-content-wrapper=""><div {...props} data-test="content" ref={ref} /></div>;
});
const Bridged = withLayerBridge(Primitive);
beforeEach(() => {
  host = document.createElement("div"); document.body.append(host); root = createRoot(host);
  renders = 0; frames = new Map(); nextFrame = 0;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => { frames.set(++nextFrame, callback); return nextFrame; });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(id => { frames.delete(id); });
});
afterEach(async () => {
  await act(async () => root.unmount()); document.body.replaceChildren(); document.documentElement.removeAttribute("style"); vi.restoreAllMocks();
});
const render = async (children: React.ReactNode) => { await act(async () => root.render(children)); };
const flush = async () => {
  const pending = [...frames.values()]; frames.clear();
  await act(async () => { pending.forEach(callback => callback(16)); });
};
const wrapper = () => host.querySelector<HTMLElement>("[data-radix-popper-content-wrapper]")!;

describe("LayerBridge lifecycle and live stacking", () => {
  it("does not force an extra primitive render merely to subscribe its ref", async () => {
    const reads = vi.spyOn(window, "getComputedStyle");
    await render(<Bridged style={{ zIndex: 2001 }} />);
    expect(renders).toBe(1);
    expect(reads).not.toHaveBeenCalled();
    expect(frames.size).toBe(1);
    await flush();
    expect(wrapper().style.zIndex).toBe("2001");
    expect(reads).toHaveBeenCalledTimes(1);
  });
  it("retains a pending initial sync across same-node ref replacement before paint", async () => {
    const first = vi.fn(), second = vi.fn(), reads = vi.spyOn(window, "getComputedStyle");
    await render(<Bridged ref={first} style={{ zIndex: 2001 }} />);
    const node = host.querySelector('[data-test="content"]');
    await render(<Bridged ref={second} style={{ zIndex: 2001 }} />);
    expect(host.querySelector('[data-test="content"]')).toBe(node);
    expect(first).toHaveBeenLastCalledWith(null);
    expect(second).toHaveBeenLastCalledWith(node);
    expect(reads).not.toHaveBeenCalled();
    expect(frames.size).toBe(1);
    await flush();
    expect(wrapper().style.zIndex).toBe("2001");
    expect(reads).toHaveBeenCalledTimes(1);
  });
  it("coalesces separate style invalidations before paint and retains the latest author level", async () => {
    await render(<Bridged style={{ zIndex: 2001 }} />);
    const reads = vi.spyOn(window, "getComputedStyle");
    host.style.color = "red"; await Promise.resolve();
    host.style.color = "blue"; await Promise.resolve();
    host.querySelector<HTMLElement>('[data-test="content"]')!.style.zIndex = "3010"; await Promise.resolve();
    expect(reads).not.toHaveBeenCalled();
    await flush();
    expect(wrapper().style.zIndex).toBe("3010");
    expect(reads).toHaveBeenCalledTimes(1);
  });
  it("retains a mounted node subscription when only the forwarded ref identity changes", async () => {
    const first = vi.fn(), second = vi.fn();
    await render(<Bridged ref={first} style={{ zIndex: 2001 }} />);
    const node = host.querySelector('[data-test="content"]');
    const reads = vi.spyOn(window, "getComputedStyle");
    await render(<Bridged ref={second} style={{ zIndex: 2001 }} />);
    expect(host.querySelector('[data-test="content"]')).toBe(node);
    expect(first).toHaveBeenLastCalledWith(null);
    expect(second).toHaveBeenLastCalledWith(node);
    expect(reads).not.toHaveBeenCalled();
  });
  it("retains token notifications, scope updates and author style precedence", async () => {
    const view = (level: number) => <LayerScope levels={{ popover: level }}><Bridged style={{ zIndex: 3010 }} /></LayerScope>;
    await render(view(2100));
    const node = host.querySelector<HTMLElement>('[data-test="content"]')!;
    await render(view(2200));
    expect(node.style.getPropertyValue("--uni-z-popover")).toBe("2200");
    setToken("--uni-z-popover", "2300"); await flush();
    expect(wrapper().style.zIndex).toBe("3010");
  });
  it("synchronizes final transition/animation values and cancels queued work on unmount", async () => {
    await render(<Bridged style={{ zIndex: 2001 }} />);
    const node = host.querySelector<HTMLElement>('[data-test="content"]')!;
    node.style.zIndex = "3100";
    for (const name of ["transitionend", "transitioncancel", "animationend"]) node.dispatchEvent(new Event(name));
    await flush(); expect(wrapper().style.zIndex).toBe("3100");
    node.dispatchEvent(new Event("transitionend"));
    await render(null);
    expect(frames.size).toBe(0);
    const reads = vi.spyOn(window, "getComputedStyle");
    setToken("--uni-z-popover", "3300"); await flush();
    expect(reads).not.toHaveBeenCalled();
  });
  it("cleans StrictMode refs and forwards React callback cleanup exactly once per attachment", async () => {
    const cleanup = vi.fn(), ref = vi.fn(() => cleanup);
    await render(<React.StrictMode><Bridged ref={ref} style={{ zIndex: 2001 }} /></React.StrictMode>);
    const attachments = ref.mock.calls.length;
    expect(attachments).toBeGreaterThan(0);
    await render(null);
    expect(cleanup).toHaveBeenCalledTimes(attachments);
    expect(frames.size).toBe(0);
  });
});
