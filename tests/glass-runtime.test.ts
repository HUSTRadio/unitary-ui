// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { acquireGlassRuntime } from "../src/lib/glass-runtime";

let frames: Map<number, FrameRequestCallback>;
let frameId: number;
let decode: Array<{ resolve: () => void; reject: () => void }>;
let holdDecode: boolean;
let encodes: ReturnType<typeof vi.fn<() => string>>;
let releases: Array<() => void>;
let listeners: Set<EventListenerOrEventListenerObject>;
let resizeTargets: Set<Element>;

async function flush() {
  for (let turn = 0; turn < 12; turn++) {
    await new Promise(resolve => setTimeout(resolve, 0));
    const batch = [...frames.values()]; frames.clear();
    for (const callback of batch) callback(performance.now());
  }
}

function surface(className = "material-menu", attributes: Record<string, string> = {}) {
  const node = document.createElement("div"); node.className = className;
  node.style.cssText = "width:120px;height:80px;border-radius:12px";
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  Object.defineProperties(node, {
    offsetWidth: { get: () => Number.parseFloat(node.style.width) },
    offsetHeight: { get: () => Number.parseFloat(node.style.height) },
  });
  document.body.append(node); return node;
}

function acquire() {
  const release = acquireGlassRuntime(document); releases.push(release); return release;
}

beforeEach(() => {
  document.body.replaceChildren(); frames = new Map(); frameId = 0; decode = [];
  releases = []; listeners = new Set(); resizeTargets = new Set(); holdDecode = false;
  vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue("Chrome/151.0.0.0");
  vi.stubGlobal("CSS", { supports: () => true });
  // Wall-clock scheduling is covered in real browsers; unit raster work stays deterministic.
  vi.spyOn(window.performance, "now").mockReturnValue(0);
  vi.stubGlobal("FileReader", class {
    result = "data:image/png;base64,cG5n";
    onload?: () => void;
    readAsDataURL() { queueMicrotask(() => this.onload?.()); }
  });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++frameId, callback); return frameId; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: (_name: string, callback: EventListenerOrEventListenerObject) => listeners.add(callback),
    removeEventListener: (_name: string, callback: EventListenerOrEventListenerObject) => listeners.delete(callback),
  }));
  vi.stubGlobal("ResizeObserver", class {
    observe(node: Element) { resizeTargets.add(node); }
    unobserve(node: Element) { resizeTargets.delete(node); }
    disconnect() { resizeTargets.clear(); }
  });
  vi.stubGlobal("Image", class {
    src = "";
    decode() {
      if (!holdDecode) return Promise.resolve();
      return new Promise<void>((resolve, reject) => decode.push({ resolve, reject: () => reject(new Error("decode blocked")) }));
    }
  });
  encodes = vi.fn(() => "data:image/png;base64,probe");
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(encodes);
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(callback => { encodes(); callback(new Blob(["png"], { type:"image/png" })); });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => ({
    clearRect() {}, fillRect() {}, fillStyle: "white", putImageData: vi.fn(),
    getImageData: () => ({ data: new Uint8ClampedArray([255, 255, 255, 255]) }),
    createImageData: (width: number, height: number) => ({ data: new Uint8ClampedArray(width * height * 4) }),
  }) as unknown as CanvasRenderingContext2D);
  vi.spyOn(window, "getComputedStyle").mockImplementation((element: Element) => {
    const node = element as HTMLElement;
    return {
      width: node.style.width || "120px", height: node.style.height || "80px",
      borderTopLeftRadius: "12px", borderTopRightRadius: "12px", borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px",
      filter: "none", clipPath: "none", opacity: "1", color: "rgb(255, 255, 255)",
      getPropertyValue(name: string) {
        for (let current: HTMLElement | null = node; current; current = current.parentElement) {
          const value = current.style.getPropertyValue(name); if (value) return value;
        }
        return "";
      },
    } as CSSStyleDeclaration;
  });
});

