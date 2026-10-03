import path from "node:path";
import { describe, expect, test, vi } from "vitest";
import ts from "typescript";
import { componentExamplesPlugin } from "../docs/site/build/component-examples-plugin";
import { EXAMPLE_REGISTRY } from "../docs/site/src/examples/registry";
import { EXAMPLE_LOADERS } from "../docs/site/src/examples/registry.ts?example-loaders";

const registry = path.resolve("docs/site/src/examples/registry.ts");

async function load(query: string) {
  const hook = componentExamplesPlugin().load;
  if (typeof hook !== "function") throw new Error("Expected a load hook");
  return await hook.call({ addWatchFile: vi.fn() } as never, `${registry}?${query}`) as string;
}

describe("component example chunks", () => {
  test("derives every loader from the canonical registry", () => {
    expect(Object.keys(EXAMPLE_LOADERS)).toEqual(Object.keys(EXAMPLE_REGISTRY));
  });

  test.each(["carousel", "switch", "button"])("preserves %s component/source pairs and section flags", async (slug) => {
    const loaded = await EXAMPLE_LOADERS[slug]();
    expect(Object.keys(loaded.EXAMPLE_REGISTRY)).toEqual([slug]);
    expect(loaded.EXAMPLE_REGISTRY[slug]).toEqual(EXAMPLE_REGISTRY[slug]);
  });

  test("only imports the selected component's paired files", async () => {
    const generated = await load("example-component=carousel");
    const module = ts.createSourceFile("carousel.js", generated, ts.ScriptTarget.Latest, true);
    const imports = module.statements.filter(ts.isImportDeclaration).map((statement) =>
      (statement.moduleSpecifier as ts.StringLiteral).text,
    );
    expect(imports).toEqual([
      "./carousel/default.example", "./carousel/default.example.tsx?example-source",
      "./carousel/variants.example", "./carousel/variants.example.tsx?example-source",
    ]);
  });

  test("rejects an unknown component instead of silently emitting an empty chunk", async () => {
    await expect(load("example-component=missing-component")).rejects.toThrow("unknown component examples");
  });
});
