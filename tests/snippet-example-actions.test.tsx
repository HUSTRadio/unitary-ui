// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { SnippetCallback32E8D276Example } from "../docs/geist/src/examples/snippet/callback-32e8d276.example";
import { SnippetControlledCopiedStateB953E7D9Example } from "../docs/geist/src/examples/snippet/controlled-copied-state-b953e7d9.example";

describe("Snippet example actions", () => {
  let container: HTMLDivElement;
  let root: Root;
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    writeText.mockClear();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  test("Callback reports the copied command through a status region", async () => {
    await act(async () => root.render(<SnippetCallback32E8D276Example />));
    const trigger = container.querySelector<HTMLElement>('[role="button"], button');
    expect(trigger).toBeTruthy();
    await act(async () => trigger!.click());
    expect(writeText).toHaveBeenCalledWith("npm init next-app");
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Copied npm init next-app");
  });

  test("Controlled Copied State delegates copying to the native Snippet button", async () => {
    await act(async () => root.render(<SnippetControlledCopiedStateB953E7D9Example />));
    const trigger = container.querySelector<HTMLButtonElement>('[data-slot="snippet-copy"]');
    expect(trigger).toBeTruthy();
    await act(async () => trigger!.click());
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0]?.[0]).toContain("# About");
  });
});
