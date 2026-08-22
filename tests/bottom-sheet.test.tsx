// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { BottomSheet, snapToDetent } from "../src/components/ui/bottom-sheet";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function renderSheet(node: React.ReactNode): string {
  // Radix Portal 在服务端渲染不产出内容，这里用 jsdom 客户端渲染后取 HTML 断言
  act(() => {
    root.render(node);
  });
  return document.body.innerHTML;
}

describe("BottomSheet", () => {
  it("snapToDetent 吸附到最近档位索引", () => {
    const detents = [0.5, 1];
    expect(snapToDetent(0.4, detents)).toBe(0);
    expect(snapToDetent(0.76, detents)).toBe(1);
    expect(snapToDetent(1.3, detents)).toBe(1);
    const three = [0.25, 0.5, 1];
    expect(snapToDetent(0.2, three)).toBe(0);
    expect(snapToDetent(0.6, three)).toBe(1);
  });

  it("automatic + 单 detent 不渲染 grabber", () => {
    const markup = renderSheet(
      <BottomSheet open detents={[1]}>
        <div>content</div>
      </BottomSheet>,
    );
    expect(markup).toContain('data-slot="bottom-sheet"');
    expect(markup).not.toContain('role="slider"');
  });

  it("automatic + 多 detent 渲染 grabber；showIndicator=false 强制隐藏", () => {
    const markup = renderSheet(
      <BottomSheet open>
        <div>content</div>
      </BottomSheet>,
    );
    expect(markup).toContain('role="slider"');

    const hidden = renderSheet(
      <BottomSheet open showIndicator={false}>
        <div>content</div>
      </BottomSheet>,
    );
    expect(hidden).not.toContain('role="slider"');
  });

  it("面板高度由 --sheet-h = detents[current]*100dvh 驱动", () => {
    renderSheet(
      <BottomSheet open detents={[0.5, 1]}>
        <div>content</div>
      </BottomSheet>,
    );
    const panel = document.querySelector('[data-slot="bottom-sheet"]') as HTMLElement;
    expect(panel.style.getPropertyValue("--sheet-h")).toBe("50dvh");
  });

  it("gestures.resize=false 不挂拖拽（无 data-resizable）", () => {
    renderSheet(
      <BottomSheet open gestures={{ resize: false }}>
        <div>content</div>
      </BottomSheet>,
    );
    const panel = document.querySelector('[data-slot="bottom-sheet"]')!;
    expect(panel.hasAttribute("data-resizable")).toBe(false);

    act(() => root.unmount());
    root = createRoot(container);
    renderSheet(
      <BottomSheet open>
        <div>content</div>
      </BottomSheet>,
    );
    const resizable = document.querySelector('[data-slot="bottom-sheet"]')!;
    expect(resizable.getAttribute("data-resizable")).toBe("true");
  });
});
