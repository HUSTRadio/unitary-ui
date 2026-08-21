// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { JsonView } from "@/components/ui/json-view";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

function mount(data: unknown, defaultExpandDepth = 1) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root?.render(<JsonView data={data} defaultExpandDepth={defaultExpandDepth} />));
  return container;
}

describe("JsonView interaction regressions", () => {
  test("primitive rows render only the primitive value, never an object preview prefix", () => {
    const view = mount({ name: "Geist", enabled: true, count: 3, empty: null });
    const rows = [...view.querySelectorAll<HTMLElement>('[data-slot="json-view-row"]')];
    const name = rows.find((row) => row.textContent?.includes("name:"))!;
    const enabled = rows.find((row) => row.textContent?.includes("enabled:"))!;

    expect(name.textContent).toBe('name: "Geist",');
    expect(enabled.textContent).toBe("enabled: true,");
    expect(name.textContent).not.toContain("{ … }");
  });

  test("has one initial roving tab stop and arrow keys move it through visible rows", () => {
    const view = mount({ first: 1, second: 2 });
    const tree = view.querySelector<HTMLElement>('[role="tree"]')!;
    const rootRow = view.querySelector<HTMLElement>('[data-path="root"]')!;
    const firstRow = view.querySelector<HTMLElement>('[data-path="/first"]')!;

    expect(rootRow.tabIndex).toBe(0);
    expect(view.querySelectorAll('[role="treeitem"][tabindex="0"]')).toHaveLength(1);

    act(() => {
      rootRow.focus();
      tree.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });
    expect(document.activeElement).toBe(firstRow);
    expect(view.querySelector<HTMLElement>('[data-path="/first"]')?.tabIndex).toBe(0);
    expect(view.querySelectorAll('[role="treeitem"][tabindex="0"]')).toHaveLength(1);
  });

  test("clicking a nested toggle changes only that node, not its ancestors", () => {
    const view = mount({ nested: { child: "value" }, sibling: true });
    const rootRow = view.querySelector<HTMLElement>('[data-path="root"]')!;
    const nestedRow = view.querySelector<HTMLElement>('[data-path="/nested"]')!;
    const toggle = nestedRow.querySelector<HTMLButtonElement>('[data-slot="json-view-toggle"]')!;

    expect(rootRow.getAttribute("aria-expanded")).toBe("true");
    expect(nestedRow.getAttribute("aria-expanded")).toBe("false");
    act(() => toggle.click());
    expect(rootRow.getAttribute("aria-expanded")).toBe("true");
    expect(nestedRow.getAttribute("aria-expanded")).toBe("true");
    expect(view.querySelector('[data-path="/nested/child"]')).not.toBeNull();
  });

  test("uses sibling count for aria-setsize and root is the sole top-level treeitem", () => {
    const view = mount({ a: 1, b: 2, c: 3 });
    expect(view.querySelector('[data-path="root"]')?.getAttribute("aria-setsize")).toBe("1");
    expect(view.querySelector('[data-path="/a"]')?.getAttribute("aria-setsize")).toBe("3");
    expect(view.querySelector('[data-path="/c"]')?.getAttribute("aria-posinset")).toBe("3");
  });

  test("supports non-global highlight patterns without throwing", () => {
    const view = mount({ message: "request failed" });
    act(() =>
      root?.render(<JsonView data={{ message: "request failed" }} highlightPattern={/request/i} />),
    );
    expect(view.querySelector("mark")?.textContent).toBe("request");
  });

  test("keeps expansion and focus on stable JSON Pointer paths across data refreshes", () => {
    const view = mount({ nested: { value: 1 }, sibling: true });
    const nested = view.querySelector<HTMLElement>('[data-path="/nested"]')!;
    const toggle = nested.querySelector<HTMLButtonElement>('[data-slot="json-view-toggle"]')!;

    act(() => toggle.click());
    expect(nested.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(nested);

    act(() => root?.render(<JsonView data={{ inserted: 0, nested: { value: 2 } }} />));
    const refreshed = view.querySelector<HTMLElement>('[data-path="/nested"]')!;
    expect(refreshed.getAttribute("aria-expanded")).toBe("true");
    expect(refreshed.tabIndex).toBe(0);
    expect(view.querySelector('[data-path="/nested/value"]')?.textContent).toContain("2");
  });

  test("falls focus back to root when the focused path disappears", () => {
    const view = mount({ removable: 1 });
    const removable = view.querySelector<HTMLElement>('[data-path="/removable"]')!;
    act(() => removable.focus());
    expect(removable.tabIndex).toBe(0);

    act(() => root?.render(<JsonView data={{ replacement: 2 }} />));
    expect(view.querySelector<HTMLElement>('[data-path="root"]')?.tabIndex).toBe(0);
    expect(view.querySelectorAll('[role="treeitem"][tabindex="0"]')).toHaveLength(1);
  });

  test("uses escaped RFC 6901 segments so object insertion cannot retarget state", () => {
    const view = mount({ "a/b~c": { value: 1 } });
    expect(view.querySelector('[data-path="/a~1b~0c"]')).not.toBeNull();
  });

  test("empty containers are truthful leaves and ArrowRight does not jump to a sibling", () => {
    const view = mount({ empty: {}, sibling: true });
    const tree = view.querySelector<HTMLElement>('[role="tree"]')!;
    const empty = view.querySelector<HTMLElement>('[data-path="/empty"]')!;

    expect(empty.getAttribute("aria-expanded")).toBeNull();
    expect(empty.querySelector('[data-slot="json-view-toggle"]')).toBeNull();
    expect(empty.textContent).toContain("empty: {},");
    expect(empty.textContent).not.toContain("…");

    act(() => {
      empty.focus();
      tree.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });
    expect(document.activeElement).toBe(empty);
  });

  test("renders special values and circular input without throwing or dropping content", () => {
    const cycle: { self?: unknown } = {};
    cycle.self = cycle;
    const view = mount({ missing: undefined, count: 1n, when: new Date("2024-01-01Z"), cycle });

    expect(view.textContent).toContain("undefined");
    expect(view.textContent).toContain("1n");
    expect(view.textContent).toContain('"2024-01-01T00:00:00.000Z"');

    const cycleToggle = view
      .querySelector<HTMLElement>('[data-path="/cycle"]')!
      .querySelector<HTMLButtonElement>('[data-slot="json-view-toggle"]')!;
    act(() => cycleToggle.click());
    expect(view.textContent).toContain("[Circular]");
  });

  test("collapsed deep data does not overflow the JavaScript call stack", () => {
    const data: Record<string, unknown> = {};
    let cursor = data;
    for (let index = 0; index < 10_000; index += 1) {
      const next: Record<string, unknown> = {};
      cursor.child = next;
      cursor = next;
    }
    expect(() => mount(data, 0)).not.toThrow();
  });

  test("short single-property objects render on one line", () => {
    const view = mount({ foo: "bar" });
    const rootRow = view.querySelector<HTMLElement>(
      '[data-path="root"] [data-slot="json-view-row"]',
    )!;
    expect(rootRow.textContent).toBe('{ foo: "bar" }');
    expect(view.querySelectorAll('[role="treeitem"]')).toHaveLength(2);
  });

  test("keeps sibling primitive rows on separate lines", () => {
    const view = mount({ first: 1, second: 2 });
    const first = view.querySelector<HTMLElement>('[data-path="/first"]')!;
    const second = view.querySelector<HTMLElement>('[data-path="/second"]')!;

    expect(first.classList).toContain("block");
    expect(second.classList).toContain("block");
    expect(first.classList).not.toContain("inline");
    expect(second.classList).not.toContain("inline");
  });

  test("returns focus to the root from a top-level child", () => {
    const view = mount({ first: 1, second: 2 });
    const tree = view.querySelector<HTMLElement>('[role="tree"]')!;
    const rootRow = view.querySelector<HTMLElement>('[data-path="root"]')!;
    const firstRow = view.querySelector<HTMLElement>('[data-path="/first"]')!;

    act(() => {
      rootRow.focus();
      tree.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });
    expect(document.activeElement).toBe(firstRow);

    act(() => {
      tree.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    });
    expect(document.activeElement).toBe(rootRow);
    expect(rootRow.tabIndex).toBe(0);

    act(() => {
      tree.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      tree.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    });
    expect(document.activeElement).toBe(rootRow);
  });

  test("ignores zero-width highlight matches", () => {
    const view = mount({ message: "ready" });
    act(() => root?.render(<JsonView data={{ message: "ready" }} highlightPattern={/(?:)/} />));
    expect(view.querySelectorAll("mark")).toHaveLength(0);
  });
});
