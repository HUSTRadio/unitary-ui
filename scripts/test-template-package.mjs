import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  createDocsConsumerLock,
  pnpmCommand,
  runConsumerCommand,
} from "./lib/docs-package-consumer.mjs";
import {
  packageIntegrity,
  validateInstalledPackage,
  validatePackageFiles,
} from "./lib/package-artifact.mjs";
import { templateApplications } from "./lib/templates.mjs";
import { verificationBrowserEvidence } from "./lib/verification.mjs";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, ".scratch/template-package");
mkdirSync(output, { recursive: true });
const library = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const pnpm = pnpmCommand();
const tarball = path.join(output, "unitary-ui.tgz");
const packed = JSON.parse(
  await runConsumerCommand(
    pnpm[0],
    [...pnpm.slice(1), "--config.ignore-scripts=true", "pack", "--json", "--out", tarball],
    root,
  ),
);
validatePackageFiles(packed.files, library);
const bytes = readFileSync(tarball);
const tempParent = realpathSync(os.tmpdir());
const consumerRoot = mkdtempSync(path.join(tempParent, "unitary-template-consumers-"));
const evidence = [];
try {
  for (const app of templateApplications(root)) {
    const directory = path.join(consumerRoot, app.id);
    cpSync(app.directory, directory, {
      recursive: true,
      filter: (source) => {
        assert.ok(
          !lstatSync(source).isSymbolicLink() || path.basename(source) === "node_modules",
          `Linked template source: ${source}`,
        );
        return ![
          "node_modules",
          "dist",
          "vite.source.config.ts",
          "tsconfig.source.json",
          "source-reference.css",
        ].includes(path.basename(source));
      },
    });
    const consumer = createDocsConsumerLock(
      readFileSync(path.join(root, "pnpm-lock.yaml"), "utf8"),
      app.manifest,
      library,
      packageIntegrity(bytes),
      "tarball",
      { name: app.manifest.name, importer: `templates/${app.id}` },
    );
    consumer.manifest.scripts = Object.fromEntries(
      Object.entries(app.manifest.scripts).filter(([name]) => !name.endsWith(":source")),
    );
    writeFileSync(
      path.join(directory, "package.json"),
      JSON.stringify(consumer.manifest, null, 2) + "\n",
    );
    writeFileSync(path.join(directory, "pnpm-lock.yaml"), consumer.text);
    writeFileSync(path.join(directory, "unitary-ui.tgz"), bytes);
    console.log(`[templates:package] Install and build isolated ${app.id}`);
    await runConsumerCommand(
      pnpm[0],
      [
        ...pnpm.slice(1),
        "install",
        "--frozen-lockfile",
        "--ignore-workspace",
        "--ignore-scripts",
        "--prefer-offline",
        "--config.manage-package-manager-versions=false",
      ],
      directory,
    );
    const installed = realpathSync(path.join(directory, "node_modules", library.name));
    assert.ok(
      installed.startsWith(realpathSync(directory) + path.sep),
      "Template resolved a package outside its consumer",
    );
    validateInstalledPackage(installed, readdirSync(path.join(root, "public/fonts")));
    assert.equal(
      readFileSync(path.join(directory, "pnpm-lock.yaml"), "utf8"),
      consumer.text,
      "Frozen installation changed the template lock",
    );
    await runConsumerCommand(pnpm[0], [...pnpm.slice(1), "run", "build"], directory);
    assert.ok(
      existsSync(path.join(directory, "dist/index.html")),
      "Template build has no HTML output",
    );
    evidence.push({
      template: app.id,
      types: "passed",
      build: "passed",
      libraryIntegrity: packageIntegrity(bytes),
    });
  }
  // Exercise the copied, production-built applications with the same browser contracts.
  await runConsumerCommand(
    process.execPath,
    [
      path.join(root, "node_modules/@playwright/test/cli.js"),
      "test",
      "-c",
      "playwright.templates.config.ts",
      "--grep",
      "portable package",
      "--reporter=list,json",
    ],
    root,
    {
      UNITARY_TEMPLATE_ARTIFACTS: consumerRoot,
      PLAYWRIGHT_JSON_OUTPUT_FILE: path.join(output, "browser.json"),
    },
  );
  const browser = verificationBrowserEvidence(
    root,
    JSON.parse(readFileSync(path.join(output, "browser.json"), "utf8")),
    evidence.map((app) => `tests/e2e/templates/${app.template}.spec.ts`),
  );
  assert.equal(
    browser.stats.expected + browser.stats.flaky,
    evidence.length,
    "Missing copied template browser cases",
  );
  assert.equal(
    browser.stats.unexpected + browser.stats.skipped,
    0,
    "Failed or skipped copied template browser cases",
  );
  assert.deepEqual(
    [...browser.errors, ...browser.missingFiles, ...browser.notCompleted],
    [],
    "Incomplete copied template browser evidence",
  );
  writeFileSync(
    path.join(output, "summary.json"),
    JSON.stringify({ templates: evidence, browser: "passed" }, null, 2) + "\n",
  );
} finally {
  assert.equal(path.dirname(consumerRoot), tempParent);
  assert.ok(path.basename(consumerRoot).startsWith("unitary-template-consumers-"));
  rmSync(consumerRoot, { recursive: true, force: true });
}
