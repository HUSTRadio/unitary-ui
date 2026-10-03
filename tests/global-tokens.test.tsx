// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getToken,
  getTokens,
  setToken,
  setTokens,
  resetToken,
  resetTokens,
  subscribeTokens,
  useTokens,
} from "../src/lib/tokens";
import { RUNTIME_TOKEN_NAMES, type RuntimeTokenName } from "../src/lib/token-catalog";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  document.documentElement.removeAttribute("style");
  document.documentElement.removeAttribute("class");
});

describe("global token API", () => {
  it("reads and writes global and scoped values without changing unrelated styles", () => {
    document.documentElement.style.color = "red";
    expect(setToken("--radius", " 8px ")).toBe(true);
    expect(getToken("--radius")).toBe("8px");
    setTokens(
      { "--radius": "16px", "--uni-duration-fast": "500ms" },
      { target: host, priority: "important" },
    );
    expect(getTokens(["--radius", "--uni-duration-fast"], { target: host })).toEqual({
      "--radius": "16px",
      "--uni-duration-fast": "500ms",
    });
    expect(host.style.getPropertyPriority("--radius")).toBe("important");
    expect(getToken("--radius")).toBe("8px");
    resetToken("--radius");
    expect(document.documentElement.style.getPropertyValue("--radius")).toBe("");
    expect(document.documentElement.style.color).toBe("red");
    resetTokens(undefined, { target: host });
    expect(host.style.getPropertyValue("--radius")).toBe("");
    expect(Object.keys(getTokens())).toEqual(RUNTIME_TOKEN_NAMES);
  });

  it("validates an entire batch before applying any part", () => {
    setToken("--radius", "4px");
    expect(() => setTokens({ "--radius": "8px", "--unknown": "x" } as never)).toThrow(TypeError);
    expect(getToken("--radius")).toBe("4px");
    expect(() => setTokens({ "--radius": "8px", "--uni-duration-fast": "" })).toThrow(TypeError);
    expect(getToken("--radius")).toBe("4px");
    expect(() => setToken("--radius", "8px !important")).toThrow(TypeError);
    expect(() => setToken("--radius", "8px", { priority: "wrong" } as never)).toThrow(TypeError);
    expect(() => getToken("--unknown" as never)).toThrow(TypeError);
    expect(() => resetTokens(["--radius", "--unknown"] as never)).toThrow(TypeError);
    expect(getToken("--radius")).toBe("4px");
  });

  it("rejects build mappings and supports an explicit unmounted target", () => {
    expect(() => setToken("--radius-lg" as RuntimeTokenName, "16px")).toThrow(/Build-time mapping/);
    expect(setToken("--radius", "8px", { target: null })).toBe(false);
    expect(resetToken("--radius", { target: null })).toBe(false);
    expect(getToken("--radius", { target: null })).toBe("");
    expect(document.documentElement.style.getPropertyValue("--radius")).toBe("");
  });

  it("rejects breakpoint writes and resets without partially mutating runtime values", () => {
    setToken("--radius", "4px");
    document.documentElement.style.setProperty("--breakpoint-grid-md", "60rem");
    expect(getToken("--breakpoint-grid-md")).toBe("60rem");
    expect(() => setToken("--breakpoint-grid-md" as never, "100rem")).toThrow(/Build-time mapping/);
    expect(() => setTokens({ "--radius": "8px", "--breakpoint-grid-md": "100rem" } as never)).toThrow(
      /Build-time mapping/,
    );
    expect(() => resetTokens(["--radius", "--breakpoint-grid-md"] as never)).toThrow(/Build-time mapping/);
    expect(getToken("--radius")).toBe("4px");
    expect(getToken("--breakpoint-grid-md")).toBe("60rem");
  });

  it("subscribes to relevant ancestor changes and releases all listeners", async () => {
    const listener = vi.fn();
    const off = subscribeTokens(listener, { target: host });
    setToken("--radius", "8px");
    expect(listener).toHaveBeenCalled();
    await Promise.resolve();
    listener.mockClear();
    document.documentElement.classList.add("dark");
    await Promise.resolve();
    expect(listener).toHaveBeenCalledOnce();
    listener.mockClear();
    const sibling = document.createElement("div");
    document.body.append(sibling);
    sibling.style.color = "red";
    await Promise.resolve();
    expect(listener).not.toHaveBeenCalled();
    off();
    setToken("--radius", "16px");
    window.dispatchEvent(new Event("resize"));
    await Promise.resolve();
    expect(listener).not.toHaveBeenCalled();
    sibling.remove();
  });

  it("keeps React snapshots stable and follows changing scopes and selected names", async () => {
    const snapshots: object[] = [];
    function Value({ scoped = false, motion = false }) {
      const values = useTokens(motion ? ["--uni-duration-fast"] : ["--radius"], {
        target: scoped ? host : undefined,
      });
      snapshots.push(values);
      return <output>{Object.values(values).join(",")}</output>;
    }
    setToken("--radius", "8px");
    act(() => root.render(<Value />));
    const first = snapshots.at(-1);
    await act(async () => {
      setToken("--radius", "8px");
    });
    expect(snapshots.at(-1)).toBe(first);
    await act(async () => {
      setToken("--radius", "16px");
    });
    expect(host.textContent).toBe("16px");
    setToken("--radius", "2px", { target: host });
    act(() => root.render(<Value scoped />));
    expect(host.textContent).toBe("2px");
    await act(async () => {
      host.style.setProperty("--radius", "3px");
    });
    expect(host.textContent).toBe("3px");
    setToken("--uni-duration-fast", "500ms", { target: host });
    act(() => root.render(<Value scoped motion />));
    expect(host.textContent).toBe("500ms");
    expect(Object.isFrozen(snapshots.at(-1))).toBe(true);
  });
});
