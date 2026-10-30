// Post-build:
// 1. 把 dist CSS 里的 /fonts/ 绝对路径改为相对路径（npm 包消费场景）
// 2. 删除 demo 演示资源（不属于库包）
import { readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { copyTailwindReference } from "./copy-tailwind-reference.mjs";

const distDir = join(import.meta.dirname, "../dist");

// 1. CSS 字体 URL 相对化
const cssPath = join(distDir, "unitary-ui.css");
let css = readFileSync(cssPath, "utf8");
const before = (css.match(/url\(\/fonts\//g) || []).length;
css = css.replaceAll("url(/fonts/", "url(./fonts/");
writeFileSync(cssPath, css);
console.log(`css font urls rewritten: ${before} absolute → relative ./fonts/`);

// 2. 删除 demo / app build / sourcemap 资源
for (const f of ["demo.mp4", "demo-poster.png", "gallery-coast.svg", "gallery-desert.svg", "gallery-forest.svg", "prefetch-preview.json", "index.html", "assets"]) {
  const p = join(distDir, f);
  try {
    rmSync(p, { recursive: true, force: true });
    console.log(`removed ${f}`);
  } catch {
    // 不存在则忽略
  }
}

for (const file of readdirSync(distDir)) {
  if (file.endsWith(".map")) rmSync(join(distDir, file));
}

// 3. 从 index.d.ts 移除 CSS side-effect import（消费端无 CSS 模块类型）
//    并注入三斜杠引用指向 ambient CSS 声明
const dtsPath = join(distDir, "types/lib/index.d.ts");
try {
  let dts = readFileSync(dtsPath, "utf8");
  const before = dts.includes('import "../styles/index.css"');
  dts = dts.replace('import "../styles/index.css";\n', "");
  if (dts.includes('import "../styles/index.css"')) {
    // 保留唯一出现次数，确保删除
    dts = dts.split('import "../styles/index.css";').join("");
  }
  // 注入 reference，让消费端解析 *.css / react-mockframe css
  if (!dts.startsWith("/// <reference")) {
    dts = '/// <reference path="../types/css.d.ts" />\n' + dts;
  }
  writeFileSync(dtsPath, dts);
  console.log(
    before
      ? "index.d.ts: css side-effect import removed + reference injected"
      : "index.d.ts: no css import (clean)",
  );
} catch {
  console.log("index.d.ts not found, skipping css import removal");
}

// 4. 复制 ambient CSS 声明到 dist/types（供消费端解析 *.css / react-mockframe css）
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
const cssTypesDir = join(distDir, "types/types");
try {
  mkdirSync(cssTypesDir, { recursive: true });
  const srcCss = join(import.meta.dirname, "../src/types/css.d.ts");
  if (existsSync(srcCss)) {
    copyFileSync(srcCss, join(cssTypesDir, "css.d.ts"));
    console.log("css.d.ts ambient declaration copied to dist/types/types/");
  }
} catch {
  console.log("css.d.ts copy failed");
}

// 5. Expose the canonical Tailwind theme and its adjacent palette import.
copyTailwindReference(join(import.meta.dirname, ".."));
console.log("canonical Tailwind reference and palette copied to dist/");

// 6. RSC 边界（M0-02）：单文件 bundle 会把叶子模块的 "use client" 指令合并丢弃
//    （rolldown 1.2.3 尚未实现 preserveModules，见 tests/fixtures/rsc-boundaries.json）。
//    在产物层把根入口整体声明为 client 边界；子路径入口继承同一实现（M1-03）。
// 5b. 子路径门面（M1-03）：从 src/lib/entries/*.ts 提取运行时导出名，生成
//     re-export 门面而不是独立 bundle——保证根与子路径共享同一模块实例，
//     且不给消费端新增 chunk 请求（多入口共享 chunk 曾使文档站延迟路由悬停）。
const SUBPATHS = ["charts", "motion", "device", "code"];

function runtimeExportNames(name) {
  const source = readFileSync(join(import.meta.dirname, "../src/lib/entries", `${name}.ts`), "utf8");
  const names = new Set();
  // 只取运行时导出；`export type { ... }` 由 d.ts 承担，门面不需要。
  for (const match of source.matchAll(/(^|\n)export\s*\{([^}]+)\}\s*from/g)) {
    for (const part of match[2].split(",")) {
      const cleaned = part.trim();
      if (!cleaned) continue;
      const alias = cleaned.split(/\s+as\s+/);
      names.add((alias[1] ?? alias[0]).trim());
    }
  }
  return [...names];
}

const allowed = new Set(["unitary-ui.es.js", "unitary-ui.cjs"]);
for (const name of SUBPATHS) {
  const names = runtimeExportNames(name);
  if (names.length === 0) throw new Error(`No runtime exports found for subpath ${name}`);
  const esFile = `unitary-ui-${name}.es.js`;
  const cjsFile = `unitary-ui-${name}.cjs`;
  allowed.add(esFile);
  allowed.add(cjsFile);
  writeFileSync(join(distDir, esFile), `"use client";\nexport { ${names.join(", ")} } from "./unitary-ui.es.js";\n`);
  const pairs = names.map((exportName) => `${exportName}: root.${exportName}`).join(", ");
  writeFileSync(join(distDir, cjsFile), `"use client";\nconst root = require("./unitary-ui.cjs");\nmodule.exports = { ${pairs} };\n`);
  console.log(`${esFile}/${cjsFile}: ${names.length} exports`);
}

// 清理上一次多入口构建遗留的 chunk 文件（否则会被打进发布包）。
// 动态 import（如 motion-features）仍会产出独立 chunk，必须按引用保留。
const referenced = new Set();
for (const entry of ["unitary-ui.es.js", "unitary-ui.cjs"]) {
  const entryPath = join(distDir, entry);
  try {
    for (const match of readFileSync(entryPath, "utf8").matchAll(/["'](\.\/[^"']+\.(?:js|cjs))["']/g)) referenced.add(match[1].slice(2));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}
for (const file of readdirSync(distDir)) {
  if (!/\.(es\.js|cjs)$/.test(file) || allowed.has(file) || referenced.has(file)) continue;
  rmSync(join(distDir, file), { force: true });
  console.log(`removed stale artifact ${file}`);
}

for (const artifact of readdirSync(distDir).filter((name) => /^unitary-ui(-[a-z]+)?\.(es\.js|cjs)$/.test(name))) {
  const artifactPath = join(distDir, artifact);
  try {
    let code = readFileSync(artifactPath, "utf8");
    if (/^\s*["']use client["']/.test(code)) continue;
    code = `"use client";\n${code}`;
    writeFileSync(artifactPath, code);
    console.log(`${artifact}: use client boundary injected`);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    console.log(`${artifact}: not found, skipped`);
  }
}

