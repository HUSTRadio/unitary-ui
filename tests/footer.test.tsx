import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Footer } from "../src/components/ui/footer";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/overview" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [{ label: "Docs", href: "/docs" }],
  },
];

describe("Footer", () => {
  it("renders footer > container with border-t border-gray-alpha-400 and py-8", () => {
    const markup = renderToStaticMarkup(<Footer />);

    expect(markup).toMatch(/<footer[ >]/);
    // Container carries the visual contract classes
    expect(markup).toContain("border-t");
    expect(markup).toContain("border-gray-alpha-400");
    expect(markup).toContain("py-8");
  });

  it("renders column titles and links", () => {
    const markup = renderToStaticMarkup(<Footer columns={columns} />);

    expect(markup).toContain("Product");
    expect(markup).toContain("Resources");
    expect(markup).toContain('href="/overview"');
    expect(markup).toContain(">Docs</a>");
  });

  it("uses text-copy-13 muted styling for link text", () => {
    const markup = renderToStaticMarkup(<Footer columns={columns} />);

    expect(markup).toContain("text-copy-13");
    expect(markup).toContain("text-gray-900");
  });

  it("renders slotLeading before the columns and slotTrailing after", () => {
    const markup = renderToStaticMarkup(
      <Footer
        columns={columns}
        slotLeading={<span data-slot="lead">LEAD</span>}
        slotTrailing={<span data-slot="trail">TRAIL</span>}
      />,
    );

    const lead = markup.indexOf("LEAD");
    const firstColumn = markup.indexOf("Product");
    const trail = markup.indexOf("TRAIL");
    expect(lead).toBeGreaterThan(-1);
    expect(trail).toBeGreaterThan(firstColumn);
    expect(lead < firstColumn).toBe(true);
    expect(markup).toContain('data-slot="lead"');
    expect(markup).toContain('data-slot="trail"');
  });

  it("sticky adds sticky bottom-0 to the outer footer element", () => {
    const plain = renderToStaticMarkup(<Footer />);
    const sticky = renderToStaticMarkup(<Footer sticky />);

    expect(sticky).toContain("sticky");
    expect(sticky).toContain("bottom-0");
    expect(plain).not.toContain("sticky");
  });
});
