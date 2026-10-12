import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { packageIntegrity, validateInstalledPackage, validatePackageFiles } from "./lib/package-artifact.mjs";
import { buildDocsConsumer, checkDocsConsumer, checkoutCommit, pnpmCommand, runConsumerCommand } from "./lib/docs-package-consumer.mjs";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const output = path.join(root, ".scratch/npm-release");
mkdirSync(output, { recursive: true });
const tempParent = realpathSync(os.tmpdir());
const consumer = mkdtempSync(path.join(tempParent, "unitary-package-consumer-"));
const docsConsumer = mkdtempSync(path.join(tempParent, "unitary-docs-consumer-"));
const pnpm = pnpmCommand();
try {
  const filename = `hustradio-unitary-ui-${manifest.version}.tgz`;
  const tarball = path.join(output, filename);
  const packed = JSON.parse(await runConsumerCommand(pnpm[0], [...pnpm.slice(1), "--config.ignore-scripts=true", "pack", "--json", "--out", tarball], root));
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
  await runConsumerCommand(pnpm[0], [...pnpm.slice(1), "install", "--ignore-workspace", "--ignore-scripts", "--prefer-offline", "--config.manage-package-manager-versions=false"], consumer);
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
  await runConsumerCommand(process.execPath, [path.join(root, "node_modules/typescript/bin/tsc"), "-p", path.join(consumer, "tsconfig.json")], consumer);
  console.log(await runConsumerCommand(process.execPath, ["--test", path.join(root, "scripts/test-package-imports.mjs")], root, { UNITARY_PACKAGE_CONSUMER_ROOT: consumer }));
  const bytes = readFileSync(tarball);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  console.log("Building the complete docs application in an independent, frozen consumer...");
  const docsEvidence = path.join(output, "docs-consumer");
  const { evidence } = await buildDocsConsumer({ root, consumerRoot: docsConsumer, libraryManifest: manifest, bytes, evidenceDirectory: docsEvidence });
  evidence.checks = await checkDocsConsumer(root, docsConsumer, docsEvidence);
  writeFileSync(path.join(docsEvidence, "build.json"), JSON.stringify(evidence, null, 2) + "\n");
  const summary = { name: manifest.name, version: manifest.version, filename, integrity: packageIntegrity(bytes), sha256, files, commit: checkoutCommit(root), docs: evidence };
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
  assert.equal(path.dirname(docsConsumer), tempParent);
  assert.ok(path.basename(docsConsumer).startsWith("unitary-docs-consumer-"));
  rmSync(docsConsumer, { recursive: true, force: true });
}
