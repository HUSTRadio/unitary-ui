#!/usr/bin/env tsx
/**
 * generate-llm-docs.ts —— 为每条 canonical docs route 生成 LLM 参考语料。
 *
 * 简体中文为 primary（pages/zh-CN/**），英语为 alternative（pages/en-US/**）。
 * 内容来自构建后的语义 HTML（Playwright 驱动真实预览），禁止用 regex 解析 TS 源码。
 *
 * 用法：
 *   tsx scripts/generate-llm-docs.ts            生成并原子替换 docs/llm
 *   tsx scripts/generate-llm-docs.ts --check    只比较漂移，不写 tracked 文件（漂移时 exit 1）
 *
 * 安全/确定性合同：
 * - 独占启动预览进程（端口 5212），结束后始终回收；
 * - 生成写入临时目录，成功后原子替换目标目录；
 * - 失败时打印 route 并以非零退出码结束。
 */
import { spawn, type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";
import TurndownService from "turndown";

import { COMPONENTS } from "../docs/geist/src/data/components";
import { DOCS_ROUTE_SEQUENCE, type DocsRoute } from "../docs/geist/src/data/docs-routes";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LLM_DIR = path.join(ROOT, "docs", "llm");
const PORT = 5212;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const LOCALES = ["zh-CN", "en-US"] as const;
type Locale = (typeof LOCALES)[number];

const CHECK_MODE = process.argv.includes("--check");

const COMPONENT_BY_NAME = new Map(COMPONENTS.map((component) => [component.name, component]));

function log(message: string): void {
  process.stderr.write(`[generate-llm-docs] ${message}\n`);
}

function fail(message: string): never {
  log(`错误: ${message}`);
  process.exit(1);
}

function sha256(content: string): string {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

/* ---------------- 预览进程生命周期 ---------------- */

async function isServerUp(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
      response.resume();
      resolve(response.statusCode !== undefined);
    });
    request.on("error", () => resolve(false));
    request.setTimeout(2000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function startPreview(): Promise<{ child: ChildProcess | null; port: number }> {
  if (await isServerUp(BASE_URL)) {
    log(`复用已在运行的预览服务 ${BASE_URL}`);
    return { child: null, port: PORT };
  }
  const child = spawn(
    "vp",
    ["dev", "docs/geist", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"],
    {
      cwd: ROOT,
      stdio: "ignore",
      detached: false,
      shell: process.platform === "win32",
    },
  );
  child.on("error", (error) => {
    log(`预览进程启动失败: ${error.message}`);
  });
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (await isServerUp(BASE_URL)) return { child, port: PORT };
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  stopPreview(child);
  fail(`预览服务在 120 秒内未就绪（${BASE_URL}）`);
}

function stopPreview(child: ChildProcess | null): void {
  if (!child || child.killed) return;
  try {
    if (process.platform === "win32") {
      // Windows 下 vp 是 .cmd 包装，需要杀整个进程树。
      spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    } else {
      child.kill("SIGTERM");
    }
  } catch {
    // 进程可能已自行退出。
  }
}

/* ---------------- 页面抓取与降噪 ---------------- */

/** 在页面内执行的降噪脚本：移除导航与交互噪声，保留语义内容。 */
function extractMainHtml(): string {
  const main = document.getElementById("main-content");
  if (!main) return "";
  const clone = main.cloneNode(true) as HTMLElement;

  // 代码块重建：高亮渲染器用 div.token-line 分行，textContent 拼接后会丢失换行。
  // 在移除按钮之前，把 pre 内容重建为带真实换行的纯文本。
  for (const pre of Array.from(clone.querySelectorAll("pre"))) {
    const lines = Array.from(pre.querySelectorAll(".token-line")).map(
      (line) => line.textContent ?? "",
    );
    const text = lines.length > 0 ? lines.join("\n") : (pre.textContent ?? "");
    pre.textContent = text;
  }

  // 移除脚本、样式、SVG 装饰、侧边栏导航。
  for (const selector of ["script", "style", "svg", "nav", "aside", "form"]) {
    for (const el of Array.from(clone.querySelectorAll(selector))) el.remove();
  }
  // 交互控件：按钮、输入、下拉、隐藏跳转链接。
  for (const el of Array.from(clone.querySelectorAll("button, input, select, textarea"))) {
    el.remove();
  }
  // 空链接（图标链接/跳转链接移除后的残壳）与 skip 链接。
  for (const link of Array.from(clone.querySelectorAll("a"))) {
    const text = (link.textContent ?? "").trim();
    if (!text) link.remove();
  }
  return clone.innerHTML;
}

/** 页面元信息前言：保证每页含 route、title、summary 且两种语言结构对齐。 */
function pagePreamble(route: DocsRoute, locale: Locale): string {
  const title = locale === "zh-CN" ? route.labelZh : route.label;
  const component = COMPONENT_BY_NAME.get(
    route.renderer.kind === "component-detail" ? route.renderer.componentName : "",
  );
  const summary =
    locale === "zh-CN"
      ? (component?.descriptionZh ?? component?.description ?? "")
      : (component?.description ?? "");
  const lines = [`# ${title}`, "", `> Route: \`${route.to}\``, ""];
  if (summary) {
    lines.push(summary, "");
  }
  return lines.join("\n");
}

function makeTurndown(): TurndownService {
  const service = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  // 代码块：pre 转围栏代码块（tsx）。
  service.addRule("fencedPre", {
    filter: (node) => node.nodeName === "PRE",
    replacement: (content, node) => {
      const text = (node as HTMLElement).textContent ?? "";
      return `\n\n\`\`\`tsx\n${text.replace(/\n+$/, "")}\n\`\`\`\n\n`;
    },
  });
  // 内联 code 保持反引号。
  service.keep(["table"]);
  return service;
}

/* ---------------- index.json 与输出 ---------------- */

function routeTitle(route: DocsRoute): Record<Locale, string> {
  return { "zh-CN": route.labelZh, "en-US": route.label };
}

function routeCategory(route: DocsRoute): string {
  if (route.renderer.kind === "component-detail") return "component";
  if (route.renderer.kind === "component-index") return "components-index";
  if (route.renderer.kind === "localized") return "pattern";
  return "foundations";
}

interface RouteOutput {
  route: DocsRoute;
  pages: Record<Locale, string>;
}

async function captureAllRoutes(): Promise<RouteOutput[]> {
  const { child } = await startPreview();
  const outputs: RouteOutput[] = [];
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;
  try {
    browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const turndown = makeTurndown();

    // 输出按 canonical 路由顺序；每种语言一次完整遍历（语言切换靠 ?lang= 查询参数，
    // HashRouter 下查询参数必须在 # 之前才能被 window.location.search 读到）。
    const pagesByRoute = new Map<string, Partial<Record<Locale, string>>>();
    for (const locale of LOCALES) {
      for (const route of DOCS_ROUTE_SEQUENCE) {
        const url = `${BASE_URL}/?lang=${locale}#${route.to}`;
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
        await page.waitForSelector("#main-content", { timeout: 30_000 });
        // 等待 hash 路由挂载到位（hash 变化是客户端导航，需等渲染）。
        await page
          .waitForFunction((to) => window.location.hash === `#${to}`, route.to, { timeout: 10_000 })
          .catch(() => undefined);
        // 展开折叠的代码块（Show code / 显示代码），让代码进入语义内容。
        // 只匹配 Show code 按钮，避免误点汉堡菜单/命令面板等其它折叠控件。
        const showCodeButtons = page.getByRole("button", { name: /^(显示代码|Show code)$/ });
        const showCodeCount = await showCodeButtons.count().catch(() => 0);
        for (let i = 0; i < showCodeCount; i++) {
          const button = showCodeButtons.nth(i);
          if ((await button.getAttribute("aria-expanded").catch(() => null)) === "false") {
            await button.click({ timeout: 5_000 }).catch(() => undefined);
          }
        }
        // 内容稳定窗口：等待渲染完成。
        await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);

        const html = await page.evaluate(extractMainHtml);
        if (!html) fail(`route ${route.to} (${locale}) 未渲染出 #main-content`);
        const markdown = turndown
          .turndown(html)
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        if (!markdown) fail(`route ${route.to} (${locale}) 转换后内容为空`);
        const record = pagesByRoute.get(route.to) ?? {};
        record[locale] = `${pagePreamble(route, locale)}\n${markdown}\n`;
        pagesByRoute.set(route.to, record);
        log(`抓取 ${route.to} [${locale}]`);
      }
    }
    for (const route of DOCS_ROUTE_SEQUENCE) {
      const record = pagesByRoute.get(route.to);
      if (!record || !record["zh-CN"] || !record["en-US"]) {
        fail(`route ${route.to} 缺少语言输出`);
      }
      outputs.push({ route, pages: record as Record<Locale, string> });
    }
  } finally {
    if (browser) await browser.close().catch(() => undefined);
    stopPreview(child);
  }
  return outputs;
}

function writeOutput(outputs: RouteOutput[], targetDir: string): void {
  for (const locale of LOCALES) {
    rmSync(path.join(targetDir, "pages", locale), { recursive: true, force: true });
  }
  const indexRoutes = outputs.map(({ route, pages }) => {
    const locales: Record<string, string> = {};
    const sourceHash: Record<string, string> = {};
    for (const locale of LOCALES) {
      const rel = `pages/${locale}${route.to === "/" ? "/introduction" : route.to}.md`;
      const filePath = path.join(targetDir, rel);
      mkdirSync(path.dirname(filePath), { recursive: true });
      // 行尾空白归一：turndown 的硬换行（两个尾随空格）与缩进残留在语料里是噪声。
      const normalized = pages[locale]
        .split("\n")
        .map((line) => line.replace(/[ \t]+$/g, ""))
        .join("\n");
      writeFileSync(filePath, normalized, "utf8");
      locales[locale] = rel;
      sourceHash[locale] = sha256(normalized);
    }
    return {
      path: route.to,
      title: routeTitle(route),
      category: routeCategory(route),
      locales,
      sourceHash,
    };
  });

  const index = {
    schemaVersion: 1,
    framework: "Unitary UI",
    primaryLocale: "zh-CN",
    alternativeLocales: ["en-US"],
    canonicalSource: "docs/geist/src/data/docs-routes.ts",
    generatedAt: undefined as unknown,
    routes: indexRoutes,
  };
  // 稳定输出：不包含生成时间戳，保证重复生成零漂移。
  delete (index as Record<string, unknown>).generatedAt;
  writeFileSync(path.join(targetDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");
}

/** 逐字节比较两个目录下的 pages 与 index.json。 */
function findDrift(generatedDir: string, currentDir: string): string[] {
  const drift: string[] = [];
  const listFiles = (dir: string, base = ""): string[] => {
    if (!existsSync(dir)) return [];
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const rel = base ? `${base}/${entry.name}` : entry.name;
      return entry.isDirectory() ? listFiles(path.join(dir, entry.name), rel) : [rel];
    });
  };
  const generatedFiles = new Set(listFiles(path.join(generatedDir, "pages")));
  const currentFiles = new Set(listFiles(path.join(currentDir, "pages")));
  for (const rel of generatedFiles) {
    if (!currentFiles.has(rel)) {
      drift.push(`缺失: pages/${rel}`);
      continue;
    }
    const a = readFileSync(path.join(generatedDir, "pages", rel), "utf8");
    const b = readFileSync(path.join(currentDir, "pages", rel), "utf8");
    if (a !== b) drift.push(`漂移: pages/${rel}`);
  }
  for (const rel of currentFiles) {
    if (!generatedFiles.has(rel)) drift.push(`多余: pages/${rel}`);
  }
  const indexA = path.join(generatedDir, "index.json");
  const indexB = path.join(currentDir, "index.json");
  if (!existsSync(indexB) || readFileSync(indexA, "utf8") !== readFileSync(indexB, "utf8")) {
    drift.push("漂移: index.json");
  }
  return drift;
}

async function main(): Promise<void> {
  log(`模式: ${CHECK_MODE ? "check（只比较，不写）" : "generate（原子替换）"}`);
  const outputs = await captureAllRoutes();

  const stagingDir = path.join(os.tmpdir(), `unitary-llm-docs-${process.pid}`);
  rmSync(stagingDir, { recursive: true, force: true });
  mkdirSync(stagingDir, { recursive: true });
  try {
    writeOutput(outputs, stagingDir);

    if (CHECK_MODE) {
      const drift = findDrift(stagingDir, LLM_DIR);
      if (drift.length > 0) {
        for (const item of drift) log(item);
        fail(`--check 发现 ${drift.length} 处漂移`);
      }
      log("--check 通过：无漂移");
      return;
    }

    // 原子替换：临时目录与目标可能跨卷，无法 rename；清空后整体拷贝。
    const pagesStaging = path.join(stagingDir, "pages");
    const pagesTarget = path.join(LLM_DIR, "pages");
    mkdirSync(LLM_DIR, { recursive: true });
    if (existsSync(pagesTarget)) {
      rmSync(pagesTarget, { recursive: true, force: true });
    }
    cpSync(pagesStaging, pagesTarget, { recursive: true });
    writeFileSync(
      path.join(LLM_DIR, "index.json"),
      readFileSync(path.join(stagingDir, "index.json"), "utf8"),
      "utf8",
    );
    log(`已写入 ${outputs.length} 条路由 × ${LOCALES.length} 语言 = ${outputs.length * 2} 页`);
  } finally {
    rmSync(stagingDir, { recursive: true, force: true });
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  fail(message);
});
