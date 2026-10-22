import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: ["**/_tmp-*", "**/*.tmp.*", "**/.*.spec.ts"],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 1,
  retries: 1,
  reporter: [["list"]],
  outputDir: "../.scratch/website-playwright-results",
  use: {
    baseURL: "http://127.0.0.1:5255",
    browserName: "chromium",
    channel: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    permissions: ["clipboard-read", "clipboard-write"],
  },
  webServer: {
    command: "node node_modules/vite/bin/vite.js preview --config website/vite.config.ts --host 127.0.0.1 --port 5255 --strictPort",
    cwd: process.cwd(),
    url: "http://127.0.0.1:5255",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
