import { describe, expect, test } from "vitest";

import { EXAMPLE_REGISTRY, EXAMPLE_SOURCE, type ExampleRecord } from "../docs/site/src/examples/registry";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

const pagePath = "docs/site/src/components/docs-components-page.tsx";

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
      'import type { ExampleRecord } from "../examples/registry";',
    );
    expect(src).toContain("const Example = record.Component;");
    expect(src).toContain("<TableDemoCard id={record.id} code={record.source} slug={name}>");
    expect(src).toContain("<Example />");
    expect(src).toContain("EXAMPLE_REGISTRY[name] ?? []");
    expect(src).not.toContain("DEMO_CODE");
    expect(src).not.toContain("demoCode(");
    expect(src).not.toContain("sectionCode(");
  });

  test("keeps legacy hidden inventory examples out of visible titled sections", async () => {
    type SectionRecord = ExampleRecord & { renderInSection?: boolean };
    const hiddenBySlug: Record<string, string[]> = {
      checkbox: ["indeterminate"],
      collapse: ["expanded", "multiple", "small"],
      label: ["with-input", "bypass-casing"],
      radio: ["radio-disabled", "radio-required", "radio-headless", "radio-standalone"],
      select: ["with-options"],
      switch: ["disabled", "sizes", "full-width", "tooltip", "icon"],
      textarea: ["error", "sizes", "read-only", "rows"],
    };

    for (const [slug, expectedIds] of Object.entries(hiddenBySlug)) {
      const records = EXAMPLE_REGISTRY[slug] as readonly SectionRecord[];
      expect(records.filter((record) => record.renderInSection === false).map((record) => record.id)).toEqual(
        expectedIds,
      );
      for (const id of expectedIds) {
        expect(EXAMPLE_SOURCE[slug][id]).toContain("export function");
      }
    }

    const src = await read(pagePath);
    expect(src).toContain("record.renderInSection !== false");
  });

  test("video restores the visible default demo omitted by the legacy source map", () => {
    const primary = EXAMPLE_REGISTRY.video.find((record) => record.id === "default");
    expect(primary).toBeDefined();
    expect(EXAMPLE_SOURCE.video.default).toContain('poster="/demo-poster.png"');
    expect(EXAMPLE_SOURCE.video.default).toContain('src="/demo.mp4"');
  });

  test("modal live demo examples keep official copyable content", async () => {
    const modalExamples = await read("docs/site/src/examples/modal/default-37a8eec1.example.tsx");
    expect(modalExamples).toContain("export function");
    expect(modalExamples).toContain("<Modal");
    expect(modalExamples).toContain("<ModalTrigger");
  });
});
