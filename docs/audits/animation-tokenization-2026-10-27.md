# Animation 标准化（token 化）审计报告

审计日期：2026-10-27（Asia/Shanghai）。基线：`master`，HEAD `b4dd4c98`，**包含审计开始时的未提交及未跟踪工作区文件**。本报告评估当前工作区，不代表该提交或已发布包的状态。

结论：**共享 token 主干、CSS/JS 消费桥接和测试体系已经建立；仍有产品动效绕过 token，语义别名消费尚未全面收敛，治理检查也存在漏检。不能宣称全仓 animation 已完成 token 化。**

以下主体保留首次审计时的发现和行号。首次审计仅新增报告；后续已完成 Avatar、Calendar 和治理漏检的首批整改，见文末“首批整改结果”。其余历史字面量仍按原有例外保留。

## 审计范围与口径

- 核心库：`src/components/ui`、`src/styles`、`src/lib`，并检查 `src/examples` 和动画资产边界。
- 消费者：`docs/site/src`、`website/src`、三个 `templates/*/src`、`packages/*/src`。
- 文档与治理：canonical guide/API、相关双语 LLM 页面、duration/easing 账本和单元/浏览器测试定义。
- 方法：检索后逐项读取实现，追踪公共 utility、默认 transition、第三方动画默认值和 CSS→JS 读取链；运行聚焦单元测试、token 确定性检查及最小 Chromium 探针。

区分三类数值：可统一调节的交互动效时长/曲线；组件编排与几何数据；API 示例、断言、历史审计记录。后两类不能仅因出现数字就判为缺陷。未对二进制动画资产做逐帧审计，也未进行完整站点视觉验收。

## 已建立的标准

| 层次 | 当前定义 | 证据 |
| --- | --- | --- |
| 基础时长 | fast/base/slow/slower = **120/200/280/400ms** | `src/styles/index.css:672` |
| 语义时长 | feedback/state/overlay/expansive 分别引用四档 | `src/styles/index.css:679` |
| 循环周期 | `--uni-loop-standard: 1400ms`；blink、skeleton-shimmer 间接消费 | `src/styles/index.css:494`、`:503`、`:686` |
| 隐式 transition | 默认时长引用 fast，默认曲线引用 snap；裸 `transition-*` 可间接纳入体系 | `src/styles/index.css:690`、`:702` |
| 缓动 | 7 个名称、3 组不同曲线；snap/pop/stagger/toast/out 同为 `(0.22,1,0.36,1)`，另有 in-out、in | `src/styles/index.css:695` |
| JS 桥接 | `useMotionTransition` 读取级联 token，毫秒转秒；缺失、非法或 reduced-motion 时立即完成 | `src/lib/motion.tsx:111`、`:119` |
| 全局策略 | `MotionProvider` 统一 Motion 默认 transition，并响应系统 reduced-motion | `src/lib/motion.tsx:131`、`src/lib/motion-policy.tsx:15` |
| 原生命令式动画 | toggle、carousel、scroll-animation、selection-indicator 从实际元素作用域读取 token | `src/components/ui/toggle.tsx:65`、`carousel.tsx:71`；`src/lib/scroll-animation.ts:95`、`selection-indicator.ts:54` |
| 退场等待 | 读取实际动画完成状态/计算样式，避免再维护固定退出计时 | `src/lib/exit-motion.ts:4` |
| 生成一致性 | CSS 生成 token catalog 和 easing 默认表 | `scripts/generate-token-catalog.mjs:83`、`:102` |

当前组件自写动效以 tween/CSS/WAAPI 为主；未发现需另外治理的组件 spring、stiffness、damping 配置。CSS 是当前数值真源，生成的 JS 表不构成第二套手工维护的常量。

### 消费统计

对 `src/components/ui` 的 130 个文件去除块注释及整行 `//` 注释后，按源码字符串引用计数：

