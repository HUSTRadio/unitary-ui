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

  it("treats gh: expansion as an external link: target=_blank + rel=noreferrer + brand icon", () => {
    const html = markupOf({ href: "gh:HUSTRadio/unitary-ui", children: "GitHub" });
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
    // brand icon = masked span with simpleicons CDN, no lucide <svg>
    expect(html).toContain("cdn.simpleicons.org/github");
    expect(html).toContain("mask-image");
    expect(html).not.toContain("<svg");
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
    expect(html).toContain("transition-[color,opacity,text-decoration-color]");
    expect(html).toContain("duration-(--uni-duration-fast)");
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

  it("renders a simpleicons forge brand icon (mask span) for GitHub links, not ExternalLink", () => {
    const html = markupOf({ href: "gh:HUSTRadio/unitary-ui", children: "GitHub" });
    // brand icon = masked span with simpleicons CDN, no lucide <svg>
    expect(html).toContain("cdn.simpleicons.org/github");
    expect(html).toContain("mask-image");
    expect(html).not.toContain("<svg");
  });

  it("covers all supported forge platforms with their brand slugs", () => {
    const cases: Array<[string, string]> = [
      ["https://github.com/x/y", "github"],
      ["https://gitlab.com/x/y", "gitlab"],
      ["https://gitee.com/x/y", "gitee"],
      ["https://codeberg.org/x/y", "codeberg"],
      ["https://bitbucket.org/x/y", "bitbucket"],
      ["https://forgejo.org/x", "forgejo"],
      ["https://git.sr.ht/~x/y", "sourcehut"],
    ];
    for (const [href, slug] of cases) {
      const html = markupOf({ href, children: "repo" });
      expect(html, href).toContain(`cdn.simpleicons.org/${slug}`);
      // brand icon replaces ExternalLink for forge links
      expect(html, href).not.toContain("<svg");
    }
  });

  it("keeps ExternalLink svg for non-forge external links", () => {
    const html = markupOf({ href: "https://lucide.dev", children: "lucide.dev" });
    expect(html).toContain("<svg");
    expect(html).not.toContain("cdn.simpleicons.org");
  });

  it("keeps full link interaction states: focus-ring, hover, active, transition", () => {
    const html = markupOf({ href: "https://example.com", children: "x" });
    expect(html).toContain("focus-ring");
    expect(html).toContain("hover:text-foreground");
    expect(html).toContain("hover:decoration-gray-alpha-600");
    expect(html).toContain("active:opacity-80");
    expect(html).toContain("transition-[color,opacity,text-decoration-color]");
    expect(html).toContain("duration-(--uni-duration-fast)");
  });
});
