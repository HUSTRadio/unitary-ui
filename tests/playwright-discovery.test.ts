import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("Playwright discovery", () => {
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
