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

  test("disabled rows dim the row and use a not-allowed cursor", () => {
    render(
      <Collapse>
        <CollapseTrigger>Enabled</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );
    const enabled = container.querySelector('[data-slot="collapse-trigger"]')!;
    expect(enabled.getAttribute("class")).toContain("focus-ring");
    expect(enabled.getAttribute("class")).not.toContain("opacity-60");

    act(() => reactRoot.unmount());
    container.remove();
    reactRoot = createRoot((container = document.createElement("div")));
    document.body.appendChild(container);
    act(() =>
      reactRoot.render(
        <Collapse disabled>
          <CollapseTrigger>Disabled</CollapseTrigger>
          <CollapseContent>Answer</CollapseContent>
        </Collapse>,
      ),
    );

    const disabled = container.querySelector('[data-slot="collapse-trigger"]')!;
    expect(disabled.getAttribute("aria-disabled")).toBe("true");
    expect(disabled.getAttribute("class")).toContain("opacity-60");
    expect(disabled.getAttribute("class")).toContain("cursor-not-allowed");
  });

  test("plus icon semantics rotate 45 degrees instead of flipping 180", () => {
    render(
      <Collapse icon="plus">
        <CollapseTrigger>Question A</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    const trigger = container.querySelector('[data-slot="collapse-trigger"]')!;
    expect(trigger.getAttribute("data-icon")).toBe("plus");
    const svg = trigger.querySelector("svg")!;
    expect(svg.getAttribute("class")).toContain("group-data-[state=open]:-rotate-45");
    expect(svg.getAttribute("class")).not.toContain("rotate-180");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });

  test("trigger-level icon overrides the root default", () => {
    render(
      <Collapse icon="chevron">
        <CollapseTrigger icon="plus">Question A</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    const trigger = container.querySelector('[data-slot="collapse-trigger"]')!;
    expect(trigger.getAttribute("data-icon")).toBe("plus");
    expect(trigger.querySelector("svg")!.getAttribute("class")).toContain("-rotate-45");
  });

  test("uses project motion tokens for open/close and icon rotation", async () => {
    render(
      <Collapse>
        <CollapseTrigger>Question A</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    const css = await readFile(path.resolve(process.cwd(), "src/styles/index.css"), "utf8");
    expect(css).toMatch(
      /@utility collapse-content-motion \{\s*transition-duration: var\(--uni-motion-state\) !important;/,
    );

    // 折叠开合走状态变化档位（250ms + ease-snap），图标旋转走高频微反馈档位（150ms + ease-snap）
    const svgClass = container.querySelector('[data-slot="collapse-trigger"] svg')?.getAttribute("class");
    expect(svgClass).toContain("duration-(--uni-motion-feedback)");
    expect(svgClass).toContain("ease-snap");
    expect(svgClass).toContain("group-data-[state=open]:rotate-180");

    const contentClass = container
      .querySelector('[data-slot="collapse-content"]')
      ?.getAttribute("class");
    expect(contentClass).toContain("duration-(--uni-motion-state)");
    expect(contentClass).toContain("ease-snap");
    expect(contentClass).toContain("text-copy-16");
    expect(contentClass).toContain("text-muted-foreground");
    expect(contentClass).toContain("data-[state=open]:h-[var(--collapse-content-height)]");
    expect(container.querySelector('[data-slot="collapse-content"]')?.hasAttribute("inert")).toBe(
      true,
    );
  });
});

describe("Collapse indicator placement (2026-09-21)", () => {
  test("default keeps the indicator right-aligned at the row end", () => {
    render(
      <Collapse>
        <CollapseTrigger>Question A</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    const trigger = container.querySelector('[data-slot="collapse-trigger"]')!;
    expect(trigger.getAttribute("data-indicator-align")).toBe("end");
    expect(trigger.getAttribute("class")).toContain("justify-between");
    // 指示图标是行尾最后一个节点（标题之后不再有兄弟）
    expect(trigger.lastElementChild?.tagName.toLowerCase()).toBe("svg");
  });

  test('indicatorAlign="inline" puts the indicator right next to the title', () => {
    render(
      <Collapse indicatorAlign="inline">
        <CollapseTrigger>Question A</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    const trigger = container.querySelector('[data-slot="collapse-trigger"]')!;
    expect(trigger.getAttribute("data-indicator-align")).toBe("inline");
    expect(trigger.getAttribute("class")).toContain("justify-start");
    expect(trigger.getAttribute("class")).not.toContain("justify-between");
    // 标题 span 之后紧跟图标（inline 语义）
    const title = trigger.firstElementChild!;
    expect(title.tagName.toLowerCase()).toBe("span");
    expect(title.nextElementSibling?.tagName.toLowerCase()).toBe("svg");
  });

  test("trigger-level indicatorAlign overrides the root setting", () => {
    render(
      <Collapse indicatorAlign="end">
        <CollapseTrigger indicatorAlign="inline">Question A</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    const trigger = container.querySelector('[data-slot="collapse-trigger"]')!;
    expect(trigger.getAttribute("data-indicator-align")).toBe("inline");
    expect(trigger.getAttribute("class")).toContain("justify-start");
  });
});

describe("Collapse non-button trigger + bare size (2026-09-21)", () => {
  test('as="div" renders a non-button disclosure that still toggles by click and keyboard', () => {
    render(
      <Collapse>
        <CollapseTrigger as="div">Section A</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    const trigger = container.querySelector<HTMLElement>('[data-slot="collapse-trigger"]')!;
    expect(trigger.tagName).toBe("DIV");
    expect(trigger.getAttribute("role")).toBe("button");
    expect(trigger.getAttribute("tabindex")).toBe("0");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("class")).not.toContain("hover:bg-");

    act(() => trigger.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    act(() =>
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true })),
    );
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    act(() =>
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })),
    );
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    // 其它按键不改变开合状态
    act(() => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true })));
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  test('size="bare" removes the title padding so callers own the row geometry', () => {
    render(
      <Collapse size="bare">
        <CollapseTrigger>Section A</CollapseTrigger>
        <CollapseContent>Answer</CollapseContent>
      </Collapse>,
    );

    expect(container.querySelector('[data-slot="collapse"]')?.getAttribute("data-size")).toBe(
      "bare",
    );
    const title = container.querySelector('[data-slot="collapse-trigger"] span')!;
    expect(title.getAttribute("class")).toContain("group-data-[size=bare]:py-0");
    expect(title.getAttribute("class")).toContain("py-6");
  });
});
