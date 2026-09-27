// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { ErrorCardDefault21B111CBExample } from "../docs/site/src/examples/error-card/default-21b111cb.example";
import { EntityEntityWithListBD7895E8Example } from "../docs/site/src/examples/entity/entity-with-list-bd7895e8.example";
import { NoteAction64CFF131Example } from "../docs/site/src/examples/note/action-64cff131.example";
import { TabsDisableSpecificTabsA4195A7DExample } from "../docs/site/src/examples/tabs/disable-specific-tabs-a4195a7d.example";
import { TabsWithIcons1F71F4BCExample } from "../docs/site/src/examples/tabs/with-icons-1f71f4bc.example";
import { TabsSecondary62F2CCFFExample } from "../docs/site/src/examples/tabs/secondary-62f2ccff.example";

describe("action-bearing documentation examples", () => {
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
  });

  test("ErrorCard Add Credits updates the visible card and announces the amount", () => {
    act(() => root.render(<ErrorCardDefault21B111CBExample />));
    const button = buttonByText("Add Credits");
    act(() => button.click());
    expect(container.textContent).toContain("Credits Added");
    expect(container.textContent).toContain("100 credits are now available.");
    expect(container.querySelector('[role="status"]')?.textContent).toContain("100 credits added");
  });

  test("Note Upgrade actions report their result", () => {
    act(() => root.render(<NoteAction64CFF131Example />));
    const button = Array.from(container.querySelectorAll("button")).find((node) => node.textContent === "Upgrade");
    expect(button).toBeTruthy();
    act(() => button!.click());
    expect(container.querySelector('[role="status"]')?.textContent).toBe("Upgrade requested");
  });

  test("Entity list Decline removes the selected session and announces it", () => {
    act(() => root.render(<EntityEntityWithListBD7895E8Example />));
    expect(container.querySelectorAll('[data-slot="entity"]')).toHaveLength(3);
    act(() => buttonByText("Decline").click());
    expect(container.querySelectorAll('[data-slot="entity"]')).toHaveLength(2);
    expect(
      Array.from(container.querySelectorAll('[data-slot="entity-title"]'), (node) => node.textContent),
    ).not.toContain("GitHub Desktop on MacBook Pro");
    expect(container.querySelector('[role="status"]')?.textContent).toBe(
      "GitHub Desktop on MacBook Pro declined",
    );
  });

  /*
   * 回归：这些 Tabs 演示曾把 selected 写死、setSelected 置为空函数，未禁用的 tab
   * 点击后只移动焦点、不切换选中态。官方 demo 全部用 useState，这里锁住该契约。
   */
  test("Tabs demos activate the clicked enabled tab instead of freezing on the initial value", () => {
    act(() => root.render(<TabsDisableSpecificTabsA4195A7DExample />));
    expect(tabStates()).toEqual(["active", "inactive", "inactive"]);
    act(() => buttonByText("Orange").click());
    expect(tabStates()).toEqual(["inactive", "active", "inactive"]);
    // 禁用 tab 由 tooltip 包裹，点击后不应改变选中态。
    act(() => buttonByText("Mango").click());
    expect(tabStates()).toEqual(["inactive", "active", "inactive"]);

    act(() => root.render(<TabsWithIcons1F71F4BCExample />));
    act(() => buttonByText("GitLab").click());
    expect(tabStates()).toEqual(["inactive", "active", "inactive"]);

    act(() => root.render(<TabsSecondary62F2CCFFExample />));
    act(() => buttonByText("GitLab").click());
    expect(tabStates()).toEqual(["inactive", "active", "inactive"]);
  });

  function buttonByText(text: string) {
    const button = Array.from(container.querySelectorAll("button")).find((node) => node.textContent === text);
    expect(button).toBeTruthy();
    return button!;
  }

  function tabStates() {
    return Array.from(container.querySelectorAll('[role="tab"]'), (node) =>
      node.getAttribute("data-state"),
    );
  }
});
