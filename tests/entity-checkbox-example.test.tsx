// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { EntityEntityWithListAndCheckbox26EB60A8Example } from "../docs/geist/src/examples/entity/entity-with-list-and-checkbox-26eb60a8.example";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
});

describe("Entity checkbox example", () => {
  test("a checkbox click toggles exactly once", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => root.render(<EntityEntityWithListAndCheckbox26EB60A8Example />));

    const checkbox = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')[1]!;
    expect(checkbox.checked).toBe(false);
    act(() => checkbox.click());
    expect(checkbox.checked).toBe(true);
  });

  test("a row click still toggles its checkbox", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => root.render(<EntityEntityWithListAndCheckbox26EB60A8Example />));

    const row = container.querySelectorAll<HTMLLIElement>('[data-slot="entity"]')[1]!;
    const checkbox = row.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    act(() => row.click());
    expect(checkbox.checked).toBe(true);
  });
});
