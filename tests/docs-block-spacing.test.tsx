// @vitest-environment jsdom
import { readFileSync } from "node:fs";

import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { DocsBlock } from "../docs/site/src/components/docs-typography";

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

describe("DocsBlock spacing owner", () => {
  test("owns its semantic slot and external rhythm while preserving caller layout classes", () => {
    act(() => {
      root.render(
        <DocsBlock
          className="grid gap-3 sm:grid-cols-2"
          data-slot="forged-block-slot"
          style={{ margin: "99px", gap: "99px" }}
        >
          Block content
        </DocsBlock>,
      );
    });

    const block = document.querySelector('[data-slot="docs-prose-block"]');
    expect(block?.tagName).toBe("DIV");
    expect(block?.getAttribute("style")).toBeNull();
    expect(block?.className).toContain("docs-prose-block");
    expect(block?.className).toContain("grid");
    expect(block?.className).toContain("gap-3");
  });

  test("uses the shared 16px token for block margins without changing child grid spacing", () => {
    const stylesPath = "../src/styles/index.css";
    const guideSectionsPath = "../docs/site/src/components/component-guide-sections.tsx";
    const styles = readFileSync(new URL(stylesPath, import.meta.url), "utf8");
    const ownerRule = styles.match(/\.docs-prose-block\s*\{([\s\S]*?)\n\}/m)?.[1] ?? "";
    const guideSections = readFileSync(new URL(guideSectionsPath, import.meta.url), "utf8");

    expect(ownerRule).toContain("margin-block: var(--uni-doc-space-heading-body);");
    expect(ownerRule).not.toContain("padding");
    expect(ownerRule).not.toContain("gap:");
    expect(guideSections).toContain('import { DocsBlock, DocsList, DocsParagraph, DocsSection, DocsSectionTitle }');
    expect(guideSections).toMatch(
      new RegExp(
        '<DocsBlock className="grid gap-3 sm:grid-cols-2">[\\s\\S]*?\\{guide\\.examples\\.map[\\s\\S]*?<\\/DocsBlock>',
      ),
    );
  });

  test("owns live demos, extra demo sections, and API content blocks", () => {
    const componentsPage = readFileSync(
      "docs/site/src/components/docs-components-page.tsx",
      "utf8",
    );
    const apiReference = readFileSync(
      "docs/site/src/components/docs-api-reference.tsx",
      "utf8",
    );

    expect(componentsPage).toContain("DocsBlock");
    expect(componentsPage).toMatch(
      /<DocsBlock[^>]*data-demo-component=\{componentName\}[\s\S]*?\{children\}[\s\S]*?<\/DocsBlock>/,
    );
    expect(componentsPage).toMatch(
      /<DocsSection>[\s\S]*?<DocsSectionTitle>[\s\S]*?<DocsBlock>[\s\S]*?<TableDemoCard/,
    );
    expect(componentsPage).not.toContain('className="mt-6"');

    expect(apiReference).toContain("DocsBlock");
    expect(apiReference).not.toContain('className="mt-5');
    expect(apiReference).not.toContain('className="mt-6');
  });
});
