// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { verifyWorkspace } from "../scripts/lib/verification.mjs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });

describe("devShell CLI contracts", () => {
  it("routes every non-watch devShell check through the locked script registry", () => {
    for (const name of [
      "build:dev-shell",
      "typecheck:dev-shell",
      "test:dev-shell",
      "test:dev-shell:e2e",
      "verify:dev-shell",
    ]) {
      expect(packageJson.scripts[name]).toBe(`node scripts/run-locked-script.mjs ${name}`);
    }
  });

  it("keeps development startup scoped to the devShell packages", () => {
    expect(packageJson.scripts["dev:dev-shell"]).toBe(
      'concurrently -k -n web,server "pnpm --filter @hustradio/dev-shell dev" "pnpm --filter @hustradio/dev-shell-server dev"',
    );
    expect(packageJson.scripts["start:dev-shell"]).toBe(
      "pnpm --filter @hustradio/dev-shell-server start",
    );
    expect(packageJson.devDependencies.concurrently).toBeTypeOf("string");
  });

  it.each(["complete", "absent", "partial", "skipped"])("requires fresh native devShell browser evidence: %s", async scenario => {
    const root = mkdtempSync(path.join(os.tmpdir(), "dev-shell-browser-evidence-"));
    roots.push(root);
    const file = "packages/dev-shell/tests/e2e/workbench.spec.ts";
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), "export {};");
    const result = await verifyWorkspace(root, { full: false }, {
      context: { head: "head", comparison: "head", paths: [file], changes: [{ status: "M", file }] },
      files: [file],
      discover: async () => ({ available: [], selected: [], missing: [], routes: [], uncovered: [] }),
      fingerprint: () => "same",
      log: () => {},
      run: async (_root: string, command: string[], _args: string[], environment: Record<string, string>) => {
        if (command.includes("playwright") && scenario !== "absent") {
          expect(command).toEqual(expect.arrayContaining(["--max-failures=1", "--reporter=list,json"]));
          writeFileSync(environment.PLAYWRIGHT_JSON_OUTPUT_FILE, JSON.stringify({
            config: { rootDir: path.join(root, "packages/dev-shell/tests/e2e") },
            suites: [{ specs: [{
              file: scenario === "partial" ? "unrelated.spec.ts" : "workbench.spec.ts",
              title: "real frame coverage",
              tests: [{ expectedStatus: "passed", status: scenario === "skipped" ? "skipped" : "expected", results: scenario === "skipped" ? [] : [{ status: "passed" }] }],
            }] }],
            errors: [], stats: { expected: scenario === "skipped" ? 0 : 1, skipped: scenario === "skipped" ? 1 : 0, unexpected: 0, flaky: 0 },
          }));
        }
        return 0;
      },
    });
    expect(result.code).toBe(scenario === "complete" ? 0 : 1);
    const browser = result.report?.steps.find((step: { checks: string[] }) => step.checks.includes("test:dev-shell:e2e"));
    expect(browser?.environment.PLAYWRIGHT_JSON_OUTPUT_FILE).toBe(path.join(path.dirname(result.reportPath!), "dev-shell-browser.json"));
    expect(result.plan.devShellBrowserSpecs).toEqual([file]);
    expect(result.plan.broadChecks).toEqual([]);
  });
});
