// vitest 配置：
// 1. 排除 .hermes/ 审计产物（其中的 *.test.cjs/mjs 是独立 node 脚本，非 vitest 套件）。
// 2. 本文件存在时会顶替 vite.config.ts，需自行补齐 @ alias。
// 不导入 vitest/config（pnpm 嵌套解析问题），直接导出纯配置对象。
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exampleSourcePlugin } from "./docs/site/build/example-source-plugin.ts";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default {
  plugins: [exampleSourcePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
  test: {
    // Windows full-suite runs perform many concurrent Git/filesystem operations;
    // the Vitest 5 s default causes false timeouts under normal I/O contention.
    testTimeout: 15_000,
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
      "**/.hermes/**",
      // 本地验证快照与临时产物不参与测试收集。 / Exclude local verification snapshots.
      "**/.scratch/**",
      // git worktree 隔离工作区（parallel-subagent-driven-development）：
      // 其中的 tests/ 是旧代码快照，会被 vitest 重复收集导致套件数翻倍
      "**/.superpowers/**",
      // Playwright 浏览器审计（由 `pnpm run test:docs-layout` 独立驱动，
      // 依赖 @playwright/test 的 test 函数，vitest 收集会直接报错）
      "tests/e2e/**",
    ],
  },
};
