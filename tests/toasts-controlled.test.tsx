// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { Toasts, createToastStore, useToasts } from "@/components/ui/toast";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
  vi.useRealTimers();
});

function render(node: React.ReactNode) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(node));
}

const itemsIn = (testId: string) =>
  document.querySelectorAll<HTMLLIElement>(`[data-testid="${testId}"] li`);

/** HIG-AUD-018：toast 状态可由注入 store 完全驱动，且默认全局 store 行为不变。 */
describe("Toasts injectable store", () => {
  test("an injected store fully drives its own viewport, isolated from others", () => {
    const mine = createToastStore();
    const other = createToastStore();

    render(
      <>
        <Toasts data-testid="mine" store={mine} />
        <Toasts data-testid="other" store={other} />
      </>,
    );

    expect(itemsIn("mine")).toHaveLength(0);
    act(() => {
      mine.success("Mine");
    });
    expect(itemsIn("mine")).toHaveLength(1);
    expect(itemsIn("mine")[0]!.textContent).toContain("Mine");
    // 另一个 store（此前是同一个全局单例）不受影响
    expect(itemsIn("other")).toHaveLength(0);

    // 关闭走注入 store 的 dismiss：退场驻留一个过渡时长后真正出栈
    const id = mine.getSnapshot()[0]!.id;
    act(() => {
      mine.dismiss(id);
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(itemsIn("mine")).toHaveLength(0);
  });

  test("useToasts(store) pushes into the injected store", () => {
    const store = createToastStore();

    function Probe() {
      const toasts = useToasts(store);
      return (
        <button type="button" onClick={() => toasts.error("From probe")}>
          push
        </button>
      );
    }

    render(
      <>
        <Probe />
        <Toasts store={store} />
      </>,
    );

    act(() => {
      container.querySelector<HTMLButtonElement>("button")!.click();
    });
    expect(document.querySelectorAll('[data-slot="toasts"] li')).toHaveLength(1);
    expect(document.querySelector('[data-slot="toasts"]')?.textContent).toContain("From probe");
    expect(store.getSnapshot()).toHaveLength(1);
  });

  test("omitting store keeps the default global store working", () => {
    function Probe() {
      const toasts = useToasts();
      return (
        <button type="button" onClick={() => toasts.message({ text: "Default store" })}>
          push
        </button>
      );
    }

    render(
      <>
        <Probe />
        <Toasts />
      </>,
    );

    act(() => {
      container.querySelector<HTMLButtonElement>("button")!.click();
    });
    expect(document.querySelector('[data-slot="toasts"]')?.textContent).toContain("Default store");
  });

  test("auto-dismiss timer is bound to the injected store", () => {
    const store = createToastStore();
    render(<Toasts store={store} />);

    act(() => {
      store.message({ text: "Fades", duration: 100 });
    });
    expect(document.querySelectorAll('[data-slot="toasts"] li')).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(120);
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(document.querySelectorAll('[data-slot="toasts"] li')).toHaveLength(0);
    expect(store.getSnapshot()).toHaveLength(0);
  });
});
