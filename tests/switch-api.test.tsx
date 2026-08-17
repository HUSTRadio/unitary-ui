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

function radios(): HTMLInputElement[] {
  return Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
}

function checkedValues(): string[] {
  return radios()
    .filter((input) => input.checked)
    .map((input) => input.value);
}

async function pressKey(target: HTMLElement, key: string) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

afterEach(() => {
  if (reactRoot) act(() => reactRoot.unmount());
  container?.remove();
});

describe("Switch live official contract", () => {
  test("control transitions all selected-state properties over the official 200ms curve", async () => {
    const source = await read("src/components/ui/switch.tsx");
    expect(source).toContain("transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]");
  });

  test("inventory and docs cover all six live demos", async () => {
    const docs = await read("docs/geist/src/components/docs-components-page.tsx");
    const manifest = JSON.parse(await read("tests/audit/geist-audit-manifest.json"));
    const entry = manifest.components.find((item: { slug: string }) => item.slug === "switch");
    const expected = ["default", "disabled", "sizes", "full-width", "tooltip", "icon"];

    expect(expected.every((id) => docs.includes(`data-demo-card="${id}"`))).toBe(true);
    expect(entry.inventoryStatus).toBe("live_enumeration_complete");
    expect(entry.demos.map((item: { id: string }) => item.id)).toEqual(expected.map((id) => id));
    expect(entry.acceptanceContracts.map((item: { demoId: string }) => item.demoId)).toEqual(
      expected,
    );
  });

  test("renders native radios inside labels with the official visible-control structure", () => {
    render(
      <Switch name="default">
        <SwitchControl defaultChecked label="Source" value="source" />
        <SwitchControl label="Output" value="output" />
      </Switch>,
    );

    const [source, output] = radios();
    expect(source.name).toBe("default");
    expect(source.checked).toBe(true);
    expect(output.checked).toBe(false);
    expect(source.className).toContain("sr-only");
    expect(source.parentElement?.tagName).toBe("LABEL");
    expect(source.parentElement?.dataset.disabled).toBe("false");
    expect(source.getAttribute("aria-label")).toBeNull();
    expect(source.nextElementSibling?.getAttribute("data-slot")).toBe("switch-control");
    expect(source.nextElementSibling?.textContent).toBe("Source");
  });

  test("disabled state is carried by both native input and label", () => {
    render(
      <Switch name="disabled">
        <SwitchControl defaultChecked disabled label="Source" value="source" />
        <SwitchControl disabled label="Output" value="output" />
      </Switch>,
    );

    expect(radios().every((input) => input.disabled)).toBe(true);
    expect(radios().every((input) => input.parentElement?.dataset.disabled === "true")).toBe(true);
  });

  test("defaultChecked survives a tooltip-style wrapper", () => {
    render(
      <Switch name="tooltip">
        <span>
          <SwitchControl defaultChecked label="Source" value="source" />
        </span>
        <span>
          <SwitchControl label="Output" value="output" />
        </span>
      </Switch>,
    );

    expect(checkedValues()).toEqual(["source"]);
  });

  test("size and icon contracts preserve official geometry classes and accessible labels", () => {
    const icon = <svg data-testid="icon" />;
    render(
      <>
        <Switch name="small" size="small">
          <SwitchControl defaultChecked icon={icon} label="Grid" value="grid" />
          <SwitchControl icon={icon} label="List" value="list" />
        </Switch>
        <Switch name="large" size="large">
          <SwitchControl defaultChecked label="Source" value="source" />
          <SwitchControl label="Output" value="output" />
        </Switch>
      </>,
    );

    const roots = container.querySelectorAll<HTMLElement>('[data-slot="switch"]');
    expect(roots[0].className).toContain("h-8");
    expect(roots[1].className).toContain("h-10");
    const iconControl = container.querySelector<HTMLElement>('[data-slot="switch-control"]');
    expect(iconControl?.querySelector(".sr-only")?.textContent).toBe("Grid");
    expect(iconControl?.className).toContain("p-2");
    expect(iconControl?.className).toContain("font-normal");
    expect(radios()[0].getAttribute("aria-label")).toBeNull();
  });

  test("the root hairline consumes the theme-aware Geist alpha token", async () => {
    const css = await read("src/styles/index.css");
    expect(css).toContain("box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);");
  });

  test("arrow keys auto-activate, skip disabled radios and wrap at group edges", async () => {
    render(
      <Switch name="view-mode">
        <SwitchControl defaultChecked label="Preview" value="preview" />
        <SwitchControl disabled label="Code" value="code" />
        <SwitchControl label="Split" value="split" />
      </Switch>,
    );

    const [preview, , split] = radios();
    act(() => preview.focus());
    await pressKey(preview, "ArrowRight");
    expect(checkedValues()).toEqual(["split"]);
    expect(document.activeElement).toBe(split);

    await pressKey(split, "ArrowRight");
    expect(checkedValues()).toEqual(["preview"]);
    expect(document.activeElement).toBe(preview);
  });

  test("Home and End are not given non-native selection behavior", async () => {
    render(
      <Switch name="view-mode">
        <SwitchControl defaultChecked label="Preview" value="preview" />
        <SwitchControl label="Code" value="code" />
      </Switch>,
    );
    const [preview] = radios();
    act(() => preview.focus());
    await pressKey(preview, "End");
    expect(checkedValues()).toEqual(["preview"]);
  });

  test("controlled usage reports the next value without mutating the controlled radio", async () => {
    const onValueChange = vi.fn();
    render(
      <Switch name="view-mode" value="preview" onValueChange={onValueChange}>
        <SwitchControl label="Preview" value="preview" />
        <SwitchControl label="Code" value="code" />
      </Switch>,
    );

    const [preview] = radios();
    act(() => preview.focus());
    await pressKey(preview, "ArrowRight");
    expect(onValueChange).toHaveBeenCalledWith("code");
    expect(checkedValues()).toEqual(["preview"]);
  });

  test("source uses native radio semantics rather than button role emulation", async () => {
    const source = await read("src/components/ui/switch.tsx");
    expect(source).toMatch(/type="radio"/);
    expect(source).toMatch(/<label/);
    expect(source).not.toMatch(/RadioGroupPrimitive/);
    expect(source).not.toMatch(/case "Home"|case "End"/);
  });
});
