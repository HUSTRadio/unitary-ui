import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { build } from "vite";

// Compare real package-root consumer builds. Run after build:lib; all fixtures
// and emitted artifacts are local evidence under the ignored .scratch folder.
// An isolated built snapshot can use --package-root <path> --sample button.
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const options = new Map();
const arguments_ = process.argv.slice(2);
for (let index = 0; index < arguments_.length; index += 2) {
  const key = arguments_[index];
  const value = arguments_[index + 1];
  assert.ok(["--package-root", "--sample"].includes(key) && value && !options.has(key), `Invalid argument: ${key}`);
  options.set(key, value);
}
const packageRoot = options.has("--package-root") ? path.resolve(options.get("--package-root")) : repository;
const sampleSelection = options.get("--sample") ?? "all";
assert.ok(["all", "button"].includes(sampleSelection), "--sample accepts all or button");
const packageName = "@hustradio/unitary-ui";
const packageJson = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
assert.equal(packageJson.name, packageName);
assert.ok(existsSync(path.join(packageRoot, packageJson.module)), "Run pnpm run build:lib before measuring bundles");
const outputRoot = path.join(repository, ".scratch", "motion-bundles", new Date().toISOString().replaceAll(/[:.]/g, "-"));
mkdirSync(outputRoot, { recursive: true });
const requireFromPackage = createRequire(path.join(packageRoot, "package.json"));

const samples = {
  button: {
    imports: "Button",
    tree: "h(Button, null, 'Consumer button')",
  },
  motion: {
    imports: "Button, MotionProvider, motion, AnimatePresence, useMotionTransition",
    setup: "function Scene() { const transition = useMotionTransition('state'); return h(AnimatePresence, null, h(motion.div, {initial: {opacity: 0}, animate: {opacity: 1}, transition}, h(Button, null, 'Consumer button'))); }",
    tree: "h(MotionProvider, null, h(Scene))",
  },
  hitu: {
    imports: "Button, HituPlayer, HituBox, HituFile",
    setup: "const shapes = [{source: HituFile, x: 160, y: 32, scaleX: 0.2, scaleY: 0.2, originX: 0, originY: 0, frames: [{frame: 0, y: 32}, {frame: 60, y: 96}, {frame: 119, y: 32}]}, {source: HituBox, x: 96, y: 160, scaleX: 0.32, scaleY: 0.32, originX: 0, originY: 0}];",
    tree: "h('div', null, h(Button, null, 'Consumer button'), h(HituPlayer, {width: 512, height: 512, frames: 120, defaultPlay: true, shapes}))",
  },
  combined: {
    imports: "Button, MotionProvider, motion, AnimatePresence, useMotionTransition, HituPlayer, HituBox, HituFile",
    setup: "const shapes = [{source: HituFile, x: 160, y: 32, scaleX: 0.2, scaleY: 0.2, originX: 0, originY: 0, frames: [{frame: 0, y: 32}, {frame: 60, y: 96}, {frame: 119, y: 32}]}, {source: HituBox, x: 96, y: 160, scaleX: 0.32, scaleY: 0.32, originX: 0, originY: 0}]; function Scene() { const transition = useMotionTransition('state'); return h(AnimatePresence, null, h(motion.div, {initial: {opacity: 0}, animate: {opacity: 1}, transition}, h(Button, null, 'Consumer button'), h(HituPlayer, {width: 512, height: 512, frames: 120, defaultPlay: true, shapes}))); }",
    tree: "h(MotionProvider, null, h(Scene))",
  },
};

function emittedSizes(directory) {
  const totals = { js: 0, css: 0, jsGzip: 0, cssGzip: 0 };
  for (const name of readdirSync(directory)) {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) {
      const nested = emittedSizes(file);
      for (const key of Object.keys(totals)) totals[key] += nested[key];
    } else if (name.endsWith(".js") || name.endsWith(".css")) {
      const kind = name.endsWith(".js") ? "js" : "css";
      const data = readFileSync(file);
      totals[kind] += data.length;
      totals[`${kind}Gzip`] += gzipSync(data, { level: 9 }).length;
    }
  }
  return totals;
}

const results = {};
for (const [name, sample] of Object.entries(samples)) {
  if (sampleSelection !== "all" && name !== sampleSelection) continue;
  const consumer = path.join(outputRoot, name);
  const modules = path.join(consumer, "node_modules");
  mkdirSync(path.join(modules, "@hustradio"), { recursive: true });
  writeFileSync(path.join(consumer, "package.json"), JSON.stringify({name: `unitary-motion-measure-${name}`, private: true, type: "module"}));
  // Resolve the library through package exports, without source aliases. The
  // link points at the already built package and never installs dependencies.
  symlinkSync(packageRoot, path.join(modules, "@hustradio", "unitary-ui"), "junction");
  for (const dependency of ["react", "react-dom"]) {
    const root = path.dirname(requireFromPackage.resolve(`${dependency}/package.json`));
    symlinkSync(root, path.join(modules, dependency), "junction");
  }
  writeFileSync(path.join(consumer, "index.html"), '<!doctype html><html><body><div id="root"></div><script type="module" src="/main.js"></script></body></html>');
  writeFileSync(path.join(consumer, "main.js"), `
import {createElement as h} from 'react';
import {createRoot} from 'react-dom/client';
import {${sample.imports}} from '${packageName}';
import '${packageName}/styles.css';
${sample.setup ?? ""}
createRoot(document.getElementById('root')).render(${sample.tree});
`);
  await build({
    configFile: false,
    root: consumer,
    logLevel: "warn",
    build: {outDir: path.join(consumer, "dist"), sourcemap: false, minify: true},
  });
  results[name] = emittedSizes(path.join(consumer, "dist"));
}

const baseline = results.button;
const report = {
  package: `${packageName}@${packageJson.version}`,
  packageRoot,
  motionVersion: packageJson.dependencies.motion ?? null,
  gzip: "Sum of independently compressed emitted JS/CSS files, including lazy chunks",
  builds: Object.fromEntries(Object.entries(results).map(([name, values]) => [name, {
    ...values,
    incrementalJsGzip: values.jsGzip - baseline.jsGzip,
    incrementalCssGzip: values.cssGzip - baseline.cssGzip,
  }])),
};
writeFileSync(path.join(outputRoot, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.table(Object.entries(report.builds).map(([sample, values]) => ({sample, ...values})));
console.log(`Evidence: ${path.join(outputRoot, "report.json")}`);
