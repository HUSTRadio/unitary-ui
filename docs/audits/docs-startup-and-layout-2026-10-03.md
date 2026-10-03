# 文档加载与顶栏布局验证 / Docs startup and topbar layout verification

日期 / Date: 2026-10-03

## 原因与修复 / Causes and changes

- 文档入口提前导入所有演示及配对源码，直接访问单个组件也需要加载全部示例。现在页面按导航加载，演示从同一份 canonical registry 按组件生成独立模块；标题、说明与导航可先显示。/ The entry eagerly imported all demos and their paired sources, including on component deep links. Pages now load on navigation, and component-specific modules derive from the same canonical registry. Headings, guidance and navigation remain available while demos load.
- 文档站与根展示页共用开发依赖缓存，两个服务同时运行时会出现 `Outdated optimize dep`。文档站现使用独立缓存目录。/ The docs and root styleguide shared an optimizer cache, producing `Outdated optimize dep` when both servers ran. Docs now use a separate cache directory.
- Sticky Navbar 已在 flex 布局中占据 64px，main 的额外 64px margin 和侧栏的 sticky top 又重复偏移。现在 main 紧接顶栏，侧栏相对 main 使用 `top: 0`，高度跟随动态视口。/ Sticky Navbar already occupies a 64px flex row. An additional main margin and sidebar sticky offset repeated that space. Main now starts at the navbar's bottom; the sidebar sticks at main's top and uses the dynamic viewport height.
- 语料生成等待真实标题和演示完成，避免将“加载中”导出为页面正文。/ Corpus generation waits for the actual heading and completed examples, preventing loading placeholders from becoming exported page content.

## 测速 / Measurements

Chromium，1440×900，同机串行运行，每个地址先预热服务器转换，再用三个全新浏览器上下文关闭网络缓存，取中位数。基线恢复 `7856377` 的入口和组件页面 JavaScript 导入结构，其他文件保持当前状态；此对照只衡量加载性能。时间包含导航至实际可见标题或演示的等待。/ Chromium at 1440×900, measured sequentially on the same machine. Server transforms were warmed first; three fresh browser contexts with network caching disabled supplied the medians. The baseline restored the entry and component-page JavaScript import structure from `7856377`, leaving other files current; this comparison measures loading only. Times include navigation until the actual heading or demo becomes visible.

| 页面 / Page | 标题出现：之前 → 之后 / Heading: before → after | 资源请求 / Requests | 示例相关请求 / Example-related requests |
| --- | --- | --- | --- |
| 首页 / Home | 1574ms → 506ms | 1087 → 75 | 857 → 0 |
| 组件索引 / Component index | 1470ms → 724ms | 1086 → 117 | 857 → 1 |
| Carousel 直接访问 / Deep link | 1522ms → 877ms | 1089 → 127 | 857 → 6 |

索引页的一个示例相关请求仅为轻量加载器列表，不包含演示；Carousel 的六个请求为加载器、组件模块、两个实际示例及两份配对源码。首页不请求示例，Carousel 不请求其他组件示例。/ The index's one example-related request is the lightweight loader list, with no demos. Carousel's six requests comprise that list, its component module, two demos and two paired sources. Home requests no examples; Carousel requests no unrelated component examples.

Carousel 演示就绪中位数为 1526ms → 885ms。开发模式传输量为 28.11MB → 15.72MB。生产预览独立测得标题 569ms、演示 575ms、约 0.54MB 总传输量；这些本机数据不代表远程网络或服务器冷启动。所有测量均无页面运行错误。/ Carousel's live-demo median fell from 1526ms to 885ms, with dev transfer size falling from 28.11MB to 15.72MB. A separate production-preview measurement recorded a 569ms heading, a 575ms live demo and about 0.54MB total transfer. These local results do not represent remote networks or cold server startup. All measured navigations had no page errors.

## 验证 / Validation

浏览器回归覆盖明暗主题、390/1440px、直接访问、故意延迟模块请求、加载期间返回首页、前进后退、演示源码和缓存复用；布局验证直接比较顶栏底边、main 顶边和侧栏顶边，并检查 main 滚动时顶栏与侧栏位置。生产构建的 Carousel 也已实际打开。/ Browser regressions cover both themes, 390/1440px, deep links, deliberately delayed modules, returning home while loading, history navigation, Show Code and cache reuse. Geometry assertions compare navbar bottom, main top and sidebar top, then verify navbar/sidebar placement while main scrolls. The production Carousel was also opened in a real browser.

以下检查均返回退出码 0。完整单元回归为 258 个文件、1700 项测试；浏览器覆盖 23 项独立用例，其中布局用例随动画兼容检查再次通过。/ All checks below returned exit code 0. The full unit suite passed 258 files and 1700 tests. Browser coverage included 23 distinct tests; layout cases also passed again alongside the animation compatibility checks.

- `pnpm run typecheck`
- `pnpm run typecheck:tests`
- `pnpm run test --maxWorkers=4`
- `pnpm exec vite build docs --outDir ../.scratch/docs-startup-build`
- `pnpm exec playwright test -c playwright.config.ts tests/e2e/docs-startup.spec.ts tests/e2e/docs-layout-tokens.spec.ts`
- `pnpm exec playwright test -c playwright.config.ts tests/e2e/docs-layout-tokens.spec.ts tests/e2e/carousel-variants.spec.ts`
- `pnpm exec playwright test -c playwright.config.ts tests/e2e/overlay-route-dismiss.spec.ts --retries=0`
- `pnpm run docs:llm:generate`
- `pnpm run docs:llm:check`
- `pnpm run docs:readme:screenshots:check`

语料生成覆盖 114 条路由 × 2 种语言，共 228 页；正文与 Show Code 内容保持一致，无生成文件改动。截图校验覆盖 7 个展示页面 × 2 种主题。/ Corpus generation covers 114 routes in two languages, or 228 pages. Body and Show Code content remain unchanged, with no generated-file changes. Screenshot verification covers seven styleguide pages in two themes.