afterEach(async () => {
  for (const release of releases) release();
  for (const pending of decode) pending.resolve();
  await Promise.resolve(); vi.restoreAllMocks(); vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe("Glass runtime resources", () => {
  test.each(["class", "role", "type"])("releases a connected surface after its %s identity changes", async identity => {
    const node = identity === "class" ? surface() : identity === "role"
      ? surface("", { "data-material": "floating" })
      : surface("bg-background-100", { "data-uni-button": "", "data-type": "secondary" });
    acquire(); await flush(); expect(node.dataset.uniGlassRenderer).toBe("svg");
    if (identity === "class") node.className = "";
    if (identity === "role") node.dataset.material = "content";
    if (identity === "type") node.dataset.type = "primary";
    await flush();
    expect(node.isConnected).toBe(true); expect(node.dataset.uniGlassRenderer).toBeUndefined();
    expect(node.style.getPropertyValue("--_uni-glass-paint")).toBe("");
    expect(node.style.getPropertyValue("--_uni-glass-backdrop")).toBe("");
    expect(resizeTargets.has(node)).toBe(false);
    expect(document.querySelectorAll("[data-uni-glass-defs] filter")).toHaveLength(0);
  });

  test("concurrent equal surfaces encode one map/paint pair and share one filter", async () => {
    const nodes = Array.from({ length: 12 }, () => surface()); acquire(); await flush();
    expect(nodes.every(node => node.dataset.uniGlassRenderer === "svg")).toBe(true);
    expect(encodes).toHaveBeenCalledTimes(2);
    expect(document.querySelectorAll("[data-uni-glass-defs] filter")).toHaveLength(1);
    nodes.slice(0, 11).forEach(node => node.remove()); await flush();
    expect(nodes[11].dataset.uniGlassRenderer).toBe("svg");
    expect(document.querySelectorAll("[data-uni-glass-defs] filter")).toHaveLength(1);
    nodes[11].remove(); await flush();
    expect(document.querySelectorAll("[data-uni-glass-defs] filter")).toHaveLength(0);
  });

  test("decode cancellation cannot publish stale optics or cancel another consumer", async () => {
    holdDecode = true; const cancelled = surface(), retained = surface(); acquire(); await flush();
    cancelled.className = ""; await flush();
    for (const pending of decode) pending.resolve(); await flush();
    expect(cancelled.dataset.uniGlassRenderer).toBeUndefined();
    expect(retained.dataset.uniGlassRenderer).toBe("svg");
    expect(encodes).toHaveBeenCalledTimes(2);
  });

  test("all cancelled consumers leave no filter after decode finishes", async () => {
    holdDecode = true; const node = surface(); acquire(); await flush();
    node.dataset.material = "content"; node.className = ""; await flush();
    for (const pending of decode) pending.resolve(); await flush();
    expect(node.dataset.uniGlassRenderer).toBeUndefined();
    expect(document.querySelectorAll("[data-uni-glass-defs] filter")).toHaveLength(0);
  });

  test("a failed shared decode can retry on the next invalidation", async () => {
    holdDecode = true; const node = surface(); acquire(); await flush();
    for (const pending of decode) pending.reject(); await flush();
    expect(node.dataset.uniGlassRenderer).toBeUndefined();
    holdDecode = false; node.classList.add("retry"); await flush();
    expect(node.dataset.uniGlassRenderer).toBe("svg");
  });

  test("different parameter keys never share a filter", async () => {
    const one = surface(), two = surface(); two.style.setProperty("--material-texture-glass-opacity", "82%");
    acquire(); await flush(); expect(encodes).toHaveBeenCalledTimes(4);
    expect(one.style.getPropertyValue("--_uni-glass-backdrop")).not.toBe(two.style.getPropertyValue("--_uni-glass-backdrop"));
  });

  test("equivalent resolved theme colors retain identical optical paint", async () => {
    const one = surface(), two = surface();
    one.style.setProperty("--material-texture-base", "#123");
    two.style.setProperty("--material-texture-base", "rgb(17, 34, 51)");
    acquire(); await flush();
    const rasters = vi.mocked(HTMLCanvasElement.prototype.getContext).mock.results
      .map(result => result.value as CanvasRenderingContext2D)
      .filter(context => vi.mocked(context.putImageData).mock.calls.length);
    expect(rasters).toHaveLength(2);
    const paints = rasters.map(context => vi.mocked(context.putImageData).mock.calls[1][0].data);
    expect(paints[0]).toEqual(paints[1]);
    expect(paints[0].some(channel => channel > 0 && channel < 255)).toBe(true);
  });

  test("batches full invalidations while retaining global CSS/token changes", async () => {
    const node = surface(); acquire(); await flush();
    const query = vi.spyOn(document, "querySelectorAll"); query.mockClear();
    document.dispatchEvent(new CustomEvent("unitary:tokens-change"));
    document.dispatchEvent(new Event("transitionend"));
    document.dispatchEvent(new Event("animationend"));
    document.documentElement.style.setProperty("--material-texture-glass-opacity", "60%");
    await flush();
    expect(query.mock.calls.filter(([selector]) => String(selector).includes("material-menu")).length, JSON.stringify(query.mock.calls)).toBe(1);
    expect(encodes).toHaveBeenCalledTimes(4); expect(node.dataset.uniGlassRenderer).toBe("svg");
    document.documentElement.style.removeProperty("--material-texture-glass-opacity");
  });

  test("multiple roots keep one manager until the final release", async () => {
    surface(); const first = acquire(), second = acquire(); await flush();
    expect(document.querySelectorAll("[data-uni-glass-defs]")).toHaveLength(1); expect(listeners.size).toBe(1);
    first(); releases = releases.filter(release => release !== first); await flush();
    expect(document.querySelectorAll("[data-uni-glass-defs]")).toHaveLength(1);
    second(); releases = []; await flush();
    expect(document.querySelectorAll("[data-uni-glass-defs]")).toHaveLength(0);
    expect(listeners.size).toBe(0); expect(resizeTargets.size).toBe(0); expect(frames.size).toBe(0);
    acquire(); await flush(); expect(document.querySelectorAll("[data-uni-glass-defs]")).toHaveLength(1);
  });
});
