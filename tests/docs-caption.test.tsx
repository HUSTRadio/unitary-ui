// @vitest-environment jsdom
import { readFileSync } from "node:fs";

import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { DocsCaption } from "../docs/site/src/components/docs-typography";

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

describe("docs figure caption", () => {
  test("preserves figure semantics, links and its typography owner while merging layout classes", () => {
    act(() => {
      root.render(
        <figure>
          <div>Landscape preview</div>
          <DocsCaption
            className="max-w-xl"
            data-slot="forged-caption-slot"
            style={{ fontSize: "99px", lineHeight: "1px", margin: "99px" }}
          >
            Photograph by <a href="https://commons.wikimedia.org">mirobo</a>
          </DocsCaption>
        </figure>,
      );
    });

    const caption = container.querySelector("figure > figcaption")!;
    expect(caption.getAttribute("data-slot")).toBe("docs-prose-caption");
    expect(caption.classList.contains("docs-prose-caption")).toBe(true);
    expect(caption.classList.contains("docs-prose-paragraph")).toBe(false);
    expect(caption.classList.contains("max-w-xl")).toBe(true);
    expect(caption.getAttribute("style")).toBeNull();
    expect(caption.textContent).toBe("Photograph by mirobo");
    expect(caption.querySelector("a")?.getAttribute("href")).toBe("https://commons.wikimedia.org");
  });

  test("uses the existing 13px/18px footnote scale instead of the body paragraph owner", () => {
    const styles = readFileSync("docs/site/src/index.css", "utf8");
    const ownerRule = styles.match(/\.docs-prose-caption\s*\{([\s\S]*?)\n\}/m)?.[1] ?? "";
    expect(ownerRule).toContain("font-size: var(--uni-text-footnote);");
    expect(ownerRule).toContain("line-height: var(--uni-leading-footnote);");
    expect(ownerRule).toContain("color: var(--muted-foreground);");
    expect(ownerRule).toContain("margin-block: var(--uni-doc-space-paragraph) 0;");
    expect(ownerRule).not.toContain("--uni-text-body");
  });
});
