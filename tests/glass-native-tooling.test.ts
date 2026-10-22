import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseDocument } from "yaml";
import config from "../playwright.glass-native.config";

describe("native Glass acceptance environment", () => {
  it("runs real engine projects independently of Chromium permissions and retries", () => {
    expect(config.projects?.map(project => [project.name, project.use?.browserName, project.use?.deviceScaleFactor])).toEqual([
      ["firefox-dpr1", "firefox", 1], ["firefox-dpr2", "firefox", 2], ["webkit-dpr1", "webkit", 1], ["webkit-dpr2", "webkit", 2],
    ]);
    expect(config.use?.permissions).toEqual([]);
    expect(config.retries).toBe(0);
    expect(config.testMatch).toBe("**/*.e2e.ts");
    expect(config.use?.baseURL).toBe("http://127.0.0.1:5243");
  });
  it("requires native paint before the matrix and preserves failures without a permissive override", () => {
    const document = parseDocument(readFileSync(".github/workflows/glass-native.yml", "utf8"));
    expect(document.errors).toEqual([]);
    const workflow = document.toJS();
    expect(workflow.permissions).toEqual({ contents: "read" });
    expect(workflow.on).toHaveProperty("pull_request");
    expect(workflow.on).toHaveProperty("schedule");
    expect(workflow.on).toHaveProperty("workflow_dispatch");
    expect(workflow.on).not.toHaveProperty("pull_request_target");
    const job = workflow.jobs.paint;
    expect(job["runs-on"]).toBe("ubuntu-24.04");
    expect(job.strategy).toEqual({ "fail-fast": false, matrix: { browser: ["firefox", "webkit"], dpr: [1, 2] } });
    expect(job["continue-on-error"]).toBeUndefined();
    const steps = job.steps as Array<{ id?: string; run?: string; uses?: string; if?: string; with?: Record<string, unknown>; "continue-on-error"?: boolean }>;
    const probe = steps.findIndex(step => step.id === "probe"), matrix = steps.findIndex(step => step.id === "matrix");
    expect(probe).toBeGreaterThan(steps.findIndex(step => step.run?.includes("playwright install --with-deps")));
    expect(matrix).toBeGreaterThan(probe);
    for (const index of [probe, matrix]) {
      expect(steps[index].run).toContain("xvfb-run -a");
      expect(steps[index].run).toContain("--project=${{ matrix.browser }}-dpr${{ matrix.dpr }}");
    }
    expect(steps[probe].run).toContain('"native blur control"');
    expect(steps[matrix].run).toContain('"material matrix|local optical input"');
    for (const step of steps) {
      expect(step["continue-on-error"]).toBeUndefined();
      if (step.uses) expect(step.uses).toMatch(/^[^@]+@[a-f0-9]{40}$/);
      if (step.uses?.startsWith("actions/upload-artifact@")) {
        expect(step.if).toContain("!cancelled()");
        expect(step.with?.["if-no-files-found"]).toBe("error");
      }
    }
  });
});
