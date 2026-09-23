// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

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

function Example({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Combobox aria-label="Controlled" open={open} onOpenChange={onOpenChange}>
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="one">One</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}

function expanded() {
  return container.querySelector('[role="combobox"]')?.getAttribute("aria-expanded");
}

/**
 * HIG-AUD-018：`open` 受控契约——组件只上报意图，状态完全由外部驱动。
 */
describe("Combobox controlled open", () => {
  test("reports the intent without opening itself, then follows the prop", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    const onOpenChange = vi.fn();

    act(() => root.render(<Example open={false} onOpenChange={onOpenChange} />));
    const input = container.querySelector<HTMLInputElement>('[role="searchbox"]')!;

    act(() => input.click());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // 外部尚未回写 prop → 内部不得自行打开
    expect(expanded()).toBe("false");

    act(() => root.render(<Example open onOpenChange={onOpenChange} />));
    expect(expanded()).toBe("true");

    act(() => root.render(<Example open={false} onOpenChange={onOpenChange} />));
    expect(expanded()).toBe("false");
  });

  test("uncontrolled mode keeps working when the prop is omitted", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() =>
      root.render(
        <Combobox aria-label="Uncontrolled">
          <ComboboxInput />
          <ComboboxList>
            <ComboboxOption value="one">One</ComboboxOption>
          </ComboboxList>
        </Combobox>,
      ),
    );
    const input = container.querySelector<HTMLInputElement>('[role="searchbox"]')!;

    act(() => input.click());
    expect(expanded()).toBe("true");
  });
});
