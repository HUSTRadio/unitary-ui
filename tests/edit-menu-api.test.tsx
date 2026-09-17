// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { EditMenu } from "@/components/ui/edit-menu";
import { I18nProvider } from "@/lib/i18n";

vi.mock("@/lib/clipboard", () => ({
  copyTextToClipboard: vi.fn(async () => {}),
}));

const { copyTextToClipboard } = await import("@/lib/clipboard");

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
  vi.mocked(copyTextToClipboard).mockClear();
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
