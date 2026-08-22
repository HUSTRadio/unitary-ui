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
    expect(src).toContain("peer-hover:enabled:peer-not-checked:peer-not-indeterminate:bg-gray-200");
    expect(src).not.toContain("hover:border-foreground/40");
    // Local token mapping: gray-200 (#f2f2f2 light), never the undefined --ds-gray-200 var
    expect(src).not.toContain("var(--ds-gray-200)");
  });

  test("G02-CHK-01: SSR renders native input covering the box (official structure)", () => {
    const markup = checkbox({ "aria-label": "Subscribe" });
    expect(markup).toMatch(/<input[^>]*type="checkbox"/);
    expect(markup).toContain("peer absolute");
    expect(markup).toContain("opacity-0");
  });

  test("checked state uses foreground fill (official #171717 light, not blue)", () => {
    const markup = checkbox({ checked: true, "aria-label": "Subscribe" });
    expect(markup).toContain("peer-checked:bg-foreground");
    expect(markup).toContain("peer-checked:border-foreground");
    expect(markup).not.toContain("bg-blue");
  });

  test("disabled and disabled-checked states use official gray tokens (source-level)", async () => {
    const src = await read("src/components/ui/checkbox.tsx");
    expect(src).toMatch(/peer-disabled:border-gray-500 peer-disabled:bg-gray-100/);
    expect(src).toMatch(
      /peer-disabled:peer-checked:border-gray-600 peer-disabled:peer-checked:bg-gray-600/,
    );
    expect(src).toMatch(/peer-disabled:peer-indeterminate:border-gray-600/);
    const disabledMarkup = checkbox({ disabled: true, "aria-label": "Subscribe" });
    expect(disabledMarkup).toMatch(/disabled/);
  });

  test("indeterminate uses foreground treatment with a Minus line (ref-driven native prop)", async () => {
    const src = await read("src/components/ui/checkbox.tsx");
    expect(src).toMatch(/<Minus/);
    expect(src).toMatch(/indeterminate\?: boolean/);
    expect(src).toMatch(/\.indeterminate = Boolean\(indeterminate\)/);
    expect(src).toContain("peer-indeterminate:bg-foreground");
    expect(src).toContain("peer-indeterminate:border-foreground");
  });

  test("G02-CHK-02 (info only): size API stays sm=16/default=18/lg=20 — local extras, not fixed", async () => {
    const src = await read("src/components/ui/checkbox.tsx");
    expect(src).toMatch(/size\?: "sm" \| "default" \| "lg"/);
    expect(src).toContain('size === "sm" && "size-4"');
    expect(src).toContain('size === "lg" && "size-5"');
  });

  test("Checkbox exports and renders native input (official structure)", async () => {
    const src = await read("src/components/ui/checkbox.tsx");
    expect(src).toMatch(/export\s*\{\s*Checkbox\s*\}/);
    const markup = checkbox({ "aria-label": "Subscribe" });
    expect(markup).toMatch(/<input[^>]*type="checkbox"/);
    expect(markup).toContain('aria-label="Subscribe"');
  });

  test("defaultChecked is an explicit framework extension (not just prop passthrough)", async () => {
    const src = await read("src/components/ui/checkbox.tsx");
    // 显式类型声明：从 Omit 中排除默认透传，并单独声明 defaultChecked
    expect(src).toMatch(
      /Omit<\s*React\.ComponentProps<"input">,\s*"type" \| "checked" \| "onChange" \| "size" \| "children" \| "defaultChecked"\s*>/,
    );
    expect(src).toMatch(/defaultChecked\?: boolean/);
    // 头注释记录其为框架扩展（「框架扩展」行在前，defaultChecked 行在后）
    expect(src).toMatch(/框架扩展[\s\S]{0,80}defaultChecked/);
  });
});
