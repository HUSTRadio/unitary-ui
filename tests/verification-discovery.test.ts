// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import { createVitest, type Vitest } from "vitest/node";
import { discoverVerification } from "../scripts/lib/verification-discovery.mjs";

const roots: string[] = [];
const environmentKeys = [
  "NODE_ENV", "TEST", "VITEST", "VITEST_MODE", "MODE", "BASE_URL", "PROD", "DEV", "VITE_USER_NODE_ENV",
] as const;
type DiscoveryEnvironment = Record<typeof environmentKeys[number], string | undefined>;
const originalEnvironment = readEnvironment();

function readEnvironment(): DiscoveryEnvironment {
  return Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]])) as DiscoveryEnvironment;
}
function writeEnvironment(values: DiscoveryEnvironment) {
  for (const key of environmentKeys) {
    if (values[key] === undefined) delete process.env[key];
    else process.env[key] = values[key];
  }
}
function environment(value: string | undefined): DiscoveryEnvironment {
  return Object.fromEntries(environmentKeys.map((key) => [key, value])) as DiscoveryEnvironment;
}

afterEach(() => {
  vi.restoreAllMocks();
  writeEnvironment(originalEnvironment);
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture(overrides: Record<string, string> = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "unitary-verify-discovery-"));
  roots.push(root);
  const entries = {
    "package.json": '{"type":"module"}',
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
    ...overrides,
  };
  for (const [file, source] of Object.entries(entries)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), source);
  }
  return { root, files: Object.keys(entries) };
}

it.each([
  { name: "unset", values: environment(undefined) },
  { name: "custom", values: environment("caller-value") },
  { name: "empty", values: environment("") },
])("uses the real transitive import graph and restores $name toolchain variables", async ({ values }) => {
  const { root, files } = fixture();
  writeEnvironment(values);
  const result = await discoverVerification(root, files, [
    "src/components/ui/radio.ts",
  ]);
  expect(result.available).toEqual(["tests/related.test.ts", "tests/unrelated.test.ts"]);
  expect(result.selected).toEqual(["tests/related.test.ts"]);
  expect(result.routes).toEqual(["/components/radio"]);
  expect(result.missing).toEqual([]);
  expect(result.uncovered).toEqual([]);
  expect(readEnvironment()).toEqual(values);
}, 30_000);

it("restores unset variables when real Vitest initialization fails", async () => {
  const { root, files } = fixture({
    "vitest.config.ts": 'throw new Error("fixture initialization failure");',
  });
  const values = environment(undefined);
  writeEnvironment(values);
  await expect(discoverVerification(root, files, [])).rejects.toThrow("fixture initialization failure");
  expect(readEnvironment()).toEqual(values);
}, 30_000);

it("preserves discovered test inventory and restores variables when registry import fails", async () => {
  const { root, files } = fixture({
    "docs/site/src/data/docs-routes.ts": 'throw new Error("fixture registry failure");',
  });
  const values = environment(undefined);
  writeEnvironment(values);
  await expect(discoverVerification(root, files, [])).rejects.toMatchObject({
    message: "fixture registry failure",
    available: ["tests/related.test.ts", "tests/unrelated.test.ts"],
  });
  expect(readEnvironment()).toEqual(values);
}, 30_000);

it("restores exact caller variables even when closing the real Vitest context rejects", async () => {
  const { root, files } = fixture();
  const values = environment("caller-value");
  values.NODE_ENV = "";
  values.VITE_USER_NODE_ENV = "development";
  const bootstrap = await createVitest("test", {
    root, config: path.join(root, "vitest.config.ts"), watch: false,
  });
  const prototype = Object.getPrototypeOf(bootstrap) as Pick<Vitest, "close">;
  const close = bootstrap.close;
  await bootstrap.close();
  const failure = new Error("fixture close failure");
  vi.spyOn(prototype, "close").mockImplementationOnce(async function (this: Vitest) {
    await close.call(this);
    writeEnvironment(environment("changed-during-close"));
    throw failure;
  });
  writeEnvironment(values);
  await expect(discoverVerification(root, files, [])).rejects.toBe(failure);
  expect(readEnvironment()).toEqual(values);
}, 30_000);