| 指标 | 数量 |
| --- | ---: |
| 显式引用 duration/motion/loop 时长 token 的文件 | 59 |
| `--uni-duration-*` 引用 | 124 |
| `--uni-motion-*` 引用 | 14，分布于 10 个文件 |
| 直接 `--uni-loop-*` 引用 | 0；正常消费者主要通过命名 animation 间接引用 |
| duration 例外账本 | 8 种 literal、10 个 literal-file 配对、5 个文件 |

这是引用量，**不是覆盖率**。130 个文件并非都有动画；默认 transition、公共 hook 和命名 animation 属间接消费，不能用 `59/130` 判断完成度。基础时长引用明显多于语义别名，说明数值集中化进展充分，按交互语义消费仍有演进空间。

`--uni-motion-expansive` 虽无组件直接引用，但由公共 `useMotionTransition("expansive")` 消费；不能据此判为死 token。也不应仅凭 drawer/overlay 等名称将现有 base/fast 自动换成 slower/slow，这会改变运行节奏。

## 已确认的未收敛项

| 优先级 | 位置 | 事实与影响 | 建议 |
| --- | --- | --- | --- |
| P2 | `src/components/ui/avatar.tsx:96` | loading 动画写死 `1.4s`，未复用现有 `--uni-loop-standard`；调整统一加载周期不会影响它 | 接入 loop token，并为 arbitrary animation 中的单位值补治理回归 |
| P2 | `src/components/ui/calendar.tsx:524` | animate-in/out 配置了共享 easing，却未设置 duration。当前 `tw-animate-css` 回退到 `.15s`，不读取库的 default-transition-duration | 显式绑定现有合适档位，补实际 animation-duration 与 token 更新的合同 |
| P2 | `src/components/ui/book.module.css:47` | transform 保留 `250ms`，已登记历史例外；当前 base 是 200ms，不能再称“同值替换” | 决定保持原节奏还是接受 200ms，再迁移或明确例外 |
| P2 | `src/styles/index.css:1997`、`:3146`、`:3147` | multi-select-trigger 的 `150ms`，input-focus-ring 两处 `0.15s` 未跟随 fast=120ms；已登记例外 | 明确是否跟随 feedback，并检查 utility 与组件类的层叠后收敛 |
| P3 | `src/styles/index.css:3167` | phone-frame 仍用 `0.2s`；虽与当前 base 同值，主题调节后不会同步 | 在保持契约前提下引用适合的时长 token |
| P3 | `src/components/ui/search-input.tsx:92` | 同行使用 `transition-all` 与 `[animation-duration:150ms]`；后者不能指定 transition 的时长，账本描述为“缩放过渡”存在歧义 | 先确认是否需要该 animation 属性；不能机械替换后声称修复了 transition |
| P3 | `packages/dev-shell/src/styles.css:51` | 独立应用的重连提示使用 `pulse 1s infinite alternate`，时长和默认 `ease` 未接入共享动效 token | 单独决定应用级周期/曲线标准，或记为明确例外；无需强行改成 1400ms |

P2/P3 表示本次整改建议次序，不是安全严重性。上述历史例外是已有技术债，不因治理测试通过就变成已完成迁移。

### Calendar 的最小运行证据

依赖链：`src/styles/index.css:2` 导入 `tw-animate-css`；安装版本的 `node_modules/tw-animate-css/dist/tw-animate.css:1` 定义：

```css
/* 摘取时长项；完整定义还含 easing、delay 等参数。 */
--animate-in: enter var(--tw-animation-duration, var(--tw-duration, .15s)) ...;
--animate-out: exit var(--tw-animation-duration, var(--tw-duration, .15s)) ...;
```

用本地 Tailwind 编译 Calendar 的相关类，以本地 Chromium 读取 computed style；probe 不落盘、未启动站点。将根 `--uni-duration-fast` 从 120ms 改为 640ms：

| 对象 | 调整前 | 调整后 |
| --- | --- | --- |
| Calendar 所用入场动画类的 animation-duration | 0.15s | 0.15s |
| 对照 `transition-colors` 的 transition-duration | 0.12s | 0.64s |
| 入场 animation-timing-function | `cubic-bezier(0.22, 1, 0.36, 1)` | 同前 |

