// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { ClearableInput } from "@/components/ui/clearable-input";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const cleanups: Array<() => void> = [];

afterEach(() => {
  while (cleanups.length > 0) cleanups.pop()?.();
});

function renderInput(props: React.ComponentProps<typeof ClearableInput>) {
  const container = document.createElement("div");
  document.body.append(container);
  const root: Root = createRoot(container);

  act(() => root.render(<ClearableInput {...props} />));
  cleanups.push(() => {
    act(() => root.unmount());
    container.remove();
  });

  return {
    container,
    input: container.querySelector("input")!,
    wrapper: container.querySelector<HTMLElement>("[data-geist-input-wrapper]")!,
  };
}

function click(element: Element) {
  act(() => element.dispatchEvent(new MouseEvent("click", { bubbles: true })));
}

function keydown(element: Element, key: string) {
  act(() => element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true })));
}

function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

/**
 * Task 10 / B1 Clearable Input contract.
 * Source: live https://vercel.com/geist/clearable-input DOM/computed styles (2026-08-11),
 * persisted in C:/Users/Leon/geist-audit/phase-e/clearable-input/evidence-live.md.
 */
describe("ClearableInput official runtime contract", () => {
  test("renders the official v1 wrapper and native input defaults", () => {
    const { input, wrapper } = renderInput({ "aria-label": "Search" });

    expect(wrapper.getAttribute("data-version")).toBe("v1");
    expect(wrapper.hasAttribute("data-geist-input-wrapper")).toBe(true);
    expect(input.hasAttribute("data-geist-input")).toBe(true);
    expect(input.getAttribute("spellcheck")).toBe("false");
    expect(input.autocomplete).toBe("off");
    expect(input.getAttribute("autocapitalize")).toBe("none");
    expect(input.getAttribute("autocorrect")).toBe("off");
    expect(input.getAttribute("aria-invalid")).toBe("false");
  });

  test("label is associated with the input and component-only props do not leak", () => {
    const { container, input, wrapper } = renderInput({ label: "Email", cmdk: true });
    const label = container.querySelector<HTMLLabelElement>("label[data-version='v1']")!;

    expect(label).not.toBeNull();
    expect(label.htmlFor).toBe(input.id);
    expect(label.textContent).toContain("Email");
    expect(label.contains(wrapper)).toBe(true);
    expect(label.firstElementChild!.className).toContain("text-[13px]");
    expect(label.firstElementChild!.className).toContain("leading-[1.5]");
    expect(input.getAttribute("aria-label")).toBe("Email");
    expect(input.hasAttribute("label")).toBe(false);
    expect(input.hasAttribute("cmdk")).toBe(false);
  });

  test("empty value has no suffix unless cmdk is enabled", () => {
    const plain = renderInput({ "aria-label": "Plain", value: "", onChange: () => {} });
    expect(plain.container.querySelector("[data-geist-input-suffix]")).toBeNull();

    const command = renderInput({
      "aria-label": "Command",
      cmdk: true,
      value: "",
      onChange: () => {},
    });
    const suffix = command.container.querySelector<HTMLElement>("[data-geist-input-suffix]")!;
    expect(suffix.getAttribute("aria-hidden")).toBe("true");
    expect(suffix.textContent).toContain("Esc");
    expect(suffix.textContent).toContain("⌘K");
    expect(suffix.querySelectorAll("kbd")).toHaveLength(2);
    expect(suffix.firstElementChild?.className).toContain("max-grid-md:hidden");
  });

  test("a value renders an aria-hidden inline Esc keycap clear segment", () => {
    const { container, input } = renderInput({ defaultValue: "geist" });
    const suffix = container.querySelector<HTMLElement>("[data-geist-input-suffix]")!;
    const button = suffix.querySelector("button")!;
    const kbd = button.querySelector("kbd")!;

    expect(input.nextElementSibling).toBe(suffix);
    expect(suffix.getAttribute("aria-hidden")).toBe("true");
    expect(button.type).toBe("button");
    expect(button.className).toContain("pointer-coarse:hidden");
    expect(button.className).toContain("px-2.5");
    expect(button.className).toContain("rounded-r-md");
    expect(button.className).toContain("focus-visible:outline-solid");
    expect(button.className).toContain("focus-visible:outline-[var(--ds-focus-color)]");
    expect(kbd.textContent).toBe("Esc");
    expect(kbd.getAttribute("data-slot")).toBe("kbd");
    expect(kbd.className).toContain("font-sans!");
    expect(kbd.className).toContain("text-[var(--ds-gray-900)]");
    expect(button.querySelector("svg")).toBeNull();
  });

  test("uncontrolled click and Escape clear the value and call onClear", () => {
    const onClear = vi.fn();
    const first = renderInput({ defaultValue: "one", onClear });
    click(first.container.querySelector("button")!);
    expect(first.input.value).toBe("");
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(first.container.querySelector("button")).toBeNull();

    const second = renderInput({ defaultValue: "two", onClear });
    keydown(second.input, "Escape");
    expect(second.input.value).toBe("");
    expect(onClear).toHaveBeenCalledTimes(2);
  });

  test("controlled clear emits an empty change that updates parent state", () => {
    const onClear = vi.fn();
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    function Harness() {
      const [value, setValue] = React.useState("controlled");
      return (
        <ClearableInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onClear={onClear}
        />
      );
    }

    act(() => root.render(<Harness />));
    cleanups.push(() => {
      act(() => root.unmount());
      container.remove();
    });

    click(container.querySelector("button")!);
    expect(container.querySelector("input")!.value).toBe("");
    expect(container.querySelector("button")).toBeNull();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  test("typing updates an uncontrolled value and reveals the clear suffix", () => {
    const { container, input } = renderInput({ "aria-label": "Search" });
    setNativeValue(input, "query");
    expect(input.value).toBe("query");
    expect(container.querySelector("[data-geist-input-suffix]")).not.toBeNull();
  });

  test("disabled blocks click and Escape clearing and removes the button from tab order", () => {
    const onClear = vi.fn();
    const { container, input } = renderInput({ defaultValue: "locked", disabled: true, onClear });
    const button = container.querySelector("button")!;
    const suffix = container.querySelector<HTMLElement>("[data-geist-input-suffix]")!;

    expect(button.tabIndex).toBe(-1);
    expect(suffix.className).toContain("bg-[var(--ds-gray-100)]");
    expect(button.querySelector("kbd")!.className).toContain("bg-background-100");
    expect(button.querySelector("kbd")!.className).toContain("text-[var(--ds-gray-900)]");
    expect(button.querySelector("kbd")!.className).not.toContain("bg-[var(--ds-gray-100)]");
    click(button);
    keydown(input, "Escape");
    expect(input.value).toBe("locked");
    expect(onClear).not.toHaveBeenCalled();
  });

  test("surface classes use official ring, hover, focus, disabled and motion contracts", () => {
    const { input, wrapper } = renderInput({ defaultValue: "surface", disabled: true });

    expect(wrapper.className).toContain("shadow-[0_0_0_1px_var(--ds-gray-alpha-400)]");
    expect(wrapper.className).toContain("hover:shadow-[0_0_0_1px_var(--color-gray-alpha-500)]");
    expect(wrapper.className).toContain(
      "focus-within:!shadow-[0_0_0_1px_var(--input-focus-border),0_0_0_4px_var(--input-focus-glow)]",
    );
    expect(wrapper.className).toContain("transition-all");
    expect(wrapper.className).toContain("duration-150");
    expect(wrapper.className).not.toContain("border ");
    expect(input.className).toContain("disabled:bg-[var(--ds-gray-100)]");
    expect(input.className).toContain("disabled:text-[var(--ds-gray-700)]");
    expect(input.className).toContain("placeholder:text-foreground/50");
    expect(input.className).toContain(
      "disabled:placeholder:!text-[var(--input-disabled-placeholder)]",
    );
  });
});
