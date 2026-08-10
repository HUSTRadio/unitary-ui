import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { JsonView, makeJsonViewHighlightPattern } from "../src/components/ui/json-view";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

const data = {
  deployment: { id: "dpl_9WjH8QFQySx7", state: "ready" },
  cached: false,
  durationMs: 42,
  tags: ["a", "b"],
  error: null,
};

describe("JsonView official API contract (G06-JSONVIEW)", () => {
  it("exports JsonView and makeJsonViewHighlightPattern", async () => {
    const src = await read("src/components/ui/json-view.tsx");
    expect(src).toMatch(/export\s*\{[^}]*\bJsonView\b[^}]*\}/);
    expect(src).toMatch(/export\s*\{[^}]*\bmakeJsonViewHighlightPattern\b[^}]*\}/);
  });

  it("renders a tree with treeitem rows and ARIA attributes", () => {
    const html = renderToStaticMarkup(React.createElement(JsonView, { data }));
    expect(html).toContain('role="tree"');
    expect(html).toContain('aria-label="JSON"');
    expect(html).toContain('role="treeitem"');
    expect(html).toContain('aria-level="2"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-posinset="1"');
    expect(html).toContain('aria-setsize="5"');
  });

  it("keys render unquoted (JS-object syntax) and use official pink (#c41562 / dark #ff518d) (G06-JSONVIEW-01 / -03)", () => {
    const html = renderToStaticMarkup(React.createElement(JsonView, { data }));
    // Key text must NOT be JSON-quoted (no "deployment" / &quot;deployment&quot;)
    expect(html).not.toContain("&quot;deployment&quot;");
    expect(html).toContain(">deployment</span>");
    expect(html).toContain(">cached</span>");
    expect(html).toContain(">durationMs</span>");
    // Key color: text-pink-900 = #c41562 light / #ff518d dark
    expect(html).toContain('class="text-[#c41562] dark:text-[#ff518d]">deployment</span>');
    expect(html).not.toContain('class="text-foreground"');
  });

  it("booleans use text-amber-900 (#a35200 light) instead of warning (#ffb224) (G06-JSONVIEW-02)", () => {
    const html = renderToStaticMarkup(React.createElement(JsonView, { data }));
    expect(html).toContain('class="text-amber-900">false</span>');
    expect(html).not.toContain('class="text-warning"');
    expect(html).not.toContain('class="text-warning">false');
  });

  it("chevron uses text-gray-500 dark:text-gray-700 (G06-JSONVIEW-04)", () => {
    const html = renderToStaticMarkup(React.createElement(JsonView, { data }));
    expect(html).toContain("text-gray-500 dark:text-gray-700");
    // Chevron wrapper must no longer be muted-foreground
    expect(html).not.toMatch(/inline-flex size-4 [^"]*text-muted-foreground/);
  });

  it("pre container is a bare tree without border/bg/radius/padding (G06-JSONVIEW-05)", () => {
    const html = renderToStaticMarkup(React.createElement(JsonView, { data }));
    expect(html).toMatch(
      /^<pre class="block w-max max-w-full overflow-x-auto align-top font-mono text-copy-13 leading-5"/,
    );
    expect(html).not.toContain("rounded-[8px]");
    expect(html).not.toContain("border-gray-alpha-400");
    expect(html).not.toContain("bg-background");
    expect(html).not.toContain("p-4");
  });

  it("defaultExpandDepth={0} collapses everything; depth 1 expands top level", () => {
    const collapsed = renderToStaticMarkup(
      React.createElement(JsonView, { data, defaultExpandDepth: 0 }),
    );
    // Root expanded=false, no child rows visible
    expect(collapsed).toContain(
      'aria-level="1" aria-posinset="1" aria-setsize="5" aria-expanded="false"',
    );
    expect(collapsed).not.toContain('aria-label="deployment: object"');

    const depth1 = renderToStaticMarkup(
      React.createElement(JsonView, { data, defaultExpandDepth: 1 }),
    );
    expect(depth1).toContain('aria-label="deployment: object"');
    // Nested object stays collapsed at depth 1
    expect(depth1).not.toContain('aria-label="id: primitive"');
  });

  it("collapsed rows render a preview with braces and ellipsis", () => {
    const html = renderToStaticMarkup(React.createElement(JsonView, { data }));
    // deployment row: key: { … } (unquoted key, preview braces)
    expect(html).toContain(
      '>deployment</span><span class="text-muted-foreground">: </span><span class="text-muted-foreground">{</span><span class="text-muted-foreground"> … </span><span class="text-muted-foreground">}</span>',
    );
    // tags (array) preview uses square brackets
    expect(html).toContain(
      '>tags</span><span class="text-muted-foreground">: </span><span class="text-muted-foreground">[</span>',
    );
  });

  it("makeJsonViewHighlightPattern builds a combined case-insensitive pattern", () => {
    const pattern = makeJsonViewHighlightPattern(["request", "failed"]);
    expect(pattern).toBeInstanceOf(RegExp);
    expect(pattern!.flags).toContain("i");
    expect(pattern!.source).toContain("request");
    expect(pattern!.source).toContain("failed");
    expect(makeJsonViewHighlightPattern([])).toBeNull();
    expect(makeJsonViewHighlightPattern([""])).toBeNull();
    expect(makeJsonViewHighlightPattern(["", ""])).toBeNull();
  });

  it("highlightPattern wraps matching key text in <mark>", () => {
    const html = renderToStaticMarkup(
      React.createElement(JsonView, {
        data,
        highlightPattern: makeJsonViewHighlightPattern(["cached"]),
      }),
    );
    expect(html).toContain("<mark");
    expect(html).toContain("bg-[#ffe381]");
    expect(html).toContain(">cached</mark>");
  });

  it("renders primitive value types with semantic colors (string success, number info, null info)", () => {
    const html = renderToStaticMarkup(
      React.createElement(JsonView, {
        data: { s: "hello", n: 42, nil: null, yes: true, no: false },
      }),
    );
    expect(html).toContain('class="text-success">&quot;hello&quot;</span>');
    expect(html).toContain('class="text-info">42</span>');
    expect(html).toContain('class="text-info">null</span>');
    expect(html).toContain('class="text-amber-900">true</span>');
    expect(html).toContain('class="text-amber-900">false</span>');
  });
});
