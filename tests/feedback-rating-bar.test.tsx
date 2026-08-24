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

/** 胶囊容器（data-slot=rating-pill） */
function pill() {
  return document.querySelector<HTMLElement>('[data-slot="rating-pill"]')!;
}

function radios() {
  return [...document.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
}

function radiogroup() {
  return document.querySelector<HTMLElement>('[role="radiogroup"]');
}

describe("Feedback rating bar (item 12, 官方内嵌形态)", () => {
  test("RATING_TONE maps the four ratings to the four semantic colors", () => {
    expect(RATING_TONE).toEqual({
      love: "success",
      okay: "neutral",
      "not-great": "warning",
      hate: "error",
    });
  });

  test("官方形态：单行胶囊内直接内嵌 4 个表情（radiogroup 常显，无需点击展开）", () => {
    mount(<Feedback label="vercel" dryRun />);
    const capsule = pill();
    expect(capsule).toBeTruthy();
    // 胶囊形态：rounded-full + h-12（48px，官方实测）
    expect(capsule.className).toContain("rounded-full");
    expect(capsule.className).toContain("h-12");
    expect(capsule.textContent).toContain("vercel");
    // 4 表情常显
    expect(radiogroup()).toBeTruthy();
    expect(radios()).toHaveLength(4);
  });

  test("each of the four rating buttons carries its own semantic color classes", () => {
    mount(<Feedback label="vercel" dryRun />);
    const [hate, notGreat, okay, love] = radios();
    expect(hate.className).toContain("hover:bg-danger-soft"); // hate → error 红
    expect(notGreat.className).toContain("hover:bg-warning-soft"); // not-great → warning 黄
    expect(okay.className).toContain("hover:bg-gray-alpha-200"); // okay → gray 中性
    expect(love.className).toContain("hover:bg-success-soft"); // love → success 绿
  });

  test("selecting love recolors the capsule green and selects the radio", () => {
    mount(<Feedback label="vercel" dryRun />);
    const capsule = pill();
    act(() => radios()[3].click()); // love
    expect(capsule.className).toContain("bg-success-soft");
    expect(capsule.className).toContain("text-success");
    expect(capsule.className).toContain("border-success/40");
    expect(radios()[3].getAttribute("aria-checked")).toBe("true");
  });

  test("selecting hate colors the capsule error red; not-great → warning amber", () => {
    mount(
      <div>
        <Feedback label="a" dryRun defaultValue="hate" />
        <Feedback label="b" dryRun defaultValue="not-great" />
      </div>,
    );
    const capsules = [...document.querySelectorAll<HTMLElement>('[data-slot="rating-pill"]')];
    expect(capsules[0].className).toContain("bg-danger-soft");
    expect(capsules[0].className).toContain("text-danger");
    expect(capsules[1].className).toContain("bg-warning-soft");
    expect(capsules[1].className).toContain("text-warning");
  });

  test("okay (neutral) keeps the gray capsule", () => {
    mount(<Feedback label="vercel" dryRun defaultValue="okay" />);
    const capsule = pill();
    expect(capsule.className).toContain("bg-gray-alpha-200");
    expect(capsule.className).toContain("text-gray-900");
  });

  test("submit closes the form panel and resets the rating color back to neutral", () => {
    const onSubmit = vi.fn();
    mount(<Feedback label="vercel" onSubmit={onSubmit} />);
    const capsule = pill();
    // 选中表情 → 展开表单面板
    act(() => radios()[3].click()); // love
    expect(capsule.className).toContain("text-success");
    const form = document.querySelector<HTMLFormElement>("form");
    expect(form).toBeTruthy();
    act(() => {
      form?.requestSubmit();
    });
    expect(onSubmit).toHaveBeenCalledWith("love", "", undefined);
    expect(document.querySelector("form")).toBeNull();
    expect(capsule.className).not.toContain("text-success");
    expect(capsule.className).not.toContain("bg-success-soft");
  });

  test("RatingPill exposes value change via onValueChange and onSubmit", () => {
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();
    mount(<RatingPill label="Was this helpful?" onValueChange={onValueChange} onSubmit={onSubmit} />);
    act(() => radios()[2].click()); // okay
    expect(onValueChange).toHaveBeenCalledWith("okay");
    expect(onSubmit).toHaveBeenCalledWith("okay");
  });

  test("four rating options expose value/label/tone/icon in order", () => {
    expect(RATING_OPTIONS.map((o) => o.value)).toEqual(["hate", "not-great", "okay", "love"]);
    expect(RATING_OPTIONS.map((o) => o.tone)).toEqual(["error", "warning", "neutral", "success"]);
  });
});
