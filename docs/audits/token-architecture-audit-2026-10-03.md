# Token 架构审计：职责、重复、生命周期与实际需求

审计日期：2026-10-03。代码基线：`master` / `a365829`。

本文是当前实现的架构评估，建议项不代表已实施的修复。此前的硬编码审计及其核验报告用于定位问题；本次结论重新检查了源码、消费点、历史、测试和实际浏览器行为。

## 结论

现有体系的方向合理，但还不能认为运行时契约和生命周期治理已经完善。基础色阶、语义角色、组件专用值、兼容映射、字体方案及动效尺度都有项目需求支撑；主要问题是把不同配置机制放进同一个“可写 token”概念，以及历史名称、预留能力和当前有效配置缺少区分。

确认了两个应优先修复的契约缺陷：断点被 API 接受为运行时配置，却无法改变响应式条件；局部动画演示写入的值与按钮真实时长不一致。另有一个悬空的菜单行高配置、两个已失去原消费点的 Tooltip 变量、两对同义形状名，以及构建断点和测试证据方面的维护债务。

不应以减少 token 数量或消灭全部数值字面量作为目标。工程上需要减少的是独立维护同一决策的地方，以及没有实际职责的公开配置承诺。

## 判断标准

| 原则 | 在本项目中的判据 |
| --- | --- |
| DRY：同一知识只有一个维护来源 | 两个值是否表达同一决策、是否应一起变化；值恰好相同不构成合并理由 |
| 信息隐藏和职责边界 | 库的设计角色、站点布局、组件内部几何、构建条件、测量输出应有明确归属 |
| 可替换的公开契约 | 文档、类型和写入 API 承诺的控制能力，能否由真实消费点兑现 |
| YAGNI 与可演进性 | 预留能力可以存在，但需要说明用途；历史兼容能力需要替代名称和退出策略 |
| 实证验证 | 源码声明和测试数量不能代替生成 CSS、计算样式及交互行为证据 |

“科学”在这里指职责明确、可验证、变更传播可预测；不是要求所有项目遵守一套固定的颜色、圆角或间距数值。

## 盘点与扫描边界

由 `scripts/generate-token-catalog.mjs` 解析当前 `src/styles/index.css`，目录有 **505** 个项目条目，生成器将其中 **415** 个标为 `runtime`、**90** 个标为 `mapping`。这是现有分类结果，不能直接等同于 415 个能改变组件表现的有效开关。

| 目录分组 | 条目数 |
| --- | ---: |
| colors | 385 |
| typography | 39 |
| layout | 21 |
| motion | 18 |
| shape | 18 |
| materials | 16 |
| layers | 8 |

其中 221 条定义的基础值、暗色值或字体覆盖至少引用另一个 CSS 变量，包含别名、派生计算和复合值。92 个基础色阶变量及其 92 个 `--color-*` 映射就占 184 个条目，因此总条目数不能解释为 505 个独立设计决策。

检查覆盖 canonical CSS、组件 CSS modules、库组件、示例、文档站源文件、生成目录、实际构建 CSS 和相关测试。用 PostCSS 区分声明、引用和主题覆盖，用 TypeScript AST 排除注释并定位字符串中的变量和工具类，再人工核对动态消费和历史。

特别检查了两个容易造成“死 token”误报的机制：

- `docs/site/src/data/foundation-colors.ts` 动态生成 `--color-${tokenPrefix}-${step}`；不能因全文检索没有完整名称就判定色阶映射未使用。
- Tailwind 的 `rounded-*`、`bg-*`、`max-grid-*` 等消费构建配置；不能只统计 JSX 中的 `var()`。

同一 CSS rule 中未发现重复自定义属性声明。Light、Dark 和字体方案中的同名覆盖属于模式配置。仓库内缺少消费点也不能证明外部库使用者没有消费某个公开名称。

## 已验证的问题

### T1 / P1：断点的“可写运行时”分类与实际能力冲突

位置：`scripts/generate-token-catalog.mjs` 的 `collectGlobalTokens`、`src/lib/tokens.ts` 的写入校验、`src/styles/index.css` 的七个 `--breakpoint-*` 定义，以及 `docs/site/src/pages/tokens.tsx` 的变量与构建映射说明。

