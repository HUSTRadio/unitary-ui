import { defineConfig } from "@playwright/test";

const artifact = Boolean(process.env.UNITARY_DOCS_ARTIFACT);
const output = `.scratch/glass-native/${new Date().toISOString().replaceAll(/[:.]/g, "-")}-${process.pid}`;
export default defineConfig({
  testDir: "./tests/native-glass",
  testMatch: "**/*.e2e.ts",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  workers: 1,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: `${output}/results.json` }]],
  outputDir: `${output}/results`,
  use: {
    baseURL: "http://127.0.0.1:5243",
    headless: process.env.UNITARY_NATIVE_GLASS_HEADLESS === "1",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    permissions: [],
  },
  projects: ["firefox", "webkit"].flatMap(browserName => [1, 2].map(dpr => ({
    name: `${browserName}-dpr${dpr}`,
    use: {
      browserName: browserName as "firefox" | "webkit",
      deviceScaleFactor: dpr,
      launchOptions: {
        ...(browserName === "firefox" ? { firefoxUserPrefs: { "layout.css.devPixelsPerPx": String(dpr) } } : {}),
        ...(process.platform === "linux" && process.env.UNITARY_NATIVE_GLASS_XVFB === "1" ? {
          env: { ...process.env, GDK_SCALE: String(dpr), GDK_DPI_SCALE: "1", GDK_BACKEND: "x11", MOZ_ENABLE_WAYLAND: "0", WAYLAND_DISPLAY: "" },
        } : {}),
      },
    },
  }))),
  webServer: {
    command: artifact
      ? "node scripts/serve-docs-artifact.mjs --port 5243"
      : "pnpm exec vite dev docs --host 127.0.0.1 --port 5243 --strictPort",
    url: "http://127.0.0.1:5243",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
