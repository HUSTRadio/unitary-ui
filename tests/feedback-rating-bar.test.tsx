// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Feedback } from "@/components/ui/feedback";
import { RATING_OPTIONS, RATING_TONE, RatingPill } from "@/components/ui/rating-pill";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(element));
  return container;
}

/** 胶囊 trigger（aria-haspopup=dialog 的 button） */
function capsule() {
  return document.querySelector<HTMLButtonElement>("button[aria-haspopup='dialog']")!;
}

function radios() {
  return [...document.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
}

function radiogroup() {
  return document.querySelector<HTMLElement>('[role="radiogroup"]');
}

/** 模拟点外部（Radix Popover modal=false 通过 document pointerdown 关闭）。
 *  Radix 在 effect 里用 setTimeout(0) 挂 document 级 pointerdown 监听，jsdom 需先冲刷定时器。
 *  注意：Popover 传 deferPointerDownOutside=true → pointerdown(button=0) 后必须补发 click
 *  才会真正触发 onPointerDownOutside（模拟真实鼠标序列）。 */
async function clickOutside() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  act(() => {
    document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0 }));
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }));
  });
}

describe("Feedback rating bar (item 12)", () => {
  test("RATING_TONE maps the four ratings to the four semantic colors", () => {
    expect(RATING_TONE).toEqual({
      love: "success",
      okay: "neutral",
      "not-great": "warning",
      hate: "error",
    });
  });

  test("collapsed state renders a single capsule trigger and no radiogroup", () => {
    mount(<Feedback label="vercel" dryRun />);
    const trigger = capsule();
    expect(trigger).toBeTruthy();
    // 胶囊形态：rounded-full + h-8（32px，对齐官方 h:32px 实测）
    expect(trigger.className).toContain("rounded-full");
    expect(trigger.className).toContain("h-8");
    expect(trigger.textContent).toContain("vercel");
    expect(radiogroup()).toBeNull();
  });

  test("clicking the capsule expands the 4-rating radiogroup; clicking outside collapses it", async () => {
    mount(<Feedback label="vercel" dryRun />);
    const trigger = capsule();
    act(() => trigger.click());
    expect(radiogroup()).toBeTruthy();
    expect(radios()).toHaveLength(4);
    // aria 语义：4 个 radio + radiogroup 标签
    expect(radios()[0]?.getAttribute("aria-checked")).toBe("false");
    // 点外部 → 收起
    await clickOutside();
    expect(radiogroup()).toBeNull();
  });

  test("each of the four rating buttons carries its own semantic color classes", () => {
    mount(<Feedback label="vercel" dryRun />);
    act(() => capsule().click());
    const [hate, notGreat, okay, love] = radios();
    expect(hate.className).toContain("hover:bg-danger-soft"); // hate → error 红
    expect(notGreat.className).toContain("hover:bg-warning-soft"); // not-great → warning 黄
    expect(okay.className).toContain("hover:bg-gray-alpha-200"); // okay → gray 中性
    expect(love.className).toContain("hover:bg-success-soft"); // love → success 绿
  });

  test("selecting love recolors the capsule trigger green and shows the face icon", () => {
    mount(<Feedback label="vercel" dryRun />);
    const trigger = capsule();
    act(() => trigger.click());
    act(() => radios()[3].click()); // love
    expect(trigger.className).toContain("bg-success-soft");
    expect(trigger.className).toContain("text-success");
    expect(trigger.className).toContain("border-success/40");
    // 选中表情图标渲染进胶囊
    expect(trigger.querySelector("svg")).toBeTruthy();
  });

  test("selecting hate colors the capsule error red; not-great → warning amber", () => {
    mount(
      <div>
        <Feedback label="a" dryRun defaultValue="hate" />
        <Feedback label="b" dryRun defaultValue="not-great" />
      </div>,
    );
    const triggers = [...document.querySelectorAll<HTMLButtonElement>("button[aria-haspopup='dialog']")];
    expect(triggers[0].className).toContain("bg-danger-soft");
    expect(triggers[0].className).toContain("text-danger");
    expect(triggers[1].className).toContain("bg-warning-soft");
    expect(triggers[1].className).toContain("text-warning");
  });

  test("okay (neutral) keeps the gray capsule", () => {
    mount(<Feedback label="vercel" dryRun defaultValue="okay" />);
    const trigger = capsule();
    expect(trigger.className).toContain("bg-gray-alpha-200");
    expect(trigger.className).toContain("text-gray-900");
  });

  test("submit closes the panel and resets the rating color back to neutral", () => {
    const onSubmit = vi.fn();
    mount(<Feedback label="vercel" onSubmit={onSubmit} />);
    const trigger = capsule();
    act(() => trigger.click());
    act(() => radios()[3].click()); // love
    expect(trigger.className).toContain("text-success");
    act(() => {
      document.querySelector<HTMLFormElement>("form")?.requestSubmit();
    });
    expect(onSubmit).toHaveBeenCalledWith("love", "", undefined);
    expect(radiogroup()).toBeNull();
    expect(trigger.className).not.toContain("text-success");
    expect(trigger.className).not.toContain("bg-success-soft");
  });

  test("RatingPill reports open/close via onOpenChange (outside click)", async () => {
    const onOpenChange = vi.fn();
    mount(<RatingPill label="Was this helpful?" onOpenChange={onOpenChange} />);
    act(() => capsule().click());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await clickOutside();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test("four rating options expose value/label/tone/icon in order", () => {
    expect(RATING_OPTIONS.map((o) => o.value)).toEqual(["hate", "not-great", "okay", "love"]);
    expect(RATING_OPTIONS.map((o) => o.tone)).toEqual(["error", "warning", "neutral", "success"]);
  });
});
