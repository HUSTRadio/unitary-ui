import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("Playwright discovery", () => {
  test("motion projects discover all common cases and isolate CDP cases", () => {
    const root = process.cwd();
    const output = execFileSync(process.execPath, [path.join(root, "node_modules/@playwright/test/cli.js"), "test", "--config", "playwright.motion.config.ts", "--list", "--reporter=json"], {
      encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "", PLAYWRIGHT_JSON_OUTPUT_FILE: "" },
    });
    const report = JSON.parse(output);
    expect(report.errors).toEqual([]);
    expect(report.config.projects.map((project: { name: string }) => project.name)).toEqual(["chromium", "firefox", "webkit"]);
    const found: Record<string, Set<string>> = {};
    const visit = (suite: { specs?: Array<{ file: string; tests: Array<{ projectName: string }> }>; suites?: typeof suite[] }) => {
      for (const spec of suite.specs ?? []) for (const test of spec.tests) (found[test.projectName] ??= new Set()).add(path.basename(spec.file));
      suite.suites?.forEach(visit);
    };
    report.suites.forEach(visit);
    expect([...found.chromium].sort()).toEqual(["carousel-variants.spec.ts", "fade-motion.spec.ts", "motion-chromium.spec.ts"]);
    for (const name of ["firefox", "webkit"]) expect([...found[name]].sort()).toEqual(["carousel-variants.spec.ts", "fade-motion.spec.ts"]);
    const original = JSON.parse(execFileSync(process.execPath, [path.join(root, "node_modules/@playwright/test/cli.js"), "test", "--list", "--reporter=json", "fade-motion.spec.ts", "carousel-variants.spec.ts", "motion-chromium.spec.ts"], {
      encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "", PLAYWRIGHT_JSON_OUTPUT_FILE: "" },
    }));
    expect(original.errors).toEqual([]);
    expect(original.config.projects).toHaveLength(1);
    expect(original.suites.map((suite: { title: string }) => suite.title).sort()).toEqual(["carousel-variants.spec.ts", "fade-motion.spec.ts", "motion-chromium.spec.ts"]);
  }, 30_000);

  test("excludes scratch probes while retaining ordinary regression specs", () => {
    const root = process.cwd();
    mkdirSync(path.join(root, ".scratch"), { recursive: true });
    const directory = mkdtempSync(path.join(root, ".scratch/discovery-"));
    try {
      const files = ["real.spec.ts", "_tmp-probe.spec.ts", "probe.tmp.spec.ts", "probe.tmp.extra.spec.ts", ".hidden.spec.ts"];
      for (const file of files) writeFileSync(path.join(directory, file), 'import { test } from "@playwright/test"; test("fixture", () => {});');
      writeFileSync(path.join(directory, "playwright.config.ts"), 'import config from "../../playwright.config"; export default { ...config, testDir: ".", webServer: undefined };');
      const output = execFileSync(process.execPath, [path.join(root, "node_modules/@playwright/test/cli.js"), "test", "--config", path.join(directory, "playwright.config.ts"), "--list", "--reporter=json"], { encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "" } });
      const report = JSON.parse(output);
      expect(report.errors).toEqual([]);
      expect(report.suites.map((suite: { title: string }) => suite.title)).toEqual(["real.spec.ts"]);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
