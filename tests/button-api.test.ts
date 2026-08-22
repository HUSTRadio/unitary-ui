import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Button official single-track API contract", () => {
  test("button.tsx exports Button, ButtonLink, CustomButton, buttonVariants", async () => {
    const src = await read("src/components/ui/button.tsx");
    expect(src).toMatch(/export\s*\{[^}]*Button\b[^}]*\}/);
    expect(src).toMatch(/export\s*\{[^}]*ButtonLink\b[^}]*\}/);
    expect(src).toMatch(/export\s*\{[^}]*CustomButton\b[^}]*\}/);
    expect(src).toMatch(/export\s*\{[^}]*buttonVariants\b[^}]*\}/);
  });

  test("Button uses type prop for visual variant, typeName for HTML type", async () => {
    const src = await read("src/components/ui/button.tsx");
    // type is the visual variant prop (default/secondary/error/warning/tertiary)
    expect(src).toMatch(/type[?:]\s*["']default["']/);
    expect(src).toContain("typeName");
    expect(src).toMatch(/typeName.*=.*["']submit["']/);
  });

  test("Button has svgOnly prop for icon-only buttons", async () => {
    const src = await read("src/components/ui/button.tsx");
    expect(src).toContain("svgOnly");
  });

  test("Button has shadow prop", async () => {
    const src = await read("src/components/ui/button.tsx");
    expect(src).toContain("shadow");
  });

  test("text buttons use a single 8px icon gap without reserving a 20px icon slot", async () => {
    const src = await read("src/components/ui/button.tsx");
    expect(src).toContain('"mr-2 flex size-3.5 shrink-0 items-center justify-center"');
    expect(src).toContain('"ml-2 flex size-3.5 shrink-0 items-center justify-center"');
    expect(src).toContain('<span className="inline-block truncate">{children}</span>');
    expect(src).not.toContain("min-w-5 shrink-0 items-center justify-center");
  });

  test("Button variant values are default/secondary/error/warning/tertiary only", async () => {
    const src = await read("src/components/ui/button.tsx");
    // Must NOT contain old variant names as cva keys
    expect(src).not.toMatch(/destructive:\s/);
    expect(src).not.toMatch(/outline:\s/);
    expect(src).not.toMatch(/ghost:\s/);
    // Must contain new variant names
    expect(src).toMatch(/error:\s/);
    expect(src).toMatch(/tertiary:\s/);
    expect(src).toMatch(/secondary:\s/);
    expect(src).toMatch(/warning:\s/);
  });

  test("Button size values are tiny/small/medium/large", async () => {
    const src = await read("src/components/ui/button.tsx");
    expect(src).toMatch(/tiny:\s/);
    expect(src).toMatch(/small:\s/);
    expect(src).toMatch(/medium:\s/);
    expect(src).toMatch(/large:\s/);
    // Must NOT contain old size names
    expect(src).not.toMatch(/\bxs:\s/);
    expect(src).not.toMatch(/\bsm:\s/);
    expect(src).not.toMatch(/\blg:\s/);
  });

  test("no consumer uses old variant names (destructive/outline/ghost)", async () => {
    const targets = [
      "src/App.tsx",
      "src/components/ui/button.tsx",
      "src/components/ui/load-more-button.tsx",
      "src/components/ui/menu.tsx",
      "src/components/ui/project-banner.tsx",
      "src/components/ui/feedback.tsx",
      "src/components/ui/fieldset.tsx",
      "src/components/ui/destructive-action-modal.tsx",
      "src/components/ui/relative-time-card.tsx",
      "src/components/ui/split-button.tsx",
      "src/examples",
      "docs/geist/src",
    ];

    const { readdir, stat } = await import("node:fs/promises");
    async function collectDir(relativePath: string): Promise<string[]> {
      const absolutePath = path.join(root, relativePath);
      try {
        const s = await stat(absolutePath);
        if (s.isFile()) return [relativePath];
      } catch {
        return [];
      }
      const entries = await readdir(absolutePath, { withFileTypes: true });
      const nested = await Promise.all(
        entries.map((entry) => collectDir(path.join(relativePath, entry.name))),
      );
      return nested.flat();
    }

    const allFiles = (await Promise.all(targets.map((t) => collectDir(t).catch(() => [])))).flat();

    const violations: string[] = [];
    for (const file of allFiles) {
      if (!/\.(?:ts|tsx)$/.test(file)) continue;
      const source = await read(file);
      // Check for old variant names in Button props
      if (/variant=["'](?:destructive|outline|ghost)["']/.test(source)) {
        violations.push(`${file}: uses old variant name`);
      }
      // Check for old size names on Button (not Badge or other components)
      if (/<Button[^>]*\bsize=["'](?:xs|sm|default|lg|icon|icon-sm|icon-lg)["']/.test(source)) {
        if (!file.includes("button.tsx")) {
          violations.push(`${file}: uses old Button size name`);
        }
      }
      // Check for type="button" / type="submit" (should be typeName now)
      if (/<Button[^>]*\btype=["'](?:button|submit)["']/.test(source)) {
        violations.push(`${file}: uses type= for HTML type instead of typeName=`);
      }
    }

    expect(violations).toEqual([]);
  });
});
