// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { Button } from "@/components/ui/button";
import { Note, NoteAction, NoteContent } from "@/components/ui/note";

describe("Note disabled interaction contract", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  test("marks the disabled region inert so nested actions cannot receive interaction", () => {
    act(() => {
      root.render(
        <Note disabled>
          <NoteContent>Unavailable action</NoteContent>
          <NoteAction>
            <Button typeName="button">Upgrade</Button>
          </NoteAction>
        </Note>,
      );
    });

    const note = container.querySelector<HTMLElement>('[data-slot="note"]');

    expect(note?.getAttribute("aria-disabled")).toBe("true");
    expect(note?.hasAttribute("inert")).toBe(true);
  });
});
