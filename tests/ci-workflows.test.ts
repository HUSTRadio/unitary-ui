// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseDocument } from "yaml";

type Step = {
  id?: string;
  uses?: string;
  run?: string;
  if?: string;
  with?: Record<string, unknown>;
  env?: Record<string, string>;
  "continue-on-error"?: boolean;
};
type Job = {
  "runs-on": string;
  "timeout-minutes": number;
  strategy?: { "fail-fast": boolean; matrix: { shard: number[] } };
  needs?: unknown;
  permissions?: Record<string, string>;
  "continue-on-error"?: boolean;
  steps: Step[];
};
type Workflow = {
  on: Record<string, unknown>;
  permissions: Record<string, string>;
  concurrency: { group: string; "cancel-in-progress": boolean };
  jobs: Record<string, Job>;
};

function workflow(name: string): Workflow {
  const document = parseDocument(readFileSync(`.github/workflows/${name}.yml`, "utf8"));
  expect(document.errors, `${name} must be valid YAML without duplicate keys`).toEqual([]);
  return document.toJS() as Workflow;
}

function action(job: Job, name: string): Step {
  const matches = job.steps.filter((step) => step.uses?.startsWith(`${name}@`));
  expect(matches, `${name} must run once`).toHaveLength(1);
  return matches[0];
}

function runIndex(job: Job, command: string): number {
  const index = job.steps.findIndex((step) => step.run?.trim() === command);
  expect(index, `missing command: ${command}`).toBeGreaterThanOrEqual(0);
  return index;
}

const browserInstall = "pnpm exec playwright install --with-deps chromium";
const ciJobs = [
  { id: "checks", runner: "ubuntu-24.04", timeout: 20, commands: ["lint", "typecheck", "typecheck:tests", "test"] },
  { id: "build-package", runner: "windows-2025", timeout: 90, commands: ["build", "test:package"] },
  { id: "docs", runner: "ubuntu-24.04", timeout: 30, commands: ["build:docs", "docs:llm:check"] },
];

