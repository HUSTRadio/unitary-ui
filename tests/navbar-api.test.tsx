// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { Navbar } from "@/components/ui/navbar";

/**
 * Navbar API 四组行为：
 * (a) 默认渲染 header[data-slot=navbar]，scrollBehavior 默认 pinned（sticky top-0）；
 * (b) static→relative；auto-hide→fixed inset-x-0 top-0，向下滚动后 -translate-y-full 隐藏、向上滚回复现；
 * (c) variant=transparent 无底色类；solidOnScroll 提供滚动后补底色的挂点，且滚动超阈值自动补 bg-background-100 边框；
 * (d) height 数字转内联样式，字符串透传为类名。
 */

let container: HTMLDivElement;
let root: Root;

/** 手动排队的 rAF 回调（测试中同步 flush，保证确定性） */
let rafQueue: FrameRequestCallback[];

function flushRaf(): void {
  const callbacks = rafQueue;
  rafQueue = [];
  act(() => {
    for (const cb of callbacks) cb(0);
  });
}

function setScrollY(value: number): void {
  Object.defineProperty(window, "scrollY", { value, configurable: true });
}

function fireScroll(): void {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

function getHeader(): HTMLElement {
  const header = container.querySelector("header");
  if (!header) throw new Error("header[data-slot=navbar] not rendered");
  return header;
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  rafQueue = [];
  setScrollY(0);
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback): number => {
    rafQueue.push(cb);
    return rafQueue.length;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe("(a) 默认渲染与 pinned 定位", () => {
  test("默认输出 header[data-slot=navbar] 且 sticky top-0（pinned）", () => {
    const markup = renderToStaticMarkup(
      <Navbar>
        <div>content</div>
      </Navbar>,
    );

    expect(markup).toContain("<header");
    expect(markup).toContain('data-slot="navbar"');
    expect(markup).toContain("sticky");
    expect(markup).toContain("top-0");
    // 层级走 token 变量并带数字回退
    expect(markup).toContain("z-[var(--uni-z-header,40)]");
  });

  test("children 渲染在 header 内部", () => {
    const markup = renderToStaticMarkup(
      <Navbar>
        <div>brand</div>
      </Navbar>,
    );

    expect(markup).toContain("<div>brand</div>");
  });
});

describe("(b) scrollBehavior：static / auto-hide", () => {
  test("static 使用 relative 不吸附", () => {
    const markup = renderToStaticMarkup(
      <Navbar scrollBehavior="static">
        <div />
      </Navbar>,
    );

    expect(markup).toContain("relative");
    expect(markup).not.toContain("sticky");
  });

  test("auto-hide 使用 fixed inset-x-0 top-0 且带 transform 过渡与 reduced-motion 归零", () => {
    const markup = renderToStaticMarkup(
      <Navbar scrollBehavior="auto-hide">
        <div />
      </Navbar>,
    );

    expect(markup).toContain("fixed");
    expect(markup).toContain("inset-x-0");
    expect(markup).toContain("top-0");
    expect(markup).toContain("transition-transform");
    expect(markup).toContain("duration-(--uni-duration-slow)");
    expect(markup).toContain("motion-reduce:transition-none");
  });

  test("auto-hide 向下滚动超阈值隐藏（-translate-y-full），向上滚回复现", async () => {
    await act(async () => {
      root.render(
        <Navbar scrollBehavior="auto-hide">
          <div />
        </Navbar>,
      );
    });
    const header = getHeader();

    // 初始可见
    expect(header.className).not.toContain("-translate-y-full");

    // 向下滚动超过阈值（80）
    setScrollY(200);
    fireScroll();
    flushRaf();
    expect(header.className).toContain("-translate-y-full");

    // 向上滚回，重新可见
    setScrollY(80);
    fireScroll();
    flushRaf();
    expect(header.className).not.toContain("-translate-y-full");
  });
});

describe("(c) variant：transparent / solidOnScroll", () => {
  test("transparent 无任何底色类", () => {
    const markup = renderToStaticMarkup(
      <Navbar variant="transparent">
        <div />
      </Navbar>,
    );

    expect(markup).not.toContain("bg-background-100");
  });

  test("默认 solid 常驻底色与下边框", () => {
    const markup = renderToStaticMarkup(
      <Navbar>
        <div />
      </Navbar>,
    );

    expect(markup).toContain("bg-background-100");
    expect(markup).toContain("border-b");
    expect(markup).toContain("border-gray-alpha-400");
  });

  test("solidOnScroll 提供滚动后补底色的标记挂点（初始不透明）", () => {
    const markup = renderToStaticMarkup(
      <Navbar variant="transparent" solidOnScroll>
        <div />
      </Navbar>,
    );

    // 挂点：滚动后 JS 切换补底色所依赖的标记
    expect(markup).toContain('data-solid-on-scroll="true"');
    // 初始（未滚动）保持透明
    expect(markup).not.toContain("bg-background-100");
  });

  test("solidOnScroll 向下滚动超阈值后自动补底色与边框，滚回顶部还原透明", async () => {
    await act(async () => {
      root.render(
        <Navbar variant="transparent" solidOnScroll>
          <div />
        </Navbar>,
      );
    });
    const header = getHeader();

    expect(header.className).not.toContain("bg-background-100");

    setScrollY(120);
    fireScroll();
    flushRaf();
    expect(header.className).toContain("bg-background-100");
    expect(header.className).toContain("border-b");

    setScrollY(10);
    fireScroll();
    flushRaf();
    expect(header.className).not.toContain("bg-background-100");
  });
});

describe("(d) height 配置", () => {
  test("height 数字转为内联样式", () => {
    const markup = renderToStaticMarkup(
      <Navbar height={72}>
        <div />
      </Navbar>,
    );

    expect(markup).toContain("height:72px");
  });

  test("height 字符串透传为类名", () => {
    const markup = renderToStaticMarkup(
      <Navbar height="h-20 lg:h-24">
        <div />
      </Navbar>,
    );

    expect(markup).toContain("h-20");
    expect(markup).toContain("lg:h-24");
  });

  test("未指定 height 时默认 h-16", () => {
    const markup = renderToStaticMarkup(
      <Navbar>
        <div />
      </Navbar>,
    );

    expect(markup).toContain("h-16");
  });
});
