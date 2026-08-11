# Geist 组件与响应式整改设计台账（Task 9 父级设计门禁）

- 门禁执行：2026-08-11（UTC+8 15:10），Task 9 父级审核（只读审核 + 设计固化）
- 统一计划：`.hermes/plans/2026-08-11_141304-geist-systemic-parity-and-responsive-remediation.md` §7 Task 9（387–403 行）
- 审核框架：`C:/Users/Leon/geist-audit/task9-parent-gate-framework.md`（§6.1 结论分级 / §6.2 证据单元 / §6.3 步骤）
- 证据目录：`C:/Users/Leon/geist-audit/phase-e/*`（evidence UTC 2026-08-11 06:23–07:09；worker 产物，非 repo 内容）
- 仓库基线：HEAD `b46923f`（Task 3 提交）；本门禁文档与测试契约按 Task 9 独立提交
- 配套机器台账：`tests/audit/geist-design-gate.json`（逐组件维度状态 + 批次边界，机器可读）

---

## 0. 门禁结论总览

**本门禁不授予任何组件“与官方一致”的 PASS。** 按框架 §6.1，PASS 需要官方事实 + 本地事实 + comparison 无未解释差异 + 真实四视口双主题矩阵 + 交互实测五者齐备；当前 phase-e 证据中**不存在任何官方/本地同 cell comparison 产物**（仅 description 有手工 diff、drawer 有双侧采集；checkbox 只有官方侧矩阵），因此一致性 PASS 一律不成立。允许进入 TDD 实施 = “官方事实维度已冻结 + 差异清单已明确”，不等于一致性通过。

| 组件            | 官方事实                                                    | 本地对比               | 视口真实性                            | 门禁判定（维度级）                                                                                      | 批次          |
| --------------- | ----------------------------------------------------------- | ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------- |
| Choicebox       | 高（DOM/ARIA/computed/多行/差异表 A1–S12）                  | 源码级                 | 容器仿真（钳制）                      | API/DOM/Multi **FAIL**；视觉 S1–S12 部分 **FAIL**；响应式 **BLOCKED**（推断）                           | B1            |
| Clearable Input | 高（5 demo × light/dark 实测）                              | 源码级                 | 4 视口推断                            | 结构/行为 **FAIL**（kbd vs X、label/cmdk prop 缺失）；响应式规则级                                      | B1            |
| Command Menu    | 高（3 variant × light/dark + 键盘实测）                     | 源码级                 | 1262/782 实测+推断                    | 结构/ARIA/motion **FAIL**（13 条差异路径）；375+ **BLOCKED**                                            | B1            |
| Code Block      | 高（9 官方段 + 12 issue 清单）                              | 双侧截图               | 仅 1262                               | **MISSING**（1/9 变体）；半径/header/copy 视觉 **FAIL**                                                 | B1            |
| Context Menu    | 高（16/16 真实视口 cells + 39 行差异表）                    | **双侧实测**           | 375/768/1440/1920 真实                | API（href/prefix/suffix）**MISSING**；圆角/dark bg/375 自适应 **FAIL**；长按 **BLOCKED**                | B1            |
| Description     | 高（computed 逐项 + tooltip）                               | **双侧实测**           | 357–782 实测，1440/1920 **BLOCKED**   | 核心 **PASS**；tooltip 表面 **FAIL(minor)**；demo 覆盖 **MISSING**                                      | B1            |
| Dots Menu       | 中（仅 1440-light 实测 open/rest）                          | 1440-light 实测        | 7/8 cells 缺失                        | 表面契约 **FAIL**（radius/阴影/z 待核对）；视口/主题矩阵 **MISSING**                                    | B1*           |
| Drawer          | **高（16/16 真实视口×主题 + 全交互矩阵）**                  | **双侧实测**           | 四视口真实                            | 交互 **PASS**；视觉 D1–D7 **FAIL**（80dvh/8px/无边框/0a0a0a/阴影/0.5s）；Custom height demo **MISSING** | B1            |
| Empty State     | 高（3 demo × 8 cells 真实视口）                             | 本地 sweep **全 FAIL** | 四视口真实（官方）                    | 官方结构事实可冻结；本地 demo/结构 **MISSING/BLOCKED**                                                  | B1            |
| Checkbox        | 高（官方侧 64 cell 像素矩阵 + DOM 状态机）                  | 源码级                 | 四视口（仅官方）                      | 官方事实可冻结；本地对比 **MISSING**                                                                    | B1            |
| Collapse        | 中（结构实测；demo 归属失败）                               | 本地矩阵 **FATAL**     | 四视口（官方）                        | 结构事实部分可用；demo 归属 **BLOCKED**；本地 **MISSING**                                               | B2            |
| Context Card    | 中（视觉 FAIL 实测；交互双端 BLOCKED）                      | 视觉对比               | **UNVERIFIED**                        | 视觉 **FAIL**（radius/宽度/dark bg/内容/箭头/z）；交互/视口 **BLOCKED**                                 | B2            |
| Entity          | 中（API/RSC + 官方 8/8 视口主题 cells）                     | 本地 8/8 零 Entity DOM | 官方四视口双主题；本地 Dark 主题失败  | 官方结构/响应式事实部分可用；本地 demo/route 与 Dark **MISSING**，comparison 不成立                     | B2            |
| Calendar        | 中（实时 9 demo、主流程与源码/API 对照；本地仅源码）        | 无运行时本地对比       | 官方仅固定桌面视口，Dark/本地矩阵缺失 | 架构差异 **FAIL**；Dark/四视口/本地运行时 **MISSING**                                                   | B2/补证后实施 |
| Combobox        | 中（实时 14 demo 与主流程；完整报告因当时磁盘写满未持久化） | 源码级                 | 仅桌面与窄窗主流程，Dark/四视口不完整 | API/DOM **FAIL**；Dark/矩阵/持久证据 **BLOCKED**                                                        | BLOCKED       |
| Modal / Sheet   | **零证据**（无目录）                                        | —                      | —                                     | **BLOCKED/MISSING**（旧 `max-sm:` 假设被计划 §5.6 禁止）                                                | BLOCKED       |

\* Dots Menu 表面契约（1440-light）已可支撑组件级 TDD；进入终验前必须补齐 7/8 cells。

---

## 1. 共享层设计决策（Task 10 前置）

### 1.1 `--ds-*` token 权威对照表（官方实测，可立即落地）

来源：choicebox-evidence.md §2、clearable-input/evidence-live.md §2、checkbox evidence.json cssVars、context-menu-diff-table.md、drawer/REPORT.md。官方 `--ds-*` 变量是真实存在的基础设施（clearable-input/combobox/drawer/checkbox/choicebox 共用）。

