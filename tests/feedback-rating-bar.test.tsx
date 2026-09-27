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

// jsdom 未实现 scrollIntoView，Radix Select 高亮/聚焦时会调用。
HTMLElement.prototype.scrollIntoView = vi.fn();

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

/**
 * 主题选择器已改为 Select 组件（Radix）：选项渲染在 portal 的 select-content 里，
 * 且打开是异步的（需要 await act 让 Radix 的 effect 完成）。
 */
async function openTopicSelect(popup: HTMLElement): Promise<HTMLElement[]> {
  const trigger = popup.querySelector<HTMLButtonElement>('[data-slot="select-trigger"]')!;
  await act(async () => {
    trigger.click();
  });
  return [
    ...document.querySelectorAll<HTMLElement>('[data-slot="select-content"] [role="option"]'),
  ];
}

/**
 * 打开主题下拉并选中给定 value。
 * 注意：Radix 的 value 只在内部 context 中传递，DOM 上没有 data-value，
 * 因此按选项的可见文本匹配（测试默认 en-US locale，文案即原始 value）。
 */
async function selectTopic(popup: HTMLElement, value: string) {
  const options = await openTopicSelect(popup);
  const option = options.find((item) => item.textContent?.trim() === value);
  expect(
    option,
    `topic option ${value} should exist, got ${options.map((o) => o.textContent?.trim())}`,
  ).toBeTruthy();
  await act(async () => {
    option!.click();
  });
}

describe("Feedback official interaction model", () => {
  test("default renders a compact secondary trigger and portals an anchored dialog on click", () => {
    mount(<Feedback label="unitary" dryRun />);

    const trigger = container.querySelector<HTMLButtonElement>('[data-slot="feedback-trigger"]');
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain("unitary");
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

  test("inline grows upward into a floating card centered on the capsule", () => {
    mount(<Feedback type="inline" dryRun />);

    const capsule = container.querySelector<HTMLElement>('[data-slot="rating-pill"]')!;
    // 浮动层：贴住占位底部（bottom-0），向上生长。
    expect(capsule.className).toContain("absolute");
    expect(capsule.className).toContain("bottom-0");
    // 收起态必须是可插值的有限圆角 token，不能是 rounded-full / rounded-capsule，
    // 否则展开过渡会出现被钳制的半径突跳。
    expect(capsule.className).toContain("rounded-capsule-interpolable");
    expect(capsule.className).not.toMatch(/rounded-(?:full|capsule)(?![-\w])/);
    // 宽度必须是显式 style 值（fit-content 无法插值），才能参与宽高同步过渡。
    expect(capsule.className).toContain("transition-[width,left,border-radius]");
    expect(capsule.style.left).toBe("0px");
    expect(capsule.textContent).toContain("Was this helpful?");
    expect(radios(capsule)).toHaveLength(4);

    act(() => radios(capsule)[3].click());

    // 展开态：宽度走 style（336px），left 偏移半个宽度差 → 以胶囊中心对称扩展。
    expect(capsule.style.width).toBe("336px");
    expect(capsule.className).toContain("rounded-xl");
    const header = capsule.querySelector<HTMLElement>('[data-slot="feedback-inline-header"]')!;
    // header 恒为 w-fit + mx-auto：收起态即胶囊自然宽度，展开态在卡片内居中。
    expect(header.className).toContain("w-fit");
    expect(header.className).toContain("mx-auto");
    // header 必须排在表单区之前（DOM 顺序），展开后 header 位于浮层顶部。
    const region = capsule.querySelector<HTMLElement>('[data-slot="feedback-form-region"]')!;
    expect(header.compareDocumentPosition(region) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(region.getAttribute("data-state")).toBe("open");
    expect(radios(capsule)[3].getAttribute("aria-checked")).toBe("true");
  });

  test("collapses in place with simultaneous width and height easing instead of unmounting", () => {
    mount(<Feedback type="inline" dryRun />);
    act(() => radios(container)[3].click());
    const region = container.querySelector<HTMLElement>('[data-slot="feedback-form-region"]')!;
    expect(region.getAttribute("data-state")).toBe("open");

    // Escape 收起后表单区必须仍在（常驻挂载），高度由 grid-rows 1fr→0fr 过渡还原，
    // 与卡片宽度过渡同步——不允许「淡出后高度瞬间跳回」。
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(region.getAttribute("data-state")).toBe("closed");
    expect(region.getAttribute("aria-hidden")).toBe("true");
    expect(region.hasAttribute("inert")).toBe(true);
    expect(region.className).toContain("grid-rows-[0fr]");
    expect(region.className).toContain("transition-[grid-template-rows]");
    // 曲线必须是先快后缓的非线性（与卡片宽度过渡共用同一条）。
    expect(region.className).toContain("ease-snap");
    expect(container.querySelector('[data-slot="feedback-form-region"]')).toBe(region);
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
    // 表单区与卡片同宽（w-full），高度由 grid 行过渡驱动。
    expect(region.className).toContain("w-full");
    // header 保持 48px 单行，位于浮层顶部。
    expect(header.className).toContain("h-12");
  });

  test("passes the selected topic as the fourth onSubmit argument without polluting metadata", async () => {
    const onSubmit = vi.fn();
    mount(<Feedback metadata={{ source: "docs" }} showTopics onSubmit={onSubmit} />);
    openDefaultFeedback();
    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]')!;

    await selectTopic(popup, "AI");
    act(() => popup.querySelector<HTMLFormElement>("form")?.requestSubmit());

    expect(onSubmit).toHaveBeenCalledWith(undefined, "", { source: "docs" }, "AI");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [, , metadata, reportedTopic] = onSubmit.mock.calls[0] as [unknown, string, unknown, string];
    expect(metadata).toEqual({ source: "docs" });
    expect(reportedTopic).toBe("AI");
  });

  test("only merges topic into metadata when includeTopicInMetadata is enabled", async () => {
    const onSubmit = vi.fn();
    mount(
      <Feedback metadata={{ source: "docs" }} showTopics includeTopicInMetadata onSubmit={onSubmit} />,
    );
    openDefaultFeedback();
    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]')!;

    await selectTopic(popup, "Billing");
    act(() => popup.querySelector<HTMLFormElement>("form")?.requestSubmit());

    expect(onSubmit).toHaveBeenCalledWith(undefined, "", { source: "docs", topic: "Billing" }, "Billing");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test("renders a caller-supplied topics list without showTopics and reports its value", async () => {
    const onTopicChange = vi.fn();
    mount(<Feedback topics={["Imports", "Exports"]} onTopicChange={onTopicChange} />);
    openDefaultFeedback();
    const popup = document.querySelector<HTMLElement>('[data-slot="feedback-popup"]')!;

    // 主题选择器是 Select 组件（Radix），不再有原生 <option>；
    // 选项以 [role="option"] 渲染在 portal 的 select-content 里。
    const options = await openTopicSelect(popup);
    expect(options.map((option) => option.textContent?.trim())).toEqual(["Imports", "Exports"]);

    const target = options.find((option) => option.textContent?.trim() === "Exports")!;
    await act(async () => {
      target.click();
    });

    expect(onTopicChange).toHaveBeenCalledWith("Exports");
  });

  test("never renders the topic selector in the inline variant", () => {
    mount(<Feedback type="inline" dryRun showTopics />);
    act(() => radios(container)[3].click());

    expect(container.querySelector('[data-slot="select-trigger"]')).toBeNull();
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
