// @vitest-environment jsdom
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
  test("renders semantic docs prose elements with their fixed slots and classes", () => {
    act(() => {
      root.render(
        <>
          <DocsPageTitle className="max-w-xl">Title</DocsPageTitle>
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

    expect(document.querySelector('[data-slot="docs-prose-title"]')?.className).toContain(
      "max-w-xl",
    );
  });
});
