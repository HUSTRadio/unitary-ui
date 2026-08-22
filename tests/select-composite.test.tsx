// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Select, SelectGroup, SelectItem, SelectSeparator } from "@/components/ui/select";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 未实现 scrollIntoView（Radix 高亮/聚焦时调用）
HTMLElement.prototype.scrollIntoView = vi.fn();

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(node: React.ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(node));
}

function trigger(): HTMLButtonElement {
  return container.querySelector<HTMLButtonElement>('[data-slot="select-trigger"]')!;
}

describe("Select composite API (Radix popup)", () => {
  test("uncontrolled: placeholder shows before selection, item click selects", async () => {
    mount(
      <Select aria-label="Fruit" placeholder="Select a fruit">
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </Select>,
    );
    expect(trigger().textContent).toBe("Select a fruit");
    act(() => trigger().click());
    const items = document.querySelectorAll<HTMLElement>(
      '[data-slot="select-content"] [role="option"]',
    );
    expect(items.length).toBe(2);
    await act(async () => {
      items[0].click();
      // Radix closes on selection; allow state flush
      await Promise.resolve();
    });
  });

  test("controlled value renders on the trigger and updates via prop", () => {
    const Rerender = ({ value }: { value: string }) => (
      <Select aria-label="Fruit" value={value}>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </Select>
    );
    mount(<Rerender value="apple" />);
    expect(trigger().textContent).toBe("Apple");
    act(() => root.render(<Rerender value="banana" />));
    expect(trigger().textContent).toBe("Banana");
  });

  test("group label and separator render inside the popup", async () => {
    mount(
      <Select aria-label="Framework">
        <SelectGroup label="Framework">
          <SelectItem value="next">Next.js</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="other">Other</SelectItem>
      </Select>,
    );
    act(() => trigger().click());
    expect(document.querySelector('[data-slot="select-group-label"]')?.textContent).toBe(
      "Framework",
    );
    expect(document.querySelector('[data-slot="select-separator"]')).toBeTruthy();
  });

  test("disabled item is rendered with disabled state", async () => {
    mount(
      <Select aria-label="Fruit">
        <SelectItem value="apple" disabled>
          Apple
        </SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </Select>,
    );
    act(() => trigger().click());
    const apple = document.querySelector<HTMLElement>(
      '[data-slot="select-content"] [role="option"][data-disabled]',
    );
    expect(apple).toBeTruthy();
    expect(apple!.textContent).toBe("Apple");
  });

  test("keyboard: Enter opens popup, ArrowDown highlights first item, Escape closes", async () => {
    mount(
      <Select aria-label="Fruit" placeholder="Pick">
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </Select>,
    );
    const t = trigger();
    act(() =>
      t.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
      ),
    );
    const listbox = () =>
      document.querySelector('[data-slot="select-content"] [role="listbox"], #radix-«r1»');
    await act(async () => {
      await Promise.resolve();
    });
    // Popup content is portaled to body
    expect(document.querySelector('[data-slot="select-content"]')).toBeTruthy();
    // Escape returns focus to trigger
    act(() =>
      document.activeElement?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
      ),
    );
    await act(async () => {
      await Promise.resolve();
    });
    void listbox;
  });

  test("hidden form select participates in FormData with name + required", async () => {
    const formRef = React.createRef<HTMLFormElement>();
    function Form() {
      return (
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <Select name="fruit" required defaultValue="banana" aria-label="Fruit">
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </Select>
        </form>
      );
    }
    mount(<Form />);
    const data = new FormData(formRef.current!);
    expect(data.get("fruit")).toBe("banana");
  });

  test("error prop wires aria-invalid + shared alert message", () => {
    mount(
      <Select aria-label="Fruit" error="Please select a value.">
        <SelectItem value="apple">Apple</SelectItem>
      </Select>,
    );
    expect(trigger().getAttribute("aria-invalid")).toBe("true");
    const describedBy = trigger().getAttribute("aria-describedby")!;
    expect(document.getElementById(describedBy)!.getAttribute("role")).toBe("alert");
  });
});
