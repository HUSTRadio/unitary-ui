import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LOCKED_PACKAGE_SCRIPTS } from "./locked-package-scripts.mjs";
import { runPackageStep } from "./package-command.mjs";
import { withPackageLock } from "./package-script-lock.mjs";
import {
  verificationContext,
  verificationFiles,
  verificationFingerprint,
} from "./verification-context.mjs";
import { discoverVerification } from "./verification-discovery.mjs";
import {
  classifyVerification,
  indirectTests,
  isBrowserSpec,
  isBrowserTest,
  browserFileFilters,
  isUnitTest,
  selectBrowserSpecs,
} from "./verification-policy.mjs";

export function verificationOptions(args) {
  const options = { full: false, dryRun: false, base: undefined };
  const seen = new Set();
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--" && index === 0) continue;
    if (seen.has(arg)) throw new Error(`Repeated verification option: ${arg}`);
    seen.add(arg);
    if (arg === "--full") options.full = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--base" && args[index + 1] && !args[index + 1].startsWith("--"))
      options.base = args[++index];
    else throw new Error(`Unknown or incomplete verification option: ${arg}`);
  }
  return options;
}

/**
 * Expand the existing registry in order, deduplicating identical leaf commands only within this plan.
 * @param {Array<{name: string, args?: string[], environment?: Record<string, string | undefined>, reason: string}>} requests
 * @param {Record<string, {steps: string[][]}>} registry
 */
export function verificationSteps(requests, registry = LOCKED_PACKAGE_SCRIPTS) {
  const steps = [];
  const seen = new Map();
  const visit = (name, args, environment, reason, ancestors = []) => {
    if (ancestors.includes(name)) throw new Error(`Cyclic package script: ${name}`);
    if (!Object.hasOwn(registry, name) || name === "verify")
      throw new Error(`Invalid verification check: ${name}`);
    registry[name].steps.forEach((command, index) => {
      const forwarded = index === registry[name].steps.length - 1 ? args : [];
      if (command[0] === "script") {
        visit(command[1], [...command.slice(2), ...forwarded], environment, reason, [
          ...ancestors,
          name,
        ]);
        return;
      }
      const argv = [...command, ...forwarded];
      const key = JSON.stringify([
        argv,
        Object.keys(environment)
          .sort()
          .map((name) => [name, environment[name]]),
      ]);
      const previous = seen.get(key);
      if (previous) {
        if (!previous.checks.includes(name)) previous.checks.push(name);
        if (!previous.reasons.includes(reason)) previous.reasons.push(reason);
      } else {
        const step = { command: argv, environment, checks: [name], reasons: [reason] };
        seen.set(key, step);
        steps.push(step);
      }
    });
  };
  for (const { name, args = [], environment = {}, reason } of requests)
    visit(name, args, environment, reason);
  return steps;
}

const forceFull = (scope) =>
  Object.keys(scope).forEach((key) => {
    scope[key] = true;
  });