| 官方变量                                           | Light 值                       | Dark 值   | 证据                                                                      |
| -------------------------------------------------- | ------------------------------ | --------- | ------------------------------------------------------------------------- |
| `--ds-size-medium`                                 | 36px                           | 36px      | clearable-input（input h36）                                              |
| `--ds-control-decoration-size`                     | 14px                           | 14px      | clearable-input                                                           |
| `--ds-focus-color`                                 | hsla(212,100%,48%,1) = #0072f5 | 同        | clearable-input（kbd/按钮 focus outline #0072f5）                         |
| `--ds-gray-100`                                    | #f2f2f2                        | #1a1a1a   | clearable-input（disabled bg）                                            |
| `--ds-gray-500`                                    | #c9c9c9                        | #454545   | choicebox（disabled 文字、圆点 border）                                   |
| `--ds-gray-700`                                    | #8f8f8f                        | #8f8f8f   | clearable-input disabled 文字、checkbox border                            |
| `--ds-gray-900`                                    | #4d4d4d                        | #a1a1a1   | choicebox desc、clearable label/kbd 文字                                  |
| `--ds-gray-1000`                                   | #171717                        | #ededed   | choicebox title、clearable 有值文字、checkbox checked bg/border           |
| `--ds-gray-alpha-400`                              | #00000014                      | #ffffff24 | clearable wrapper ring、drawer border-t、menu ring                        |
| `--ds-gray-alpha-500`                              | #00000036                      | 待证      | clearable hover ring；Dark 精确值未持久化                                 |
| `--ds-gray-alpha-600`                              | #00000057                      | #ffffff82 | clearable focus ring 1px 层                                               |
| `--ds-background-100`                              | #ffffff                        | #0a0a0a   | drawer 面板、context-card dark bg、empty-state 容器、command-menu overlay |
| `--ds-blue-600`                                    | #52AEFF                        | #0091FF   | choicebox 选中 border                                                     |
| `--ds-blue-900`                                    | #0068D6                        | #52A8FF   | choicebox 选中文字/指示器                                                 |
| `--ds-blue-100`                                    | #F0F7FF                        | #0F1C2E   | choicebox 选中 bg                                                         |
| `--ds-blue-700`                                    | 待证                           | 待证      | collapse focus-visible ring；G7 归属修复后重采                            |
| indigo-600                                         | #5B5BD6                        | 同        | 非 `--ds-*` 变量；choicebox focus outline                                 |
| `--ds-focus-ring`                                  | 待证                           | 待证      | checkbox peer-focus-visible、dots-menu data-focus；精确 shadow 未冻结     |
| `--ds-shadow-border-medium/large`                  | 1px #00000014 + 2 层           | —         | checkbox cssVars 实测                                                     |
| `--material-shadow-menu`                           | 1px 环 + 4 层 + #fafafa 外环   | 反色系    | context-menu/dots-menu 实测一致                                           |
| `--ds-shadow-modal`                                | 待证                           | 待证      | command-menu 差异路径 3；精确 shadow 未冻结                               |
| `--ds-popover-padding` / `--ds-popover-row-height` | 6px / 36px                     | 同        | context-menu                                                              |
| `--ds-z-menu`                                      | var                            | 同        | dots-menu wrapper `z-[var(--ds-z-menu)]`                                  |
| `--ds-gray-200`                                    | #EBEBEB                        | #2E2E2E   | empty-state token 实测；choicebox 报告将同值标作 gray-400，命名冲突待核对 |
| `--ds-gray-600`                                    | 待证                           | 待证      | checkbox checked+disabled bg/border                                       |

**决策 D-T1**：在 `src/styles/index.css` 主题层建立 `--ds-*` → 本地 Tailwind v4 token 的映射表（只读对照，不替换现有语义 token 的消费方），作为所有整改组件取值的唯一来源；禁止组件内硬编码色值。验收：新增 `tests/audit/ds-token-contract.test.ts`，只对上表已有双主题精确值的变量做数字精确断言；标为“待证”的变量先保持门禁红，不得填入猜测值。

### 1.2 Input 体系 wrapper 契约（input / clearable-input / combobox / search-input / keyboard-input）

官方契约（clearable-input 实测，evidence-live.md §1–§3）：

- 容器 `div[data-geist-input-wrapper][data-version="v1"]`：无真实 border，ring = box-shadow 1px（light #00000014 / dark #ffffff24），radius 6px，`transition-all 0.15s cubic-bezier(0.4,0,0.2,1)`，`has-[:focus]` 时 ring 变为 1px 0.34/0.51 + 4px 0.16/0.24（dark 0.51/0.24），hover 加深至 alpha-500。
- input：h36px、text-sm、px-3、`spellcheck=false autocapitalize=none autocomplete=off autocorrect=off aria-invalid=false`；placeholder = 前景 50%；disabled bg gray-100 文字 gray-700。
- 后缀区 `label[aria-hidden=true][data-geist-input-suffix]`：有值/cmdk 才渲染；清除控件 = **kbd Esc 键帽**（28×20，ring 1px，rounded-sm，text-xs）包在 button 内，非 X 图标；disabled 时 button `tabindex=-1`；按钮 focus-visible outline 2px #0072f5 offset -1；`pointer-coarse` 隐藏；cmdk 后缀 `max-[960px]:hidden`。
- **决策 D-I1**：抽取共享 `InputWrapper`（或等价内部组件）承载上述状态机，clearable-input 与 combobox 共用；`label`/`cmdk`/`onClear` 成为 clearable-input 一等 props。Breaking：`ClearableInputProps` 增加 `label?: string; cmdk?: boolean; onClear?`；清除控件视觉从 X 换为 kbd Esc（本地 tests/clearable-input-api.test.ts 需同步改契约）。
- **待证**：combobox 的 input 侧与 wrapper 侧差异（零证据，见 §3 BLOCKED）。

### 1.3 Menu 体系表面契约（menu / dots-menu / context-menu）

官方实测（context-menu-diff-table.md + dots-menu interact + 框架 §3）：

- 浮层表面：radius **12px**、padding **6px**（`--ds-popover-padding`）、阴影 `--material-shadow-menu`（1px rgba(0,0,0,.08) 环 + 4 层 + `rgb(250,250,250) 0 0 0 1px` 外环）、无真实 border、行高 36px（`--ds-popover-row-height`）、行圆角 6px、行水平 padding 0 8px、文字 14px/20px/400、light #171717 / dark #ededed。
- 容器 dark bg **#0a0a0a**（`--ds-background-100`），非 #1a1a1a。
- 高亮：`data-[highlighted]:bg-gray-alpha-100`（light rgba(0,0,0,.05) / dark rgba(255,255,255,.06)）。
- 375 移动端：**`max-sm:w-full!` + `max-sm:rounded-b-0`**（context-menu 实测 104×172 内容自适应）；本地固定 160px 无 max-sm 类。
- Portal 差异（需实测确认）：context-menu 菜单 → BODY（popper wrapper）；dots-menu 菜单在 `div.z-[var(--ds-z-menu)]` 内、position static（非 body 直挂）。两者不得强制同构。
- **决策 D-M1**：menu.tsx 表面 token（radius/padding/shadow/row）统一到 §1.1 表；`--material-shadow-menu` 进主题层。**决策 D-M2**：context-menu 支持 `href`（渲染 `<a role="menuitem">`）、`prefix`/`suffix`（span.flex.mr-2/ml-2 + 16×16 svg）——官方 ContextMenuItem API（CM-1/CM-2）。**决策 D-M3**：dots-menu 保持现有菜单触发契约，按官方数据补 Sizes/Disabled/Disabled Menu Item 变体。

