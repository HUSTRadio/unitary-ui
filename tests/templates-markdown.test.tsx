// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@hustradio/unitary-ui";
import { describe, expect, it } from "vitest";
import { DocumentBody, documentOutline } from "../templates/docs/src/markdown";

describe("template Markdown mapping", () => {
  it("derives headings and duplicate slugs from the parsed Markdown", () => {
    const source =
      "# Title\n\n## **Repeated** heading\n\n## Repeated heading\n\n### 子章节\n\n```md\n## Not a heading\n```";
    const outline = documentOutline(source);
    expect(outline.map((item) => item.id)).toEqual([
      "repeated-heading",
      "repeated-heading-1",
      "子章节",
    ]);
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <I18nProvider locale="en">
          <DocumentBody source={source} />
        </I18nProvider>
      </MemoryRouter>,
    );
    for (const heading of outline) expect(html).toContain(`id="${heading.id}"`);
    expect(html).toContain('data-slot="code-block"');
    expect(html).not.toContain('id="not-a-heading"');
  });
  it("renders GFM tables, inline code, public CodeBlock and router-aware links", () => {
    const source =
      '# Guide\n\nUse `active`.\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n```json\n{"a": 1}\n```\n\n[Next](faq.md) [Section](#guide)';
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/configuration"]}>
        <I18nProvider locale="en">
          <DocumentBody source={source} />
        </I18nProvider>
      </MemoryRouter>,
    );
    expect(html).toContain("<table");
    expect(html).toContain('data-slot="inline-code"');
    expect(html).toContain('data-slot="code-block"');
    expect(html).toContain('href="/faq"');
    expect(html).toContain('href="/configuration#guide"');
    expect(html).not.toContain("<pre><div");
  });
});
