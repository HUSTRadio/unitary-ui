// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { RadioGroup, RadioGroupItem } from "../src/components/ui/radio";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root | undefined;

function render(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root!.render(element));
}

function pointerDown(target: Element, options: Partial<PointerEventInit> = {}) {
  const event = new PointerEvent("pointerdown", {
    bubbles: true, cancelable: true, button: 0, isPrimary: true,
    pointerType: "mouse", ...options,
  });
  act(() => target.dispatchEvent(event));
  return event;
}

function option(value = "two") {
  const input = container.querySelector<HTMLInputElement>(`input[value="${value}"]`)!;
  const label = input.closest("label")!;
  return { input, label, text: label.lastElementChild! };
}

afterEach(() => {
  if (root) act(() => root!.unmount());
  root = undefined;
  container?.remove();
  vi.restoreAllMocks();
});

describe("RadioGroupItem pointer focus", () => {
  test.each(["mouse", "touch"])("%s label activation keeps native selection and focuses without scrolling", (pointerType) => {
    const onChange = vi.fn();
    const inputRef = React.createRef<HTMLInputElement>();
    render(
      <main tabIndex={-1}>
        <RadioGroup defaultValue="one" onChange={onChange} name="plan">
          <RadioGroupItem value="one">Option 1</RadioGroupItem>
          <RadioGroupItem value="two" ref={inputRef}>Option 2</RadioGroupItem>
        </RadioGroup>
      </main>,
    );
    const { input, label, text } = option();
    const focus = vi.spyOn(input, "focus");
    expect(inputRef.current).toBe(input);
    expect(pointerDown(text, { pointerType }).defaultPrevented).toBe(true);
    expect(focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true });
    expect(document.activeElement).toBe(input);
    expect(input.checked).toBe(false);
    expect(onChange).not.toHaveBeenCalled();

    act(() => label.click());
    expect(input.checked).toBe(true);
    expect(option("one").input.checked).toBe(false);
    expect(onChange).toHaveBeenCalledExactlyOnceWith("two");

    pointerDown(text, { pointerType });
    act(() => label.click());
    expect(input.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("direct input pointer events preserve the author's cancellation", () => {
    const onPointerDown = vi.fn((event: React.PointerEvent<HTMLInputElement>) => event.preventDefault());
    render(<RadioGroupItem value="two" onPointerDown={onPointerDown}>Option 2</RadioGroupItem>);
    const { input } = option();
    const focus = vi.spyOn(input, "focus");
    expect(pointerDown(input).defaultPrevented).toBe(true);
    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(focus).not.toHaveBeenCalled();
  });

  test("keyboard and blur clear pointer focus while preserving author callbacks", () => {
    const onKeyDownCapture = vi.fn((event: React.KeyboardEvent<HTMLInputElement>) => event.preventDefault());
    const onBlur = vi.fn();
    render(
      <RadioGroup defaultValue="one">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two" onKeyDownCapture={onKeyDownCapture} onBlur={onBlur}>Option 2</RadioGroupItem>
      </RadioGroup>,
    );
    const { input, text } = option();
    pointerDown(text);
    expect(input.hasAttribute("data-uni-pointer-focus")).toBe(true);
    const key = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    act(() => input.dispatchEvent(key));
    expect(input.hasAttribute("data-uni-pointer-focus")).toBe(false);
    expect(onKeyDownCapture).toHaveBeenCalledOnce();
    expect(key.defaultPrevented).toBe(true);
    pointerDown(text);
    expect(input.hasAttribute("data-uni-pointer-focus")).toBe(true);
    act(() => option("one").input.focus());
    expect(input.hasAttribute("data-uni-pointer-focus")).toBe(false);
    expect(onBlur).toHaveBeenCalledOnce();
  });

  test("direct input pointer events retain their native default", () => {
    const onPointerDown = vi.fn();
    render(<RadioGroupItem value="two" onPointerDown={onPointerDown}>Option 2</RadioGroupItem>);
    const { input } = option();
    const focus = vi.spyOn(input, "focus");
    expect(pointerDown(input).defaultPrevented).toBe(false);
    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(focus).not.toHaveBeenCalled();
  });

  test("a child-cancelled pointer event does not trigger focus", () => {
    render(
      <RadioGroupItem value="two">
        <span onPointerDown={(event) => event.preventDefault()}>Cancelled option</span>
      </RadioGroupItem>,
    );
    const { input, text } = option();
    const focus = vi.spyOn(input, "focus");
    expect(pointerDown(text.firstElementChild!).defaultPrevented).toBe(true);
    expect(focus).not.toHaveBeenCalled();
  });

  test.each([
    { name: "non-primary pointer", isPrimary: false, button: 0 },
    { name: "middle button", isPrimary: true, button: 1 },
    { name: "right button", isPrimary: true, button: 2 },
  ])("$name does not trigger focus or cancel the event", ({ isPrimary, button }) => {
    render(<RadioGroupItem value="two">Option 2</RadioGroupItem>);
    const { input, text } = option();
    const focus = vi.spyOn(input, "focus");
    expect(pointerDown(text, { isPrimary, button }).defaultPrevented).toBe(false);
    expect(focus).not.toHaveBeenCalled();
  });

  test.each(["item", "group", "fieldset"])("%s disabled state preserves label activation rules", (disabledBy) => {
    const onChange = vi.fn();
    render(
      <fieldset disabled={disabledBy === "fieldset"}>
        <RadioGroup disabled={disabledBy === "group"} onChange={onChange}>
          <RadioGroupItem disabled={disabledBy === "item" ? true : undefined} value="two">Option 2</RadioGroupItem>
        </RadioGroup>
      </fieldset>,
    );
    const { input, label, text } = option();
    const focus = vi.spyOn(input, "focus");
    expect(input.matches(":disabled")).toBe(true);
    expect(pointerDown(text).defaultPrevented).toBe(false);
    expect(focus).not.toHaveBeenCalled();
    act(() => label.click());
    expect(input.checked).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  test.each([
    { name: "link", child: <a href="#details"><span>Details</span></a> },
    { name: "button", child: <button type="button"><span>Details</span></button> },
    { name: "custom button", child: <span role="button"><span>Details</span></span> },
    { name: "focusable child", child: <span tabIndex={0}><span>Details</span></span> },
    { name: "editable child", child: <span contentEditable suppressContentEditableWarning><span>Details</span></span> },
  ])("nested $name retains its pointer behavior", ({ child }) => {
    render(<RadioGroupItem value="two">{child}</RadioGroupItem>);
    const { input, text } = option();
    const focus = vi.spyOn(input, "focus");
    expect(pointerDown(text.firstElementChild!.firstElementChild!).defaultPrevented).toBe(false);
    expect(focus).not.toHaveBeenCalled();
  });
});
