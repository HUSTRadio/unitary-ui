// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  MultiSelectContent,
  MultiSelectRoot,
  MultiSelectRow,
  MultiSelectTrigger,
} from "@/components/ui/multi-select";
import { I18nProvider } from "@/lib/i18n";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let originalResizeObserver: typeof ResizeObserver | undefined;

beforeEach(() => {
  originalResizeObserver = globalThis.ResizeObserver;
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof ResizeObserver;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
  if (originalResizeObserver) globalThis.ResizeObserver = originalResizeObserver;
  else delete (globalThis as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
});

function renderMenu(contentProps?: {
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  act(() => {
    root.render(
      <I18nProvider locale="zh-CN">
        <MultiSelectRoot defaultOpen>
          <MultiSelectTrigger>选择</MultiSelectTrigger>
          <MultiSelectContent {...contentProps}>
            <MultiSelectRow
              name="设计系统"
              checked
              onChange={vi.fn()}
              onSelectOnly={vi.fn()}
              onSelectAll={vi.fn()}
            />
          </MultiSelectContent>
        </MultiSelectRoot>
      </I18nProvider>,
    );
  });
}

/** Radix 内容渲染在 Portal（`document.body`），不在传入容器内。 */
const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"]')!;

describe("MultiSelect keyboard contract (HIG-AUD-016)", () => {
  test("gives the dialog an accessible name, overridable by the caller", () => {
    renderMenu();
    expect(dialog().getAttribute("aria-label")).toBe("选择选项");

    act(() => root.unmount());
    root = createRoot(container);
    renderMenu({ "aria-label": "自定义名称" });
    expect(dialog().getAttribute("aria-label")).toBe("自定义名称");

    act(() => root.unmount());
    root = createRoot(container);
    renderMenu({ "aria-labelledby": "panel-title" });
    // 提供 aria-labelledby 时不再输出 aria-label（避免双名称）
    expect(dialog().getAttribute("aria-labelledby")).toBe("panel-title");
    expect(dialog().hasAttribute("aria-label")).toBe(false);
  });

  test("does not trap Tab inside the panel", () => {
    renderMenu();
    const content = dialog();
    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });

    act(() => {
      content.dispatchEvent(event);
    });

    // 此前会 preventDefault 做循环 → 键盘用户无法用 Tab 离开面板
    expect(event.defaultPrevented).toBe(false);
  });

  test("exposes row controls to the tab order and to AT", () => {
    renderMenu();
    const checkbox = document.body.querySelector<HTMLElement>("[data-multi-select-checkbox]")!;
    const action = document.body.querySelector<HTMLElement>("[data-multi-select-action]")!;

    // 此前 Checkbox 被强制 tabIndex={-1}（热区是个无 role 的可点 div）→ 键盘/AT 不可达
    expect(checkbox.tabIndex).toBe(0);
    expect(checkbox.getAttribute("aria-label")).toContain("设计系统");
    expect(action.tabIndex).toBe(0);
  });

  test("arrow keys still rove into the row controls (regression)", () => {
    renderMenu();
    const content = dialog();

    act(() => {
      content.focus();
    });
    act(() => {
      content.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }),
      );
    });

    expect(document.activeElement).toBe(
      document.body.querySelector<HTMLElement>("[data-multi-select-action]"),
    );
  });
});
