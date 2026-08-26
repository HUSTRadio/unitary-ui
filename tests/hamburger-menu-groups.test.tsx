// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { HamburgerMenu } from "../src/components/ui/hamburger-menu";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  document.body.innerHTML = "";
  root = undefined;
  container = undefined;
});

function renderGroupedMenu() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root?.render(
      <HamburgerMenu
        anchor="topbar"
        open
        disableSearch
        groups={[
          {
            title: "Foundations",
            items: [{ label: "Colors", to: "/colors" }],
          },
          {
            title: "Components",
            items: [{ label: "Button", to: "/components/button" }],
          },
        ]}
      />,
    );
  });
}

describe("HamburgerMenu grouped navigation", () => {
  test("renders every group with a visible heading and labelled group", () => {
    renderGroupedMenu();

    const groups = document.querySelectorAll('[data-slot="menu-group"]');
    const headings = document.querySelectorAll('[data-slot="menu-group-heading"]');
    expect(groups).toHaveLength(2);
    expect(Array.from(headings).map((node) => node.textContent)).toEqual([
      "Foundations",
      "Components",
    ]);
    for (const group of groups) {
      const labelledBy = group.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      expect(document.getElementById(labelledBy!)).toBeTruthy();
    }
  });

  test("keeps grouped links and current-page semantics", () => {
    renderGroupedMenu();
    const links = document.querySelectorAll('[data-slot="menu-group"] a');
    expect(Array.from(links).map((link) => link.textContent)).toEqual(["Colors", "Button"]);
  });
});
