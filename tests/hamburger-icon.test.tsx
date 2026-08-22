import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HamburgerIcon } from "../src/components/ui/hamburger-icon";

describe("HamburgerIcon", () => {
  it("closed state renders three line elements with data-open=false", () => {
    const markup = renderToStaticMarkup(<HamburgerIcon open={false} />);

    expect(markup).toContain('data-open="false"');
    // Three absolutely-positioned span lines
    const lineCount = markup.split("<span").length - 1;
    expect(lineCount).toBeGreaterThanOrEqual(3);
    expect(markup).toContain("absolute");
  });

  it("open state morphs top/bottom lines into an X and fades the middle line", () => {
    const closed = renderToStaticMarkup(<HamburgerIcon open={false} />);
    const open = renderToStaticMarkup(<HamburgerIcon open={true} />);

    // Top line rotates +45° and translates to center
    expect(open).toContain("rotate-45");
    // Bottom line rotates -45°
    expect(open).toContain("-rotate-45");
    // Middle line disappears
    expect(open).toContain("opacity-0");
    // Closed state must NOT carry the morph classes
    expect(closed).not.toContain("rotate-45");
    expect(closed).not.toContain("-rotate-45");
    expect(closed).not.toContain("opacity-0");
  });

  it("both states animate via transform transition with reduced-motion fallback", () => {
    for (const open of [false, true]) {
      const markup = renderToStaticMarkup(<HamburgerIcon open={open} />);
      expect(markup).toContain("transition-transform");
      expect(markup).toContain("duration-300");
      expect(markup).toContain(
        "ease-[cubic-bezier(0.32,0.72,0,1)]",
      );
      expect(markup).toContain("motion-reduce:transition-none");
    }
  });

  it("sizes from props (default 16) and inherits color via bg-current", () => {
    const markup = renderToStaticMarkup(<HamburgerIcon open={false} />);

    // Default size 16px
    expect(markup).toContain("width:16px");
    expect(markup).toContain("height:16px");

    // Custom size
    const sized = renderToStaticMarkup(<HamburgerIcon open={false} size={24} />);
    expect(sized).toContain("width:24px");
    expect(sized).toContain("height:24px");

    // Color inheritance
    expect(markup).toContain("bg-current");
  });
});