### 1.4 Dialog / Drawer 浮层体系

- **发现**：官方 Drawer 基于 **Base UI**（`data-base-ui-focusable`、`data-open`、`--drawer-swipe-*` 变量、snap point、`div.geist-dialog` 高特异性覆盖工具类）。官方有效渲染：`max-h 80dvh`（覆盖 class 90dvh）、圆角 8px（覆盖 rounded-t-[10px]）、无 border-top（覆盖 border-t）、z-200、滚动锁 `overflow:clip`（html+body，`scrollbar-width:none` + border-right 补偿）、开合 `transition transform 0.5s cubic-bezier(0.32,0.72,0,1)`、面板 dark bg #0a0a0a、5 层 elevation 阴影。本地（Radix）：90dvh/10px/1px 边框/#000/无阴影/0.15s animation/overflow:hidden。
- **决策 D-D1**：Drawer 不并入 Radix Dialog 重构；以官方 Base UI 契约为目标重写 `drawer.tsx` 的尺寸/圆角/边框/阴影/动效/滚动锁（数值见 §2 drawer 行），DOM 标记保持官方形态（role=dialog、data-open、tabindex=-1；本地现有 aria-labelledby/describedby 属增强，可保留但必须记录）。默认即 `overflow-y-auto`（verticalScroll 不再作为开关，官方 D2）。
- **决策 D-D2**：Modal/Sheet 的共享 Dialog primitive 设计**冻结**（零证据，禁止推断）；只允许在证据到位后（Task 8 补证）再定 z/overlay/motion/尺寸。Task 10 的 modal/sheet 部分移入 BLOCKED 批次。
- **决策 D-D3**：滚动锁契约统一为 `overflow:clip`（html+body）——有 drawer 官方实测；modal/sheet 待证。

### 1.5 Tooltip / HoverCard 体系

- Description tooltip 官方表面：13px/1.3、radius 8px、padding 6×8、max-w **250px**、z 99999、反色 #0a0a0a/#ededed、**无阴影**（TIP-05）；本地 256px + material 阴影 + class 声明 rounded-[6px]。指示器：`span.inline-block.align-[-2px].ml-1.s-[14px]` > 14×14 圆形填充 glyph（无 aria-hidden），本地为 lucide Info stroke 图标 + aria-hidden。
- **决策 D-T2**：tooltip 表面 token 统一（250px/无阴影/radius 8px 类声明）；Description 指示器改为官方形态（14×14 圆点），wrapper 定宽 s-[14px]。
- Context Card 交互契约（hover 打开、~150ms delay、alignment、render prop）双端 **BLOCKED**（无 open 态证据）→ 交互部分设计冻结，视觉部分按 FAIL 清单整改（§2）。

---

## 2. 逐组件设计决策

格式：官方事实（证据引用）→ 本地现状 → 目标 API → breaking → 响应式修复层级 → ARIA/动效 → 允许修改文件 → 验收标准 → 批次。

### 2.1 Choicebox（B1）

- **官方事实**（choicebox-evidence.md）：API `ChoiceboxGroup`/`ChoiceboxGroupItem`：`label`、`onChange`、`type`（radio|checkbox）、`value`、`listClassName`、`showLabel`、`disabled`、`title`、`description`。DOM：`div[role=radiogroup|group]`（aria-label/aria-labelledby、aria-multiselectable）> `ul.flex.flex-row gap-3` > `label[aria-selected]`（flex-1 flex-col，含 `div[data-slot=choicebox-group-item-option]`、title span#choicebox-title-_、desc span#choicebox-description-_、`span[aria-hidden].size-4` 指示器、`input.sr-only.peer`）。multi = checkbox + 对勾 svg；**children 仅选中时渲染** + blue-600 1px 分隔线。视觉：tile 6px 圆角、选中 border #52AEFF/#0091FF、选中文字 blue-900、选中 bg blue-100、未选中 border gray-200（#EBEBEB/#2E2E2E）、disabled 文字 gray-500 opacity 1 且 border 不变灰、hover（enabled）border gray-500 + bg gray-100、focus-visible indigo-600 2px offset-2、单选点 border gray-500、多行内容正常折行 tile 随内容增高（375 下 90px 高）。
- **本地现状**：`Choicebox`/`ChoiceboxItem`/`ChoiceboxLabel`/`ChoiceboxDescription`，Radix RadioGroup 仅单选；无 label/type/listClassName/showLabel/title/description/disabled props；DOM button[role=radio]；选中暗色文字 #0091FF（错）、圆点 border gray-700（错）、hover 无 border 变化、focus 双环非 indigo。
- **目标 API**：`ChoiceboxGroup`（label/type/listClassName/showLabel/disabled/className）+ `ChoiceboxGroupItem`（value/title/description/disabled/children-as-selected-content）。**Breaking**：`Choicebox`→`ChoiceboxGroup`、`ChoiceboxItem`→`ChoiceboxGroupItem` 一次性迁移（计划 §9.1 同类），本地 demo + tests/choicebox-api.test.ts 同步。
- **响应式**：官方 ul 恒 flex-row（demo 用 listClassName 控制）；tile flex-1 等高（items-stretch）；375 下 desc 折行增高。修复层级：tile = 组件契约（title/desc 换行、min-h 无、stretch），非 demo 外层。
- **ARIA**：radiogroup/group + aria-multiselectable + label aria-selected + sr-only input peer；children 选中渲染不影响 aria。
- **动效**：指示器 ::after scale 过渡（官方单选点填充），transition 200ms 级。
- **允许修改文件**：`src/components/ui/choicebox.tsx`、`tests/choicebox-api.test.ts`、docs demo（`docs/geist/src/components/docs-components-page.tsx` + i18n `components-demo.ts`，串行）。
- **验收**：A1–A4、D1–D2、S2、S5–S9 差异清零；multi 对勾 svg rect/stroke 与官方像素一致；375 多行等高；`vp test tests/choicebox-api.test.ts` 绿 + 官方/本地 diff（补证后）。

### 2.2 Clearable Input（B1）

