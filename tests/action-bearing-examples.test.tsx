// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { ErrorCardDefault21B111CBExample } from "../docs/geist/src/examples/error-card/default-21b111cb.example";
import { EntityEntityWithListBD7895E8Example } from "../docs/geist/src/examples/entity/entity-with-list-bd7895e8.example";
import { NoteAction64CFF131Example } from "../docs/geist/src/examples/note/action-64cff131.example";

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

  function buttonByText(text: string) {
    const button = Array.from(container.querySelectorAll("button")).find((node) => node.textContent === text);
    expect(button).toBeTruthy();
    return button!;
  }
});
