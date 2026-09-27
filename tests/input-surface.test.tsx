// @vitest-environment jsdom
import { createRoot } from "react-dom/client";
import { act } from "react";
import { describe, expect, test } from "vitest";

import { Input } from "@/components/ui/input";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Task 10 / B0 `input-wrapper` TDD 契约。
 *
 * 数值与结构来源：官方实时 Input 全部 demo DOM/computed style（2026-08-11）
 * + design 台账 §1.2。
 * - wrapper：div[data-uni-input-wrapper][data-version="v1"]；ring = box-shadow 1px
 *   （light #00000014 / dark #ffffff24，即 --color-gray-alpha-400）；radius 6px；
 *   transition-all 0.15s cubic-bezier(0.4,0,0.2,1)。
 * - focus-within：ring 变为 1px --input-focus-border + 4px --input-focus-glow
 *   （light 0.34/0.16，dark 0.51/0.24）。
 * - hover：ring 加深至 --color-gray-alpha-500。
 * - 官方无真实 border（border 由 box-shadow ring 承担）。
 * - input：h36px（default size）、text-sm 字号、外侧留白 12px（px-3）；
 *   紧邻 styled affix 分隔线的一侧缩半档到 10px（pl-2.5/pr-2.5）；placeholder 前景 50%。
 *
 * 本切片只锁定 input.tsx 的 wrapper 契约（data 属性 + ring 结构）；ClearableInput
 * 的 kbd Esc 清除控件属于组件级 Task（B1），不在本文件断言。
 */
