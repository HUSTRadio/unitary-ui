// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, type ReactNode } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  initTheme,
  ThemeProvider,
  useTheme,
  type TexturePreference,
  type ThemeProviderProps,
} from "../src/lib/theme";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const STORAGE_KEY = "unitary-texture-preference";
const FORCED_QUERY = "(forced-colors: active)";
const REDUCED_QUERY = "(prefers-reduced-transparency: reduce)";

interface TestMedia {
  matches: boolean;
  listeners: Set<(event: MediaQueryListEvent) => void>;
  list: MediaQueryList;
}

let media: Map<string, TestMedia>;
let support: { backdrop: boolean; prefixedBackdrop: boolean; mix: boolean };
let container: HTMLDivElement;
let root: Root | undefined;
let currentTheme: ReturnType<typeof useTheme>;

function getMedia(query: string): TestMedia {
  let entry = media.get(query);
  if (!entry) {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    entry = {
      matches: false,
      listeners,
      list: {
        get matches() {
          return media.get(query)!.matches;
        },
        media: query,
        addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) =>
          listeners.add(listener),
        removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) =>
          listeners.delete(listener),
      } as unknown as MediaQueryList,
    };
    media.set(query, entry);
  }
  return entry;
}

function changeMedia(query: string, matches: boolean) {
  const entry = getMedia(query);
  entry.matches = matches;
  act(() => {
    for (const listener of entry.listeners) listener({ matches } as MediaQueryListEvent);
  });
}

function Probe() {
  currentTheme = useTheme();
  return <output>{`${currentTheme.texture}|${currentTheme.resolvedTexture}`}</output>;
}

function mount(props: Omit<ThemeProviderProps, "children"> = {}, children: ReactNode = <Probe />) {
  root = createRoot(container);
  act(() => root!.render(<ThemeProvider {...props}>{children}</ThemeProvider>));
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-texture");
  document.documentElement.removeAttribute("data-texture-preference");
  media = new Map();
  support = { backdrop: true, prefixedBackdrop: true, mix: true };
  vi.stubGlobal("matchMedia", (query: string) => getMedia(query).list);
  vi.stubGlobal("CSS", {
    supports: (property: string) => {
      if (property === "backdrop-filter") return support.backdrop;
      if (property === "-webkit-backdrop-filter") return support.prefixedBackdrop;
      return support.mix;
    },
  });
  container = document.createElement("div");
  document.body.append(container);
});

afterEach(() => {
  if (root) act(() => root!.unmount());
  root = undefined;
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("global texture preference", () => {
  test("defaults to Solid and preserves color preference independently", () => {
    window.localStorage.setItem("unitary-theme-preference", "dark");
    mount();
    expect(currentTheme.texture).toBe("solid");
    expect(currentTheme.resolvedTexture).toBe("solid");
    expect(currentTheme.resolvedTheme).toBe("dark");
    act(() => currentTheme.setTexture("glass"));
    expect(document.documentElement.dataset.texture).toBe("glass");
    expect(document.documentElement.dataset.theme).toBe("dark");
    act(() => currentTheme.setPreference("light"));
    expect(currentTheme.texture).toBe("glass");
    expect(document.documentElement.dataset.texture).toBe("glass");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  test("stored valid uncontrolled preference wins over default without an implicit storage write", () => {
    window.localStorage.setItem(STORAGE_KEY, "glass");
    const write = vi.spyOn(Storage.prototype, "setItem");
    mount({ defaultTexture: "hybrid" });
    expect(container.textContent).toBe("glass|glass");
    expect(write).not.toHaveBeenCalled();
    const callback = vi.fn();
    act(() => root!.render(<ThemeProvider defaultTexture="solid" onTextureChange={callback}><Probe /></ThemeProvider>));
    expect(currentTheme.texture).toBe("glass");
    act(() => currentTheme.setTexture("hybrid"));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("hybrid");
    expect(callback).toHaveBeenCalledWith("hybrid");
  });

  test("invalid stored preference falls back to the supplied default", () => {
    window.localStorage.setItem(STORAGE_KEY, "iridescent");
    mount({ defaultTexture: "hybrid" });
    expect(container.textContent).toBe("hybrid|hybrid");
  });

  test("controlled requests call the owner without persisting or applying until props change", () => {
    window.localStorage.setItem(STORAGE_KEY, "hybrid");
    const callback = vi.fn();
    mount({ texture: "solid", onTextureChange: callback });
    act(() => currentTheme.setTexture("glass"));
    expect(callback).toHaveBeenCalledWith("glass");
    expect(currentTheme.texture).toBe("solid");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("hybrid");
    act(() => root!.render(<ThemeProvider texture="glass" onTextureChange={callback}><Probe /></ThemeProvider>));
    expect(container.textContent).toBe("glass|glass");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("hybrid");
  });

  test("nested providers inherit the root texture and route changes to the root owner", () => {
    const owner = vi.fn();
    const nested = vi.fn();
    mount({ texture: "glass", onTextureChange: owner },
      <ThemeProvider texture="solid" defaultTexture="hybrid" onTextureChange={nested}><Probe /></ThemeProvider>,
    );
    expect(container.textContent).toBe("glass|glass");
    expect(getMedia(FORCED_QUERY).listeners.size).toBe(1);
    expect(getMedia(REDUCED_QUERY).listeners.size).toBe(1);
    act(() => currentTheme.setTexture("hybrid"));
    expect(owner).toHaveBeenCalledWith("hybrid");
    expect(nested).not.toHaveBeenCalled();
    expect(document.documentElement.dataset.texture).toBe("glass");
  });

  test("rejects invalid supplied preferences and setter values", () => {
    expect(() => renderToString(<ThemeProvider texture={"bad" as TexturePreference}><Probe /></ThemeProvider>)).toThrow(TypeError);
    expect(() => renderToString(<ThemeProvider defaultTexture={"bad" as TexturePreference}><Probe /></ThemeProvider>)).toThrow(TypeError);
    mount();
    expect(() => currentTheme.setTexture("bad" as TexturePreference)).toThrow(TypeError);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  test("storage failure is non-fatal and in-memory texture still changes", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    mount({ defaultTexture: "hybrid" });
    expect(currentTheme.texture).toBe("hybrid");
    act(() => currentTheme.setTexture("glass"));
    expect(container.textContent).toBe("glass|glass");
  });

  test("uncontrolled preferences synchronize storage changes and clear", () => {
    mount({ defaultTexture: "hybrid" });
    window.localStorage.setItem(STORAGE_KEY, "glass");
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: "glass" })));
    expect(currentTheme.texture).toBe("glass");
    window.localStorage.clear();
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: null })));
    expect(currentTheme.texture).toBe("hybrid");
  });
});

