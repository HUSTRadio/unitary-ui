// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ExpandPanel } from "../src/components/ui/expand-panel";

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

function renderPanel(node: React.ReactNode): HTMLElement {
  // Radix Portal 在服务端渲染不产出内容，这里用 jsdom 客户端渲染后取 DOM 断言
  act(() => {
    root.render(node);
  });
  return document.querySelector('[data-slot="expand-panel"]') as HTMLElement;
}

describe("ExpandPanel", () => {
  it("四方向定位矩阵：top 只下圆角 + 锚点变量 top 偏移", () => {
    const top = renderPanel(<ExpandPanel side="top" open />);
    expect(top.getAttribute("data-side")).toBe("top");
    expect(top.className).toContain("top-[var(--expand-anchor-bottom,64px)]");
    expect(top.className).toContain("inset-x-0");
    expect(top.className).toContain("bottom-auto");
    expect(top.className).toContain("rounded-b-overlay");
    expect(top.className).not.toContain("rounded-t");

    const left = renderPanel(<ExpandPanel side="left" open />);
    expect(left.className).toContain("fixed left-0 inset-y-0");
    expect(left.className).toContain("rounded-r-overlay");
    expect(left.className).toContain("-translate-x-full");

    const right = renderPanel(<ExpandPanel side="right" open />);
    expect(right.className).toContain("fixed right-0 inset-y-0");
    expect(right.className).toContain("rounded-l-overlay");
    expect(right.className).toContain("translate-x-full");

    const bottom = renderPanel(<ExpandPanel side="bottom" open />);
    expect(bottom.className).toContain("fixed inset-x-0 bottom-0");
    expect(bottom.className).toContain("rounded-t-overlay");
    expect(bottom.className).toContain("translate-y-full");
  });

  it("open 状态切换 transform 到 translate-y/x-0", () => {
    const panel = renderPanel(<ExpandPanel side="bottom" open />);
    expect(panel.className).toContain("data-[state=open]:translate-y-0");
    expect(panel.getAttribute("data-state")).toBe("open");
  });

  it("anchorElement 注入 --expand-anchor-bottom（anchor 底边）并锁定宽度", () => {
    const anchor = document.createElement("div");
    document.body.append(anchor);
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () =>
        ({ bottom: 64, left: 12, width: 320, top: 0, right: 332 }) as DOMRect,
    });

    const panel = renderPanel(
      <ExpandPanel side="top" open anchorElement={anchor} />,
    );
    expect(panel.style.getPropertyValue("--expand-anchor-bottom")).toBe("64px");
    expect(panel.style.getPropertyValue("--expand-anchor-width")).toBe("320px");
    expect(panel.style.top).toBe("64px");
    expect(panel.style.width).toBe("320px");
    anchor.remove();
  });

  it("maxHeight 默认 side=top→100dvh；maxWidth 默认横向→80vw，可覆盖", () => {
    const top = renderPanel(<ExpandPanel side="top" open />);
    expect(top.style.maxHeight).toBe("100dvh");

    const left = renderPanel(<ExpandPanel side="left" open />);
    expect(left.style.maxWidth).toBe("80vw");
    expect(left.style.maxHeight).toBe("");

    const custom = renderPanel(
      <ExpandPanel side="top" open maxHeight="300px" maxWidth="50vw" />,
    );
    expect(custom.style.maxHeight).toBe("300px");
    expect(custom.style.maxWidth).toBe("50vw");
  });

  it("遮罩 bg-black/40 + z-[var(--ds-z-drawer)]；面板 shadow-lg + 动画曲线类", () => {
    renderPanel(<ExpandPanel side="top" open aria-label="menu" />);
    const overlay = document.querySelector(
      '[data-slot="expand-panel"] ~ [data-radix-popper-content-wrapper] ~ *, [role="dialog"]',
    );
    void overlay;
    const markup = document.body.innerHTML;
    expect(markup).toContain("bg-black/40");
    expect(markup).toContain("z-[var(--ds-z-drawer)]");
    const panel = document.querySelector('[data-slot="expand-panel"]')!;
    expect(panel.className).toContain("shadow-lg");
    expect(panel.className).toContain("duration-500");
    expect(panel.className).toContain("ease-[cubic-bezier(0.32,0.72,0,1)]");
    expect(panel.className).toContain("motion-reduce:!transition-none");
    expect(panel.getAttribute("aria-label")).toBe("menu");
  });
});