describe("Input wrapper contract (B0 input-wrapper)", () => {
  test("every input, including bare input, has an immediate official wrapper", () => {
    const { input, wrapper } = renderInput({});
    expect(input).not.toBeNull();
    expect(input!.getAttribute("data-slot")).toBe("input");
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).toContain("h-9");
    expect(input!.className).toContain("h-full");
    expect(input!.parentElement).toBe(wrapper);
    expect(wrapper!.getAttribute("data-version")).toBe("v1");
  });

  test("regression: label renders associated label + id", () => {
    const { label, input } = renderInput({ label: "Name", onChange: () => {} });
    expect(label).not.toBeNull();
    const inputId = input!.getAttribute("id");
    expect(inputId).toBeTruthy();
    expect(label!.getAttribute("for")).toBe(inputId);
  });

  test("label field stays outside the ring wrapper", () => {
    const { field, label, wrapper } = renderInput({ label: "Name", onChange: () => {} });
    expect(wrapper).not.toBeNull();
    expect(wrapper!.hasAttribute("data-uni-input-wrapper")).toBe(true);
    expect(wrapper!.getAttribute("data-version")).toBe("v1");
    expect(field).not.toBeNull();
    expect(label!.parentElement).toBe(field);
    expect(wrapper!.parentElement).toBe(field);
  });

  test("official wrapper uses box-shadow ring, no real border", () => {
    const { wrapper } = renderInput({ label: "Name", onChange: () => {} });
    expect(wrapper!.className).toContain("bg-background-100");
    expect(wrapper!.className).not.toMatch(/(?:^|\s)bg-background(?:\s|$)/);
    expect(wrapper!.className).toContain("shadow-[0_0_0_1px_var(--color-gray-alpha-400)]");
    expect(wrapper!.className).not.toContain("border ");
    expect(wrapper!.className).not.toContain("border-");
  });

  test("official wrapper ring deepens on hover and focus-within (1px + 4px structure)", () => {
    const { wrapper } = renderInput({ label: "Name", onChange: () => {} });
    expect(wrapper!.className).toContain("hover:shadow-[0_0_0_1px_var(--color-gray-alpha-500)]");
    expect(wrapper!.className).toContain(
      "focus-within:!shadow-[0_0_0_1px_var(--input-focus-border),0_0_0_4px_var(--input-focus-glow)]",
    );
  });

  test("error-only input remains rendered and described by its alert", () => {
    const { input, alert } = renderInput({ error: "Project name is required." });
    expect(input).not.toBeNull();
    expect(alert).not.toBeNull();
    expect(input!.getAttribute("aria-invalid")).toBe("true");
    expect(input!.getAttribute("aria-describedby")).toContain(alert!.id);
  });

  test("disabled state preserves styled affix roles and only merges plain affixes into the body", () => {
    const styled = renderInput({
      disabled: true,
      prefix: "https://",
      suffix: ".com",
      onChange: () => {},
    });
    const plain = renderInput({
      disabled: true,
      prefix: "https://",
      prefixStyling: false,
      suffix: ".com",
      suffixStyling: false,
      onChange: () => {},
    });

    expect(styled.prefix!.getAttribute("data-styling")).toBe("styled");
    expect(styled.suffix!.getAttribute("data-styling")).toBe("styled");
    expect(styled.prefix!.className).toContain("bg-background-200");
    expect(styled.suffix!.className).toContain("bg-background-200");

    expect(plain.prefix!.getAttribute("data-styling")).toBe("plain");
    expect(plain.suffix!.getAttribute("data-styling")).toBe("plain");
    expect(plain.wrapper!.className).toContain(
      "has-[input:disabled]:[&_[data-slot=input-prefix][data-styling=plain]]:bg-gray-100",
    );
    expect(plain.wrapper!.className).toContain(
      "has-[input:disabled]:[&_[data-slot=input-suffix][data-styling=plain]]:bg-gray-100",
    );
    expect(plain.wrapper!.className).not.toContain(
      "has-[input:disabled]:[&_[data-slot=input-prefix]]:bg-gray-100",
    );
    expect(plain.wrapper!.className).not.toContain(
      "has-[input:disabled]:[&_[data-slot=input-suffix]]:bg-gray-100",
    );
  });

  test("styled prefix, input, and suffix form one flush three-segment control", () => {
    const { wrapper, prefix, input, suffix } = renderInput({
      prefix: "https://",
      suffix: ".com",
      onChange: () => {},
    });

    expect(wrapper!.className).toContain("text-copy-14");
    // 分隔线两侧的文字留空各缩半档（12 → 10px）：装饰段外侧仍是 12px
    expect(prefix!.className).toContain("pl-3 pr-2.5");
    expect(prefix!.className).toContain("border-r");
    expect(suffix!.className).toContain("pl-2.5 pr-3");
    expect(suffix!.className).toContain("border-l");
    expect(input!.className).toContain("pl-2.5");
    expect(input!.className).toContain("pr-2.5");

    for (const segment of [prefix, input, suffix]) {
      expect(segment!.className).not.toMatch(/(?:^|\s)m[lr]-\S+/);
    }
  });

  test("bare input keeps the 12px outer padding", () => {
    const { input } = renderInput({});
    expect(input!.className).toContain("pl-3");
    expect(input!.className).toContain("pr-3");
    expect(input!.className).not.toContain("pl-2.5");
    expect(input!.className).not.toContain("pr-2.5");
  });

  test("plain affixes keep 12px spacing and only cancel the input padding on the prefix side", () => {
    const { prefix, input, suffix } = renderInput({
      prefix: "https://",
      prefixStyling: false,
      suffix: ".com",
      suffixStyling: false,
      onChange: () => {},
    });

    expect(prefix!.className).toContain("px-3");
    expect(prefix!.className).toContain("-mr-3");
    expect(suffix!.className).toContain("px-3");
    // 无分隔线 → 不做半档收缩，input 仍是 12px
    expect(input!.className).toContain("pl-3");
    expect(input!.className).toContain("pr-3");
  });

  test("rounded variant chips sync the pill radius (no right-angle corners in capsule)", () => {
    const { container } = renderInput({
      rounded: true,
      prefix: "$",
      suffix: "USD",
      onChange: () => {},
    });
    const prefix = container.querySelector('[data-slot="input-prefix"]');
    const suffix = container.querySelector('[data-slot="input-suffix"]');
    expect(prefix!.className).toContain("rounded-full");
    expect(suffix!.className).toContain("rounded-full");
  });
});

/** 渲染 Input，返回 wrapper/label/input 元素。 */
function renderInput(props: Record<string, unknown>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(<Input {...props} />);
  });
  return {
    container,
    wrapper: container.querySelector("[data-uni-input-wrapper]"),
    field: container.querySelector('[data-slot="input-field"]'),
    label: container.querySelector("label"),
    input: container.querySelector('input[data-slot="input"]'),
    prefix: container.querySelector('[data-slot="input-prefix"]'),
    suffix: container.querySelector('[data-slot="input-suffix"]'),
    alert: container.querySelector('[role="alert"]'),
  };
}