describe("GitHub Actions CI contracts", () => {
  it("checks master pushes, pull requests and manual runs with read-only permissions", () => {
    const ci = workflow("ci");
    expect(ci.on.push).toEqual({ branches: ["master"] });
    expect(ci.on).toHaveProperty("pull_request");
    expect(ci.on).toHaveProperty("workflow_dispatch");
    expect(ci.on).not.toHaveProperty("pull_request_target");
    expect(ci.permissions).toEqual({ contents: "read" });
    expect(ci.concurrency["cancel-in-progress"]).toBe(true);
    expect(ci.concurrency.group).toContain("github.event.pull_request.number");
    expect(ci.concurrency.group).toContain("github.ref");
  });

  it("keeps the complete primary checks in three independent jobs", () => {
    const ci = workflow("ci");
    expect(Object.keys(ci.jobs).sort()).toEqual(ciJobs.map(({ id }) => id).sort());
    for (const { id, runner, timeout, commands } of ciJobs) {
      const job = ci.jobs[id];
      expect(job["runs-on"]).toBe(runner);
      expect(job["timeout-minutes"]).toBe(timeout);
      expect(job.needs).toBeUndefined();
      const indices = commands.map((command) => runIndex(job, `pnpm run ${command}`));
      expect(indices).toEqual([...indices].sort((a, b) => a - b));
      expect(runIndex(job, "pnpm install --frozen-lockfile")).toBeLessThan(indices[0]);
    }
    expect(action(ci.jobs.checks, "actions/checkout").with?.["fetch-depth"]).toBe(0);
  });

  it("installs the pinned Python image dependency before the complete unit suite", () => {
    const job = workflow("ci").jobs.checks;
    const python = action(job, "actions/setup-python");
    expect(python.with?.["python-version"]).toBe("3.12");
    expect(python.with?.cache).toBe("pip");
    expect(python.with?.["cache-dependency-path"]).toBe("tests/audit/requirements.txt");
    expect(readFileSync("tests/audit/requirements.txt", "utf8").trim()).toBe("Pillow==12.3.0");
    const install = runIndex(
      job,
      "python -m pip install --requirement tests/audit/requirements.txt",
    );
    expect(job.steps.indexOf(python)).toBeLessThan(install);
    expect(install).toBeLessThan(runIndex(job, "pnpm run test"));
  });

  it("installs Chromium before browser-backed package and documentation checks", () => {
    const ci = workflow("ci");
    for (const [id, command] of [
      ["build-package", "test:package"],
      ["docs", "docs:llm:check"],
    ]) {
      const job = ci.jobs[id];
      expect(runIndex(job, "pnpm install --frozen-lockfile")).toBeLessThan(
        runIndex(job, browserInstall),
      );
      expect(runIndex(job, browserInstall)).toBeLessThan(runIndex(job, `pnpm run ${command}`));
    }
  });

  it("runs full browser coverage and the Windows screenshot check nightly and manually", () => {
    const nightly = workflow("e2e-nightly");
    expect(nightly.on.schedule).toEqual([{ cron: "0 18 * * *" }]);
    expect(nightly.on).toHaveProperty("workflow_dispatch");
    expect(nightly.permissions).toEqual({ contents: "read" });
    expect(Object.keys(nightly.jobs).sort()).toEqual(["e2e", "readme-screenshots"]);
    for (const [id, runner] of [
      ["e2e", "windows-2025"],
      ["readme-screenshots", "windows-2025"],
    ]) {
      const job = nightly.jobs[id];
      expect(job["runs-on"]).toBe(runner);
      expect(job["timeout-minutes"]).toBe(60);
      expect(job.needs).toBeUndefined();
      expect(runIndex(job, "pnpm install --frozen-lockfile")).toBeLessThan(
        runIndex(job, browserInstall),
      );
    }
    const e2e = nightly.jobs.e2e;
    expect(e2e.strategy).toEqual({ "fail-fast": false, matrix: { shard: [1, 2, 3, 4] } });
    const run = runIndex(e2e, "pnpm run test:docs-layout -- --shard=${{ matrix.shard }}/4 --reporter=list,json");
    expect(runIndex(e2e, browserInstall)).toBeLessThan(run);
    expect(e2e.steps[run].env?.PLAYWRIGHT_JSON_OUTPUT_FILE).toBe(
      ".scratch/playwright-report/results.json",
    );
    const uploads = e2e.steps.filter(step => step.uses?.startsWith("actions/upload-artifact@"));
    expect(uploads.map(step => step.with?.name)).toEqual([
      "playwright-report-${{ matrix.shard }}",
      "playwright-results-${{ matrix.shard }}",
    ]);
    const screenshots = nightly.jobs["readme-screenshots"];
    const check = screenshots.steps.findIndex((step) =>
      /^pnpm run docs:readme:screenshots:check(?:\s|$)/.test(step.run ?? ""),
    );
    expect(check).toBeGreaterThan(runIndex(screenshots, browserInstall));
    expect(screenshots.steps[check].run).not.toContain("--update-on-drift");
  });

  it("pins actions and shares secure, reproducible toolchain setup across every job", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    expect(packageJson.devEngines.packageManager).toMatchObject({
      name: "pnpm",
      version: "11.20.0",
    });
    for (const config of [workflow("ci"), workflow("e2e-nightly")]) {
      for (const job of Object.values(config.jobs)) {
        expect(job.permissions ?? config.permissions).toEqual({ contents: "read" });
        expect(job["continue-on-error"] ?? false).toBe(false);
        for (const step of job.steps) expect(step["continue-on-error"] ?? false).toBe(false);
        for (const step of job.steps.filter(({ uses }) => uses)) {
          expect(step.uses).toMatch(/^[^@\s]+@[a-f0-9]{40}$/);
        }
        const checkout = action(job, "actions/checkout");
        expect(checkout.with?.["persist-credentials"]).toBe(false);
        const pnpm = action(job, "pnpm/action-setup");
        expect(pnpm.with?.version).toBeUndefined();
        const node = action(job, "actions/setup-node");
        expect(String(node.with?.["node-version"])).toBe("24");
        expect(node.with?.cache).toBe("pnpm");
        expect(node.with?.["cache-dependency-path"]).toBe("pnpm-lock.yaml");
        const install = runIndex(job, "pnpm install --frozen-lockfile");
        expect(job.steps.indexOf(checkout)).toBeLessThan(job.steps.indexOf(pnpm));
        expect(job.steps.indexOf(pnpm)).toBeLessThan(job.steps.indexOf(node));
        expect(job.steps.indexOf(node)).toBeLessThan(install);
      }
    }
  });

  it("retains nightly reports and failure evidence from specific scratch directories", () => {
    const nightly = workflow("e2e-nightly");
    for (const [id, directories] of [
      ["e2e", ["playwright-report", "playwright-results"]],
      ["readme-screenshots", ["readme-screenshots"]],
    ] as const) {
      const job = nightly.jobs[id];
      const uploads = job.steps.filter((step) => step.uses?.startsWith("actions/upload-artifact@"));
      expect(uploads.length).toBeGreaterThan(0);
      const audit = job.steps.findIndex((step) => step.id === "audit");
      expect(audit).toBeGreaterThan(runIndex(job, browserInstall));
      const paths: string[] = [];
      for (const step of uploads) {
        expect(step.if).toMatch(/(?:failure\(\)|!cancelled\(\))/);
        expect(step.with?.["retention-days"]).toBe(7);
        expect(step.with?.["include-hidden-files"]).toBe(true);
        expect(["warn", "error"]).toContain(step.with?.["if-no-files-found"]);
        const artifactPaths = String(step.with?.path).trim().split(/\s+/);
        for (const file of artifactPaths) {
          expect(file).toMatch(/^\.scratch\/[a-z-]+(?:\/[a-zA-Z0-9_.-]+)*$/);
          expect(file.split("/")).not.toContain("..");
          expect(
            directories.some(
              (directory) =>
                file === `.scratch/${directory}` || file.startsWith(`.scratch/${directory}/`),
            ),
          ).toBe(true);
        }
        paths.push(...artifactPaths);
        expect(job.steps.indexOf(step)).toBeGreaterThan(audit);
      }
      for (const directory of directories) {
        expect(paths.some((file) => file.startsWith(`.scratch/${directory}`))).toBe(true);
      }
      const report = uploads.find((step) => step.if?.includes("!cancelled()"));
      expect(report?.if).toContain("steps.audit.outcome");
      expect(report?.if).toContain("'skipped'");
      expect(uploads.some((step) => step.if?.includes("failure()"))).toBe(true);
    }
  });
});
