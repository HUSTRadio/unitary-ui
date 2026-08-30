# Changelog

[English version → CHANGELOG.en.md](./CHANGELOG.en.md)

本项目所有值得注意的变更都记录在本文件中。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循语义化版本。

## [Unreleased]

### Added

- **双语组件指南注册表**：73 个组件全部具备简体中文（主）与英语（替代）结构化指南（何时使用 / 何时不应使用 / 示例索引 / 无障碍 / 受控行为 / 响应式 / 主题），示例引用真实存在的 demo key；接入组件文档页渲染。
- **LLM 参考语料**：`docs/llm/` 为 82 条文档路由 × 2 语言生成 164 份 Markdown 页面与机器可读索引 `index.json`（含内容哈希）；`docs:llm:generate` / `docs:llm:check` 命令与漂移检查。
- **LLM 语料说明**：新增 `docs/llm/README.md` 与英文替代版本，说明 canonical source、索引结构、生成与零漂移校验流程。
- **版本化 LLM 任务包**：`.agents/registry.json` 注册任务 manifest；安全、Git、文档策略与任务专属提示词按 manifest 顺序组装；统一 `llm` CLI 提供 list/check/dry-run/manual，pre-push 仅负责 Git ref 上下文适配。LLM 无需执行命令即可从 `AGENTS.md` 与 `.agents/README.md` 直接定位提示词路径。
- **MIT 许可证与归属**：英文 `LICENSE`（法律权威）+ 简体中文阅读入口 `LICENSE.zh-CN.md`（非官方、非约束性）；`CREDITS.md` / `CREDITS.en.md` 与 `THIRD_PARTY_NOTICES.md` / `THIRD_PARTY_NOTICES.en.md` 双语归属与第三方声明；npm 发布清单纳入许可证与第三方声明。
- **双语 README**：`README.md`（简体中文）与 `README.en.md`（英语）提供安装、最小用例、文档入口和 living styleguide 双主题截图；LLM 仅通过顶部的 `AGENTS.md` 链接进入专用文档。
- **README 示例图片生成器**：`docs:readme:screenshots` 从 living styleguide 顶部导航自动发现页面，并以固定 1440×900 视口为每页生成 light / dark 截图；`docs:readme:screenshots:check` 提供 formatter-stable 漂移检查。
- **文档合同测试**：组件文档完整性、双语 parity、LLM 语料导出、许可证、README/AGENTS、changelog 合同。
- 字体度量探针 `src/lib/font-metrics.ts`（自注册 + `useFontMetrics` hook）与档位契约测试。
- 导航壳层组件族（框架扩展）：Navbar / SidebarNav / Footer / HamburgerMenu / ExpandPanel / BottomSheet，统一 500ms cubic-bezier(0.32,0.72,0,1) 动画与 motion-reduce 降级，受控/非受控双模。
- 壳层断点例外：侧栏断点保持 lg(1024px)（有意偏离官方 xl(1200px)，服务 VS Code 内嵌浏览器场景）。
- Button 按压态（Apple HIG 要求）与默认最小宽度（min-w = 高度 × 2.2）；Progress label/labelPosition 8 方位标签与 300ms 过渡。
- `docs/geist/src/__tests__/parity-regression.test.ts`：parity 修复的源码断言回归测试。

### Changed

- **字体栈策略**：@font-face 全部改名 Subset 后缀，系统优先字体栈（已装 OPPO Sans / HarmonyOS Sans 零下载命中系统字体，未装回退自托管分级子集）；根元素 `data-font-tier="oppo|hmos|system"` 手动档位声明；档位切换防抖 120ms 重测（幂等）。
- **Table 默认对齐（breaking）**：`TableHead` / `TableCell` 删除隐式 `last:text-right`，默认全左对齐与官方 Geist 一致；依赖旧隐式右对齐的数值列需显式 `align="right"` 或 `text-right`。
- 发布边界：`files` 增加 `LICENSE`、`LICENSE.zh-CN.md` 与双语第三方声明；字体子集随 `dist` 分发（许可状态见 THIRD_PARTY_NOTICES）。
- 发布包改为外置 npm 依赖、不生成 sourcemap，并清理残留 demo/app 产物；全部 15 个处理后字体子集继续随包提供，Maple OFL-1.1 原文随包，README 明示 OPPO Sans / HarmonyOS Sans 再分发证据风险。
- LLM 生成器每次选择可用端口并启动独占 preview，不再复用可能过期的服务；生成 Markdown 保持 formatter 稳定。
- `AGENTS.md` 收敛为可移植的仓库级 LLM 入口，链接 canonical 源码、Geist 文档与 `docs/llm/index.json`，移除个人环境、签名身份和特定 Agent 工具绑定。
- 版本化 agent 任务包硬迁移到顶层 `.agents/`，不保留旧目录兼容入口；runner、schema、prompt discovery、pre-push 影响路径、合同测试与 Git 忽略/换行策略同步使用新路径。
- pre-push 将 README 截图漂移检查与既有文档 / LLM 更新 gate 合并为单一编排器：真实变更路径是唯一放行判定依据，Angular / Conventional Commit 的 type 与 scope 仅作为诊断信号，不能覆盖路径判断；截图漂移时自动生成受管文件并中止 push，所有阻断都会说明未完成的操作和恢复步骤，等待人工复核、提交并重推。

### Fixed

- **Geist parity 修复（14 项，Playwright 现场验证）**：内联错误文字收敛为 `--error-foreground`；`--link` 修正为官方 `#0072f5`；Entity 描述、JsonView 标点、Textarea/Input 输入文字、Badge pill 文字颜色对齐官方；FileTree label 与 Video 时间戳排版补齐；Drawer/Modal 触发按钮改为默认黑底白字；文档页 H1 响应式字号（移动端 24px / 桌面 40px）。
- 工具修复：AI 文档 runner 拒绝 `--sandbox` 与 `--approve-for-me` 同时配置（两标志互斥，approve-for-me 隐含 workspace-write 沙箱）。
- Hook 安全加固：生产环境固定 Codex 模板与确定性校验，最小环境白名单，抑制 Agent 原始 stderr，并检测既存未跟踪文件及 Git 元数据改写；紧急 skip 返回 Git 可用的成功码并保留高可见警告。
- 文档准确性：修正 Button、Toast、Progress、Feedback 的 API/guide 描述，使其与真实导出和 props 一致；Middle Truncate demo 限制移动端宽度，结构化指南卡片允许长路径换行，消除 320px 视口横向溢出。
