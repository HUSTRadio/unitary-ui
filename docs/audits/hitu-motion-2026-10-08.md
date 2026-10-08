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