生成器用“不是 `@theme inline`”作为标记运行时变量的主要依据。因此，`@theme static` 的七个断点全部进入 `RuntimeTokenName` 和 `RUNTIME_TOKEN_NAMES`，`setToken` 也接受写入。`static` 保证变量发射，不能证明它参与运行时媒体条件求值。

实际复现：1024px 视口中的 `max-grid-md:hidden` 元素起初显示；通过真实 API 把 `--breakpoint-grid-md` 从 `60rem` 写为 `100rem`，返回 `true`，读值也变为 `100rem`，元素仍然显示。响应式条件保持构建时的 `width < 60rem`。Light 和 Dark 结果一致。

当前文档已经说明断点不能用运行时 API 改变，但类型、目录标签和 API 校验仍接受它们，三者相互冲突。

建议：将这七个断点归为构建配置并从可写类型和写入接口中排除，保留目录可发现性及构建能力。不要改动既有媒体条件。验收应同时覆盖类型、写入拒绝以及断点两侧的真实响应式行为；生成器的文本一致性检查不足以验证分类正确。

### T2 / P1：局部动画演示没有兑现控制承诺

位置：`src/examples/TokensExample.tsx`；相关定义为 `--default-transition-duration`、`--uni-duration-fast` 和 `--uni-motion-*`。

演示提供“仅演示区域”的作用范围和“反馈动画时长”选择。真实按钮使用默认过渡时长，而默认别名已在祖先处解析。

浏览器复现，Light 和 Dark 一致：

| 操作 | 写入后读值 | 按钮计算时长 |
| --- | --- | --- |
| 默认状态 | fast = 150ms | 0.15s |
| 在预览区域写入 fast = 500ms | 500ms | **仍为 0.15s** |
| 在根节点写入 fast = 500ms | 500ms | 0.5s |

同一机制也适用于语义动效别名：局部写入 `--uni-duration-base: 800ms`，消费 `--uni-motion-state` 的元素仍是 0.25s；直接覆盖消费变量 `--uni-motion-state: 800ms` 后才变为 0.8s。

文档已经正确提示继承别名可能在祖先解析，因此通用 API 的原始 CSS 级联行为有说明；具体演示仍需符合这个说明。

建议：让预览按钮直接消费所编辑的 fast 变量，或明确编辑它实际消费的变量。避免为了修一个演示引入自动重写整个别名图的运行时框架。浏览器验收应通过演示控件选择 500ms，检查预览按钮的 `transitionDuration`，并验证局部修改不会影响外部按钮。

### T3 / P2：菜单行高变量成为悬空配置

位置：`src/styles/index.css` 的 `--uni-popover-row-height: 36px`；`src/components/ui/menu.tsx` 和 `context-menu.tsx` 的 `h-9`。

该变量被公开目录标为运行时变量，测试也要求定义存在，但当前菜单项实际消费固定高度工具类，没有消费该变量。

真实 Menu 浏览器复现：根节点将行高变量改为 68px，菜单项仍为 36px。对照实验修改 `--uni-popover-padding` 为 18px，待过渡结束后菜单内边距实际变为 18px，证明问题出在行高消费关系，而非 API 或测量方式。两种主题均复现。

建议根据职责选择：若它是菜单行高的配置入口，接入普通 Menu / ContextMenu 的行高消费，并保留触控最小命中区；若只是历史兼容变量，记录为 dormant/compatibility，不再暗示其能控制当前菜单。虽然它与 `--uni-size-medium` 都是 36px，控件尺寸与菜单行高是两个独立职责，不应按数值合并。

### T4 / P2：同义名称与过时变量缺少生命周期标记

