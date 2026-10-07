// @vitest-environment node
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { DOCS_ROUTE_SEQUENCE } from "../docs/site/src/data/docs-routes";
import { verificationBrowserEvidence } from "../scripts/lib/verification.mjs";
import { browserFileFilters } from "../scripts/lib/verification-policy.mjs";
import {
  LAYOUT_VIEWPORTS,
  LAYOUT_THEMES,
  selectLayoutRoutes,
  layoutCoverage,
} from "./e2e/helpers/layout-matrix";

describe("scoped layout evidence", () => {
  it("stops after a final native failure, retains configured retries and reports remaining cases", () => {
    const repository = process.cwd();
    const root = mkdtempSync(path.join(os.tmpdir(), "unitary-browser-fail-fast-"));
    const file = "literal [case] & space.test.mjs";
    try {
      const entry = pathToFileURL(path.join(repository, "node_modules/@playwright/test/index.mjs"));
      writeFileSync(
        path.join(root, "playwright.config.mjs"),
        "export default {testDir:'.', workers:1, retries:1, outputDir:'output'};",
      );
      writeFileSync(
        path.join(root, file),
        `import {test,expect} from ${JSON.stringify(entry.href)};
import {appendFileSync} from 'node:fs';
test('fails after original retries',()=>{appendFileSync('attempts.txt','attempt\\n');expect(1).toBe(2);});
test('must not execute',()=>{appendFileSync('attempts.txt','unexpected\\n');});
test.skip('intentional skip',()=>{});`,
      );
      const output = path.join(root, "browser.json");
      const result = spawnSync(
        process.execPath,
        [
          path.join(repository, "node_modules/@playwright/test/cli.js"),
          "test",
          "--max-failures=1",
          "--reporter=json",
          ...browserFileFilters([file]),
        ],
        {
          cwd: root,
          encoding: "utf8",
          timeout: 30_000,
          env: { ...process.env, NODE_OPTIONS: "", PLAYWRIGHT_JSON_OUTPUT_FILE: output },
        },
      );
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(1);
      expect(readFileSync(path.join(root, "attempts.txt"), "utf8")).toBe("attempt\nattempt\n");
      const native = JSON.parse(readFileSync(output, "utf8"));
      expect(native.suites[0].specs[0].tests[0].results).toHaveLength(2);
      const evidence = verificationBrowserEvidence(root, native, [file]);
      expect(evidence.stats).toMatchObject({ unexpected: 1, skipped: 2 });
      expect(evidence.notCompleted).toEqual([{ file, title: "must not execute" }]);
      expect(evidence.missingFiles).toEqual([]);
      expect(verificationBrowserEvidence(root, native, ["excluded.spec.mjs"]).missingFiles).toEqual(
        ["excluded.spec.mjs"],
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 40_000);

  it("rejects incomplete or duplicated evidence even when its row count matches", () => {
    const evidence = LAYOUT_VIEWPORTS.flatMap((viewport) =>
      LAYOUT_THEMES.map((theme) => ({ route: "/", viewport, theme })),
    );
    expect(layoutCoverage(["/"], evidence)).toMatchObject({ complete: true, expectedCombos: 12 });
    const replaced = [...evidence.slice(1), evidence[1]];
    const coverage = layoutCoverage(["/"], replaced);
    expect(coverage.observedCombos).toBe(12);
    expect(coverage.complete).toBe(false);
    expect(coverage.missing).toHaveLength(1);
    expect(coverage.duplicates).toHaveLength(1);
    expect(layoutCoverage(["/"], evidence.slice(0, 6))).toMatchObject({
      complete: false,
      uniqueCombos: 6,
    });
  });

  it("rejects an unknown route, theme or viewport in collected evidence", () => {
    const evidence = LAYOUT_VIEWPORTS.flatMap((viewport) =>
      LAYOUT_THEMES.map((theme) => ({ route: "/", viewport, theme })),
    );
    for (const changed of [
      { ...evidence[0], route: "/unknown" },
      { ...evidence[0], theme: "unknown" },
      { ...evidence[0], viewport: { width: 1, height: 1 } },
    ]) {
      expect(layoutCoverage(["/"], [changed, ...evidence.slice(1)])).toMatchObject({
        complete: false,
      });
      expect(layoutCoverage(["/"], [changed, ...evidence.slice(1)]).unexpected).toHaveLength(1);
    }
  });

  it("selects a canonical subset in registry order and retains every theme and viewport", () => {
    const routes = selectLayoutRoutes(
      DOCS_ROUTE_SEQUENCE,
      JSON.stringify(["/components/radio", "/"]),
    );
    expect(routes.map(({ to }) => to)).toEqual(
      DOCS_ROUTE_SEQUENCE.filter(({ to }) => to === "/" || to === "/components/radio").map(
        ({ to }) => to,
      ),
    );
    expect(LAYOUT_VIEWPORTS).toEqual([
      { width: 1440, height: 900 },
      { width: 1100, height: 800 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
      { width: 320, height: 700 },
    ]);
    expect(LAYOUT_THEMES).toEqual(["light", "dark"]);
    const combos = routes.flatMap(({ to }) =>
      LAYOUT_VIEWPORTS.flatMap(({ width, height }) =>
        LAYOUT_THEMES.map((theme) => `${to}|${width}x${height}|${theme}`),
      ),
    );
    const full = selectLayoutRoutes(DOCS_ROUTE_SEQUENCE).flatMap(({ to }) =>
      LAYOUT_VIEWPORTS.flatMap(({ width, height }) =>
        LAYOUT_THEMES.map((theme) => `${to}|${width}x${height}|${theme}`),
      ),
    );
    expect(combos).toEqual(
      full.filter((combo) => combo.startsWith("/|") || combo.startsWith("/components/radio|")),
    );
  });

  it("fails on unknown routes, invalid JSON and empty filters", () => {
    for (const value of ["[]", "{}", '"/"', "invalid", "[1]", '["/unknown"]']) {
      expect(() => selectLayoutRoutes(DOCS_ROUTE_SEQUENCE, value)).toThrow();
    }
    expect(selectLayoutRoutes(DOCS_ROUTE_SEQUENCE, '["/","/"]')).toHaveLength(1);
    expect(selectLayoutRoutes(DOCS_ROUTE_SEQUENCE)).toEqual(DOCS_ROUTE_SEQUENCE);
  });

  it("discovers both scoped matrix chunks and the aggregate gate without running whole-site probes", () => {
    const root = process.cwd();
    const output = execFileSync(
      process.execPath,
      [
        path.join(root, "node_modules/@playwright/test/cli.js"),
        "test",
        "tests/e2e/docs-layout.spec.ts",
        "--list",
        "--reporter=json",
      ],
      {
        cwd: root,
        encoding: "utf8",
        timeout: 30_000,
        maxBuffer: 4 * 1024 * 1024,
        env: { ...process.env, UNITARY_VERIFY_ROUTES: '["/components/radio"]', NODE_OPTIONS: "" },
      },
    );
    const report = JSON.parse(output);
    expect(report.errors).toEqual([]);
    const titles: string[] = [];
    const visit = (suite: { suites?: unknown[]; specs?: { title: string }[] }) => {
      titles.push(...(suite.specs ?? []).map(({ title }) => title));
      for (const child of suite.suites ?? []) visit(child as typeof suite);
    };
    for (const suite of report.suites) visit(suite);
    expect(titles).toHaveLength(3);
    expect(titles).toContain("component routes chunk 1/1 (light)");
    expect(titles).toContain("component routes chunk 1/1 (dark)");
    expect(titles).toContain("aggregate layout audit gate");
  }, 40_000);

  it("retains the complete default matrix and supplemental probes without a route filter", () => {
    const root = process.cwd();
    const env: NodeJS.ProcessEnv = { ...process.env, NODE_OPTIONS: "" };
    delete env.UNITARY_VERIFY_ROUTES;
    const report = JSON.parse(
      execFileSync(
        process.execPath,
        [
          path.join(root, "node_modules/@playwright/test/cli.js"),
          "test",
          "tests/e2e/docs-layout.spec.ts",
          "--list",
          "--reporter=json",
        ],
        {
          cwd: root,
          encoding: "utf8",
          timeout: 30_000,
          maxBuffer: 4 * 1024 * 1024,
          env,
        },
      ),
    );
    expect(report.errors).toEqual([]);
    const titles: string[] = [];
    const visit = (suite: { suites?: unknown[]; specs?: { title: string }[] }) => {
      titles.push(...(suite.specs ?? []).map(({ title }) => title));
      for (const child of suite.suites ?? []) visit(child as typeof suite);
    };
    for (const suite of report.suites) visit(suite);
    expect(titles).toContain("aggregate layout audit gate");
    expect(titles).toContain("clipboard writes computed value (light)");
    const components = DOCS_ROUTE_SEQUENCE.filter(
      ({ renderer }) => renderer.kind === "component-detail",
    ).length;
    // Both route categories keep the existing eight-route chunks in each theme.
    expect(titles.filter((title) => title.startsWith("component routes chunk"))).toHaveLength(
      Math.ceil(components / 8) * LAYOUT_THEMES.length,
    );
    expect(titles.filter((title) => title.startsWith("static routes chunk"))).toHaveLength(
      Math.ceil((DOCS_ROUTE_SEQUENCE.length - components) / 8) * LAYOUT_THEMES.length,
    );
  }, 40_000);
});
