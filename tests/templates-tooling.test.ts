// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runTemplateChecks, templateApplications } from "../scripts/lib/templates.mjs";
import { createDocsConsumerLock } from "../scripts/lib/docs-package-consumer.mjs";
import { classifyVerification } from "../scripts/lib/verification-policy.mjs";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
describe("template verification", () => {
  it("discovers actual dynamic consumers and stops after the first failed check", async () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "unitary-template-tooling-"));
    roots.push(root);
    for (const id of ["a", "b"]) {
      const directory = path.join(root, "templates", id);
      mkdirSync(directory, { recursive: true });
      writeFileSync(
        path.join(directory, "package.json"),
        JSON.stringify({
          name: id,
          private: true,
          dependencies: { "@hustradio/unitary-ui": "workspace:*" },
        }),
      );
    }
    expect(templateApplications(root).map((app) => app.id)).toEqual(["a", "b"]);
    const run = vi.fn(async () => 7);
    expect(await runTemplateChecks(root, "build", run)).toBe(7);
    expect(run).toHaveBeenCalledTimes(1);
    const invalid = path.join(root, "templates/a/package.json");
    writeFileSync(
      invalid,
      JSON.stringify({ private: true, dependencies: { "@hustradio/unitary-ui": "^0.1" } }),
    );
    expect(() => templateApplications(root)).toThrow(/dynamic consumer/);
  });
  it("selects templates for template and library changes", () => {
    for (const file of [
      "templates/docs/src/content/en/faq.md",
      "src/components/ui/button.tsx",
      "src/styles/index.css",
      "src/lib/index.ts",
      "pnpm-lock.yaml",
      "playwright.templates.config.ts",
    ]) {
      const context = { paths: [file], changes: [{ file, status: "M" }] };
      expect(classifyVerification(context).scope.templates, file).toBe(true);
    }
  });
  it("creates independent frozen consumers from each template's actual importer", () => {
    const root = process.cwd();
    const library = JSON.parse(readFileSync("package.json", "utf8"));
    const text = readFileSync("pnpm-lock.yaml", "utf8");
    for (const app of templateApplications(root)) {
      const consumer = createDocsConsumerLock(
        text,
        app.manifest,
        library,
        "sha512-test",
        "tarball",
        { name: app.manifest.name, importer: `templates/${app.id}` },
      );
      expect(Object.keys(consumer.lock.importers)).toEqual(["."]);
      expect(consumer.manifest.dependencies["@hustradio/unitary-ui"]).toBe("file:unitary-ui.tgz");
      expect(consumer.manifest.name).toBe(app.manifest.name);
      expect(consumer.text).not.toContain("workspace:");
      expect(consumer.text).not.toContain("link:");
    }
  });
});
