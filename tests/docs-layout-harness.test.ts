import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const harnessPath = path.join(root, "tests/e2e/docs-layout.spec.ts");

describe("docs layout navigation harness", () => {
  test("uses one clean document navigation per route without redundant reloads", async () => {
    const source = await readFile(harnessPath, "utf8");

    expect(source).not.toContain("page.reload()");
    expect(source).toContain("docs-layout-navigation=");
    expect(source).toContain("new WeakMap<Page, string>()");
  });

  test("bounds shell readiness independently and reports the route", async () => {
    const source = await readFile(harnessPath, "utf8");

    expect(source).toContain("timeout: 30_000");
    expect(source).toContain("Docs shell did not become ready for route");
  });
});
