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
  // 防冷启动 flake 兜底；retried-pass 在 list reporter 中显式标记为 flaky，不冒充首过
  retries: 1,
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
    // vp（vite-plus@0.x）是单点依赖：启动失败时回退到原生 vite dev
    command:
      "vp dev docs --host 127.0.0.1 --port 5211 --strictPort || vite dev docs --host 127.0.0.1 --port 5211 --strictPort",
    cwd: process.cwd(),
    url: "http://127.0.0.1:5211",
    // 默认仍由 Playwright 独占启动/回收（审计的确定性）；本地迭代视觉核查时
    // 先手动起一个常驻 5211 dev server，再用 PW_REUSE_SERVER=1 复用，
    // 省去每次 ~1min 的 vite 冷启动。
    reuseExistingServer: process.env.PW_REUSE_SERVER === "1",
    timeout: 120_000,
  },
});
