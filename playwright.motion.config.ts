import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

const output = process.env.UNITARY_MOTION_OUTPUT ?? ".scratch/motion-browsers/manual";
const common = ["**/fade-motion.spec.ts", "**/carousel-variants.spec.ts"];

// 无障碍测试精确禁用（A11Y-TEST-0086..0093，台账 tests/fixtures/a11y-test-disable-ledger.json）。
// motion 证据器要求 planned/executed 一致且 skipped=0，禁止运行时 .skip：
// 用收集期 grepInvert 过滤。grep 匹配串为 "project名 文件路径 describe标题 test标题 tags"
// 的空格拼接（相对 testDir 的文件路径），因此锚定为
// `^<project> <文件路径> <完整标题>$`（标题逐参数化变体展开、元字符转义），禁止宽泛正则。
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const disabledTitle = (project: string, file: string, title: string) =>
  new RegExp(`^${project} ${escapeRegExp(file)} ${escapeRegExp(title)}$`);
const maskVariants = ["(light, 390)", "(light, 1280)", "(dark, 390)", "(dark, 1280)"];

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
    {
      name: "chromium",
      testMatch: [...common, "**/motion-chromium.spec.ts"],
      grepInvert: [
        ...maskVariants.map((variant) => disabledTitle("chromium", "fade-motion.spec.ts", `material masks preserve static accessibility fallbacks ${variant}`)),
        ...maskVariants.map((variant) => disabledTitle("chromium", "motion-chromium.spec.ts", `reduced transparency removes the modal backdrop ${variant}`)),
      ],
      use: { browserName: "chromium", channel: "chromium" },
    },
    {
      name: "firefox",
      testMatch: common,
      grepInvert: maskVariants.map((variant) => disabledTitle("firefox", "fade-motion.spec.ts", `material masks preserve static accessibility fallbacks ${variant}`)),
      use: { browserName: "firefox" },
    },
    // Cold Windows WebKit navigation can exceed 30s before component readiness.
    {
      name: "webkit",
      testMatch: common,
      grepInvert: maskVariants.map((variant) => disabledTitle("webkit", "fade-motion.spec.ts", `material masks preserve static accessibility fallbacks ${variant}`)),
      use: { browserName: "webkit", navigationTimeout: 60_000 },
    },
  ],
});
