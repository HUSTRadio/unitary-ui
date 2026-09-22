// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

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
});

/** 渲染后返回面板 Content（Radix Portal 挂在 body）。 */
function renderView(props: Partial<React.ComponentProps<typeof ActivityView>> = {}) {
  act(() => {
    root.render(<ActivityView open onOpenChange={() => {}} {...props} />);
  });
  return document.querySelector<HTMLElement>('[data-slot="bottom-sheet"]')!;
}

describe("ActivityView 可访问名称（HIG-AUD-040）", () => {
  it("默认标题：面板 aria-labelledby 指向标题行的非空 id", () => {
    const panel = renderView();
    const title = panel.querySelector<HTMLElement>('[data-slot="activity-view-title"]');
    expect(title).not.toBeNull();
    expect(title!.id).toBeTruthy();
    expect(panel.getAttribute("aria-labelledby")).toBe(title!.id);
    // 有关联时不再声明 aria-label（避免双重命名来源）
    expect(panel.getAttribute("aria-label")).toBeNull();
  });

  it("自定义标题同样命名面板", () => {
    const panel = renderView({ title: "共享到" });
    const title = panel.querySelector<HTMLElement>('[data-slot="activity-view-title"]');
    expect(title!.textContent).toBe("共享到");
    expect(panel.getAttribute("aria-labelledby")).toBe(title!.id);
  });

  it("title=null：无标题行时回退 aria-label", () => {
    const panel = renderView({ title: null });
    expect(panel.querySelector('[data-slot="activity-view-title"]')).toBeNull();
    expect(panel.getAttribute("aria-labelledby")).toBeNull();
    expect(panel.getAttribute("aria-label")).toBeTruthy();
  });

  it("sheetProps 的 aria-labelledby 可覆盖标题关联（转义通道仍在）", () => {
    const panel = renderView({ sheetProps: { "aria-labelledby": "external-heading" } });
    expect(panel.getAttribute("aria-labelledby")).toBe("external-heading");
  });
});
