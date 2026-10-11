import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export const PACKAGE_NAME = "@hustradio/unitary-ui";
export const REGISTRY = "https://registry.npmjs.org/";

const requiredDocuments = ["LICENSE", "LICENSE.zh-CN.md", "OFL-1.1.txt",
  "CREDITS.md", "CREDITS.en.md", "CHANGELOG.md", "CHANGELOG.en.md",
  "THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.en.md", "README.md", "README.en.md"];

export function packageIntegrity(buffer) {
  return `sha512-${createHash("sha512").update(buffer).digest("base64")}`;
}

export function validatePackageFiles(files, manifest) {
  assert.equal(manifest.name, PACKAGE_NAME);
  assert.deepEqual(manifest.publishConfig, { access: "public", registry: REGISTRY });
  const paths = new Set(files.map(file => typeof file === "string" ? file : file.path));
  for (const file of paths) {
    assert.ok(!file.includes("\\") && !file.split("/").includes("..") && !file.startsWith("/"), `Unsafe package path: ${file}`);
    assert.ok(file.startsWith("dist/") || file === "package.json" || requiredDocuments.includes(file), `Unexpected package file: ${file}`);
    assert.ok(!/\.map$|^dist\/(assets\/|index\.html$|demo|gallery-|prefetch-preview)|\/\.scratch\//.test(file), `Application/scratch output: ${file}`);
  }
  const targets = [manifest.main, manifest.module, manifest.types];
  const visit = value => {
    if (typeof value === "string") targets.push(value);
    else for (const child of Object.values(value ?? {})) visit(child);
  };
  visit(manifest.exports);
  for (const file of [...requiredDocuments, ...targets.map(target => target.replace(/^\.\//, ""))]) {
    assert.ok(paths.has(file), `Missing package file: ${file}`);
  }
  for (const file of ["CREDITS.md", "CREDITS.en.md", "CHANGELOG.md", "CHANGELOG.en.md"])
    assert.ok(manifest.files.includes(file), `Missing files allowlist entry: ${file}`);
  return [...paths].sort();
}

/** Check actual installed files, rather than resolving through repository aliases. */
export function validateInstalledPackage(directory, expectedFonts) {
  const manifest = JSON.parse(readFileSync(path.join(directory, "package.json"), "utf8"));
  function checkRelative(owner, reference) {
    assert.ok(!reference.startsWith("@/"), `Unresolved source alias in ${owner}`);
    if (!reference.startsWith(".")) return;
    const target = path.resolve(path.dirname(owner), reference);
    assert.ok(target.startsWith(directory + path.sep), `Reference escapes package: ${reference}`);
    const candidates = [target];
    if (owner.endsWith(".d.ts")) {
      candidates.push(target.replace(/\.js$/, "") + ".d.ts", path.join(target, "index.d.ts"));
    }
    assert.ok(candidates.some(existsSync), `Missing reference in ${path.relative(directory, owner)}: ${reference}`);
  }
  const scan = current => {
    for (const item of readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, item.name);
      if (item.isDirectory()) scan(file);
      else if (/\.(?:js|cjs|d\.ts)$/.test(item.name)) {
        const text = readFileSync(file, "utf8");
        for (const match of text.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)["']([^"']+)["']/g)) checkRelative(file, match[1]);
        for (const match of text.matchAll(/<reference\s+path="([^"]+)"/g)) checkRelative(file, match[1]);
      }
    }
  };
  scan(path.join(directory, "dist"));
  const css = readFileSync(path.join(directory, manifest.exports["./styles.css"]), "utf8");
  assert.ok(!/url\(["']?\/fonts\//.test(css), "CSS contains absolute font URLs");
  for (const match of css.matchAll(/url\(["']?(\.\/fonts\/[^)'"\s]+)["']?\)/g)) {
    assert.ok(existsSync(path.join(directory, "dist", match[1])), `Missing CSS font: ${match[1]}`);
  }
  assert.deepEqual(readdirSync(path.join(directory, "dist/fonts")).sort(), [...expectedFonts].sort(), "Font contents differ from canonical assets");
  for (const name of ["THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.en.md"]) {
    const notice = readFileSync(path.join(directory, name), "utf8");
    for (const family of ["Maple Mono", "OPPO Sans", "HarmonyOS Sans", "Material Symbols Rounded"]) assert.ok(notice.includes(family), `${name} omits ${family}`);
    assert.ok(notice.includes("Apache License"), `${name} omits Apache license text`);
  }
}
