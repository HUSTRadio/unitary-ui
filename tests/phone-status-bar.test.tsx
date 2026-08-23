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
  test("dynamicIsland=true：容器改为岛中心对齐几何（top-11/h-37，去掉 pt 校正）", () => {
    mount(
      <Device model="iphone-17" dynamicIsland>
        <div />
      </Device>,
    );
    const bar = queryStatusBar();
    expect(bar.className).toContain("top-[11px]");
    expect(bar.className).toContain("h-[37px]");
    // pt 校正只服务于无岛的 54px 几何，开岛后必须移除
    expect(bar.className).not.toContain("pt-[14px]");
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
    expect(bar.className).toContain("pt-[14px]");
    expect(bar.className).not.toContain("top-[11px]");
    expect(bar.className).not.toContain("h-[37px]");
  });

  test("时间文字加粗为 font-bold，保留 15px/tabular 字号链与 leading-none", () => {
    mount(
      <Device model="iphone-17">
        <div />
      </Device>,
    );
    const time = queryStatusBar().querySelector<HTMLElement>(".phone-status-time")!;
    expect(time.className).toContain("font-bold");
    expect(time.className).not.toContain("font-semibold");
    expect(time.className).toContain("text-[15px]");
    expect(time.className).toContain("leading-none");
  });

  test("状态内容水平边距校准为 px-[27px]（两种模式一致）", () => {
    for (const island of [true, false]) {
      mount(
        <Device model="iphone-17" dynamicIsland={island}>
          <div />
        </Device>,
      );
      const bar = queryStatusBar();
      expect(bar.className).toContain("px-[27px]");
      expect(bar.className).not.toContain("px-[30px]");
    }
  });
});
