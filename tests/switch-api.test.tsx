// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Switch, SwitchControl } from "../src/components/ui/switch";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(repoRoot, relativePath), "utf8");

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let reactRoot: Root;

function render(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.appendChild(container);
  reactRoot = createRoot(container);
  act(() => reactRoot.render(element));
}

function items(): HTMLButtonElement[] {
  return Array.from(container.querySelectorAll<HTMLButtonElement>('[data-slot="switch-control"]'));
}

function checkedValues(): string[] {
  return items()
    .filter((item) => item.getAttribute("aria-checked") === "true")
    .map((item) => item.getAttribute("value") ?? "");
}

async function pressKey(target: HTMLElement, key: string) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  });
  // Radix roving focus moves on a setTimeout(0) after the keydown; flush it so
  // the next press starts from the settled focus (as it would for a human).
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

afterEach(() => {
  act(() => reactRoot.unmount());
  container.remove();
});

describe("Switch official API contract (G11)", () => {
  test("G11-SW-01: ArrowRight/ArrowLeft move focus AND change selection (auto-activate)", async () => {
    render(
      <Switch name="view-mode">
        <SwitchControl defaultChecked label="Preview" value="preview" />
        <SwitchControl label="Code" value="code" />
        <SwitchControl label="Split" value="split" />
      </Switch>,
    );

    const [preview, code, split] = items();
    expect(checkedValues()).toEqual(["preview"]);

    act(() => preview.focus());
    expect(document.activeElement).toBe(preview);

    // One ArrowRight press: selection changes in the same step (native radio semantics).
    await pressKey(preview, "ArrowRight");
    expect(checkedValues()).toEqual(["code"]);
    expect(document.activeElement).toBe(code); // focus roved in the same keypress

    await pressKey(code, "ArrowRight");
    expect(checkedValues()).toEqual(["split"]);

    await pressKey(split, "ArrowLeft");
    expect(checkedValues()).toEqual(["code"]);
  });

  test("G11-SW-01: ArrowDown/ArrowUp also auto-activate", async () => {
    render(
      <Switch name="view-mode">
        <SwitchControl defaultChecked label="Preview" value="preview" />
        <SwitchControl label="Code" value="code" />
      </Switch>,
    );

    const [preview, code] = items();
    act(() => preview.focus());

    await pressKey(preview, "ArrowDown");
    expect(checkedValues()).toEqual(["code"]);

    await pressKey(code, "ArrowUp");
    expect(checkedValues()).toEqual(["preview"]);
  });

  test("G11-SW-01: Home/End jump to first/last and select", async () => {
    render(
      <Switch name="view-mode">
        <SwitchControl label="Preview" value="preview" />
        <SwitchControl defaultChecked label="Code" value="code" />
        <SwitchControl label="Split" value="split" />
      </Switch>,
    );

    const [preview, code] = items();
    act(() => code.focus());

    await pressKey(code, "Home");
    expect(checkedValues()).toEqual(["preview"]);
    expect(document.activeElement).toBe(preview);

    await pressKey(preview, "End");
    expect(checkedValues()).toEqual(["split"]);
  });

  test("G11-SW-01: wraps around at the edges (matches roving focus loop)", async () => {
    render(
      <Switch name="view-mode">
        <SwitchControl defaultChecked label="Preview" value="preview" />
        <SwitchControl label="Code" value="code" />
      </Switch>,
    );

    const [preview, code] = items();
    act(() => preview.focus());

    // Backward wrap: ArrowLeft on the first item selects the last.
    await pressKey(preview, "ArrowLeft");
    expect(checkedValues()).toEqual(["code"]);

    // Forward wrap: ArrowRight on the last item selects the first.
    await pressKey(code, "ArrowRight");
    expect(checkedValues()).toEqual(["preview"]);
  });

  test("G11-SW-01: disabled controls are skipped", async () => {
    render(
      <Switch name="view-mode">
        <SwitchControl defaultChecked label="Preview" value="preview" />
        <SwitchControl disabled label="Code" value="code" />
        <SwitchControl label="Split" value="split" />
      </Switch>,
    );

    const [preview] = items();
    act(() => preview.focus());

    await pressKey(preview, "ArrowRight");
    expect(checkedValues()).toEqual(["split"]);
  });

  test("G11-SW-01: controlled usage — arrow keys fire onValueChange with the next value", async () => {
    const onValueChange = vi.fn();
    render(
      <Switch name="view-mode" value="preview" onValueChange={onValueChange}>
        <SwitchControl label="Preview" value="preview" />
        <SwitchControl label="Code" value="code" />
      </Switch>,
    );

    const [preview] = items();
    act(() => preview.focus());

    await pressKey(preview, "ArrowRight");
    expect(onValueChange).toHaveBeenCalledWith("code");
  });

  test("G11-SW-01: source implements arrow-key auto-activation", async () => {
    const src = await read("src/components/ui/switch.tsx");
    expect(src).toMatch(/case "ArrowRight"/);
    expect(src).toMatch(/case "ArrowLeft"/);
    expect(src).toMatch(/case "Home"/);
    expect(src).toMatch(/case "End"/);
    expect(src).toMatch(/target\.click\(\)/);
    expect(src).toMatch(/onKeyDown/);
  });
});
