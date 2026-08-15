import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Banner } from "../src/components/ui/banner";

describe("Banner official API contract", () => {
  it("renders a mobile whole-message CTA visible below lg breakpoint", () => {
    const markup = renderToStaticMarkup(
      <Banner button={{ href: "#", content: "Read more" }} className="p-4">
        <b>Big News</b> – New components finally available
      </Banner>,
    );

    // Must NOT be entirely hidden below lg
    expect(markup).not.toContain("hidden ... lg:flex");
    // Must have a mobile-visible pill CTA (lg:hidden on the pill variant)
    expect(markup).toMatch(/lg:hidden/);
    // Must have a desktop content/CTA row (hidden ... lg:flex)
    expect(markup).toMatch(/hidden[^"]*lg:flex/);
  });

  it("CTA uses text-button-14 (14px/21px line height) not 20px", () => {
    const markup = renderToStaticMarkup(
      <Banner button={{ href: "#", content: "Read more" }}>
        <b>Big News</b>
      </Banner>,
    );

    // Must use text-button-14 class which has 21px line-height
    expect(markup).toContain("text-button-14");
  });

  it("chevron icon is 14px (size-3.5) not 16px (size-4)", () => {
    const markup = renderToStaticMarkup(
      <Banner button={{ href: "#", content: "Read more" }}>
        <b>Big News</b>
      </Banner>,
    );

    // Must NOT have size-4 on the chevron
    expect(markup).not.toContain("size-4");
    // Must have size-3.5 (14px)
    expect(markup).toContain("size-3.5");
  });
});
