// @vitest-environment node
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { verificationFiles } from "../scripts/lib/verification-context.mjs";
import {
  discoverBrowserRoutes,
  missingIndirectInputs,
  repositoryImports,
} from "../scripts/lib/verification-discovery.mjs";
import { DOCS_ROUTE_SEQUENCE } from "../docs/site/src/data/docs-routes";
import {
  classifyVerification,
  indirectTests,
  isUnitTest,
  selectBrowserSpecs,
  browserFileFilters,
  INDIRECT_INPUT_GROUPS,
} from "../scripts/lib/verification-policy.mjs";
import {
  createVerificationPlan,
  verificationOptions,
  verificationSteps,
} from "../scripts/lib/verification.mjs";

const roots: string[] = [];
function fixture(entries: Record<string, string>) {
  const root = mkdtempSync(path.join(os.tmpdir(), "unitary-verify-policy-"));
  roots.push(root);
  for (const [file, source] of Object.entries(entries)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), source);
  }
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
const context = (...paths: string[]) => ({
  head: "head",
  comparison: "head",
  paths,
  changes: paths.map((file) => ({ status: "M", file })),
});
const discovery = (available: string[], selected: string[] = []) => ({
  available,
  selected,
  missing: [] as string[],
  routes: ["/components/radio"],
  routeRegistry: ["/components/radio"],
  uncovered: [] as string[],
});