- **官方事实**（evidence-live.md）：5 demo（Default/With Label/With Cmdk/Disabled/With Clear Callback）；wrapper `data-geist-input-wrapper data-version=v1`（ring 1px alpha-400、r6、transition 150ms）；h36 text-sm px-3；label prop → `label[data-version=v1][for]`（13px/19.5、gray-900、mb-8px、capitalize）+ input aria-label；cmdk prop → kbd Esc+⌘K 后缀（各 20×20、ring 1px、`max-[960px]:hidden`、input 右圆角 0）；清除 = kbd Esc 键帽 28×20 于 button（aria-hidden label 包裹）；disabled = input bg gray-100 #f2f2f2/#1a1a1a 文字 gray-700 #8f8f8f、button tabindex=-1、点击/Esc 无效；focus ring 1px .34/.51 + 4px .16/.24；hover alpha-500；placeholder 前景 50%；`pointer-coarse:hidden` 隐藏清除。
- **本地现状**：X 图标；label/cmdk 作为未知属性落 input；disabled 配色 bg-muted #f7f7f7 + muted-foreground #4d4d4d（两套都错）；无 hover ring；focus 双环 #006efe；清除控件 AT 可见（aria-label）与官方 aria-hidden 契约不同；本地仅 1 个 demo。
- **目标 API**：`ClearableInputProps` += `label?: string`、`cmdk?: boolean`（保留 `onClear`、受控/非受控、disabled）。**Breaking**：清除按钮视觉 X→kbd Esc；`tests/clearable-input-api.test.ts` 的 inline 段契约与 AT 断言更新（本地 aria-hidden 与官方一致或显式豁免并记录）。
- **响应式**：cmdk 后缀 <960px 隐藏；coarse pointer 隐藏清除；wrapper max-w-full 收缩（375 ≈327px）。修复层级：wrapper/后缀 shrink-0 为组件契约。
- **ARIA**：input aria-label（label 时）、aria-invalid=false、spellcheck/autocomplete 属性集；后缀整体 aria-hidden。
- **动效**：wrapper 150ms；button color/box-shadow/border-color 150ms。
- **允许修改文件**：`src/components/ui/clearable-input.tsx`、共享 input wrapper（§1.2）、`tests/clearable-input-api.test.ts`、docs demo/i18n（串行）。
- **验收**：kbd Esc 键帽 28×20 渲染；label/cmdk demo 可交互；disabled 点击/Esc 无效（button 无 disabled 属性缺陷修复）；focus/hover/placeholder 色值精确匹配；`pointer-coarse` 隐藏生效。

### 2.3 Command Menu（B1）

- **官方事实**（evidence-command-menu.md + STATUS.md）：cmdk 封装于 Radix Dialog；`data-testid="cmdk/root"`、cmdk-item/group/list/input/separator/group-heading、`data-selected`、`cmdkScaleIn/cmdkFadeIn/cmdkLoading/cmdk-empty`；打开即选中首项、焦点在 input；content 固定 `w-[640px] top-[15%]`；overlay `bg-background-100 opacity-80`；Esc 关闭焦点→BODY；输入 16/18px（sm:text-lg）h-7 flex-1 内含 Esc 提示钮；list `max-h-none sm:max-h-[436px]`；item `px-2 py-0 min-h 36/40px`、`data-[selected=true]` + hover 仅 `@media(hover:hover) and (pointer:fine)`；group heading 13px gray-900 h36 px2 aria-hidden；divider `role=separator my-2 -ml-2 h-[1px] w-[calc(100%+16px)] bg-gray-alpha-400`；sr-only description（aria-describedby）；sm(401px) 响应式变体。
- **本地现状**：纯 Radix + 自写 DOM-focus 键盘轮换；无过滤/空态/aria 语义；overlay #0a0a0a 固定；w-full max-w-[640px] top-[85px]；无响应式 class；Esc 焦点回 trigger（与官方 BODY 不同）。
- **目标 API**：引入 cmdk（或等价组合框语义）承载过滤/空态/选中；保持 Radix Dialog 壳；content 尺寸/offset/overlay/motion 按官方数值。**Breaking**：组件内部实现替换，公开 API（open/onOpenChange/items 等现有 props）保留并在测试中锁定。
- **响应式**：官方 sm(401px) 变体（input 字号/条目高/listbox 布局/max-h）；375 视口 w-[640px] 溢出行为需复现（官方即溢出，本地不得“修好”它——除非加证据）。
- **ARIA**：combobox/listbox/option、aria-selected、aria-expanded、aria-describedby。
- **动效**：cmdkScaleIn 0.3s cubic-bezier(.175,.885,.32,1.1) scale .96 + cmdkFadeIn；本地 tailwindcss-animate 替换。
- **允许修改文件**：`src/components/ui/command-menu.tsx`（共享 Dialog 契约待 §1.4 冻结后接入）、`tests/command-menu-api.test.ts`（新建）、docs demo/i18n。
- **验收**：13 条差异路径（evidence §8）逐条闭环；过滤/空态/键盘循环/焦点语义测试；375 与官方同构。

### 2.4 Code Block（B1）

- **官方事实**（code-block.json + evidence-summary.md）：9 官方段；API props：`highlightedLinesNumbers`、`addedLinesNumbers`/`removedLinesNumbers`、`switcher={{options,value,onChange}}`（原生 select opacity-0 覆盖自定义 div）、`tabs={{options,value,onChange}}`（role=tablist、h24 r6、overflow-x-auto）、`hideLineNumbers`、`v0="ask"|"build"`（build → dropdown MVP/Full Example → v0.app/chat?q=）、语言 label **不渲染**（language 只驱动 prism class + 高亮）；行号 button 36w aria-label "Add line anchor to the URL" tabindex -1；highlight #e0f0ff/#0f2f57；diff −/+ #ffe6e6/#daf6da、#561a1e/#12361b；referenced amber #fef0cd/#4d2a00、id `<blockId>-L<n>`；header h48 bg #fafafa/#000 border-b gray-400 filename 13px/19.5 #4d4d4d/#a1a1a1；copy 32×32 r5 透明（headerless 时 absolute right-4 top16 opacity-0→group-hover/focus 100 bg #fafafa）；pre `.prism-code` pad 20px 0 overflow-x auto；容器 r6 1px #ebebeb/#2e2e2e。
- **本地现状**：filename/language 仅两 props；语言 label 渲染（官方不渲染）；r8（官方 6）；header bg 透明；copy 36×36 ringed + “Copied”反馈（官方无）；纯文本 pre 0 token 0 行号；1 demo。
- **目标 API**：CodeBlockProps += 上述 9 能力 props；引入语法高亮（prism 或等价）与行号/高亮/差异/引用行渲染。**Breaking**：`language` label 语义移除；header 渲染条件改为 filename 存在（headerless 浮动 copy）。
- **响应式**：pre overflow-x auto 为组件契约；tablist overflow-x-auto。
- **ARIA**：行号 button（aria-label、tabindex -1）、tablist/tab、v0 链接。
- **动效**：官方无 Copied 反馈动画（本地移除或证据豁免）。
- **允许修改文件**：`src/components/ui/code-block.tsx`、`tests/code-block-api.test.ts`（新建）、docs demo/i18n；如需要高亮依赖 `vp add`（按计划 §6 记录）。
- **验收**：CB-01…CB-12 逐条闭环；9 变体 demo；行号/高亮/差异/引用像素对照（补证后）。

### 2.5 Context Menu（B1）