这验证了当前类与依赖的默认值旁路；不是对真实 Calendar 的完整开关、退场、双主题和视口验收。

## 合理例外与不应机械 token 化的内容

- reduced-motion 的 `0.01ms` 是刻意极小的全局兜底，`src/styles/index.css:1531`；dev-shell 也有对应本地兜底 `packages/dev-shell/src/styles.css:210`。
- loading spin 的 `1s linear` 是明确允许的匀速旋转。`tests/audit/motion-easing-allowlist.json` 将消费限定为 loading-icon、spinner、gauge、destructive-action-modal 四个文件。
- `--animate-copy-check-draw` 内部的 `0.2s`、`--animate-spin` 的 `1s`、`--animate-pulse` 的 `2s` 已封装为命名 animation token，按现行 duration 政策不算调用处违规；但它们也不自动跟随四档时长。若要求所有动画整体缩放，应另行定义这种契约。
- hamburger 的 20ms 间隔与 240ms 项动画是明确本地编排参数，见 `src/components/ui/hamburger-menu.tsx:178`。copy-button 的 60ms delay、交互 dwell、自动消失时间和拖拽即时更新不应混为过渡时长档位。
- `grid.module.css` 的 2s 为 debug 可视化例外；token 编辑器 `docs/site/src/examples/tokens/TokensExample.tsx:66` 的 100/250/500ms 用于公开写值演示，预览仍消费 token。
- Carousel 的 scale 1.04、图标缩放、关键帧坐标、绘制路径等属于动效形态；没有证据支持为其强建一组全局“幅度 token”。chart 的 `type="linear"` 是几何插值，不是等速动画曲线。
- Hitu 的作者时间线、人物 rig/曲线及 Rive 状态机是动画内容。应治理播放、暂停和 reduced-motion 边界，不应把资产内部每个帧值迁入 UI duration token。

## 治理能力与缺口

现有测试已覆盖 token 定义、语义映射、scoped 动态 token 更新、非法 token 静态降级、SSR/hydration、动态 reduced-motion，以及源码合同。也存在独立浏览器测试，例如 `tests/e2e/reduced-motion.spec.ts`、sheet/fade/toggle/chart/motion-hitu specs。不能将当前治理概括为只有字符串测试。

但以下限制会使“测试全绿”等同于“全仓完成”这一判断失效：

| 问题 | 证据 | 边界与改进方向 |
| --- | --- | --- |
| Avatar 漏检已发生 | `tests/motion-duration-governance.test.ts:75` | seconds 正则前置条件排除 `\w`，arbitrary animation 的 `_1.4s_` 因下划线而不匹配；应解析 class 中的 animation 表达式 |
| 扫描目录不统一 | duration 治理 `:20`；easing 治理 `:13` | duration 不覆盖 `src/examples/vendor` 和完整 docs shell/pages；两者均不覆盖 website/templates/packages；按运行代码与演示数据分类扩展 |
| JS 数字时长没有 duration AST 约束 | duration 治理 `:71` | `{ duration: 0.2 }` 等不带单位值无法识别；这是防退化缺口，不能据此虚构现存违规 |
| delay 整行排除 | duration 治理 `:69` | 同行出现 delay 就可能连 duration 一起漏掉；应只排除 delay 属性/表达式 |
| easing 检查目标比 token 化窄 | `tests/motion-easing-governance.test.ts:40`、`:113` | CSS 非 token 曲线受限制，但 TS 硬编码合法非线性 tuple 明确允许；主要保证非等速，不保证 JS 曲线都来自 token |
| 冻结基线不能保证实例只减 | duration 治理 `:181` | 检查 literal 是否属于固定集合，未冻结配对/实例数；同文件增加相同 literal 可能通过 |
| reduced-motion 名单不是自动完整发现 | `tests/reduced-motion-coverage.test.ts:99` | 文件包含声明不等于每个动画节点有效；新消费仍需维护名单和运行验收 |
| 第三方默认值不在 literal 扫描中 | Calendar 案例 | 只搜索自写数值无法发现外部默认值；应补代表消费者的 computed-style 合同 |

