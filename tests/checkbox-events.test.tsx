// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { Checkbox } from "@/components/ui/checkbox";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

async function renderCheckbox(node: React.ReactNode) {
  await act(async () => {
    root.render(node);
  });
  return container.querySelector("input")!;
}

describe("Checkbox uncontrolled support (framework extension)", () => {
  test("toggles internally when only defaultChecked is given", async () => {
    const input = await renderCheckbox(<Checkbox defaultChecked aria-label="subscribe" />);
    expect(input.checked).toBe(true);

    await act(async () => {
      input.click();
    });
    expect(input.checked).toBe(false);

    await act(async () => {
      input.click();
    });
    expect(input.checked).toBe(true);
  });

  test("stays fully controlled when checked is provided", async () => {
    const onChange = vi.fn();
    const input = await renderCheckbox(
      <Checkbox checked={false} onChange={onChange} aria-label="subscribe" />,
    );

    await act(async () => {
      input.click();
    });
    expect(input.checked).toBe(false); // 未写回则不变
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