- **官方事实**（README + diff-table + interactions）：16/16 真实视口 cells 全过（open/rest/主题/无溢出）；菜单 surface = §1.3 契约（r12、p6、`--material-shadow-menu`、行 36/6px、14/20/400、#171717/#ededed）；右键打开、指针锚定 menu.x≈pointer.x+2、body Portal、方向键/Enter/Esc/外点一致；API：`ContextMenuItem` 支持 `href`→`<a role=menuitem>`、`prefix`（span.flex.mr-2+16×16 svg）、`suffix`（span.flex.ml-2）、`value`+`onClick`（Enter 激活触发 onClick）；disabled → aria-disabled+data-disabled、#8f8f8f opacity 1、方向键跳过；375 `max-sm:w-full!`+`rounded-b-0`（104×172）；dark bg #0a0a0a；容器 r12（快照 md-refs 8px 已过期）；Shift+F10/菜单键实测不开（文档漂移，两端一致）；长按 BLOCKED。
- **本地现状**：Radix ContextMenu 直连；Menu.Item 渲染 div（href 无效）；无 prefix/suffix/value/onClick；r8；dark #1a1a1a；375 固定 160px；demo 1/4；禁用项样式 opacity-50 无显式色。
- **目标 API**：ContextMenuItem 增加 `href/prefix/suffix/value/onClick/disabled` 全契约；Demo 补齐 4 变体。**Breaking**：本地 demo 的 ContextMenuItem 用法迁移；`tests/context-menu-api.test.ts` 新建。
- **响应式**：`max-sm:w-full!` + `rounded-b-0` + 内容自适应宽度（104px 实测）。
- **ARIA**：menuitem/aria-disabled/data-disabled；a role=menuitem 的链接语义。
- **动效**：官方浮层无额外动画（维持）。
- **允许修改文件**：`src/components/ui/context-menu.tsx`、`tests/context-menu-api.test.ts`（新建）、docs demo/i18n。
- **验收**：CM-1…CM-11 闭环（CM-11 长按保持 BLOCKED 记录）；16-cell 矩阵复跑无回归。

### 2.6 Description（B1）

- **官方事实**（DIFF-REPORT）：核心 PASS（dl/dt/dd、14px/400 dt gray-900、14px/500 dd foreground、right/ellipsis 类串逐字一致、容器 r8/1px/bg 一致）；tooltip 指示器 `span.inline-block.align-[-2px].ml-1.s-[14px]` > 14×14 圆形填充 glyph；tooltip 表面 13px/1.3 r8 padding 6×8 **max-w 250px** z 99999 反色 **无阴影**；3 demo 均带 tooltip；hover 延时/focus 开启 aria-describedby。
- **本地现状**：核心一致；tooltip 256px + 阴影 + rounded-[6px] 类声明；lucide Info stroke 图标 aria-hidden；demo 无 right/ellipsis/tooltip 变体。
- **目标 API**：现有 `DescriptionProps`（title/content/tooltip/right/ellipsis）保持；demo 覆盖补全。无 breaking。
- **响应式**：RES-01 无溢出已 PASS；1440/1920 直接测量 BLOCKED（补证项）。
- **ARIA**：tooltip 指示器 aria 契约（官方 glyph 无 aria-hidden——按官方形态实现并复核 AT）。
- **动效**：无。
- **允许修改文件**：`src/components/ui/description.tsx`、`tests/description-api.test.ts`（新建或扩展）、docs demo/i18n；tooltip.tsx（§1.5 D-T2）。
- **验收**：TIP-05 清零（250px/无阴影/类声明 8px）；TIP-02 指示器形态对齐；3 变体 demo。

### 2.7 Dots Menu（B1*）

- **官方事实**（official-1440-light.json + interact）：4 区段（Default 1 trigger / Sizes 3 / Disabled 1 / Disabled Menu Item 1）；trigger 32×32 r6 透明 bg、icon 18×18、aria-haspopup + aria-label "Menu"、类 `geist-new-tertiary`（data-focus shadow `--ds-focus-ring`、data-hover bg gray-alpha-200、disabled text gray-700 bg gray-100）；菜单 surface：min-width 200px、r12、p6、`--material-shadow-menu`、行 36px r6 14/20/400；菜单在 `div.z-[var(--ds-z-menu)]` wrapper 内（position static，非 body portal）。
- **本地现状**：menu.tsx MenuContainer 驱动；仅 1440-light 对照；其余视口/主题 7 cells 缺失。
- **目标 API**：保持 DotsMenuProps（iconSize/disabled/contentClassName）；补 Sizes/Disabled/Disabled Menu Item 变体 demo。**Breaking**：无。
- **响应式**：矩阵 7/8 缺失 → 实施前补证（375/768/1920 × dark）。
- **ARIA**：trigger aria-haspopup/aria-expanded/aria-label（官方 "Menu"）。
- **动效**：无专门动画（保持）。
- **允许修改文件**：`src/components/ui/dots-menu.tsx`、`src/components/ui/menu.tsx`（§1.3 表面契约）、docs demo/i18n。
- **验收**：1440-light 契约精确匹配（200px/12px/6px/阴影/行 36/6px）；Sizes/Disabled 变体行为测试；补证后全矩阵复跑。

### 2.8 Drawer（B1）

- **官方事实**（REPORT.md + evidence cells）：**16/16 真实视口×主题 cell 全过 + 全交互矩阵**（open/Tab 陷阱/Esc/外点/swipe 40px 不关 160px 关/焦点返还/body 锁）PASS；差异 D1–D7：有效 max-h **80dvh**（覆盖 90dvh class）、顶部圆角 **8px**（覆盖 rounded-t-[10px]）、**无 border-top**（覆盖 border-t）、面板 dark bg **#0a0a0a**、**5 层 elevation 阴影**、开合 **0.5s** cubic-bezier(.32,.72,0,1)（本地 0.15s animation）；默认 `overflow-y-auto`；overlay oklab(0 0 0/.4) z-200 transition-opacity 0.3s；滚动锁 overflow:clip（html+body + scrollbar-width:none + border-right 补偿）；DOM role=dialog data-open tabindex=-1（Base UI）；snap point `--drawer-frontmost-height`（默认内容自适应 148px，custom height=200px 精确）；swipe 阻尼 ~0.75–0.84×（本地 1:1，阈值行为一致）。
- **本地现状**：Radix；90dvh/10px/1px border/#000/无阴影/0.15s/overflow 默认 visible；z-50；lock overflow:hidden；无 Custom height live demo。
- **目标 API**：DrawerProps（show/onDismiss/height/verticalScroll/className）保留；`verticalScroll` 语义改为默认滚动（官方无条件 auto），prop 保留为 no-op 兼容或按官方文档语义。**Breaking**：无 API 断裂；样式契约 D1–D7 全量替换。
- **响应式**：全宽底部 sheet 四视口一致（x=0 w=viewport）；max-h 80dvh；snap 高度内容自适应。
- **ARIA**：role=dialog、data-open、tabindex=-1；本地 aria-labelledby/describedby 为增强，保留并记录。
- **动效**：0.5s transition transform + 0.3s overlay opacity；swipe 阻尼实现对齐（0.75–0.84×）。
- **允许修改文件**：`src/components/ui/drawer.tsx`、`tests/drawer-api.test.ts`（新建/扩展）、docs demo（补 Custom height demo）、i18n。
- **验收**：D1–D7 清零（80dvh/8px/无边框/#0a0a0a/阴影/0.5s/默认滚动）；交互矩阵复跑（Tab/Esc/外点/swipe/焦点返还/锁）；Custom height live demo。

### 2.9 Empty State（B1）

