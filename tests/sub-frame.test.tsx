// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { BottomSheet } from "../src/components/ui/bottom-sheet";
import { ExpandPanel } from "../src/components/ui/expand-panel";
import { SubFrame } from "../src/components/ui/sub-frame";

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
});

function render(node: React.ReactNode): void {
  act(() => {
    root.render(node);
  });
}

function sheet(): HTMLElement {
  return document.querySelector('[data-slot="bottom-sheet"]') as HTMLElement;
}

function frameOf(node: Element): HTMLElement | null {
  return node.closest('[data-slot="sub-frame"]') as HTMLElement | null;
}

describe("SubFrame", () => {
  it("默认是 relative + overflow-clip 的定位祖先，clip=false 时不裁剪", () => {
    render(<SubFrame data-testid="frame" />);
    const frame = document.querySelector('[data-slot="sub-frame"]') as HTMLElement;
    expect(frame.className).toContain("relative");
    expect(frame.className).toContain("overflow-clip");

    render(<SubFrame clip={false} />);
    const unclipped = document.querySelector('[data-slot="sub-frame"]') as HTMLElement;
    expect(unclipped.className).toContain("relative");
    expect(unclipped.className).not.toContain("overflow-clip");
  });

  it("把 ref 交给调用方，并在保留自身 data-slot 的同时允许覆盖", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<SubFrame ref={ref} />);
    expect(ref.current).toBe(document.querySelector('[data-slot="sub-frame"]'));

    render(<SubFrame data-slot="app-shell-demo" />);
    expect(document.querySelector('[data-slot="app-shell-demo"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="sub-frame"]')).toBeNull();
  });

  it("子树内的 BottomSheet 自动挂进最近的 SubFrame，并按容器高换算档位", () => {
    render(
      <SubFrame data-testid="outer">
        <BottomSheet open aria-label="局部浮层" />
      </SubFrame>,
    );
    const frame = document.querySelector('[data-slot="sub-frame"]') as HTMLElement;
    const panel = sheet();
    expect(frameOf(panel)).toBe(frame);
    expect(panel.parentElement).not.toBe(document.body);
    // 局部容器内以容器高百分比换算，而非视口 d(h)vh
    expect(panel.style.getPropertyValue("--sheet-h").endsWith("%")).toBe(true);
    expect(panel.className).toContain("absolute");
    expect(panel.className).not.toContain("fixed");
  });

  it("嵌套时取最近的 SubFrame（内层覆盖外层）", () => {
    render(
      <SubFrame data-testid="outer">
        <SubFrame data-testid="inner">
          <BottomSheet open aria-label="局部浮层" />
        </SubFrame>
      </SubFrame>,
    );
    const frames = document.querySelectorAll('[data-slot="sub-frame"]');
    expect(frames).toHaveLength(2);
    expect(frameOf(sheet())).toBe(frames[1]);
  });

  it("不在任何 SubFrame 内时回到 document.body 与视口档位", () => {
    render(<BottomSheet open aria-label="视口浮层" />);
    const panel = sheet();
    expect(frameOf(panel)).toBeNull();
    expect(panel.parentElement).toBe(document.body);
    expect(panel.style.getPropertyValue("--sheet-h").endsWith("dvh")).toBe(true);
    expect(panel.className).toContain("fixed");
  });

  it("显式 container={null} 可以跳出 SubFrame 回到 document.body", () => {
    render(
      <SubFrame>
        <BottomSheet open container={null} aria-label="视口浮层" />
      </SubFrame>,
    );
    const panel = sheet();
    expect(frameOf(panel)).toBeNull();
    expect(panel.parentElement).toBe(document.body);
    expect(panel.style.getPropertyValue("--sheet-h").endsWith("dvh")).toBe(true);
  });

  it("ExpandPanel 继承 SubFrame 后由 fixed 降级为 absolute 贴合框架", () => {
    render(<ExpandPanel side="bottom" open />);
    const viewportPanel = document.querySelector('[data-slot="expand-panel"]') as HTMLElement;
    expect(viewportPanel.className).toContain("fixed");
    expect(viewportPanel.className).not.toContain("absolute");

    render(
      <SubFrame>
        <ExpandPanel side="bottom" open />
      </SubFrame>,
    );
    const frame = document.querySelector('[data-slot="sub-frame"]') as HTMLElement;
    const framedPanel = frame.querySelector('[data-slot="expand-panel"]') as HTMLElement;
    expect(framedPanel).not.toBeNull();
    expect(framedPanel.className).toContain("absolute");

    render(
      <SubFrame>
        <ExpandPanel side="bottom" open container={null} />
      </SubFrame>,
    );
    const escaped = document.querySelector('[data-slot="expand-panel"]') as HTMLElement;
    expect(frameOf(escaped)).toBeNull();
    expect(escaped.className).not.toContain("absolute");
  });
});