账本本身也有说明漂移：`tests/audit/motion-duration-allowlist.json:26`、`:38` 仍将 fast 描述为 150ms，`:44` 将 base 描述为 250ms；实际值已为 120/200ms。应更新迁移依据，历史审计文档则应保留历史语境。

## 文档、网站与模板一致性

- Motion guide `docs/site/src/content/component-guides/guides-26-motion.ts:11`、API `docs/site/src/data/component-api.ts:46` 及相关双语生成页与当前四档 120/200/280/400ms、共享 easing 一致。
- docs Motion/Hitu 示例使用 `useMotionTransition`，文档 shell 的裸 transition 通过公共默认值消费 token；未发现需额外上报的固定运行时 duration/easing。
- 网站 `website/src/index.css:21` 使用 slower/snap，`:22` 提供 reduced-motion；`website/src/App.tsx:44` 同步实际级联时长，未复制固定值；入口使用 `MotionProvider`。
- 三个模板未发现自写 animation/transition/easing 配置，由公共组件继承。即时 `scrollTo(0,0)` 不属于持续动画。

这些是源码交叉核对结论，本次没有重新生成或验证完整 LLM corpus，也未为消费者运行完整浏览器矩阵。

## 本次验证记录

| 检查 | 新鲜结果 |
| --- | --- |
| 下列 12 个聚焦 Vitest 文件 | **12 passed / 96 tests passed，exit 0** |
| `pnpm run tokens:check` | **Token catalog check passed，exit 0** |
| Tailwind + Chromium 最小默认值探针 | **exit 0**，结果见 Calendar 表格 |
| `pnpm run verify -- --dry-run --path docs/audits/animation-tokenization-2026-10-27.md` | **exit 0**；已审阅计划，但因归档发现问题过度选择广泛检查，未执行该计划 |
| 报告前后工作区状态对比 | 本次仅新增本报告，既有变更保留 |

聚焦测试命令：

```sh
pnpm run test -- tests/duration-tokens.test.ts tests/ease-tokens.test.ts tests/motion-duration-governance.test.ts tests/motion-easing-governance.test.ts tests/motion-easing.test.ts tests/motion.test.tsx tests/motion-active-policy.test.tsx tests/motion-docs-contract.test.tsx tests/reduced-motion-coverage.test.ts tests/exit-motion.test.ts tests/scroll-animation.test.ts tests/global-token-catalog.test.ts --exclude '**/.workbuddy/**'
```

首次未加 exclude 的同范围命令返回 exit 1：12 个目标文件通过，但 Vitest 额外收集 `.workbuddy` 旧归档中的 3 个文件，其中有缺失源码/import；归档产生 2 个 suite 错误和 16 个失败用例。排除本地归档后取得上面的有效 exit 0。此为本地收集问题，不是本次引入的动画回归。运行中另有 jsdom Canvas 未实现提示，不影响上述退出码。

统一入口的 dry-run 已严格限定本次报告路径，并排除 150 个其他已改文件路径。发现阶段仍将 `.workbuddy` 归档测试当成缺少 indirect input 声明的输入，触发全量回退：计划包括 341 个 unit 文件、61 个 browser specs、全部 layout routes，以及 package acceptance 等 32 个执行步骤。该范围与新增审计报告无关，因此依据仓库规则使用上述聚焦证据，不执行广泛回退，也不使用 `--full`/`--allow-broad` 绕过。此为计划器在当前本地状态下的限制，未将 dry-run 误报为验证通过。

本次没有 runtime/API/样式改动，因此未运行全套测试、完整构建、package acceptance、README 截图生成及完整站点浏览器审计；不对未运行的检查作通过声明。新增审计报告不改变 canonical component docs 或 corpus 输入。

## 建议整改顺序

