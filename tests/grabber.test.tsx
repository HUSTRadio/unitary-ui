// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Grabber } from "../src/components/ui/grabber";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
});

afterEach(() => {
  container.remove();
});

describe("Grabber", () => {
  it("renders vertical slider semantics + detent aria values + 官方视觉类", () => {
    const markup = renderToStaticMarkup(
      <Grabber detentCount={3} currentDetent={1} />,
    );

    // HIG-AUD-022：高度调节是垂直 slider，方向必须显式声明
    expect(markup).toContain('role="slider"');
    expect(markup).toContain('aria-orientation="vertical"');
    // HIG-AUD-008：key 由中文改为英文写法后，默认（无 Provider 回退 en）取值应为英文；
    // 中文站取值见 tests/framework-i18n.test.tsx
    expect(markup).toContain('aria-label="Resize height"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="2"');
    expect(markup).toContain('aria-valuenow="1"');
    // 视觉条：h-1 w-9 rounded-full；颜色 gray-700/dark:gray-600（WCAG ≥3:1 实测达标）
    expect(markup).toContain("h-1 w-9 rounded-full bg-gray-700 dark:bg-gray-600");
    // 命中区铺满面板，仅纵向外扩，不偏移视觉条水平中心
    expect(markup).toContain("block w-full");
    expect(markup).toContain("py-5 px-6 -my-5");
  });

  it("click 调用 onCycleDetent", async () => {
    const onCycleDetent = vi.fn();
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <Grabber detentCount={3} currentDetent={0} onCycleDetent={onCycleDetent} />,
      );
    });
    const button = container.querySelector("button")!;
    await act(async () => {
      button.click();
    });
    expect(onCycleDetent).toHaveBeenCalledTimes(1);
    await act(async () => {
      root.unmount();
    });
  });

  it.each<[string, number]>([
    ["ArrowUp", 2],
    ["ArrowRight", 2],
    ["ArrowDown", 0],
    ["ArrowLeft", 0],
    ["Home", 0],
    ["End", 2],
  ])("%s 移到目标档位并阻止页面滚动", async (key, expected) => {
    const onDetentChange = vi.fn();
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <Grabber
          detentCount={3}
          currentDetent={1}
          onDetentChange={onDetentChange}
        />,
      );
    });
    const button = container.querySelector("button")!;
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    await act(async () => {
      button.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(onDetentChange).toHaveBeenCalledWith(expected);
    await act(async () => root.unmount());
  });

  it.each<[number, string]>([
    [0, "ArrowDown"],
    [0, "ArrowLeft"],
    [0, "Home"],
    [2, "ArrowUp"],
    [2, "ArrowRight"],
    [2, "End"],
  ])("边界档位 %i 上的 %s 只阻止滚动、不重复上报", async (currentDetent, key) => {
    const onDetentChange = vi.fn();
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <Grabber
          detentCount={3}
          currentDetent={currentDetent as number}
          onDetentChange={onDetentChange}
        />,
      );
    });
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    await act(async () => {
      container.querySelector("button")!.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(onDetentChange).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });

  it("does not consume unrelated keys", async () => {
    const onDetentChange = vi.fn();
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <Grabber detentCount={3} currentDetent={1} onDetentChange={onDetentChange} />,
      );
    });
    const event = new KeyboardEvent("keydown", { key: "PageUp", bubbles: true, cancelable: true });
    await act(async () => {
      container.querySelector("button")!.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(false);
    expect(onDetentChange).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });
});
