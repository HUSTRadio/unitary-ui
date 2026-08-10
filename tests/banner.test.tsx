import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Banner } from "../src/components/ui/banner";

describe("Banner", () => {
  it("renders both mobile and desktop variants with the official CTA suffix", () => {
    const markup = renderToStaticMarkup(
      <Banner button={{ href: "/components", content: "Read more" }} className="p-4">
        <b>Big News</b> – New components finally available
      </Banner>,
    );

    expect(markup).toContain('data-slot="banner"');
    expect(markup).toContain("max-w-[1080px]");
    // Mobile variant (lg:hidden)
    expect(markup).toContain("lg:hidden");
    // Desktop variant (hidden lg:flex)
    expect(markup).toContain("hidden");
    expect(markup).toContain("lg:flex");
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
  });
});
