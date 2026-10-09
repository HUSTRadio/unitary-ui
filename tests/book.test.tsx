import { readFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Book } from "../src/components/ui/book";

describe("Book", () => {
  it("renders the official three-dimensional cover structure", () => {
    const markup = renderToStaticMarkup(<Book title="The user experience of the Frontend Cloud" />);

    expect(markup).toContain('data-slot="book"');
    expect(markup).toContain('data-slot="book-rotate"');
    expect(markup).toContain('data-slot="book-cover"');
    expect(markup).toContain('data-slot="book-pages"');
    expect(markup).toContain('data-slot="book-back"');
    expect(markup).toContain('data-slot="book-bind"');
    expect(markup).toContain('data-slot="book-title"');
    expect(markup).toContain('style="--book-width:196"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain("The user experience of the Frontend Cloud");
  });

  it("maps responsive widths to the official breakpoint variables without global style injection", () => {
    const markup = renderToStaticMarkup(
      <Book title="Responsive cover" width={{ sm: 150, md: 196 }} />,
    );

    expect(markup).toContain("--sm-book-width:150");
    expect(markup).toContain("--md-book-width:196");
    expect(markup).not.toContain("<style>");
    expect(markup).not.toContain("book-width-resp");
  });

  it("keeps simple, illustration, icon, and textured variants on the same official DOM contract", () => {
    const simple = renderToStaticMarkup(
      <Book
        color="#7DC1C1"
        illustration={<span data-testid="illustration" />}
        textColor="white"
        textured
        title="Design Engineering at Unitary"
        variant="simple"
      />,
    );

    expect(simple).toContain('data-variant="simple"');
    expect(simple).toContain('data-slot="book-illustration"');
    expect(simple).toContain('data-slot="book-texture"');
    expect(simple).toContain('data-textured="true"');
    expect(simple).toContain("--book-color:#7DC1C1");
    expect(simple).toContain("--book-text-color:white");
    expect(simple).not.toContain('data-slot="book-stripe"');
  });

  it("keeps the official perspective, depth, hover transform, typography, and reduced-motion rules", async () => {
    const css = await readFile(
      new URL("../src/components/ui/book.module.css", import.meta.url),
      "utf8",
    );

    expect(css).toContain("perspective: 900px");
    expect(css).toContain("--book-depth: 29cqw");
    expect(css).toContain("transform-style: preserve-3d");
    expect(css).toContain("transform: translateZ(0)");
    expect(css).toContain(
      "var(--book-width, var(--book-default-width)) * 1px - var(--book-depth) / 2 - 3px",
    );
    expect(css).toContain("rotateY(90deg)");
    expect(css).toContain("--hover-rotate: -20deg");
    expect(css).toContain("--hover-scale: 1.066");
    expect(css).toContain("--hover-translate-x: -8px");
    expect(css).toMatch(
      /rotateY\(var\(--hover-rotate\)\)\s+scale\(var\(--hover-scale\)\)\s+translateX\(var\(--hover-translate-x\)\)/,
    );
    expect(css).toContain("transition: transform 250ms var(--ease-out)");
    expect(css).toContain("font-size: 10.5cqw");
    expect(css).toContain("font-size: 12cqw");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