describe("verification selection", () => {
  it("includes native JavaScript and alternative test suffixes and falls back for unmapped specs", async () => {
    const names = ["new.test.js", "new.spec.jsx", "new.test.tsx", "new.spec.mjs", "new.test.cts"];
    const files = ["tests/known.test.ts", ...names.map((name) => `tests/e2e/${name}`)];
    const root = fixture(Object.fromEntries(files.map((file) => [file, "export {};"])));
    const plan = await createVerificationPlan(
      root,
      { full: false },
      {
        context: context(files[1]),
        files,
        discover: async () => ({ ...discovery([files[0]], [files[0]]), routes: [] }),
      },
    );
    expect(plan.scope.fullBrowser).toBe(true);
    expect(plan.browserSpecs).toEqual(files.slice(1));
    expect(plan.reasons.join("\n")).toContain(files[1]);
    expect(
      selectBrowserSpecs([files[1]], [files[1]], [], [{ specs: [names[0]], inputs: [] }]),
    ).toEqual({ selected: [files[1]], missing: [] });
  });

  it("rejects changed tests excluded by the existing temporary and hidden-file conventions", async () => {
    for (const file of [
      "tests/e2e/.new.spec.ts",
      "tests/e2e/_tmp-new.test.js",
      "tests/e2e/new.tmp.spec.ts",
    ]) {
      const files = ["tests/known.test.ts", file];
      const root = fixture(Object.fromEntries(files.map((name) => [name, "export {};"])));
      await expect(
        createVerificationPlan(
          root,
          { full: false },
          {
            context: context(file),
            files,
            discover: async () => discovery([files[0]], [files[0]]),
          },
        ),
      ).rejects.toThrow("Changed browser tests are excluded");
    }
  });

  it("keeps browser fixtures conservative and does not hide unknown fixture or CI inputs beside a known test", () => {
    const browser = classifyVerification(
      context("tests/e2e/fixtures/example.html", "tests/radio-api.test.tsx"),
    );
    expect(browser.scope.browser).toBe(true);
    expect(browser.scope.fullBrowser).toBe(true);
    expect(
      classifyVerification(context("tests/data/unknown.json", "tests/radio-api.test.tsx")).scope
        .fullUnit,
    ).toBe(true);
    expect(
      classifyVerification(context("tests/data/unknown.ts", "src/components/ui/radio.tsx")).scope
        .fullBrowser,
    ).toBe(true);
    expect(classifyVerification(context("docs/unknown.md")).scope.fullUnit).toBe(true);
    expect(
      classifyVerification(context("src/components/ui/unknown.json", "src/components/ui/radio.tsx"))
        .scope.fullBrowser,
    ).toBe(true);
    expect(
      indirectTests([".github/workflows/nightly.yml"], ["tests/playwright-discovery.test.ts"]),
    ).toEqual(["tests/playwright-discovery.test.ts"]);
  });

  it("traces foundations and shared shell consumers without expanding the generated demo dispatcher", () => {
    const entries = {
      "src/components/ui/radio.tsx": "export {};",
      "src/components/ui/button.tsx": "export {};",
      "docs/site/src/App.tsx":
        'import "./components/docs-pages"; import "./components/docs-shell";',
      "docs/site/src/components/docs-pages.tsx": 'import "../../../../src/components/ui/radio";',
      "docs/site/src/components/docs-shell.tsx": 'import "../../../../src/components/ui/button";',
      "docs/site/src/components/docs-components-page.tsx":
        'import "../examples/registry.ts?example-loaders";',
      "docs/site/src/examples/registry.ts": 'import "./radio/default.example";',
      "docs/site/src/examples/radio/default.example.tsx":
        'import "../../../../../src/components/ui/radio";',
    };
    const root = fixture(entries);
    const registry = [
      { to: "/materials", renderer: { kind: "static", page: "materials" } },
      { to: "/colors", renderer: { kind: "static", page: "colors" } },
      { to: "/components/radio", renderer: { kind: "component-detail", componentName: "radio" } },
      { to: "/components/button", renderer: { kind: "component-detail", componentName: "button" } },
    ];
    const result = discoverBrowserRoutes(
      root,
      Object.keys(entries),
      ["src/components/ui/radio.tsx"],
      registry,
    );
    expect(result.routes).toEqual(["/materials", "/colors", "/components/radio"]);
    expect(result.uncovered).toEqual([]);
    expect(
      discoverBrowserRoutes(root, Object.keys(entries), ["src/components/ui/button.tsx"], registry)
        .uncovered,
    ).toContain("Shared documentation shell");
    expect(
      discoverBrowserRoutes(
        root,
        Object.keys(entries),
        [],
        [...registry, { to: "/new", renderer: { kind: "static", page: "new" } }],
      ).uncovered,
    ).toContain("Missing renderer owner: /new");
    expect(
      discoverBrowserRoutes(
        root,
        Object.keys(entries),
        [],
        [...registry, { to: "/new-component", renderer: { kind: "component-new" } }],
      ).uncovered,
    ).toContain("Missing renderer owner: /new-component");
    const specs = ["tests/e2e/texture.spec.ts", "tests/e2e/docs-layout.spec.ts"];
    expect(selectBrowserSpecs([], specs, ["/materials"]).selected).toEqual(specs.sort());
  });

  it("declares a current dependency owner for every canonical browser renderer", () => {
    const root = process.cwd();
    const files = verificationFiles(root);
    expect(discoverBrowserRoutes(root, files, [], DOCS_ROUTE_SEQUENCE).uncovered).toEqual([]);
  });

  it("keeps local sources narrow and shared or uncertain changes conservative", () => {
    expect(classifyVerification(context("src/components/ui/radio.tsx")).scope.fullUnit).toBe(false);
    for (const file of [
      "src/styles/index.css",
      "src/lib/index.ts",
      "pnpm-lock.yaml",
      "unrecognized.txt",
    ]) {
      const plan = classifyVerification(context(file));
      expect(plan.scope.fullUnit).toBe(true);
      expect(plan.scope.fullBrowser).toBe(true);
      expect(plan.scope.package).toBe(true);
    }
    expect(
      classifyVerification({
        ...context("src/old.ts"),
        changes: [{ status: "R", file: "src/old.ts", next: "src/new.ts" }],
      }).scope.fullUnit,
    ).toBe(true);
    expect(
      classifyVerification({
        ...context("src/old.ts"),
        changes: [{ status: "D", file: "src/old.ts" }],
      }).scope.fullBrowser,
    ).toBe(true);
    expect(classifyVerification(context("scripts/lib/verification.mjs")).scope.fullUnit).toBe(true);
    expect(classifyVerification(context("src/App.tsx")).scope.fullBrowser).toBe(true);
    for (const file of [
      "LICENSE",
      "OFL.txt",
      "THIRD_PARTY_NOTICES.md",
      "scripts/fix-css-font-urls.mjs",
      "scripts/test-package-imports.mjs",
    ]) {
      expect(classifyVerification(context(file)).scope.package).toBe(true);
    }
  });

  it("unions native associations, indirect readers and changed tests including new tests", async () => {
    const entries = {
      "src/components/ui/radio.tsx": "",
      "tests/new.test.ts": "",
      "tests/radio-api.test.tsx": "",
      "tests/radio-pointer-focus.test.tsx": "",
      "tests/e2e/docs-layout.spec.ts": "",
      "tests/e2e/radio-scroll.spec.ts": "",
    };
    const root = fixture(entries);
    const available = [
      "tests/new.test.ts",
      "tests/radio-api.test.tsx",
      "tests/radio-pointer-focus.test.tsx",
    ];
    const plan = await createVerificationPlan(
      root,
      { full: false },
      {
        context: context("src/components/ui/radio.tsx", "tests/new.test.ts"),
        files: Object.keys(entries),
        discover: async () => discovery(available, ["tests/radio-pointer-focus.test.tsx"]),
      },
    );
    expect(plan.selectedTests).toEqual(available.sort());
    expect(plan.routes).toEqual(["/components/radio"]);
    expect(plan.browserSpecs).toEqual([
      "tests/e2e/docs-layout.spec.ts",
      "tests/e2e/radio-scroll.spec.ts",
    ]);
    expect(plan.scope.fullUnit).toBe(false);
    expect(plan.checks.find(({ name }) => name === "test:docs-layout")?.args).toEqual([
      "--max-failures=1",
      "--reporter=list,json",
      ...browserFileFilters(plan.browserSpecs),
    ]);
  });

  it("falls back when native discovery fails, opaque consumers lack declarations or no tests match", async () => {
    const root = fixture({ "tests/example.test.ts": "" });
    const base = {
      context: context("src/components/ui/radio.tsx"),
      files: ["tests/example.test.ts"],
    };
    const cases = [
      async () => {
        throw new Error("transform failed");
      },
      async () => ({ ...discovery(["tests/example.test.ts"]), missing: ["tests/example.test.ts"] }),
      async () => discovery([]),
    ];
    for (const discover of cases) {
      const plan = await createVerificationPlan(root, { full: false }, { ...base, discover });
      expect(plan.scope.fullUnit).toBe(true);
      expect(plan.scope.fullBrowser).toBe(true);
      expect(plan.reasons.length).toBeGreaterThan(0);
    }
  });

  it("does not hide an added test excluded by discovery", async () => {
    const root = fixture({ "tests/new.test.ts": "" });
    await expect(
      createVerificationPlan(
        root,
        { full: false },
        {
          context: context("tests/new.test.ts"),
          files: ["tests/new.test.ts"],
          discover: async () => discovery([]),
        },
      ),
    ).rejects.toThrow("excluded from Vitest");
  });

  it("retains configured test inventory when related discovery fails", async () => {
    const root = fixture({ "tests/new.test.ts": "", "tests/known.test.ts": "" });
    await expect(
      createVerificationPlan(
        root,
        { full: false },
        {
          context: context("tests/new.test.ts"),
          files: ["tests/new.test.ts", "tests/known.test.ts"],
          discover: async () => {
            throw Object.assign(new Error("related transform failed"), {
              available: ["tests/known.test.ts"],
            });
          },
        },
      ),
    ).rejects.toThrow("excluded from Vitest");
    expect(classifyVerification(context("src/components/ui/index.ts")).scope.package).toBe(true);
  });

  it("requires declarations for transitive file readers and computed imports", () => {
    const entries = {
      "tests/new.test.ts": 'import "./helper";',
      "tests/helper.ts":
        'import { readFileSync } from "node:fs"; export const read = readFileSync;',
      "tests/computed.test.ts": 'const value = "./helper"; void import(value);',
      "tests/pure.test.ts": "export const value = 1;",
    };
    const root = fixture(entries);
    expect(
      missingIndirectInputs(
        root,
        Object.keys(entries).filter(isUnitTest),
        Object.keys(entries),
        [],
      ),
    ).toEqual(["tests/computed.test.ts", "tests/new.test.ts"]);
    expect(
      missingIndirectInputs(root, ["tests/new.test.ts"], Object.keys(entries), [
        { tests: ["tests/new.test.ts"], inputs: ["src/**"] },
      ]),
    ).toEqual([]);
    expect(
      repositoryImports(root, Object.keys(entries))
        .closure("tests/new.test.ts")
        .files.has("tests/helper.ts"),
    ).toBe(true);
  });

  it("declares every current indirect consumer and every ordinary browser spec", () => {
    const root = process.cwd();
    const files = verificationFiles(root);
    expect(missingIndirectInputs(root, files.filter(isUnitTest), files)).toEqual([]);
    expect(selectBrowserSpecs([], files, []).missing).toEqual([]);
    expect(INDIRECT_INPUT_GROUPS.every(({ inputs }) => inputs.length > 0)).toBe(true);
    expect(indirectTests(["scripts/run-locked-script.mjs"], files)).toContain(
      "tests/package-script-lock.test.ts",
    );
    expect(indirectTests(["src/components/ui/radio.tsx"], files)).not.toContain(
      "tests/audit/comparator-v3.test.ts",
    );
  });
});

