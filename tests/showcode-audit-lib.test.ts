import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ts from "typescript";
import { describe, expect, test } from "vitest";

import * as showCodeAudit from "./audit/showcode-audit-lib";

type FixtureHelpers = {
  buildTypecheckFixtureSource: (slug: string, id: string, code: string) => string;
};

const { buildTypecheckFixtureSource } = showCodeAudit as typeof showCodeAudit & FixtureHelpers;

describe("show code audit helpers", () => {
  test("extracts only direct literal DEMO_CODE references rendered by Show Code", () => {
    const pageSource = `
      <ShowCodeFooter code={DEMO_CODE["bottom-sheet"]?.default ?? ""} />
      <ShowCodeFooter code={DEMO_CODE['error-boundary']?.['default'] ?? ''} />
      <ShowCode code={DEMO_CODE?.button?.sizes ?? ""} />
      <ShowCodeFooter code={DEMO_CODE.button?.sizes ?? ""} />
      const cached = DEMO_CODE.modal?.controlled;
      // <ShowCodeFooter code={DEMO_CODE.input?.default} />
      <div data-code={DEMO_CODE.select?.default} />
    `;

    expect(showCodeAudit.extractReferences(pageSource)).toEqual([
      { slug: "bottom-sheet", id: "default" },
      { slug: "error-boundary", id: "default" },
      { slug: "button", id: "sizes" },
    ]);
  });

  test("normalizes trailing multiple JSX roots without moving imports or declarations", () => {
    const code = `import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} />`;

    const fixture = buildTypecheckFixtureSource("modal", "controlled", code);
    const source = ts.createSourceFile("fixture.tsx", fixture, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const diagnostics = (source as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics ?? [];

    expect(diagnostics).toEqual([]);
    expect(fixture).toContain("// show code fixture: modal/controlled");
    expect(fixture).toContain('import { Button } from "@/components/ui/button";');
    expect(fixture).toContain("const [open, setOpen] = useState(false);");
    expect(fixture).toMatch(/<>[\s\S]*<Button[\s\S]*<Modal[\s\S]*<\/>;/);
  });

  test("fails closed when TS2657 is not a trailing JSX expression", () => {
    const code = `<div />
<span />
const afterJsx = true;`;

    expect(() => buildTypecheckFixtureSource("example", "invalid", code)).toThrow(/example\/invalid/);
  });

  test("writes distinct fixtures for ids that differ only by case", async () => {
    const outDir = await mkdtemp(path.join(tmpdir(), "showcode-audit-case-"));

    try {
      const result = await showCodeAudit.writeTypecheckFixtures(
        "D:/repo",
        { checkbox: { indeterminate: "<div />", Indeterminate: "<span />" } },
        outDir,
      );
      const fixtureFiles = (await readdir(outDir)).filter((file) => file.endsWith(".tsx"));
      const fixtureSources = await Promise.all(
        fixtureFiles.map((file) => readFile(path.join(outDir, file), "utf8")),
      );

      expect(result.fileCount).toBe(2);
      expect(fixtureFiles).toHaveLength(2);
      expect(fixtureSources.some((source) => source.includes("checkbox/indeterminate"))).toBe(true);
      expect(fixtureSources.some((source) => source.includes("checkbox/Indeterminate"))).toBe(true);
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });

  test("cleans stale fixtures before writing the current set", async () => {
    const outDir = await mkdtemp(path.join(tmpdir(), "showcode-audit-"));
    const stalePath = path.join(outDir, "stale.tsx");
    await writeFile(stalePath, "export {};\n");

    try {
      const result = await showCodeAudit.writeTypecheckFixtures(
        "D:/repo",
        { button: { default: "<div />" } },
        outDir,
      );

      expect(result.fileCount).toBe(1);
      await expect(readFile(stalePath, "utf8")).rejects.toThrow();
      const tsconfig = JSON.parse(await readFile(path.join(outDir, "tsconfig.json"), "utf8")) as {
        compilerOptions: {
          allowArbitraryExtensions?: boolean;
          ignoreDeprecations?: string;
          types?: string[];
        };
        include: string[];
      };
      expect(tsconfig.compilerOptions).toMatchObject({
        allowArbitraryExtensions: true,
        ignoreDeprecations: "6.0",
      });
      expect(tsconfig.compilerOptions.types).toContain("vite/client");
      expect(tsconfig.include).toContain(path.join("D:/repo", "src/types/**/*.d.ts"));
      const expectedFixture = `${Buffer.from("button", "utf8").toString("hex")}__${Buffer.from("default", "utf8").toString("hex")}.tsx`;
      expect((await readdir(outDir)).sort()).toEqual([expectedFixture, "tsconfig.json"].sort());
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });
});
