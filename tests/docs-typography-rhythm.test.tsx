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

function readOwnerRule(css: string, ownerClass: string) {
  const rule = css.match(new RegExp(`\\.${ownerClass}\\s*\\{([\\s\\S]*?)\\n\\}`, "m"));
  expect(rule, `missing .${ownerClass} owner rule`).not.toBeNull();
  return rule?.[1] ?? "";
}

describe("docs typography rhythm owner", () => {
  test("keeps style and data-slot overrides out of every semantic prose owner while merging layout classes", () => {
    const forgedStyle = { fontSize: "99px", lineHeight: "1px", margin: "99px", color: "red" };

    act(() => {
      root.render(
        <>
          <DocsPageTitle
            className="max-w-xl"
            data-slot="forged-title-slot"
            style={forgedStyle}
          >
            Title
          </DocsPageTitle>
          <DocsPageLead
            className="max-w-xl"
            data-slot="forged-lead-slot"
            style={forgedStyle}
          >
            Lead
          </DocsPageLead>
          <DocsSection
            className="scroll-mt-8"
            data-slot="forged-section-slot"
            style={forgedStyle}
          >
            Section
          </DocsSection>
          <DocsSectionTitle
            className="max-w-xl"
            data-slot="forged-heading-slot"
            style={forgedStyle}
          >
            Heading
          </DocsSectionTitle>
          <DocsParagraph
            className="max-w-xl"
            data-slot="forged-paragraph-slot"
            style={forgedStyle}
          >
            Paragraph
          </DocsParagraph>
          <DocsList className="list-disc" data-slot="forged-list-slot" style={forgedStyle}>
            <li>Item</li>
          </DocsList>
        </>,
      );
    });

    for (const [slot, tag, ownerClass, layoutClass] of [
      ["docs-prose-title", "H1", "docs-prose-title", "max-w-xl"],
      ["docs-prose-lead", "P", "docs-prose-lead", "max-w-xl"],
      ["docs-prose-section", "SECTION", "docs-prose-section", "scroll-mt-8"],
      ["docs-prose-heading", "H2", "docs-prose-heading", "max-w-xl"],
      ["docs-prose-paragraph", "P", "docs-prose-paragraph", "max-w-xl"],
      ["docs-prose-list", "UL", "docs-prose-list", "list-disc"],
    ] as const) {
      const element = document.querySelector(`[data-slot="${slot}"]`);
      expect(element).not.toBeNull();
      expect(element?.tagName).toBe(tag);
      expect(element?.getAttribute("style")).toBeNull();
      expect(element?.getAttribute("data-slot")).toBe(slot);
      expect(element?.className).toContain(ownerClass);
      expect(element?.className).toContain(layoutClass);
    }
  });

  test("makes narrative prose owners explicitly muted without muting headings", () => {
    const stylesPath = "../src/styles/index.css";
    const styles = readFileSync(new URL(stylesPath, import.meta.url), "utf8");

    for (const ownerClass of ["docs-prose-lead", "docs-prose-paragraph", "docs-prose-list"]) {
      expect(readOwnerRule(styles, ownerClass)).toContain("color: var(--muted-foreground);");
    }

    for (const ownerClass of ["docs-prose-title", "docs-prose-heading"]) {
      expect(readOwnerRule(styles, ownerClass)).not.toContain("color: var(--muted-foreground);");
    }
  });

  test("requires real semantic prose JSX consumers without direct legacy typography or color overrides", () => {
    const sources = [
      "../docs/geist/src/components/doc-content.tsx",
      "../docs/geist/src/components/docs-pages.tsx",
      "../docs/geist/src/components/docs-api-reference.tsx",
      "../docs/geist/src/components/docs-components-page.tsx",
    ].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

    const [docContent, docsPages, apiReference, componentsPage] = sources;

    for (const [source, owners] of [
      [docContent, ["DocsPageTitle", "DocsPageLead", "DocsSection", "DocsSectionTitle", "DocsParagraph", "DocsList"]],
      [docsPages, ["DocsPageTitle", "DocsPageLead", "DocsSection", "DocsSectionTitle", "DocsParagraph", "DocsList"]],
      [apiReference, ["DocsSection", "DocsSectionTitle", "DocsParagraph"]],
      [componentsPage, ["DocsPageTitle", "DocsPageLead", "DocsSection", "DocsSectionTitle", "DocsList"]],
    ] as const) {
      for (const owner of owners) {
        expect(source.match(new RegExp(`<${owner}\\b[^>]*>`, "g"))).not.toBeNull();
      }

      const proseOwnerTags = source.match(/<Docs(?:PageTitle|PageLead|Section|SectionTitle|Paragraph|List)\b[^>]*>/g) ?? [];
      expect(proseOwnerTags).not.toHaveLength(0);
      for (const tag of proseOwnerTags) {
        expect(tag).not.toMatch(/\b(?:text-(?:heading|copy)-\S+|text-(?:muted-)?foreground)\b/);
      }
    }
  });
});
