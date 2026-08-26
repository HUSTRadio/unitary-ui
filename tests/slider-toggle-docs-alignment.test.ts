import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";

import { DEMO_CODE } from "../docs/geist/src/data/demo-code";

const root = process.cwd();
const read = (relativePath: string) => readFile(path.resolve(root, relativePath), "utf8");

describe("Slider and Toggle docs alignment", () => {
  test("Slider exposes the step-max demo in docs, copyable code, and the audit manifest", async () => {
    const [docs, manifestSource] = await Promise.all([
      read("docs/geist/src/components/docs-components-page.tsx"),
      read("tests/audit/geist-audit-manifest.json"),
    ]);
    const manifest = JSON.parse(manifestSource) as {
      components: Array<{ slug: string; variants: string[]; demos: Array<{ id: string }> }>;
    };
    const slider = manifest.components.find((component) => component.slug === "slider");

    expect(docs).toContain('id: "step-max"');
    expect(DEMO_CODE.slider["step-max"]).toContain("step={10}");
    expect(DEMO_CODE.slider["step-max"]).toContain("max={50}");
    expect(slider?.variants).toContain("step-max");
    expect(slider?.demos.map((demo) => demo.id)).toContain("step-max");
  });

  test("Toggle exposes only the five canonical lowercase demo-code keys", async () => {
    const [docs, sectionBatch, docsCss, componentApi] = await Promise.all([
      read("docs/geist/src/components/docs-components-page.tsx"),
      read("docs/geist/src/data/demo-code-section-batch4.ts"),
      read("docs/geist/src/index.css"),
      read("docs/geist/src/data/component-api.ts"),
    ]);

    expect(Object.keys(DEMO_CODE.toggle).sort()).toEqual([
      "custom-color",
      "default",
      "disabled",
      "sizes",
      "with-label",
    ]);
    expect(sectionBatch).not.toMatch(/\n\s*toggle:\s*\{/);
    expect(docs.match(/case "toggle":/g)).toHaveLength(1);
    expect(docs).not.toMatch(/function Toggle(?:Color|Label)Demo/);
    expect(docsCss).not.toContain('[data-demo-component="toggle"][data-demo-mode="live"]');
    const toggleApi = componentApi.slice(
      componentApi.indexOf("  toggle: component("),
      componentApi.indexOf("  tooltip: component("),
    );
    expect(toggleApi).toContain('row("onChange", "() => void"');
    expect(toggleApi).not.toContain("onCheckedChange");
  });
});
