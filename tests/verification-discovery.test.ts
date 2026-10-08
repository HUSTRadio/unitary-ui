// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, expect, it } from "vitest";
import { discoverVerification } from "../scripts/lib/verification-discovery.mjs";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

it("uses Vitest's real transitive import graph without executing test bodies", async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "unitary-verify-discovery-"));
  roots.push(root);
  const entries = {
    "vitest.config.ts": 'export default { test: { include: ["tests/**/*.test.ts"] } };',
    "src/components/ui/radio.ts": "export const radio = 1;",
    "tests/helper.ts": 'export { radio } from "../src/components/ui/radio";',
    "tests/related.test.ts": 'import "./helper"; throw new Error("test module must not execute");',
    "tests/unrelated.test.ts": 'throw new Error("test module must not execute");',
    "docs/site/src/data/docs-routes.ts":
      'export const DOCS_ROUTE_SEQUENCE = [{to:"/components/radio",renderer:{kind:"component-detail",componentName:"radio"}}];',
    "docs/site/src/examples/radio/default.example.tsx":
      'import "../../../../../src/components/ui/radio";',
    "docs/site/src/components/docs-components-page.tsx": "export {};",
  };
  for (const [file, source] of Object.entries(entries)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), source);
  }
  const result = await discoverVerification(root, Object.keys(entries), [
    "src/components/ui/radio.ts",
  ]);
  expect(result.available).toEqual(["tests/related.test.ts", "tests/unrelated.test.ts"]);
  expect(result.selected).toEqual(["tests/related.test.ts"]);
  expect(result.routes).toEqual(["/components/radio"]);
  expect(result.missing).toEqual([]);
  expect(result.uncovered).toEqual([]);
}, 30_000);
