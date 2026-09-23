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

/** 按文案取胶囊中的操作按钮 */
function actionButton(label: string): HTMLButtonElement {
  const button = Array.from(capsule()?.querySelectorAll("button") ?? []).find(
    (candidate) => candidate.textContent === label,
  );
  if (!button) throw new Error(`capsule action "${label}" not rendered`);
  return button as HTMLButtonElement;
}

/** 让容器内出现一段选区并唤起胶囊 */
function openCapsuleWithSelection(text: string, rect: DOMRect = RECT as DOMRect): void {
  const target = container.querySelector('[data-slot="edit-menu"]')?.firstChild as Node;
  stubSelection(text, target, rect);
  act(() => {
    document.dispatchEvent(new MouseEvent("mouseup"));
  });
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
    // HIG-AUD-021：回调同时给出「已 trim 文本」与「选区原文」
    expect(onCopy).toHaveBeenCalledWith("selectable text", "selectable text");
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
    expect(onTranslate).toHaveBeenCalledWith("selectable text", "selectable text");
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

  // ---- HIG-AUD-020：触屏合成 mousedown 竞态 ----

  test("keeps the capsule when a touch gesture is followed by a synthesized mousedown", () => {
    mount(<EditMenu onCopy={() => {}}>selectable text</EditMenu>);
    const target = container.querySelector('[data-slot="edit-menu"]')?.firstChild as Node;
    stubSelection("selectable text", target);
    act(() => {
      document.dispatchEvent(new Event("touchend", { bubbles: true }));
    });
    expect(capsule()).not.toBeNull();

    // 触屏手势结束后浏览器补发的合成 mousedown（target 是手指落点，不在胶囊内）
    // 不得把刚浮现的胶囊收掉（修复前：一闪即隐）。
    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(capsule()).not.toBeNull();
    expect(capsule()?.getAttribute("data-exiting")).toBeNull();

    // 守护不是恒真：紧随其后的下一次真实鼠标按下仍应关闭（合成窗口只覆盖一次事件）。
    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(capsule()?.getAttribute("data-exiting")).not.toBeNull();
  });

  test("ignores a mousedown the browser reports as synthesized from touch", () => {
    mount(<EditMenu onCopy={() => {}}>selectable text</EditMenu>);
    openCapsuleWithSelection("selectable text");
    expect(capsule()).not.toBeNull();

    // Chromium 路径：sourceCapabilities.firesTouchEvents === true（无 touchend 前置）
    const synthesized = new MouseEvent("mousedown", { bubbles: true });
    Object.defineProperty(synthesized, "sourceCapabilities", {
      configurable: true,
      value: { firesTouchEvents: true },
    });
    act(() => {
      document.dispatchEvent(synthesized);
    });
    expect(capsule()?.getAttribute("data-exiting")).toBeNull();

    // 真实鼠标按下（无 sourceCapabilities）仍关闭
    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(capsule()?.getAttribute("data-exiting")).not.toBeNull();
  });

  test("suppresses the native context menu on the container", () => {
    mount(<EditMenu onCopy={() => {}}>selectable text</EditMenu>);
    const root = document.querySelector<HTMLElement>('[data-slot="edit-menu"]')!;

    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    root.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);

    // iOS 原生 callout 抑制：WebKit 私有属性在 Blink / jsdom 下都取不到计算值，
    // 因此这里断言「声明存在」（类名），样式规则是否真的编译出来由 e2e 取证。
    expect(root.className).toContain("[-webkit-touch-callout:none]");
  });

  test("lets the consumer keep control of contextmenu inside the container", () => {
    const onContextMenu = vi.fn();
    mount(
      <EditMenu onCopy={() => {}} onContextMenu={onContextMenu}>
        selectable text
      </EditMenu>,
    );
    const root = document.querySelector<HTMLElement>('[data-slot="edit-menu"]')!;

    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    root.dispatchEvent(event);
    expect(onContextMenu).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(false);
  });

  // ---- HIG-AUD-021：定位与语义边界 ----

  test("clamps the flipped bottom position inside the viewport", () => {
    mount(<EditMenu onCopy={() => {}}>selectable text</EditMenu>);

    const proto = window.HTMLElement.prototype;
    const originalRect = proto.getBoundingClientRect;
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(proto, "offsetHeight");
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(proto, "offsetWidth");
    const originalInnerHeight = Object.getOwnPropertyDescriptor(window, "innerHeight");
    Object.defineProperty(proto, "offsetHeight", { configurable: true, get: () => 36 });
    Object.defineProperty(proto, "offsetWidth", { configurable: true, get: () => 240 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 400 });

    try {
      // 选区很高（top 4 / bottom 398）：上方放不下 → 翻转下方；下方同样放不下
      // → 必须 clamp 到 400 - 36 - 8 = 356（未 clamp 时是 398 + 8 = 406，已越出视口）。
      openCapsuleWithSelection("selectable text", {
        top: 4,
        bottom: 398,
        left: 40,
        width: 120,
        height: 394,
      } as DOMRect);

      expect(capsule()?.getAttribute("data-placement")).toBe("bottom");
      expect(capsule()?.style.top).toBe("356px");
    } finally {
      proto.getBoundingClientRect = originalRect;
      if (originalOffsetHeight) Object.defineProperty(proto, "offsetHeight", originalOffsetHeight);
      if (originalOffsetWidth) Object.defineProperty(proto, "offsetWidth", originalOffsetWidth);
      if (originalInnerHeight) Object.defineProperty(window, "innerHeight", originalInnerHeight);
    }
  });

  test("copies the raw selection and reports both trimmed and raw text", async () => {
    const onCopy = vi.fn();
    mount(<EditMenu onCopy={onCopy}>selectable text</EditMenu>);
    openCapsuleWithSelection("  padded selection  ");

    await act(async () => {
      actionButton("Copy").click();
    });

    // 剪贴板写入的是选区原文（与系统原生复制一致）
    expect(copyTextToClipboard).toHaveBeenCalledWith("  padded selection  ");
    expect(onCopy).toHaveBeenCalledWith("padded selection", "  padded selection  ");
  });

  test("passes the raw selection text to custom actions", () => {
    const onTranslate = vi.fn();
    mount(
      <EditMenu
        onCopy={() => {}}
        actions={[{ id: "translate", label: "Translate", onSelect: onTranslate }]}
      >
        selectable text
      </EditMenu>,
    );
    openCapsuleWithSelection(" foo ");

    act(() => {
      actionButton("Translate").click();
    });

    expect(onTranslate).toHaveBeenCalledWith("foo", " foo ");
  });

  test("does not call onCut when the clipboard write fails, and reports the error", async () => {
    const onCut = vi.fn();
    const onError = vi.fn();
    const failure = new Error("clipboard write blocked");
    vi.mocked(copyTextToClipboard).mockRejectedValueOnce(failure);

    mount(
      <EditMenu onCut={onCut} onError={onError}>
        selectable text
      </EditMenu>,
    );
    openCapsuleWithSelection("selectable text");

    await act(async () => {
      actionButton("Cut").click();
    });

    // 数据安全：写入失败时调用方不得收到 onCut（否则会删除未复制成功的内容）
    expect(onCut).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(failure);
  });

  test("does not call onCopy when the clipboard write fails", async () => {
    const onCopy = vi.fn();
    const onError = vi.fn();
    const failure = new Error("clipboard write blocked");
    vi.mocked(copyTextToClipboard).mockRejectedValueOnce(failure);

    mount(<EditMenu onCopy={onCopy} onError={onError}>selectable text</EditMenu>);
    openCapsuleWithSelection("selectable text");

    await act(async () => {
      actionButton("Copy").click();
    });

    expect(onCopy).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(failure);
  });
});