| 名称 | 证据与状态 | 建议 |
| --- | --- | --- |
| `--invert-background` / `--invert-foreground` | 当前产品源码无消费点。历史提交 `4d8b21b` 已将 Tooltip 默认配色改为 `--background-100` / `--foreground`，旧变量及定义测试留下 | 已失去原职责的 obsolete 候选；先标记弃用和替代方案，再按兼容策略移除 |
| `--radius-circle` / `--radius-circular` | 两者都是 50%，源码明确称 circular 为 preferred alias；当前组件和页面没有这两种工具类消费 | 确认存在同义名称冗余；统一新代码的推荐名称，旧名作为 deprecated alias |
| `--radius-pill` / `--radius-capsule` | 两者都是 9999px，源码称 pill 为 legacy alias；当前产品形状多消费 `rounded-full` | 确认存在同义名称冗余；确定推荐名称及迁移关系，保留公开兼容窗口 |
| `--radius-concentric-inset` | 定义和测试存在；同心 overlay 公式仍独立写 `- 2px`，没有消费该变量 | 未接入的预留能力；只有确需统一光学差时才接入，否则列入弃用评估 |
| `--radius-continuous` | 目录及设计规范存在；`ContinuousSurface` 根据 `radius` prop 生成 path 和 fallback，没有读取该变量 | 预留的普通圆角 fallback 工具类；不能将其描述为连续曲线组件的控制入口 |
| `--uni-mixed-script-gap-ui/prose`、`--uni-leading-compact/reading` | 有对应公开 utility 和设计说明；当前 UI 没有这些 utility 的实际消费。prose 行高已有消费 | reserved 能力，证据不足以认定 obsolete；记录用途即可，不为证明“使用了”而强制迁移 |

这些名称已进入公开目录或工具类契约。仓库无消费点不构成无损删除的证明。定义存在性测试也不构成继续公开维护的产品理由。

### T5 / P2：Grid 的同名断点没有统一语义

位置：`src/styles/index.css`、`src/components/ui/grid.tsx` 和 `grid.module.css`。

`--breakpoint-grid-lg` 为 80rem（默认字号下 1280px），而 Grid 的 `lg` 层从 `width > 60rem` 开始，容器查询从 961px 开始。其余网格 token 更多表达档位上界，Tailwind 无 `max-` 前缀的变体却表达下界；同一个 `lg` 名称没有统一的区间意义。

当前组件没有使用 `grid-lg:`，所以这是未统一的命名/构建配置契约，并非已观察到页面在 1280px 才进入 Grid 的 lg 档。已有 `max-grid-md:` 等消费也有实际用途，不能把整族断点删除。

建议：明确档位上界与区间下界，保持既有 Grid 行为；对视口和容器边界分别建立行为验证。避免直接把 80rem 改成 60rem，因为这会改变公开 Tailwind 变体。媒体查询可由构建配置生成，但不能在条件中改用 CSS `var()`。当前不需要为了集中几个常量搭建新的通用 token 编译器。

### T6 / P2：部分 token 测试不能证明它们声称的构建行为

位置：`tests/continuous-surface-tokens.test.tsx`。

测试自行在根节点写入变量，再创建只有类名的元素，没有加载真实生成 CSS；对圆角只断言“不等于 auto”，并检查 `classList.contains`。在没有任何 CSS 的 jsdom 中，`borderRadius` 返回空字符串，空字符串同样满足该断言。

因此这些测试通过不能证明 rounded 工具类已经生成、已经接入变量或可以被运行时覆盖。测试注释把 `@theme inline` 的输出描述为一律 `border-radius: var(--radius-X)`，也忽略了表达式被内联的情况。

建议：保留必要的定义契约，另外检查实际构建 CSS 或浏览器计算样式。对 50% / 9999px 等效果断言具体结果；如果要声明运行时可配置，必须在修改变量后验证实际变化。不能用“类名被放进 DOM”替代“类生效”。

### T7 / P3：目录分组和归属信息不足

`groupFor` 用名称前缀猜测分组，`--uni-drawer-width` 被归入 colors，实际是布局尺寸。目录尚未区分 foundation、semantic、component、compatibility、reserved、deprecated，也没有标明推荐入口。

此外，六个 docs 内容节奏变量位于库的 canonical CSS 并进入公共目录，而 docs 外壳几何正确留在站点 CSS。内容节奏变量当前确有消费，不是死 token；但用途仅在文档站，公开库的职责边界还可以进一步明确。迁移会影响已有目录契约，不能顺手搬走。

建议先修正已知误分类，并为本报告涉及的兼容/预留条目增加少量明确的生命周期说明。元数据可以生成或附加，数值仍只由 canonical CSS 拥有；无需把全部值复制到 JSON 再维护两套真源。

## 应保留的安排

