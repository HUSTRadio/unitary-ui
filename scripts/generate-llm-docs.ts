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
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
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
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, type Page } from "@playwright/test";
import TurndownService from "turndown";

import { COMPONENTS } from "../docs/site/src/data/components";
import { DOCS_ROUTE_SEQUENCE, type DocsRoute } from "../docs/site/src/data/docs-routes";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LLM_DIR = path.join(ROOT, "docs", "llm");
const START_PORT = 5212;
const LOCALES = ["zh-CN", "en-US"] as const;
type Locale = (typeof LOCALES)[number];

const CHECK_MODE = process.argv.includes("--check");
const VP_COMMAND = process.platform === "win32" ? "vp.exe" : "vp";

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

async function findAvailablePort(startPort: number): Promise<number> {
  for (let port = startPort; port < startPort + 100; port++) {
    // 仅“能绑定”并不够：残留的预览进程仍可能在端口上应答，而 --strictPort 会让本进程的
    // vp dev 直接退出，随后 Playwright 连到一个正在消失的服务上并超时。因此已有服务应答的
    // 端口一律跳过，保证 startPreview 返回的端口一定由本次 spawn 的进程提供。
    if (await isServerUp(`http://127.0.0.1:${port}`)) continue;
    const available = await new Promise<boolean>((resolve) => {
      const server = net.createServer();
      server.once("error", () => resolve(false));
      server.listen(port, "127.0.0.1", () => {
        server.close(() => resolve(true));
      });
    });
    if (available) return port;
  }
  fail(`找不到可用的本地预览端口（${startPort}-${startPort + 99}）`);
}

async function startPreview(): Promise<{ child: ChildProcess; port: number }> {
  const port = await findAvailablePort(START_PORT);
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(
    VP_COMMAND,
    ["dev", "docs", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: ROOT,
      stdio: "ignore",
      detached: false,
      shell: false,
    },
  );
  child.on("error", (error) => {
    log(`预览进程启动失败: ${error.message}`);
  });
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      fail(`预览进程提前退出（exit ${child.exitCode}，port ${port}）`);
    }
    if (await isServerUp(baseUrl)) {
      log(`已启动独占预览服务 ${baseUrl}`);
      return { child, port };
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  stopPreview(child);
  fail(`预览服务在 120 秒内未就绪（${baseUrl}）`);
}

