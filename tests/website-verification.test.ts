// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";
import { classifyVerification, isBrowserSpec, isUnitTest, isWebsiteBrowserSpec } from "../scripts/lib/verification-policy.mjs";
import { createVerificationPlan, verifyWorkspace } from "../scripts/lib/verification.mjs";

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function fixture(spec = "website/tests/e2e/homepage.spec.ts") {
  const root = mkdtempSync(path.join(os.tmpdir(), "unitary-website-verify-"));
  roots.push(root);
  const files = ["website/src/App.tsx", "tests/known.test.ts", spec];
  for (const file of files) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), "export {};\n");
  }
  const changed = "website/src/App.tsx";
  const services = {
    context: { head: "head", comparison: "head", paths: [changed], changes: [{ status: "M", file: changed }] },
    files, fingerprint: () => "same", log: vi.fn(),
    discover: async () => ({ available: [files[1]], selected: [files[1]], missing: [], routes: [], uncovered: [] }),
  };
  return { root, files, services };
}
describe("website verification", () => {
  it("selects website coverage separately from docs and unit discovery", async () => {
    const { root, services } = fixture();
    const plan = await createVerificationPlan(root, { full: false }, services);
    expect(plan.checks.map(check => check.name)).toContain("build:website");
    expect(plan.checks.map(check => check.name)).toContain("test:website");
    expect(plan.checks.map(check => check.name)).not.toContain("test:docs-layout");
    expect(plan.websiteBrowserSpecs).toEqual(["website/tests/e2e/homepage.spec.ts"]);
    expect(plan.browserSpecs).toEqual([]);
    expect(isUnitTest(plan.websiteBrowserSpecs[0])).toBe(false);
    expect(isBrowserSpec(plan.websiteBrowserSpecs[0])).toBe(false);
    expect(isWebsiteBrowserSpec(plan.websiteBrowserSpecs[0])).toBe(true);
    expect(classifyVerification(services.context).scope.website).toBe(true);
    expect(classifyVerification({ changes: [{ status: "M", file: "docs/site/src/content/getting-started.ts" }] }).scope.website).toBe(true);
  });
  it.each(["complete", "missing-report", "undiscovered", "not-run"])("requires fresh browser evidence: %s", async scenario => {
    const { root, services } = fixture();
    const run = async (_root: string, command: string[], _args: string[], environment: Record<string, string>) => {
      if (command.includes("playwright") && scenario !== "missing-report") {
        writeFileSync(environment.PLAYWRIGHT_JSON_OUTPUT_FILE, JSON.stringify({
          config: { rootDir: path.join(root, "website/tests/e2e") },
          suites: [{ specs: [{ file: scenario === "undiscovered" ? "other.spec.ts" : "homepage.spec.ts", title: "website", tests: [{ expectedStatus: "passed", status: scenario === "not-run" ? "skipped" : "expected", results: scenario === "not-run" ? [] : [{ status: "passed" }] }] }] }],
          errors: [], stats: { expected: scenario === "not-run" ? 0 : 1, skipped: scenario === "not-run" ? 1 : 0, unexpected: 0, flaky: 0 },
        }));
      }
      return 0;
    };
    const result = await verifyWorkspace(root, { full: false }, { ...services, run });
    expect(result.code).toBe(scenario === "complete" ? 0 : 1);
    const browser = result.report?.steps.find((step: { checks: string[] }) => step.checks.includes("test:website"));
    expect(browser?.browserReportPath).toBe(path.join(path.dirname(result.reportPath!), "website-browser.json"));
  });
  it("rejects hidden specs and fails when the suite is missing", async () => {
    const hidden = fixture("website/tests/e2e/.homepage.spec.ts");
    hidden.services.context.paths = [hidden.files[2]];
    hidden.services.context.changes = [{ status: "M", file: hidden.files[2] }];
    await expect(createVerificationPlan(hidden.root, { full: false }, hidden.services)).rejects.toThrow("excluded");
    const empty = fixture();
    empty.services.files = empty.files.slice(0, 2);
    const result = await verifyWorkspace(empty.root, { full: false }, { ...empty.services, run: async () => 0 });
    expect(result.code).toBe(1);
    expect(result.report?.steps.find((step: { checks: string[] }) => step.checks.includes("test:website"))?.browserEvidenceError).toBe("No website browser specs discovered");
  });
});
