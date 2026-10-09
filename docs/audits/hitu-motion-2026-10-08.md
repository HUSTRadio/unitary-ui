# Hitu + Motion verification / Hitu + Motion 接入验收

## Implementation / 实现

组件库统一根入口导出 `MotionProvider`、精简 `motion`、`AnimatePresence`、`useMotionTransition`、`HituPlayer`、相关类型，以及 `HituBox` / `HituFile`。固定常规依赖 `motion@14.0.0`，沿用依赖及子路径的 external 规则；`LazyMotion` 按需加载 `domAnimation`。没有增加包子入口。

The package root exports `MotionProvider`, slim `motion`, `AnimatePresence`, `useMotionTransition`, `HituPlayer`, their public types, and `HituBox` / `HituFile`. The regular dependency is pinned to `motion@14.0.0`; existing dependency/subpath externalization is preserved, and `LazyMotion` loads `domAnimation` on demand. No package subpath was added.

- 时序复用 feedback / state / overlay / expansive 及 `TokenOptions` 作用域，计算后的 CSS `ms` / `s` 转为秒，缓动转为 Motion 参数；缺失、非法、零时长和减少动画均即时完成。/ Timing reuses the four tiers and `TokenOptions` scope, converts computed CSS units/easing, and completes immediately for missing, invalid, zero-duration or reduced-motion values.
- Hitu 保留 SVG 图层、完整变换关键帧和 60 fps RAF 时间线。`frames` 为总帧数，120 帧对应 0–119；支持逐帧回调、暂停、重播、定位和循环。默认暂停且不循环。/ Hitu retains SVG layers, transform keyframes and a 60 fps RAF timeline. `frames` is a count: 120 means indices 0–119. Per-frame callbacks, pause, replay, seek and looping are supported; autoplay and looping default to false.
- 减少动画动态开启会完成在途 Motion 动画并停止 Hitu，Hitu 恢复初始帧。离屏、后台、场景切换、帧数变化和卸载均管理 RAF；可见性恢复只恢复仍请求播放的实例，手动暂停保持有效。/ Live reduced-motion changes finish active Motion animations and stop Hitu at its initial frame. Visibility, scene/frame-count changes and unmounting manage RAF; visibility restoration preserves playback intent and respects manual pause.
- SSR 为确定的静态帧，导入和服务端渲染不读取浏览器全局对象。装饰 SVG 默认隐藏于辅助技术，命名插画具有图像语义。/ SSR is deterministic and static without browser globals. Decorative SVGs are hidden from assistive technology by default; named illustrations expose image semantics.
- 官网介绍页在进入视口时加载演示并播放一次；既有标题、卡片和导航可先使用。通过 `EmptyState.icon` 组合插画，Motion 管外围容器，Hitu 管内部 SVG。双语 API、指南、可独立编译的 Show Code 示例、语料及 styleguide 同步。/ The introduction loads its demo at the viewport and plays once while existing content remains usable. `EmptyState.icon` composes the illustration; Motion owns the outer container and Hitu the inner SVG. Bilingual APIs, guides, standalone-compilable Show Code examples, corpus and styleguide agree.

## Provenance and maintenance / 来源与维护

