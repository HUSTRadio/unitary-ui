import { describe, expect, test } from "vitest";

import { renderToStaticMarkup } from "react-dom/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DisabledWall,
  ErrorText,
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetSubtitle,
  FieldsetTitle,
  WarningText,
} from "../src/components/ui/fieldset";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

/** 提取指定函数（含函数体）源码片段；`\b` 防止前缀误匹配（如 FieldsetFooterActions）。 */
function fnSrc(src: string, name: string): string {
  const match = src.match(
    new RegExp(`function ${name}\\b[\\s\\S]*?(?=\\nfunction |\\nexport \\{)`),
  );
  if (!match) throw new Error(`function ${name} not found in fieldset.tsx`);
  return match[0];
}

describe("Fieldset official API contract", () => {
  test("exports Fieldset + all official sub-components incl. ErrorText/WarningText/DisabledWall", async () => {
    const src = await read("src/components/ui/fieldset.tsx");
    for (const name of [
      "Fieldset",
      "FieldsetTitle",
      "FieldsetSubtitle",
      "FieldsetContent",
      "FieldsetFooter",
      "FieldsetFooterStatus",
      "FieldsetFooterActions",
      "FieldsetFooterAction",
      "ErrorText",
      "WarningText",
      "DisabledWall",
    ]) {
      expect(src).toMatch(new RegExp(`export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`));
    }
  });

  test("FS-2: FieldsetContent accepts disabled prop and dims content with text-gray-700", async () => {
    const src = await read("src/components/ui/fieldset.tsx");
    const content = fnSrc(src, "FieldsetContent");
    expect(content).toMatch(/disabled\s*=\s*false/);
    expect(content).toContain("text-gray-700");
  });

  test("FS-3: FieldsetFooter accepts highlight prop -> bg highlight color", async () => {
    const src = await read("src/components/ui/fieldset.tsx");
    const footer = fnSrc(src, "FieldsetFooter");
    expect(footer).toMatch(/highlight\s*=\s*false/);
    expect(footer).toContain("bg-[var(--bg,#f5f5f5)]");
  });

  test("FS-4: ErrorText / WarningText use official red-900 / amber-900 tokens", async () => {
    const src = await read("src/components/ui/fieldset.tsx");
    expect(fnSrc(src, "ErrorText")).toContain("text-red-900");
    expect(fnSrc(src, "WarningText")).toContain("text-amber-900");
    // DisabledWall is an absolute inset-0 overlay inside content
    expect(fnSrc(src, "DisabledWall")).toContain("absolute inset-0");
  });

  test("FS-5: disabled only affects content — no whole-fieldset opacity-60, wall inside content", async () => {
    const src = await read("src/components/ui/fieldset.tsx");
    // whole-fieldset dimming must be gone
    expect(src).not.toContain("opacity-60");
    expect(src).not.toMatch(/pointer-events-none select-none/);
    // wall renders inside FieldsetContent (not on the container)
    expect(fnSrc(src, "FieldsetContent")).toContain("fieldset-wall");
    expect(fnSrc(src, "FieldsetContent")).toContain("absolute inset-0");
    // container itself must not carry disabled prop handling
    const fieldset = fnSrc(src, "Fieldset");
    expect(fieldset).not.toMatch(/disabled/);
  });

  test("FS-6: container radius 6px; no border by default; 1px colored border for error/warning", async () => {
    const src = await read("src/components/ui/fieldset.tsx");
    const fieldset = fnSrc(src, "Fieldset");
    expect(fieldset).toContain("rounded-[6px]");
    expect(fieldset).not.toContain("rounded-[8px]");
    // default type: no border class (no unconditional border)
    expect(fieldset).toMatch(/type === "error" && "border border-red-400"/);
    expect(fieldset).toMatch(/type === "warning" && "border border-amber-400"/);
    expect(fieldset).not.toMatch(/border-gray-alpha-400/);
  });

  test("FS-7: footer color tokens match official (default/error/warning)", async () => {
    const src = await read("src/components/ui/fieldset.tsx");
    const footer = fnSrc(src, "FieldsetFooter");
    expect(footer).toContain("border-gray-400 bg-background-200 text-gray-900");
    expect(footer).toContain("border-red-400 bg-red-100 text-red-900");
    expect(footer).toContain("border-amber-400 bg-amber-100 text-amber-900");
    expect(footer).toContain("border-t");
    expect(footer).toContain("min-h-14");
  });

  test("FS-8: footer action buttons use 16px margins instead of gap-2", async () => {
    const src = await read("src/components/ui/fieldset.tsx");
    const actions = fnSrc(src, "FieldsetFooterActions");
    expect(actions).toContain("ml-auto flex items-center justify-end");
    expect(actions).not.toContain("gap-2");
    const action = fnSrc(src, "FieldsetFooterAction");
    expect(action).toMatch(/mx-2 first:ml-0 last:mr-0/);
  });

  test("FieldsetFooter highlight prop survives footer flattening in Fieldset", async () => {
    const src = await read("src/components/ui/fieldset.tsx");
    // 展开 FieldsetFooter 时必须保留其 props（highlight 等）
    expect(fnSrc(src, "Fieldset")).toMatch(/footerRest/);
    expect(fnSrc(src, "Fieldset")).toMatch(/<FieldsetFooter \{[^}]*\.\.\.footerProps\s*\}/);
  });
});