export async function createVerificationPlan(root, options, services = {}) {
  const started = performance.now();
  const context = services.context ?? verificationContext(root, options.base);
  if (!context.paths.length && !options.full)
    return {
      context,
      scope: classifyVerification(context).scope,
      reasons: [],
      selectedTests: [],
      browserSpecs: [],
      routes: [],
      checks: [],
      skipped: ["无待验证改动"],
      steps: [],
    };
  const files = (services.files ?? verificationFiles(root)).filter((file) =>
    existsSync(path.join(root, file)),
  );
  const { scope, reasons } = classifyVerification(context, options.full);
  let discovery;
  try {
    discovery = await (services.discover ?? discoverVerification)(
      root,
      files,
      context.paths,
      !scope.fullUnit,
    );
    if (discovery.missing.length) {
      reasons.push(`Missing indirect input declarations: ${discovery.missing.join(", ")}`);
      forceFull(scope);
    }
  } catch (error) {
    reasons.push(`Association discovery failed: ${error.message}`);
    forceFull(scope);
    discovery = {
      available: error.available ?? files.filter(isUnitTest),
      selected: [],
      routes: [],
      missing: [],
      uncovered: [],
    };
  }
  let selectedTests = scope.fullUnit
    ? discovery.available
    : [
        ...new Set([
          ...discovery.selected,
          ...indirectTests(context.paths, discovery.available),
          ...context.paths.filter((file) => discovery.available.includes(file)),
        ]),
      ].sort();
  if (scope.unit && !selectedTests.length) {
    reasons.push("No reliable unit-test association; full verification required");
    forceFull(scope);
    selectedTests = discovery.available;
  }
  if (
    context.paths.some(
      (file) => isUnitTest(file) && !discovery.available.includes(file) && files.includes(file),
    )
  ) {
    throw new Error(
      "A changed test is excluded from Vitest discovery; fix its configuration before verification",
    );
  }
  const browser = selectBrowserSpecs(context.paths, files, discovery.routes);
  const excludedBrowserTests = context.paths.filter(
    (file) => isBrowserTest(file) && files.includes(file) && !isBrowserSpec(file),
  );
  if (excludedBrowserTests.length)
    throw new Error(
      `Changed browser tests are excluded by temporary/hidden-file rules: ${excludedBrowserTests.map((file) => JSON.stringify(file)).join(", ")}. Fix their names or configuration before verification.`,
    );
  if (
    scope.browser &&
    (browser.missing.length || discovery.uncovered.length || !browser.selected.length)
  ) {
    scope.fullBrowser = true;
    reasons.push(
      `Browser coverage requires full discovery: ${[...browser.missing, ...discovery.uncovered].join(", ") || "no mapped specs"}`,
    );
  }
  if (
    scope.browser &&
    !scope.fullBrowser &&
    !discovery.routes.length &&
    !context.paths.some(isBrowserSpec)
  ) {
    scope.fullBrowser = true;
    reasons.push("No reliable route association; full browser coverage required");
  }
  const browserSpecs = scope.fullBrowser ? files.filter(isBrowserSpec) : browser.selected;
  const routes = scope.fullBrowser ? [] : discovery.routes;
  const checks = [];
  const skipped = [];
  const add = (enabled, name, reason, args = [], environment = {}) => {
    if (enabled) checks.push({ name, args, environment, reason });
    else skipped.push(`${name}: no affected contract`);
  };
  add(
    scope.unit,
    "test",
    scope.fullUnit ? "Full unit regression" : "Static imports and declared indirect inputs",
    scope.fullUnit ? [] : selectedTests,
  );
  add(scope.lint, "lint", "Code or tooling changes");
  add(scope.typecheck, "typecheck", "Source or tooling contract");
  add(
    scope.typecheck || context.paths.some(isUnitTest),
    "typecheck:tests",
    "Test and documentation source types",
  );
  add(scope.appBuild, "build", "Application/build contract");
  add(scope.docsBuild, "build:docs", "Canonical docs application");
  add(scope.package, "test:package", "Shared inputs or package boundary");
  add(scope.corpus, "docs:llm:check", "Complete deterministic bilingual corpus");
  add(
    scope.screenshots,
    "docs:readme:screenshots:check",
    "Complete living-styleguide screenshot set",
  );
  add(
    scope.browser,
    "test:docs-layout",
    scope.fullBrowser
      ? "Full browser regression"
      : "Affected specs and complete selected-route matrix",
    [
      "--max-failures=1",
      "--reporter=list,json",
      ...(scope.fullBrowser ? [] : browserFileFilters(browserSpecs)),
    ],
    {
      UNITARY_VERIFY_ROUTES: routes.length ? JSON.stringify(routes) : undefined,
      PW_REUSE_SERVER: undefined,
    },
  );
  return {
    context,
    scope,
    reasons,
    selectedTests,
    browserSpecs,
    routes,
    checks,
    skipped,
    steps: verificationSteps(checks),
    discoveryMs: Math.round(performance.now() - started),
  };
}

