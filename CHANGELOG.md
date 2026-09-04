# Changelog

[English version → CHANGELOG.en.md](./CHANGELOG.en.md)

本项目所有值得注意的变更都记录在本文件中。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循语义化版本。

## [Unreleased]

### Added

- **Raw color 治理门禁**：新增 `tests/raw-color-governance.test.ts`（4 条测试）与 `tests/audit/raw-color-allowlist.json`（72 条 2026-09-04 基线存量字面量）双向咬合白名单账本，防止组件源码引入新的硬编码颜色字面量。
- **BottomSheet 与 ErrorBoundary 文档**：补全 `BottomSheetProps`、`ErrorBoundaryProps` 的包根类型导出，并为两个组件新增双语 API 参考、最佳实践、可运行示例与 LLM 参考页面。
- **组件公共导出与 API 参考完善**：包根入口新增导出 `ContextMenuTrigger`、`ContextMenuContent`、`FieldsetFooterActions`、`ErrorText`、`WarningText` 与 `DisabledWall`；组件 API 注册表、双语指南与 LLM 参考同步覆盖这些导出及相关真实属性。
- **双语组件指南注册表**：75 个组件全部具备简体中文（主）与英语（替代）结构化指南（何时使用 / 何时不应使用 / 示例索引 / 无障碍 / 受控行为 / 响应式 / 主题），示例引用真实存在的 demo key；接入组件文档页渲染。
- **LLM 参考语料**：`docs/llm/` 为 84 条文档路由 × 2 语言生成 168 份 Markdown 页面与机器可读索引 `index.json`（含内容哈希）；`docs:llm:generate` / `docs:llm:check` 命令与漂移检查。
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
- **Show Code 单源迁移（breaking）**：用物理 `.example.tsx` 文件替代手写的 `demo-code*.ts` 字符串真源；`docs/geist/src/examples/` 下 374 个可运行示例组件通过 `?example-source` 虚拟模块同时为实时渲染与展示源码提供唯一真源，并注册到 `EXAMPLE_REGISTRY`；同步删除 29 个 demo-code 分片。该变更改变文档示例的模块形式，依赖旧 `DEMO_CODE` 分片的下游引用需要迁移。
- **文档演示库存保留（不重复渲染）**：示例注册表新增 `renderInSection` 元数据：20 条 primary-only 记录保留物理 `.example.tsx` 源码与 Show Code 可见性，但不再作为重复区块渲染（迁移曾引入 7 个组件的重复未本地化演示）；补回缺失的 Video default 示例，修复该路由 live demo 不可见与 LLM 文档爬取超时。
- **16 px 文档节奏**：文档页中的 live demo、额外 demo 区与 API 参考区块统一通过 `DocsBlock` 作为 16 px 节奏 owner，消除零散的 `mt-5/mt-6/mt-8/mt-10`。
- **命令搜索双语键盘流**：Command Menu 支持中英文关键词搜索，中文 UI 下仍可用英文关键词检索；新增上下键 + Enter 键盘选择、无结果空态与 Esc 关闭。
- **组件几何验收 E2E**：新增 SplitButton minor 方形等高贴缝、StatusDot 五态色可分辨、StepPoint 外圈 16/内点 6 居中、Textarea 80/100/120 高度、Toast action 32 px 垂直居中等 Playwright 几何验收；随后扩充为尺寸矩阵（32/36/40）、深色主题状态点、Toast 48 px 最小高度与 420 px 最大宽度、16 px 节奏三点实测、Table 双 frame 圆角 owner 与列分隔线正交性，以及英文 UI 中文关键词命令搜索。
- **调色盘治理**：将 Vercel Geist Colors 声明为唯一调色板来源；浅色主题 red-400/amber-400 对齐官方快照；新增 color-palette-governance 测试对双主题 92 色阶与 Geist 快照逐字节一致，并锁定基础色阶白名单。
- **Table 扩展 API**：API 注册表新增 `TableRoot` 的 `frame` 与 `Table` 的 `columnDividers` 属性；`frame="none"` 时 `TableRoot` 仍保留 8 px 圆角 owner；示例补充无框与列分隔线展示。

### Changed

