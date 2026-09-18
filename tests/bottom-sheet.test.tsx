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

  it("弹出/收起有真实动画：animate-in/out 触发器 + 底部位移 + 300ms snap 曲线", () => {
    const markup = renderSheet(
      <BottomSheet open>
        <div>content</div>
      </BottomSheet>,
    );
    // 触发器（tw-animate-css）：缺 animate-in/animate-out 时 slide-* 变量不生效
    expect(markup).toContain("data-[state=open]:animate-in");
    expect(markup).toContain("data-[state=closed]:animate-out");
    // 底部进出位移变量 + 与拖拽吸附一致的 300ms cubic-bezier(0.32,0.72,0,1)
    expect(markup).toContain("data-[state=open]:slide-in-from-bottom");
    expect(markup).toContain("data-[state=closed]:slide-out-to-bottom");
    expect(markup).toContain("duration-300");
    expect(markup).toContain("var(--ease-snap)");
    // reduced-motion 归零（WCAG 2.3.3）
    expect(markup).toContain("motion-reduce:animate-none");
  });

  it("顶部圆角用 --radius-overlay token（与 CommandMenu 移动端 sheet 同族）", () => {
    const markup = renderSheet(
      <BottomSheet open>
        <div>content</div>
      </BottomSheet>,
    );
    expect(markup).toContain("rounded-t-overlay");
    expect(markup).not.toContain("rounded-t-xl");
  });

  it("受控弹层关闭后把焦点归还给外部触发器", async () => {
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open sheet</button>
          <BottomSheet open={open} onOpenChange={setOpen}>
            <button type="button">Sheet action</button>
          </BottomSheet>
        </>
      );
    }

    act(() => root.render(<Harness />));
    const trigger = container.querySelector<HTMLButtonElement>("button")!;
    trigger.focus();
    act(() => trigger.click());
    const action = document.querySelector<HTMLButtonElement>('[data-slot="bottom-sheet"] button:not([role="slider"])')!;
    expect(action).toBeTruthy();
    act(() => action.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    await act(async () => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))));
    expect(document.activeElement).toBe(trigger);
  });

  it("拖拽方向跟手：向下拉面板变矮、向上拉增高（顶缘跟随手指）", () => {
    renderSheet(
      <BottomSheet open detents={[0.5, 1]}>
        <div>content</div>
      </BottomSheet>,
    );
    const panel = document.querySelector('[data-slot="bottom-sheet"]') as HTMLElement;
    // jsdom 无 Pointer Capture API
    panel.setPointerCapture = () => {};
    const ratioOf = () => parseFloat(panel.style.getPropertyValue("--sheet-h"));

    // 起始 0.5（50dvh）：向下拖 100px → 高度变小（顶缘随手指下移）
    act(() => panel.dispatchEvent(new MouseEvent("pointerdown", { clientY: 384, bubbles: true })));
    act(() =>
      panel.dispatchEvent(new MouseEvent("pointermove", { clientY: 484, bubbles: true })),
    );
    expect(ratioOf()).toBeCloseTo(50 - (100 / window.innerHeight) * 100, 5);
    act(() => panel.dispatchEvent(new MouseEvent("pointerup", { bubbles: true })));

    // 再次按下向上拖 100px → 高度变大（展开更高档）
    act(() => panel.dispatchEvent(new MouseEvent("pointerdown", { clientY: 484, bubbles: true })));
    act(() =>
      panel.dispatchEvent(new MouseEvent("pointermove", { clientY: 384, bubbles: true })),
    );
    expect(ratioOf()).toBeCloseTo(50 + (100 / window.innerHeight) * 100, 5);
    act(() => panel.dispatchEvent(new MouseEvent("pointerup", { bubbles: true })));
  });
});
