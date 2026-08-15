// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { Collapse, CollapseContent, CollapseTrigger } from "../src/components/ui/collapse";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let reactRoot: Root;

function render(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.appendChild(container);
  reactRoot = createRoot(container);
  act(() => reactRoot.render(element));
}

afterEach(() => {
  if (reactRoot) act(() => reactRoot.unmount());
  container?.remove();
});

describe("Collapse live official contract", () => {
  test("disabled open state remains expanded and exposes aria-disabled", () => {
    render(
      <Collapse open disabled>
        <h3>
          <CollapseTrigger>Question B</CollapseTrigger>
        </h3>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    const trigger = container.querySelector<HTMLButtonElement>('[data-slot="collapse-trigger"]')!;
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-disabled")).toBe("true");
    expect(trigger.disabled).toBe(false);
    act(() => trigger.click());
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  test("uses the official 200ms ease-in-out motion", () => {
    render(
      <Collapse>
        <CollapseTrigger>Question A</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    expect(
      container.querySelector('[data-slot="collapse-trigger"] svg')?.getAttribute("class"),
    ).toContain("duration-200");
    expect(
      container.querySelector('[data-slot="collapse-content"]')?.getAttribute("class"),
    ).toContain("duration-200");
  });
});
