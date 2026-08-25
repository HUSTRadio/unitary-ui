// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resolveInputModality, useInputModality } from "./input-modality";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

type MediaState = Record<string, boolean>;

interface TrackedMql {
  matches: boolean;
  media: string;
  onchange: null;
  addEventListener: (type: "change", cb: () => void) => void;
  removeEventListener: (type: "change", cb: () => void) => void;
  addListener: (cb: () => void) => void;
  removeListener: (cb: () => void) => void;
  dispatchEvent: () => boolean;
}

function stubMatchMedia(state: MediaState) {
  const changeListeners = new Set<() => void>();
  const mql = (query: string): TrackedMql => ({
    get matches() {
      return state[query] ?? false;
    },
    media: query,
    onchange: null,
    addEventListener: (type, cb) => {
      if (type === "change") changeListeners.add(cb as () => void);
    },
    removeEventListener: (type, cb) => {
      if (type === "change") changeListeners.delete(cb as () => void);
    },
    addListener: (cb) => changeListeners.add(cb),
    removeListener: (cb) => changeListeners.delete(cb),
    dispatchEvent: () => false,
  });
  return {
    mql,
    /** 触发所有已注册的 change 监听（模拟二合一笔记本折叠/展开） */
    emitChange() {
      for (const listener of [...changeListeners]) listener();
    },
    listenerCount() {
      return changeListeners.size;
    },
    install() {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: vi.fn(mql),
      });
    },
  };
}

const TOUCH_UAS = [
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36",
];
const DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36";

let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("resolveInputModality", () => {
  it("pointer:coarse → touch（最高优先级信号）", () => {
    const stub = stubMatchMedia({ "(pointer: coarse)": true });
    stub.install();
    expect(resolveInputModality()).toBe("touch");
  });

  it("pointer:fine → pointer", () => {
    const stub = stubMatchMedia({ "(pointer: fine)": true });
    stub.install();
    expect(resolveInputModality()).toBe("pointer");
  });

  it("两个 pointer 查询都未命中但 hover:none → touch", () => {
    const stub = stubMatchMedia({ "(hover: none)": true });
    stub.install();
    expect(resolveInputModality()).toBe("touch");
  });

  it.each(TOUCH_UAS)("查询全部未命中 + touch UA（%s）→ 兜底 touch", (userAgent) => {
    const stub = stubMatchMedia({});
    stub.install();
    vi.stubGlobal("navigator", { userAgent });
    try {
      expect(resolveInputModality()).toBe("touch");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("查询全部未命中 + 桌面 UA → 默认 pointer", () => {
    const stub = stubMatchMedia({});
    stub.install();
    vi.stubGlobal("navigator", { userAgent: DESKTOP_UA });
    try {
      expect(resolveInputModality()).toBe("pointer");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("matchMedia 整体不可用 → 走 UA 兜底而非抛错", () => {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: undefined });
    vi.stubGlobal("navigator", { userAgent: TOUCH_UAS[2] });
    try {
      expect(resolveInputModality()).toBe("touch");
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("useInputModality", () => {
  it("SSR / 首帧默认 pointer，useEffect 后解析真实模态", async () => {
    const stub = stubMatchMedia({ "(pointer: coarse)": true });
    stub.install();

    let rendered: string[] = [];
    function Probe() {
      const modality = useInputModality();
      rendered.push(modality);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Probe));
    });

    expect(rendered[0]).toBe("pointer"); // hydration-safe 默认值
    expect(rendered.at(-1)).toBe("touch"); // effect 后按 matchMedia 解析
  });

  it("matchMedia change 监听触发后模态平滑切换，无需刷新", async () => {
    const state = { "(pointer: fine)": true };
    const stub = stubMatchMedia(state);
    stub.install();

    let latest = "";
    function Probe() {
      latest = useInputModality();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Probe));
    });
    expect(latest).toBe("pointer");

    // 二合一笔记本折叠：主指针由 fine 变为 coarse
    state["(pointer: fine)"] = false;
    state["(pointer: coarse)"] = true;
    await act(async () => {
      stub.emitChange();
    });
    expect(latest).toBe("touch");
  });

  it("卸载时移除 change 监听（cleanup）", async () => {
    const stub = stubMatchMedia({});
    stub.install();

    function Probe() {
      useInputModality();
      return null;
    }
    await act(async () => {
      root.render(React.createElement(Probe));
    });
    expect(stub.listenerCount()).toBeGreaterThan(0);

    act(() => root.unmount());
    container.remove();
    expect(stub.listenerCount()).toBe(0);
  });
});
