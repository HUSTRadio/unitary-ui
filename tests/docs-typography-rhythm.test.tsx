// @vitest-environment jsdom
import { readFileSync } from "node:fs";

import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import {
  DocsList,
  DocsPageLead,
  DocsPageTitle,
  DocsParagraph,
  DocsSection,
  DocsSectionTitle,
} from "../docs/geist/src/components/docs-typography";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("docs typography rhythm owner", () => {
  test("renders semantic docs prose elements with fixed slots, owner-controlled styles, and mergeable layout classes", () => {
    act(() => {
      root.render(
        <>
          <DocsPageTitle
            className="max-w-xl"
            data-slot="forged-title-slot"
            style={{ fontSize: "99px", lineHeight: "1px", margin: "99px" }}
          >
            Title
          </DocsPageTitle>
          <DocsPageLead>Lead</DocsPageLead>
          <DocsSection>
            <DocsSectionTitle>Section</DocsSectionTitle>
            <DocsParagraph>Paragraph</DocsParagraph>
            <DocsList>
              <li>Item</li>
            </DocsList>
          </DocsSection>
        </>,
      );
    });

    for (const [slot, tag, className] of [
      ["docs-prose-title", "H1", "docs-prose-title"],
      ["docs-prose-lead", "P", "docs-prose-lead"],
      ["docs-prose-section", "SECTION", "docs-prose-section"],
      ["docs-prose-heading", "H2", "docs-prose-heading"],
      ["docs-prose-paragraph", "P", "docs-prose-paragraph"],
      ["docs-prose-list", "UL", "docs-prose-list"],
    ] as const) {
      const element = document.querySelector(`[data-slot="${slot}"]`);
      expect(element).not.toBeNull();
      expect(element?.tagName).toBe(tag);
      expect(element?.className).toContain(className);
    }

    const title = document.querySelector('[data-slot="docs-prose-title"]');
    expect(title?.getAttribute("style")).toBeNull();
    expect(title?.getAttribute("data-slot")).toBe("docs-prose-title");
    expect(title?.className).toContain("max-w-xl");
  });

  test("requires prose owner consumers and prevents DocArticle from owning narrative typography", async () => {
    const sources = [
      "../docs/geist/src/components/doc-content.tsx",
      "../docs/geist/src/components/docs-pages.tsx",
      "../docs/geist/src/components/docs-api-reference.tsx",
      "../docs/geist/src/components/docs-components-page.tsx",
    ].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

    const [docContent, docsPages, apiReference, componentsPage] = sources;

    for (const forbiddenClass of ["text-heading-", "text-copy-", "mt-4", "mt-10", "space-y-3"]) {
      expect(docContent).not.toContain(forbiddenClass);
    }

    for (const [source, owners] of [
      [docContent, ["DocsPageTitle", "DocsPageLead", "DocsSection", "DocsSectionTitle", "DocsParagraph", "DocsList"]],
      [docsPages, ["DocsPageTitle", "DocsPageLead", "DocsSection", "DocsSectionTitle", "DocsParagraph", "DocsList"]],
      [apiReference, ["DocsSection", "DocsSectionTitle", "DocsParagraph"]],
      [componentsPage, ["DocsPageTitle", "DocsPageLead", "DocsSection", "DocsSectionTitle", "DocsList"]],
    ] as const) {
      for (const owner of owners) expect(source).toContain(owner);
    }
  });
});
