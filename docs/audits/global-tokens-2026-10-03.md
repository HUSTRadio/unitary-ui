# 全局 Token API 验证 / Global token API verification

日期 / Date: 2026-10-03

目录从 `src/styles/index.css` 生成，共 505 项：415 个运行时变量与 90 个构建映射。包根导出单项/批量读取、写入、恢复、订阅及 `useTokens`，并提供名称、分组、目标元素和返回值类型。写入范围默认为根元素，也可指定局部元素；恢复移除行内覆盖并采用当前主题的 CSS 级联。

The catalog is generated from `src/styles/index.css`: 505 entries, including 415 runtime variables and 90 build mappings. The package root exports individual/batch reads, writes, resets, subscriptions, `useTokens`, and their public types. Writes default to the root or a selected element; reset removes inline overrides and restores the current theme's cascade.

双语 `/tokens` 页面包含完整可搜索目录、API 表、可复制代码和实时编辑器；展示页有独立的 Token 导航项。生成文档移除编辑器的运行时读值，保留静态定义和实际示例源码。

The bilingual `/tokens` page includes the searchable catalog, API table, copyable code and live editor. The styleguide has a dedicated Token page. Generated references omit runtime editor values while retaining definitions and real example source.

以下通过项均返回退出码 0。图片比较测试在命令级 PATH 使用内置 Python；仓库未加入机器配置。

Every passing command below returned exit 0. Image-comparison tests used the bundled Python on a command-scoped PATH; no machine configuration was committed.

| 命令 / Command | 实测结果 / Observed result |
| --- | --- |
| `pnpm run test --maxWorkers=4` | 255 个文件、1671 项测试通过 / 255 files, 1671 tests passed |
| `pnpm run typecheck` | 源码类型与目录一致性通过 / Source types and catalog consistency passed |
| `pnpm run build` | 生产应用构建通过 / Production app build passed |
| `pnpm run test:package` | 原生 ESM/CJS、SSR、公开 Token API 与 CSS 消费通过 / Native ESM/CJS, SSR, token API and CSS consumer checks passed |
| `pnpm exec playwright test tests/e2e/global-tokens.spec.ts --retries=0 --max-failures=1` | 双主题测试通过；覆盖局部/全局修改、恢复、重复选择、订阅读值、搜索和 320px 布局 / Both themes passed; covers scopes, reset, repeated selection, subscribed values, search and 320px layout |
| `pnpm run docs:llm:generate` | 114 条路由 × 2 语言，共 228 页 / 114 routes × 2 locales, 228 pages |
| `scripts/generate-llm-docs.ts --check`（在待提交源码快照中由 Node/TSX CLI 运行 / via Node/TSX CLI in the staged source snapshot） | 完整真实文档生成确定性通过 / Deterministic real documentation generation passed |
| `pnpm pack` | 实际压缩包包含 170 个文件、16 个字体、公开 API 类型及必需许可证与声明 / Actual archive contains 170 files, 16 fonts, public API types and required licenses/notices |
| `pnpm run docs:readme:screenshots` / `pnpm run docs:readme:screenshots:check` | 7 页 × 2 主题，14 张截图一致 / 7 pages × 2 themes, 14 matching screenshots |

文档从待提交源码的独立快照生成，再把生成结果加入索引；保留工作区已有文案和移动导航改动。并行生成校验可能竞争预览端口，最终校验串行运行。

References were generated from an independent snapshot of staged sources, then staged as generated artifacts. Existing prose and mobile-navigation edits were preserved. Concurrent checks can compete for a preview port; final verification runs serially.

`pnpm run typecheck:tests` 仍返回非零退出码，只有两处原有错误：`tests/audit/run-showcode-audit.mts:5` 的 TS2307（缺少 `demo-code` 模块）与 `tests/llm-task-runner.test.ts:227` 的 TS7006（`arg` 隐式 any）；无新增测试类型错误。

`pnpm run typecheck:tests` still exits nonzero with two pre-existing errors: TS2307 at `tests/audit/run-showcode-audit.mts:5` (missing `demo-code`) and TS7006 at `tests/llm-task-runner.test.ts:227` (implicit-any `arg`). No new test type errors were reported.