describe("Fieldset runtime rendering", () => {
  test("disabled content renders the wall inside content; footer keeps highlight at full opacity", () => {
    const markup = renderToStaticMarkup(
      <Fieldset>
        <FieldsetContent disabled>
          <FieldsetTitle>Advanced Features</FieldsetTitle>
          <FieldsetSubtitle>Access premium capabilities and tools</FieldsetSubtitle>
        </FieldsetContent>
        <FieldsetFooter highlight>
          <span>Upgrade to a Pro plan to access these features.</span>
        </FieldsetFooter>
      </Fieldset>,
    );

    // wall renders inside the content area
    expect(markup).toContain('data-slot="fieldset-wall"');
    expect(markup).toContain("absolute inset-0 bg-background/60");
    // no whole-fieldset dimming
    expect(markup).not.toContain("opacity-60");
    expect(markup).not.toContain("pointer-events-none");
    // content dims with text-gray-700
    expect(markup).toContain("text-gray-700");
    // footer stays present at full opacity and receives the highlight bg
    expect(markup).toContain('data-slot="fieldset-footer"');
    expect(markup).toContain("bg-[var(--bg,#f5f5f5)]");
    expect(markup).toContain("bg-background-200");
  });

  test("container has no border by default; error type adds 1px red border", () => {
    const plain = renderToStaticMarkup(
      <Fieldset>
        <FieldsetContent>content</FieldsetContent>
      </Fieldset>,
    );
    expect(plain).toContain("rounded-[6px]");
    expect(plain).not.toContain("border-gray-alpha-400");
    expect(plain).not.toContain("border border-red-400");

    const error = renderToStaticMarkup(
      <Fieldset type="error">
        <FieldsetContent>content</FieldsetContent>
      </Fieldset>,
    );
    expect(error).toContain("border border-red-400");
  });

  test("ErrorText / WarningText / DisabledWall render with official tokens", () => {
    const markup = renderToStaticMarkup(
      <>
        <ErrorText>API key validation failed.</ErrorText>
        <WarningText>Changing these settings will require a restart.</WarningText>
        <DisabledWall />
      </>,
    );
    expect(markup).toContain('data-slot="fieldset-error-text"');
    expect(markup).toContain("text-red-900");
    expect(markup).toContain('data-slot="fieldset-warning-text"');
    expect(markup).toContain("text-amber-900");
    expect(markup).toContain('data-slot="fieldset-disabled-wall"');
    expect(markup).toContain("absolute inset-0");
  });
});
