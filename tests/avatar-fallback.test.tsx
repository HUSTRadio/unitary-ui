// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { Avatar } from "@/components/ui/avatar";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
});

describe("Avatar image fallback", () => {
  test("shows the supplied letter when an image fails", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => root.render(<Avatar src="https://example.invalid/avatar.png" letter="ER" />));

    const image = container.querySelector<HTMLImageElement>("img")!;
    act(() => image.dispatchEvent(new Event("error")));

    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("ER");
  });

  test("derives initials from a username when no letter is supplied", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => root.render(<Avatar username="evilrabbit" />));

    act(() => container.querySelector("img")!.dispatchEvent(new Event("error")));

    expect(container.textContent).toContain("EV");
  });

  test("tries a replacement image after the src changes", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => root.render(<Avatar src="https://example.invalid/first.png" letter="ER" />));
    act(() => container.querySelector("img")!.dispatchEvent(new Event("error")));

    act(() => root.render(<Avatar src="https://example.invalid/second.png" letter="ER" />));

    expect(container.querySelector<HTMLImageElement>("img")?.src).toContain("second.png");
  });
});