1. 先补 Avatar loop token 与 Calendar duration 旁路，并添加针对其实际根因的回归证据。
2. 对 book、focus-ring、multi-select、phone 的已有例外逐项决策；当前档位已变，不能用“同值替换”掩盖节奏变化。澄清 SearchInput 属性用途并更新账本理由。
3. 完善扫描器：覆盖 arbitrary animation、JS duration、第三方默认值，缩小 delay 排除粒度；统一消费者扫描边界并保留示例/资产例外。
4. 在保持已有运行契约的前提下逐步增加语义别名消费；独立定义 dev-shell 本地循环是否需要共享的规范。

## 首批整改结果（2026-10-27）

| 项目 | 已落地的行为 |
| --- | --- |
| Avatar | 占位动画读取 `--uni-loop-standard`，默认仍为 1400ms，元素作用域覆盖立即生效 |
| Calendar | 出入场显式消费 `--uni-motion-feedback`，由共享 feedback 档位决定时长；保留入场 ease-out、退场 ease-in、Escape 和焦点归还行为 |
| 时长治理 | 识别 arbitrary animation 中的 `_1.4s_`、`_120ms_` 等单位值；delay 仅排除自身片段，不再掩盖同行 duration；新增 13 组正反例 |
| 例外账本 | 澄清固定字面量不保证与可调 fast/base 档位同值，以及 SearchInput 的 animation-duration 用途；历史数值保留为迁移依据 |
| 文档与消费关联 | 补充 Avatar/Calendar 双语调节契约，global-tokens 浏览器合同登记对应 component owners |

本轮 runtime 改动只涉及 Avatar 和 Calendar，未改变公共 props、包入口或共享 token 数值。模板无需修改。Book、focus-ring、MultiSelect、Phone、SearchInput 和 dev-shell 的剩余事项，以及 JS duration AST/扫描范围等进一步治理工作仍保留在审计清单中，未声称全部完成。

### 新鲜验证证据

| 检查 | 结果 |
| --- | --- |
| 11 个相关组件、治理及 verification-policy 测试文件 | **121 passed，exit 0** |
| 3 个双语一致性/guide rendering/docs coverage 测试文件 | **11 passed，exit 0** |
| Avatar/Calendar 浏览器回归 | **8 passed，exit 0**；light/dark × 320/1280px；验证默认值、作用域 token 更新、减少动画，以及 Calendar 退场卸载和焦点归还 |
| `pnpm run docs:llm:generate` | **exit 0**，124 路由 × 2 语言；相对本轮前的文件哈希仅改变两个组件的四个语料页面与索引 |
| `pnpm run docs:llm:check` | **exit 0，无漂移** |
| task-scoped `verify -- --dry-run` | **exit 0**，已审阅 15 个文件的计划；未执行广泛回退 |
| task-scoped `git diff --check` | **exit 0** |

聚焦命令：

```sh
pnpm run test -- tests/avatar-api.test.tsx tests/avatar-fallback.test.tsx tests/calendar-enhancements.test.tsx tests/calendar-horizontal-layout.test.tsx tests/calendar-colors.test.ts tests/motion-duration-governance.test.ts tests/duration-tokens.test.ts tests/ease-tokens.test.ts tests/motion-easing-governance.test.ts tests/reduced-motion-coverage.test.ts tests/verification-policy.test.ts --exclude '**/.workbuddy/**'
pnpm run test -- tests/docs-i18n-parity.test.ts tests/component-guide-sections.test.tsx tests/docs-coverage.test.ts --exclude '**/.workbuddy/**'
pnpm run test:docs-layout -- tests/e2e/global-tokens.spec.ts --grep 'avatar loading cycle|calendar feedback timing'
pnpm run docs:llm:generate
pnpm run docs:llm:check
```

浏览器命令首次在沙箱中因 Vite 读取已安装依赖的 `package.json` 被拒绝而返回 exit 1，未进入用例执行；在沙箱外运行同一命令后 8 项全部首过。相关单测另有既有 jsdom Canvas 提示，不影响成功退出码。