describe("verification command planning", () => {
  it("distinguishes cleared environment keys and deduplicates equivalent key ordering", () => {
    expect(
      verificationSteps([
        { name: "test", reason: "inherited" },
        { name: "test", environment: { NODE_OPTIONS: undefined }, reason: "cleared" },
      ]),
    ).toHaveLength(2);
    expect(
      verificationSteps([
        { name: "test", environment: { A: "one", B: "two" }, reason: "first" },
        { name: "test", environment: { B: "two", A: "one" }, reason: "second" },
      ]),
    ).toHaveLength(1);
  });

  it("deduplicates shared prerequisites without merging distinct builds", () => {
    const steps = verificationSteps([
      { name: "typecheck", reason: "types" },
      { name: "build", reason: "app" },
      { name: "build:docs", reason: "docs" },
      { name: "test:package", reason: "package" },
    ]);
    expect(
      steps.filter(({ command }) => command[1] === "scripts/generate-token-catalog.mjs"),
    ).toHaveLength(1);
    expect(
      steps.filter(({ command }) => command.join(" ") === "bin typescript tsc -b"),
    ).toHaveLength(1);
    expect(steps.filter(({ command }) => command[1] === "vite")).toHaveLength(3);
    expect(steps.at(-1)?.command).toEqual(["node", "--test", "scripts/test-package-imports.mjs"]);
  });

  it("preserves literal arguments, rejects cycles and validates CLI options", () => {
    const literal = ["with spaces", "$(literal)", "a&b", 'quote"value'];
    expect(
      verificationSteps([{ name: "test", args: literal, reason: "selected" }])[0].command.slice(-4),
    ).toEqual(literal);
    expect(() =>
      verificationSteps([{ name: "loop", reason: "bad" }], {
        loop: { steps: [["script", "loop"]] },
      }),
    ).toThrow("Cyclic");
    expect(verificationOptions(["--", "--base", "HEAD~1", "--dry-run"])).toEqual({
      full: false,
      dryRun: true,
      base: "HEAD~1",
    });
    expect(() => verificationOptions(["--base"])).toThrow("incomplete");
    expect(() => verificationOptions(["--full", "--full"])).toThrow("Repeated");
    expect(() => verificationOptions(["--update"])).toThrow("Unknown");
  });
});
