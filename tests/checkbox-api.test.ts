import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

import { Checkbox } from "../src/components/ui/checkbox";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

const checkbox = (props: React.ComponentProps<typeof Checkbox>) =>
  renderToStaticMarkup(React.createElement(Checkbox, props));

describe("Checkbox official API contract (G02)", () => {
  test("G02-CHK-01: unchecked hover fills the box bg with gray-200, not border-only", async () => {
    const src = await read("src/components/ui/checkbox.tsx");
    // The hover fill class (official: peer-hover:not-peer-disabled:not-peer-checked:bg-[var(--ds-gray-200)])
    expect(src).toMatch(/peer-hover:not-peer-disabled:not-peer-checked:bg-gray-200/);
    // Border tint stays, but the fill must sit next to it on the hover line — never border-only
    expect(src).toMatch(
      /hover:border-foreground\/40[\s\S]{0,120}peer-hover:not-peer-disabled:not-peer-checked:bg-gray-200/,
    );
    // Local token mapping: gray-200 (#f2f2f2 light), never the undefined --ds-gray-200 var
    expect(src).not.toContain("var(--ds-gray-200)");
  });

  test("G02-CHK-01: SSR renders the hover-fill class on an unchecked checkbox", () => {
    const markup = checkbox({ "aria-label": "Subscribe" });
    expect(markup).toContain('data-state="unchecked"');
    expect(markup).toContain("peer-hover:not-peer-disabled:not-peer-checked:bg-gray-200");
    expect(markup).toContain("hover:border-foreground/40");
  });

  test("checked state uses foreground fill (official #171717 light, not blue)", () => {
    const markup = checkbox({ checked: true, "aria-label": "Subscribe" });
    expect(markup).toContain('aria-checked="true"');
    expect(markup).toContain("data-[state=checked]:bg-foreground");
    expect(markup).toContain("data-[state=checked]:border-foreground");
    expect(markup).not.toContain("bg-blue");
  });

  test("disabled and disabled-checked states use official gray tokens (source-level)", async () => {
    const src = await read("src/components/ui/checkbox.tsx");
    expect(src).toMatch(/disabled:bg-gray-100 disabled:border-gray-500/);
    expect(src).toMatch(
      /disabled:data-\[state=checked\]:border-gray-600 disabled:data-\[state=checked\]:bg-gray-600/,
    );
    expect(src).toMatch(
      /disabled:data-\[state=indeterminate\]:border-gray-600 disabled:data-\[state=indeterminate\]:bg-gray-600/,
    );
    const disabledMarkup = checkbox({ disabled: true, "aria-label": "Subscribe" });
    expect(disabledMarkup).toContain('disabled=""');
  });

  test("indeterminate uses foreground treatment with a Minus line", async () => {
    const src = await read("src/components/ui/checkbox.tsx");
    expect(src).toMatch(/<Minus/);
    expect(src).toMatch(/hidden group-data-\[state=indeterminate\]\/checkbox:block/);
    const markup = checkbox({ checked: "indeterminate", "aria-label": "Select all" });
    expect(markup).toContain('aria-checked="mixed"');
    expect(markup).toContain('data-state="indeterminate"');
    expect(markup).toContain("data-[state=indeterminate]:bg-foreground");
    expect(markup).toContain("data-[state=indeterminate]:border-foreground");
  });

  test("G02-CHK-02 (info only): size API stays sm=16/default=18/lg=20 — local extras, not fixed", async () => {
    const src = await read("src/components/ui/checkbox.tsx");
    expect(src).toMatch(/size\?: "sm" \| "default" \| "lg"/);
    const sm = checkbox({ "aria-label": "Subscribe" });
    expect(sm).toContain('data-size="sm"');
    const lg = checkbox({ size: "lg", "aria-label": "Subscribe" });
    expect(lg).toContain('data-size="lg"');
    expect(lg).toContain("data-[size=lg]:size-5");
  });

  test("Checkbox exports and renders the radix button with data-slot", async () => {
    const src = await read("src/components/ui/checkbox.tsx");
    expect(src).toMatch(/export\s*\{\s*Checkbox\s*\}/);
    const markup = checkbox({ "aria-label": "Subscribe" });
    expect(markup).toMatch(/^<button[^>]*role="checkbox"/);
    expect(markup).toContain('data-slot="checkbox"');
  });
});
