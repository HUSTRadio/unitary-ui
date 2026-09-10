// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Slider } from "../src/components/ui/slider";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 未实现 ResizeObserver（Radix use-size 需要）
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(props: React.ComponentProps<typeof Slider>, strict = false) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root.render(strict ? <React.StrictMode><Slider {...props} /></React.StrictMode> : <Slider {...props} />),
  );
}

function valueInputs(): HTMLInputElement[] {
  // Start 输入框 type=text，End 输入框默认 type=number；Radix 隐藏原生输入是
  // type=range / display:none 的 number，用 aria-label 精确锚定两个 ValueInput。
  return [
    container.querySelector<HTMLInputElement>('input[aria-label="Starting range value"]')!,
    container.querySelector<HTMLInputElement>('input[aria-label="Ending range value"]')!,
  ];
}

/** 模拟用户键入后 blur 提交（ValueInput 的 commit 路径）。
 * 必须用原型原生 setter 写值，绕过 React 的 value 跟踪，否则变更被忽略。 */
function commitInput(input: HTMLInputElement, text: string) {
  act(() => {
    input.focus();
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, text);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  act(() => {
    input.blur();
    input.dispatchEvent(new FocusEvent("blur"));
  });
}

describe("Slider range manual input cross clamp", () => {
  test("start above end collapses to [next, next]", () => {
    const onValueChange = vi.fn();
    mount({
      defaultValue: [50, 75],
      showStartInput: true,
      showEndInput: true,
      "aria-label": "Range",
      onValueChange,
    });

    const [start] = valueInputs();
    commitInput(start!, "80");

    expect(onValueChange).toHaveBeenCalledWith([80, 80]);
  });

  test("end below start collapses to [next, next]", () => {
    const onValueChange = vi.fn();
    mount({
      defaultValue: [50, 75],
      showStartInput: true,
      showEndInput: true,
      "aria-label": "Range",
      onValueChange,
    });

    const [, end] = valueInputs();
    commitInput(end!, "20");

    expect(onValueChange).toHaveBeenCalledWith([20, 20]);
  });

  test("in-range start update only replaces its own slot", () => {
    const onValueChange = vi.fn();
    mount({
      defaultValue: [50, 75],
      showStartInput: true,
      showEndInput: true,
      "aria-label": "Range",
      onValueChange,
    });

    const [start] = valueInputs();
    commitInput(start!, "60");

    expect(onValueChange).toHaveBeenCalledWith([60, 75]);
  });

  test("single-value slider never enters the clamp branch", () => {
    const onValueChange = vi.fn();
    mount({
      defaultValue: [50],
      showStartInput: true,
      showEndInput: true,
      "aria-label": "Volume",
      onValueChange,
    });

    const [only] = valueInputs();
    commitInput(only!, "80");

    // 单值滑块两个输入框都绑 index 0，正常写入不折叠
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith([80]);
  });

  test("controlled slider forwards Radix keyboard changes to onValueChange", () => {
    const onValueChange = vi.fn();
    mount({ value: [50], "aria-label": "Volume", onValueChange });

    const thumb = container.querySelector<HTMLElement>('[data-slot="slider-thumb"]')!;
    act(() => {
      thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith([51]);
  });

  test("defers keyboard commit callbacks beyond the Radix state updater", async () => {
    const onValueCommit = vi.fn();
    const onValueCommitted = vi.fn();
    mount({ defaultValue: [50], "aria-label": "Volume", onValueCommit, onValueCommitted });

    const thumb = container.querySelector<HTMLElement>('[data-slot="slider-thumb"]')!;
    act(() => {
      thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });

    // Radix invokes onValueCommit from inside its state updater for keyboard input.
    // Deferring keeps consumer setState calls out of another component's render phase.
    expect(onValueCommit).not.toHaveBeenCalled();
    expect(onValueCommitted).not.toHaveBeenCalled();
    await act(async () => Promise.resolve());
    expect(onValueCommit).toHaveBeenCalledWith([51]);
    expect(onValueCommitted).toHaveBeenCalledWith([51]);
    expect(onValueCommit.mock.invocationCallOrder[0]).toBeLessThan(
      onValueCommitted.mock.invocationCallOrder[0]!,
    );
  });

  test("does not duplicate deferred commit callbacks in StrictMode", async () => {
    const onValueCommitted = vi.fn();
    mount({ defaultValue: [50], "aria-label": "Volume", onValueCommitted }, true);

    const thumb = container.querySelector<HTMLElement>('[data-slot="slider-thumb"]')!;
    act(() => {
      thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });
    await act(async () => Promise.resolve());

    expect(onValueCommitted).toHaveBeenCalledTimes(1);
    expect(onValueCommitted).toHaveBeenCalledWith([51]);
  });

  test("collapsed value is reflected back into both inputs after commit", () => {
    const onValueChange = vi.fn();
    mount({
      defaultValue: [50, 75],
      showStartInput: true,
      showEndInput: true,
      "aria-label": "Range",
      onValueChange,
    });

    const [start, end] = valueInputs();
    commitInput(start!, "80");

    // 受控消费方回写 [80,80] 后，两个输入框都应显示 80
    act(() => {
      root.render(
        <Slider
          value={[80, 80]}
          showStartInput
          showEndInput
          aria-label="Range"
          onValueChange={onValueChange}
        />,
      );
    });
    expect(start!.value).toBe("80");
    expect(end!.value).toBe("80");
  });
});