- **官方事实**（official-sweep.json，真实四视口）：3 demo 区段（Empty state Design framework / Blank slate / Informational）× 8 cells 全 ok；容器 `[&>a]:text-sm rounded-lg py-12 gap-6 flex w-full flex-col items-center border px-[70px] border-[var(--ds-gray-200)] bg-[var(--ds-background-100)]`（r8、1px #ebebeb、py-48px px-70px、gap-24px）；bubble `rounded-lg flex shrink-0 items-center justify-center border border-[var(--ds-gray-alpha-400)] bg-[var(--ds-background-100)] p-[10px] text-[var(--ds-gray-900)]!`（54×54 r8）；title `text-gray-1000 font-medium mx-auto max-w-[340px] text-center text-balance text-heading-16`；desc/button/link 结构逐 viewport 有祖先链与 overflow 记录。
- **本地现状**：本地 sweep 8/8 cells FAIL（`[data-slot="empty-state"]` 超时、demo title not found）——本地 demo 页未渲染组件或结构不符；源码有 data-slot="empty-state"。
- **目标 API**：EmptyStateProps（title/description/icon）保持；补 3 变体 demo。**Breaking**：无。
- **响应式**：官方容器 px-[70px] py-12 在 375 下仍保持（262px 容器实测）——复制官方类契约；overflow 全视口无。
- **ARIA**：官方容器/链接结构待 open 证据细化（title/desc/button/link 语义）。
- **允许修改文件**：`src/components/ui/empty-state.tsx`、`tests/empty-state-api.test.ts`（新建）、docs demo/i18n。
- **验收**：本地 demo 页修复（组件渲染 + data-slot 定位）；3 变体 × 8 cells 复跑；容器/bubble/title 几何与官方一致。

### 2.10 Checkbox（B1）

- **官方事实**（official-only 64 cell pixel summary + evidence.json）：DOM `input[type=checkbox].sr-only.peer` + `span[--checkbox-color]` 指示器 16×16（size-4）r4（rounded-sm）border `--ds-gray-700`；checked → bg+border `--ds-gray-1000`；indeterminate 类 → svg line 显示；inverted 类变体；peer-checked/peer-disabled 组合（disabled+checked → gray-600；disabled 未选 → bg gray-100 border gray-500；hover → gray-200）；focus-visible `shadow-[var(--ds-focus-ring)]`；transition-all 200ms rotate 微偏移；对勾 svg path 2px。首轮 Dark 详细写入曾因 ENOSPC 失败，最终聚合已包含 32 个 Dark cells；本地运行时矩阵仍缺失。
- **本地现状**：Radix Checkbox + size prop；无 64-cell 对比。
- **目标 API**：保持 Checkbox（size/checked/onCheckedChange/disabled/indeterminate）；指示器几何/状态机按官方实现。**Breaking**：无（若 size 默认值与官方不同则迁移）。
- **响应式**：四视口一致（28×28 裁剪恒定）。
- **ARIA**：role=checkbox + aria-checked（Radix 原生）；sr-only input 结构对齐官方。
- **动效**：200ms transition-all。
- **允许修改文件**：`src/components/ui/checkbox.tsx`、`tests/checkbox-api.test.ts`（新建/扩展）、docs demo/i18n。
- **验收**：checked/indeterminate/disabled/hover/focus-visible 状态机像素对照（复用 64-cell 矩阵）。

### 2.11 Collapse（B2，条件放行）

- **官方事实**（部分可用，attribution 失败）：容器 `border-gray-alpha-400 bg-background-100 group relative rounded-lg border`（r8）；trigger `button.geist-reset`（aria-expanded/aria-controls、w-full flex justify-between、24px/36px/600 标题、focus-visible ring blue-700 2px）；chevron 16×16（lucide path 实测）；panel `role=region` `transition-all duration-200 ease-in-out`、内容 `max-h-[60vh] overflow-y-auto`、closed h=0 overflow-y-hidden；官方 h2 区段 Default/Expanded/Multiple/Small 确认存在。
- **本地现状**：本地矩阵 FATAL（findDemo 崩溃）；无对照。
- **目标 API**：Collapse/CollapseTrigger/CollapseContent 保持；`forceMount` 默认值按官方 closed-DOM 契约核对（官方 closed 仍挂载 panel h=0）。**Breaking**：待归属补证后定。
- **响应式**：四视口官方 cells 已采（归属不可信 → 全部重采）。
- **允许修改文件**：`src/components/ui/collapse.tsx`、`tests/collapse-api.test.ts`（新建）、docs demo/i18n。
- **验收（先决）**：demo 归属修复（collector `--demo-id` + h2→demo 定位链路重跑）；结构/动效/归属三证齐全后才实施。

### 2.12 Context Card（B2，条件放行）

- **官方事实**（diff-table）：视觉 FAIL 实测（r6 vs 8、w-fit vs w-64、dark bg #0a0a0a vs #000、string content 16px/24px vs 13px muted、p3 vs p4、箭头 14×7 svg stroke #dbdbdb/#252525 z 999999999、z-1000000 vs z-50、阴影 4 层、打开动画 transform/width/height 250ms+150ms 无淡入）；closed 态持续挂载（wrapper h-0 pointer-events-none 无 data-state）；side 锚定 closed 实测（right 会翻转为左侧）；官方 trigger 纯 div 不可聚焦（文档漂移）；官方 API ContextCardTrigger（content/side/align/render）；render 合并 `inline-flex cursor-pointer flex-[0_1_auto] overflow-hidden`。
- **本地现状**：ContextCard 组合 API + ContextCardTrigger（openDelay 150/closeDelay 0/sideOffset 8）已存在但 docs 0 使用；r8/w-64/#000/13px muted/无箭头/z-50/Radix fade+zoom-95。
- **目标 API**：保留 ContextCardTrigger；组合式 ContextCard 系列保留为本地扩展（记录无官方对应）；docs 补 3 trigger demo。**Breaking**：无。
- **响应式**：375/768/1440/1920 UNVERIFIED → 先补证。
- **ARIA/交互**：hover/focus/open/Esc 双端 BLOCKED → 设计冻结，交互验收不授予。
- **允许修改文件**：`src/components/ui/context-card.tsx`、`tests/context-card-api.test.ts`（新建）、docs demo/i18n。
- **验收（先决）**：open 态证据（真实 hover/pointer）到位；视觉 8 项 FAIL 闭环。

### 2.13 Entity（B2，条件放行）

- **官方事实**（RSC samples + interactions）：API `Entity`（`left`/`right`/`as`）、`EntityContent`（`title`/`description`/`fill`）、`EntityList`（li 组合、`as="li"`）、Skeleton 组合、Checkbox 组合（sample_3+）；codePanels 提取成功。
- **本地现状**：Entity/EntityMedia/EntityContent/EntityTitle/EntityDescription/EntityAction；**无 EntityList**。重跑的 8 个本地 cells 均未定位到 Entity DOM（sections/slots/entityRows 全为 0），其中 4 个 Dark cells 还未切到 Dark 主题。
- **目标 API**：+`EntityList`；Entity 支持 left/right（本地为 media/action 语义，需映射）。**Breaking**：EntityMedia/EntityAction 与官方 left/right 的对应关系定案后一次性迁移。
- **响应式**：官方 375/768/1440/1920 × light/dark 共 8 cells 已成功，7 个页面区段和 48 个 slots 可观测；本地同矩阵无组件 DOM，暂不能 comparison 或冻结本地修复数值。
- **允许修改文件**：`src/components/ui/entity.tsx`、`tests/entity-api.test.ts`（新建）、docs demo/i18n。
- **验收（先决）**：修复本地 demo/route 定位与 Dark 主题切换，重采本地 8 cells；再生成同 cell comparison，复现官方 6 个组件 demo（页面另有 Best Practices 区段）。