export function printVerificationPlan(plan, log = console.log) {
  log(`[verify] Changed paths: ${plan.context.paths.length}`);
  for (const file of plan.context.paths) log(`  ${JSON.stringify(file)}`);
  for (const reason of plan.reasons) log(`[verify] Fallback: ${reason}`);
  log(
    `[verify] Unit files: ${plan.selectedTests.length}; browser specs: ${plan.browserSpecs.length}; layout routes: ${plan.routes.length || (plan.scope.browser ? "all" : "none")}`,
  );
  for (const check of plan.checks) log(`[verify] ${check.name}: ${check.reason}`);
  for (const skipped of plan.skipped) log(`[verify] Skip: ${skipped}`);
  log(`[verify] ${plan.steps.length} unique execution steps; discovery ${plan.discoveryMs ?? 0}ms`);
}

/** Read native Playwright outcomes, including cases left unexecuted after fail-fast. */
export function verificationBrowserEvidence(root, data, selectedFiles) {
  if (
    !data.config ||
    !path.isAbsolute(data.config.rootDir ?? "") ||
    !Array.isArray(data.suites) ||
    !Array.isArray(data.errors) ||
    !data.stats ||
    !["expected", "skipped", "unexpected", "flaky"].every(
      (key) => Number.isInteger(data.stats[key]) && data.stats[key] >= 0,
    )
  )
    throw new Error("Invalid native browser report");
  const files = new Set();
  const notCompleted = [];
  let cases = 0;
  const visit = (suite, titles = []) => {
    for (const spec of suite.specs ?? []) {
      const file = path
        .relative(root, path.resolve(data.config.rootDir, spec.file))
        .split(path.sep)
        .join("/");
      files.add(file);
      for (const test of spec.tests) {
        cases++;
        const last = test.results.at(-1);
        const intentionalSkip = test.expectedStatus === "skipped";
        if (
          (!last && !intentionalSkip) ||
          last?.status === "interrupted" ||
          (test.status === "skipped" && !intentionalSkip)
        )
          notCompleted.push({ file, title: [...titles, spec.title].join(" > ") });
      }
    }
    for (const child of suite.suites ?? []) visit(child, [...titles, child.title]);
  };
  for (const suite of data.suites) visit(suite);
  if (
    !cases ||
    cases !== data.stats.expected + data.stats.skipped + data.stats.unexpected + data.stats.flaky
  )
    throw new Error("Browser report has no reliable test inventory");
  return {
    stats: data.stats,
    errors: data.errors,
    files: [...files].sort(),
    missingFiles: selectedFiles.filter((file) => !files.has(file)),
    notCompleted,
  };
}

