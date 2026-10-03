# Pagination, media and mobile navigation verification / 验证记录

Date / 日期：2026-10-03

## Changes / 改动

- Mobile docs navigation has one working search entry and symmetric 12px topbar insets. / 移动文档导航保留一个有效搜索入口，顶栏两侧使用对称 12px 边距。
- ExpandPanel retains its exiting node and reverses the current CSS transition. Rapid reopen cancels stale unmounts and skips replaying item entrances; Escape restores trigger focus. / ExpandPanel 退出时保留节点并从当前过渡进度反转；快速重开取消旧卸载、跳过条目重复入场，Escape 恢复触发按钮焦点。
- NumberedPagination adds numbered result pages and ellipses alongside the existing previous/next document rail. / NumberedPagination 新增数字页码与省略号，保留现有文档前后页导航。
- Carousel shares horizontal FullPageScroller gestures. Arrow controls optionally wrap; gestures stop at the ends. / Carousel 复用横向整屏滚动手势，方向按钮可循环，手势在边界停止。
- FullPageScroller supports wheel/touch thresholds, momentum suppression, nested scrolling, keyboard navigation and a real fullscreen demo. / 整屏滚动支持滚轮及触摸阈值、惯性抑制、内部滚动、键盘操作与真实全屏演示。
- LazyLoad defers a subtree until intersection, reserves dimensions in its demo and retains mounted content. / LazyLoad 在相交后挂载内容子树，演示预留占位尺寸并保留已挂载内容。
- Package exports, types, bilingual API tables and guides, Show Code, generated LLM pages and living styleguide screenshots are synchronized. / 包导出、类型、双语 API 与指南、Show Code、LLM 页面及展示页截图已同步。

## Validation / 验证

All passing commands below returned exit 0. / 以下通过的命令均返回退出码 0。

| Command | Observed result / 实测结果 |
| --- | --- |
| `pnpm exec vitest run --maxWorkers=4` | 251 files, 1651 tests passed / 251 个文件、1651 项测试通过 |
| `pnpm run typecheck` | Application and library source types pass / 应用与库源码类型通过 |
| `pnpm run build` | TypeScript and production app build pass / TypeScript 与生产应用构建通过 |
| `pnpm exec playwright test tests/e2e/paged-media.spec.ts tests/e2e/docs-mobile-navigation.spec.ts tests/e2e/hamburger-menu-states.spec.ts tests/e2e/nav-surface-parity.spec.ts --retries=0` | 14 browser tests pass / 14 项浏览器测试通过 |
| `pnpm run test:package` | Library build and 4 native ESM/CJS/SSR/CSS consumer tests pass / 库构建及 4 项包消费测试通过 |
| `pnpm pack --out .scratch/unitary-ui-final.tgz` | Actual archive inspected: 168 files, 16 fonts, required licenses/notices, entry points and types; no demo or scratch assets / 实际包含 168 个文件、16 个字体及必要许可、入口与类型，无演示或临时资源 |
| `pnpm run docs:llm:generate` | 113 routes in each language, 226 pages generated / 每种语言 113 条路由，共生成 226 页 |
| `pnpm run docs:llm:check` | Deterministic, no drift / 确定性验证通过，无漂移 |
| `pnpm run docs:readme:screenshots` | 6 pages × 2 themes / 6 个页面 × 2 种主题 |
| `pnpm run docs:readme:screenshots:check` | Screenshot and README managed sections match / 截图与 README 管理区一致 |

The unit suite's image utilities used the bundled Python runtime on the command's scoped PATH; repository configuration was unchanged. / 单元测试图片工具使用命令级 PATH 中的内置 Python，未修改仓库配置。

Browser coverage includes light/dark themes, 320/390/767px navigation, narrow and desktop media demos, real rapid pointer clicks, wheel thresholds, actual touch input, fullscreen dimensions, reduced motion, lazy-load geometry and horizontal overflow checks. / 浏览器覆盖双主题、320/390/767px 导航、窄屏与桌面媒体演示、真实快速点击、滚轮阈值、真实触摸、全屏尺寸、减少动画、延迟加载几何及横向溢出。

## Existing test typecheck failures / 原有测试类型错误

`pnpm run typecheck:tests` returned exit 1; its TypeScript child returned exit 2. Two errors remain in files unchanged by this task and already present at the starting revision `f8b1d67`:

`pnpm run typecheck:tests` 返回退出码 1，TypeScript 子进程返回 2。以下两处错误已存在于起始版本 `f8b1d67`，本任务未改动这些文件：

- `tests/audit/run-showcode-audit.mts:5` — TS2307, missing `../../docs/site/src/data/demo-code`.
- `tests/llm-task-runner.test.ts:227` — TS7006, implicit `any` parameter `arg`.

These errors are separate from the passing source typecheck and production build. / 这两处错误与已通过的源码类型检查、生产构建分别记录。

## Carousel variants follow-up / Carousel 效果扩展

- Adds `CarouselVariant` and `variant`: default `slide`, constant-rate `fade-linear`, eased `fade`, and `fade-scale` (1.04 to 1). / 新增 `CarouselVariant` 与 `variant`：默认滑动、匀速淡入淡出、缓入缓出，以及从 1.04 缩放到 1 的淡入淡出。
- Effects share existing paging gestures, retain the current image when changed, reverse from current animation progress and respect reduced motion. / 所有效果复用翻页手势，切换效果保留当前图片，中途反转延续当前进度，并支持减少动画。
- Real browser samples at 20% transition time measured opacity 0.20 for linear fade and approximately 0.08 for ease-in-out. / 浏览器在过渡时长 20% 处实测，线性透明度为 0.20，缓入缓出约为 0.08。
- Focused component, API, bilingual parity and translation-source checks passed: 4 files, 40 tests, exit 0. / 组件、API、双语与翻译源码检查通过：4 个文件、40 项测试，退出码 0。
- `pnpm exec playwright test tests/e2e/carousel-variants.spec.ts tests/e2e/paged-media.spec.ts --retries=0 --max-failures=1`: 12 passed, exit 0, covering both themes, 320/1280px layouts, interrupted fades, actual touch and reduced motion. / 12 项测试通过，覆盖双主题、320/1280px 布局、中途反转、真实触摸及减少动画。
- Production build, native package tests, generated corpus check and screenshot check passed with exit 0. The packed archive contains the new exported variant types and retains 16 fonts and required licenses/notices. / 生产构建、原生包测试、生成文档及截图检查均返回 0；打包产物包含新导出的效果类型，并保留 16 个字体与必要许可及声明。
- The same two pre-existing `typecheck:tests` errors above remain; no new test type errors were reported. / 测试类型检查仍为上文两处原有错误，没有新增错误。
