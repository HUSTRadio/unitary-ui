import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Link } from "../src/components/ui/link";

function markupOf(props: React.ComponentProps<typeof Link>) {
  return renderToStaticMarkup(<Link {...props} />);
}

describe("Link", () => {
  it("expands gh: prefix to the GitHub repository URL", () => {
    const html = markupOf({ href: "gh:HUSTRadio/unitary-ui", children: "GitHub" });
    expect(html).toContain('href="https://github.com/HUSTRadio/unitary-ui"');
  });

  it("expands github: prefix as well", () => {
    const html = markupOf({ href: "github:vercel/geist", children: "Geist" });
    expect(html).toContain('href="https://github.com/vercel/geist"');
  });

  it("treats gh: expansion as an external link: target=_blank + rel=noreferrer + icon", () => {
    const html = markupOf({ href: "gh:HUSTRadio/unitary-ui", children: "GitHub" });
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
    // ExternalLink icon present with theme-token gray
    expect(html).toContain("<svg");
    expect(html).toContain("size-3.5");
    expect(html).toContain("text-gray-700");
    expect(html).toContain('aria-hidden="true"');
  });

  it("marks plain http(s) external links and appends the icon on the right by default", () => {
    const html = markupOf({ href: "https://lucide.dev", children: "lucide.dev" });
    expect(html).toContain('href="https://lucide.dev"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
    expect(html).toContain("<svg");
    // icon rendered after children
    const iconIdx = html.indexOf("<svg");
    const textIdx = html.indexOf("lucide.dev");
    expect(iconIdx).toBeGreaterThan(textIdx);
  });

  it("supports iconSide=left rendering the icon before children", () => {
    const left = markupOf({
      href: "https://example.com",
      iconSide: "left",
      children: "Example",
    });
    const iconIdx = left.indexOf("<svg");
    const textIdx = left.indexOf("Example");
    expect(iconIdx).toBeLessThan(textIdx);
  });

  it("keeps internal relative paths as plain anchors: no target, no rel, no icon", () => {
    const html = markupOf({ href: "/components/button", children: "Button" });
    expect(html).toContain('href="/components/button"');
    expect(html).not.toContain('target="_blank"');
    expect(html).not.toContain("noreferrer");
    expect(html).not.toContain("<svg");
  });

  it("uses the shared docs link look: underline / gray-alpha decoration / offset-4 / hover foreground", () => {
    const html = markupOf({ href: "/docs", children: "Docs" });
    expect(html).toContain("underline");
    expect(html).toContain("decoration-gray-alpha-400");
    expect(html).toContain("underline-offset-4");
    expect(html).toContain("transition-colors");
    expect(html).toContain("duration-150");
    expect(html).toContain("hover:text-foreground");
  });

  it("merges caller className after the base styles", () => {
    const html = markupOf({
      href: "https://example.com",
      className: "text-muted-foreground",
      children: "x",
    });
    expect(html).toContain("text-muted-foreground");
    expect(html).toContain("underline-offset-4");
  });
});