统一计划排除 147 个其他已改路径，但当前 `.workbuddy` 归档发现问题及共享文档 owner 回退仍选出 341 个 unit 文件、61 个 browser specs、全部 layout routes，共 32 步。依仓库范围规则改用上面的等价聚焦检查，没有执行 `--full` 或 `--allow-broad`。本轮无类型签名、共享 token 数值、打包入口或依赖变化；实际浏览器已验证新增工具类的生成和消费，因此未为这些未受影响的契约运行整库 typecheck/build、package acceptance、全站布局、模板/网站/dev-shell 全套检查。Motion-only 修改保持截图捕获状态，未重新生成 README 截图。此处对这些遗漏均不作通过声明。

## 第二阶段：历史过渡时长收敛

第一阶段已签名提交为 `574461fa`。各阶段只提交本任务差异；原有 Hitu、全局四档提速及其他工作区改动仍保持未提交。

- Book 翻转与 Phone/Device animated 变体消费 `--uni-motion-state`。
- MultiSelect trigger、公开 `input-focus-ring` utility 与 SearchInput wrapper 消费 `--uni-motion-feedback`；SearchInput 移除了不能控制 transition 的 animation-duration。
- 共享 easing、变换幅度、输入和键盘行为、Device 默认静态状态以及 reduced-motion 逻辑保留。时长随现有共享档位变化，不新增平行数值。
- 清理三个已迁移的字面量条目及 Book 的旧文件配对。账本剩 5 个合法 literal：token 编辑器 100/250/500ms、reduced-motion 0.01ms、Grid debug 2s。

验证：相关组件/治理单测 7 文件、119 用例通过；新增浏览器关联回归所在 policy 文件 51 用例通过；`motion-token-consumers.spec.ts` 在 light/dark × 320/1280px 下 **20 项全部通过**，覆盖默认档位、作用域覆盖、hover/focus/输入与减少动画。未有现成消费者的 focus utility 使用其真实 CSS 定义经 Tailwind 编译后验证，没有拿普通 Input 的独立过渡冒充该 utility 的覆盖。Device CSS 变体通过真实设备节点验证，React 的 animated class 选择另由既有单测保护。

`tokens:check` 和完整 `docs:llm:check` 均 exit 0。canonical guides/API 未声明被替换的固定时长，源码检查未见矛盾；语料无漂移，不需要再次生成。没有改变截图捕获状态或包边界，未扩大至 package acceptance 或全站布局矩阵。

新增 policy 回归首次将 owner 名当作 route 参数传入而失败，已改为真实 `/components/<owner>` 路径，并补源码路径匹配后取得 51/51。验证 dry-run 首次包含尚未修改的报告路径，被正确拒绝；本节写入后按实际任务路径重新审阅计划。

## 第三阶段：dev-shell 复用公共循环动画

第二阶段已签名提交为 `2530fdea`。

重连指示器改为消费 `--animate-pulse`，并删除本地同名 `@keyframes pulse`。旧 `1s alternate` 的完整往返周期为 2s；共享 pulse 同为 2s，使用 `--ease-in-out`，最低 opacity 从本地 .35 收敛到公共 .5。移除本地定义同时修复了应用样式覆盖库内 pulse 的命名污染。原有 reduced-motion 兜底保留。

独立复核命令与结果：

```sh
node node_modules/@playwright/test/cli.js test --config packages/dev-shell/playwright.config.ts --grep "reconnecting feedback"
node node_modules/vite/bin/vite.js build --config packages/dev-shell/vite.config.ts
```

浏览器 **8 passed，exit 0**，涵盖 1280/1024/1023/390px × light/dark；通过真实 WebSocket 中断验证重连状态，检查公共周期、中点 keyframe、局部 token/easing 覆盖、动态减少动画及恢复。生产构建 **exit 0**，实际发射公共 pulse token；仅剩库内 50% opacity=.5 的定义。测试主动中断连接产生的 proxy reset 日志及构建 chunk 大小提示不影响成功退出码。分工实现后由主代理重新运行上述命令复核。

第二阶段后 `typecheck:tests` 也已 exit 0。各阶段的 dry-run 均审阅实际任务路径，保留已说明的本地归档/广泛回退限制，使用聚焦证据覆盖受影响契约。
