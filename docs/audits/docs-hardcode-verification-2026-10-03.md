# docs 硬编码审计核验与修复 / Docs hardcode verification and fixes

核验日期：2026-10-03。基线：`master` / `b9de045`。原报告：[docs-hardcode-audit-2026-10-03.md](./docs-hardcode-audit-2026-10-03.md)。原报告保留，本文记录核验结果与实际处理。

## 核验结论

原报告识别出的外壳尺寸重复和反馈分页断点重复确实存在，属于维护性问题。它把注释、规格文案、组件间接消费和站点样式混在一起统计，因此“约 18 处 P0”和“12 个死 token”的结论不能直接成立。

基线统计覆盖 `docs/site/src` 下所有 `.ts` / `.tsx`，包括声明文件、注释和测试。数值单位按 `\d+(?:\.\d+)?px` 计数，hex 按 `#[\da-f]{3,8}\b` 计数；这些是文本出现次数，不是样式缺陷数量。

| 指标 | 基线核验 | 原报告需要修正的地方 |
| --- | --- | --- |
| TS / TSX 文件 | 484 / 其中 TSX 446 | 不是 485；examples 的 428 个文件占约 88.4%，不是 96% |
| 数字后接 px | 276 | 可以复现；包含注释、代码示例与规格描述 |
| hex 色值 | 56 | 可以复现；不能据此认定全是需要替换的颜色 |
| 字符串 / 模板静态文本中的 px | 237 | 排除注释后仍包含双语文案和代码样本，不等于 CSS 数量 |
| `var(` 文本 | 44 | 原报告的 39 没有可复现的完整扫描口径 |
| `var(--uni-` 文本 | 9 | 其中 8 处在测试断言；不能用 JSX 的直接引用次数判断间接消费 |
| `fontSize` 属性 | 7 | 原报告的 3 漏了图标 fallback 和根异常兜底 |
| `boxShadow` / `zIndex` / `cubic-bezier` 字面量 | 0 / 0 / 0 | 仅说明这些写法缺席；站点仍有 Tailwind shadow / z 工具类 |

### P0 条目的实际性质

- `docs-shell.tsx` 的 1220px / 260px / 238px / 22px，以及 `App.tsx` 中再次出现的容器和侧栏尺寸，是需要集中管理的外壳几何。品牌列满足 `260 - 22 = 238`。
- `docs-feedback.tsx` 的 7 个 `max-[480px]:` 使用相同条件，需要一个命名断点。实际条件是 **width < 480px**；480px 本身保持三列。
- `docs-grid-page.tsx` 的 52px / 40px / 105px，以及报告列出的 shell 64px / 32px / 24px 和 guide 15px，位于解释性注释，不是新的裸样式。
- shell 的实际 sticky 偏移和高度计算原本使用标准间距 / rem；现在与 main 共同消费已有的 `--uni-topbar-height`。
- 图标页的 4px / 6px / 8px 是圆角；组件库已有相同默认值的 `rounded-sm` / `rounded-md` / `rounded-lg`，无需新增尺寸 token。
- ActivityView 的 844px 是演示视口 fixture 的固定高度，保留并补充双语注释。它与展开源码列表保持独立。

### P1 token 消费追踪

原表展开包含 15 个 token。处理依据是实际消费链，不要求每个 token 都直接写在 docs JSX 中。

| Token 族 | 基线消费链与处理 |
| --- | --- |
| 五个 `--uni-doc-space-*` | `docs/site/src/index.css` 引入库样式；`.docs-prose-*` 规则消费 token；`DocsPageLead` / `DocsSection` / `DocsBlock` / `DocsParagraph` / `DocsList` 使用这些规则。浏览器覆写全部五个值后，间距实际变化。保留。 |
| `--uni-doc-list-indent` | Colors 页有标记列表原先用同值 `pl-5`；改为 token。无标记列表仍保持零缩进。 |
| 两个 `--uni-mixed-script-gap-*` | 已用于同名排版工具类，属于可供消费者使用的样式接口。docs 正文采用渐进增强的原生 `text-autospace`，不强行额外加间距。保留。 |
| 五个 `--breakpoint-grid-*` | `@theme static` 中的命名响应式接口；例如 CommandMenu 使用 `max-grid-sm:`，ClearableInput 使用 `max-grid-md:`。这类值在构建期参与媒体查询，不能以 `var()` 次数判断是否失效。保留。 |
| `--uni-drawer-width` | `SidePanel` 通过 `w-[var(--uni-drawer-width)]` 消费。保留。 |
| `--uni-popover-padding` | Menu / ContextMenu 原先使用同值 `p-1.5`；现在消费已有 token，默认仍为 6px。浏览器覆写为 10px 后两种菜单实际变化。 |

### 双语规格

新增尺寸、时长、百分比的数值一致性检查，覆盖组件指南的章节和例子、API 行与备注、组件元数据 / 最佳实践、demo 翻译目录。相同规格的重复提及允许次数不同；该检查不声称覆盖所有自然语言数字。

