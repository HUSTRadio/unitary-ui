import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "images", "styleguide");
const README_ZH = path.join(ROOT, "README.md");
const README_EN = path.join(ROOT, "README.en.md");
const WIDTH = 1440;
const HEIGHT = 900;
const VP_COMMAND = process.platform === "win32" ? "vp.exe" : "vp";
/**
 * 首屏导航预算。根 styleguide 的 dev 冷启动要按需转换全部示例模块，
 * 实测（2026-09-21，1440x900）：26s 才渲染出导航、30.3s 才 networkidle——
 * Playwright 默认 30s 恰好卡线，表现为「page.goto Timeout 30000ms exceeded」。
 * 与 playwright.config.ts 的重路由 90s / dev server 120s 口径一致放宽。
 */
const NAVIGATION_TIMEOUT_MS = 120_000;
const CHECK = process.argv.includes("--check");
const BLOCK_START = "<!-- STYLEGUIDE_SCREENSHOTS_START -->";
const BLOCK_END = "<!-- STYLEGUIDE_SCREENSHOTS_END -->";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function isServerUp(url) {
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

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + 100; port += 1) {
    const available = await new Promise((resolve) => {
      const server = net.createServer();
      server.once("error", () => resolve(false));
      server.listen(port, "127.0.0.1", () => server.close(() => resolve(true)));
    });
    if (available) return port;
  }
  throw new Error(`No local preview port available in ${startPort}-${startPort + 99}`);
}

