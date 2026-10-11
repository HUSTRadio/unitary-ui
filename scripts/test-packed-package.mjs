import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { packageIntegrity, validateInstalledPackage, validatePackageFiles } from "./lib/package-artifact.mjs";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const output = path.join(root, ".scratch/npm-release");
mkdirSync(output, { recursive: true });
const tempParent = realpathSync(os.tmpdir());
const consumer = mkdtempSync(path.join(tempParent, "unitary-package-consumer-"));
function pnpmCommand() {
  const executable = process.env.npm_execpath;
  if (executable) return executable.endsWith(".exe") ? [executable] : [process.execPath, executable];
  // Native executables only on Windows; never execute a shell shim.
  for (const directory of (process.env.PATH ?? "").split(path.delimiter)) {
    const candidate = path.join(directory, process.platform === "win32" ? "pnpm.exe" : "pnpm");
    try { return [realpathSync(candidate)]; } catch { /* Try the next PATH entry. */ }
  }
  throw new Error("Cannot locate pnpm; run through pnpm run test:package");
}
const pnpm = pnpmCommand();
function run(command, args, cwd, environment = {}) {
  const result = spawnSync(command, args, {
    cwd, env: { ...process.env, ...environment }, encoding: "utf8", timeout: 300_000, maxBuffer: 16 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error(`Package consumer command failed (${result.status}): ${result.error?.message ?? ""}\n${result.stdout ?? ""}\n${result.stderr ?? ""}`);
  return result.stdout;
}
try {
  const filename = `hustradio-unitary-ui-${manifest.version}.tgz`;
  const tarball = path.join(output, filename);
  const packed = JSON.parse(run(pnpm[0], [...pnpm.slice(1), "--config.ignore-scripts=true", "pack", "--json", "--out", tarball], root));
  const files = validatePackageFiles(packed.files, manifest);
  const versionOf = name => JSON.parse(readFileSync(path.join(root, "node_modules", name, "package.json"), "utf8")).version;
  writeFileSync(path.join(consumer, "package.json"), JSON.stringify({
    private: true, type: "module", dependencies: {
      [manifest.name]: `file:${tarball.replaceAll("\\", "/")}`,
      react: versionOf("react"), "react-dom": versionOf("react-dom"),
      "@types/react": versionOf("@types/react"), "@types/react-dom": versionOf("@types/react-dom"),
    },
  }, null, 2));
  console.log("Installing the tarball into an independent consumer...");
  run(pnpm[0], [...pnpm.slice(1), "install", "--ignore-workspace", "--ignore-scripts", "--prefer-offline", "--config.manage-package-manager-versions=false"], consumer);
  const installed = path.join(consumer, "node_modules", manifest.name);
  validateInstalledPackage(installed, readdirSync(path.join(root, "public/fonts")));
  writeFileSync(path.join(consumer, "consumer.tsx"), `
import { Button, ThemeProvider, motion, HituPlayer, HituBox, type ButtonProps, type HituPlayerProps } from '${manifest.name}';
import '${manifest.name}/styles.css';
const button: ButtonProps = {children: 'Consumer'};
const hitu: HituPlayerProps = {width: 128, height: 128, shapes: [{source: HituBox}]};
export const app = <ThemeProvider><Button {...button}/><motion.div/><HituPlayer {...hitu}/></ThemeProvider>;
`);
  writeFileSync(path.join(consumer, "tsconfig.json"), JSON.stringify({ compilerOptions: {
    target: "ES2023", module: "ESNext", moduleResolution: "bundler", jsx: "react-jsx", strict: true,
    noEmit: true, skipLibCheck: false, types: ["react", "react-dom"],
  }, include: ["consumer.tsx"] }));
  run(process.execPath, [path.join(root, "node_modules/typescript/bin/tsc"), "-p", path.join(consumer, "tsconfig.json")], consumer);
  console.log(run(process.execPath, ["--test", path.join(root, "scripts/test-package-imports.mjs")], root, { UNITARY_PACKAGE_CONSUMER_ROOT: consumer }));
  const bytes = readFileSync(tarball);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const summary = { name: manifest.name, version: manifest.version, filename, integrity: packageIntegrity(bytes), sha256, files };
  assert.equal(JSON.parse(readFileSync(path.join(installed, "package.json"), "utf8")).version, manifest.version);
  writeFileSync(path.join(output, "files.json"), JSON.stringify(files, null, 2) + "\n");
  writeFileSync(path.join(output, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
  writeFileSync(path.join(output, "SHA256SUMS"), `${sha256}  ${filename}\n`);
  console.log(`Validated artifact: .scratch/npm-release/${filename}`);
} finally {
  // Remove only the directory returned by mkdtemp in the canonical temp parent.
  assert.equal(path.dirname(consumer), tempParent);
  assert.ok(path.basename(consumer).startsWith("unitary-package-consumer-"));
  rmSync(consumer, { recursive: true, force: true });
}