发现并修复两处缺失：英文 Feedback 指南补齐展开圆角 12px；中文 Avatar 最佳实践把不存在的 sm / default / lg 尺寸档改为数字 24px / 32px / 48px，并同步图片 alt、首字母 / 占位 title 和 AvatarWithIcon 的实际用法。

## 实际修复范围

1. 在 docs 样式入口集中定义 shell、sidebar、gutter、派生 brand 列和 mobile-nav 宽度；保留原 px 单位，避免纯重构改变根字号缩放行为。站点专用变量不扩张公共 token catalog。
2. 用 docs 专用 `@custom-variant` 统一反馈断点。媒体查询使用构建期常量；`var(--uni-doc-breakpoint-feedback)` 不能充当运行时媒体查询条件。
3. 复用已有列表缩进、菜单内边距和圆角体系；更新已有结构断言，增加实际 computed style / token 覆写的浏览器回归。
4. 修正双语文案，使用真实文档生成器更新两页 LLM 文档及 index。示例目录、API 注册表及精确色板 fixture 保留。
5. 在 `AGENTS.md` 中加入文案、示例、注释与 fixture 的审计口径，要求追踪 CSS owner 和工具类的间接消费。

没有删除公共 token，没有改动示例代码。核验阶段未提交或推送；后续提交按用户指令执行。原始审计报告未修改。

## 验证记录

下列最终验证均观察到退出码 0。

| 检查 | 结果 |
| --- | --- |
| 基线聚焦测试 | 原有双语结构、排版 token、prose owner：18 项通过 |
| `pnpm run test` | 255 个文件 / 1,675 项通过 |
| `pnpm run typecheck` / `pnpm run typecheck:tests` | 通过；包含 `tokens:check` |
| `pnpm run build` / `pnpm exec vite build docs` | 主应用与 docs 构建通过 |
| `pnpm run docs:llm:generate` / `pnpm run docs:llm:check` | 114 条路由 × 2 语言 = 228 页；确定性检查无漂移 |
| Playwright：docs-layout-tokens、docs-mobile-navigation、docs-feedback-typography | 25 项通过；新增圆角 / 图标编辑器检查另有 2 项双主题通过 |
| `pnpm run docs:readme:screenshots` / `pnpm run docs:readme:screenshots:check` | 从实际导航发现 7 页，14 张截图；受管截图按生成器刷新 |
| `git diff --check` | 通过 |

全量测试的本机初次运行遇到 Python 命令解析失败（退出码 9009）；pyenv Python 的 Pillow 10.4.0 也缺少比较器使用的 `get_flattened_data`。最终运行仅在验证进程的 PATH 前置 Codex 自带 Python（Pillow 12.3.0），完整套件通过；未修改仓库的比较器或机器配置。便携复现时需要 Python 命令可被 Node 子进程直接解析，并提供支持该方法的 Pillow。

桌面浏览器证明容器 1220px、sidebar 260px、brand 238px 与原默认值一致；修改 sidebar / gutter 后，品牌列和 main 网格同步变化。反馈区覆盖 320 / 390 / 479 / 480 / 481 / 768 / 1440px，并覆盖 light / dark。截图证据仅放在忽略的 `.scratch/docs-layout-tokens/`，不作为公共包内容。

## English verification summary

The original report correctly identifies duplicated shell geometry and seven copies of the footer's strict `width < 480px` condition. Its priority and dead-token totals mix comments, translated specifications, CSS owners, and direct JSX references. The baseline contains 484 TS/TSX files, 276 numeric px mentions, and 56 hex literals. Examples account for about 88.4% of files. There are 44 `var(` mentions and seven `fontSize` properties; eight of the nine `var(--uni-` mentions are test assertions.

Docs prose already consumes five spacing tokens indirectly through the imported canonical stylesheet and semantic owner components. The marked Colors list now consumes its existing indent token. Menu and ContextMenu now consume the existing padding token, retaining the 6px default and responding to overrides. Mixed-script utilities, responsive breakpoint interfaces, and SidePanel width remain available. No public token was removed.

Shell dimensions live in the docs stylesheet, including a derived brand column. A named build-time variant owns the footer breakpoint. Existing radius utilities replace equivalent site literals; exact preview fixtures, palette swatches, and runnable examples remain intact. English Feedback now includes the 12px radius specification, and Chinese Avatar guidance documents numeric sizes and the actual accessibility APIs. Canonical changes regenerate only the affected LLM pages and index.

Final validation passes: 1,675 unit tests, application and test type checks, application and docs builds, deterministic checks for 228 bilingual pages, 27 focused browser cases, screenshot generation and checks for seven pages in both themes, and whitespace validation. Unit tests use the bundled Python runtime to resolve the host's Python / Pillow mismatch without modifying repository tooling or persistent machine configuration. At the end of verification, changes were uncommitted; subsequent commits follow the user's explicit instruction.