[HiTu 固定来源 / pinned source](https://github.com/ant-design/HiTu/tree/92119663fb5e551ccab5d0b46532c0a3317e0cc8)：`92119663fb5e551ccab5d0b46532c0a3317e0cc8`。原型上游的生产限制仍有效；本项目维护 React 19 类型、生命周期、SSR、减少动画与 token 配色适配。完整上游 MIT 文本保留在 [vendor LICENSE](../../src/vendor/hitu/LICENSE) 及发布包双语第三方声明，逐文件来源见 [SOURCE.md](../../src/vendor/hitu/SOURCE.md)。

The upstream prototype's production warning remains applicable; this project owns the React 19, lifecycle, SSR, preference and token-color adaptation. The full upstream MIT license is retained in the vendor directory and both published notices; per-file provenance is recorded in `SOURCE.md`.

v1 仅支持具有固有尺寸的 React SVG shape 和箱子、文件资产；不包含字符串 SVG 解析、chips 子路径动画、编辑器或全量资产库。Modal、Drawer、Toast、Collapse、Tabs 的既有实现保留，未接入旧 Ant Motion 或另一套 UI 动效引擎。

v1 accepts React SVG shapes with intrinsic dimensions and the Box/File assets. SVG-string parsing, chip subpath animation, an editor and the complete asset library are outside scope. Existing Modal, Drawer, Toast, Collapse and Tabs implementations are preserved; legacy Ant Motion and a second UI motion engine were not added.

## Consumer build measurements / 消费构建测量

以下体积和独立检查记录来自整合主线之前的接入快照，基线为 `39a4d5c`；不把后续主线的材质样式变化算作 Motion/Hitu 增量。/ The measurements and standalone checks below describe the integration snapshot before merging the latest mainline, based on `39a4d5c`; later mainline material-style changes are not attributed to Motion/Hitu.

环境 / Environment: Node 24.21.0, pnpm 11.20.0, React / ReactDOM 19.2.8, Vite 8.2.1, Motion 14.0.0。

使用 [measure-motion-bundles.mjs](../../scripts/measure-motion-bundles.mjs) 构建真实包根消费者，不使用源码 alias。各例均包含 React、一个 Button 和发布 CSS；Hitu 例使用试点的两个资产及 0 / 60 / 119 关键帧，组合例另含 MotionProvider、motion、AnimatePresence 与时序 hook。Vite 生产压缩后，对所有 JS / CSS 文件分别按 gzip level 9 压缩并求和，包含 lazy chunks，不包含字体、图片和 sourcemap；这是完整输出大小，不能当作首屏传输量。

The harness builds actual package-root consumers without source aliases. Every fixture includes React, a Button and the published CSS; Hitu uses both pilot assets and the 0 / 60 / 119 keyframes, while the combined fixture adds the Motion APIs. Each emitted JS/CSS file is independently gzip-compressed at level 9 and summed, including lazy chunks. Fonts, images and sourcemaps are excluded; totals describe full output rather than initial transfer.

接入前 Button 基线来自提交 `39a4d5c4170fd7804d8eef14a92019371ae7a7fc` 的独立构建，使用相同已安装工具与消费者代码，并保留该 checkout 的 Tailwind 扫描边界。/ The pre-integration Button baseline uses an independently built checkout of that commit, the same installed tools and consumer code, and its original Tailwind scanning boundary.

| Consumer / 消费例 | JS bytes | JS gzip bytes | Δ gzip vs current Button / 相对当前 Button | Δ gzip vs pre-integration Button / 相对接入前 Button |
| --- | ---: | ---: | ---: | ---: |
| Before: Button / 接入前 | 1,117,280 | 294,484 | — | 0 |
| Current: Button / 接入后 | 1,120,492 | 295,670 | 0 | +1,186 |
| Motion | 1,211,781 | 329,464 | +33,794 | +34,980 |
| Hitu, both assets / 双资产 | 1,125,336 | 297,762 | +2,092 | +3,278 |
| Combined / 组合 | 1,216,198 | 331,362 | +35,692 | +36,878 |

接入前 CSS 为 638,258 bytes / 278,996 gzip bytes；接入后四例均为 638,305 / 278,998，增量 47 / 2 bytes。统一根入口使普通消费者也增加常规安装依赖及本次测量中的 1,186 JS gzip bytes；不承诺其他打包器零增量。

Pre-integration CSS is 638,258 raw / 278,996 gzip bytes. All four current fixtures emit 638,305 / 278,998, an increase of 47 / 2 bytes. Unified exports add a regular installation dependency and 1,186 JS gzip bytes to this ordinary consumer; no zero-cost claim is made for other bundlers.

复现 / Reproduce:

```sh
pnpm run build:lib
node scripts/measure-motion-bundles.mjs
node scripts/measure-motion-bundles.mjs --package-root <built-baseline-checkout> --sample button
```

输出与报告写入忽略的 `.scratch/motion-bundles`，不提交本机路径或构建垃圾。/ Reports and fixtures stay under ignored `.scratch/motion-bundles`; machine paths and scratch builds are not versioned.

## Observed checks / 已观察检查

以下命令均已观察退出码 0；浏览器重试显式为零。/ These commands completed with exit 0; browser retries were explicitly disabled.

| Check / 检查 | Evidence / 证据 |
| --- | --- |
| Focused Hitu / Motion tests / 定向回归 | StrictMode、零帧、帧数变化、重入回调、场景切换、清理、减少动画、作用域 token、单位及非法值、主题、多实例、ref 与 SSR；live-policy 覆盖无穷 WAAPI、零播放速率、CSS 保留及错误传播 / Lifecycle, preferences, timing, themes, refs and SSR; native completion edge cases and error propagation |
| `pnpm run test --maxWorkers=4` | 277 files / 1948 tests passed / 277 个文件、1948 项通过 |
| `pnpm run typecheck`; `pnpm run typecheck:tests` | Source, docs and test declarations passed / 源码、官网与测试类型通过 |
| `pnpm run build` | Living styleguide production build passed / 展示页生产构建通过 |
| `pnpm run test:package` | 9/9 native ESM, CJS, SSR/hydration, licenses and published CSS checks / 原生入口、hydration、许可及 CSS 通过 |
| `pnpm exec vite build docs --outDir ../.scratch/hitu-motion-docs-build` | Website production build passed; illustration and DOM features remain split / 官网生产构建通过，插画和 DOM 能力独立分块 |
| Related Playwright audit / 相关浏览器审计 | 47/47 first-run passes covering Motion/Hitu, startup, prefetch, reduced motion and selection indicators; final Motion/Hitu source rerun 12/12 and intro geometry rerun 1/1 / 相关 47 项首过，最终运行时复核 12 项及首页几何 1 项通过 |
| `node .scratch/motion-production-smoke.mjs` against production preview / 生产预览临时浏览器检查 | Introduction, Motion and Hitu × light/dark × 390/1440px: 12 cases, no browser errors; held lazy chunk leaves original introduction content usable / 三个页面 × 明暗 × 窄宽屏：12 个场景，无浏览器错误，暂扣插画分块时原有首页仍可使用 |
| `pnpm run docs:llm:generate`; `pnpm run docs:llm:check` | 120 routes × 2 languages = 240 generated pages; no drift / 120 路由 × 双语 = 240 页，无漂移 |
| `pnpm run docs:readme:screenshots`; `pnpm run docs:readme:screenshots:check` | 8 pages discovered from real navigation × 2 themes = 16 screenshots; read-only check passed; new light/dark illustration page inspected / 导航发现 8 页 × 双主题 = 16 图，只读复核通过，新插画页明暗图已检查 |
| `pnpm pack --pack-destination .scratch/package-artifacts --json`; archive inspection / 归档检查 | 191 entries, 16 fonts, ESM/CJS, declarations, lazy chunks, licenses and both notices; no demo response or workspace metadata / 入口、类型、分块、许可与字体齐全，无演示响应或工作区元数据 |
| `node --test <repository>/scripts/test-package-imports.mjs` with the unpacked final archive as cwd / 从最终解包目录执行 | 9/9 checks passed against actual archive contents / 实际归档内容的 9 项检查通过 |

相关浏览器命令 / Related browser commands:

```sh
pnpm exec playwright test tests/e2e/motion-hitu.spec.ts tests/e2e/docs-startup.spec.ts tests/e2e/prefetch.spec.ts tests/e2e/reduced-motion.spec.ts tests/e2e/selection-indicator.spec.ts --retries=0
pnpm exec playwright test tests/e2e/motion-hitu.spec.ts --retries=0
pnpm exec playwright test tests/e2e/motion-hitu.spec.ts --grep "the introduction stays usable" --retries=0
pnpm exec vite preview docs --outDir ../.scratch/hitu-motion-docs-build --host 127.0.0.1 --port 5311 --strictPort
```

生产预览验证使用本地临时 Playwright 脚本；脚本、逐 RAF 诊断与报告留在忽略的 `.scratch`，正式行为回归位于 `tests/e2e/motion-hitu.spec.ts`。检查结束后预览服务已停止。/ Production preview used a local temporary Playwright harness; it, per-RAF diagnostics and reports remain in ignored `.scratch`. Durable behavior coverage lives in `tests/e2e/motion-hitu.spec.ts`. The preview service was stopped afterward.

完整测试初次运行使用系统 Python 时缺少 Pillow；验证改为仅在该进程 PATH 中选用带 Pillow / NumPy 的已有工作区运行时，没有修改系统 Python、仓库依赖或测试要求。两个新增 Show Code 示例的站点相对翻译依赖已修为既有 `useI18n` 模式，独立编译和完整测试均通过。

The first full test attempt used system Python without Pillow. The successful run selected the existing bundled Python with Pillow/NumPy through that process's PATH only; system Python, repository dependencies and test requirements were unchanged. The two new Show Code examples now follow the existing `useI18n` pattern, with standalone compilation and the full suite passing.

生产检查的“DOM 刚挂载即必须是最终计算样式”诊断首次未通过。逐 RAF 分类确认 Motion 的跳过策略以 duration / delay 为零更新最终值，没有创建持续的 Motion 动画；既有全局减少动画 CSS 的 `0.01ms !important` 产生 `CSSTransition`，计算样式在两次渲染机会后静止，未采到中间插值。复核检查最终呈现与动画停止；保留已有 CSS 策略，不承诺挂载时同一调用栈即完成绘制。

An initial diagnostic requiring final computed styles immediately at DOM attachment failed. Per-RAF classification showed Motion's skip policy updating the final value with zero duration/delay and no sustained Motion animation. Existing global reduced-motion CSS produces a `0.01ms !important` `CSSTransition`; presentation settles within two rendering opportunities with no sampled intermediate interpolation. The follow-up checks settled presentation and animation cessation while preserving that CSS policy; same-stack painting is not guaranteed.

Styleguide 与官网生产构建仍有大于 500 kB chunk 的体积提示。按需加载及真实受控慢请求浏览器验证支持首页内容不等待插画；这里没有作跨设备性能或帧率保证。

Styleguide and website builds retain the large-chunk warning. Lazy loading and the held-request browser check demonstrate that original introduction content does not wait for the illustration; no cross-device performance or frame-rate guarantee is claimed.

## Mainline integration gate / 主线整合验证

整合主线 `3c2fe29` 后，采用其新增的统一验证入口，并将 Motion/Hitu 的运行时、EmptyState 组合、官网示例与介绍页归属登记到浏览器覆盖策略。双语独立接入指南的 4 段 TSX 已对公共声明严格编译，双语代码块和相对链接也已检查。

After integrating mainline `3c2fe29`, completion uses its new unified verification entrypoint. Browser ownership covers the Motion/Hitu runtime, EmptyState composition, documentation examples and introduction. Four standalone TSX guide snippets compile strictly against the public declarations; bilingual code blocks and relative links are checked.

```sh
pnpm run verify -- --dry-run --base 39a4d5c4170fd7804d8eef14a92019371ae7a7fc
pnpm run verify -- --base 39a4d5c4170fd7804d8eef14a92019371ae7a7fc
```

该起点包含本次已提交更改及主线整合，不以干净工作区缩小检查范围。规划器对本次共享入口、依赖、样式和官网变更选择完整单元及浏览器回归，同时检查类型、lint、三种构建、发布包、语料和全部 README 截图。每次实际运行的退出码、未执行项及原生浏览器报告保存在忽略的 `.scratch/verification/<run-id>/summary.json` 和 `browser.json`；失败或部分运行不能作为验收通过。

The starting ref includes the committed implementation and mainline integration; a clean tree does not narrow coverage. Shared entrypoints, dependencies, styles and documentation changes require full unit/browser regression, types, lint, all three builds, package checks, corpus and every README screenshot. Each actual run records exit codes, unexecuted checks and native browser evidence in ignored `.scratch/verification/<run-id>/summary.json` and `browser.json`; failed or partial runs do not establish completion.

整合验证的首轮在主线 Git 上下文回归中遇到 15 秒超时；该文件单独复核 5 项通过，降低并发后的完整单元回归为 282 个文件、2000 项通过。后续真实包 hydration 检查发现验证器的关联发现将 `NODE_ENV` 改为 `development` 且关闭后未恢复，令后续库构建错误地输出 `jsxDEV`。新进程正常执行 `pnpm run build:lib` 使用生产 `jsx` / `jsxs`，9 项包检查全部通过，证明问题来自验证器环境泄漏。修复放在发现阶段的环境恢复与回归中；包测试的生产 React 设置、超时和错误断言保留。

The first integrated run encountered a 15-second timeout in a mainline Git-context regression. Its five isolated cases passed; reducing concurrency produced 282 passing unit files and 2000 passing tests. The subsequent package hydration check exposed discovery leaving `NODE_ENV=development` after closing, making later library builds emit `jsxDEV`. A normal fresh-process `pnpm run build:lib` emits production `jsx` / `jsxs`, and all nine package checks pass, identifying a verifier environment leak. The correction restores the discovery environment with regression coverage; production React, timeouts and error assertions in the package test are retained.

后续整合主线 CI 提交 `e495477`，保留其测试输入声明、截图失败证据和开发依赖 `yaml`；Motion 仍固定为 `14.0.0` 常规依赖。上一轮统一验证的 282 个单元文件、2005 项测试及浏览器之前的全部检查通过，但完整浏览器回归发现 SplitButton 尺寸矩阵在实时示例仍显示 Loading 时立即读取数量；定向审计也确认暗色 StatusDot 有同一等待缺失。几何审计现等待真实示例挂载，并精确等待尺寸示例的六个按钮；原有尺寸、等高、贴合与颜色断言保留。该部分运行不作为完整通过，最终整合版本仍须执行上述统一入口。

The later integration includes CI commit `e495477`, retaining its test input declarations, screenshot failure artifacts and development-only `yaml` dependency; Motion remains a regular dependency pinned to `14.0.0`. The preceding unified run passed 282 unit files, 2005 tests and every check before browser regression. Full browser coverage then exposed the SplitButton size matrix reading its count while live examples still displayed Loading; focused auditing confirmed the same missing wait in dark StatusDot. Geometry audits now wait for a real demo to mount and for the size example's six buttons; size, equal-height, flush and color assertions remain. That partial run does not establish full completion; the final integrated tree must still pass the unified entrypoint above.

CI 整合后的完整回归进一步通过 284 个单元文件、2039 项测试，以及浏览器之前的全部检查；全站浏览器的前 100 项通过后，布局矩阵暴露了同类页面加载竞态。Grid 首个视口采集为空，随后五个视口均记录 12 个 Grid、13 个区块。布局导航现正向等待正文标题，组件详情还等待路由注册表对应的实时示例容器，再采集几何证据。新增两项人为暂扣页面或示例请求的回归，在旧实现均失败、修复后均通过；完整矩阵、聚合门禁、截图和原有断言保留。

The integrated CI run further passed 284 unit files, 2039 tests and every check before browser regression. After 100 passing browser cases, the layout matrix exposed the same route-loading race: Grid's first viewport was empty, while the next five recorded 12 Grids and 13 sections each. Layout navigation now positively waits for the content heading and, on component detail routes, the registry's live example container before collecting geometry. Two regressions hold route or example requests; both fail with the old barrier and pass after the fix. The complete matrix, aggregate gate, screenshots and original assertions remain.

修复后的独立布局审计 `pnpm exec playwright test tests/e2e/docs-layout.spec.ts --retries=0` 为 85/85 首轮通过；120 路由 × 6 视口 × 2 主题 = 1440 个组合，聚合检查确认齐全且无重复。新增回归仅在对应规范路由被选中时注册，遵循统一验证的定向发现契约。/ The standalone layout audit passes 85/85 without retries: 120 routes × 6 viewports × 2 themes = 1440 combinations, with complete, duplicate-free aggregate coverage. The new regressions register only when their canonical routes are selected, preserving scoped discovery.

2026-10-09 复核上一轮统一报告 `c08993ad-e57c-4e54-a428-4b731151016d`：284 个单元文件、2039 项测试及浏览器之前的全部检查通过；浏览器记录 209 项通过、3 项重试通过，EditMenu 一项失败后停止，275 项未执行。该失败在测试选区准备阶段，尚未执行浮层定位断言：夹具滚动 `window`，而文档站正文由 `#main-content` 独立滚动，浅色和深色均测得选区顶部 119.8125px，无法满足原有 `<68px` 前置条件。夹具现移动真实正文滚动容器并等待两帧，再读取选区；原有视口、重试配置、上下方空间前提、翻转和夹取断言保留。两主题原用例修复前均失败、修复后均通过；整个 EditMenu 文件 11/11 无重试通过。最终提交仍须重新通过完整统一验收，不能用这些定向结果替代剩余浏览器覆盖。

The 2026-10-09 review of unified report `c08993ad-e57c-4e54-a428-4b731151016d` confirms 284 passing unit files, 2039 tests and every check before browser regression. Browser evidence contains 209 passing cases, three retry passes, one failing EditMenu case and 275 unexecuted cases. The failure occurs while preparing the text selection, before overlay positioning assertions: the fixture scrolls `window`, while documentation content scrolls inside `#main-content`. Both themes report a selection top of 119.8125px, failing the existing `<68px` prerequisite. The fixture now moves the actual content scroller and waits two frames before measurement. Viewports, retries, upper/lower-space prerequisites, flip and clamp assertions are retained. Both original theme cases fail before the correction and pass afterward; the complete EditMenu file passes 11/11 without retries. The final commit must still pass the complete unified gate; focused results do not replace remaining browser coverage.

随后统一报告 `7e9ce1c7-432f-4b42-a262-3b53f84c469f` 再次通过 2039 项单元测试和浏览器之前的全部检查，布局聚合确认 1440 个组合完整且无失败，Motion/Hitu 浏览器用例全部通过。浏览器在 MultiSelect 键盘用例停止（338 项通过、1 项重试通过、148 项未执行）：两份 trace 显示第七次 Tab 已关闭面板，但末次焦点采样仅在关闭后 120/130ms，早于原有 150ms 退场完成。测试现停止向关闭中的面板发送 Tab，正向等待卸载和触发器聚焦，再保留原有进入/离开断言及 12 步上限。原用例独立复现失败，修复后无重试通过，测试类型检查通过；运行时未修改。

Unified report `7e9ce1c7-432f-4b42-a262-3b53f84c469f` again passes 2039 unit tests and every check before browser regression. Layout aggregation confirms all 1440 combinations without failures, and every Motion/Hitu browser case passes. Browser execution stops at the MultiSelect keyboard test (338 passes, one retry pass, 148 unexecuted cases): both traces show the seventh Tab closing the panel, but final focus reads occur only 120/130ms later, before the existing 150ms exit finishes. The test now stops sending Tab into the closing panel, positively waits for removal and trigger focus, then retains entry/exit assertions and the 12-step limit. The original case fails independently; the corrected case passes without retries, and test types pass. Runtime code is unchanged.

剩余覆盖诊断执行 149 项（含修复用例）：148 项无重试通过，唯一失败为既有材质滚动性能预算。电池供电时，首轮 Hybrid/Glass p95 为 33.4/33.4ms，重试为 33.4/50ms，均高于 20ms；滚动距离均为 360px，未报告长任务。在未接入 Motion 的干净主线 `e495477` 以同一命令独立复核，Hybrid/Glass p95 同为 66.7ms，也未通过。因此该环境下的性能失败不能据此归因于本次接入；阈值、采样及完整门禁保留，接电复核和最终统一验收仍待完成。

The remaining-coverage diagnostic runs 149 cases including the correction: 148 pass without retries, with the existing material scroll-performance budget as the sole failure. On battery power, initial Hybrid/Glass p95 values are 33.4/33.4ms and retry values 33.4/50ms, exceeding 20ms. All scroll distances are 360px, with no reported long tasks. An independent run of the same command on clean mainline `e495477`, without Motion integration, also fails with Hybrid/Glass p95 values of 66.7ms. This environment's failure does not establish a regression from this integration. Thresholds, sampling and the complete gate are retained; external-power retesting and final unified verification remain pending.

```sh
pnpm exec playwright test -c playwright.config.ts tests/e2e/texture.spec.ts --grep 'local material rendering records warmed scroll frame times' --retries=0
```

2026-10-09 接电后的同阈值复测仍失败（Hybrid/Glass p95 为 33.4/50ms）；关闭 trace 的诊断也失败（33.3/33.4ms），因此没有更改录制设置。浏览器诊断确认默认 headless shell 的 GPU 合成为软件模式，而 [Playwright 官方的新无头模式](https://playwright.dev/docs/browsers#chromium-new-headless-mode)（`channel: "chromium"`）使用完整 Chromium，可启用硬件合成。仅切换该模式、保留 trace 与原有预算的对照无重试通过：Solid、Hybrid、Glass p95 均为 16.8ms，滚动距离均为 360px，未报告长任务。

The 2026-10-09 external-power retest still fails at the unchanged threshold (Hybrid/Glass p95: 33.4/50ms); a trace-disabled diagnostic also fails (33.3/33.4ms), so recording settings are retained. Browser diagnostics identify software GPU compositing in the default headless shell. [Playwright's official new headless mode](https://playwright.dev/docs/browsers#chromium-new-headless-mode), selected with `channel: "chromium"`, uses full Chromium and can enable hardware compositing. Changing only that mode while retaining trace and the budget passes without retries: Solid, Hybrid and Glass each record p95 of 16.8ms, scroll distance of 360px and no long tasks.

正式浏览器配置采用该模式；CI 与 nightly 已执行 `pnpm exec playwright install --with-deps chromium`，安装完整浏览器。仅安装 headless shell 的本地环境须补装 Chromium。该对照支持修正审计后端，并不保证其他硬件的帧率；阈值、完整主题/视口矩阵、重试次数及失败证据均保留。最终签名提交仍须通过上述完整统一验收。

The browser configuration adopts this mode. CI and nightly already run `pnpm exec playwright install --with-deps chromium`, installing the full browser; local environments that installed only the headless shell must install Chromium. This comparison supports correcting the audit backend, without guaranteeing frame rates on other hardware. Thresholds, the complete theme/viewport matrix, retries and failure artifacts are preserved. The final signed commit must still pass the complete unified gate above.

正式配置的 `pnpm run typecheck:tests` 退出码为 0；`pnpm exec playwright test -c playwright.config.ts tests/e2e/texture.spec.ts --retries=0` 为 39/39 无重试通过，包含明暗、双语、移动/桌面、材质像素、浮层交互、回退与原有滚动性能预算。/ The final configuration passes test type checking (exit 0) and the complete texture file (39/39, no retries), covering both themes/languages, mobile/desktop, material pixels, overlay interactions, fallbacks and the original scroll-performance budget.

## Completed verification / 完成验收

2026-10-09，提交 `4d1144ce` 以原始起点 `39a4d5c4170fd7804d8eef14a92019371ae7a7fc` 执行完整统一验收：15 个执行步骤全部通过，退出码 0，验证期间输入未变。284 个单元文件、2039 项测试通过；原生浏览器报告覆盖全部 47 个规格文件、488 项用例，其中 487 项首轮通过，1 项既有 Feedback Inline 几何用例重试通过，零最终失败、零跳过、零缺失及未完成项。该用例在早期报告中也曾同断言重试通过；保留 flaky 记录，不宣称全量首过。

On 2026-10-09, commit `4d1144ce` passes the complete unified gate against the original starting ref `39a4d5c4170fd7804d8eef14a92019371ae7a7fc`: all 15 execution steps pass, exit 0, with unchanged inputs. All 284 unit files and 2039 tests pass. Native browser evidence covers all 47 spec files and 488 cases: 487 first-run passes and one existing Feedback Inline geometry case passing on retry, with zero final failures, skips, missing files or incomplete cases. Earlier evidence records the same assertion passing on retry; the flaky record is retained rather than claiming every case passed on its first attempt.

布局 JSON 与逐项记录独立复核为 120 路由 × 6 视口 × 2 主题 = 1440 个唯一组合，零缺项、重复或失败。Motion/Hitu 的 12 项行为用例全部首轮通过；最终完整运行中的 Solid、Hybrid、Glass 滚动 p95 均为 16.8ms，保留 20ms 预算，均滚动 360px，且无长任务。发布包 9 项检查、240 页双语语料及 16 张 README 截图检查全部通过；真实发布归档的 183 个构建文件与验收构建逐字节一致。

Independent checks of the layout JSON and per-case records confirm 120 routes × six viewports × two themes = 1440 unique combinations, with zero missing, duplicate or failing combinations. All 12 Motion/Hitu behavior cases pass on the first attempt. Solid, Hybrid and Glass each record a final full-run scroll p95 of 16.8ms under the retained 20ms budget, with 360px scroll distance and no long tasks. All nine package checks, 240 bilingual corpus pages and 16 README screenshot checks pass; all 183 build files in the actual release archive match the verified build byte for byte.

随后经用户授权将另一任务的 Context7 代理修复单独提交为 `13d6a663`，签名整合为 `0d7bd5e7`。相对完整验收树仅有 runner 代理白名单与其测试的两文件、14 行新增，未改变组件、样式、官网、依赖或发布输入。以 `4d1144ce` 为起点执行新增差异的统一验收，规划器选择 15 个相关单元文件、158 项测试及 lint、token、两类类型检查和应用构建；六个执行步骤均通过，退出码 0，输入未变。浏览器、官网、语料、截图及包的输入保持一致，沿用上述完整证据。

The user subsequently authorizes a separate Context7 proxy fix as signed commit `13d6a663`, integrated by signed merge `0d7bd5e7`. Its only difference from the fully verified tree is 14 added lines in the runner proxy allowlist and its test; components, styles, website, dependencies and release inputs are unchanged. Unified delta verification against `4d1144ce` selects 15 related unit files and 158 tests, lint, tokens, both type checks and the application build. All six execution steps pass, exit 0, with unchanged inputs. Browser, website, corpus, screenshot and package inputs remain identical, preserving the complete evidence above.

```sh
pnpm run verify -- --base 4d1144ce607ecc1d59aa232bcaf3bfe51d19d848
```
