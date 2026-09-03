import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

const pagePath = "docs/geist/src/components/docs-components-page.tsx";

describe("docs Show code footer", () => {
  test("has a functional DemoShowCode with onClick toggle", async () => {
    const src = await read(pagePath);
    expect(src).toMatch(/function DemoShowCode/);
    expect(src).toMatch(/setShowCode/);
    expect(src).toMatch(/onClick=\{\s*\(\) => setShowCode/);
    // expanded state rotates the chevron 90deg (official behavior), not -90deg
    expect(src).toMatch(/transition-transform\$\{showCode \? " rotate-90" : ""\}/);
  });

  test("no demo keeps a dead footerBar (data-state=closed + empty hidden div)", async () => {
    const src = await read(pagePath);
    expect(src).not.toMatch(/<div data-state="closed" hidden \/>/);
    expect(src).not.toMatch(/const footerBar = \(/);
    expect(src).not.toMatch(/\{footerBar\}/);
  });

  test("live demos and Show Code consume the same registry record", async () => {
    const src = await read(pagePath);
    expect(src).toContain(
      'import { EXAMPLE_REGISTRY, type ExampleRecord } from "../examples/registry";',
    );
    expect(src).toContain("const Example = record.Component;");
    expect(src).toContain("<TableDemoCard id={record.id} code={record.source}>");
    expect(src).toContain("<Example />");
    expect(src).toContain("EXAMPLE_REGISTRY[name] ?? []");
    expect(src).not.toContain("DEMO_CODE");
    expect(src).not.toContain("demoCode(");
    expect(src).not.toContain("sectionCode(");
  });

  test("modal live demo examples keep official copyable content", async () => {
    const modalExamples = await read("docs/geist/src/examples/modal/default-37a8eec1.example.tsx");
    expect(modalExamples).toContain("export function");
    expect(modalExamples).toContain("<Modal");
    expect(modalExamples).toContain("<ModalTrigger");
  });
});
