// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SplitButton,
  SplitButtonMenuItem,
  type SplitButtonExpandCorner,
} from "../src/components/ui/split-button";

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

/**
 * SplitButton / Pull-down Button 行为契约（替代逐字冻结定位映射表的源码断言，HIG-AUD-041）。
 * 判据是菜单浮层实际落到的 `data-side` / `data-align` 与动画原点类名，而不是源码里的
 * `EXPAND_CORNER_PROPS` 文本。
 */
function renderButton(props: Partial<React.ComponentProps<typeof SplitButton>> = {}) {
  act(() =>
    root.render(
      <SplitButton menuItems={<SplitButtonMenuItem title="Duplicate" />} {...props}>
        Save
      </SplitButton>,
    ),
  );
  return document.querySelector<HTMLElement>('[data-slot="split-button"]')!;
}

/** 打开下拉菜单：Radix DropdownMenu 由触发器上的 pointerdown 打开。 */
function openMenu() {
  const trigger = document.querySelector<HTMLElement>('[data-slot="split-button-menu"]')!;
  act(() => {
    trigger.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0 }));
  });
  return document.querySelector<HTMLElement>('[data-slot="menu"]');
}

const CORNERS: readonly [SplitButtonExpandCorner, string, string, string][] = [
  // 展开角, data-side, data-align, 动画原点类
  ["top-left", "bottom", "start", "origin-top-left"],
  ["top-right", "bottom", "end", "origin-top-right"],
  ["bottom-left", "top", "start", "origin-bottom-left"],
  ["bottom-right", "top", "end", "origin-bottom-right"],
];

describe("SplitButton 公开 API", () => {
  it("导出组件与菜单项，并渲染主按钮与下拉触发按钮", () => {
    expect(SplitButton).toBeTruthy();
    expect(SplitButtonMenuItem).toBeTruthy();

    const group = renderButton();
    expect(group.querySelector('[data-slot="split-button-main"]')?.textContent).toBe("Save");
    expect(
      group.querySelector('[data-slot="split-button-menu"]')?.getAttribute("aria-label"),
    ).toBe("More options");
  });

  it("menuButtonLabel 覆盖下拉触发按钮的无障碍名称", () => {
    const group = renderButton({ menuButtonLabel: "More actions" });
    expect(
      group.querySelector('[data-slot="split-button-menu"]')?.getAttribute("aria-label"),
    ).toBe("More actions");
  });

  it("menuButtonDisabled 只禁用下拉触发按钮", () => {
    const group = renderButton({ menuButtonDisabled: true });
    expect(group.querySelector<HTMLButtonElement>('[data-slot="split-button-menu"]')!.disabled).toBe(
      true,
    );
    expect(group.querySelector<HTMLButtonElement>('[data-slot="split-button-main"]')!.disabled).toBe(
      false,
    );
  });

  it("点击菜单项执行对应回调", () => {
    const onClick = vi.fn();
    renderButton({
      menuItems: <SplitButtonMenuItem title="Duplicate" menuItemProps={{ onClick }} />,
    });
    const menu = openMenu()!;
    const item = [...menu.querySelectorAll<HTMLElement>('[data-slot="menu-item"]')].find((node) =>
      node.textContent?.includes("Duplicate"),
    )!;
    act(() => item.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("SplitButton 菜单定位（split 与 pulldown）", () => {
  it("split 变体按 menuAlignment 定位，且不加卡片内边距", () => {
    renderButton({ menuAlignment: "bottom-end" });
    const menu = openMenu()!;
    expect(menu.getAttribute("data-side")).toBe("bottom");
    expect(menu.getAttribute("data-align")).toBe("end");
    expect(menu.className).not.toContain("p-2");
    expect(menu.className).not.toMatch(/origin-(top|bottom)-(left|right)/);
  });

  it("split 变体忽略 expandCorner", () => {
    renderButton({ expandCorner: "bottom-right" });
    const menu = openMenu()!;
    expect(menu.getAttribute("data-side")).toBe("bottom");
    expect(menu.className).not.toContain("origin-bottom-right");
  });

  for (const [corner, side, align, origin] of CORNERS) {
    it(`pulldown 展开角 ${corner} 落到 ${side}/${align} 与 ${origin}`, () => {
      renderButton({ variant: "pulldown", expandCorner: corner });
      const menu = openMenu()!;
      expect(menu.getAttribute("data-side")).toBe(side);
      expect(menu.getAttribute("data-align")).toBe(align);
      // 卡片化内边距 + 动画原点固定在锚定角
      expect(menu.className).toContain("p-2");
      expect(menu.className).toContain(origin);
    });
  }

  it("pulldown 默认展开角为 top-left（卡片在按钮下方），向上展开不是默认", () => {
    renderButton({ variant: "pulldown" });
    const menu = openMenu()!;
    expect(menu.getAttribute("data-side")).toBe("bottom");
    expect(menu.getAttribute("data-align")).toBe("start");
    expect(menu.className).toContain("origin-top-left");
    // 「卡片在上方」必须显式传入 bottom-* 角（见 CORNERS 表：bottom-* → data-side="top"）；
    // 默认角不会锚定到底部角，因此也不会带上向上展开的动画原点类。
    expect(menu.className).not.toContain("origin-bottom-left");
    expect(menu.className).not.toContain("origin-bottom-right");
  });
});
