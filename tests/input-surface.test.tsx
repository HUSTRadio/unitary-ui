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
 * - wrapper：div[data-geist-input-wrapper][data-version="v1"]；ring = box-shadow 1px
 *   （light #00000014 / dark #ffffff24，即 --color-gray-alpha-400）；radius 6px；
 *   transition-all 0.15s cubic-bezier(0.4,0,0.2,1)。
 * - focus-within：ring 变为 1px --input-focus-border + 4px --input-focus-glow
 *   （light 0.34/0.16，dark 0.51/0.24）。
 * - hover：ring 加深至 --color-gray-alpha-500。
 * - 官方无真实 border（border 由 box-shadow ring 承担）。
 * - input：h36px（default size）、text-sm 字号、px-3；placeholder 前景 50%。
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
    expect(wrapper!.hasAttribute("data-geist-input-wrapper")).toBe(true);
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
    wrapper: container.querySelector("[data-geist-input-wrapper]"),
    field: container.querySelector('[data-slot="input-field"]'),
    label: container.querySelector("label"),
    input: container.querySelector('input[data-slot="input"]'),
    alert: container.querySelector('[role="alert"]'),
  };
}
