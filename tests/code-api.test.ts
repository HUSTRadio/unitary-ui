import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Code, InlineCode } from "../src/components/ui/code";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Code official API contract (G02-COD-01 / G02-COD-02)", () => {
  it("exports Code (block-level) and InlineCode (inline)", async () => {
    const src = await read("src/components/ui/code.tsx");
    expect(src).toMatch(/export\s*\{[^}]*\bCode\b[^}]*\}/);
    expect(src).toMatch(/export\s*\{[^}]*\bInlineCode\b[^}]*\}/);
  });

  it("Code renders a block-level <pre> with official metrics (r5, p-6, border, my-8)", () => {
    const html = renderToStaticMarkup(
      React.createElement(Code, { syntax: "javascript" }, "const a = 1;"),
    );
    // Block container: pre element with data-slot="code"
    expect(html).toMatch(/^<pre[^>]*data-slot="code"/);
    expect(html).toContain("rounded-[5px]");
    expect(html).toContain("p-6");
    expect(html).toContain("border-border");
    expect(html).toContain("my-8");
    expect(html).toContain("whitespace-pre");
    expect(html).toContain("touch-pan-y");
    // Inner code: mono 13px/20px + syntax hook
    expect(html).toContain("<code");
    expect(html).toContain("font-mono");
    expect(html).toContain("text-copy-13");
    expect(html).toContain("leading-5");
    expect(html).toContain("language-javascript");
  });

  it("Code no longer renders the inline chip styles (bg/radius/padding pill)", async () => {
    const src = await read("src/components/ui/code.tsx");
    // The old chip classes must not appear anywhere in the file
    expect(src).not.toContain("bg-gray-100");
    expect(src).not.toContain("rounded-[6px]");
    expect(src).not.toContain("px-1.5");
    expect(src).not.toContain("py-0.5");
  });

  it("InlineCode renders plain mono <code> without background or radius (G02-COD-02)", () => {
    const html = renderToStaticMarkup(React.createElement(InlineCode, null, "npm i geist"));
    expect(html).toMatch(/^<code[^>]*data-slot="inline-code"/);
    expect(html).toContain("font-mono");
    expect(html).toContain("text-copy-13");
    // No pill: no background, no radius, no horizontal/vertical padding utilities
    // (plain substring checks like "py-" would false-positive on text-copy-13)
    expect(html).not.toMatch(/\s(?:bg|rounded|px|py)-/);
    // Plain mono text: no muted color override
    expect(html).not.toContain("muted");
  });

  it("InlineCode still accepts prose usage and forwards extra props", () => {
    const html = renderToStaticMarkup(
      React.createElement(InlineCode, { className: "custom", id: "token" }, 'type="error"'),
    );
    expect(html).toContain('class="font-mono text-copy-13 custom"');
    expect(html).toContain('id="token"');
    // Text content with quotes is escaped by React server rendering
    expect(html).toContain("type=&quot;error&quot;");
  });

  it("syntax prop is optional and omitted when absent", () => {
    const html = renderToStaticMarkup(React.createElement(Code, null, "plain"));
    expect(html).not.toContain("language-");
  });
});
