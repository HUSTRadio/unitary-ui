import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Banner } from "../src/components/ui/banner";

describe("Banner official API contract", () => {
  it("renders a single universal message + CTA structure (no mobile pill variant)", () => {
    const markup = renderToStaticMarkup(
      <Banner button={{ href: "#", content: "Read more" }}>
        <b>Big News</b> – New components finally available
      </Banner>,
    );

    // Single root banner element, not a hidden/mobile split
    expect(markup.match(/data-slot="banner"/g)).toHaveLength(1);
    // No whole-message pill button variant
    expect(markup).not.toContain("lg:hidden");
    // Text and CTA are siblings inside the banner container
    expect(markup).toContain("<p");
    expect(markup).toContain("Read more");
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