/** Every invocation acquires the existing lock and obtains fresh evidence. No success cache. */
export async function verifyWorkspace(root, options, services = {}) {
  const log = services.log ?? console.log;
  return withPackageLock(root, "workspace-checks", async () => {
    const started = performance.now();
    const fingerprint = services.fingerprint ?? verificationFingerprint;
    const before = fingerprint(root);
    const plan = await createVerificationPlan(root, options, services);
    printVerificationPlan(plan, log);
    if (options.dryRun) {
      if (before !== fingerprint(root))
        throw new Error("Verification inputs changed during discovery; rerun --dry-run");
      return { code: 0, plan };
    }
    const directory = path.join(root, ".scratch/verification", randomUUID());
    mkdirSync(directory, { recursive: true });
    const browserReportPath = path.join(directory, "browser.json");
    const report = {
      version: 1,
      head: plan.context.head,
      comparison: plan.context.comparison,
      paths: plan.context.paths,
      scope: plan.scope,
      reasons: plan.reasons,
      checks: plan.checks,
      skipped: plan.skipped,
      selectedTests: plan.selectedTests,
      browserSpecs: plan.browserSpecs,
      routes: plan.routes,
      discoveryMs: plan.discoveryMs ?? 0,
      status: "RUNNING",
      exitCode: 0,
      inputsChanged: false,
      durationMs: 0,
      steps: plan.steps.map((step) => ({
        ...step,
        environment: step.checks.includes("test:docs-layout")
          ? { ...step.environment, PLAYWRIGHT_JSON_OUTPUT_FILE: browserReportPath }
          : step.environment,
        status: "NOT_RUN",
        durationMs: 0,
        exitCode: null,
      })),
    };
    const reportPath = path.join(directory, "summary.json");
    const save = () => writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    save();
    const run = services.run ?? runPackageStep;
    try {
      if (before !== fingerprint(root))
        throw new Error("Verification inputs changed during discovery");
      for (const step of report.steps) {
        const stepStarted = performance.now();
        step.status = "RUNNING";
        save();
        log(`[verify] Run: ${step.checks.join(", ")} ${JSON.stringify(step.command)}`);
        try {
          step.exitCode = await run(root, step.command, [], step.environment);
          if (!Number.isInteger(step.exitCode) || step.exitCode < 0)
            throw new Error("Invalid check exit code");
          if (step.checks.includes("test:docs-layout")) {
            try {
              step.browserReportPath = browserReportPath;
              step.browserEvidence = verificationBrowserEvidence(
                root,
                JSON.parse(readFileSync(browserReportPath, "utf8")),
                plan.browserSpecs,
              );
              const evidence = step.browserEvidence;
              if (
                step.exitCode === 0 &&
                (evidence.errors.length ||
                  evidence.stats.unexpected ||
                  evidence.missingFiles.length ||
                  evidence.notCompleted.length)
              )
                throw new Error("Browser coverage is incomplete or contains failures");
              if (evidence.notCompleted.length || evidence.missingFiles.length)
                log(
                  `[verify] Browser not completed: ${evidence.notCompleted.length} cases; ${evidence.missingFiles.length} undiscovered files. Details: ${browserReportPath}`,
                );
            } catch (error) {
              step.browserEvidenceError = error.message;
              if (step.exitCode === 0) throw error;
              log(`[verify] Browser evidence unavailable: ${error.message}`);
            }
          }
          step.status = step.exitCode === 0 ? "PASS" : "FAIL";
        } catch (error) {
          step.exitCode = 1;
          step.status = "FAIL";
          step.error = error.message;
        }
        step.durationMs = Math.round(performance.now() - stepStarted);
        log(
          `[verify] ${step.status}: ${step.checks.join(", ")} ${step.durationMs}ms (exit ${step.exitCode})`,
        );
        report.exitCode = step.exitCode;
        save();
        if (step.exitCode !== 0) break;
        if (before !== fingerprint(root))
          throw new Error("Verification inputs changed while checks were running");
      }
    } catch (error) {
      report.error = error.message;
      report.exitCode ||= 1;
    } finally {
      try {
        report.inputsChanged = before !== fingerprint(root);
        if (report.inputsChanged) report.exitCode ||= 1;
      } catch (error) {
        report.error = error.message;
        report.exitCode ||= 1;
      }
      report.status = report.inputsChanged
        ? "INCOMPLETE"
        : report.exitCode
          ? "FAIL"
          : plan.steps.length
            ? "PASS"
            : "NO_CHANGES";
      report.durationMs = Math.round(performance.now() - started);
      save();
      log(`[verify] ${report.status}, total ${report.durationMs}ms; report: ${reportPath}`);
      const pending = report.steps.filter((step) => step.status === "NOT_RUN");
      if (pending.length)
        log(
          `[verify] Not completed: ${[...new Set(pending.flatMap((step) => step.checks))].join(", ")}`,
        );
      if (report.inputsChanged)
        log("[verify] Inputs changed; rerun verification to obtain fresh evidence.");
      if (
        report.exitCode &&
        report.steps.some(
          (step) => step.status === "FAIL" && step.checks.includes("docs:llm:check"),
        )
      ) {
        log(
          "[verify] Corpus check failed. Resolve capture errors; for confirmed drift: pnpm run docs:llm:generate, then pnpm run docs:llm:check",
        );
      }
      if (
        report.exitCode &&
        report.steps.some(
          (step) => step.status === "FAIL" && step.checks.includes("docs:readme:screenshots:check"),
        )
      ) {
        log(
          "[verify] Screenshot check failed. Resolve capture errors; for confirmed drift: pnpm run docs:readme:screenshots, then pnpm run docs:readme:screenshots:check",
        );
      }
    }
    return { code: report.exitCode, plan, report, reportPath };
  });
}
