import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build } from "vite";
import { pnpmCommand, runConsumerCommand } from "./lib/docs-package-consumer.mjs";
import {
  KNOWN_GAP_IDS,
  MEASUREMENT_IDS,
  compareBudgets,
  formatBudgetFailures,
  formatBudgetReport,
  loadBudgetFixture,
} from "./lib/package-budgets.mjs";

// M1-04: measure the real consumer cost of the published package, then hold it
// to tests/fixtures/package-budgets.json. Consumers resolve through package
// exports against a built package and never install anything.
// `--record` prints the measured baseline (thresholds are written by hand after
// review); `--package-root` measures an isolated built snapshot.
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const options = new Map();
const arguments_ = process.argv.slice(2);
for (let index = 0; index < arguments_.length; index += 1) {
  const key = arguments_[index];
  if (key === "--record") {
    assert.ok(!options.has(key), "Duplicate argument: --record");
    options.set(key, true);
    continue;
  }
  const value = arguments_[index + 1];
  assert.ok(["--package-root"].includes(key) && value && !options.has(key), `Invalid argument: ${key}`);
  options.set(key, value);
  index += 1;
}
const recordMode = options.has("--record");
const packageRoot = options.has("--package-root") ? path.resolve(String(options.get("--package-root"))) : repository;
const packageJson = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
const packageName = packageJson.name;
assert.ok(existsSync(path.join(packageRoot, packageJson.module)), "Run pnpm run build:lib before measuring package budgets");
assert.ok(existsSync(path.join(packageRoot, packageJson.exports["./styles.css"])), "Published stylesheet is missing");

const stamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
const evidence = path.join(repository, ".scratch", "package-budgets", `${stamp}${recordMode ? "-record" : ""}`);
mkdirSync(evidence, { recursive: true });
const requireFromPackage = createRequire(path.join(packageRoot, "package.json"));

// Each sample imports exactly one entry point. CSS is never imported here so a
// subpath measurement can only ever be JS: stylesheet and font weight are
// measured once, from the published files, and cannot be credited to a subpath.
const samples = [
  { id: "root.button", specifier: packageName, imports: "Button", tree: "h(Button, null, 'Consumer button')" },
  { id: "subpath.charts", specifier: `${packageName}/charts`, imports: "AreaChart", tree: "h(AreaChart, {data: [{label: 'a', values: {value: 1}}]})" },
  { id: "subpath.motion", specifier: `${packageName}/motion`, imports: "MotionProvider", tree: "h(MotionProvider, null, 'Consumer motion')" },
  { id: "subpath.device", specifier: `${packageName}/device`, imports: "Device", tree: "h(Device, null, 'Consumer device')" },
  { id: "subpath.code", specifier: `${packageName}/code`, imports: "CodeBlock", tree: "h(CodeBlock, null, 'const value = 1')" },
];

function emittedJs(directory) {
  let total = 0;
  for (const name of readdirSync(directory)) {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) total += emittedJs(file);
    else if (name.endsWith(".js")) total += gzipSync(readFileSync(file), { level: 9 }).length;
  }
  return total;
}

function bundlerSource(directory) {
  let source = "";
  for (const name of readdirSync(directory)) {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) source += bundlerSource(file);
    else if (name.endsWith(".js")) source += readFileSync(file, "utf8");
  }
  return source;
}

