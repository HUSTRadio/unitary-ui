// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ActivityView } from "../src/components/ui/activity-view";

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
  document.body.innerHTML = "";
});

/** 渲染后返回面板（Radix Portal 挂在 body）。 */
function renderView(props: Partial<React.ComponentProps<typeof ActivityView>> = {}) {
  const onOpenChange = props.onOpenChange ?? (() => {});
  act(() => {
    root.render(<ActivityView open onOpenChange={onOpenChange} {...props} />);
  });
  return document.querySelector<HTMLElement>('[data-slot="bottom-sheet"]')!;
}

describe("ActivityView 内容与一次性动作（行为契约，替代源码字符串断言）", () => {
  it("基于 BottomSheet 容器，且默认渲染目标 / 操作 / 取消三个语义区", () => {
    const panel = renderView({
      targets: [{ id: "copy", icon: <svg />, title: "Copy", onSelect: () => {} }],
      actions: [{ id: "print", icon: <svg />, title: "Print", onSelect: () => {} }],
    });
    expect(panel.querySelector('[data-slot="activity-view-targets"]')).not.toBeNull();
    expect(panel.querySelector('[data-slot="activity-view-actions"]')).not.toBeNull();
    expect(panel.querySelector('[data-slot="activity-view-cancel"]')).not.toBeNull();
    // 目标名与操作名作为按钮可读文案存在
    expect(panel.textContent).toContain("Copy");
    expect(panel.textContent).toContain("Print");
  });

  it("点击分享目标执行回调并关闭面板（活动是一次性动作）", () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    const panel = renderView({
      onOpenChange,
      targets: [{ id: "copy", icon: <svg />, title: "Copy", onSelect }],
    });
    const target = [...panel.querySelectorAll("button")].find((button) =>
      button.textContent?.includes("Copy"),
    )!;
    act(() => target.click());
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("点击操作项执行回调并关闭面板；取消行只关闭不执行任何动作", () => {
    const action = vi.fn();
    const onOpenChange = vi.fn();
    const panel = renderView({
      onOpenChange,
      actions: [{ id: "print", title: "Print", onSelect: action }],
    });
    const actionRow = [...panel.querySelectorAll("button")].find((button) =>
      button.textContent?.includes("Print"),
    )!;
    act(() => actionRow.click());
    expect(action).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    act(() =>
      (panel.querySelector('[data-slot="activity-view-cancel"]') as HTMLElement).click(),
    );
    expect(action).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("showCancel={false} 时不渲染取消行", () => {
    const panel = renderView({
      showCancel: false,
      actions: [{ id: "print", title: "Print", onSelect: () => {} }],
    });
    expect(panel.querySelector('[data-slot="activity-view-cancel"]')).toBeNull();
    expect(panel.querySelector('[data-slot="activity-view-actions"]')).not.toBeNull();
  });

  it("空数据时不渲染对应的语义区", () => {
    const panel = renderView({ targets: [], actions: [] });
    expect(panel.querySelector('[data-slot="activity-view-targets"]')).toBeNull();
    expect(panel.querySelector('[data-slot="activity-view-actions"]')).toBeNull();
    // 取消行仍保留：面板始终可退出
    expect(panel.querySelector('[data-slot="activity-view-cancel"]')).not.toBeNull();
  });

  it("默认标题与取消行走本地化文案（无 provider 时 en）", () => {
    const panel = renderView({ actions: [{ id: "print", title: "Print", onSelect: () => {} }] });
    expect(panel.querySelector('[data-slot="activity-view-title"]')!.textContent).toBe("Share");
    expect(panel.querySelector('[data-slot="activity-view-cancel"]')!.textContent).toBe("Cancel");
  });
});
