// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Radio, RadioGroup, RadioGroupItem, useRadio } from "../src/components/ui/radio";

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

function HeadlessExample() {
  const { component: one } = useRadio({ value: "one" });
  const { component: two } = useRadio({ value: "two" });
  return (
    <RadioGroup aria-label="Options" defaultValue="one">
      <label>Option 1{one}</label>
      <label>Option 2{two}</label>
    </RadioGroup>
  );
}

afterEach(() => {
  if (reactRoot) act(() => reactRoot.unmount());
  container?.remove();
});

describe("Radio live official contract", () => {
  test("inventory and docs cover all five live demos", async () => {
    const docs = await read("docs/geist/src/components/docs-components-page.tsx");
    const manifest = JSON.parse(await read("tests/audit/geist-audit-manifest.json"));
    const entry = manifest.components.find((item: { slug: string }) => item.slug === "radio");
    const expected = [
      "default",
      "radio-disabled",
      "radio-required",
      "radio-headless",
      "radio-standalone",
    ];

    expect(expected.every((id) => docs.includes(`data-demo-card="${id}"`))).toBe(true);
    expect(docs).toContain('name="radio-default"');
    expect(docs).toContain('name="radio-disabled"');
    expect(docs).toContain('name="radio-required"');
    expect(docs).not.toContain('name="radio-name"');
    expect(docs).toMatch(/<form[^>]*>[\s\S]*?<RadioGroup[\s\S]*?name="radio-required"/);
    expect(entry.inventoryStatus).toBe("live_enumeration_complete");
    expect(entry.demos.map((item: { id: string }) => item.id)).toEqual(expected);
    expect(entry.acceptanceContracts.map((item: { demoId: string }) => item.demoId)).toEqual(
      expected,
    );
  });

  test("renders native radio inputs, labelled group and official visual structure", () => {
    render(
      <RadioGroup label="Default Radio Example" defaultValue="one" name="plan">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </RadioGroup>,
    );

    const group = container.querySelector<HTMLElement>('[role="radiogroup"]');
    const [one, two] = radios();
    expect(group?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(container.querySelector(".sr-only")?.textContent).toBe("Default Radio Example");
    expect(one.checked).toBe(true);
    expect(two.checked).toBe(false);
    expect(one.name).toBe("plan");
    expect(one.parentElement?.getAttribute("data-slot")).toBe("radio-control");
    expect(one.nextElementSibling?.getAttribute("aria-hidden")).toBe("true");
    expect(one.closest("label")?.textContent).toContain("Option 1");
  });

  test("uncontrolled groups share a generated native name and update selection", () => {
    const onChange = vi.fn();
    render(
      <RadioGroup label="Plan" defaultValue="one" onChange={onChange}>
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </RadioGroup>,
    );

    const [one, two] = radios();
    expect(one.name).toBe(two.name);
    expect(one.name).not.toBe("");
    act(() => two.click());
    expect(one.checked).toBe(false);
    expect(two.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith("two");
  });

  test("controlled groups report changes without mutating the controlled value", () => {
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="Plan" value="one" onChange={onChange}>
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </RadioGroup>,
    );

    const [one, two] = radios();
    act(() => two.click());
    expect(onChange).toHaveBeenCalledWith("two");
    expect(one.checked).toBe(true);
    expect(two.checked).toBe(false);
  });

  test("required and disabled state reach every native radio, including an empty group", () => {
    render(
      <>
        <RadioGroup label="Required" required>
          <RadioGroupItem value="one">Option 1</RadioGroupItem>
          <RadioGroupItem value="two">Option 2</RadioGroupItem>
        </RadioGroup>
        <RadioGroup label="Disabled" defaultValue="one" disabled>
          <RadioGroupItem value="one">Option 1</RadioGroupItem>
          <RadioGroupItem value="two">Option 2</RadioGroupItem>
        </RadioGroup>
      </>,
    );

    const [requiredOne, requiredTwo, disabledOne, disabledTwo] = radios();
    expect(requiredOne.required).toBe(true);
    expect(requiredTwo.required).toBe(true);
    expect(requiredOne.name).toBe(requiredTwo.name);
    expect(disabledOne.disabled).toBe(true);
    expect(disabledTwo.disabled).toBe(true);
    expect(disabledOne.closest("label")?.className).toContain("cursor-not-allowed");
  });

  test("headless and standalone APIs retain native semantics and accessible names", () => {
    render(
      <>
        <HeadlessExample />
        <Radio
          aria-label="Standalone option"
          checked
          onChange={() => undefined}
          value="standalone"
        />
      </>,
    );

    const [headlessOne, headlessTwo, standalone] = radios();
    expect(headlessOne.checked).toBe(true);
    expect(headlessOne.name).toBe(headlessTwo.name);
    expect(headlessOne.closest("label")?.textContent).toContain("Option 1");
    expect(standalone.checked).toBe(true);
    expect(standalone.getAttribute("aria-label")).toBe("Standalone option");
  });

  test("source uses native inputs and semantic Geist tokens without opacity dimming", async () => {
    const source = await read("src/components/ui/radio.tsx");
    expect(source).toMatch(/type="radio"/);
    expect(source).toContain("text-copy-13");
    expect(source).toContain("var(--gray-700)");
    expect(source).toContain("var(--gray-1000)");
    expect(source).toContain("var(--gray-500)");
    expect(source).not.toContain("opacity-50");
    expect(source).not.toMatch(/bg-progress|border-progress/);
  });
});
