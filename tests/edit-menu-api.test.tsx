// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { EditMenu } from "@/components/ui/edit-menu";
import { I18nProvider } from "@/lib/i18n";

vi.mock("@/lib/clipboard", () => ({
  copyTextToClipboard: vi.fn(async () => {}),
}));

const { copyTextToClipboard } = await import("@/lib/clipboard");

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

// 关闭会先驻留一个退场过渡（约 150ms）再卸载，用例需要可控推进计时器。
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
  vi.mocked(copyTextToClipboard).mockClear();
  vi.useRealTimers();
});

function mount(node: React.ReactNode, locale: "en" | "zh-CN" = "en") {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<I18nProvider locale={locale}>{node}</I18nProvider>));
}

const RECT = { top: 200, bottom: 218, left: 40, width: 120, height: 18 };

function stubSelection(text: string, node: Node, rect: DOMRect = RECT as DOMRect) {
  const range = {
    commonAncestorContainer: node,
    getBoundingClientRect: () => rect,
  } as unknown as Range;
  Object.defineProperty(window, "getSelection", {
    configurable: true,
    writable: true,
    value: () =>
      ({
        isCollapsed: false,
        rangeCount: 1,
        toString: () => text,
        getRangeAt: () => range,
      }) as unknown as Selection,
  });
}

function capsule(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-slot="edit-menu-capsule"]');
}

function capsuleLabels(): string[] {
  return Array.from(capsule()?.querySelectorAll("button") ?? []).map(
    (button) => button.textContent ?? "",
  );
}

/** 推进退场过渡计时器，让胶囊真正卸载 */
function flushExit() {
  act(() => {
    vi.advanceTimersByTime(200);
  });
}