describe("texture environment resolution", () => {
  test.each([FORCED_QUERY, REDUCED_QUERY])("%s falls back globally and restores the retained request", (query) => {
    mount({ defaultTexture: "glass" });
    changeMedia(query, true);
    expect(container.textContent).toBe("glass|solid");
    expect(document.documentElement.dataset.texture).toBe("solid");
    expect(document.documentElement.dataset.texturePreference).toBe("glass");
    changeMedia(query, false);
    expect(container.textContent).toBe("glass|glass");
  });

  test.each(["backdrop", "mix"])("missing %s support keeps the request but resolves solid", (feature) => {
    if (feature === "backdrop") support.backdrop = support.prefixedBackdrop = false;
    else support.mix = false;
    mount({ texture: "glass" });
    expect(container.textContent).toBe("glass|solid");
    expect(document.documentElement.dataset.texturePreference).toBe("glass");
  });

  test("prefixed backdrop filtering can satisfy the capability boundary", () => {
    support.backdrop = false;
    mount({ texture: "hybrid" });
    expect(container.textContent).toBe("hybrid|hybrid");
  });

  test("unmount removes accessibility and storage listeners", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    mount();
    act(() => root!.unmount());
    root = undefined;
    expect(getMedia(FORCED_QUERY).listeners.size).toBe(0);
    expect(getMedia(REDUCED_QUERY).listeners.size).toBe(0);
    expect(remove).toHaveBeenCalledWith("storage", expect.any(Function));
  });
});

describe("texture first paint and SSR", () => {
  test.each(["solid", "hybrid", "glass"] as const)("initTheme applies the canonical %s preference", (texture) => {
    window.localStorage.setItem(STORAGE_KEY, texture);
    initTheme();
    expect(document.documentElement.dataset.texturePreference).toBe(texture);
    expect(document.documentElement.dataset.texture).toBe(texture);
  });

  test("SSR returns deterministic solid resolution without browser globals", () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("document", undefined);
    expect(renderToString(<ThemeProvider defaultTexture="glass"><Probe /></ThemeProvider>)).toContain("glass|solid");
    expect(() => initTheme()).not.toThrow();
  });

  test("hydrates without mismatch, then adopts persisted texture", async () => {
    window.localStorage.setItem(STORAGE_KEY, "glass");
    container.innerHTML = renderToString(<ThemeProvider><Probe /></ThemeProvider>);
    expect(container.textContent).toBe("solid|solid");
    const recover = vi.fn();
    await act(async () => {
      root = hydrateRoot(container, <ThemeProvider><Probe /></ThemeProvider>, { onRecoverableError: recover });
    });
    expect(recover).not.toHaveBeenCalled();
    expect(container.textContent).toBe("glass|glass");
  });

  test("initTheme applies stored texture and accessibility fallback", () => {
    window.localStorage.setItem(STORAGE_KEY, "glass");
    getMedia(REDUCED_QUERY).matches = true;
    initTheme();
    expect(document.documentElement.dataset.texturePreference).toBe("glass");
    expect(document.documentElement.dataset.texture).toBe("solid");
  });

  test.each(["index.html", "docs/index.html"].flatMap(file =>
    ["solid", "hybrid", "glass"].map(texture => [file, texture]),
  ))("%s boots %s even when color storage reads fail", (file, texture) => {
    const html = readFileSync(path.join(process.cwd(), file), "utf8");
    const scripts = Array.from(html.matchAll(/<script>([\s\S]*?)<\/script>/g), (match) => match[1]);
    const storage = {
      getItem: (key: string) => {
        if (key === STORAGE_KEY) return texture;
        throw new Error("color storage unavailable");
      },
    };
    for (const script of scripts) {
      new Function("document", "localStorage", "matchMedia", "CSS", script)(document, storage, window.matchMedia, window.CSS);
    }
    expect(document.documentElement.dataset.texture).toBe(texture);
    expect(document.documentElement.dataset.texturePreference).toBe(texture);
  });
});
