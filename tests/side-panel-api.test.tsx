// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SidePanel, SidePanelClose } from "../src/components/ui/side-panel";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let roots: Root[] = [];
const testRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(path.join(testRoot, "src/components/ui/side-panel.tsx"), "utf8");

afterEach(() => {
  for (const r of roots) act(() => r.unmount());
  roots = [];
  document.body.innerHTML = "";
});

function renderPanel(node: React.ReactNode): string {
  // Radix Portal 在 jsdom 挂到 document.body；每次用独立容器/root 渲染后取 HTML 断言
  const own = document.createElement("div");
  document.body.append(own);
  const r = createRoot(own);
  roots.push(r);
  act(() => {
    r.render(node);
  });
  return document.body.innerHTML;
}

/** 多次渲染后取最新一次的元素（querySelector 只会命中最早的） */
function lastSlot(slot: string): HTMLElement {
  const matches = document.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`);
  return matches[matches.length - 1];
}

describe("SidePanel API contract（DD-001b）", () => {
  it("side 默认 right：面板类含 right-4 与 material-medium", () => {
    const markup = renderPanel(<SidePanel show>content</SidePanel>);
    const panel = document.querySelector('[data-slot="side-panel-content"]');
    expect(panel).not.toBeNull();
    expect(panel!.className).toContain("material-medium");
    expect(panel!.className).toContain("right-4");
    expect(markup).toContain('data-slot="side-panel-content"');
  });

  it("side=left：left-4 且无 right-4", () => {
    renderPanel(
      <SidePanel show side="left">
        content
      </SidePanel>,
    );
    const panel = lastSlot("side-panel-content");
    expect(panel.className).toContain("left-4");
    expect(panel.className).not.toContain("right-4");
  });

  it("宽度消费 var(--uni-drawer-width)，组件源码无写死 px 宽度", () => {
    renderPanel(<SidePanel show>content</SidePanel>);
    const panel = lastSlot("side-panel-content");
    expect(panel.className).toContain("w-[var(--uni-drawer-width)]");

    // token 在 index.css 中声明一次
    const css = readFileSync(path.join(testRoot, "src/styles/index.css"), "utf8");
    expect(css).toMatch(/--uni-drawer-width:\s*min\(420px,\s*90vw\)/);

    // 禁止写死 px 宽度
    expect(source).not.toMatch(/w-\[\d+px\]/);
    expect(source).not.toContain("max-w-sm");
  });

  it("z-index 消费 var(--uni-z-drawer)", () => {
    const markup = renderPanel(<SidePanel show>content</SidePanel>);
    expect(markup).toContain("z-[var(--uni-z-drawer)]");
    const panel = lastSlot("side-panel-content");
    expect(panel.className).toContain("z-[var(--uni-z-drawer)]");
  });

  it("noOverlay=true 不渲染 overlay；默认有 overlay 且背景用 --uni-overlay-backdrop-* token", () => {
    const without = renderPanel(
      <SidePanel show noOverlay>
        content
      </SidePanel>,
    );
    expect(document.querySelector('[data-slot="side-panel-overlay"]')).toBeNull();

    const withOverlay = renderPanel(<SidePanel show>content</SidePanel>);
    const overlay = document.querySelector('[data-slot="side-panel-overlay"]')!;
    expect(overlay).not.toBeNull();
    expect(overlay.className).toContain("bg-[var(--uni-overlay-backdrop-color)]");
    expect(overlay.className).toContain("opacity-[var(--uni-overlay-backdrop-opacity)]");
    // 禁止 drawer 的 bg-black/40 直搬（DD-001 §3.3）
    expect(withOverlay + without).not.toContain("bg-black/40");
  });

  it("动画：slide-in-from-right-5 / left 镜像 + motion-reduce:animate-none", () => {
    renderPanel(
      <SidePanel show>
        <span>content</span>
      </SidePanel>,
    );
    const panel = lastSlot("side-panel-content");
    expect(panel.className).toContain("slide-in-from-right-5");
    expect(panel.className).toContain("motion-reduce:animate-none");

    renderPanel(
      <SidePanel show side="left">
        <span>content</span>
      </SidePanel>,
    );
    const mirrored = lastSlot("side-panel-content");
    expect(mirrored.className).toContain("slide-in-from-left-5");
    expect(mirrored.className).not.toContain("slide-in-from-right-5");
  });

  it("SidePanelClose 渲染为 DialogPrimitive.Close，点击触发 onDismiss", () => {
    const onDismiss = vi.fn();
    renderPanel(
      <SidePanel show onDismiss={onDismiss}>
        <SidePanelClose asChild>
          <button type="button">close</button>
        </SidePanelClose>
      </SidePanel>,
    );
    const button = [...document.querySelectorAll("button")].find((b) =>
      b.textContent?.includes("close"),
    )!;
    expect(button).toBeDefined();
    act(() => {
      button.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("无手势代码：源码不含 pointer-capture/dragY", () => {
    expect(source).not.toContain("setPointerCapture");
    expect(source).not.toContain("dragY");
    expect(source).not.toContain("onPointerDown");
  });
});