| 安排 | 为什么符合当前需要 |
| --- | --- |
| 基础色阶 → 语义角色 → Tailwind / shadcn 兼容映射 | 支撑色阶文档、现有组件类名和多主题；不同层服务不同使用方式，映射有职责 |
| 同值的 body/headline、导航 heading/subheading/item | 字重、内容角色和未来变化轴不同；导航角色引用同一基础尺度，值没有独立复制 |
| `--uni-motion-feedback/state/overlay/expansive` | 当前组件有实际消费；表达交互用途，修改档位或某类交互的时长都有明确入口 |
| 独立 loop 周期与有限 capsule 动画半径 | 循环节奏不同于过渡时长；反馈组件需要有限半径才能平滑插值，不能与无穷大 pill 合并 |
| backdrop / scrim 两族、视觉阴影 / stacking 层级 | 消费场景、合成方式或职责不同；同值也不是同一个设计决策 |
| 兼容色与一般色阶并存 | 如 `--uni-blue-600` 与 `--blue-600` 的值和历史证据不同；机械合并会改变既有视觉行为 |
| 字体档位和按字体校准的 ink shift | 当前默认字体与不同 fallback 需要独立处理；测量输出也已和静态目录分开 |
| docs 外壳变量留在站点 CSS | 宽度、侧栏和 gutter 属于站点布局，避免给组件库增加站点专用配置入口 |

另需明确两条限制：

- `--radius` 当前只控制引用它的表面。浏览器确认写为 16px 后 `rounded-md` 变为 16px，`rounded-lg` 仍为 8px。这是已记录的固定映射契约，不应把单个 base radius 宣传为全库圆角主题开关。
- `text-heading-32` 实际消费 28/34px 等语义尺度，数字类名保留了兼容历史。新代码优先选已存在的语义名称；旧类不能被解释成真实像素规格，也不应在本次审计中整体改名。

## 建议处理顺序与退出条件

1. **先修 T1 和 T2。** 只调整错误的能力分类与具体演示消费，保持默认视觉值和现有响应式条件。完成类型/目录/API 校验与两主题浏览器验证。
2. **再裁决 T3 和 T4。** 为菜单行高决定控制职责，为旧 Tooltip 色和形状别名记录替代名称、状态及兼容窗口。当前仓库无消费点只是证据之一，不能跳过公开 API 评估。
3. **补 T5 和 T6 的行为证据。** 统一 Grid 断点说明，验证构建和作用边界；替换无法证明行为的断言，不增加逐字镜像实现的测试。
4. **按实际收益修 T7。** 修正明显的分组错误和相关条目的归属说明；暂不引入新的 token 框架，不以“所有字面量都必须 token 化”为规则。

新 token 的最低准入条件应是：明确的变化职责、当前消费者或已决定保留的公开能力、作用范围和配置阶段、兼容性理由，以及至少一种能观察效果的验证方式。预留项应记录理由；弃用项应记录替代入口。相同数值不要求共用名称，相同职责却应避免独立维护数值。

## 本次验证

以下命令为本轮新执行，退出码均为 0：

- `pnpm exec vitest run tests/global-token-catalog.test.ts tests/global-tokens.test.tsx tests/global-tokens-ssr.test.tsx tests/token-namespace.test.ts tests/theme-token-pairing.test.ts tests/typography-tokens.test.ts tests/radius-tokens.test.ts tests/duration-tokens.test.ts tests/ease-tokens.test.ts tests/audit/uni-token-contract.test.ts`：10 文件、66 测试通过。
- `pnpm exec vitest run tests/continuous-surface-tokens.test.tsx tests/tooltip-api.test.ts tests/menu-surface.test.tsx`：3 文件、17 测试通过；其中 continuous token 测试的证据不足已单列为 T6。
- `pnpm run build`：token 目录一致性检查、TypeScript 构建和主应用构建通过。
- `pnpm exec vite build docs`：文档站构建通过；保留现有大 chunk 提示。
- `pnpm run docs:llm:check`：真实文档构建与路由抓取后无 corpus 漂移。
- 独立 Playwright 检查真实文档站的 light/dark 两种主题：断点写入、圆角范围、局部/全局时长、语义别名、真实 Menu 行高和内边距，对上述复现结果逐项断言。
- 无样式 jsdom 对照：`getComputedStyle(element).borderRadius === ""`，同时 `borderRadius !== "auto"`，确认 T6 的断言可在没有工具类样式时通过。

扫描和浏览器复现脚本、构建日志及 JSON 记录存放在忽略的 `.scratch/`；不作为公共库、测试套件或提交产物。本轮产物为审计报告，表中问题仍需按上述顺序修复。
