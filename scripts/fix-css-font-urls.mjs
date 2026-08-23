// Post-build: 
// 1. 把 dist CSS 里的 /fonts/ 绝对路径改为相对路径（npm 包消费场景）
// 2. 删除 demo 演示资源（不属于库包）
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const distDir = join(import.meta.dirname, "../dist");

// 1. CSS 字体 URL 相对化
const cssPath = join(distDir, "geist-style-framework.css");
let css = readFileSync(cssPath, "utf8");
const before = (css.match(/url\(\/fonts\//g) || []).length;
css = css.replaceAll("url(/fonts/", "url(./fonts/");
writeFileSync(cssPath, css);
console.log(`css font urls rewritten: ${before} absolute → relative ./fonts/`);

// 2. 删除 demo 资源
for (const f of ["demo.mp4", "demo-poster.png"]) {
  const p = join(distDir, f);
  try {
    rmSync(p);
    console.log(`removed ${f}`);
  } catch {
    // 不存在则忽略
  }
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
  console.log(before ? "index.d.ts: css side-effect import removed + reference injected" : "index.d.ts: no css import (clean)");
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
