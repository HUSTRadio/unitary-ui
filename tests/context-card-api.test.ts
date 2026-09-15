import * as React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import { ContextCardTrigger } from "../src/components/ui/context-card";

const source = readFileSync(
  resolve(import.meta.dirname, "../src/components/ui/context-card.tsx"),
  "utf8",
);

describe("Context Card official visual contract", () => {
  test("default trigger participates in keyboard focus order", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ContextCardTrigger, { content: "Details" }, "Acme"),
    );
    expect(markup).toContain('data-slot="context-card-trigger"');
    expect(markup).toContain('tabindex="0"');
  });

  test("uses bordered fitted geometry, official radius, arrow, and portal layer", () => {
    expect(source).toContain("z-[var(--uni-z-context-card)]"); // Task 9 token form of the locked 1000000
    expect(source).toContain("w-fit");
    expect(source).toContain("rounded-md");
    expect(source).toContain("border-gray-alpha-400");
    expect(source).toContain("p-4");
    expect(source).toContain("shadow-[var(--material-shadow-tooltip)]");
    expect(source).toContain('data-slot="context-card-tip"');
    expect(source).toContain("width={14}");
    expect(source).toContain("height={7}");
  });
});