describe("EditMenu", () => {
  test("stays hidden until the container holds a text selection", () => {
    mount(<EditMenu onCopy={() => {}}>selectable text</EditMenu>);
    expect(capsule()).toBeNull();

    const target = container.querySelector('[data-slot="edit-menu"]')?.firstChild as Node;
    stubSelection("selectable text", target);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
    expect(capsule()).not.toBeNull();
  });

  test("renders standard actions and omits those without handlers", () => {
    mount(
      <EditMenu onCut={() => {}} onSelectAll={() => {}}>
        selectable text
      </EditMenu>,
    );
    const target = container.querySelector('[data-slot="edit-menu"]')?.firstChild as Node;
    stubSelection("selectable text", target);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });

    const labels = capsuleLabels();
    expect(labels).toContain("Cut");
    expect(labels).toContain("Copy");
    expect(labels).toContain("Select All");
    // Paste / Look Up / Share 无回调 → 不渲染（HIG：只显示相关操作）
    expect(labels).not.toContain("Paste");
    expect(labels).not.toContain("Look Up");
    expect(labels).not.toContain("Share");
    expect(capsule()?.getAttribute("role")).toBe("toolbar");
  });

  test("copies the selected text then closes the capsule", async () => {
    const onCopy = vi.fn();
    mount(<EditMenu onCopy={onCopy}>selectable text</EditMenu>);
    const target = container.querySelector('[data-slot="edit-menu"]')?.firstChild as Node;
    stubSelection("selectable text", target);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });

    const copyButton = Array.from(capsule()?.querySelectorAll("button") ?? []).find(
      (button) => button.textContent === "Copy",
    )!;
    await act(async () => {
      copyButton.click();
    });

    expect(copyTextToClipboard).toHaveBeenCalledWith("selectable text");
    expect(onCopy).toHaveBeenCalledWith("selectable text");
    // 关闭先驻留退场动画（Apple 对称过渡），过渡结束后才卸载
    expect(capsule()?.getAttribute("data-exiting")).not.toBeNull();
    flushExit();
    expect(capsule()).toBeNull();
  });

  test("appends custom actions and reports the selected text", () => {
    const onTranslate = vi.fn();
    mount(
      <EditMenu
        onCopy={() => {}}
        actions={[{ id: "translate", label: "Translate", onSelect: onTranslate }]}
      >
        selectable text
      </EditMenu>,
    );
    const target = container.querySelector('[data-slot="edit-menu"]')?.firstChild as Node;
    stubSelection("selectable text", target);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });

    const labels = capsuleLabels();
    expect(labels.at(-1)).toBe("Translate");
    const translateButton = capsule()!.querySelector("button:last-of-type")!;
    act(() => {
      (translateButton as HTMLButtonElement).click();
    });
    expect(onTranslate).toHaveBeenCalledWith("selectable text");
  });

  test("ignores selections outside the container", () => {
    mount(<EditMenu onCopy={() => {}}>selectable text</EditMenu>);
    const outside = document.createElement("span");
    document.body.append(outside);
    stubSelection("somewhere else", outside);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
    expect(capsule()).toBeNull();
  });

  test("flips below the selection when there is no room above", () => {
    mount(<EditMenu onCopy={() => {}}>selectable text</EditMenu>);
    const target = container.querySelector('[data-slot="edit-menu"]')?.firstChild as Node;
    stubSelection("selectable text", target, { top: 4, bottom: 22, left: 40, width: 60 } as DOMRect);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
    expect(capsule()?.getAttribute("data-placement")).toBe("bottom");
  });

  test("positions itself from the layout box, not the scaled rect of the enter animation", () => {
    mount(<EditMenu onCopy={() => {}}>selectable text</EditMenu>);
    const target = container.querySelector('[data-slot="edit-menu"]')?.firstChild as Node;

    // 入场动画 `zoom-in-95` 会把渲染盒缩到 0.95 倍：动画期间 rect 的高度是 34.2 而非
    // 布局盒的 36。定位必须取 offsetHeight/offsetWidth，否则胶囊与选区的间距会少 1.8px
    // （实测 gap 6.2px 而非声明的 8px）。
    const proto = window.HTMLElement.prototype;
    const originalRect = proto.getBoundingClientRect;
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(proto, "offsetHeight");
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(proto, "offsetWidth");
    Object.defineProperty(proto, "offsetHeight", { configurable: true, get: () => 36 });
    Object.defineProperty(proto, "offsetWidth", { configurable: true, get: () => 240 });
    proto.getBoundingClientRect = () =>
      ({ top: 0, bottom: 34.2, left: 0, right: 240, width: 240, height: 34.2 }) as DOMRect;

    try {
      stubSelection("selectable text", target);
      act(() => {
        document.dispatchEvent(new MouseEvent("mouseup"));
      });

      // RECT.top = 200 → 上方有空间（36 + 8 + 8 = 52），placement = top，
      // top = 200 - offset(8) - height(36) = 156；centerX = 40 + 120/2 = 100，
      // 半宽 120 加上 8px 视口安全边距后被 clamp 到 128。
      expect(capsule()?.getAttribute("data-placement")).toBe("top");
      expect(capsule()?.style.top).toBe("156px");
      expect(capsule()?.style.left).toBe("128px");
    } finally {
      proto.getBoundingClientRect = originalRect;
      if (originalOffsetHeight) Object.defineProperty(proto, "offsetHeight", originalOffsetHeight);
      if (originalOffsetWidth) Object.defineProperty(proto, "offsetWidth", originalOffsetWidth);
    }
  });

  test("hides when the selection is cleared", () => {
    mount(<EditMenu onCopy={() => {}}>selectable text</EditMenu>);
    const target = container.querySelector('[data-slot="edit-menu"]')?.firstChild as Node;
    stubSelection("selectable text", target);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
    expect(capsule()).not.toBeNull();

    Object.defineProperty(window, "getSelection", {
      configurable: true,
      writable: true,
      value: () =>
        ({ isCollapsed: true, rangeCount: 0, toString: () => "" }) as unknown as Selection,
    });
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
    // 选区塌陷同样走退场动画后再卸载
    expect(capsule()?.getAttribute("data-exiting")).not.toBeNull();
    flushExit();
    expect(capsule()).toBeNull();
  });

  test("translates standard actions through i18n", () => {
    mount(
      <EditMenu onCut={() => {}} onSelectAll={() => {}}>
        selectable text
      </EditMenu>,
      "zh-CN",
    );
    const target = container.querySelector('[data-slot="edit-menu"]')?.firstChild as Node;
    stubSelection("selectable text", target);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });

    const labels = capsuleLabels();
    expect(labels).toContain("剪切");
    expect(labels).toContain("复制");
    expect(labels).toContain("全选");
  });
});
