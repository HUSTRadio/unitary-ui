import path from "node:path";
import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";
import { templateApplications } from "./scripts/lib/templates.mjs";

const root = import.meta.dirname;
const apps = templateApplications(root);
for (const app of apps) {
  if (!existsSync(path.join(root, "tests/e2e/templates", `${app.id}.spec.ts`)))
    throw new Error(`Missing template browser contract: ${app.id}`);
}
const artifactRoot = process.env.UNITARY_TEMPLATE_ARTIFACTS;
export default defineConfig({
  testDir: "./tests/e2e/templates",
  outputDir: ".scratch/template-playwright-results",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 1,
  workers: 1,
  fullyParallel: false,
  reporter: [["list"], ["json", { outputFile: ".scratch/template-browser.json" }]],
  use: {
    browserName: "chromium",
    channel: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    permissions: ["clipboard-read", "clipboard-write"],
  },
  projects: apps.map((app, index) => ({
    name: app.id,
    testMatch: `${app.id}.spec.ts`,
    use: { baseURL: `http://127.0.0.1:${5221 + index}` },
  })),
  webServer: apps.map((app, index) => ({
    command: artifactRoot
      ? `node node_modules/vite/bin/vite.js preview --config "${path.join(artifactRoot, app.id, "vite.config.ts")}" --host 127.0.0.1 --port ${5221 + index} --strictPort`
      : `node node_modules/vite/bin/vite.js --config templates/${app.id}/vite.source.config.ts --host 127.0.0.1 --port ${5221 + index} --strictPort`,
    cwd: root,
    url: `http://127.0.0.1:${5221 + index}`,
    reuseExistingServer: false,
    timeout: 120_000,
  })),
});