async function startPreview() {
  const port = await findAvailablePort(5202);
  const url = `http://127.0.0.1:${port}`;
  const child = spawn(
    VP_COMMAND,
    ["dev", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd: ROOT, stdio: "ignore", shell: false, detached: process.platform !== "win32" },
  );

  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Preview exited early with code ${child.exitCode}`);
    }
    if (await isServerUp(url)) return { child, url };
    await sleep(500);
  }
  stopPreview(child);
  throw new Error(`Preview did not become ready within 120 seconds: ${url}`);
}

function stopPreview(child) {
  if (!child || child.exitCode !== null) return;
  if (process.platform === "win32") {
    const taskkill = spawnSync("taskkill.exe", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
    if (!taskkill.error && (taskkill.status === 0 || taskkill.status === 128)) return;
    try {
      if (child.kill()) return;
    } catch (error) {
      if (error?.code === "ESRCH") return;
      throw error;
    }
    if (taskkill.error) throw taskkill.error;
    throw new Error(`Failed to stop preview process tree ${child.pid}`);
  }
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    child.kill();
  }
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}",
  });
  await page.waitForTimeout(300);
}

async function setTheme(page, theme) {
  const button = page
    .locator('[data-slot="theme-switcher"] [role="radio"]')
    .nth(theme === "dark" ? 2 : 0);
  await button.waitFor({ state: "visible" });
  if ((await button.getAttribute("aria-checked")) !== "true") await button.click();
  await page.waitForFunction(
    (expectedTheme) =>
      document.documentElement.classList.contains("dark") === (expectedTheme === "dark"),
    theme,
  );
  await settle(page);
}

async function discoverPages(page) {
  const pages = await page.locator("header nav button[data-styleguide-page]").evaluateAll((nodes) =>
    nodes.map((node) => ({
      key: node.getAttribute("data-styleguide-page") ?? "",
      labelZh: node.textContent?.trim() ?? "",
      labelEn: node.getAttribute("data-styleguide-label-en") ?? "",
    })),
  );
  if (pages.length === 0) throw new Error("No styleguide pages discovered from the top navigation");
  for (const item of pages) {
    if (!/^[a-z0-9-]+$/.test(item.key) || !item.labelZh || !item.labelEn) {
      throw new Error(`Invalid styleguide screenshot metadata: ${JSON.stringify(item)}`);
    }
  }
  if (new Set(pages.map((item) => item.key)).size !== pages.length) {
    throw new Error("Duplicate data-styleguide-page values in top navigation");
  }
  return pages;
}

async function selectPage(page, key) {
  const button = page.locator(`header nav button[data-styleguide-page="${key}"]`);
  await button.click();
  await page.waitForFunction(
    (expectedKey) =>
      document
        .querySelector(`header nav button[data-styleguide-page="${expectedKey}"]`)
        ?.classList.contains("bg-selected") === true,
    key,
  );
  await page.evaluate(() => scrollTo(0, 0));
  await settle(page);
}

async function capture(outputDir) {
  const preview = await startPreview();
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
    await page.goto(preview.url, {
      waitUntil: "networkidle",
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    await page.locator("header nav").waitFor({ state: "visible", timeout: NAVIGATION_TIMEOUT_MS });
    const pages = await discoverPages(page);

    for (const item of pages) {
      await selectPage(page, item.key);
      for (const theme of ["light", "dark"]) {
        await setTheme(page, theme);
        await page.screenshot({
          path: path.join(outputDir, `${item.key}-${theme}.png`),
          animations: "disabled",
          fullPage: false,
        });
      }
    }
    await page.close();
    return pages;
  } finally {
    if (browser) await browser.close();
    stopPreview(preview.child);
  }
}

function escapeCell(value) {
  return value.replaceAll("|", "\\|");
}

function renderTable(pages, locale) {
  const header = locale === "zh" ? "| 页面 | Light | Dark |" : "| Page | Light | Dark |";
  const alignment = "| --- | --- | --- |";
  const rows = pages.map((item) => {
    const label = locale === "zh" ? item.labelZh : item.labelEn;
    const safe = escapeCell(label);
    return `| ${safe} | ![${safe} Light](images/styleguide/${item.key}-light.png) | ![${safe} Dark](images/styleguide/${item.key}-dark.png) |`;
  });
  return [BLOCK_START, header, alignment, ...rows, BLOCK_END].join("\n");
}

function replaceBlock(markdown, replacement, filename) {
  const startCount = markdown.split(BLOCK_START).length - 1;
  const endCount = markdown.split(BLOCK_END).length - 1;
  if (startCount !== 1 || endCount !== 1) {
    throw new Error(`${filename} must contain exactly one managed screenshot marker pair`);
  }
  const start = markdown.indexOf(BLOCK_START);
  const end = markdown.indexOf(BLOCK_END);
  if (end < start) {
    throw new Error(`${filename} has invalid managed screenshot marker order`);
  }
  return `${markdown.slice(0, start)}${replacement}${markdown.slice(end + BLOCK_END.length)}`;
}

function runFormatter(targetPath) {
  const result = spawnSync(VP_COMMAND, ["fmt", targetPath, "--write"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `Formatter failed for ${targetPath}: ${[result.stdout, result.stderr].filter(Boolean).join("\n")}`,
    );
  }
}

async function formatBlocks(stagingRoot, pages) {
  const zhPath = path.join(stagingRoot, "screenshots.zh.md");
  const enPath = path.join(stagingRoot, "screenshots.en.md");
  await Promise.all([
    fs.writeFile(zhPath, renderTable(pages, "zh"), "utf8"),
    fs.writeFile(enPath, renderTable(pages, "en"), "utf8"),
  ]);
  runFormatter(zhPath);
  runFormatter(enPath);
  const [zh, en] = await Promise.all([fs.readFile(zhPath, "utf8"), fs.readFile(enPath, "utf8")]);
  return { zh: zh.trim(), en: en.trim() };
}

async function compareFile(expectedPath, actualPath) {
  try {
    const [expected, actual] = await Promise.all([
      fs.readFile(expectedPath),
      fs.readFile(actualPath),
    ]);
    return expected.equals(actual);
  } catch {
    return false;
  }
}

async function findDrift(stagingDir, pages, expectedReadmes) {
  const expectedNames = pages.flatMap((item) => [`${item.key}-light.png`, `${item.key}-dark.png`]);
  const actualNames = await fs.readdir(OUT).catch(() => []);
  const drift = [];

  for (const name of expectedNames) {
    if (!(await compareFile(path.join(stagingDir, name), path.join(OUT, name)))) {
      drift.push(`images/styleguide/${name}`);
    }
  }
  for (const name of actualNames) {
    if (name.endsWith(".png") && !expectedNames.includes(name)) {
      drift.push(`images/styleguide/${name} (stale)`);
    }
  }
  const [currentZh, currentEn] = await Promise.all([
    fs.readFile(README_ZH, "utf8"),
    fs.readFile(README_EN, "utf8"),
  ]);
  if (currentZh !== expectedReadmes.zh) drift.push("README.md");
  if (currentEn !== expectedReadmes.en) drift.push("README.en.md");
  return drift;
}

async function applyGenerated(stagingDir, pages, expectedReadmes) {
  await fs.mkdir(OUT, { recursive: true });
  const expectedNames = pages.flatMap((item) => [`${item.key}-light.png`, `${item.key}-dark.png`]);
  const actualNames = await fs.readdir(OUT).catch(() => []);
  await Promise.all(
    actualNames
      .filter((name) => name.endsWith(".png") && !expectedNames.includes(name))
      .map((name) => fs.rm(path.join(OUT, name))),
  );
  await Promise.all(
    expectedNames.map((name) => fs.copyFile(path.join(stagingDir, name), path.join(OUT, name))),
  );
  await Promise.all([
    fs.writeFile(README_ZH, expectedReadmes.zh, "utf8"),
    fs.writeFile(README_EN, expectedReadmes.en, "utf8"),
  ]);
}

async function main() {
  const stagingRoot = await fs.mkdtemp(path.join(os.tmpdir(), "unitary-readme-shots-"));
  try {
    const pages = await capture(stagingRoot);
    const [currentZh, currentEn] = await Promise.all([
      fs.readFile(README_ZH, "utf8"),
      fs.readFile(README_EN, "utf8"),
    ]);
    const blocks = await formatBlocks(stagingRoot, pages);
    const expectedReadmes = {
      zh: replaceBlock(currentZh, blocks.zh, "README.md"),
      en: replaceBlock(currentEn, blocks.en, "README.en.md"),
    };
    const drift = await findDrift(stagingRoot, pages, expectedReadmes);

    if (CHECK) {
      if (drift.length > 0) {
        process.stderr.write(
          `[readme-screenshots] drift detected:\n${drift.map((item) => `  ${item}`).join("\n")}\n`,
        );
        process.exitCode = 2;
        return;
      }
      console.log(`[readme-screenshots] check passed: ${pages.length} pages × 2 themes`);
      return;
    }

    await applyGenerated(stagingRoot, pages, expectedReadmes);
    console.log(
      JSON.stringify({
        screenshots: pages.length * 2,
        pages: pages.map((item) => item.key),
        viewport: `${WIDTH}x${HEIGHT}`,
        out: OUT,
      }),
    );
  } finally {
    await fs.rm(stagingRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
