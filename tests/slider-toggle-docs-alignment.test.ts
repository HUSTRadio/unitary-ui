import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";

import { EXAMPLE_SOURCE } from "../docs/site/src/examples/registry";

const root = process.cwd();
const read = (relativePath: string) => readFile(path.resolve(root, relativePath), "utf8");

describe("Slider and Toggle docs alignment", () => {
  test("Slider exposes the step-max demo in docs, copyable code, and the audit manifest", async () => {
    const manifestSource = await read("tests/audit/geist-audit-manifest.json");
    const manifest = JSON.parse(manifestSource) as {
      components: Array<{ slug: string; variants: string[]; demos: Array<{ id: string }> }>;
    };
    const slider = manifest.components.find((component) => component.slug === "slider");

    expect(EXAMPLE_SOURCE.slider["step-max"]).toContain("step={10}");
    expect(EXAMPLE_SOURCE.slider["step-max"]).toContain("max={50}");
    expect(EXAMPLE_SOURCE.slider["step-max"]).toContain("export function");
    expect(slider?.variants).toContain("step-max");
    expect(slider?.demos.map((demo) => demo.id)).toContain("step-max");
  });

  test("Toggle exposes only the five canonical lowercase physical examples", async () => {
    const [docs, docsCss, componentApi] = await Promise.all([
      read("docs/site/src/components/docs-components-page.tsx"),
      read("docs/site/src/index.css"),
      read("docs/site/src/data/component-api.ts"),
    ]);

    expect(Object.keys(EXAMPLE_SOURCE.toggle).sort()).toEqual([
      "custom-color",
      "default",
      "disabled",
      "sizes",
      "with-label",
    ]);
    expect(docs).toContain("EXAMPLE_REGISTRY[name]");
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
