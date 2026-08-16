import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Banner } from "../src/components/ui/banner";

describe("Banner", () => {
  it("renders the universal message + CTA layout matching the official structure", () => {
    const markup = renderToStaticMarkup(
      <Banner button={{ href: "/components", content: "Read more" }}>
        <b>Big News</b> – New components finally available
      </Banner>,
    );

    expect(markup).toContain('data-slot="banner"');
    expect(markup).toContain("max-w-[1080px]");
    expect(markup).toContain("justify-center");
    expect(markup).toContain("gap-3");
    expect(markup).toContain("p-4");
    expect(markup).toContain('href="/components"');
    expect(markup).toContain("Read more");
    expect(markup).toContain("<svg");
    // Chevron must be 14px (size-3.5), not 16px (size-4)
    expect(markup).toContain("size-3.5");
    expect(markup).not.toContain("size-4");
    // CTA must use text-button-14 (14px/21px)
    expect(markup).toContain("text-button-14");
    // Banner must NOT collapse into a single whole-message pill button
    expect(markup).not.toContain("lg:hidden");
  });
});
