import { mkdtempSync, readFileSync, rmSync, mkdirSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseDocument } from "yaml";
import { motionBrowserEvidence, runMotionBrowsers } from "../scripts/lib/motion-browsers.mjs";
import { LOCKED_PACKAGE_SCRIPTS } from "../scripts/lib/locked-package-scripts.mjs";
import config from "../playwright.motion.config";

const names = ["chromium", "firefox", "webkit"];
function report(executed = true) {
  return {
    config: { projects: names.map(name => ({ name })) }, errors: [],
    suites: [{ specs: [0, 1].map(id => ({ id: String(id), tests: names.map(projectName => ({
      projectName, expectedStatus: "passed", status: "expected",
      results: executed ? [{ status: "passed", retry: 0 }] : [],
    })) })) }],
    stats: { expected: 6, skipped: 0, unexpected: 0, flaky: 0 },
  };
}

describe("motion browser evidence", () => {
  it("requires complete first-attempt evidence from all three engines", () => {
    expect(motionBrowserEvidence(report(false), report())).toEqual({ passed: true,
      projects: { chromium: 2, firefox: 2, webkit: 2 }, errors: [] });
  });
  it.each(["skipped", "interrupted", "failed"])("rejects %s and unexecuted cases", status => {
    const actual = report();
    actual.suites[0].specs[0].tests[0].results[0].status = status;
    expect(motionBrowserEvidence(report(false), actual).passed).toBe(false);
    actual.suites[0].specs[0].tests[0].results = [];
    expect(motionBrowserEvidence(report(false), actual).passed).toBe(false);
  });
  it("rejects retries, flaky passes and expected failures", () => {
    const actual = report();
    actual.suites[0].specs[0].tests[0].results[0].retry = 1;
    expect(motionBrowserEvidence(report(false), actual).passed).toBe(false);
    actual.suites[0].specs[0].tests[0].results[0].retry = 0;
    actual.suites[0].specs[0].tests[0].expectedStatus = "failed";
    expect(motionBrowserEvidence(report(false), actual).passed).toBe(false);
    actual.stats.flaky = 1;
    expect(motionBrowserEvidence(report(false), actual).passed).toBe(false);
  });
  it("rejects missing projects, missing cases, duplicates and report errors", () => {
    const actual = report();
    actual.suites[0].specs[0].tests.pop();
    expect(motionBrowserEvidence(report(false), actual).passed).toBe(false);
    actual.suites[0].specs[1].tests.pop();
    expect(() => motionBrowserEvidence(report(false), actual)).toThrow(/missing a browser/);
    expect(() => motionBrowserEvidence(report(false), {})).toThrow(/Invalid/);
    const duplicate = report(); duplicate.suites[0].specs.push(duplicate.suites[0].specs[0]);
    expect(() => motionBrowserEvidence(report(false), duplicate)).toThrow(/Duplicate/);
    const errored = { ...report(), errors: [{ message: "browser crashed" }] };
    expect(motionBrowserEvidence(report(false), errored).passed).toBe(false);
  });
});

describe("motion check runner", () => {
  const directories: string[] = [];
  afterEach(() => directories.splice(0).forEach(directory => rmSync(directory, { recursive: true, force: true })));
  function root() {
    mkdirSync(".scratch/motion-browsers", { recursive: true });
    const directory = mkdtempSync(path.resolve(".scratch/motion-browsers/runner-test-"));
    directories.push(directory); return directory;
  }
  it.each([0, 1, 2, 3])("stops after failing step %i and propagates its exit", async failed => {
    const run = vi.fn().mockResolvedValue(0);
    run.mockImplementation(async () => run.mock.calls.length - 1 === failed ? 7 : 0);
    expect(await runMotionBrowsers(root(), { run, snapshot: () => "test-manifest", read: () => report() })).toBe(7);
    expect(run).toHaveBeenCalledTimes(failed + 1);
  });
  it("uses one build for discovery and execution, with explicit fixture environment", async () => {
    const run = vi.fn().mockResolvedValue(0);
    expect(await runMotionBrowsers(root(), { run, snapshot: () => "test-manifest", read: () => report() })).toBe(0);
    expect(run.mock.calls[0][1]).toContain("tsconfig.motion-tests.json");
    expect(run.mock.calls[1][3]).toEqual({ UNITARY_DOCS_TEST_FIXTURES: "1" });
    expect(run.mock.calls[2][3].UNITARY_DOCS_ARTIFACT).toBe(run.mock.calls[3][3].UNITARY_DOCS_ARTIFACT);
    expect(run.mock.calls[2][1]).toContain("--list");
    expect(run.mock.calls[3][1]).not.toContain("--list");
    expect(LOCKED_PACKAGE_SCRIPTS["test:motion"]).toEqual({ resource: "workspace-checks", steps: [["node", "scripts/test-motion-browsers.mjs"]] });
  });
  it("fails when evidence is missing or unstable despite a zero process exit", async () => {
    const run = vi.fn().mockResolvedValue(0);
    expect(await runMotionBrowsers(root(), { run, snapshot: () => "test-manifest", read: () => { throw Error("missing report"); } })).toBe(1);
    const actual = report(); actual.stats.flaky = 1;
    expect(await runMotionBrowsers(root(), { run, snapshot: () => "test-manifest", read: () => actual })).toBe(1);
  });
});

describe("motion automation boundaries", () => {
  it("keeps Chromium-specific options out of Firefox and WebKit", () => {
    expect(config.projects?.map(project => [project.name, project.use?.browserName])).toEqual(names.map(name => [name, name]));
    expect(config.use?.channel).toBeUndefined();
    expect(config.use?.contextOptions?.permissions).toEqual([]);
    expect(config.projects?.[0].use?.channel).toBe("chromium");
    expect(config.projects?.slice(1).every(project => project.use?.channel === undefined)).toBe(true);
  });
  it("runs only nightly and manually, installs every engine and retains evidence", () => {
    const document = parseDocument(readFileSync(".github/workflows/motion-browsers.yml", "utf8"));
    expect(document.errors).toEqual([]);
    const workflow = document.toJS();
    expect(Object.keys(workflow.on).sort()).toEqual(["schedule", "workflow_dispatch"]);
    expect(workflow.on.schedule).toEqual([{ cron: "0 18 * * *" }]);
    expect(workflow.permissions).toEqual({ contents: "read" });
    const job = workflow.jobs.motion;
    expect(job["runs-on"]).toBe("windows-2025");
    expect(job["timeout-minutes"]).toBe(30);
    const steps = job.steps as Array<{ run?: string; uses?: string; with?: Record<string, unknown>; if?: string; "continue-on-error"?: boolean }>;
    const install = steps.findIndex(step => step.run === "pnpm exec playwright install --with-deps chromium firefox webkit");
    const audit = steps.findIndex(step => step.run === "pnpm run test:motion");
    expect(install).toBeGreaterThan(-1); expect(audit).toBeGreaterThan(install);
    expect(job["continue-on-error"]).toBeUndefined();
    for (const step of steps) {
      expect(step["continue-on-error"]).toBeUndefined();
      if (step.uses) expect(step.uses).toMatch(/@[a-f0-9]{40}$/);
    }
    const upload = steps.find(step => step.uses?.startsWith("actions/upload-artifact@"))!;
    expect(upload.if).toContain("!cancelled()");
    expect(upload.with?.["include-hidden-files"]).toBe(true);
    expect(upload.with?.["if-no-files-found"]).toBe("error");
  });
});
