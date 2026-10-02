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
    expect(left.className).toContain("transition-[translate,clip-path]");
    expect(left.className).toContain("data-[motion-state=open]:translate-x-0");

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
    expect(panel.className).toContain("data-[motion-state=open]:translate-y-0");
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

  // 回归（用户实测 2026-09-28，docs 站 App Shell 页）：side=top 的面板此前沿用
  // -translate-y-full + slide-in-from-top，动画期间整体上移一个面板高度、从容器
  // （乃至文档）顶部掉下来掠过 topbar；遮罩 inset-0 又把 topbar 压暗。锚点形态改为
  // 「顶边固定在锚点底边 + clip-path 向下展开」，遮罩同界。
  it("side=top + anchorElement：顶边贴锚点底边、遮罩同界且不做整体位移", () => {
    const anchor = document.createElement("div");
    document.body.append(anchor);
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ bottom: 64, left: 0, width: 400, top: 0, right: 400 }) as DOMRect,
    });

    const panel = renderPanel(
      <ExpandPanel side="top" open anchorElement={anchor} aria-label="menu" />,
    );
    expect(panel.hasAttribute("data-drop-from-anchor")).toBe(true);
    // 不做整体位移（位移会让面板掠过并遮住 topbar）；展开交给 CSS 关键帧
    expect(panel.className).not.toContain("-translate-y-full");
    expect(panel.className).not.toContain("slide-in-from-top");
    expect(panel.className).not.toContain("data-[state=open]:translate-y-0");

    const overlay = document.querySelector(
      '[data-state="open"][class*="overlay-scrim"]',
    ) as HTMLElement;
    expect(overlay.className).toContain("top-[var(--expand-anchor-bottom,64px)]");
    expect(overlay.className).not.toContain("inset-0");
    // 遮罩是 Content 的兄弟节点，拿不到 Content 的内联变量，必须自带同一测量值
    expect(overlay.style.getPropertyValue("--expand-anchor-bottom")).toBe("64px");
    // topbar 不再被遮罩覆盖 → 必须恢复其指针事件，否则只剩 Esc/正文区可关闭
    expect(document.body.classList.contains("expand-panel-below-topbar")).toBe(true);
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

  it("遮罩走暗化族 token + z-[var(--uni-z-drawer)]；面板 shadow-lg + 动画曲线类", () => {
    renderPanel(<ExpandPanel side="top" open aria-label="menu" />);
    const overlay = document.querySelector(
      '[data-slot="expand-panel"] ~ [data-radix-popper-content-wrapper] ~ *, [role="dialog"]',
    );
    void overlay;
    const markup = document.body.innerHTML;
    // HIG-AUD-010：写法收敛为 scrim 族 token，不得再回落字面量
    expect(markup).toContain("bg-[var(--uni-overlay-scrim-color)]");
    expect(markup).not.toMatch(/bg-black\/\d/);
    expect(markup).toContain("z-[var(--uni-z-drawer)]");
    const panel = document.querySelector('[data-slot="expand-panel"]')!;
    expect(panel.className).toContain("shadow-lg");
    expect(panel.className).toContain("transition-[translate,clip-path]");
    expect(panel.className).not.toContain("animate-in");
    expect(panel.className).toContain("duration-(--uni-duration-slower)");
    expect(panel.className).toContain("ease-snap");
    expect(panel.className).toContain("motion-reduce:!transition-none");
    expect(panel.getAttribute("aria-label")).toBe("menu");
  });
});
