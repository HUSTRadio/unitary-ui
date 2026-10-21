import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { runPackageStep } from "./package-command.mjs";

const projects = ["chromium", "firefox", "webkit"];

function inventory(report) {
  if (!Array.isArray(report?.suites) || !Array.isArray(report.config?.projects)
    || !Array.isArray(report.errors)) throw Error("Invalid Playwright motion report");
  const names = report.config.projects.map(project => project.name).sort();
  if (JSON.stringify(names) !== JSON.stringify(projects)) throw Error("Motion report must contain all three browser projects");
  const cases = new Map();
  const visit = suite => {
    for (const spec of suite.specs ?? []) for (const test of spec.tests ?? []) {
      if (typeof spec.id !== "string" || !projects.includes(test.projectName)) throw Error("Invalid motion test identity");
      const key = `${test.projectName}:${spec.id}`;
      if (cases.has(key)) throw Error(`Duplicate motion test: ${key}`);
      cases.set(key, test);
    }
    for (const child of suite.suites ?? []) visit(child);
  };
  report.suites.forEach(visit);
  if (projects.some(name => ![...cases.keys()].some(key => key.startsWith(`${name}:`))))
    throw Error("Motion report is missing a browser's test inventory");
  return cases;
}

/** Compare a fresh native --list inventory with native execution evidence. */
export function motionBrowserEvidence(expected, actual) {
  const planned = inventory(expected), executed = inventory(actual);
  const errors = [...expected.errors, ...actual.errors].map(error => error.message ?? String(error));
  for (const key of planned.keys()) {
    const test = executed.get(key), result = test?.results?.at(-1);
    if (!test) errors.push(`Missing test: ${key}`);
    else if (test.expectedStatus !== "passed" || test.status !== "expected"
      || result?.status !== "passed" || test.results.length !== 1 || result.retry !== 0)
      errors.push(`Unstable or incomplete test: ${key} (${test.status ?? result?.status ?? "not run"})`);
  }
  for (const key of executed.keys()) if (!planned.has(key)) errors.push(`Unexpected test: ${key}`);
  const stats = actual.stats;
  if (!stats || stats.expected !== planned.size || ["skipped", "unexpected", "flaky"].some(key => stats[key] !== 0))
    errors.push("Motion statistics do not prove a complete, first-attempt pass");
  return { passed: errors.length === 0, projects: Object.fromEntries(projects.map(name =>
    [name, [...planned.keys()].filter(key => key.startsWith(`${name}:`)).length])), errors };
}

export async function runMotionBrowsers(root, services = {}) {
  const parent = path.join(root, ".scratch/motion-browsers");
  mkdirSync(parent, { recursive: true });
  const output = mkdtempSync(path.join(parent, "run-"));
  const run = services.run ?? runPackageStep;
  const read = services.read ?? (file => JSON.parse(readFileSync(file, "utf8")));
  const snapshot = services.snapshot ?? ((source, target) => {
    cpSync(source, target, { recursive: true });
    return createHash("sha256").update(readFileSync(path.join(target, ".vite/manifest.json"))).digest("hex");
  });
  const environment = {
    UNITARY_DOCS_ARTIFACT: path.join(output, "artifact"),
    UNITARY_MOTION_OUTPUT: output,
  };
  const steps = [
    { name: "types", command: ["bin", "typescript", "tsc", "-p", "tsconfig.motion-tests.json"] },
    { name: "build", command: ["script", "build:docs"], env: { UNITARY_DOCS_TEST_FIXTURES: "1" } },
    { name: "discover", command: ["bin", "@playwright/test", "playwright", "test", "-c", "playwright.motion.config.ts", "--list", "--reporter=json"],
      env: { ...environment, PLAYWRIGHT_JSON_OUTPUT_FILE: path.join(output, "expected.json") } },
    { name: "browser", command: ["bin", "@playwright/test", "playwright", "test", "-c", "playwright.motion.config.ts"], env: environment },
  ];
  const summary = { artifact: path.relative(root, environment.UNITARY_DOCS_ARTIFACT), manifestSha256: null, steps: [], evidence: null, error: null };
  let code = 0;
  try {
    for (const step of steps) {
      code = await run(root, step.command, [], step.env ?? {});
      summary.steps.push({ name: step.name, exit: code });
      if (code !== 0) break;
      if (step.name === "build") summary.manifestSha256 = snapshot(path.join(root, "docs/dist"), environment.UNITARY_DOCS_ARTIFACT);
      if (step.name === "discover") {
        const expected = read(path.join(output, "expected.json"));
        inventory(expected);
        if (expected.errors.length) throw Error("Motion discovery contains errors");
      }
    }
    if (summary.steps.at(-1)?.name === "browser") {
      summary.evidence = motionBrowserEvidence(read(path.join(output, "expected.json")), read(path.join(output, "results.json")));
      if (!summary.evidence.passed) code ||= 1;
    }
  } catch (error) {
    summary.error = error.message;
    code ||= 1;
  }
  writeFileSync(path.join(output, "summary.json"), `${JSON.stringify({ ...summary, exit: code }, null, 2)}\n`);
  console.log(`[motion-browsers] Evidence: ${path.relative(root, output)}`);
  if (summary.error) console.error(`[motion-browsers] ${summary.error}`);
  for (const error of summary.evidence?.errors ?? []) console.error(`[motion-browsers] ${error}`);
  return code;
}
