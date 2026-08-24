// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
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

  test("uses the official 200ms ease-in-out motion", async () => {
    render(
      <Collapse>
        <CollapseTrigger>Question A</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    const css = await readFile(path.resolve(process.cwd(), "src/styles/index.css"), "utf8");
    expect(css).toMatch(
      /@utility collapse-content-motion \{\s*transition-duration: 200ms !important;/,
    );

    expect(
      container.querySelector('[data-slot="collapse-trigger"] svg')?.getAttribute("class"),
    ).toContain("duration-(--ds-duration-base)");
    expect(
      container.querySelector('[data-slot="collapse-content"]')?.getAttribute("class"),
    ).toContain("duration-(--ds-duration-base)");
    expect(
      container.querySelector('[data-slot="collapse-content"]')?.getAttribute("class"),
    ).toContain("data-[state=open]:h-[var(--collapse-content-height)]");
    expect(container.querySelector('[data-slot="collapse-content"]')?.hasAttribute("inert")).toBe(
      true,
    );
    expect(
      container.querySelector('[data-slot="collapse-trigger"] svg')?.getAttribute("class"),
    ).toContain("group-data-[state=open]:rotate-180");
  });
});
