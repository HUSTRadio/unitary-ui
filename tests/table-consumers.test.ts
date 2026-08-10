import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const consumers = [
  "src/App.tsx",
  "src/examples/DataTableExample.tsx",
  "docs/geist/src/components/docs-pages.tsx",
];

describe("explicit TableRoot consumer migration", () => {
  for (const path of consumers) {
    it(`${path} wraps standalone Table in TableRoot`, () => {
      const source = read(path);
      expect(source).toMatch(/\bTableRoot\b/);
      expect(source).toContain("<TableRoot>");
      expect(source).toContain("</TableRoot>");
    });
  }
});
