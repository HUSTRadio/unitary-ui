// @vitest-environment node
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { projects, selectProjects } from "../templates/dashboard/src/data";
import { copy as dashboardCopy } from "../templates/dashboard/src/content";
import {
  copy as homepageCopy,
  features,
  plans,
  questions,
  steps,
} from "../templates/homepage/src/content";
import { copy as docsCopy, documents, searchDocuments } from "../templates/docs/src/content";
import { templateApplications } from "../scripts/lib/templates.mjs";

describe("dynamic template consumers", () => {
  it("searches owners and projects, filters status, sorts and clamps pagination without mutating fixtures", () => {
    const original = projects.map((item) => item.id);
    expect(
      selectProjects(projects, "  ATLAS ", "all", "name", 1).items.map((item) => item.id),
    ).toEqual(["atlas"]);
    expect(
      selectProjects(projects, "Alex", "active", "newest", 1).items.map((item) => item.id),
    ).toEqual(["atlas", "delta", "ion"]);
    expect(selectProjects(projects, "", "archived", "name", 9)).toMatchObject({
      total: 2,
      totalPages: 1,
      page: 1,
    });
    expect(selectProjects(projects, "missing", "all", "name", 3)).toMatchObject({
      items: [],
      total: 0,
      totalPages: 1,
      page: 1,
    });
    expect(selectProjects(projects, "", "all", "newest", 3).items.map((item) => item.id)).toEqual([
      "kite",
      "lumen",
    ]);
    expect(projects.map((item) => item.id)).toEqual(original);
  });
  it("searches actual localized document bodies and keeps stable route ordering", () => {
    expect(searchDocuments("weeklyDigest", "en").map((item) => item.id)).toEqual(["configuration"]);
    expect(searchDocuments("负责人", "zh-CN").map((item) => item.id)).toContain("getting-started");
    expect(searchDocuments("no such document", "en")).toEqual([]);
    expect(searchDocuments("", "en")).toEqual(documents);
    expect(new Set(documents.map((item) => item.id)).size).toBe(documents.length);
  });
  it("maintains bilingual copy and meaningful paired Markdown", () => {
    for (const copy of [homepageCopy, dashboardCopy, docsCopy]) {
      expect(Object.keys(copy.en).sort()).toEqual(Object.keys(copy["zh-CN"]).sort());
      expect(
        Object.values(copy)
          .flatMap(Object.values)
          .every((value) => value.trim().length),
      ).toBe(true);
    }
    for (const localized of [
      ...features.flatMap((item) => [item.title, item.description]),
      ...steps,
      ...plans.flatMap((item) => item.features),
      ...questions.flatMap((item) => [item.question, item.answer]),
      ...documents.map((item) => item.title),
    ]) {
      expect(Object.keys(localized).sort()).toEqual(["en", "zh-CN"]);
    }
    for (const document of documents) {
      const headings = (text: string) => [...text.matchAll(/^#{1,3} /gm)].map((item) => item[0]);
      expect(headings(document.content.en)).toEqual(headings(document.content["zh-CN"]));
      expect(document.content.en.trim()).not.toBe("");
      expect(document.content["zh-CN"].trim()).not.toBe("");
    }
  });
  it("uses only public library imports and template-local modules in application code", () => {
    const root = process.cwd();
    const entry = ts.createSourceFile(
      "index.ts",
      readFileSync("src/lib/index.ts", "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    const exports = new Set(
      entry.statements.flatMap((statement) =>
        ts.isExportDeclaration(statement) &&
        statement.exportClause &&
        ts.isNamedExports(statement.exportClause)
          ? statement.exportClause.elements.map((item) => item.name.text)
          : [],
      ),
    );
    const filesIn = (directory: string): string[] =>
      readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? filesIn(path.join(directory, entry.name))
          : /\.tsx?$/.test(entry.name)
            ? [path.join(directory, entry.name)]
            : [],
      );
    for (const app of templateApplications(root)) {
      expect(app.manifest.private).toBe(true);
      for (const file of filesIn(path.join(app.directory, "src"))) {
        const source = ts.createSourceFile(
          file,
          readFileSync(file, "utf8"),
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.TSX,
        );
        for (const node of source.statements) {
          if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) continue;
          const name = node.moduleSpecifier.text;
          expect(name.startsWith("@/"), `${file}: ${name}`).toBe(false);
          if (name.startsWith("."))
            expect(
              path.resolve(path.dirname(file), name).startsWith(app.directory + path.sep),
            ).toBe(true);
          if (name.startsWith("@hustradio/unitary-ui/"))
            expect([
              "@hustradio/unitary-ui/styles.css",
              "@hustradio/unitary-ui/tailwind-reference.css",
            ]).toContain(name);
          if (name === "@hustradio/unitary-ui") {
            const bindings = node.importClause?.namedBindings;
            if (bindings && ts.isNamedImports(bindings))
              for (const item of bindings.elements)
                expect(exports.has((item.propertyName ?? item.name).text)).toBe(true);
          }
        }
      }
    }
  });
});
