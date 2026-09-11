// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Feedback } from "@/components/ui/feedback";
import { RATING_OPTIONS, RatingPill } from "@/components/ui/rating-pill";

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

function radios(scope: ParentNode = document) {
  return [...scope.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
}

function openDefaultFeedback() {
  const trigger = container.querySelector<HTMLButtonElement>('[data-slot="feedback-trigger"]')!;
  act(() => trigger.click());
  return trigger;
}

describe("Feedback official interaction model", () => {
  test("default renders a compact secondary trigger and portals an anchored dialog on click", () => {
    mount(<Feedback label="vercel" dryRun />);

    const trigger = container.querySelector<HTMLButtonElement>('[data-slot="feedback-trigger"]');
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain("vercel");
    expect(trigger?.className).toContain("h-8");
    expect(trigger?.className).toContain("bg-background-100");
    expect(radios()).toHaveLength(0);

    openDefaultFeedback();

    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]');
    expect(popup?.getAttribute("role")).toBe("dialog");
    expect(popup?.className).toContain("w-[340px]");
    expect(popup?.className).toContain("rounded-xl");
    expect(radios(popup!)).toHaveLength(4);
    expect(popup?.querySelector("textarea")).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-overlay"]')).toBeNull();
  });

  test("inline grows upward into a floating card without moving the capsule bottom", () => {
    mount(<Feedback type="inline" dryRun />);

    const capsule = container.querySelector<HTMLElement>('[data-slot="rating-pill"]')!;
    // 浮动层：贴住占位底部（bottom-0），向上生长。
    expect(capsule.className).toContain("absolute");
    expect(capsule.className).toContain("bottom-0");
    // 收起态宽度由内容决定（w-fit），不再固定 274px：label 永不截断。
    expect(capsule.className).toContain("w-fit");
    expect(capsule.className).not.toContain("w-[274px]");
    // 收起态必须是可插值的有限圆角 token，不能是 rounded-full / rounded-capsule，
    // 否则展开过渡会出现被钳制的半径突跳。
    expect(capsule.className).toContain("rounded-capsule-interpolable");
    expect(capsule.className).not.toMatch(/rounded-(?:full|capsule)(?![-\w])/);
    expect(capsule.textContent).toContain("Was this helpful?");
    expect(radios(capsule)).toHaveLength(4);
    // 收起态不渲染表单区。
    expect(capsule.querySelector('[data-slot="feedback-form-region"]')).toBeNull();

    act(() => radios(capsule)[3].click());

    // 展开态：容器变为 336px 卡片，header 在上、表单区在下（连续容器向上生长）。
    expect(capsule.className).toContain("w-[336px]");
    expect(capsule.className).toContain("rounded-xl");
    const region = capsule.querySelector<HTMLElement>('[data-slot="feedback-form-region"]')!;
    expect(region).not.toBeNull();
    expect(region.getAttribute("data-state")).toBe("open");
    // header 必须排在表单区之前（DOM 顺序），展开后 header 位于浮层顶部。
    const header = capsule.querySelector<HTMLElement>('[data-slot="feedback-inline-header"]')!;
    expect(header.compareDocumentPosition(region) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(radios(capsule)[3].getAttribute("aria-checked")).toBe("true");
  });

  test("unmounts the floating form only after the collapse animation finishes", () => {
    vi.useFakeTimers();
    try {
      mount(<Feedback type="inline" dryRun />);
      act(() => radios(container)[3].click());
      expect(container.querySelector('[data-slot="feedback-form-region"]')).not.toBeNull();

      // Escape 收起后，节点必须仍在，且带上退出动画状态。
      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      });
      const region = container.querySelector<HTMLElement>('[data-slot="feedback-form-region"]');
      expect(region).not.toBeNull();
      expect(region?.getAttribute("data-state")).toBe("closed");
      expect(region?.className).toContain("animate-out");

      // 动画时长走完后才卸载。
      act(() => vi.advanceTimersByTime(200));
      expect(container.querySelector('[data-slot="feedback-form-region"]')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  test("uses measured light/dark blue hover and selected values for every rating", () => {
    mount(<Feedback type="inline" dryRun />);

    for (const radio of radios(container)) {
      expect(radio.className).toContain("feedback-rating-option");
      expect(radio.className).not.toMatch(/danger-soft|warning-soft|success-soft/);
    }

    const css = readFileSync(resolve("src/styles/index.css"), "utf8");
    expect(css).toContain("--uni-feedback-blue-300: #e0f0ff");
    expect(css).toContain("--uni-feedback-blue-900: #0068d6");
    expect(css).toContain("--uni-feedback-blue-300: #0f2f57");
    expect(css).toContain("--uni-feedback-blue-900: #52a8ff");
  });

  test("uses roving tabindex and arrow keys to move and select within the radio group", () => {
    mount(<Feedback type="inline" dryRun />);
    const options = radios(container);

    expect(options.map((option) => option.tabIndex)).toEqual([0, -1, -1, -1]);
    options[0].focus();
    act(() => {
      options[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    });

    expect(document.activeElement).toBe(options[3]);
    expect(options[3].getAttribute("aria-checked")).toBe("true");
    expect(options.map((option) => option.tabIndex)).toEqual([-1, -1, -1, 0]);
    expect(container.querySelector('[data-slot="rating-pill"]')?.getAttribute("data-state")).toBe(
      "open",
    );
  });

  test("successful submit closes, resets and passes rating, text and metadata", () => {
    const onSubmit = vi.fn();
    mount(<Feedback metadata={{ source: "docs" }} onSubmit={onSubmit} />);
    const trigger = openDefaultFeedback();
    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]')!;

    act(() => radios(popup)[2].click());
    const textarea = popup.querySelector<HTMLTextAreaElement>("textarea")!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set?.call(
        textarea,
        "Useful docs",
      );
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => popup.querySelector<HTMLFormElement>("form")?.requestSubmit());

    expect(onSubmit).toHaveBeenCalledWith("okay", "Useful docs", { source: "docs" }, undefined);
    expect(document.querySelector('[data-slot="feedback-popup"]')).toBeNull();
    expect(trigger.getAttribute("data-state")).toBe("closed");
  });

  test("dryRun submit is inert and keeps the current panel open", () => {
    mount(<Feedback dryRun />);
    openDefaultFeedback();
    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]')!;

    act(() => popup.querySelector<HTMLFormElement>("form")?.requestSubmit());

    expect(document.querySelector('[data-slot="feedback-popup"]')).toBe(popup);
  });

  test("preserves RatingPill's public four-tone capsule behavior independently of Feedback", () => {
    mount(
      <div>
        {RATING_OPTIONS.map(({ value }) => (
          <RatingPill key={value} label={value} defaultValue={value} />
        ))}
      </div>,
    );

    const expectedToneClasses = [
      "bg-danger-soft",
      "bg-warning-soft",
      "bg-gray-alpha-200",
      "bg-success-soft",
    ];
    const pills = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="rating-pill"]'));
    expect(pills).toHaveLength(4);
    pills.forEach((pill, index) => expect(pill.className).toContain(expectedToneClasses[index]));
  });

  test("RatingPill remains a reusable inline capsule and reports selections", () => {
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();
    mount(<RatingPill label="Was this helpful?" onValueChange={onValueChange} onSubmit={onSubmit} />);

    act(() => radios(container)[1].click());

    expect(onValueChange).toHaveBeenCalledWith("not-great");
    expect(onSubmit).toHaveBeenCalledWith("not-great");
    expect(radios(container)[1].getAttribute("aria-checked")).toBe("true");
  });

  test("keeps the official four rating values and order", () => {
    expect(RATING_OPTIONS.map(({ value }) => value)).toEqual([
      "hate",
      "not-great",
      "okay",
      "love",
    ]);
  });

  test("keeps the inline label untruncated and the floating card out of flow", () => {
    mount(<Feedback type="inline" dryRun />);
    const capsule = container.querySelector<HTMLElement>('[data-slot="rating-pill"]')!;
    const header = capsule.querySelector<HTMLElement>('[data-slot="feedback-inline-header"]')!;
    const label = header.querySelector("p")!;

    // label 永不截断：不得使用 truncate，改用 whitespace-nowrap。
    expect(label.className).not.toContain("truncate");
    expect(label.className).toContain("whitespace-nowrap");
    // 表情行不得被压缩。
    expect(header.querySelector('[role="radiogroup"]')?.className).toContain("shrink-0");

    // 浮动卡片必须绝对定位（脱离文档流），否则会撑高父容器、破坏「浮动弹窗」语义。
    expect(capsule.className).toContain("absolute");
    expect(capsule.className).toContain("bottom-0");

    act(() => radios(capsule)[3].click());
    const region = capsule.querySelector<HTMLElement>('[data-slot="feedback-form-region"]')!;
    // 表单区与胶囊同宽，视觉上连成一个卡片（不再是一张独立浮层）。
    expect(region.className).toContain("w-full");
    // header 保持 48px 单行，位于浮层顶部。
    expect(header.className).toContain("h-12");
  });

  test("passes the selected topic as the fourth onSubmit argument without polluting metadata", () => {
    const onSubmit = vi.fn();
    mount(<Feedback metadata={{ source: "docs" }} showTopics onSubmit={onSubmit} />);
    openDefaultFeedback();
    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]')!;

    const select = popup.querySelector<HTMLSelectElement>("select")!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set?.call(select, "AI");
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    act(() => popup.querySelector<HTMLFormElement>("form")?.requestSubmit());

    expect(onSubmit).toHaveBeenCalledWith(undefined, "", { source: "docs" }, "AI");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [, , metadata, reportedTopic] = onSubmit.mock.calls[0] as [unknown, string, unknown, string];
    expect(metadata).toEqual({ source: "docs" });
    expect(reportedTopic).toBe("AI");
  });

  test("only merges topic into metadata when includeTopicInMetadata is enabled", () => {
    const onSubmit = vi.fn();
    mount(
      <Feedback metadata={{ source: "docs" }} showTopics includeTopicInMetadata onSubmit={onSubmit} />,
    );
    openDefaultFeedback();
    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]')!;

    const select = popup.querySelector<HTMLSelectElement>("select")!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set?.call(select, "Billing");
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    act(() => popup.querySelector<HTMLFormElement>("form")?.requestSubmit());

    expect(onSubmit).toHaveBeenCalledWith(undefined, "", { source: "docs", topic: "Billing" }, "Billing");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test("renders a caller-supplied topics list without showTopics and reports its value", () => {
    const onTopicChange = vi.fn();
    mount(<Feedback topics={["Imports", "Exports"]} onTopicChange={onTopicChange} />);
    openDefaultFeedback();
    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]')!;

    const select = popup.querySelector<HTMLSelectElement>("select")!;
    expect(Array.from(select.options).map((option) => option.value)).toEqual([
      "",
      "Imports",
      "Exports",
    ]);

    act(() => {
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set?.call(select, "Exports");
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(onTopicChange).toHaveBeenCalledWith("Exports");
  });

  test("never renders the topic selector in the inline variant", () => {
    mount(<Feedback type="inline" dryRun showTopics />);
    act(() => radios(container)[3].click());

    expect(container.querySelector("select")).toBeNull();
  });

  test("keeps the inline rating when focusout reports a null relatedTarget and focus stays inside", () => {
    vi.useFakeTimers();
    try {
      mount(<Feedback type="inline" dryRun />);
      act(() => radios(container)[3].click());
      const capsule = container.querySelector<HTMLElement>('[data-slot="rating-pill"]')!;
      const textarea = capsule.querySelector<HTMLTextAreaElement>("textarea")!;

      act(() => {
        textarea.focus();
        capsule.dispatchEvent(
          new FocusEvent("focusout", { bubbles: true, relatedTarget: null }),
        );
      });
      act(() => vi.runAllTimers());

      expect(capsule.getAttribute("data-state")).toBe("open");
      expect(radios(capsule)[3].getAttribute("aria-checked")).toBe("true");
    } finally {
      vi.useRealTimers();
    }
  });

  test("still collapses the inline capsule when a null relatedTarget is followed by real focus loss", () => {
    vi.useFakeTimers();
    try {
      mount(<Feedback type="inline" dryRun />);
      act(() => radios(container)[3].click());
      const capsule = container.querySelector<HTMLElement>('[data-slot="rating-pill"]')!;

      act(() => {
        capsule.dispatchEvent(
          new FocusEvent("focusout", { bubbles: true, relatedTarget: null }),
        );
      });
      const outside = document.createElement("button");
      document.body.append(outside);
      outside.focus();
      act(() => vi.runAllTimers());

      expect(capsule.getAttribute("data-state")).toBe("closed");
      expect(radios(capsule).every((radio) => radio.getAttribute("aria-checked") === "false")).toBe(
        true,
      );
      outside.remove();
    } finally {
      vi.useRealTimers();
    }
  });
});
