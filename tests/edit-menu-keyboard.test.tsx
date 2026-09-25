// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { EditMenu, type EditMenuProps } from "@/components/ui/edit-menu";
import { I18nProvider } from "@/lib/i18n";

/**
 * HIG-AUD-004 回归：EditMenu 胶囊此前只能靠指针点开、Escape 只挂在胶囊自身、
 * 键盘用户无法进入工具条，且关闭后焦点丢失。这里锁定修复后的行为契约：
 * - 键盘产生的选区把焦点移入首个操作项（指针选区不抢焦点）；
 * - APG 工具条键盘模型（单一 Tab 停靠点 + 方向键循环 + Home/End）；
 * - Escape 在文档级可用（焦点不必先进胶囊）；
 * - 关闭后焦点归还给产生选区的元素；
 * - 关闭后同一段选区的 `selectionchange` 重放不会把胶囊重新唤起。
 */
vi.mock("@/lib/clipboard", () => ({
  copyTextToClipboard: vi.fn(async () => {}),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
  vi.useRealTimers();
});

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

function items(): HTMLButtonElement[] {
  return [...(capsule()?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
}

function labels(): string[] {
  return items().map((item) => item.textContent ?? "");
}

function keyOnCapsuleFocus(key: string) {
  act(() => {
    document.activeElement!.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  });
}

/** 推进退场过渡计时器，让胶囊真正卸载 */
function flushExit() {
  act(() => {
    vi.advanceTimersByTime(200);
  });
}

/** 挂载一个内含可聚焦输入框的 EditMenu，返回该输入框（选区来源 + 焦点归属地）。 */
function mountMenu(overrides: Partial<EditMenuProps> = {}) {
  const noop = () => {};
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <I18nProvider locale="en">
        <EditMenu onCut={noop} onCopy={noop} onPaste={noop} {...overrides}>
          <input data-testid="field" />
        </EditMenu>
      </I18nProvider>,
    );
  });
  return container.querySelector<HTMLInputElement>('[data-testid="field"]')!;
}

/** 键盘路径：焦点已在字段上 → 键盘事件把本次交互标记为「键盘产生选区」。 */
function openViaKeyboard(field: HTMLElement, text = "selectable text") {
  act(() => field.focus());
  act(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  });
  stubSelection(text, field);
  act(() => {
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  });
}

/** 指针路径：字段已持有焦点，但本次选区由指针产生 —— 胶囊不应抢走焦点。 */
function openViaPointer(field: HTMLElement, text = "selectable text", pointerType = "mouse") {
  act(() => field.focus());
  act(() => {
    document.dispatchEvent(new PointerEvent("pointerdown", { pointerType, bubbles: true }));
  });
  stubSelection(text, field);
  act(() => {
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  });
}

describe("EditMenu keyboard and dismissal behaviour (HIG-AUD-004)", () => {
  test("keyboard-driven selection moves focus into the first action", () => {
    const field = mountMenu();
    openViaKeyboard(field);

    expect(labels()).toEqual(["Cut", "Copy", "Paste"]);
    expect(capsule()?.getAttribute("data-presentation")).toBe("capsule");
    expect(document.activeElement).toBe(items()[0]);
  });

  test("pointer-driven selection does not steal focus", () => {
    const field = mountMenu();
    openViaPointer(field);

    expect(capsule()?.getAttribute("data-presentation")).toBe("capsule");
    expect(document.activeElement).toBe(field);
  });

  test("touch selection uses the same horizontal toolbar and keyboard navigation", () => {
    const field = mountMenu();
    openViaPointer(field, "selectable text", "touch");
    expect(capsule()?.getAttribute("data-presentation")).toBe("capsule");
    expect(capsule()?.getAttribute("role")).toBe("toolbar");
    expect(capsule()?.getAttribute("aria-orientation")).toBe("horizontal");
    act(() => items()[0].focus());
    keyOnCapsuleFocus("ArrowRight");
    expect(document.activeElement).toBe(items()[1]);
    keyOnCapsuleFocus("ArrowLeft");
    expect(document.activeElement).toBe(items()[0]);
  });

  test("keeps a single tab stop and navigates with arrows, Home and End", () => {
    const field = mountMenu();
    openViaKeyboard(field);

    expect(items().map((item) => item.tabIndex)).toEqual([0, -1, -1]);

    keyOnCapsuleFocus("ArrowRight");
    expect(document.activeElement).toBe(items()[1]);
    expect(items().map((item) => item.tabIndex)).toEqual([-1, 0, -1]);
    keyOnCapsuleFocus("ArrowDown");
    expect(document.activeElement).toBe(items()[1]);

    keyOnCapsuleFocus("End");
    expect(document.activeElement).toBe(items()[2]);
    expect(items().map((item) => item.tabIndex)).toEqual([-1, -1, 0]);

    // 末项继续右移循环回首项
    keyOnCapsuleFocus("ArrowRight");
    expect(document.activeElement).toBe(items()[0]);

    // 首项左移循环到末项
    keyOnCapsuleFocus("ArrowLeft");
    expect(document.activeElement).toBe(items()[2]);

    keyOnCapsuleFocus("Home");
    expect(document.activeElement).toBe(items()[0]);
    expect(items().map((item) => item.tabIndex)).toEqual([0, -1, -1]);
  });

  test("Escape closes the capsule from the document even when focus never entered it", () => {
    const field = mountMenu();
    openViaPointer(field);
    expect(capsule()).not.toBeNull();
    expect(document.activeElement).toBe(field);

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(capsule()?.getAttribute("data-exiting")).not.toBeNull();
    flushExit();
    expect(capsule()).toBeNull();
  });

  test("closing returns focus to the element that produced the selection", () => {
    const field = mountMenu();
    openViaKeyboard(field);
    expect(document.activeElement).toBe(items()[0]);

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    flushExit();

    expect(capsule()).toBeNull();
    expect(document.activeElement).toBe(field);
  });

  test("a replayed selectionchange for the dismissed selection does not reopen the capsule", async () => {
    const field = mountMenu();
    openViaKeyboard(field);

    const copyButton = items().find((item) => item.textContent === "Copy")!;
    await act(async () => {
      copyButton.click();
    });
    flushExit();
    expect(capsule()).toBeNull();

    // 关闭会归还焦点，浏览器/剪贴板随后可能对「仍然存在」的同一段选区再派发一次
    // selectionchange；它不应把刚关掉的胶囊重新唤起。
    act(() => {
      document.dispatchEvent(new Event("selectionchange"));
    });
    flushExit();
    expect(capsule()).toBeNull();

    // 用户重新开始一次交互后，同一段文字仍然应当可以再次唤起胶囊。
    act(() => {
      document.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    });
    expect(capsule()).not.toBeNull();
    expect(document.activeElement).toBe(field);
  });
});
