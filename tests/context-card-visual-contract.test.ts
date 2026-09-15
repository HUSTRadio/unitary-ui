import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

const source = readFileSync(
  resolve(import.meta.dirname, "../src/components/ui/context-card.tsx"),
  "utf8",
);
const docsSource = readFileSync(
  resolve(import.meta.dirname, "../docs/geist/src/components/docs-components-page.tsx"),
  "utf8",
);
const stylesSource = readFileSync(resolve(import.meta.dirname, "../src/styles/index.css"), "utf8");

describe("Context Card visual parity contract", () => {
  test("uses the official 6px popover surface and dark-safe semantic tokens", () => {
    expect(source).toContain("rounded-md");
    expect(source).toContain("border-gray-alpha-400");
    expect(source).toContain("bg-background-100");
    expect(source).toContain("p-4");
    expect(source).toContain("flex-[0_1_auto]");
    expect(source).toContain("overflow-hidden");
  });

  test("uses official 16px string content and muted 13px metadata typography", () => {
    expect(source).toContain("text-copy-16");
    expect(source).toContain("text-copy-13");
  });

  test("renders the official fill/stroke arrow without an inner border stroke", () => {
    expect(source).toContain('data-slot="context-card-tip"');
    expect(source).toContain('fill="var(--background-100)"');
    expect(source).toContain('stroke="var(--context-card-tip-stroke)"');
  });

  test("aligns each arrow root directly to the popover border without an inward half-tip offset", () => {
    expect(stylesSource).toContain("transform: translateX(-50%);");
    expect(stylesSource).toContain("transform: translateX(-50%) rotate(180deg);");
    expect(stylesSource).toContain("transform: translateY(-50%) rotate(-90deg);");
    expect(stylesSource).toContain("transform: translateY(-50%) rotate(90deg);");
    expect(stylesSource).not.toContain("translate(-50%, -3.5px)");
    expect(stylesSource).not.toContain("translate(-50%, 3.5px)");
    expect(stylesSource).not.toContain("translate(-3.5px, -50%)");
    expect(stylesSource).not.toContain("translate(3.5px, -50%)");
  });

  test("alignment and render-prop demos use the official compact button and link classes", () => {
    expect(EXAMPLE_SOURCE["context-card"].alignment).toContain('<Button type="default" typeName="button">');
    expect(EXAMPLE_SOURCE["context-card"]["render-prop"]).toContain('className="text-blue-700 underline underline-offset-2"');
  });

  test("Show code toggle is wired to the physical example source", () => {
    expect(docsSource).toContain("setShowCode");
    expect(docsSource).toContain("aria-controls={codeId}");
    expect(docsSource).toContain("EXAMPLE_REGISTRY[name]");
    expect(docsSource).toContain("code={record.source}");
    expect(EXAMPLE_SOURCE["context-card"].default).toContain("export function");
    expect(EXAMPLE_SOURCE["context-card"].default).toContain("<ContextCard");
  });
});
