import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Browser } from "../src/components/ui/browser";

function render(address?: string) {
  return renderToStaticMarkup(
    React.createElement(Browser, { address }, React.createElement("div")),
  );
}

describe("Browser official API contract", () => {
  it("renders 12px traffic-light dots with an 8px gap (P2 geometry)", () => {
    const markup = render("https://example.com");

    // Exactly three 12px dots (size-3), matching official w-3 h-3 rounded-full circles
    expect(markup.match(/size-3 rounded-full/g)).toHaveLength(3);
    // Dots group uses an 8px gap (gap-2), not the old 16px (gap-4)
    expect(markup).toMatch(/<span aria-hidden="true" class="[^"]*items-center gap-2[^"]*">/);
    // Old 14px svg-circle dots are gone
    expect(markup).not.toMatch(/size-3\.5 fill-\[#/);
  });

  it("renders responsive back/forward/reload controls (P1)", () => {
    const markup = render("https://example.com");

    // Controls live in a decorative aria-hidden group, hidden below md, flex at md+
    expect(markup).toMatch(/<span aria-hidden="true" class="[^"]*hidden[^"]*md:flex[^"]*">/);
    // Back / forward / reload icons at 14px (size-3.5) in muted gray-900
    expect(markup).toContain("lucide-arrow-left");
    expect(markup).toContain("lucide-arrow-right");
    expect(markup).toContain("lucide-refresh-cw");
    expect(markup.match(/size-3\.5 text-gray-900/g)).toHaveLength(3);
  });

  it("keeps the chrome decorative: dots and controls are non-focusable, not buttons", () => {
    const markup = render("https://example.com");

    // Only the address-bar Copy action is a real button
    expect(markup.match(/<button/g)).toHaveLength(1);
    expect(markup).not.toContain('aria-label="Back"');
    expect(markup).not.toContain('aria-label="Forward"');
    expect(markup).not.toContain('aria-label="Reload"');
  });

  it("renders the address bar with copy action when address is provided", () => {
    const markup = render("https://example.com");

    expect(markup).toContain("https://example.com");
    expect(markup).toContain('aria-label="Copy"');
    expect(markup).toContain('data-slot="browser-chrome"');
    expect(markup).toContain('data-slot="browser-content"');
  });

  it("omits the address bar when no address is provided", () => {
    const markup = render();

    expect(markup).not.toContain('aria-label="Copy"');
    // No address pill (the pill carries the gray border)
    expect(markup).not.toContain("border-gray-400");
  });
});
