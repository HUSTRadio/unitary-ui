// @vitest-environment jsdom

import { act, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { LoadMoreButtonCustomTextCFD55183Example } from "../docs/site/src/examples/load-more-button/custom-text-cfd55183.example";
import { LoadMoreButtonDefault21B111CBExample } from "../docs/site/src/examples/load-more-button/default-21b111cb.example";
import { LoadMoreButtonLoadingDC380888Example } from "../docs/site/src/examples/load-more-button/loading-dc380888.example";
import { LoadMoreButtonNoBorderRadius7DFF5DD3Example } from "../docs/site/src/examples/load-more-button/no-border-radius-7dff5dd3.example";
import { LoadMoreButtonNoGap7BF8EBE8Example } from "../docs/site/src/examples/load-more-button/no-gap-7bf8ebe8.example";

describe("LoadMoreButton example outcomes", () => {
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

  test.each([
    ["Default", LoadMoreButtonDefault21B111CBExample],
    ["No Gap", LoadMoreButtonNoGap7BF8EBE8Example],
    ["No Border Radius", LoadMoreButtonNoBorderRadius7DFF5DD3Example],
    ["Custom Text", LoadMoreButtonCustomTextCFD55183Example],
  ])("%s reports a concrete increase after activation", (_name, Example: ComponentType) => {
    act(() => root.render(<Example />));
    expect(container.querySelector('[role="status"]')?.textContent).toBe("3 results loaded");
    const button = container.querySelector<HTMLButtonElement>("button");
    expect(button).toBeTruthy();
    act(() => button!.click());
    expect(container.querySelector('[role="status"]')?.textContent).toBe("6 results loaded");
  });

  test("Loading exposes a disabled pending action", () => {
    act(() => root.render(<LoadMoreButtonLoadingDC380888Example />));
    expect(container.querySelector<HTMLButtonElement>("button")?.disabled).toBe(true);
  });
});
