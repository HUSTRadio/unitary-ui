// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
} from "@/components/ui/combobox";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
});

function Example({ label }: { label: string }) {
  return (
    <Combobox aria-label={label}>
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="one">One</ComboboxOption>
        <ComboboxOption value="two">Two</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}

function pressKey(input: HTMLInputElement, key: string) {
  act(() => input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true })));
}

describe("Combobox multiple-instance ARIA ownership", () => {
  test("Enter after Escape does not commit a dismissed highlight", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(<Example label="Dismissed selection" />));
    const input = container.querySelector<HTMLInputElement>('[role="searchbox"]')!;
    act(() => input.click());
    pressKey(input, "ArrowDown");
    pressKey(input, "Escape");
    expect(container.querySelector('[role="combobox"]')?.getAttribute("aria-expanded")).toBe("false");
    const before = input.value;
    pressKey(input, "Enter");
    expect(input.value).toBe(before);
  });

  test("generates one unique, existing controlled list id per instance", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(<><Example label="First" /><Example label="Second" /></>));

    const inputs = [...container.querySelectorAll<HTMLInputElement>('[role="searchbox"]')];
    expect(inputs).toHaveLength(2);
    const ids = inputs.map((input) => input.getAttribute("aria-controls"));
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);

    for (const id of ids) {
      expect(document.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
    }
  });

  test("keeps aria-controls and aria-activedescendant inside the opened instance", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(<><Example label="First" /><Example label="Second" /></>));

    const inputs = [...container.querySelectorAll<HTMLInputElement>('[role="searchbox"]')];
    act(() => inputs[1].click());

    const listId = inputs[1].getAttribute("aria-controls");
    const list = document.getElementById(listId!);
    expect(list?.getAttribute("role")).toBe("listbox");
    expect(list?.querySelectorAll('[role="option"]')).toHaveLength(2);
    const activeId = inputs[1].getAttribute("aria-activedescendant");
    expect(activeId).toBeTruthy();
    expect(list?.querySelector(`[id="${activeId}"]`)).not.toBeNull();
    expect(inputs[0].getAttribute("aria-controls")).not.toBe(listId);
  });

  test("opens from the searchbox keyboard path, including an empty list", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() =>
      root.render(
        <Combobox aria-label="Empty">
          <ComboboxInput />
          <ComboboxList emptyMessage="No results" />
        </Combobox>,
      ),
    );

    const input = container.querySelector<HTMLInputElement>('[role="searchbox"]')!;
    input.focus();
    pressKey(input, "ArrowDown");
    const combobox = container.querySelector('[role="combobox"]')!;
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
    const list = document.getElementById(input.getAttribute("aria-controls")!);
    expect(list?.getAttribute("role")).toBe("listbox");
    expect(list?.textContent).toContain("No results");
  });
});
