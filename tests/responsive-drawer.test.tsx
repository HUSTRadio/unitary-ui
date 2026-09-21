// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  ResponsiveDrawer,
  ResponsiveDrawerBody,
  ResponsiveDrawerClose,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerFooter,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
} from "../src/components/ui/responsive-drawer";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let reactRoot: Root;

/** jsdom 无 matchMedia：按断点结果打桩（本组件用 (min-width: 640px) 判定桌面形态）。 */
function stubMatchMedia(desktop: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: desktop,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function render(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.appendChild(container);
  reactRoot = createRoot(container);
  act(() => reactRoot.render(element));
}

function panelElement() {
  return document.querySelector('[data-slot="responsive-drawer-content"]');
}

beforeEach(() => {
  stubMatchMedia(true);
  // jsdom 未实现 pointer capture
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
});

afterEach(() => {
  if (reactRoot) act(() => reactRoot.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

describe("ResponsiveDrawer family", () => {
  test("renders header/title/description/body/footer slots and a labelled close button", () => {
    render(
      <ResponsiveDrawer open>
        <ResponsiveDrawerContent>
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>Deployment actions</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>Choose what to do next.</ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
          <ResponsiveDrawerBody>Body content</ResponsiveDrawerBody>
          <ResponsiveDrawerFooter>
            <ResponsiveDrawerClose>Cancel</ResponsiveDrawerClose>
          </ResponsiveDrawerFooter>
        </ResponsiveDrawerContent>
      </ResponsiveDrawer>,
    );

    for (const slot of [
      "responsive-drawer-content",
      "responsive-drawer-header",
      "responsive-drawer-title",
      "responsive-drawer-description",
      "responsive-drawer-body",
      "responsive-drawer-footer",
      "responsive-drawer-close",
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`), `缺少 ${slot}`).not.toBeNull();
    }

    // Header 内置关闭按钮（无子元素时用 i18n 的 Close 作为可访问名称）
    const closes = document.querySelectorAll('[data-slot="responsive-drawer-close"]');
    expect(closes).toHaveLength(2);
    expect(closes[0]?.getAttribute("aria-label")).toBeTruthy();

    // Body 独立滚动、Footer 移动端列倒序 + 桌面右对齐
    expect(document.querySelector('[data-slot="responsive-drawer-body"]')?.className).toContain(
      "overflow-y-auto",
    );
    expect(document.querySelector('[data-slot="responsive-drawer-footer"]')?.className).toContain(
      "flex-col-reverse",
    );
    expect(document.querySelector('[data-slot="responsive-drawer-footer"]')?.className).toContain(
      "sm:justify-end",
    );
  });

  test("defaults to the right panel and uses the expansive motion token", () => {
    render(
      <ResponsiveDrawer open>
        <ResponsiveDrawerContent>Panel</ResponsiveDrawerContent>
      </ResponsiveDrawer>,
    );

    const panel = panelElement();
    expect(panel?.getAttribute("data-placement")).toBe("right");
    expect(panel?.className).toContain("slide-in-from-right");
    expect(panel?.className).toContain("duration-(--uni-motion-expansive)");
    expect(panel?.className).toContain("ease-snap");
    expect(panel?.className).toContain("motion-reduce:animate-none");
    // 桌面侧栏几何：留白 + 圆角 + 宽度档位
    expect(panel?.className).toContain("sm:inset-y-2");
    expect(panel?.className).toContain("sm:rounded-xl");
    expect(panel?.className).toContain("sm:max-w-md");
  });

  test("responsive mode resolves to bottom on small viewports and right on desktop", () => {
    stubMatchMedia(false);
    render(
      <ResponsiveDrawer open responsive>
        <ResponsiveDrawerContent>Panel</ResponsiveDrawerContent>
      </ResponsiveDrawer>,
    );
    let panel = panelElement();
    expect(panel?.getAttribute("data-placement")).toBe("bottom");
    expect(panel?.className).toContain("slide-in-from-bottom");
    expect(panel?.className).toContain("pb-[env(safe-area-inset-bottom)]");

    act(() => reactRoot.unmount());
    container.remove();
    stubMatchMedia(true);
    render(
      <ResponsiveDrawer open responsive>
        <ResponsiveDrawerContent>Panel</ResponsiveDrawerContent>
      </ResponsiveDrawer>,
    );
    panel = panelElement();
    expect(panel?.getAttribute("data-placement")).toBe("right");
  });

  test("honours an explicit top placement with its own geometry and direction", () => {
    render(
      <ResponsiveDrawer open placement="top" size="lg">
        <ResponsiveDrawerContent>Panel</ResponsiveDrawerContent>
      </ResponsiveDrawer>,
    );

    const panel = panelElement();
    expect(panel?.getAttribute("data-placement")).toBe("top");
    expect(panel?.className).toContain("slide-in-from-top");
    expect(panel?.className).toContain("rounded-b-overlay");
    // size 只作用于 left/right 面板
    expect(panel?.className).not.toContain("sm:max-w-lg");
  });

  test("renders the grabber only for bottom detents and snaps on drag", () => {
    render(
      <ResponsiveDrawer open placement="bottom" detents={[0.4, 1]} onDetentChange={vi.fn()}>
        <ResponsiveDrawerContent>Panel</ResponsiveDrawerContent>
      </ResponsiveDrawer>,
    );

    const grabber = document.querySelector<HTMLButtonElement>('[data-slot="grabber"]')!;
    expect(grabber).not.toBeNull();
    expect(grabber.getAttribute("role")).toBe("slider");
    expect(panelElement()?.getAttribute("style")).toContain("height: 40dvh");
  });

  test("closes when dragged below the lowest detent", () => {
    const onOpenChange = vi.fn();
    render(
      <ResponsiveDrawer open placement="bottom" detents={[0.5, 1]} onOpenChange={onOpenChange}>
        <ResponsiveDrawerContent>Panel</ResponsiveDrawerContent>
      </ResponsiveDrawer>,
    );

    const grabber = document.querySelector<HTMLButtonElement>('[data-slot="grabber"]')!;
    const drag = (y: number) => {
      act(() => {
        grabber.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientY: y }));
      });
      act(() => {
        grabber.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientY: y + 400 }));
      });
      act(() => {
        grabber.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientY: y + 400 }));
      });
    };

    drag(100);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("no grabber for side placements even with multiple detents", () => {
    render(
      <ResponsiveDrawer open placement="right" detents={[0.4, 1]}>
        <ResponsiveDrawerContent>Panel</ResponsiveDrawerContent>
      </ResponsiveDrawer>,
    );

    expect(document.querySelector('[data-slot="grabber"]')).toBeNull();
    // 侧栏形态不写档位高度（面板高度由 inset 与内容决定）
    expect(panelElement()?.getAttribute("style") ?? "").not.toContain("dvh");
  });
});