- **`LoadMoreButton` 颜色语义化**：将 `src/components/ui/load-more-button.tsx` 中 12 处硬编码灰色 raw literal（`#f2f2f2` / `#8f8f8f` / `#1a1a1a` 等，含 6 个 `dark:` 变体）迁移为 2 个主题感知语义 token（`gray-100` 5 处、`gray-700` 3 处），同时移除 6 个 `dark:` 变体；双主题下渲染结果视觉等价。
- **包根公开面收敛（breaking）**：`ExpandPanel`、`Grabber`、`PhoneStatusBar` 与 `PhoneSafariChrome` 不再从包根导出，继续作为 HamburgerMenu、BottomSheet 与 Device 的内部实现；补齐 Navbar、SidebarNav、Footer 与 RatingPill 的公开 Props/数据类型导出，并移除未进入组件注册表的死 API 数据。
- **Device 成为规范设备外框文档入口**：原 Phone 页面迁移为支持 iPhone、Pixel、Galaxy 与 iPad 型号的 Device 页面；旧 `/components/phone` URL 保留兼容映射，运行时 `Phone` 别名继续用于迁移现有 iPhone 17 调用。
- **字体栈策略**：@font-face 全部改名 Subset 后缀，系统优先字体栈（已装 OPPO Sans / HarmonyOS Sans 零下载命中系统字体，未装回退自托管分级子集）；根元素 `data-font-tier="oppo|hmos|system"` 手动档位声明；档位切换防抖 120ms 重测（幂等）。
- **Table 默认对齐（breaking）**：`TableHead` / `TableCell` 删除隐式 `last:text-right`，默认全左对齐与官方 Geist 一致；依赖旧隐式右对齐的数值列需显式 `align="right"` 或 `text-right`。
- 发布边界：`files` 增加 `LICENSE`、`LICENSE.zh-CN.md` 与双语第三方声明；字体子集随 `dist` 分发（许可状态见 THIRD_PARTY_NOTICES）。
- 发布包改为外置 npm 依赖、不生成 sourcemap，并清理残留 demo/app 产物；全部 15 个处理后字体子集继续随包提供，Maple OFL-1.1 原文随包，README 明示 OPPO Sans / HarmonyOS Sans 再分发证据风险。
- LLM 生成器每次选择可用端口并启动独占 preview，不再复用可能过期的服务；生成 Markdown 保持 formatter 稳定。
- `AGENTS.md` 收敛为可移植的仓库级 LLM 入口，链接 canonical 源码、Geist 文档与 `docs/llm/index.json`，移除个人环境、签名身份和特定 Agent 工具绑定。
- 版本化 agent 任务包硬迁移到顶层 `.agents/`，不保留旧目录兼容入口；runner、schema、prompt discovery、pre-push 影响路径、合同测试与 Git 忽略/换行策略同步使用新路径。
- pre-push 将 README 截图漂移检查与既有文档 / LLM 更新 gate 合并为单一编排器：真实变更路径是唯一放行判定依据，Angular / Conventional Commit 的 type 与 scope 仅作为诊断信号，不能覆盖路径判断；截图漂移时自动生成受管文件并中止 push，所有阻断都会说明未完成的操作和恢复步骤，等待人工复核、提交并重推。
- Living styleguide 示例改用当前组件 API 与真实动作语义；`docs-update` 任务现在可在受限范围内同步 `src/App.tsx`、`src/examples/**` 和受管截图，并将截图零漂移纳入确定性校验。
- **AI 文档 pre-push 传输方式**：超过 8000 字符的 docs-update prompt 现在通过 `codex exec` 的 stdin 通道传输，修复 Windows 首次 push 时 `CreateProcess` 命令行超限导致的 `ENAMETOOLONG`。

### Fixed

- **Textarea 尺寸 padding 计划值**：small/medium/large 的水平/垂直 padding 分别修正为 10/8、12/10、14/12 px，与设计稿一致。
- **StepPoint active inner 稳定 data-slot**：活动状态内点增加 `data-slot="step-dot-active-inner"`，使 E2E 和测试能稳定定位。
- **example-source 插件 fail-closed**：插件现在基于 TypeScript AST 验证 `.example.tsx` 源码，对空文件、语法错误、缺少导出、重复导出或无效查询执行 fail-closed。
- **README workflow 截图重新生成**：基于当前 living styleguide 重新生成 workflow 截图，`docs:readme:screenshots:check` 零漂移。

- **Device chrome 能力告警**：仅在所选型号确实不支持 `statusBar`、`safari` 或 `dynamicIsland` 时输出开发环境警告，避免 iPhone 17 的合法 chrome 配置被误报为已忽略。
- **AI 文档 pre-push 收尾**：runner 以 Codex 主进程 `exit` 作为完成边界并主动关闭管道读取端，避免遗留 helper 持有 stdout/stderr 时一直等待 `close` 到超时。
- **Geist parity 修复（14 项，Playwright 现场验证）**：内联错误文字收敛为 `--error-foreground`；`--link` 修正为官方 `#0072f5`；Entity 描述、JsonView 标点、Textarea/Input 输入文字、Badge pill 文字颜色对齐官方；FileTree label 与 Video 时间戳排版补齐；Drawer/Modal 触发按钮改为默认黑底白字；文档页 H1 响应式字号（移动端 24px / 桌面 40px）。
- 工具修复：AI 文档 runner 拒绝 `--sandbox` 与 `--approve-for-me` 同时配置（两标志互斥，approve-for-me 隐含 workspace-write 沙箱）。
- Hook 安全加固：生产环境固定 Codex 模板与确定性校验，最小环境白名单，抑制 Agent 原始 stderr，并检测既存未跟踪文件及 Git 元数据改写；紧急 skip 返回 Git 可用的成功码并保留高可见警告。
- 文档准确性：修正 Button、Toast、Progress、Feedback 的 API/guide 描述，使其与真实导出和 props 一致；Middle Truncate demo 限制移动端宽度，结构化指南卡片允许长路径换行，消除 320px 视口横向溢出。
- Input 前后缀改为无缝三段式布局，并在禁用态保留 styled affix 的固定修饰语义；Select 现在将显式或可见标签正确关联到触发按钮。示例页同时修复筛选后批量选择、重置动作和表头语义。