### 2.14 Calendar（B2，先重取证）

- **官方事实**（本轮实时页主流程 + 2 张持久截图）：9 个 demo 已枚举；官方是 Popover 日期范围选择器，含 grid/gridcell、sizes、layouts、compact/stacked、min/max、timezone、Portal、Esc 与焦点返还。固定桌面视口实测了日期范围、禁用日期和主要键盘行为；Dark 与真实四视口、本地运行时仍缺失。Presets live 未显示预期 preset buttons，且 Shift+Arrow 与 Best Practices 文案冲突，均需父级复核。
- **本地现状**：静态单月 table，只有 selected/onSelect/defaultMonth；无 range/time/presets/sizes/layout/min-max/timezone/Popover/Portal。源码“简化版/BLOCKED”注释不能作为范围豁免。
- **目标 API**：架构方向已冻结为官方 Popover range picker；具体 presets/timezone props 与键盘细节在冲突复核后定案。不得在 Dark/四视口补证前写死视觉数值。
- **允许修改文件**：`src/components/ui/calendar.tsx`、`tests/calendar-api.test.ts`（新建）、docs demo/i18n（全部待证后）。
- **验收（先决）**：完整官方枚举 + 父级复核；禁止从“简化版”直接扩展。

### 2.15 Combobox（BLOCKED）

- 实时页面已枚举 14 个 demos，并确认官方公开结构为 `Combobox` + `ComboboxInput` + `ComboboxList` + `ComboboxOption`，单一 searchbox input 配 listbox/options；本地 Trigger/Content/Item 架构明确不一致。主流程覆盖 controlled/uncontrolled、disabled/error、width、empty、clearable、prefix/suffix、label、sizes、Modal 与 Sheet multi-line；但完整报告因当时磁盘写满未持久化，Dark computed 与真实四视口矩阵不完整。**API 方向可冻结，实施仍 BLOCKED**；解除条件 = 从 live transcript/原始产物重建持久报告并补 Dark、四视口和 Modal/Sheet 交互矩阵。

### 2.16 Modal / Sheet（BLOCKED）

- 零证据（无 phase-e 目录）。旧计划 `max-sm:` bottom-sheet 假设被统一计划 §5.6 明确禁止。解除条件 = Task 8 布局审计 worker 取证（Modal 移动端形态/断点/radius/height/animation/footer/focus/Portal；Sheet 默认值 vs demo override、四视口 width/margin/height/scroll）。解除前 Task 10 的 modal/sheet 共享层部分不实施（仅 §1.1 token 层可先行）。

---

## 3. BLOCKED / MISSING 总清单（含解除条件）

| #   | 组件/维度                                                                                                 | 状态              | 原因                                                                            | 解除条件                                                                                                                            |
| --- | --------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| G1  | 全部组件一致性 PASS                                                                                       | BLOCKED           | 无官方/本地同 cell comparison 产物（comparison.json/diff.png/overlay.png）      | Task 4 比较器产出并入实施闭环（TDD green 后跑 official/local 双侧采集）                                                             |
| G2  | choicebox/clearable-input/command-menu/code-block/context-card/dots-menu/description 的 375/768/1440/1920 | BLOCKED（推断级） | browser_tools 视口钳制（1262×568/782×462）                                      | 改用 CDP Emulation.setDeviceMetricsOverride 或 playwright-core 重采（drawer/empty-state/checkbox/context-menu/collapse 已示范可行） |
| G3  | Combobox Dark/四视口/持久证据                                                                             | BLOCKED/MISSING   | 14 demo 与主流程已取证，但完整报告因磁盘写满未持久化                            | 重建报告并补 Dark、四视口、Modal/Sheet 交互矩阵                                                                                     |
| G4  | Modal/Sheet 全维度 + 共享 Dialog 契约                                                                     | MISSING           | 零证据                                                                          | Task 8 取证                                                                                                                         |
| G5  | Calendar Dark/本地/四视口与冲突项                                                                         | MISSING           | 9 demo 和桌面主流程已取证；Presets、Shift+Arrow 与文档冲突                      | 父级重开 live 复核冲突，并补 Dark 与官方/本地四视口矩阵                                                                             |
| G6  | Entity 本地矩阵                                                                                           | MISSING           | 官方 8/8 成功；本地 8/8 无 Entity DOM，且 4 个 Dark cells themeFail             | 修复本地 demo/route 定位与 Dark 主题切换，重采本地 cells 并生成同 cell comparison                                                   |
| G7  | Collapse demo 归属                                                                                        | BLOCKED           | findDemo 全部命中同一元素                                                       | 按 h2 区段 + data-demo-id 定位链路重采（collector `--demo-id` 拒绝 main fallback 已可用）                                           |
| G8  | Collapse 本地矩阵                                                                                         | MISSING           | findDemo FATAL                                                                  | 修复本地探针（h3btns=0）                                                                                                            |
| G9  | Context Card 交互态（hover/open/Esc/焦点）                                                                | BLOCKED（双端）   | 官方 open 态无法 trusted 触发；本地无 demo                                      | 真实 pointer/hover CDP 或 playwright 取证                                                                                           |
| G10 | Context Card / Calendar 视口矩阵                                                                          | UNVERIFIED        | 未测                                                                            | 同 G2 方案                                                                                                                          |
| G11 | Description 1440/1920                                                                                     | BLOCKED           | headless 弹窗钳制                                                               | 同 G2                                                                                                                               |
| G12 | Dots Menu 矩阵 7/8 cells                                                                                  | MISSING           | 仅 1440-light                                                                   | 补 375/768/1920 × dark × interact                                                                                                   |
| G13 | 本地 Empty State demo                                                                                     | MISSING/BLOCKED   | sweep 8/8 超时（`[data-slot="empty-state"]` 不存在于 demo 页）                  | 本地 demo 修复后重采                                                                                                                |
| G14 | Context Menu 长按打开                                                                                     | BLOCKED（环境）   | 无头触控不产生 contextmenu                                                      | 真机/触控仿真；两端一致，不影响实施                                                                                                 |
| G15 | Drawer 本地 Custom height / verticalScroll live 渲染                                                      | UNVERIFIED        | 无 demo                                                                         | 补 demo 后复测                                                                                                                      |
| G16 | 官方 md-refs 快照漂移                                                                                     | FAIL（快照层）    | context-menu r8 vs 12、context-card 8px/0.14 混入本地值                         | 实施批次开始时重开官方页面，先更新 `docs/geist-markdown-refs/` 快照再落代码                                                         |
| G17 | 官方页面文案漂移（不阻塞）                                                                                | INFO              | Command Menu Esc 焦点、Context Card 键盘聚焦、Context Menu Shift+F10 与文档不符 | 以实测为准，验收测试按实测写                                                                                                        |

