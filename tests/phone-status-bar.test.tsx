// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Device } from "@/components/ui/device";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
HTMLElement.prototype.scrollIntoView = vi.fn();

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(node: React.ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(node));
}

function queryStatusBar(): HTMLElement {
  return container.querySelector('[data-slot="phone-status-bar"]')!;
}

describe("Phone status bar × Dynamic Island alignment (HIG)", () => {
  test("iPhone 17 支持的 chrome 不产生误报警告", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(
      <Device model="iphone-17" dynamicIsland statusBar safari>
        <div />
      </Device>,
    );

    expect(warn).not.toHaveBeenCalled();
  });

  test("不支持 iOS chrome 的设备仍会在开发环境告警", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(
      <Device model="pixel-10" statusBar={true as never}>
        <div />
      </Device>,
    );

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('model="pixel-10" 不支持 "status-bar"'));
  });

  test("dynamicIsland=true：容器与库岛同轴（屏幕坐标 top-[10px] = 外框 22 − bezel 12，h-[29px]，去掉 pt 校正）", () => {
    mount(
      <Device model="iphone-17" dynamicIsland>
        <div />
      </Device>,
    );
    const bar = queryStatusBar();
    expect(bar.className).toContain("top-[10px]");
    expect(bar.className).toContain("h-[29px]");
    // pt 校正只服务于无岛的 54px 几何，开岛后必须移除
    expect(bar.className).not.toContain("pt-[13px]");
    // 错误参照系（外框 22px 直接用于屏幕层）不得回归
    expect(bar.className).not.toContain("top-[22px]");
  });

  test("island=false（默认）：维持现状 54px 几何零回归", () => {
    mount(
      <Device model="iphone-17">
        <div />
      </Device>,
    );
    const bar = queryStatusBar();
    expect(bar.className).toContain("top-0");
    expect(bar.className).toContain("h-[54px]");
    // pt-13：时间字号 15→17px（行盒 +2px）后重校准，维持原几何中心 21.5px
    expect(bar.className).toContain("pt-[13px]");
    expect(bar.className).not.toContain("top-[10px]");
    expect(bar.className).not.toContain("h-[29px]");
  });

  test("时间 17px/font-semibold 对齐 iOS 官方（SF Pro Semibold 17pt），保留 leading-none", () => {
    mount(
      <Device model="iphone-17">
        <div />
      </Device>,
    );
    const time = queryStatusBar().querySelector<HTMLElement>(".phone-status-time")!;
    expect(time.className).toContain("text-[17px]");
    expect(time.className).toContain("font-semibold");
    expect(time.className).not.toContain("font-bold");
    expect(time.className).toContain("leading-none");
    // 冒号独立 token：消费 --font-metric-colon 做光学对齐（HarmonyOS Sans 冒号偏下）
    const colon = time.querySelector<HTMLElement>(".phone-status-colon")!;
    expect(colon).not.toBeNull();
    expect(colon.textContent).toBe(":");
  });

  test("状态内容水平边距按 iOS 实测校准：左 27px / 右 22px（不对称，两种模式一致）", () => {
    for (const island of [true, false]) {
      mount(
        <Device model="iphone-17" dynamicIsland={island}>
          <div />
        </Device>,
      );
      const bar = queryStatusBar();
      expect(bar.className).toContain("pl-[27px]");
      expect(bar.className).toContain("pr-[22px]");
      expect(bar.className).not.toContain("px-[27px]");
    }
  });
});