function stopPreview(child: ChildProcess | null): void {
  if (!child || child.killed) return;
  try {
    if (process.platform === "win32") {
      // Windows 下 vp 是 .cmd 包装，需要杀整个进程树；必须同步等待结束，否则本进程退出后
      // 预览服务仍占着端口，会让后续 generate/check 复用到它。
      spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
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
  // 交互控件与运行时状态：表单控件、媒体播放器表面。
  // Video 的计时文本会在媒体元数据加载前后从 00:00 变为实际时长，必须整体移除，
  // 否则同一源码的连续生成会产生非确定性语料漂移；示例代码仍保留完整用法。
  for (const el of Array.from(
    clone.querySelectorAll('button, input, select, textarea, [data-slot="video"]'),
  )) {
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

/**
 * 等待 #main-content 不仅存在、且已经渲染出非空内容。
 * 仅 `waitForSelector` 会在语言切换/路由重挂载的空窗期命中一个尚未填充的容器，
 * 从而导致语料静默丢失内容（曾观测到示例代码块被整体丢弃）。
 */
async function waitForRenderedMain(page: Page): Promise<void> {
  await page.waitForSelector("#main-content", { timeout: 30_000 });
  await page.waitForFunction(
    () => {
      const main = document.getElementById("main-content");
      return !!main && (main.textContent ?? "").trim().length > 0;
    },
    undefined,
    { timeout: 30_000 },
  );
}

const SHOW_CODE_NAME = /^(显示代码|Show code)$/;

/**
 * 展开全部 “显示代码 / Show code” 折叠块，并确认展开后代码块真正挂载。
 * 未展开或未渲染都会抛错，交由路由级重试处理，绝不静默产出残缺语料。
 */
async function expandAllCodeBlocks(page: Page): Promise<void> {
  const toggles = page.getByRole("button", { name: SHOW_CODE_NAME });
  for (let pass = 0; pass < 2; pass++) {
    const count = await toggles.count();
    for (let i = 0; i < count; i++) {
      const button = toggles.nth(i);
      if ((await button.getAttribute("aria-expanded").catch(() => null)) === "true") continue;
      await button.click({ timeout: 5_000 }).catch(() => undefined);
    }
    let collapsed = 0;
    for (let i = 0; i < count; i++) {
      if ((await toggles.nth(i).getAttribute("aria-expanded").catch(() => null)) !== "true") {
        collapsed += 1;
      }
    }
    if (collapsed === 0) {
      // 展开状态翻转后代码块才挂载，必须等 <pre> 数量追上折叠块数量。
      await page.waitForFunction(
        (expected) => document.querySelectorAll("#main-content pre").length >= expected,
        count,
        { timeout: 20_000 },
      );
      return;
    }
  }
  throw new Error("“显示代码” 折叠块在重试后仍未全部展开");
}

/** 单条 route × locale 的抓取；失败时抛错，由调用方决定重试或终止。 */
async function captureRoute(
  page: Page,
  turndown: TurndownService,
  baseUrl: string,
  route: DocsRoute,
  locale: Locale,
): Promise<string> {
  await page.goto(`${baseUrl}/?lang=${locale}#${route.to}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await waitForRenderedMain(page);
  // 等待 hash 路由挂载到位（hash 变化是客户端导航，需等渲染）。
  await page
    .waitForFunction((to) => window.location.hash === `#${to}`, route.to, { timeout: 10_000 })
    .catch(() => undefined);
  // HashRouter 会先更新 URL，再提交新页面内容；main 本身跨路由常驻，因此不能作为
  // 组件详情已就绪的信号。等待当前组件的 demo 标记，防止抓到上一页的 API/示例。
  if (route.renderer.kind === "component-detail") {
    await page.waitForSelector(`[data-demo-component="${route.renderer.componentName}"]`, {
      timeout: 30_000,
    });
  }
  await expandAllCodeBlocks(page);
  // 内容稳定窗口：等待渲染完成。
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);

  const html = await page.evaluate(extractMainHtml);
  if (!html) throw new Error(`route ${route.to} (${locale}) 未渲染出 #main-content`);
  const markdown = turndown
    .turndown(html)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!markdown) throw new Error(`route ${route.to} (${locale}) 转换后内容为空`);
  return `${pagePreamble(route, locale)}\n${markdown}\n`;
}

async function captureAllRoutes(): Promise<RouteOutput[]> {
  const { child, port } = await startPreview();
  const baseUrl = `http://127.0.0.1:${port}`;
  const outputs: RouteOutput[] = [];
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;
  try {
    browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    // Avatar demos use third-party profile endpoints whose success/404/latency varies
    // between runs. Keep the rendered semantic image nodes deterministic for the
    // generated corpus; fallback behavior is covered by the component browser tests.
    const avatarHosts = new Set(["github.com", "gitlab.com", "bitbucket.org"]);
    await context.route("**/*", async (route) => {
      const request = route.request();
      if (request.resourceType() === "image" && avatarHosts.has(new URL(request.url()).hostname)) {
        await route.fulfill({
          status: 200,
          contentType: "image/gif",
          body: Buffer.from("R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=", "base64"),
        });
        return;
      }
      await route.continue();
    });
    const page = await context.newPage();
    const turndown = makeTurndown();

    // 输出按 canonical 路由顺序；每种语言一次完整遍历（语言切换靠 ?lang= 查询参数，
    // HashRouter 下查询参数必须在 # 之前才能被 window.location.search 读到）。
    const pagesByRoute = new Map<string, Partial<Record<Locale, string>>>();
    for (const locale of LOCALES) {
      for (const route of DOCS_ROUTE_SEQUENCE) {
        const attempts = 2;
        let captured: string | null = null;
        let lastError: unknown = null;
        for (let attempt = 1; attempt <= attempts && captured === null; attempt++) {
          try {
            // 重试时先卸载当前文档，强制一次全新挂载，避免复用半渲染状态。
            if (attempt > 1) await page.goto("about:blank").catch(() => undefined);
            captured = await captureRoute(page, turndown, baseUrl, route, locale);
          } catch (error) {
            lastError = error;
            const message = error instanceof Error ? error.message : String(error);
            if (attempt < attempts) log(`重试 ${route.to} [${locale}]：${message}`);
          }
        }
        if (captured === null) {
          const message =
            lastError instanceof Error ? (lastError.stack ?? lastError.message) : String(lastError);
          fail(`route ${route.to} (${locale}) 捕获失败：${message}`);
        }
        const record = pagesByRoute.get(route.to) ?? {};
        record[locale] = captured;
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
    canonicalSource: "docs/site/src/data/docs-routes.ts",
    generatedAt: undefined as unknown,
    routes: indexRoutes,
  };
  // 稳定输出：不包含生成时间戳，保证重复生成零漂移。
  delete (index as Record<string, unknown>).generatedAt;
  writeFileSync(path.join(targetDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");
}

interface GeneratedIndexRoute {
  locales: Record<Locale, string>;
  sourceHash: Record<Locale, string>;
}

interface GeneratedIndex {
  routes: GeneratedIndexRoute[];
}

function runFormatter(targetPath: string): void {
  const result = spawnSync(VP_COMMAND, ["fmt", targetPath, "--write"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false,
  });
  if (result.status !== 0) {
    fail(
      `formatter 失败 (${targetPath}): ${[result.stdout, result.stderr].filter(Boolean).join("\n")}`,
    );
  }
}

/** 格式化页面后重算 hash，保证 index 记录的是最终落盘字节。 */
function formatOutput(targetDir: string): void {
  const pagesDir = path.join(targetDir, "pages");
  const indexPath = path.join(targetDir, "index.json");
  runFormatter(pagesDir);

  const index = JSON.parse(readFileSync(indexPath, "utf8")) as GeneratedIndex;
  for (const route of index.routes) {
    for (const locale of LOCALES) {
      route.sourceHash[locale] = sha256(
        readFileSync(path.join(targetDir, route.locales[locale]), "utf8"),
      );
    }
  }
  writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  runFormatter(indexPath);
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
    formatOutput(stagingDir);

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
