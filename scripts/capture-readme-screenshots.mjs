import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.resolve(ROOT, process.env.README_SHOTS_OUT ?? "images");
const WIDTH = 1440;
const HEIGHT = 900;
const VP_COMMAND = process.platform === "win32" ? "vp.exe" : "vp";

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

async function startPreview(relativeArgs, startPort) {
  const port = await findAvailablePort(startPort);
  const url = `http://127.0.0.1:${port}`;
  const child = spawn(
    VP_COMMAND,
    [...relativeArgs, "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: ROOT,
      stdio: "ignore",
      shell: false,
    },
  );

  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(
        `Preview exited early with code ${child.exitCode}: ${relativeArgs.join(" ")}`,
      );
    }
    if (await isServerUp(url)) return { child, url };
    await sleep(500);
  }

  child.kill();
  throw new Error(`Preview did not become ready within 120 seconds: ${url}`);
}

function stopPreview(child) {
  if (child && child.exitCode === null && !child.killed) child.kill();
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
  await page.waitForTimeout(500);
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

async function selectStyleguidePage(page, label) {
  const button = page.getByRole("button", { name: label, exact: true });
  await button.click();
  await page.waitForFunction(
    (expectedLabel) =>
      [...document.querySelectorAll("header nav button")].some(
        (node) =>
          node.textContent?.trim() === expectedLabel && node.classList.contains("bg-selected"),
      ),
    label,
  );
  await page.evaluate(() => scrollTo(0, 0));
  await settle(page);
}

async function screenshot(page, filename) {
  await page.evaluate(() => scrollTo(0, 0));
  await settle(page);
  await page.screenshot({
    path: path.join(OUT, filename),
    animations: "disabled",
    fullPage: false,
  });
}

async function captureStyleguide(browser) {
  const preview = await startPreview(["dev"], 5202);
  try {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
    await page.goto(preview.url, { waitUntil: "networkidle" });
    await page.locator("header nav").waitFor({ state: "visible" });

    await setTheme(page, "light");
    await selectStyleguidePage(page, "组件总览");
    await screenshot(page, "components-light.png");

    await selectStyleguidePage(page, "表单示例");
    await screenshot(page, "form-example.png");
    await setTheme(page, "dark");
    await screenshot(page, "form-dark.png");

    await setTheme(page, "light");
    await selectStyleguidePage(page, "数据表格");
    await screenshot(page, "data-table.png");
    const checkbox = page.locator('input[type="checkbox"][aria-label="全选"]');
    await checkbox.click();
    await settle(page);
    await screenshot(page, "data-table-selected.png");
    await checkbox.click();
    await setTheme(page, "dark");
    await screenshot(page, "data-table-dark.png");

    await setTheme(page, "light");
    await selectStyleguidePage(page, "审批流程");
    await screenshot(page, "workflow.png");

    await selectStyleguidePage(page, "设置面板");
    await screenshot(page, "settings.png");
    await page.close();
  } finally {
    stopPreview(preview.child);
  }
}

async function captureJsonView(browser) {
  const preview = await startPreview(["dev", "docs/geist"], 5212);
  try {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
    await page.goto(`${preview.url}/?lang=zh-CN#/components/json-view`, {
      waitUntil: "networkidle",
    });
    await page.locator("#main-content").waitFor({ state: "visible" });

    await setTheme(page, "light");
    await screenshot(page, "json-view-light.png");
    await setTheme(page, "dark");
    await screenshot(page, "json-view-dark.png");
    await page.close();
  } finally {
    stopPreview(preview.child);
  }
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  try {
    await captureStyleguide(browser);
    await captureJsonView(browser);
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify({ screenshots: 10, viewport: `${WIDTH}x${HEIGHT}`, out: OUT }));
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
