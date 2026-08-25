import { defineConfig } from "@playwright/test";

/**
 * docs 布局审计 harness（计划任务 11）。
 * dev server 由 webServer 托管：本 worktree 专用端口 5211，
 * 避免误连其它 worktree 占用的 5200；每次审计都由 Playwright 独占启动并回收实例。
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 15 * 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  outputDir: ".scratch/playwright-results",
  use: {
    baseURL: "http://127.0.0.1:5211",
    browserName: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    contextOptions: {
      // /colors Clipboard 真值断言需要剪贴板权限
      permissions: ["clipboard-read", "clipboard-write"],
    },
  },
  webServer: {
    command: "vp dev docs/geist --host 127.0.0.1 --port 5211 --strictPort",
    cwd: process.cwd(),
    url: "http://127.0.0.1:5211",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
