// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

  it("detent 受控：只上报不改档，跟随外部传值（HIG-AUD-018）", () => {
    const onDetentChange = vi.fn();
    const sheet = (detent: number) => (
      <BottomSheet detents={[0.5, 1]} detent={detent} onDetentChange={onDetentChange} open>
        <div>content</div>
      </BottomSheet>
    );
    const grabber = () => document.querySelector<HTMLElement>('[role="slider"]')!;

    renderSheet(sheet(0));
    expect(grabber().getAttribute("aria-valuenow")).toBe("0");

    // 点击切档：受控态下只上报 onDetentChange，内部不得自行改档
    act(() => grabber().click());
    expect(onDetentChange).toHaveBeenCalledWith(1);
    expect(grabber().getAttribute("aria-valuenow")).toBe("0");

    // 外部把 detent 改成 1 → 组件跟随（且不再重复上报）
    act(() => root.render(sheet(1)));
    expect(grabber().getAttribute("aria-valuenow")).toBe("1");
    expect(onDetentChange).toHaveBeenCalledTimes(1);

    // 越界传值钳到合法档位：否则 detents[out-of-range] 为 undefined、面板高度崩
    act(() => root.render(sheet(9)));
    expect(grabber().getAttribute("aria-valuenow")).toBe("1");
  });

  it("键盘调档：非受控态同步 slider、高度与回调", () => {
    const onDetentChange = vi.fn();
    renderSheet(
      <BottomSheet open detents={[0.25, 0.5, 1]} onDetentChange={onDetentChange}>
        <div>content</div>
      </BottomSheet>,
    );
    const panel = document.querySelector<HTMLElement>('[data-slot="bottom-sheet"]')!;
    const grabber = panel.querySelector<HTMLElement>('[role="slider"]')!;

    act(() => {
      grabber.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    });
    expect(grabber.getAttribute("aria-valuenow")).toBe("2");
    expect(panel.style.getPropertyValue("--sheet-h")).toBe("100dvh");
    expect(onDetentChange).toHaveBeenLastCalledWith(2);

    act(() => {
      grabber.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });
    expect(grabber.getAttribute("aria-valuenow")).toBe("1");
    expect(panel.style.getPropertyValue("--sheet-h")).toBe("50dvh");
    expect(onDetentChange).toHaveBeenLastCalledWith(1);
  });

  it("键盘调档：受控态只上报，外部回灌后才更新", () => {
    const onDetentChange = vi.fn();
    const sheet = (detent: number) => (
      <BottomSheet open detents={[0.5, 1]} detent={detent} onDetentChange={onDetentChange}>
        <div>content</div>
      </BottomSheet>
    );
    const grabber = () => document.querySelector<HTMLElement>('[role="slider"]')!;
    const panel = () => document.querySelector<HTMLElement>('[data-slot="bottom-sheet"]')!;

    renderSheet(sheet(0));
    act(() => {
      grabber().dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    });
    expect(onDetentChange).toHaveBeenCalledWith(1);
    expect(grabber().getAttribute("aria-valuenow")).toBe("0");
    expect(panel().style.getPropertyValue("--sheet-h")).toBe("50dvh");

    act(() => root.render(sheet(1)));
    expect(grabber().getAttribute("aria-valuenow")).toBe("1");
    expect(panel().style.getPropertyValue("--sheet-h")).toBe("100dvh");
    expect(onDetentChange).toHaveBeenCalledTimes(1);
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

  it("弹出/收起有真实动画：animate-in/out 触发器 + 底部位移 + overlay 档 snap 曲线", () => {
    const markup = renderSheet(
      <BottomSheet open>
        <div>content</div>
      </BottomSheet>,
    );
    // 触发器（tw-animate-css）：缺 animate-in/animate-out 时 slide-* 变量不生效
    expect(markup).toContain("data-[state=open]:animate-in");
    expect(markup).toContain("data-[state=closed]:animate-out");
    // 底部进出位移变量 + 与拖拽吸附一致的 overlay 档 + cubic-bezier(0.32,0.72,0,1)
    // （HIG-AUD-012：原 300ms 字面量迁至 --uni-motion-overlay）
    expect(markup).toContain("data-[state=open]:slide-in-from-bottom");
    expect(markup).toContain("data-[state=closed]:slide-out-to-bottom");
    expect(markup).toContain("duration-(--uni-motion-overlay)");
    expect(markup).toContain("var(--ease-snap)");
    // reduced-motion 归零（WCAG 2.3.3）
    expect(markup).toContain("motion-reduce:animate-none!");
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

  it("HIG-AUD-040：aria-label / aria-labelledby 透传到面板 Content", () => {
    renderSheet(
      <BottomSheet open aria-label="Share">
        <div>content</div>
      </BottomSheet>,
    );
    const panel = document.querySelector('[data-slot="bottom-sheet"]')!;
    expect(panel.getAttribute("aria-label")).toBe("Share");
    expect(panel.hasAttribute("aria-labelledby")).toBe(false);

    act(() => root.unmount());
    root = createRoot(container);
    renderSheet(
      <BottomSheet open aria-labelledby="sheet-title">
        <h2 id="sheet-title">Title</h2>
      </BottomSheet>,
    );
    const labelled = document.querySelector('[data-slot="bottom-sheet"]')!;
    expect(labelled.getAttribute("aria-labelledby")).toBe("sheet-title");
    // 关联目标真实存在于 DOM（IDREF 可解析）
    expect(document.getElementById("sheet-title")).not.toBeNull();
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
    const grabber = panel.querySelector<HTMLElement>('[data-slot="grabber"]')!;
    // jsdom 无 Pointer Capture API
    grabber.setPointerCapture = () => {};
    const ratioOf = () => parseFloat(panel.style.getPropertyValue("--sheet-h"));

    // 起始 0.5（50dvh）：向下拖 100px → 高度变小（顶缘随手指下移）
    act(() => grabber.dispatchEvent(new MouseEvent("pointerdown", { clientY: 24, bubbles: true })));
    act(() =>
      grabber.dispatchEvent(new MouseEvent("pointermove", { clientY: 124, bubbles: true })),
    );
    expect(ratioOf()).toBeCloseTo(50 - (100 / window.innerHeight) * 100, 5);
    act(() => grabber.dispatchEvent(new MouseEvent("pointerup", { bubbles: true })));

    // 再次按下向上拖 100px → 高度变大（展开更高档）
    act(() => grabber.dispatchEvent(new MouseEvent("pointerdown", { clientY: 124, bubbles: true })));
    act(() =>
      grabber.dispatchEvent(new MouseEvent("pointermove", { clientY: 24, bubbles: true })),
    );
    expect(ratioOf()).toBeCloseTo(50 + (100 / window.innerHeight) * 100, 5);
    act(() => grabber.dispatchEvent(new MouseEvent("pointerup", { bubbles: true })));
  });

  it("拖拽手势只挂 grabber：面板内容区的按钮 click 不被 pointer capture 吞掉", () => {
    const source = readFileSync(
      path.join(process.cwd(), "src/components/ui/bottom-sheet.tsx"),
      "utf8",
    );
    expect(source).toContain("onPointerDown={handleGrabberPointerDown}");
    // 回归保护：旧实现把手势挂在面板 Content 上，setPointerCapture 将 pointerup
    // 重定向到面板，浏览器不再给内容区按钮派发 click（Close Actions 曾因此失效）
    expect(source).not.toContain("onPointerDown={handlePointerDown}");
  });

  it("HIG-AUD-003：从面板内容区起手的指针拖动不改高度（手势只认 grabber）", () => {
    renderSheet(
      <BottomSheet open detents={[0.5, 1]}>
        <div data-testid="sheet-scroller" style={{ overflowY: "auto" }}>
          <ul>
            {Array.from({ length: 50 }, (_, index) => (
              <li key={index}>Row {index}</li>
            ))}
          </ul>
        </div>
      </BottomSheet>,
    );
    const panel = document.querySelector('[data-slot="bottom-sheet"]') as HTMLElement;
    const scroller = panel.querySelector<HTMLElement>('[data-testid="sheet-scroller"]')!;
    const ratioOf = () => parseFloat(panel.style.getPropertyValue("--sheet-h"));
    const before = ratioOf();

    // 手指从列表中部上滑：面板高度必须保持不变（内部滚动才是这段手势的归属）
    act(() => {
      scroller.dispatchEvent(new MouseEvent("pointerdown", { clientY: 300, bubbles: true }));
    });
    act(() => {
      scroller.dispatchEvent(new MouseEvent("pointermove", { clientY: 120, bubbles: true }));
    });
    act(() => {
      scroller.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
    });

    expect(ratioOf()).toBe(before);
    expect(panel.style.transition).toContain("height");
  });
});
