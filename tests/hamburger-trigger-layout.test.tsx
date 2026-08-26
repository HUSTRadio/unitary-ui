// @vitest-environment jsdom
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import { HamburgerMenu } from "../src/components/ui/hamburger-menu";

describe("HamburgerMenu trigger layout", () => {
  test("keeps a 44px hit target with a desktop 32px visual box", () => {
    const html = renderToStaticMarkup(<HamburgerMenu anchor="topbar" />);

    expect(html).toContain('data-slot="hamburger-trigger"');
    expect(html).toContain("size-11");
    expect(html).toContain("focus-ring");
    expect(html).toContain('data-slot="hamburger-trigger-visual"');
    expect(html).toContain("md:size-8");
    expect(html).toContain("group-hover:bg-gray-alpha-100");
  });
});
