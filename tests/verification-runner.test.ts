// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyWorkspace } from "../scripts/lib/verification.mjs";
import { runPackageStep } from "../scripts/lib/package-command.mjs";

const roots: string[] = [];
function fixture() {
  const root = mkdtempSync(path.join(os.tmpdir(), "unitary-verify-runner-"));
  roots.push(root);
  mkdirSync(path.join(root, "tests"));
  writeFileSync(path.join(root, "tests/one.test.ts"), "export {};");
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function services(paths = ["tests/one.test.ts"]) {
  return {
    context: {
      head: "head",
      comparison: "head",
      paths,
      changes: paths.map((file) => ({ status: "M", file })),
    },
    files: ["tests/one.test.ts"],
    discover: async () => ({
      available: ["tests/one.test.ts"],
      selected: ["tests/one.test.ts"],
      missing: [],
      routes: [],
      uncovered: [],
    }),
    fingerprint: () => "same",
    log: vi.fn(),
    run: vi.fn(
      async (_root: string, _command: string[], _args: string[], _environment: object) => 0,
    ),
  };
}
function lockPath(root: string) {
  return path.join(
    os.tmpdir(),
    "unitary-ui-package-locks",
    createHash("sha256").update(root).digest("hex"),
    "workspace-checks.lock",
  );
}

describe("fresh verification evidence", () => {
  it("requires native coverage of selected browser files and rejects unexecuted cases", async () => {
    const root = fixture();
    mkdirSync(path.join(root, "tests/e2e"));
    writeFileSync(path.join(root, "tests/e2e/new.spec.ts"), "export {};");
    for (const scenario of ["complete", "excluded", "not-run"]) {
      const dependencies = services(["tests/e2e/new.spec.ts"]);
      dependencies.files.push("tests/e2e/new.spec.ts");
      dependencies.run.mockImplementation(async (_root, command, _args, environment) => {
        if (command.includes("playwright")) {
          const output = (environment as Record<string, string>).PLAYWRIGHT_JSON_OUTPUT_FILE;
          writeFileSync(
            output,
            JSON.stringify({
              config: { rootDir: path.join(root, "tests/e2e") },
              suites: [
                {
                  specs: [
                    {
                      file: scenario === "excluded" ? "other.spec.ts" : "new.spec.ts",
                      title: "coverage",
                      tests: [
                        {
                          expectedStatus: "passed",
                          status: scenario === "not-run" ? "skipped" : "expected",
                          results: scenario === "not-run" ? [] : [{ status: "passed" }],
                        },
                      ],
                    },
                  ],
                },
              ],
              errors: [],
              stats: {
                expected: scenario === "not-run" ? 0 : 1,
                skipped: scenario === "not-run" ? 1 : 0,
                unexpected: 0,
                flaky: 0,
              },
            }),
          );
        }
        return 0;
      });
      const result = await verifyWorkspace(root, { full: false }, dependencies);
      expect(result.code).toBe(scenario === "complete" ? 0 : 1);
      const browser = result.report?.steps.find((step: { checks: string[] }) =>
        step.checks.includes("test:docs-layout"),
      );
      expect(browser?.browserEvidence).toBeDefined();
      if (scenario === "excluded")
        expect(browser?.browserEvidence.missingFiles).toEqual(["tests/e2e/new.spec.ts"]);
      if (scenario === "not-run") expect(browser?.browserEvidence.notCompleted).toHaveLength(1);
    }
  });

  it("rejects a successful browser exit without fresh native evidence and preserves real failure codes", async () => {
    const root = fixture();
    const dependencies = services(["tests/e2e/new.spec.ts"]);
    const result = await verifyWorkspace(root, { full: false }, dependencies);
    const browser = result.report?.steps.find((step: { checks: string[] }) =>
      step.checks.includes("test:docs-layout"),
    );
    expect(result.code).toBe(1);
    expect(browser?.status).toBe("FAIL");
    expect(browser?.browserEvidenceError).toContain("ENOENT");
    expect(browser?.environment.PLAYWRIGHT_JSON_OUTPUT_FILE).toBe(
      path.join(path.dirname(result.reportPath!), "browser.json"),
    );
    dependencies.run.mockImplementation(async (_root, command) =>
      command.includes("playwright") ? 7 : 0,
    );
    const failed = await verifyWorkspace(root, { full: false }, dependencies);
    expect(failed.code).toBe(7);
    expect(existsSync(lockPath(root))).toBe(false);
  });

  it("runs selected tests afresh on every invocation and records evidence without touching source", async () => {
    const root = fixture();
    const dependencies = services();
    const first = await verifyWorkspace(root, { full: false }, dependencies);
    const second = await verifyWorkspace(root, { full: false }, dependencies);
    expect(first.plan.checks.map(({ name }: { name: string }) => name)).toEqual([
      "test",
      "typecheck:tests",
    ]);
    expect(dependencies.run).toHaveBeenCalledTimes(first.plan.steps.length * 2);
    expect(first.code).toBe(0);
    expect(first.report?.status).toBe("PASS");
    expect(second.reportPath).not.toBe(first.reportPath);
    expect(JSON.parse(readFileSync(first.reportPath!, "utf8")).selectedTests).toEqual([
      "tests/one.test.ts",
    ]);
    expect(readFileSync(path.join(root, "tests/one.test.ts"), "utf8")).toBe("export {};");
    expect(existsSync(lockPath(root))).toBe(false);
  });

  it("reports no changes and dry-run without executing checks", async () => {
    const root = fixture();
    const clean = services([]);
    expect((await verifyWorkspace(root, { full: false }, clean)).report?.status).toBe("NO_CHANGES");
    expect(clean.run).not.toHaveBeenCalled();
    expect(clean.log.mock.calls.flat().join("\n")).toContain("无待验证改动");
    const dependencies = services();
    const dry = await verifyWorkspace(root, { full: false, dryRun: true }, dependencies);
    expect(dry.code).toBe(0);
    expect(dry.reportPath).toBeUndefined();
    expect(dependencies.run).not.toHaveBeenCalled();
  });

  it("preserves a failure exit code, stops later steps and releases ownership", async () => {
    const root = fixture();
    const dependencies = services(["scripts/generate-token-catalog.mjs"]);
    dependencies.run.mockResolvedValue(7);
    const result = await verifyWorkspace(root, { full: false }, dependencies);
    expect(result.code).toBe(7);
    expect(result.report?.steps[0].status).toBe("FAIL");
    expect(
      result.report?.steps.slice(1).every(({ status }: { status: string }) => status === "NOT_RUN"),
    ).toBe(true);
    expect(dependencies.run).toHaveBeenCalledTimes(1);
    expect(dependencies.log.mock.calls.flat().join("\n")).toContain("Not completed");
    expect(existsSync(lockPath(root))).toBe(false);
  });

  it("records exceptions as failures and detects source changes without reusing stale evidence", async () => {
    const root = fixture();
    const dependencies = services();
    dependencies.run.mockRejectedValue(new Error("spawn failed"));
    const failed = await verifyWorkspace(root, { full: false }, dependencies);
    expect(failed.code).toBe(1);
    expect(failed.report?.steps[0].error).toBe("spawn failed");
    let version = "before";
    const changing = {
      ...services(),
      fingerprint: () => version,
      run: async () => {
        version = "after";
        return 0;
      },
    };
    const incomplete = await verifyWorkspace(root, { full: false }, changing);
    expect(incomplete.code).toBe(1);
    expect(incomplete.report?.status).toBe("INCOMPLETE");
    expect(incomplete.report?.inputsChanged).toBe(true);
  });

  it("rejects changes during discovery before running checks", async () => {
    const root = fixture();
    let version = "before";
    const dependencies = services();
    const discover = dependencies.discover;
    const result = await verifyWorkspace(
      root,
      { full: false },
      {
        ...dependencies,
        fingerprint: () => version,
        discover: async () => {
          version = "after";
          return discover();
        },
      },
    );
    expect(result.report?.status).toBe("INCOMPLETE");
    expect(dependencies.run).not.toHaveBeenCalled();
    expect(result.code).toBe(1);
  });

  it("serializes independent callers under the existing workspace lock", async () => {
    const root = fixture();
    const events: string[] = [];
    let release: () => void = () => {};
    let announce: () => void = () => {};
    const started = new Promise<void>((resolve) => {
      announce = resolve;
    });
    const wait = new Promise<void>((resolve) => {
      release = resolve;
    });
    const first = verifyWorkspace(
      root,
      { full: false },
      {
        ...services(),
        run: async () => {
          events.push("first:start");
          announce();
          await wait;
          events.push("first:end");
          return 0;
        },
      },
    );
    await started;
    const second = verifyWorkspace(
      root,
      { full: false },
      {
        ...services(),
        run: async () => {
          events.push("second");
          return 0;
        },
      },
    );
    expect(events).toEqual(["first:start"]);
    release();
    expect((await Promise.all([first, second])).map(({ code }) => code)).toEqual([0, 0]);
    expect(events).toEqual([
      "first:start",
      "first:end",
      "first:start",
      "first:end",
      "second",
      "second",
    ]);
  });

  it("executes literal argv without a shell and returns the actual child's code", async () => {
    const root = fixture();
    writeFileSync(
      path.join(root, "tool.mjs"),
      "import {writeFileSync} from 'node:fs'; writeFileSync('argv.json', JSON.stringify(process.argv.slice(2))); process.exit(7);",
    );
    const argv = ["with spaces", "a&b", "$(literal)", 'quote"value'];
    expect(await runPackageStep(root, ["node", "tool.mjs"], argv)).toBe(7);
    expect(JSON.parse(readFileSync(path.join(root, "argv.json"), "utf8"))).toEqual(argv);
  });
});
