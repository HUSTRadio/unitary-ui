// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

function mount(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(element));
  return container;
}

function change(input: HTMLInputElement) {
  act(() => {
    input.click();
  });
}

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
});

describe("Choicebox official Group/Item contract (B1)", () => {
  test("radio renders a valid group > item container > label + sr-only input DOM", () => {
    const view = mount(
      <ChoiceboxGroup
        label="Select a plan"
        onChange={() => {}}
        required
        showLabel
        type="radio"
        value="trial"
      >
        <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
        <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
      </ChoiceboxGroup>,
    );

    const group = view.querySelector('[role="radiogroup"]')!;
    expect(group.hasAttribute("aria-multiselectable")).toBe(false);
    expect(group.getAttribute("aria-required")).toBe("true");
    const groupLabel = group.querySelector(':scope > label[data-version="v1"]')!;
    const groupLabelText = groupLabel.firstElementChild!;
    expect(groupLabel.getAttribute("for")).toBe(groupLabelText.id);
    expect(group.getAttribute("aria-labelledby")).toBe(groupLabelText.id);

    const items = group.querySelector(':scope > [data-slot="choicebox-items"]')!;
    expect(items.tagName).toBe("DIV");
    expect(items.className).toContain("items-stretch");
    expect(items.className).toContain("gap-3");
    const tiles = items.querySelectorAll(":scope > label");
    expect(tiles).toHaveLength(2);
    expect(tiles[0].hasAttribute("aria-selected")).toBe(false);

    const option = tiles[0].querySelector('[data-slot="choicebox-group-item-option"]')!;
    const title = option.querySelector('[data-slot="choicebox-group-item-title"]')!;
    const description = option.querySelector('[data-slot="choicebox-group-item-description"]')!;
    const input = tiles[0].querySelector('input[type="radio"]')!;
    expect(input.className).toContain("sr-only");
    expect(input.className).toContain("peer");
    expect(input.getAttribute("aria-labelledby")).toBe(`${title.id} ${description.id}`);
    expect((input as HTMLInputElement).checked).toBe(true);
    expect(
      [...group.querySelectorAll<HTMLInputElement>('input[type="radio"]')].every(
        (item) => item.required,
      ),
    ).toBe(true);
  });

  test("radio emits one string and checkbox emits the toggled string array", () => {
    const radioChange = vi.fn();
    let view = mount(
      <ChoiceboxGroup label="Plan" onChange={radioChange} type="radio" value="trial">
        <ChoiceboxGroupItem description="Start now" title="Pro" value="pro" />
      </ChoiceboxGroup>,
    );
    change(view.querySelector('input[type="radio"]')!);
    expect(radioChange).toHaveBeenLastCalledWith("pro");

    act(() => root.unmount());
    container.remove();
    const checkboxChange = vi.fn();
    view = mount(
      <ChoiceboxGroup
        label="Features"
        onChange={checkboxChange}
        type="checkbox"
        value={["audit"]}
      >
        <ChoiceboxGroupItem description="Audit logs" title="Audit" value="audit" />
        <ChoiceboxGroupItem description="Web analytics" title="Analytics" value="analytics" />
      </ChoiceboxGroup>,
    );
    const inputs = view.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    change(inputs[1]);
    expect(checkboxChange).toHaveBeenLastCalledWith(["audit", "analytics"]);
    change(inputs[0]);
    expect(checkboxChange).toHaveBeenLastCalledWith([]);
  });

  test("checkbox uses role=group, check indicator, and merges group/item disabled", () => {
    const view = mount(
      <ChoiceboxGroup
        label="Features"
        disabled
        onChange={() => {}}
        type="checkbox"
        value={["audit"]}
      >
        <ChoiceboxGroupItem description="Audit logs" title="Audit" value="audit" />
        <ChoiceboxGroupItem description="Analytics" disabled title="Analytics" value="analytics" />
      </ChoiceboxGroup>,
    );
    const group = view.querySelector('[role="group"]')!;
    expect(group.hasAttribute("aria-multiselectable")).toBe(false);
    const inputs = group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(inputs).toHaveLength(2);
    expect([...inputs].every((input) => input.disabled)).toBe(true);
    expect(group.querySelector('svg path[d="M14 7L8.5 12.5L6 10"]')).not.toBeNull();
    const indicator = group.querySelector('[data-slot="choicebox-checkbox-indicator"]')!;
    expect(indicator.className).toContain("peer-disabled:peer-checked:bg-[var(--gray-600)]");
    expect(indicator.className).not.toContain("var(--uni-gray-600)");
  });

  test("custom children render only for selected items", () => {
    const view = mount(
      <ChoiceboxGroup label="Plan" onChange={() => {}} type="radio" value="trial">
        <ChoiceboxGroupItem description="Trial" title="Trial" value="trial">
          <span data-custom="trial">Trial badge</span>
        </ChoiceboxGroupItem>
        <ChoiceboxGroupItem description="Pro" title="Pro" value="pro">
          <span data-custom="pro">Pro badge</span>
        </ChoiceboxGroupItem>
      </ChoiceboxGroup>,
    );
    expect(view.querySelector('[data-custom="trial"]')).not.toBeNull();
    expect(view.querySelector('[data-custom="pro"]')).toBeNull();
    const content = view.querySelector(".choicebox-content")!;
    expect(content.previousElementSibling?.getAttribute("data-slot")).toBe(
      "choicebox-group-item-option",
    );
  });

  test("tile and indicators use official surface, state, focus and responsive classes", () => {
    const view = mount(
      <ChoiceboxGroup
        label="Plan"
        listClassName="flex-row"
        onChange={() => {}}
        type="radio"
        value="trial"
      >
        <ChoiceboxGroupItem description="Trial" title="Trial" value="trial" />
      </ChoiceboxGroup>,
    );
    const tile = view.querySelector('[data-slot="choicebox-items"] > label')!;
    expect(tile.className).toContain("flex-1");
    expect(tile.className).toContain("rounded-md");
    expect(tile.className).toContain("border-[var(--uni-gray-400)]");
    expect(tile.className).toContain("hover:has-enabled:border-[var(--uni-gray-500)]");
    expect(tile.className).toContain("choicebox-focus");
    expect(tile.className).not.toContain("min-h-");
    const option = tile.querySelector('[data-slot="choicebox-group-item-option"]')!;
    expect(option.className).toContain("has-checked:not-has-disabled:bg-[var(--uni-blue-100)]");
    expect(option.className).toContain(
      "hover:has-checked:not-has-disabled:!bg-[var(--uni-blue-200)]",
    );
    const indicator = tile.querySelector('[data-slot="choicebox-radio-indicator"]')!;
    expect(indicator.className).toContain("[--radio-color:var(--uni-gray-500)]");
    expect(indicator.className).toContain("peer-checked:[--radio-color:var(--uni-blue-900)]");
  });
});
