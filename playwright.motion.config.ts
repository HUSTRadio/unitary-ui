import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

const output = process.env.UNITARY_MOTION_OUTPUT ?? ".scratch/motion-browsers/manual";
const common = ["**/fade-motion.spec.ts", "**/carousel-variants.spec.ts"];

export default defineConfig({
  ...base,
  maxFailures: 1,
  failOnFlakyTests: true,
  outputDir: `${output}/results`,
  reporter: [["list"], ["json", { outputFile: `${output}/results.json` }]],
  use: {
    ...base.use,
    channel: undefined,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    permissions: [],
    contextOptions: { ...base.use?.contextOptions, permissions: [] },
  },
  projects: [
    { name: "chromium", testMatch: [...common, "**/motion-chromium.spec.ts"], use: { browserName: "chromium", channel: "chromium" } },
    { name: "firefox", testMatch: common, use: { browserName: "firefox" } },
    // Cold Windows WebKit navigation can exceed 30s before component readiness.
    { name: "webkit", testMatch: common, use: { browserName: "webkit", navigationTimeout: 60_000 } },
  ],
});