---

## 4. 批次边界（可进入 TDD 实施的集合）

**进入条件**（框架 §6.2）：官方事实冻结（带 sourceTimestamp）+ 差异清单明确 + 允许修改文件白名单确定 + 验收标准可测。**不要求**当前一致性 PASS（那属于 Task 17 终验）。

### Batch 0 — 共享基础层（先行，TDD-ready）

- §1.1 `--ds-*` token 对照表落地（styles/index.css 主题层）+ `tests/audit/ds-token-contract.test.ts`。
- §1.2 Input wrapper 契约（clearable-input 直接证据；`input.tsx` 抽取仅为复用边界推断，须先用现有 Input 回归测试锁定公开行为）+ 测试。
- §1.3 Menu 表面契约（menu.tsx：radius 12/padding 6/`--material-shadow-menu`/行 36/6px）+ 测试。
- 允许文件：`src/styles/index.css`、`src/components/ui/input.tsx`、`src/components/ui/menu.tsx`、`src/components/ui/tooltip.tsx`（§1.5）、对应新测试。
- 边界：**modal/sheet 不在本批**（Dialog 契约 BLOCKED，见 G4）。

### Batch 1 — 证据完备组件（10 个，可立即 TDD）

Choicebox、Clearable Input、Command Menu、Code Block、Context Menu、Description、Dots Menu、Drawer、Empty State、Checkbox。

- 每个组件按 §2 验收标准走 red → green → demo（`data-demo-id` section）→ 官方/本地 diff（补证后）→ 独立规格/质量审查 → 签名提交（计划 Task 11/12/14/15 映射；本批对应 Task 11 的 4 个 + Task 12 的 3 个（除 Combobox）+ Task 14 的 Code Block + Task 15 的 Drawer/Empty State）。
- Dots Menu 标注 B1*：组件 TDD 可启动，但进入独立终验（Task 17）前必须补齐 G12。

### Batch 2 — 条件放行（先补证 1 轮，再 TDD）

- Context Card：视觉 8 项 FAIL 可在 G9 补证前先修（视觉证据已实测），但交互验收冻结；文档 demo 的 3 trigger 用例可在补证后加入。
- Collapse：必须先过 G7/G8（demo 归属 + 本地矩阵），再实施。
- Entity：必须先过 G6（本地 demo/route + Dark 主题 + comparison），再按 §2.13 API 定案实施。
- Calendar：架构重写方向已冻结，但必须先过 G5 的冲突复核和矩阵补证，再进入 Task 13 的 9 个 TDD slices。

### BLOCKED — 禁止实施（零证据）

- Combobox（API 方向已冻结，但持久证据和矩阵不足；Task 12 暂减项）、Modal/Sheet（Task 10/15 减项）、共享 Dialog primitive。

### 串行约束（计划 §6 保持）

- `docs/geist/src/components/docs-components-page.tsx`、`docs/geist/src/i18n/components-demo.ts`、`src/components/ui/menu.tsx`、`src/components/ui/tooltip.tsx`、`src/components/ui/input.tsx`、`src/components/ui/modal.tsx`、`tests/audit/geist-audit-manifest.json`、`tests/audit/geist-audit-ledger.json` 同一时间只允许一个写入者。

---

## 5. 门禁执行记录与审查状态

- 本门禁已执行：统一计划复核（Task 9 步骤 1）、证据逐组件核对（步骤 1 细化，含重开一个复杂状态：drawer 375/1920 open+swipe、context-menu 1440 右键、checkbox 375 checked、empty-state 375 light）、共享依赖图与设计决策（步骤 2–4）、docs-only vs 框架能力边界（步骤 5）、Calendar “超出范围”前提撤销（步骤 6，见 §2.14——目标 API 冻结直到证据到位）、BLOCKED/MISSING 清单（§3）、批次边界（§4）。
- 独立只读审查者规格审查（步骤 7）：首轮 **CHANGES_REQUIRED**（2026-08-11 15:54 UTC+8，唯一 P1 为 Entity 新矩阵与旧台账矛盾）；修正后最终复审 **APPROVE**（2026-08-11 16:04 UTC+8，无 P0/P1）。Entity 事实已据 `entity/evidence/cell-manifest.json` 与 16 个 cell JSON 更新为“官方 8/8 成功，本地 8/8 无 DOM，Dark 4/4 themeFail”，继续保持 B2/RE_EVIDENCE_REQUIRED。此批准仅放行 §4 的 B0/B1，不放行 B2/BLOCKED 项，也不授予任何组件一致性 PASS。
- 提交：按计划 Task 9 步骤 8，门禁文档与机器契约使用 `docs(audit): 固化组件与响应式整改设计` 独立签名提交。

## 6. 证据引用索引（sourceTimestamp）

| 组件            | 主证据文件                                                                   | UTC 时间                        |
| --------------- | ---------------------------------------------------------------------------- | ------------------------------- |
| choicebox       | phase-e/choicebox/choicebox-evidence.md（4 官方区段；截图含 5 个可见 group） | 06:23–06:40                     |
| clearable-input | phase-e/clearable-input/evidence-live.md                                     | 06:24–06:40                     |
| command-menu    | phase-e/command-menu/evidence-command-menu.md + STATUS.md                    | 06:2x–06:33                     |
| code-block      | phase-e/code-block/code-block.json + evidence-summary.md                     | 06:23–06:50                     |
| collapse        | phase-e/collapse/evidence/official-manifest.json + cells                     | 06:42–06:45                     |
| context-card    | phase-e/context-card/report-context-card.json + diff-table.md                | 06:33–06:47                     |
| context-menu    | phase-e/context-menu/README.md + diff-table + evidence/*                     | 06:37–06:47（finalTs 06:59:55） |
| description     | phase-e/description/report.json + DIFF-REPORT.md                             | 06:33–06:42                     |
| dots-menu       | phase-e/dots-menu/evidence/official-1440-light{,-interact}.json              | 06:41–06:43                     |
| drawer          | phase-e/drawer/REPORT.md + evidence/*                                        | 06:33（矩阵 06:49–06:55）       |
| empty-state     | phase-e/empty-state/evidence/official-sweep.json                             | 06:41（local 06:48）            |
| entity          | phase-e/entity/evidence/official-rsc-samples.json + cell-manifest.json       | 06:40 API；07:04–07:09 cells    |
| checkbox        | phase-e/checkbox/pixel-summary.json + runs/*                                 | 06:44–06:48                     |
| calendar        | phase-e/calendar/evidence/* + delegation/live-transcript.log                 | 06:24–06:40                     |
| combobox        | phase-e/combobox/delegation/live-transcript.log（仍须重建结构化报告）        | 06:24–06:42                     |
| modal / sheet   | （无）                                                                       | —                               |

> 官方页面变化时（计划 §9.5）：每个实施批次开始时必须重开官方实时页面；live 与快照冲突时先更新 `docs/geist-markdown-refs/` 快照与 manifest，再落代码。
