import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("inline error foreground semantic token", () => {
  test("maps the official inline-error foreground for both themes", async () => {
    const css = await read("src/styles/index.css");

    expect(css).toContain("--color-error-foreground: var(--error-foreground)");
    expect(css).toContain("--error-foreground: #cb2a2f");
    expect(css).toContain("--error-foreground: #ff6166");
  });

  test("inline error copy consumes the semantic token instead of a utility literal", async () => {
    const components = [
      "error.tsx",
      "error-card.tsx",
      "input.tsx",
      "select.tsx",
      "textarea.tsx",
      "menu.tsx",
      "snippet.tsx",
    ];

    for (const component of components) {
      const source = await read(`src/components/ui/${component}`);
      expect(source, component).toContain("text-error-foreground");
      expect(source, component).not.toContain("text-[#cb2a2f]");
      expect(source, component).not.toContain("dark:text-[#ff6166]");
    }
  });

  test("tooltip error composes destructive background and foreground semantics", async () => {
    const source = await read("src/components/ui/tooltip.tsx");

    expect(source).toContain('background: "var(--destructive)"');
    expect(source).toContain('foreground: "var(--destructive-foreground)"');
    expect(source).not.toContain(
      'error: { background: "var(--destructive)", foreground: "#ffffff" }',
    );
  });

  test("the red Badge variant has its own component semantics", async () => {
    const source = await read("src/components/ui/badge.tsx");

    expect(source).toContain("bg-badge-red text-badge-red-foreground");
    expect(source).toContain("text-badge-red-subtle-foreground");
    expect(source).not.toContain("bg-[#cb2a2f]");
    expect(source).not.toContain("dark:bg-[#d93036]");
    expect(source).not.toContain("text-[#cb2a2f]");
    expect(source).not.toContain("dark:text-[#ff6166]");
  });
});