const measured = {};
for (const sample of samples) {
  const consumer = path.join(evidence, sample.id);
  const modules = path.join(consumer, "node_modules");
  mkdirSync(path.join(modules, "@hustradio"), { recursive: true });
  writeFileSync(path.join(consumer, "package.json"), JSON.stringify({ name: `unitary-budget-${sample.id.replaceAll(".", "-")}`, private: true, type: "module" }));
  // Resolve through package exports: the junction points at the built package.
  symlinkSync(packageRoot, path.join(modules, "@hustradio", "unitary-ui"), "junction");
  for (const dependency of ["react", "react-dom"]) {
    const root = path.dirname(requireFromPackage.resolve(`${dependency}/package.json`));
    symlinkSync(root, path.join(modules, dependency), "junction");
  }
  writeFileSync(path.join(consumer, "index.html"), '<!doctype html><html><body><div id="root"></div><script type="module" src="/main.js"></script></body></html>');
  writeFileSync(path.join(consumer, "main.js"), `
import {createElement as h} from 'react';
import {createRoot} from 'react-dom/client';
import {${sample.imports}} from '${sample.specifier}';
createRoot(document.getElementById('root')).render(${sample.tree});
`);
  await build({
    configFile: false,
    root: consumer,
    logLevel: "error",
    build: { outDir: path.join(consumer, "dist"), sourcemap: false, minify: true, chunkSizeWarningLimit: 4096 },
  });
  const id = sample.id === "root.button" ? "root.button.jsGzip" : `${sample.id}.jsGzip`;
  measured[id] = emittedJs(path.join(consumer, "dist"));
  if (sample.id === "root.button") {
    // Diagnostic only: the absence of heavy entry points is a known gap this
    // contract records, not one it can enforce yet (see knownGaps).
    const source = bundlerSource(path.join(consumer, "dist"));
    const markers = { recharts: "recharts", areaChart: "AreaChart", hituPlayer: "HituPlayer", prism: "Prism" };
    measured["root.button.diagnosticMarkers"] = Object.fromEntries(
      Object.entries(markers).map(([name, marker]) => [name, source.split(marker).length - 1]),
    );
  }
}

const stylesheet = readFileSync(path.join(packageRoot, packageJson.exports["./styles.css"]));
measured["css.published.gzip"] = gzipSync(stylesheet, { level: 9 }).length;

function bytes(directory) {
  let total = 0;
  for (const name of readdirSync(directory)) {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) total += bytes(file);
    else total += statSync(file).size;
  }
  return total;
}
measured["fonts.published.total"] = bytes(path.join(packageRoot, "dist", "fonts"));

const tarball = path.join(evidence, "package.tgz");
const pnpm = pnpmCommand();
await runConsumerCommand(pnpm[0], [...pnpm.slice(1), "--config.ignore-scripts=true", "pack", "--json", "--out", tarball], packageRoot);
assert.ok(existsSync(tarball), "pnpm pack did not produce a tarball");
measured["tarball.published.total"] = statSync(tarball).size;

/** @type {Record<string, number>} */
const budgetValues = Object.fromEntries(MEASUREMENT_IDS.map(id => [id, measured[id]]));
writeFileSync(path.join(evidence, "measured.json"), `${JSON.stringify({ package: `${packageName}@${packageJson.version}`, packageRoot, measured, budgets: budgetValues }, null, 2)}\n`);

if (recordMode) {
  console.log(formatBudgetReport(
    MEASUREMENT_IDS.map(id => ({ id, actual: budgetValues[id], baseline: budgetValues[id], limit: "—", ok: true })),
  ));
  console.log(JSON.stringify({ budgets: budgetValues, diagnosticMarkers: measured["root.button.diagnosticMarkers"] }, null, 2));
  console.log(`Evidence: ${path.join(evidence, "measured.json")}`);
  rmSync(tarball, { force: true });
  process.exit(0);
}

const fixture = loadBudgetFixture(repository);
const { rows, failures } = compareBudgets(fixture, budgetValues);
console.log(formatBudgetReport(rows));
const markers = measured["root.button.diagnosticMarkers"];
console.log(`\nButton-only diagnostic markers: ${Object.entries(markers).map(([name, count]) => `${name}=${count}`).join(" ")}`);
for (const gap of fixture.knownGaps.filter(entry => entry.status === "deferred")) {
  console.log(`Known gap (${gap.task}): ${gap.id} — ${gap.detail}`);
}
console.log(`Known gap ids: ${KNOWN_GAP_IDS.join(", ")}`);
console.log(`Evidence: ${path.join(evidence, "measured.json")}`);
if (failures.length > 0) {
  console.error(`\n${formatBudgetFailures(failures)}`);
  process.exit(1);
}
console.log("Package budgets passed.");
