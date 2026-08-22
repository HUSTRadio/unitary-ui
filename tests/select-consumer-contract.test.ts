import { describe, expect, test } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

const CONSUMERS = [
  "src/App.tsx",
  "src/examples/DataTableExample.tsx",
  "src/examples/FormExample.tsx",
  "src/examples/SettingsExample.tsx",
];

describe("Select v2 API consumed across app & examples", () => {
  test("no native <option> inside <Select> (v1 removed)", async () => {
    for (const file of CONSUMERS) {
      const src = await read(file);
      expect(src, file).not.toMatch(/<Select[\s\S]*?<option/);
    }
  });

  test("Select usages use onValueChange, not native onChange", async () => {
    for (const file of CONSUMERS) {
      const src = await read(file);
      expect(src, file).not.toMatch(/<Select[^>]*\bonChange=/);
    }
  });

  test("Select composite children are SelectItem", async () => {
    for (const file of CONSUMERS) {
      const src = await read(file);
      expect(src, file).toMatch(/SelectItem/);
    }
  });
});
