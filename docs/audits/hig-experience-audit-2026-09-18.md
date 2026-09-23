# Apple HIG 全量体验审核报告（只读）

> 审核日期：2026-09-18
> 审核类型：**只读审核**，未修改任何产品实现、未新增或修改公共 API、未 commit / 未 push
> 判断尺度：**简约排版为主体，模糊、材质与动效作为点缀**
> 审核基线：见 §2「基线漂移」——对象在审核期间持续变动
> 配套文件：`docs/audits/hig-coverage-matrix-2026-09-18.md`（覆盖矩阵）、`docs/audits/hig-experience-audit-2026-09-18-addendum-phase2.md`（**二期新增组件补审，含 HIG-AUD-038~050**）、`.scratch/hig-audit-2026-09-18/baseline-and-evidence.md`（原始证据）

---

## 1. 审核摘要

### 1.1 结论概览

| 维度 | 结论 |
|---|---|
| 排版与布局 | **基础扎实**。token 化的字号/圆角/spacing 体系、双主题、全量路由 × 六档视口 × 双主题的既有 e2e 布局审计，是本仓库最强的部分。主要缺口在**布局原语能力**（SafeArea/Stack 缺失）与**安全区域**在部分浮层漏做。 |
| 视觉与材质 | **不统一**。同一族浮层的 overlay 背板存在 **5 种写法**、z-index 存在 **token 体系/硬编码/完全缺失**三种状态。这是本报告最集中的跨组件问题。 |
| 动画 | **入场齐全、退场残缺、token 覆盖不全**。多数浮层只有入场动画；`menu`/`context-menu` 退场缺 `zoom-out`；`select`/`toast`/`edit-menu` 完全无退场；`drawer`/`bottom-sheet`/`command-menu`/`destructive-action-modal` 未使用时长 token。`prefers-reduced-motion` 仅 28/94 个组件文件有处理。 |
| 输入与交互 | **原 3 个阻断级缺陷与 2 条键盘可达性缺陷均已于 2026-09-21 修复**：BottomSheet 面板级指针捕获吞掉内部滚动（003）、Quick Actions 遮罩层压在菜单内容之上（001）、EditMenu 键盘不可达（004）、ContextMenu 无键盘打开路径（002）。逐条「修复后证据」见 §3.1。 |
| 可访问性 | **焦点管理是本仓库的强项**（drawer/modal/bottom-sheet/command-menu/hamburger 均自实现归还并注释了 Radix 竞态），但**存在系统性遗漏**：SidePanel 漏做导致关闭后焦点掉到 `body`；3 处 i18n key 缺失导致中文站点回显英文 key 原文；触控目标普遍低于 44pt；`tooltip` 给装饰元素强注 `tabIndex=0`。 |
| 生态完整性 | **HIG 八项能力在复核时已全部落地**（均由并发会话在审核后段完成，其中 6 项**未被本轮审核覆盖**，属「已实现未审核」）。文档链覆盖率高（**83 注册组件 = 83 双语指南**），但仍有 **7 个已从包入口导出的组件未进入文档注册**。 |
| 验证能力 | **几何与键盘自动化强，环境敏感性验证缺失**：无 200% 缩放、无强制颜色、无 Playwright 触屏仿真、仅 Chromium。**HIG 官方正文无法静态获取**，故本报告的规范判定基准已改用可核验的 Web 平台标准（见 §3）。 |

### 1.2 问题数量

| 严重度 | 数量 | 含义 |
|---|---|---|
| **P0** | 5（**原 HIG-AUD-005 已撤回**；**HIG-AUD-001 / 002 / 003 / 004 / 051 五条已于 2026-09-21 全部修复并运行确认**） | 组件不可用 / 键盘完全不可达 / 治理门禁失败 |
| **P1** | 23（+3，含二期补审 HIG-AUD-038/039/040；其中 038/039/040/037 已于同日完成**运行确认**；**038 已于 2026-09-22 修复并运行确认**（增补 §5D）；**006/007 亦已于 2026-09-22 成对修复并运行确认**（增补 §5E）；**009/011/012（浮层 token 化三件套）已于 2026-09-23 修复并运行确认**（增补 §5K）） | 跨组件契约与一致性、可访问性缺口（有替代路径） |
| **P2** | 12（+4，含二期补审 HIG-AUD-041~044；+1 HIG-AUD-052 legacy 账本旁路；+1 HIG-AUD-053 命令面板搜索相关性回归——由 `test:docs-layout` 稳定失败发现） | 状态覆盖、测试治理与边界打磨 |
| **P3** | 9（+4，含二期补审 HIG-AUD-045~050） | 审美、文档与一致性建议 |
| 能力缺口 | **0 项未落地**；HIG 八项已全部落地且**已全部补审**（补审结论见 addendum）；仍存形态不完整项（HIG-GAP-07） | 见 §4.5 与补充报告 |
| 文档问题 | 5 | 注册链 / 计划与文档漂移 / 未导出组件 |
| 验证缺口 | 5 | 环境不支持或 harness 缺失，**不计为已确认缺陷**；原 HIG-VER-07（HIG 正文证据）**已解决** |

> 依据审核方案「待验证项单列，不算已确认缺陷」，所有依赖浏览器运行时才能定性的条目均标注 `[待运行验证]`，不计入 P0–P3 计数。

---

## 2. 方法与基线

### 2.1 审核基线漂移（必须先读）

审核期间仓库被**并发写入**，HEAD 三次前进，且审核开始时**不存在**的组件文件陆续出现：

| 观测时刻 | HEAD | 新出现的实现 |
|---|---|---|
| 开始 | `b68d3f0` | — |
| 中段 | `92a5b42` | `edit-menu.tsx`（`c0be2d4`）、`context-menu.tsx` Quick Actions 变体（`92a5b42`）已提交 |
| 落笔前 | `5d173ca` | `split-button.tsx` pull-down 变体（工作区未提交）、`activity-view.tsx`（工作区未提交） |
| 落笔后复核 | `16d0863` | 上两项已提交（`5d173ca`、`16d0863`），**工作区已清空**（`git status --porcelain` 仅剩本报告两个文件） |
| 二轮验证后 | `834f19d8` | 仅 1 个新提交 `834f19d`（`fix(bottom-sheet)` 拖拽方向跟手，`d6d5429..834f19d8` 已核实无其他改动）；工作区仍只剩本审计 3 个报告文件 |

近期提交序列（审核期间新增）：
`c0be2d4` edit-menu → `92a5b42` context-menu Quick Actions → `5d173ca` split-button pull-down + Select pop-up 对齐 → `16d0863` activity-view 分享面板。

**在 `16d0863` 上的复核结果**：HIG-AUD-001（遮罩 z=2001 / 内容无 z）**仍未修复**；HIG-AUD-005 的初版复核系**误判**（读取了过时的账本快照，详见 §4.1 该条目的撤回说明与 HIG-AUD-052）。

**2026-09-18 第二轮运行验证（基线 `d6d5429`，仓库工作区干净）**：以全新 dev server 完成 QA 崩溃定位（HIG-AUD-051）、二期 4 项 P1 的运行确认（HIG-AUD-037/038/039/040，证据见补充报告 §5A）、`pnpm test` 与治理测试退出码采集。

- 审核开始时工作区差异：`M src/lib/framework-messages.ts`、`M src/lib/index.ts`、`?? PLAN-HIG-COMPONENTS.md`、`?? src/components/ui/edit-menu.tsx`、`?? tests/edit-menu-api.test.tsx`。
- 报告落笔前工作区差异：`M docs/geist/src/data/component-api.ts`、`M .../components.ts`、`M .../best-practices-zh.ts`、`M .../components-zh.ts`、`M src/lib/index.ts`、`M tests/docs-coverage.test.ts`、`?? docs/geist/src/examples/activity-view/`、`?? src/components/ui/activity-view.tsx`、`?? tests/activity-view-api.test.ts`。
- 交付复核时（`16d0863`）工作区**已清空**，上述改动全部被并发会话提交。本次审核自身新增的文件只有本报告、覆盖矩阵与 `.scratch/hig-audit-2026-09-18/baseline-and-evidence.md`。
- 全文行号对应上表某一时刻；**文件行号在复验前可能已失效**。
- 本次审核**未触碰**任何既有修改。

**HIG-AUD-BASE-01**（类型：审核方法）
- 建议：整改前固定一个 commit（`git rev-parse HEAD`）并清理工作区，在冻结快照上复验本报告全部条目。
- 验收场景：报告每条的「证据行号」在冻结 commit 上复现一致。

### 2.2 审核范围

- **实现**：`src/components/ui/` 全部 `.tsx`（审核开始 94 个）+ `src/lib/`（i18n、theme、clipboard、input-modality 等）。
- **公共 API**：`src/lib/index.ts` 全部 85 个组件模块导出。
- **token**：`src/styles/index.css`（z-index / 时长 / 缓动 / 材质 / overlay）。
- **文档链**：`docs/geist/src/data/{components.ts,component-api.ts,docs-routes.ts}`、`content/component-guides/guides-01..18.ts`、`examples/`。
- **测试**：`tests/`（含 `tests/e2e/`、`tests/audit/`）。
- **未覆盖**（明确声明）：`docs/geist-markdown-refs/`（另一套 72 篇参考文档，与站点路由不同源）、`docs/superpowers/`。

### 2.3 本轮执行的检查

| 检查 | 结果 |
|---|---|
| `git status` / `log` / `diff --stat` | ✅ 已执行 |
| 清单与注册链交叉核对（静态） | ✅ 已执行 |
| 组件源码逐项静态审核 | ✅ 已执行（重点组件全文阅读） |
| `pnpm test` / `typecheck` / `build` / `docs:llm:check` | ❌ **未执行**（命令被取消/审批超时） |
| `pnpm run test:docs-layout` | ❌ **未执行**（同上） |
| 非 Chromium / 200% 缩放 / 强制颜色 / 触屏仿真 | ❌ 仓库无对应 harness，无命令可跑 |

> 依据 `AGENTS.md`「Never claim completion without fresh command output and observed exit codes」：本报告**不声称**任何测试、构建或浏览器审计已通过。依赖运行时的判断标注 `[待运行验证]`。

---

## 3. 规范来源核实与判定基准

审核方案要求「记录官方页面链接、适用平台与访问日期；无法取得正文的条目标记证据不足，不凭记忆判定违规」。核实结果：

**第一次尝试（静态抓取）**：全部失败，只得到 `THIS PAGE REQUIRES JAVASCRIPT.`。

**第二次尝试（chromium 真实渲染，JS 执行后取 `main` innerText）**：**全部成功**（HTTP 200）。抓取脚本 `.scratch/hig-audit-2026-09-18/fetch-hig-sources.mjs`，原始正文存于 `.scratch/hig-audit-2026-09-18/hig-sources/*.md`。

| 来源 | URL | 平台 | 抓取时间 | 页面变更日志（Apple 标注） |
|---|---|---|---|---|
| Getting Started | `.../getting-started` | 全平台 | 2026-09-18 | 仅索引页（273 字符） |
| Layout | `.../layout` | 全平台 | 2026-09-18 | 已取得 |
| **Motion** | `.../motion` | 全平台 | 2026-09-18 | 最近变更 **September 9, 2025**（Added guidance for Liquid Glass） |
| **Accessibility** | `.../accessibility` | 全平台 | 2026-09-18 | 已取得（含 44×44 pt 表格、200% 字号、Reduce Motion、Increase Contrast） |
| **Edit Menus** | `.../edit-menus` | iOS/iPadOS/macOS/visionOS | 2026-09-18 | 最近变更 **June 21, 2023** / September 14, 2022 |
| Home Screen Quick Actions | `.../home-screen-quick-actions` | iOS/iPadOS | 2026-09-18 | 已取得 |
| Pop-up Buttons | `.../pop-up-buttons` | iOS/iPadOS/macOS/visionOS | 2026-09-18 | 最近变更 October 24, 2023 / September 14, 2022 |
| Pull-down Buttons | `.../pull-down-buttons` | macOS/visionOS/iOS/iPadOS | 2026-09-18 | 最近变更 September 14, 2022 |
| The Menu Bar | `.../the-menu-bar` | macOS 等 | 2026-09-18 | 已取得 |
| Toolbars | `.../toolbars` | macOS/iOS | 2026-09-18 | 已取得 |
| Activity Views | `.../activity-views` | iOS/iPadOS/visionOS | 2026-09-18 | 已取得 |

### 3.1 关键规范原文（据此判定，不再依赖记忆）

**Motion**（`motion.md`）：
- 「Add motion purposefully, supporting the experience without overshadowing it. Don't add motion for the sake of adding motion. **Gratuitous or excessive animation can distract people**…」
- 「**Make motion optional.** … it's essential to avoid using it as the only way to communicate important information.」
- 「Aim for brevity and precision in feedback animations.」
- 「**Let people cancel motion.** As much as possible, don't make people wait for an animation to complete before they can do anything…」
- 「In apps, generally avoid adding motion to UI interactions that occur frequently.」

→ 直接支撑 HIG-AUD-011（退场缺失＝反馈不足）、HIG-AUD-019（reduced motion）、HIG-AUD-034（选区高频交互的闪动）、HIG-AUD-035（模糊装饰边界）。

**Accessibility**（`accessibility.md`）：
- 「give people the option to enlarge text by **at least 200 percent**」→ 使 HIG-VER-01 从「可选增强」变为**规范要求**。
- 触控目标表中出现 **`44x44 pt`**（两处）→ 本项目多数组件 24–36px 的**依据成立**。
- 「When this setting is active, ensure your app or game responds by reducing automatic and repetitive animations, **including zooming, scaling, and peripheral motion**」→ HIG-AUD-019。
- 「Strive to meet color contrast minimum standards … WCAG Level AA … check the minimum contrast in **both light and dark** appearances.… Increase Contrast」→ 支撑 HIG-VER-11 与 HIG-AUD-031。

**Layout**（`layout.md`）：
- 「respecting system-defined **safe areas**, margins, and guides」→ 支撑 SafeArea 能力（现已落地）与 `sheet` 缺 safe-area 的问题。
- 「**Be prepared for text-size changes.** … horizontally adjacent views may need to stack vertically … table rows or other containers may need to grow in height so that text isn't cropped」→ 支撑 200% 字号重排验证。

**Edit Menus**（`edit-menus.md`）：
- 「**Offer commands that are relevant in the current context, removing or dimming commands that don't apply.** For example, if nothing is selected, avoid showing options that require a selection, such as Copy or Cut.」→ **重要修正**：HIG 允许「移除**或**置灰」，因此 `edit-menu.tsx` 的「无回调则不渲染」是**合规选择**，不是缺陷（原 HIG-DOC-05 中「计划与实现漂移」的指责不成立，已更正）。
- 「Let people reveal an edit menu using the system-defined interactions they already know.」+ iPadOS 段：「when people use a **keyboard or pointing device** to reveal it, the edit menu opens **directly in a context menu**（竖向）」→ **新发现**：当前实现把鼠标（pointing device）路径也做成了横向胶囊，与 HIG 的 iPadOS 指引不同（见 HIG-AUD-036）。
- 「**Adjust an edit menu's placement, if necessary.** … you might need to move the menu to prevent it from covering important content or parts of your interface.」→ 支撑 HIG-AUD-021 的定位/避让问题。

**Home Screen Quick Actions**（`home-screen-quick-actions.md`）：
- 「Each Home Screen quick action includes a **title**, an interface **icon** on the left or right …, and an **optional subtitle**.」
- 「In addition to app-specific actions, a Home Screen quick action menu **also lists items for removing the app and editing the Home Screen**.」→ 支撑 HIG-GAP-07 的「系统尾项」缺口。
- 「you can provide a total of **four**」。
- ⚠ **修正**：该页正文**未提及**背景模糊或图标缩放动画；此前 `PLAN-HIG-COMPONENTS.md:51` 的「背景模糊 + 图标缩放动画」属**系统观感描述，非 HIG 正文**，本报告不再作为规范依据引用。

**Pull-down Buttons**（`pull-down-buttons.md`）：
- 「**Let people know when a pull-down button's menu item is destructive, and ask them to confirm their intent.** Menus use red text to highlight actions that you identify as potentially destructive. When people choose a destructive action, the system displays an action sheet … in which they can **confirm** their choice or cancel」→ 破坏性项**必须二次确认**；`split-button` pull-down 变体与 Quick Actions 的 destructive 项目前**无确认步骤**（新发现，见 HIG-AUD-037）。
- 「listing a **minimum of three items** can help the interaction feel worthwhile」→ 可作为 pull-down 变体的演示约束。

**Activity Views**（`activity-views.md`）：
- 「Avoid creating **duplicate versions of common actions** that are already available in the activity view.」
- 「If you need to create a custom interface icon, **center it in an area measuring about 70x70 pixels**.」
- 「**Use your main app to denote the progress of a lengthy operation.** An activity view dismisses immediately after people complete the task…」
- 「**Avoid placing a modal view above your extension.**」

**Pop-up Buttons**（`pop-up-buttons.md`）：
- 「A pop-up button displays a menu of **mutually exclusive options**.」
- 「Use a pull-down button instead if you need to: offer a list of actions / let people select multiple items / include a submenu」→ 明确了 Pop-up 与 Pull-down 的分工，支撑「Pop-up = Select」的整合判断。

**Toolbars / The Menu Bar**：正文已取得（各 14000 字符上限截断），存于 `hig-sources/`，本期仅用于确认「能力存在且适用平台」，未逐条比对实现。

**HIG-VER-07（已解决）**
- 静态抓取确实失败（`THIS PAGE REQUIRES JAVASCRIPT.`），但改用 **chromium 真实渲染**后，11 个页面全部取得正文与 Apple 标注的变更日志日期（见上表）。抓取产物受版本外置（`.scratch/`，不入库）。
- 判定基准改为**双轨**：
  1. **HIG 正文**（§3.1 逐条摘录，含页面变更日期）——用于「HIG 对齐」类判断；
  2. **可核验的 Web 平台标准**——用于可访问性与实现缺陷判断：WAI-ARIA APG（`menubar` / `menu` / `toolbar` / `slider` / `radiogroup`）、WCAG 2.2（2.1.1 键盘、2.2.1 计时、2.3.3 动画、2.4.3 焦点顺序、2.4.7 焦点可见、2.5.8 目标尺寸、1.4.11 非文本对比度）、Radix Primitives 实现语义（已读 `node_modules` 源码）、CSS 层叠与 Pointer Events 语义。
- 仍**不做**「违反 HIG 第 X 条」的断言：HIG 面向 Apple 平台，Web 适配取舍属项目判断（此立场在 §3 与 HIG-GAP-08 保持不变）。
- 补充方法：`node .scratch/hig-audit-2026-09-18/fetch-hig-sources.mjs`（需 chromium）。

---

## 4. 问题清单

严重度定义：

- **P0**：组件不可用 / 键盘用户完全不可达 / 治理门禁失败 → 必须最先处理
- **P1**：跨组件契约与一致性、可访问性缺口（存在替代路径）
- **P2**：状态覆盖与边界打磨
- **P3**：审美与一致性建议

类型定义：**实现缺陷** / **能力缺口** / **文档问题** / **审美建议** / **验证缺口**

---

### 4.1 P0 问题

#### HIG-AUD-001 Quick Actions 遮罩层压在菜单内容之上 → 默认配置下菜单不可用 ✅ **已修复**

- **严重度**：P0 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-18 第二轮运行验证：Quick Actions 菜单**打开即渲染崩溃**，遮罩压内容的 z 关系在修复 051 前无法独立观察；2026-09-21 复核：遮罩 200 < 菜单 2001、命中检测通过、无 pageerror）
- **依据**：CSS 层叠上下文（同层叠上下文中 `z-index: 2001` 必然绘制在 `z-index: auto` 之上）；Pointer Events 命中语义。
- **修复前证据（行号取自修复前版本，保留对照）**：
  - 遮罩：`src/components/ui/context-menu.tsx:162` — `class="fixed inset-0 z-[var(--uni-z-popover)] bg-black/40 backdrop-blur-sm …"`；`--uni-z-popover: 2001`（`src/styles/index.css:958`）。
  - 内容：`src/components/ui/context-menu.tsx:149-151`（`QUICK_ACTIONS_CONTENT_CLASS`）**无任何 z-index**；`ContextMenuPrimitive.Content` 自身也不注入 z-index（`node_modules/@radix-ui/react-context-menu/dist/index.mjs` 检索 `z-index|zIndex` → **0 命中**）。
  - 两者是同一 `Portal` 内的兄弟节点（`:157-172`），同属 `document.body` 层叠上下文。
  - `backdropBlur` 默认 `true`（修复后位于 `:185`）。
- **修复后证据（`src/components/ui/context-menu.tsx`）**：
  - 遮罩：`:154-156`（`QUICK_ACTIONS_SCRIM_CLASS`）— `z-[var(--uni-z-drawer)]`；`--uni-z-drawer: 200`（`src/styles/index.css:1025`）。
  - 内容：`:212` — `style={{ width, ...style, zIndex: "var(--uni-z-popover)" }}`，popper 包裹层显式抬到 `--uni-z-popover: 2001`（`src/styles/index.css:1033`）。
  - 遮罩改由 `QuickActionsScrim`（`:165-180`）在 `Content` 子树内渲染（`:216`）并自行 portal 到 `body`，不再是 `Content` 的兄弟节点。
- **实际表现（修复前，推断）**：Quick Actions 打开后，全屏模糊遮罩绘制在菜单之上，菜单被模糊+压暗且无法点击，组件默认用法不可用。
- **根因**：遮罩与内容共用一个 z-index token，且遮罩取了**高于内容**的值；没有建立「遮罩 < 内容」的层级契约。
- **修复**：遮罩改用低于内容的 `--uni-z-drawer`（200），内容显式抬到 `--uni-z-popover`（2001）；并随 HIG-AUD-051 把遮罩嵌进 `Content` 子树，让「遮罩 < 内容」成为结构契约而非巧合（`:210-211` 有对应注释）。
- **验收场景**：
  1. 触屏长按触发 Quick Actions，菜单可见、可点，遮罩仅覆盖菜单**之外**区域；
  2. `document.elementFromPoint(菜单项中心)` 命中该菜单项（可复用 `tests/e2e/docs-layout.spec.ts` 既有的 `elementFromPoint` 命中检测手法）；
  3. 双主题截图各一张，菜单文字对比度 ≥ 4.5:1。

#### HIG-AUD-002 ContextMenu 完全无法用键盘打开 ✅ **已修复**

- **严重度**：P0 ｜ **类型**：实现缺陷（依赖库边界未处理） ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-21 核查：触发器 `Tab` 可达且 `tabIndex=0`、键盘聚焦时 `focus-ring` 可见、`Shift+F10` 打开的菜单位置与「在触发器中心右键」**逐像素一致**、`ArrowDown` 后焦点落 `role=menuitem`、`Escape` 关闭后焦点归还触发器）
- **依据**：WAI-ARIA APG；WCAG 2.1.1 键盘可达。右键菜单的标准键盘入口是 `Shift+F10` / `ContextMenu` 键 / 菜单键。
- **修复前证据（行号取自修复前版本，保留对照）**：
  - `src/components/ui/context-menu.tsx:7` — `const ContextMenuTrigger = ContextMenuPrimitive.Trigger;`（纯转发，无任何增强）。
  - Radix 的 `ContextMenuPrimitive.Trigger` 渲染为 `Primitive.span` + `onContextMenu`，**无 `role`、无 `tabIndex`、无 `onKeyDown`**（`node_modules/@radix-ui/react-context-menu/dist/index.mjs:84-111`）。
  - 因此该触发器既不可聚焦，也不响应键盘。
- **修复后证据**：
  - `src/components/ui/context-menu.tsx:27-61` — `ContextMenuTrigger` 改为实现组件：`handleKeyDown`（`:31-48`）识别 `ContextMenu` 键（`:34`）与 `Shift+F10`（`:35`），在触发器中心（`:39` 取 `getBoundingClientRect()`，`:44-45` 取中心坐标）派发一次合成 `contextmenu` 事件（`:40-47`），交由 Radix 自身的 `handleOpen` 定位——键盘与指针因此复用**同一条**打开路径。
  - `:54-56` — `tabIndex={tabIndex ?? 0}`（可被调用方覆盖）、`onKeyDown={handleKeyDown}`、`className={cn("focus-ring", className)}`。
  - `:20-25` — 记录焦点归还**不需要自实现**：`ContextMenu` 保持 `ContextMenuPrimitive.Root`（`:7`，未新增包装层），触发器可聚焦后 Radix 的 `FocusScope` 会自行归还焦点（`node_modules/@radix-ui/react-focus-scope/dist/index.mjs:77-104`；`onCloseAutoFocus` 不拦截该过程，见 `node_modules/@radix-ui/react-context-menu/dist/index.mjs:137-143`）。归还发生在 `setTimeout(…, 0)`，断言需多等一个宏任务。
  - 回归测试：`tests/context-menu-keyboard.test.tsx`（7 用例）——`Tab` 进入序列、`Shift+F10` 打开、`ContextMenu` 键打开、普通按键**不**打开、打开后焦点落首个菜单项、`ArrowDown` 移动、`Enter` 选中、`Escape` 关闭且焦点归还触发器。
  - 运行确认（Playwright，浅/深两主题各一轮）：5 个示例触发器全部可 `Tab` 聚焦；`Shift+F10` 与右键打开的菜单位置完全一致（dx=152.0、dy=55.5，差值 < 1px）；`ArrowDown` 后 `activeElement` 为 `role=menuitem`；`Escape` 后 `activeElement` 回到触发器。
- **根因**：把 Radix 的「指针专用」原语直接当作完整组件对外，未补键盘入口。
- **建议修复方向**：在 `ContextMenuTrigger` 外层包一层可聚焦元素并处理 `Shift+F10` 与 `ContextMenu` 键（派发 `contextmenu` 事件），或提供文档化的替代（同功能走 `DotsMenu`/`Menu`）并在 API 文档中标注限制。
- **验收场景**：仅用键盘，`Tab` 聚焦到目标行 → `Shift+F10` → 菜单打开 → 方向键移动 → `Enter` 选中 → 焦点回到原元素。

#### HIG-AUD-003 BottomSheet 面板级指针捕获吞掉面板内部滚动 ✅ **已修复**

- **严重度**：P0 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-18 复核 @ `834f19d`：并发提交 `834f19d` 仅修复了**拖拽方向**语义——`handlePointerMove` 位移取负号；**本条主体未修复**：`handlePointerDown` 仍不检查 `event.target`（`:105-109`），handler 仍挂在整个 `DialogPrimitive.Content`（`:193-196`）。2026-09-21 复核：已由 `1866616`（2026-09-19）修复——手势只挂在 `Grabber` 上，本条转为回归保护）
- **依据**：Pointer Events 语义（`setPointerCapture` 会把后续指针事件重定向到捕获元素）；触屏滚动可用性。
- **修复前证据（行号取自修复前版本，保留对照）**：`src/components/ui/bottom-sheet.tsx`
  - `:105-109` `handlePointerDown` **不检查 `event.target`、不检查是否落在可滚动子元素**，直接 `event.currentTarget.setPointerCapture(event.pointerId)`；
  - `:193-196` 三个 handler 挂在 `DialogPrimitive.Content`（整个面板）上；
  - `:111-121` 每一次 `pointermove` 都改高度 → 面板内列表拖动滚动的第一下即被解释为「改高度」。
  - 对照：`src/components/ui/drawer.tsx:126` 至少有 `scrollTop > 0` 时让位内部滚动的判断。
- **修复后证据**：`src/components/ui/bottom-sheet.tsx`
  - `:108-110` — 注释写明「拖拽手势只挂在 Grabber 上」的原因（挂在面板 Content 上会让 `pointerup` 被重定向，内部按钮不再收到 `click`）；
  - `:111-116` — `handleGrabberPointerDown`（改名以表达适用范围），只在该处 `setPointerCapture`；
  - `:201-208` — 四个手势 handler（`onPointerDown`/`onPointerMove`/`onPointerUp`/`onPointerCancel`）**只挂在 `<Grabber>` 上**，面板内容区不再绑定任何 `onPointerDown` → 从内容区起手的指针事件不可能进入拖拽路径；
  - 回归测试：`tests/bottom-sheet.test.tsx`（源码契约 + 行为断言：从面板内容区起手拖动后 `--sheet-h` 不变）、`tests/grabber.test.tsx`。
- **实际表现（修复前）**：`BottomSheet` 内任何可滚动内容（长列表、长文档）在触屏上无法用手指滚动。
- **根因**：手势监听范围过宽（整个面板）+ 未区分「从 Grabber/面板空白处起手」与「从可滚动内容起手」。
- **建议修复方向**：仅从 Grabber（或标记 `data-drag-handle` 的区域）起手才进入拖拽；或起手时判断 `target.closest('[data-scrollable]')` 与其 `scrollTop`，让位内部滚动。（实际采纳前者）
- **验收场景**：面板内放 50 项列表，触屏从列表中部上滑 → 列表滚动、面板高度不变；从 Grabber 上滑 → 面板高度变化。

#### HIG-AUD-004 EditMenu 键盘完全不可达（含 Escape 不可达） ✅ **已修复**

- **严重度**：P0 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-21 核查：键盘产生选区后焦点自动进入首个可用项、`ArrowRight` 在项间移动、单一 Tab 停靠点、指针路径**不**抢焦点、`Escape` 关闭并把焦点归还；双主题几何核查通过）
- **依据**：WCAG 2.1.1 键盘、2.4.3 焦点顺序；WAI-ARIA `toolbar` 模式（单一 Tab 停靠点 + 方向键在项间移动）。
- **修复前证据（行号取自修复前版本，保留对照）**：`src/components/ui/edit-menu.tsx`
  - `:258` `role="toolbar"`，但**无方向键处理、无 roving tabindex**（仅 `:264-269` 处理 Escape）；
  - `:263` `onMouseDown={(event) => event.preventDefault()}` → 鼠标点击**永远不会**把焦点移入胶囊，胶囊内按钮永不获得焦点；
  - Escape 只挂在胶囊自身的 `onKeyDown`（`:264-269`）→ **键盘用户无法关闭胶囊**；
  - 组件不做任何焦点管理：无 `autoFocus`、无 `focus-visible` 引导、关闭后无焦点归还；
  - 浮层出现时无 `aria-live` 播报，AT 用户不知道工具条已出现；
  - 胶囊内容被 `createPortal` 到 `document.body`（`:313`），在 Tab 序列中位于 DOM 末尾 → 即便用户按 Tab「碰运气」找到它，路径也极长。
- **修复后证据**：`src/components/ui/edit-menu.tsx`
  - `:141-143`、`:377-378`、`:485` — `toolbar` 的 roving tabindex：`activeIndex` 状态 + `rovingIndex` 收敛，渲染时 `tabIndex={index === rovingIndex ? 0 : -1}`，同一时刻只有一个项进入 Tab 序列；
  - `:380-396` — 打开时（`useLayoutEffect`）把焦点移入首个可用项（`:388` `button:not(:disabled)`、`:393` `first.focus()`），并用 `:390-391` 记录 `focusReturnRef` 供关闭时归还；`:386` 对**指针**产生的选区直接返回，不抢焦点（用户仍在用鼠标/触控）；`:395` 调 `restoreSelection()` 还原选区，避免「焦点移入 → 选区被清空 → 误收起」；
  - `:487` — `onFocus={() => setActiveIndex(index)}` 让方向键/点击后的焦点与 roving 落点同步；
  - `:398-409` — Escape 改为**文档级**捕获监听（不再依赖胶囊自身先获焦），键盘用户随时可关闭；
  - `:277-281` — 关闭收口处把焦点归还给打开胶囊前的元素（`:278-280`），仅当元素仍 `isConnected`；
  - `:269-271`、`:112`、`:208-209` — `selectionSignature` / `dismissedSignatureRef`：关闭时记下被关闭的选区指纹，`selectionchange` 回弹（归还焦点、浏览器重放）不再把胶囊重新唤起——这是让「关闭后归还焦点」得以成立的前提；
  - `:421` 保留 `onMouseDown` 的 `preventDefault`（保住选区），但现在由显式 `focus()` 负责把焦点带入胶囊，两者不再冲突；
  - 回归测试：`tests/edit-menu-keyboard.test.tsx`、`tests/edit-menu-api.test.tsx`（含定位测量来源断言：必须取布局盒 `offsetWidth/offsetHeight`，否则入场动画 `zoom-in-95` 会把间距少算 1.8px）。
  - AT 播报：不再需要 `aria-live`——工具栏出现时焦点即移入 `role="toolbar"`（`:415`）内的首个可用项，屏幕阅读器会在聚焦时播报其角色与名称，与 APG `toolbar` 模式一致（即审计原「建议修复方向」给出的两条路径之一）。
  - 运行确认（Playwright，浅/深两主题各一轮）：键盘选区后 `activeElement` 为胶囊内 `剪切`（首个可用项）、`tabIndex` 数组只有一个 0；`ArrowRight` 移动到下一项；`Escape` 后胶囊消失；指针路径下 `activeElement` 不进入胶囊。
- **根因**：组件从设计上只考虑指针驱动（选区由指针产生），未定义键盘路径，且 `preventDefault` 保选区的做法与「让按钮可聚焦」互相冲突未被解决。
- **建议修复方向**：打开时把焦点移入胶囊第一个可用项（并保留选区，可用 `preventDefault` + 显式 `.focus()`）；实现 `toolbar` 的 ArrowLeft/ArrowRight + roving tabindex；Escape 绑定到文档级或胶囊获焦后；提供 `aria-live` 或 `role="toolbar"` + 聚焦播报；给这类浮层提供统一的 `onDismiss`。
- **验收场景**：仅用键盘：`Shift+方向键` 产生选区 → 胶囊出现 → 焦点自动进入首项 → `ArrowRight` 在项间移动 → `Enter` 执行 → `Escape` 关闭且焦点回到选区所在的容器。

#### HIG-AUD-051 Quick Actions 打开即崩溃：Portal 兄弟子节点违反 MenuPortal 的单子元素契约 ✅ **已修复**

- **严重度**：P0 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-21 于当前工作区复跑同款 Playwright 复现：QA 触发器右键 → 菜单打开、无 pageerror、ErrorBoundary 不触发；原判定 `[运行确认]` 2026-09-18 第二轮 @ `d6d5429` 仍成立）
- **修复前证据（三层闭环，2026-09-18 @ `d6d5429`）**：
  1. **实现层**：`src/components/ui/context-menu.tsx:157-172` — `ContextMenuQuickActionsContent` 把遮罩 `<div data-slot="context-menu-quick-actions-overlay">`（`backdropBlur` 默认 `true`）与 `<ContextMenuPrimitive.Content>` 作为 `ContextMenuPrimitive.Portal` 的**兄弟子节点**传入。
  2. **依赖层**：`node_modules/.pnpm/@radix-ui+react-menu@2.1.24*/.../dist/index.mjs:116` — `MenuPortal` 以 `PortalPrimitive asChild: true` 渲染 children，asChild 分支等价于 Radix `Slot`，**要求 children 恰好一个 React 元素**（或 `Slottable`）。
  3. **运行层**（脚本 `.scratch/hig-audit-2026-09-18/repro-slot-error.mjs`，自包含：起 server → 逐示例右键 → 清理）：
     - 页面挂载阶段 **0 报错**（5 个标准 trigger + 1 个 QA 触发器全部在位）；
     - 标准示例（`default-37a8eec1`，Portal 单子节点）右键 → 菜单正常打开（`[role="menu"]` × 1，无任何报错）→ 排除「演示未接线 / 右键被拦截」；
     - QA 触发器（"Notes" 按钮）右键 → `pageerror`：`Error: Primitive.div failed to slot onto its children. Expected a single React element child or 'Slottable'`；随即 `[ErrorBoundary:/components/context-menu]` 捕获 → **整页示例全部消失**（`div[aria-label="Context menu target"]` 计数 5 → 0，Notes 按钮 1 → 0）。
- **修复后证据（`src/components/ui/context-menu.tsx`，2026-09-21）**：
  1. `Portal`（`:205`）现在只有 `ContextMenuPrimitive.Content`（`:206-218`）**一个** React 元素子节点，满足 asChild 单子元素契约。
  2. 遮罩不再与 `Content` 并列，而是由 `QuickActionsScrim`（`:165-180`）在 `Content` 子树内渲染（`:216`），并在内部自行 `createPortal(..., document.body)`；`backdropBlur=false` 时整体不渲染。
  3. 运行确认（临时脚本 `tests/e2e/tmp-quickactions-audit.spec.ts` + 复用 dev server @ 当前工作区）：QA 触发器右键 → `[role="menu"]` × 1、`[data-slot="context-menu-quick-actions-overlay"]` × 1、`pageerror` 0 条；Escape 关闭后遮罩移除；同页 `div[aria-label="Context menu target"]` 在打开/关闭前后均保持 5。
- **实际表现（修复前）**：任何使用默认 `backdropBlur=true` 的 Quick Actions，在菜单打开瞬间渲染崩溃；文档站 `/components/context-menu` 路由整页被 ErrorBoundary 替换，**同页其余 4 个示例一并不可用**。这解释了第一轮 `verify-quick-actions.mjs` 的「菜单未打开且无页面报错」假象（第一轮右键命中的触发器时序不同；第二轮以逐示例隔离复现坐实）。
- **根因**：违反 Radix Portal 的 asChild 单子元素契约 —— 遮罩 div 与 Content 不能同为 MenuPortal 的兄弟子节点。
- **修复**（未采纳原「各自独立 Portal」建议）：`Portal` 只保留 `Content` 一个子节点（`:205-218`），遮罩交由 `QuickActionsScrim`（`:165-180`）在 `Content` 子树内自行 `createPortal` 到 `body` —— 既满足 asChild 单子元素契约，又让遮罩随菜单同生共死；并同步修正 HIG-AUD-001 的 z 层级（遮罩低于内容），避免「修一个露一个」。`backdropBlur=false` 时 children 经 `React.Children.toArray` 过滤 null 后仅剩单元素，理论上不崩（**推断，未实测**——不改产品代码无法在文档示例上实测）。
- **验收场景**：
  1. 右键 QA 触发器 → 菜单打开，控制台无 pageerror，ErrorBoundary 不触发；
  2. `document.elementFromPoint(菜单项中心)` 命中菜单项（同时覆盖 HIG-AUD-001 的命中验收）；
  3. 同页 4 个标准示例在 QA 打开/关闭前后均可用。

#### HIG-AUD-052 legacy 色账本 `files[]` 只增不减旁路（HIG-AUD-005 撤回后的实质残留）

- **严重度**：P2 ｜ **类型**：治理缺口 / 测试质量 ｜ **验证状态**：`[静态确证 + 运行确证]`
- **背景（HIG-AUD-005 撤回说明）**：本报告初版判定「治理门禁失败（`#ee0000` 未登记）」**有误**。运行 `pnpm exec vitest run tests/raw-color-governance.test.ts` → **4/4 passed，exit code 0**；账本 `tests/audit/raw-color-allowlist.json:221-230` 实际已注册全部 3 个文件（`select.tsx`、`activity-view.tsx`、`context-menu.tsx`，出处 `legacy-baseline-2026-09-04`，reviewed 2026-09-15）。初版所述「files 只登记 select.tsx」读取自**过时的工作区快照**——`gitlog` 佐证：`tests/audit/raw-color-allowlist.json` 的三文件登记随 `d6d5429`（`chore(docs): 重新生成 LLM 快照…`）落盘，初版审核读取时该提交尚未存在。P0 判定据此撤回，原条目保留编号以维持引用完整。
- **实质残留问题（两点）**：
  1. **冻结后新增代码挂 legacy 出处**：`context-menu.tsx:200`（commit `92a5b42`，审核期间引入）与 `activity-view.tsx:134` 的 `#ee0000` 均为 LEGACY_BASELINE 冻结日（2026-09-04）**之后**新增的代码出现处，却以 legacy 出处登记进账本 `files[]` → 绕过「新增原始色应走语义 token」的治理意图（`--destructive` token 已存在，见 §4.4）。
  2. **棘轮只守护字面量全集，不守护 files[] 收缩**：`tests/raw-color-governance.test.ts` 的「legacy 基线只能缩小」用例按**字面量集合**判断；同一字面量可在冻结后无限追加新文件，测试不拦。
- **建议修复方向**：治理测试补一条不变量 —— legacy 条目 `files[]` 的每个出现处必须可证明**早于冻结日期**（登记文件级 commit hash，或用 `git log --diff-filter=A` 校验文件首次引入时间）；冻结后新增的出现处必须走独立 provenance（须评审签名）。同时推进原 005 的语义 token 迁移建议（`select.tsx` / `context-menu.tsx` / `activity-view.tsx` 统一迁 `--destructive`，账本删除 `#ee0000` 条目）。
- **验收场景**：在冻结日期之后创建的新文件中引入 `#ee0000` 并登记 legacy 出处 → 治理测试**失败**。

#### HIG-AUD-053 命令面板搜索相关性回归：搜 "toast" 默认选中「堆叠」（二期 layout 分组引入）

- **严重度**：P2 ｜ **类型**：实现缺陷（搜索相关性回归） ｜ **验证状态**：`[运行确认]`（`pnpm run test:docs-layout` 中 `command-search.spec.ts:49` 首试 + retry 两次稳定复现；根因链静态闭环 @ `834f19d8`）
- **证据（运行时）**：`tests/e2e/command-search.spec.ts:49` 「english search still works after switching ui to zh-CN」——zh-CN 下 `fill("toast")` → Enter → 期望 h1 匹配 `/轻提示/`，实际 h1 = **「堆叠」**（19 次轮询稳定，retry #1 同样失败）→ e2e 套件唯一**稳定失败**（113 passed / 1 failed / 2 flaky，13.3m）。
- **证据（根因链，静态确证）**：
  1. `docs/geist/src/data/docs-routes.ts:42-44` — 「排版与布局」(layout) 分组排在「组件」(components) 分组**之前**（DOCS_GROUPS 顺序：foundations → **layout** → api → **components** → patterns；该分组为二期 HIG-GAP-03 能力新增）；
  2. `docs-routes.ts:166`（`getRouteSearchText`）— 把 **`group.title`（"Layout & Organization"）与 `titleZh` 拼进该组每个 item 的搜索文本**，stack 项的 value = `"layout & organization 排版与布局 stack 堆叠"`；
  3. cmdk `@1.1.1` 默认 filter = `commandScore`（`dist/command-score.mjs`）——**子序列模糊匹配**：`"toast"` 的字符序列 t/o/a/s/t 在 "layou**t** organi**o**z**a**tion … **s****t**ack" 中顺序命中 → score > 0 → stack 通过过滤；
  4. cmdk 过滤后**不按分数重排 DOM**，默认选中（`data-selected`）第一个可见 item = DOM 顺序第一匹配项 = stack（layout 组在前）→ `Enter` 导航到 `/components/stack`。
- **实际表现**：用户（尤其键盘用户）在命令面板输入精确词名 "toast"，回车后落到完全无关的「堆叠」页面；影响一切与分组名/其他项构成子序列的查询。
- **根因**：分组名被拼进 item 级搜索文本 + cmdk 子序列匹配 + 分组 DOM 顺序三个因素叠加；二期新增 layout 分组（组序在 components 之前）触发回归——分组加入前搜 "toast" 的第一匹配项是 toast 自身。**引入 commit 已定位：`f87b436`（`feat(layout): 排版与布局顶层分组 + SafeArea/Stack 布局原语`，`docs-routes.ts` 在其改动列表内，`gitlog` 佐证）**。
- **建议修复方向**（任一即可，推荐 a）：
  a. `getRouteSearchText` 不把 `group.title`/`titleZh` 拼进 item 搜索文本（分组名不参与词级匹配）；
  b. 给 `CommandMenu` 的 `Command` 传自定义 `filter`（精确/前缀命中优先，子序列降权）；
  c. 保留拼接但把分组名移到 value 末尾并自定义 filter 弱化非 label 段权重。
- **验收场景**：`pnpm run test:docs-layout` 中 `command-search.spec.ts` 全绿（本条即由该用例守护）；zh-CN 搜 "toast" 首个选中项为「轻提示」。
- **附带**：本次 `test:docs-layout` 的 2 个 flaky（`docs-layout.spec.ts` chunk 7/11 light 首试 90s 超时后 retry 通过、aggregate-gate retry 通过）均为 dev server 冷启动性能波动，**非产品缺陷**。

---

### 4.2 P1 问题

#### HIG-AUD-006 SidePanel 关闭后焦点丢失到 `body`，且文件注释与实现矛盾 ✅ 已修复（2026-09-22）

- **严重度**：P1 ｜ **类型**：实现缺陷 + 文档问题 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-22，修复与复测记录见增补 §5E）
- **证据**：
  - `src/components/ui/side-panel.tsx:155` 导出清单**不含 Trigger**；`:33-46` 的 API 只有 `show/onDismiss/side/noOverlay`。
  - `:76-95` `SidePanelContent` **无 `tabIndex`、无任何焦点归还逻辑**。
  - `:28-30` 注释声称「焦点：Radix 默认管理（Drawer 的 `restoreFocusTo` 是其特有机制，此处不做）」。
  - Radix 侧：`DialogPrimitive.Content` 关闭时**无条件** `event.preventDefault()` 并把焦点交给 `triggerRef.current`；`triggerRef` 为 `null` 时既不给 Trigger，`@radix-ui/react-focus-scope` 的 `previouslyFocusedElement` 回退也因 `defaultPrevented` 被跳过 → 焦点落到 `body`。
  - 对照实现：`drawer.tsx:203-222`、`bottom-sheet.tsx:156-166`、`modal.tsx:90,99-113`、`command-menu.tsx:54-64`、`hamburger-menu.tsx:140-152` 均自实现了归还，并注释了同一个 Radix 竞态。
- **根因**：把「Radix 默认管理焦点」当成普适结论，但该结论只在**存在 Trigger** 时成立；SidePanel 无 Trigger。
- **建议修复方向**：二选一——(a) 导出 `SidePanelTrigger`（推荐，语义最正）；(b) 参照 drawer 自实现 `restoreFocusTo`。同时修正 `:28-30` 注释。
  - **修复时实况**：采 (b)（与库内 modal/bottom-sheet 同款自实现，(a) 与 HIG-AUD-024 的导出决策纠缠故不扩）；`onOpenAutoFocus` 记录（Radix 移动焦点前派发，比 drawer 的 effect 时序更准）+ `onCloseAutoFocus` preventDefault + `setTimeout` 归还（非 rAF，后台标签页 rAF 挂起——drawer 先例）。
- **验收场景**：打开面板 → `Escape` 关闭 → `document.activeElement` 回到打开前的触发按钮（非 `body`）。✅ 已按此场景落为回归（vitest + 双主题浏览器探针，见 §5E）。

#### HIG-AUD-007 SidePanel `noOverlay` 的语义与注释 / 实现不一致 ✅ 已修复（2026-09-22）

- **严重度**：P1 ｜ **类型**：实现缺陷 + 文档问题 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-22，修复与复测记录见增补 §5E）
- **证据**：
  - 注释 `src/components/ui/side-panel.tsx:25-26`：「`noOverlay=true` 跳过渲染 Overlay——此时面板不锁交互、页面保持可操作由消费者负责」。
  - 实现 `:108-121`：`noOverlay` 只跳过 `<SidePanelOverlay />` 的渲染；`DialogPrimitive.Root` 仍以 **modal 默认（true）** 运行 → Radix 仍锁 body 滚动并 `hideOthers` 遮蔽外部内容。
  - 对照：`sheet.tsx:97` 通过 `onPointerDownOutside preventDefault` + 非 modal 才真正实现了「页面可交互」。
- **建议修复方向**：`noOverlay` 时同步切到非模态（`modal={false}`）并处理外点语义；或改注释、改 API 名（例如 `hideOverlay`）以匹配真实行为。
  - **修复时实况**：采 `modal={!noOverlay}`（`{...rootProps}` 在后，消费者显式传 `modal` 仍可覆盖）；外点仍触发 `onDismiss`（受控语义：是否关闭由消费者决定），不加 `onPointerDownOutside preventDefault`（sheet 的常驻语义不强加给 SidePanel）。
- **验收场景**：`noOverlay` 打开时，背景页面可滚动、可点击（用 `elementFromPoint` 校验）。✅ 已按此场景落为回归（vitest + 双主题浏览器探针：`elementFromPoint` 命中页面内容、`data-scroll-locked`/`aria-hidden` 均无，见 §5E）。

#### HIG-AUD-008 i18n key 缺失 3 处 → 中文站点回显英文 key 原文 ✅ 已修复（2026-09-23，增补 §5M）

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-23，修复与复测记录见增补 §5M）
- **证据（行号取自修复前版本，保留对照）**：`src/lib/i18n.tsx:17,33` 在缺 key 时**静默回显 key 原文**（不告警、不抛错）。实际缺失：
  | 位置 | key | 影响 |
  |---|---|---|
  | `src/components/ui/hamburger-menu.tsx:242` | `t("Close menu")` | 面板关闭按钮的无障碍名称未本地化 |
  | `src/components/ui/hamburger-menu.tsx:287` | `t("Ctrl K")` | 显示为英文 key 原文 |
  | `src/components/ui/grabber.tsx:32` | `t("调整高度")` | **英文站点会显示中文**（该 key 本身也不符合仓库的英文 key 惯例） |
- 已核实 `src/lib/framework-messages.ts` 中**不存在**这三个 key。
- **根因**：`framework-messages.ts:1-276` 的两个 locale 键集合**没有类型级同构校验**，靠人工同步。
- **建议修复方向**：补 3 个 key（`grabber` 改用英文 key 如 `"Resize height"`）；把 `FRAMEWORK_MESSAGES` 的 en/zh 键集合做成类型级约束（如 `Record<keyof typeof EN, string>` 的 zh 侧），让缺 key 变成编译错误。
- **验收场景**：新增 `tests` 断言两 locale 键集合相等；中文站 `/components/bottom-sheet`、导航面板文案全部本地化。

- **修复记录（2026-09-23，增补 §5M）**：
  - `framework-messages.ts` 增 `export type FrameworkMessageKey = keyof typeof FRAMEWORK_MESSAGES.en;`；`i18n.tsx` 在**实现处**把 locale 消息表注解为 `Record<FrameworkMessageKey, string>` → 任一 locale 缺 key（含拼写差异）立即是**编译错误**（本条目的根因修复，取代人工同步）。
  - 补齐 3 个 key（en/zh 双侧行序镜像）：`"Close menu"`→`关闭菜单`（`hamburger-menu.tsx:234`/`:278`）、`"Ctrl K"`→两侧同值（`:324` 的 `<kbd>`，快捷键字面量不翻译）、`"Resize height"`→`调整高度`（`grabber.tsx:45`，**key 由中文写法改为英文写法**，修掉英文站显示中文）。
  - 回归：`tests/component-i18n-source.test.ts` 新增 3 用例（键集**双向相等** / 钉住本条目 3 个 key / **全 `src` 扫描 `t("…")` 字面量 key 必须存在于两个 locale**——补齐了原守卫只查「裸 JSX 文案」、从不查 `t()` key 是否存在的缺口，含条件分支与 `` `JSON ${type}` `` 前缀族，并带收集器健康度断言防「空过」）；`tests/framework-i18n.test.tsx` 增 grabber 双语言渲染断言；`tests/grabber.test.tsx:31` 旧中文断言更新为英文默认值。
  - **守护有效性（变异测试）**：临时删 zh 的 `"Close menu"` → 三道守护同时报警：`tsc -b` 报 `src/lib/i18n.tsx(36,11): error TS2322 … not assignable to Record<…>`、键集用例报 `zh-CN 缺失的 key: ['Close menu']`、调用点扫描报 `hamburger-menu.tsx: "Close menu" 不在 zh-CN`（2 处）。恢复后 13 files passed。
  - **运行确认（临时探针，跑完即删，4 passed）**：`/components/bottom-sheet` 的 grabber `aria-label` 实测 zh-CN `调整高度` / en-US `Resize height`；文档站 768×1024 导航面板触发按钮 `菜单`→`关闭菜单`（zh）/ `Menu`→`Close menu`（en），面板文案无 key 原文回显。
  - 全 `src` 扫描结论：**本条目的 3 处即全部缺失项**（无其他缺 key、无前缀孤儿）。**已知限制**：`t()` 参数未收窄为键集（现有 5 处动态 key 调用会被误伤），「组件 ↔ key」漂移由静态扫描在测试期守护——见交付书 §9。

#### HIG-AUD-009 z-index 层级体系不统一（token / 硬编码 / 缺失三态并存）✅ 已修复（2026-09-23）

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-23，修复与复测记录见增补 §5K）
- **证据（行号取自修复前版本，保留对照）**：token 体系 `src/styles/index.css:950-960`（drawer 200 / menu 50 / modal 300 / popover 2001 / toast 5000 / tooltip 99999）
  | 组件 | 写法 | 位置 |
  |---|---|---|
  | DestructiveActionModal | **硬编码 `z-50`** | `destructive-action-modal.tsx:118,125` |
  | CommandMenu | **硬编码 `z-100`** | `command-menu.tsx:48,65` |
  | Feedback Popover | **硬编码 `z-50`** | `feedback.tsx:458` |
  | MultiSelect 内容 | **完全无 z-index** | `multi-select.tsx:178-182` |
  | ContextMenuContent | **完全无 z-index** | `context-menu.tsx:24-27` |
  | Sheet / SidePanel / Drawer / BottomSheet / Modal / Tooltip / Toast / EditMenu | token ✓ | 各处 |
- **实际影响**：`z-50`（destructive modal）**低于** `--uni-z-modal: 300`，`z-100`（command menu）低于 drawer 200 与 modal 300 → 组件组合时（例如在 Drawer 内唤起 CommandMenu、或 Modal 上叠 Toast）层级可能颠倒。`tests/e2e/docs-layout.spec.ts` 已有「toast 在 modal 遮罩之上」的命中检测，可扩展为矩阵。
- **建议修复方向**：删除全部硬编码 z，统一走 token；补齐 `multi-select`/`context-menu` 内容层 z；在 `index.css` 注释中写明层级序（overlay < 内容 < drawer < modal < popover < toast < tooltip）并为「遮罩 vs 其内容」建立配对约定（同时解决 HIG-AUD-001）。
- **验收场景**：新增/扩展 e2e：在 Drawer 内打开 CommandMenu、在 Modal 上触发 Toast，`elementFromPoint` 命中正确元素；`grep` 不到 `z-50`/`z-100` 类硬编码。

#### HIG-AUD-010 Overlay 背板存在 5 种写法 ✅ 已修复（2026-09-23，增补 §5L）

- **严重度**：P1 ｜ **类型**：实现缺陷（一致性） ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-23，修复与复测记录见增补 §5L）
- **证据（行号取自修复前版本，保留对照）**：
  | 写法 | 位置 |
  |---|---|
  | token 化 ✓ `bg-[var(--uni-overlay-backdrop-color)] opacity-[var(--uni-overlay-backdrop-opacity)]` | `sheet.tsx:55`、`side-panel.tsx:67` |
  | `bg-black/40` | `drawer.tsx:232`、`bottom-sheet.tsx:151`、`expand-panel.tsx:125`、`context-menu.tsx:162` |
  | `bg-black/50 backdrop-blur-sm` | `destructive-action-modal.tsx:118` |
  | `bg-[#f2f2f2]/80 dark:bg-black/80` | `modal.tsx:53` |
  | `bg-background-100 opacity-80` | `command-menu.tsx:48` |
- 关键事实：token 定义 `index.css:945-946`（light `#f2f2f2` / 0.8）+ `:1238`（dark `#000000`）→ `modal.tsx` 的字面量**在视觉上等价于 token**，因此这是**可迁移的字面量重复**，不是视觉分歧；`command-menu.tsx` 的 `bg-background-100 opacity-80` 与 token 近似但不同源；`destructive-action-modal.tsx` 是**唯一带 `backdrop-blur`** 的遮罩，属「装饰过量/不一致」。
- **建议修复方向**：全部迁移到 `--uni-overlay-backdrop-*`；把「遮罩是否模糊」变成显式的 token 开关（`--uni-overlay-backdrop-blur`），而不是逐组件自由发挥。同时注意 `modal.tsx:13-14` 与 `bottom-sheet.tsx:14-18` 的注释声称「有意等价/有意不合并」——迁移时需同步更新这些注释，否则注释会与实现再次矛盾。
- **验收场景**：`grep -r "bg-black/4\|bg-black/5\|bg-\[#f2f2f2\]" src/components/ui` 为空；双主题下 5 个浮层的背板实测色值一致（可用 `getComputedStyle` 断言）。

- **修复记录（2026-09-23，增补 §5L）**：
  - **方案裁决（与条目原建议不同，故记录理由）**：题述「5 种写法」经复核**不是同一角色的重复写法**——`#f2f2f2` light / `#000` dark @ 0.8（官方 Modal scrim 2026-08-15 live computed + 官方 Sheet overlay `--ds-overlay-backdrop-color`）与 `rgba(0,0,0,.4)`（官方 Drawer overlay 2026-08-13 live computed）是**两种官方遮罩角色**。若照原建议「全迁 `--uni-overlay-backdrop-*`」，Drawer 会在光模式从「暗化 40%」变成「近白洗色 80%」，破坏官方 parity → 裁决为**两族并行登记 + 写法各自收敛到 token**，并同步修订本条的验收口径为「族内一致 + 组件层无字面量」。
  - token（`src/styles/index.css:1023-1048`）：新增暗化族 `--uni-overlay-scrim-color: rgb(0 0 0 / 40%)`（**alpha 内联在颜色里**——同族若用「色 + 透明度」两值式且元素带 `backdrop-filter`，元素 `opacity<1` 会把模糊按组一起降透明）与合成色 `--uni-overlay-backdrop`（`color-mix(in oklab, var(--uni-overlay-backdrop-color) calc(var(--uni-overlay-backdrop-opacity) * 100%), transparent)`，自动跟随两值，专供 `modal` 这种「Content 是 Overlay 子节点」的场景）。
  - 迁移（computed 零变化）：`drawer.tsx:221`、`bottom-sheet.tsx:170`、`responsive-drawer.tsx:257`、`expand-panel.tsx:130`、`context-menu.tsx:209`（quick-actions 遮罩）`bg-black/40` → `bg-[var(--uni-overlay-scrim-color)]`；`modal.tsx:58` 字面量 → 合成色（light `#f2f2f2`@0.8 / dark `#000`@0.8 逐值等价）；`sheet`/`side-panel` 保持官方两值式。**唯一刻意观感变化**：`destructive-action-modal.tsx:119` 遮罩 `bg-black/50` → scrim 族 0.4（该 50% 无官方出处，属条目点名的孤例）。
  - 注释同步（条目明确要求，原注释与实现矛盾）：`drawer.tsx:19-21`、`bottom-sheet.tsx:14-15`、`side-panel.tsx:23-26`、`modal.tsx:13-18`、`command-menu.tsx:46-48`。
  - **单列例外**：`command-menu` 的 overlay 保持 design-gate（`tests/audit/geist-design-gate.json:171`）冻结的官方 cmdk 写法 `bg-background-100 opacity-80`，理由写入 `index.css` 族注释与组件注释，并由契约测试锁定「不得被顺手对齐」。
  - 回归：新增永久契约 `tests/overlay-backdrop-tokens.test.ts`（6 用例：两族 token 逐值冻结 / 组件层无遮罩字面量（本条目验收 grep 的可执行版）/ 消费矩阵含跨族误用 / 模糊只走显式开关且仅 2 个消费者 / 带模糊遮罩禁止元素 `opacity-*` / command-menu 例外冻结）；旧写法断言同步 9 个测试文件；`tests/audit/raw-color-allowlist.json` 清 `#f2f2f2 @ modal.tsx` 陈旧条目。
  - **运行确认（临时探针，跑完即删，双主题 12 passed）**：① 旧写法展开与 token **渲染像素逐字节等价**（同底色色块截图比对，不用序列化字符串）；② 真实 DOM 族内一致——`bottom-sheet` 遮罩与 quick-actions 遮罩同为 `rgba(0, 0, 0, 0.4)`（后者 `backdrop-filter: blur(8px)`）；③ modal 遮罩 `oklab(0.961145 … / 0.8)`（light）/ `oklab(0 0 0 / 0.8)`（dark）、元素 `opacity: 1`、卡片 `rgb(255,255,255)` / `rgb(10,10,10)`（**未被降透明**，即合成色方案要防的回归）；④ 几何：遮罩 1280×720 满覆盖、卡片中心 (640,360) 精确居中。

#### HIG-AUD-011 退场动画缺失或不对称 ✅ 已修复（2026-09-23）

- **严重度**：P1 ｜ **类型**：实现缺陷（动效连续性） ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-23，修复与复测记录见增补 §5K）
- **证据（行号取自修复前版本，保留对照）**：
  | 组件 | 入场 | 退场 | 位置 |
  |---|---|---|---|
  | Menu | `fade-in-0 zoom-in-95` | 仅 `fade-out-0`（**缺 `zoom-out-95`**） | `menu.tsx:141` |
  | ContextMenu | `fade-in-0 zoom-in-95` | 仅 `fade-out-0` | `context-menu.tsx:26` |
  | Select | `fade-in-0 zoom-in-95` | **完全无退场** | `select.tsx:231` |
  | Toast | `fade-in-0 slide-in-from-bottom-2` | **完全无退场**（直接从数组移除） | `toast.tsx:190` |
  | EditMenu | `fade-in-0 zoom-in-95` | **完全无退场** | `edit-menu.tsx:278` |
  | Modal | `fade-in-0 zoom-in-95` | `fade-out-0 zoom-out-95` ✓ | `modal.tsx:121` |
  | ContextCard / Combobox / MultiSelect / DestructiveActionModal / Feedback | 进出对称 ✓ | ✓ | 各处 |
- **影响**：浮层「瞬间消失」造成动效断裂，与 HIG「动效保持一致、可预期」的方向相反；也是「装饰过量 vs 反馈不足」中**反馈不足**的一侧。
- **建议修复方向**：补齐退场类（与入场对称）；对从数据源移除的 Toast 引入 presence 机制（延迟卸载）。注意 Radix `Presence` 需要 `data-state=closed` 才能播完退场，Select/Toast 需确认不会被提前卸载。
- **验收场景**：逐个浮层录制关闭前后各 300ms 的帧序列，确认存在淡出/缩放过程；`prefers-reduced-motion: reduce` 下无动画但仍有状态切换。

#### HIG-AUD-012 动效时长与缓动 token 覆盖不全 ✅ 已修复（2026-09-23）

- **严重度**：P1 ｜ **类型**：实现缺陷（一致性） ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-23，修复与复测记录见增补 §5K）
- **证据（行号取自修复前版本，保留对照）**：token 定义 `index.css:639-642`（fast 150 / base 200 / slow 300 / slower 500）、`:646-649`（`--ease-snap/pop/stagger/toast`）。
  | 组件 | 问题 | 位置 |
  |---|---|---|
  | Menu / ContextMenu / DotsMenu / SplitButton | 动画**零时长/缓动 token**（回落 tw-animate 默认） | `menu.tsx:141`、`context-menu.tsx:26` |
  | Drawer | 硬编码 `500ms` 字面量 | `drawer.tsx:158-170` |
  | BottomSheet | 硬编码 `duration-300` + 内联 `300ms var(--ease-snap)` | `bottom-sheet.tsx:175,186` |
  | CommandMenu | CSS 内硬编码 `0.3s` / `0.4s` | `index.css:2090,2094,2100,2103` |
  | DestructiveActionModal | 完全无 token（回落约 150ms） | `destructive-action-modal.tsx:118,127` |
  | Sheet | `transition ease-in-out`（Tailwind 内建，非项目 token） | `sheet.tsx:91` |
- **影响**：同一交互族（浮层打开）在 150ms～500ms 间漂移，观感不一致；`destructive-action-modal`（300ms 族）与 `modal`（`--uni-duration-slow` + `ease-pop`）本应同族却左右不一致。
- **建议修复方向**：为浮层建立统一规格（建议入场 `--uni-duration-fast` + `ease-pop`、退场同档），逐组件替换；`tests/duration-tokens.test.ts`、`tests/ease-tokens.test.ts` 已存在，可扩展为「浮层动画必须引用 token」的守护测试。
- **验收场景**：`grep -nE "duration-\[?[0-9]|ms\b" src/components/ui` 中无浮层动画字面量；新增守护测试对浮层组件断言含 `duration-(--uni-duration-`。

#### HIG-AUD-013 触控目标普遍低于 44pt（多处仅满足 WCAG 24px 下限）

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **依据**：WCAG 2.5.8（最小 24×24）；Apple 平台惯例 44pt（此处作为**项目审美/惯例建议**，非 HIG 正文断言）
- **证据**（均为静态类名）：
  | 组件 | 尺寸 | 位置 |
  |---|---|---|
  | MenuItem | `h-9` (36px) | `menu.tsx:217`（`itemClassName`） |
  | DotsMenu 触发 | `size-8` (32px) | `dots-menu.tsx:63` |
  | Select Item / Trigger | `h-9` 档 | `select.tsx:106-110` |
  | MultiSelect 行 | `h-7` (28px) | `multi-select.tsx:225` |
  | Toast 关闭 / action | `size-6` (24px) / `h-8` (32px) | `toast.tsx:216-222` |
  | ThemeSwitcher | `size-6`/`size-8` (24/32px) | `theme-switcher.tsx:53` |
  | HamburgerMenu 清除按钮 | `h-7 w-7` (28px) | `hamburger-menu.tsx:281` |
  | DestructiveActionModal 按钮 | `h-8` (32px) | `destructive-action-modal.tsx:202-223` |
  | EditMenu 胶囊项 | `h-7` (28px) | `edit-menu.tsx:293` |
- 已有的正面先例：`hamburger-menu.tsx` 触发器 `size-11`(44px)、`bottom-sheet` 的 Grabber 命中区外扩（`grabber.tsx:40`）、`multi-select` checkbox 用 `after:-inset-1.5` 外扩（`multi-select.tsx:240`）。
- **建议修复方向**：统一用「视觉尺寸不变 + 命中区外扩」的模式（仓库已有两种先例），而不是放大视觉。
- **验收场景**：新增 e2e，对 320/390 视口下所有浮层与列表项的 `getBoundingClientRect()`（或用 `document.elementFromPoint` 探测命中边界）断言 ≥ 44×44。

#### HIG-AUD-014 Toast：隐藏项仍在 Tab 序列 + 计时不可暂停 ✅ 已修复（2026-09-23，增补 §5R）

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **依据**：WCAG 2.2.1（计时可调）、2.4.3（焦点顺序） ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-23，修复与复测记录见增补 §5R）
- **证据（行号取自修复前版本，保留对照）**：`src/components/ui/toast.tsx`
  - `:191` 第 5 个及更旧的 toast 用 `nth-last-[n+4]:opacity-0 nth-last-[n+4]:pointer-events-none` 隐藏，**未移出 Tab 序列、未加 `inert`/`aria-hidden`** → 键盘 Tab 会落到不可见 toast 的按钮上；
  - `:155-156` hover 只展开堆叠，**不暂停计时器**；焦点进入也不暂停；无「延长/关闭计时」的入口；
  - `:110-121` 自动关闭 3500ms（带 undo 7000ms），用户无控制手段。
- **建议修复方向**：隐藏项加 `aria-hidden` + `inert`（或 `tabIndex={-1}` 级联）；`focus-within`/hover 时暂停计时并恢复；为 `preserve` 之外的 toast 提供可访问的关闭（`aria-label` 已有 ✓）。
- **验收场景**：连续触发 6 条 toast，仅 Tab 到可见项；聚焦 toast 后停留 10s 不被关闭。

- **修复记录（2026-09-23，增补 §5R）**：
  - **隐藏项移出 Tab 序列与无障碍树**：新增与 CSS `nth-last-[n+4]` **对齐**的 JS 判定 `hidden = d >= MAX_STACK`（`d = count - 1 - i`），命中项加 `aria-hidden` + **`inert`**（React 19 布尔属性；`inert` 一并对 Tab 序列与 AT 生效）。
  - **计时可暂停（WCAG 2.2.1）**：`paused = expanded(hover) || focusWithin`；暂停时结算每个在跑计时器的**剩余量**（`deadline`/`remaining` 两个 ref）并 `clearTimeout`，恢复时按剩余量续跑（**不是重新计时**）；`<ol>` 增加 `onFocusCapture` / `onBlurCapture`（用 `relatedTarget` 判断焦点是否真的离开视口）。
  - 回归：新增 `tests/toast-timer.test.tsx`（3 用例：6 条时恰好 2 条 `inert` + `aria-hidden` 且其余不带 / hover 暂停 5s 后仍存活且按剩余量续跑 / **聚焦后停留 10s 不被关闭**再续跑）；`toasts-controlled`、`toast-example-actions` 复跑通过。
  - **真实浏览器验收（临时探针，跑完即删，exit 0）**：docs `/components/toast` 连点 6 次 → `li[inert]` 恰好 2 条（**证明 JS 判定与 CSS 隐藏范围一致**）、`li[inert][aria-hidden="true"]` 同为 2；聚焦最新一条的关闭按钮后等待 **4.5s（> 默认 3500ms）** 仍可见。
  - 门禁：`typecheck` exit 0；`lint` 0 errors / 16 warnings（存量）；全量 `pnpm test` `9 failed | 231 passed (240)` ＝ 文档基线（7 个 `tests/audit/*` + `button-api`/`showcode-typecheck` 两个并发 flaky，单跑均过）。

#### HIG-AUD-015 Tooltip 给装饰性/非交互子元素强注 `tabIndex=0` ✅ 已修复（2026-09-23，增补 §5P）

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-23，修复与复测记录见增补 §5P）
- **证据（行号取自修复前版本，保留对照）**：`src/components/ui/tooltip.tsx:51-61` —— `React.cloneElement(children, { tabIndex: children.props.tabIndex ?? 0, … })`；fallback 分支 `<span tabIndex={0}>`。任何被 Tooltip 包裹的纯展示元素都会被塞进 Tab 序列。
- **建议修复方向**：仅在子元素本身可聚焦时不干预；否则由调用方显式声明 `tabIndex`，或提供 `focusable={false}`。Tooltip 的触发应支持 hover + focus 双通道，但不应**制造**焦点。
- **验收场景**：`<Tooltip text="…"><span>静态文本</span></Tooltip>` 不产生 Tab 停靠点；包裹 `<button>` 时仍可键盘触发。

- **修复记录（2026-09-23，增补 §5P）**：触发元素构造改为**只透传**调用方显式声明的 `tabIndex`（`children.props.tabIndex`，不再 `?? 0`），非元素子节点的兜底壳（`<span>`）也去掉强注的 `tabIndex={0}`；源码注释写明契约「**不制造焦点**：需要键盘触发时由调用方声明 `tabIndex` 或改用可聚焦元素」。**内部消费点全部复核**：`tabs.tsx:210`、`progress.tsx:154`、`description.tsx:45` 本就显式声明 `tabIndex={0}` ✓；`text-with-copy-button.tsx:135` 包裹的是真按钮 ✓ → 仓库内键盘可达性**无回归**。
  - 回归：`tests/tooltip-focus.test.tsx` 重写用例①（原「非交互子元素被强制可聚焦」**正是本条目要修的行为**）→ 新契约「静态子元素**无** `tabindex` 属性且 `tabIndex === -1`」；新增用例「可聚焦子元素保持 `tabIndex 0`，`focus()` 后取得焦点」；显式 `tabIndex={-1}` 透传用例保留（3 用例）。
  - **真实浏览器验收（临时探针，跑完即删，1 passed）**：docs `/components/tooltip` 上所有 `span` 触发器**均无 `tabindex` 属性**、所有 `button` 触发器保持 `tabIndex 0`；聚焦被 Tooltip 包裹的 `<Button>` 仍能打开 `[role="tooltip"]`（**focus 通道未回归**）。
  - 门禁：`typecheck` exit 0；`lint` 0 errors / 16 warnings（存量）；定向 vitest **4 files / 16 tests**（`tooltip-focus`、`tooltip-api`、`tooltip-tip`、`loading-icon-layout`）；全量 `pnpm test` `8 failed | 230 passed (238)` ＝ 文档基线。

#### HIG-AUD-016 MultiSelect：自写可点击 `div` 热区 + Tab 被锁在面板内 ✅ 已修复（2026-09-23，增补 §5Q）

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-23，修复与复测记录见增补 §5Q）
- **证据（行号取自修复前版本，保留对照）**：`src/components/ui/multi-select.tsx`
  - `:227-233` `data-slot="multi-select-checkbox-target"` 是带 `onClick` 的 `div`，**无 `role`、无 `tabIndex`、无键盘处理**；其内部 `Checkbox` 被强制 `tabIndex={-1}`（`:238`）→ 该热区对键盘与 AT 完全不可达；
  - `:117-130` 在 `role="dialog"` 内 `preventDefault` 拦截 `Tab` 做循环 → **键盘用户无法用 Tab 离开面板**（APG 反模式），只能靠 `Escape`；
  - `:173` `role="dialog"` **无 `aria-label` / `aria-labelledby`** → 无名对话框。
- **建议修复方向**：热区改为真正可聚焦元素（或复用 `Checkbox` 并取消 `tabIndex={-1}`）；移除 Tab 循环（保留 `Escape` + 外点）；给 dialog 补可访问名称。
- **验收场景**：仅用键盘完成「打开面板 → Tab 遍历所有行与操作 → Tab 离开面板」；`role="dialog"` 有可访问名称。

- **修复记录（2026-09-23，增补 §5Q）**：
  - **Tab 循环**：先删掉我们自己的 `preventDefault` 循环；实测发现**Radix Popover 在 `FocusScope` 上硬编码 `loop: true`**（`@radix-ui/react-popover/dist/index.mjs:222-227`），只去掉我们的拦截 Tab 仍走不出面板。故改为在**面板边缘显式接管**：Tab 到最后一个可聚焦元素（Shift+Tab 到第一个）时走 Radix 公开的 `Popover.Close` 通道关闭，焦点由 `onCloseAutoFocus` 交还触发元素——等价于通行的「焦点移出浮层即关闭」约定。
  - **热区/键盘可达**：移除 `Checkbox` 与行操作按钮上的 `tabIndex={-1}`（两者进入 Tab 顺序，各带 role 与 `aria-label`）；命中区 div 保留为**指针命中冗余放大**（触屏 ≥44 由行 `pointer-coarse` 保底），不再承担控件语义（源码注释已写明）。
  - **对话框命名**：`role="dialog"` 补 `aria-label`，缺省取本地化的 `t("Select options")`（新增 i18n key，en/zh 双侧补齐，受键集同构与调用点扫描守护）；调用方可用 `aria-label` / `aria-labelledby` 覆盖（提供 labelledby 时不再输出 label，避免双名称）。
  - 回归：新增 `tests/multi-select-keyboard.test.tsx`（4 用例：对话框命名与两种覆盖 / Tab 不被 `preventDefault` / 行控件可 Tab 且带 `aria-label` / 方向键 roving 不回归）；新增**永久 e2e** `tests/e2e/multi-select-keyboard.spec.ts`（**1 passed**：仅键盘 Enter 打开 → Tab 进入面板遍历 → Tab 最终离开面板）。
  - 门禁：`typecheck` exit 0；`lint` 0 errors / 16 warnings（存量）；全量 `pnpm test` `7 failed | 232 passed (239)` ＝ 文档基线。

#### HIG-AUD-017 无「路由变化即关闭浮层」机制 ✅ 已修复（2026-09-23，增补 §5N）

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-23，修复与复测记录见增补 §5N）
- **证据（行号取自修复前版本，保留对照）**：全仓库**无** `useLocation` / `useNavigate` / `popstate` 监听（唯一相关的是 `hamburger-menu.tsx:358` 的 `onNavigate` 回调，且该回调**只调用不关闭**面板，`:358` 未触发 `setOpen(false)`；修复时实测该列表项在 `:379-402`）。文档站路由切换后，已打开的浮层不会自动收起。
- **影响**：在文档站内通过浮层内的链接导航（例如 ContextMenu 的 `href` 项、HamburgerMenu 的导航列表）后，浮层残留。
- **建议修复方向**：在组件库层提供可选的路由感知（或文档消费方统一在路由变化时关闭）；至少为带 `href` 的菜单项在选中后关闭。
- **验收场景**：在 HamburgerMenu 中点击导航项 → 面板关闭且路由已切换。

- **修复记录（2026-09-23，增补 §5N）**：
  - **组件层契约修正（条目要求的「至少为带 href 的菜单项在选中后关闭」）**：`hamburger-menu.tsx:379-395` 的导航列表项点击此前只调 `onNavigate`、**不关面板**——与同文件搜索结果项（`:466-469`）及 prop 注释「随后关闭面板」互相矛盾，且**无任何测试覆盖**。现统一为「激活即关闭」，并按 `sidebar-nav.createNavigateHandler` 的既有语义**保留修饰键 / 中键**（新标签页意图不关面板）；`onNavigate` 调用时机不变，避免改动消费方导航链路。
  - **库层「可选路由感知」（条目建议方向）**：新增 `src/lib/navigation.ts` 导出 `useDismissOnNavigate(onDismiss, enabled?)`——监听 `hashchange` + `popstate`，**不耦合任何路由库**，内部 ref 转发保证始终调最新闭包；并从包入口 `src/lib/index.ts` 导出。库内浮层**默认不自动关闭**（保持既有行为），由消费方显式接入。
  - **文档消费方接入**：`docs/geist/src/components/docs-shell.tsx`（汉堡面板）与 `docs/geist/src/App.tsx`（命令面板）各接一行 → 覆盖前进/后退、程序化 navigate、浮层外链接等**没有点击回调**的路由变化。
  - 回归：`tests/hamburger-menu-groups.test.tsx` 新增 2 用例（条目激活关闭 / 修饰键保留面板）；新增 `tests/navigation-dismiss.test.tsx`（4 用例：两类事件 / `enabled=false` / 卸载解绑 / 无陈旧闭包）；新增永久 e2e `tests/e2e/overlay-route-dismiss.spec.ts`（**2 passed**：点击条目关闭+路由切换、浏览器后退关闭）。
  - **守护有效性（变异测试）**：停用 `docs-shell.tsx` 的接入 → e2e「浏览器后退关闭」失败（面板仍可见）而「点击条目关闭」仍通过 → 两条路径各自独立生效；恢复后 2 passed。
  - **未验证项**：`context-menu.tsx:124-140`、`menu.tsx:208-227`（含 `dots-menu`/`menu-bar` 透传）的 `href` 条目依赖 Radix `Item` 的 select-关闭（仓库无显式处理），本轮未改动、未做浏览器实测 → 见交付书 §9。

#### HIG-AUD-018 受控能力缺口（open / detent / 状态源不可控）✅ 已修复（2026-09-23，增补 §5O）

- **严重度**：P1 ｜ **类型**：实现缺陷（API 契约） ｜ **验证状态**：`[已修复 + 运行确认]`（四个缺口全部闭环：Combobox `open`/`onOpenChange`、BottomSheet `detent`、SplitButton `menuButtonDisabled`、Toasts 受控 store 注入）
- **证据**：
  | 组件 | 缺口 | 位置 |
  |---|---|---|
  | Combobox | `open` **完全不可控**（内部 state，无 props 入口） | `combobox.tsx:159,527` |
  | BottomSheet | 当前档位 `current` **不可控**（只有 `onDetentChange` 回调） | `bottom-sheet.tsx:94,135` |
  | Toasts | 全局 store + `useSyncExternalStore`，**无受控 API** | `toast.tsx:104` |
  | SplitButton | 菜单触发按钮无法单独 `disabled`（`buttonProps.disabled` 只作用于主按钮） | `split-button.tsx:112-122` |
- 已具备受控能力的：Select/MultiSelect/Menu/DotsMenu/Sheet/Modal/CommandMenu/BottomSheet(open)/Drawer/SidePanel/EditMenu(无) ✓
- **建议修复方向**：补 `open`/`onOpenChange`（Combobox）、`detent`/`onDetentChange`（BottomSheet）、可选受控 store 注入（Toasts）；SplitButton 增加 `menuButtonDisabled`。
- **验收场景**：新增 API 测试，断言传 `open` 时组件完全由外部驱动（内部不自行变更）。

- **修复记录（2026-09-23，增补 §5O；四项缺口同会话全部闭环）**：
  - **Combobox `open` / `onOpenChange`（受控双模）**：新增 props；把 4 处 `setOpen` 写入点——选中（`:185`）、键盘导航（`:239`）、根与输入面点击（`:431`/`:441`）、Radix 的 Escape / 外点回调（`:527`）——**统一收敛到一个 `setOpen`**，受控时只上报、不写内部 state。新增 `tests/combobox-controlled.test.tsx`（2 用例）：外部未回写 prop 时内部**不自行打开**；回写后跟随；非受控模式不回归。
  - **BottomSheet `detent`（受控双模）**：复用同文件既有 `open` 双模写法；内部 `current` 改为 `detent`（受控值）/`detentState`（内部），两处写入点（拖拽吸附 `endDrag`、grabber 点击切档）统一走 `setDetent`；受控传值**越界 / 非整数钳到合法档位**（否则 `detents[out-of-range]` 为 undefined → ratio NaN → 面板高度崩）。`tests/bottom-sheet.test.tsx` 新用例：点击切档只上报且 `aria-valuenow` 不变 → 外部改 prop 后跟随且不重复上报 → 越界钳位。
  - **SplitButton `menuButtonDisabled`**：纯属性透传到 `MenuButton`（其 `disabled` 已可直达原生按钮，`menu.tsx:70/85`），无内部状态与 effect。新增 `tests/split-button-controlled.test.tsx`（2 用例）：只禁用菜单触发按钮、主按钮保持可用；且 `buttonProps.disabled` **仍只作用于主按钮**（既有行为不回归）。
  - **文档注册同步**：`docs/geist/src/data/component-api.ts` 为三者补行（combobox `open`/`onOpenChange`、bottom-sheet `detent`、split-button `menuButtonDisabled`）；`tests/component-api-registry.test.ts` 补对应断言 → **9 tests passed**。
  - **真实浏览器回归（临时探针，跑完即删，3 passed）**：① docs `/components/combobox` 点击展开、listbox 可见、Escape 收起（**Radix Popover 受控语义未变**，这是本轮唯一在单测之外的风险点）；② bottom-sheet grabber 非受控点击切档 `aria-valuenow` 0→1；③ split-button 菜单触发按钮可点开菜单。
  - **Toasts 受控 store 注入（第 4/4 项，同会话完成）**：把模块级单例（`toastRecords`/`toastListeners`/`nextToastId`）收进 `createToastStore()` 闭包，导出 `ToastStore` / `ToastRecord` 类型与 `createToastStore`；`Toasts` 新增 `store?`（默认全局 store），`useToasts(store?)` 绑定同一实例，`dismiss` / `subscribe` / `getSnapshot` 全部走注入实例。**默认全局 store 行为完全不变**（既有示例与测试零改动通过）。回归：新增 `tests/toasts-controlled.test.tsx`（4 用例：注入 store 驱动自身视口且与另一 store 隔离 / `useToasts(store)` 写入注入实例 / 省略 `store` 时默认 store 仍工作 / 自动关闭计时器绑定注入实例）；`tests/toast-api.test.ts` 的导出断言放宽为「包含」形式；`component-api.ts` 的 toast 条目补 `store` 与 `createToastStore` 行并在注册表 `toEqual` 列表中同步。真实浏览器：docs `/components/toast` 弹出 / 关闭路径不变。（**至此 018 的 4/4 缺口全部闭环**）
  - **踩坑记录**：`createToastStore` 一度同时出现在函数声明与末尾导出表 → `Duplicated export` 会让测试文件**静默 0 test**（已改为仅末尾导出；与前述「`.ts` 不能含 JSX」同属「加载期失败不易察觉」类，值得警惕）。
  - 门禁：`typecheck` / `lint` / 定向 vitest / 全量测试见交付书 §7.6。

#### HIG-AUD-019 `prefers-reduced-motion` 覆盖不完整

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **依据**：WCAG 2.3.3 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-23，修复与复测记录见增补 §5L）
- **证据（行号取自修复前版本，保留对照）**：`src/components/ui/` 中仅 **28 个文件**包含 `motion-reduce`（共 94 个 `.tsx`）。有全局兜底（`index.css:1331-1340`，现为 `:1438`），因此**不是硬失败**，但组件级覆盖不均：
  - 覆盖较好：`modal`、`tooltip`、`sheet`、`side-panel`、`bottom-sheet`、`command-menu`、`multi-select`、`context-card`、`edit-menu`
  - 缺失组件级处理：`menu`/`context-menu` 有 `motion-reduce:animate-none` ✓，但 `drawer` 面板类名缺 `motion-reduce:animate-none`（只有 overlay 有，`:232` vs `:151-153`），依赖 JS matchMedia + 全局兜底；
  - `theme-switcher.tsx:52` `transition-colors` 无 `motion-reduce:transition-none`；
  - `combobox.tsx:114,117` 按钮过渡无 `motion-reduce`。
- **建议修复方向**：把 `motion-reduce:animate-none` / `transition-none` 作为浮层与过渡组件的**默认约定**，并加守护测试（已有 `tests/skeleton-motion.test.tsx`、`tests/foundation-contract.test.ts:51` 先例）。
- **验收场景**：`emulateMedia({ reducedMotion: "reduce" })` 下逐浮层断言 `animation-name: none` 且功能不受影响。

- **修复记录（2026-09-23，增补 §5L）**：
  - **根因（本轮新发现，已回填上式证据口径）**：`data-[state=open]:animate-in[data-state="open"]` 的 specificity 为 **0,2,0**，高于单类名 `motion-reduce:animate-none`（0,1,0）→ 22 个 tw-animate 浮层上的「组件级 reduce 类」**一直是空操作**，实际只有全局兜底（`animation-duration: 0.01ms !important`）在起作用。因此本条目原证据「28 个文件包含 motion-reduce」应读作**虚假覆盖**（文件数达标 ≠ 生效），这也是「覆盖不均」体感与实测不符的原因。
  - **点名单项复核**：`drawer` 面板缺口**不成立**（`drawer.tsx:142` 早已带 reduce 类，属审核行号漂移）；`theme-switcher.tsx:54`（`transition-colors` 无保护）与 `combobox.tsx:114,117`（清空/展开按钮过渡）**确认缺失**，已补齐 `motion-reduce:transition-none`。
  - 修复：22 个 tw-animate 浮层文件 + `loading-dots` 的 animation kill switch 统一为 **`motion-reduce:animate-none!`**（Tailwind v4 规范语法的末尾 important；`skeleton.tsx:92` 的 v3 前缀写法 `motion-reduce:!animate-none` 一并归一）。**过渡侧保持不变**——实测单类名的 `motion-reduce:transition-none` 已生效（`transition-property: none`），无需 important。
  - 层叠最小复现（临时探针，reduce 模拟生效）：plain `motion-reduce:animate-none` → `animation-name: enter`；`motion-reduce:animate-none!` → `none`。
  - 回归：新增永久 e2e `tests/e2e/reduced-motion.spec.ts`（**8 passed**；双主题 × 4 类浮层，computed `animation-name === "none"` 且打开/关闭/输入功能正常）+ 守护测试 `tests/reduced-motion-coverage.test.ts`（5 用例，分桶登记：A 21 个组件级 tw-animate 浮层 / B command-menu 样式表兜底块与 keyframes / C 点名过渡缺口 / D JS 门控 3 文件 / E 组件级免动画清单 13 项 + 全局兜底 4 条声明冻结）。
  - **环境教训（写入探针范式）**：`test.use({ reducedMotion: "reduce" })` 在本项目配置下**不生效**（探针读 `matchMedia("(prefers-reduced-motion: reduce)").matches === false`），必须用显式 `page.emulateMedia()`；否则动画断言会在「无模拟」下假失败，并掩盖真实结论（本轮曾据此误判过一次根因方向）。

#### HIG-AUD-020 EditMenu 触屏行为缺陷（合成 `mousedown` 竞态 + iOS 原生菜单冲突）

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[静态推断，待真机验证]`
- **证据**：`src/components/ui/edit-menu.tsx`
  - `:157` 监听 `touchend` 显示胶囊；`:159` 以 capture 阶段监听 `document mousedown` 并「只要不在胶囊内就关闭」。触屏 tap 后浏览器会补发合成 `mousedown` → 胶囊**刚出现即被关闭**（一闪即隐）。
  - 未做任何 iOS 原生编辑菜单抑制：既无 `onContextMenu preventDefault`，也无 `-webkit-touch-callout: none`（对照 Radix 在 `react-context-menu` 中显式设置了后者）→ iOS 上原生 Copy/Look Up 菜单与胶囊**重叠**。
  - 无 `touchstart`/`touchmove` 处理、无选区拖拽手柄适配、无 `touch-action` 声明。
- **建议修复方向**：用 pointer 事件统一处理（或对合成事件做时间戳/`event.isTrusted` 过滤）；补 `-webkit-touch-callout: none`；评估 `contextmenu` 抑制。
- **验收场景**：真机 iOS Safari：长按选中文本 → 只出现项目胶囊，不出现原生菜单，且胶囊稳定停留 ≥ 1s 不被自动关闭。

**修复记录（2026-09-24，Chromium 触屏实测 + 运行确认；真机 iOS 仍待验证）**：

- **验证状态订正**：`[静态推断，待真机验证]` → **`[已由真实触屏输入复现并修复；真机 iOS 待验证]`**。Chromium（CDP 真实 touch）实测事件序列 `pointerdown → touchstart → pointerup → touchend → mousedown(firesTouch=true) → mouseup → click`，且修复前胶囊确实出现 `visible → exiting → visible` 的闪烁（见下）。
- **合成 mousedown 过滤（020-a）**：`closeIfOutside` 保持挂在 `mousedown`，新增两层判据——① `sourceCapabilities.firesTouchEvents === true`；② `touchend` 后 1s 窗口（只吞一次）。**「`isTrusted` 过滤」不可行**：合成事件实测 `isTrusted === true`。
- **原生菜单抑制（020-b）**：容器与胶囊补 `[-webkit-touch-callout:none]`；容器补 `onContextMenu` preventDefault（消费方自行处理时可让位）；胶囊补 `touch-manipulation`；容器不加 `touch-action`（保留原生滚动/缩放）。
- **回归**：`tests/edit-menu-api.test.tsx`（+2 用例：`touchend` → 合成 `mousedown` 不关闭且下一次真实 `mousedown` 仍关闭；`sourceCapabilities.firesTouchEvents` 路径）+ 永久 e2e `tests/e2e/edit-menu.spec.ts`（真实触屏 tap 后胶囊状态迁移中**不出现** `exiting` / `absent`）。**变异测试**：停用过滤 → 单测与 e2e 同时报警。
- **本文正文行号注记**：`:157` / `:159` / `:254-308` 均取自**修复前版本**，当前实现在 `src/components/ui/edit-menu.tsx` 的合成事件过滤与容器 / 胶囊属性处。

#### HIG-AUD-021 EditMenu 定位与语义边界问题（3 项）

- **严重度**：P1 ｜ **类型**：实现缺陷
- **证据**：`src/components/ui/edit-menu.tsx`
  1. **垂直方向无下边界 clamp**：`:182-193` 只在「上方空间不足」时翻转，`VIEWPORT_MARGIN`（`:91`）仅参与上方判定；翻转成 `bottom` 且选区贴近视口底部时胶囊会溢出下沿。
  2. **选区文本被 `trim()`**：`:132` `selectionObject.toString().trim()`，但 `:291` 回调传的是 `selection.text`（已 trim）→ 调用方做「剪切并删除」时，首尾空白不会被删除，与用户可见选区不一致。
  3. **复制失败仍触发 `onCut`**：`:214,224` `void copyTextToClipboard(text).then(() => onCut(text))` 无 `catch` → 剪贴板写入失败时 `onCut` 仍被调用，调用方可能据此删除选中内容，造成**数据丢失**。
- **建议修复方向**：补垂直 clamp（翻转后计算可用高度）；回调传原始选区文本（或同时提供 `text` 与 `rawText`）；`copyTextToClipboard` 失败时给出错误反馈并**不**调用 `onCut`。
- **验收场景**：选区在视口最底部 → 胶囊完整可见；选中「` foo `」执行 Cut → 首尾空白一并被调用方删除；模拟剪贴板失败 → `onCut` 不被调用且有可见反馈。

**修复记录（2026-09-24，三条全部运行确认）**：

1. **垂直下边界 clamp**：`bottom` 分支改 `max(VIEWPORT_MARGIN, min(rect.bottom + offset, innerHeight - height - VIEWPORT_MARGIN))`。e2e 实测（390×160 视口，修复前）胶囊底边 **165.66 > 视口 152.5**；修复后 `declaredTop = innerHeight - height - 8` 且完整落在视口内（双主题）。
2. **回调传原文**：`SelectionInfo` 增 `rawText`，`text` 保持「已 trim」语义不变；**剪贴板写入改为选区原文**；`onCut` / `onCopy` / `onLookUp` / `onShare` 与 `EditMenuAction.onSelect` 追加第二参数 `rawText`（纯新增）。e2e 实测：选中 `" any words"` 执行 Cut → 修复前剩余文本出现**双空格**（`Select  in this…`），修复后为 `Select in this…`。
3. **剪贴板失败不丢数据**：写入失败时不再调用 `onCut` / `onCopy`，改由新增 `onError` 上报（可见反馈由消费方渲染，示例已接）。e2e 以 mock 剪贴板（`writeText` reject + `execCommand` 返回 false）验证：文本原样保留 + 示例日志出现失败提示。

**回归与门禁**：`tests/edit-menu-api.test.tsx` 9 → 18 用例；新增永久 e2e `tests/e2e/edit-menu.spec.ts`（5 passed / 32.4s）；定向 vitest 10 files / 97 tests；`typecheck` exit 0；`lint` 0 errors；全量 `pnpm test` = 文档基线（7 failed | 233 passed）。详见增补 §5S。

**本文正文行号注记**：`:132` / `:182-193` / `:214,224` / `:291` 取自**修复前版本**。

#### HIG-AUD-022 Grabber 声明 `role="slider"` 但无键盘契约 — ✅ 已修复（2026-09-24）

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **依据**：WAI-ARIA `slider` 模式
- **修复前证据**：`src/components/ui/grabber.tsx:28-42` —— `role="slider"` + `aria-valuemin/valuemax/valuenow` ✓，但只有 `onClick`（`:36`），**无 ArrowUp/ArrowDown/Home/End**，也无 `aria-orientation`。同时 `bottom-sheet.tsx:198-202` 的 `onCycleDetent` 只有点击循环，无键盘调档。**本段行号取自修复前版本。**
- **修复后证据**：`grabber.tsx` 新增 `aria-orientation="vertical"` 与完整键盘调档：ArrowUp/Right 递增、ArrowDown/Left 递减、Home/End 跳首尾，边界钳制且不重复上报；`BottomSheet` / `ResponsiveDrawer` 均通过 `onDetentChange` 接入，前者保持 `detent` 受控/非受控契约，后者在 detents 动态缩短时钳制索引。
- **验收结果**：定向 vitest **3 files / 42 tests passed**（含 Grabber 单元契约、BottomSheet 受控/非受控双断言、ResponsiveDrawer 接线与动态边界）；两组变异分别被 8 条、2 条测试捕获；真实 Chromium 临时探针 **3 passed**（BottomSheet 双主题 + ResponsiveDrawer），确认 ARIA、键盘路径和 ≥44px 命中区；详见增补 §5T。

#### HIG-AUD-023 7 个已从包入口导出的组件未进入文档注册

- **严重度**：P1 ｜ **类型**：文档问题
- **证据**（`src/lib/index.ts` 有导出，`docs/geist/src/data/components.ts` 无 `name` 条目）：
  | 组件 | 导出位置 | 说明 |
  |---|---|---|
  | `SidebarNav` | `src/lib/index.ts:87` | — |
  | `Navbar` | `:89` | — |
  | `Footer` | `:91` | — |
  | `Phone` / `PhoneScreen` | `:132` | 由 `device` 页面代表（别名存在：`docs-routes.ts:163`） |
  | `HamburgerMenu` | `:135` | — |
  | `RatingPill` | `:146` | **已有导出、有组件文件，但无注册、无指南、无 examples** |
  | `SkeletonMask` | `:56` | 仅在 `skeleton` 指南中作为扩展描述 |
- 已核实：注册组件数 = **78**，双语指南数 = **78**（一一对应，含 `edit-menu`），故指南侧无缺口；缺口在**注册**侧。
- **建议修复方向**：逐项决策——补注册 + 指南 + examples，或在公开 API 中明确这些为「内部/模式级组件」并从包入口移出（见 HIG-AUD-024）。
- **验收场景**：包入口导出的每个组件模块都能在文档站找到页面，或明确不在文档范围（有决策记录）。

#### HIG-AUD-024 SidePanel 未从包入口导出，却被测试与门禁当作公共组件

- **严重度**：P1 ｜ **类型**：文档问题 + API 表面不一致
- **证据**：
  - `src/components/ui/side-panel.tsx:155` 导出 `SidePanel / SidePanelTitle / SidePanelDescription / SidePanelClose`；
  - `src/lib/index.ts`（1-161 行）**完全没有 SidePanel 导出**；
  - 但存在 `tests/side-panel-api.test.tsx`，且 `tests/audit/ledger-design-gate.test.ts` 将其纳入门禁；
  - 仓库内**无任何生产代码** `import` 它（唯一引用是测试）。
  - 对照：`tests/library-docs-export-parity.test.ts:105-110` 明确断言 `ExpandPanel`/`Grabber`/`PhoneStatusBar`/`PhoneSafariChrome` **不得**从包根暴露，说明仓库对「内部辅助不导出」有清晰契约，而 SidePanel 不属该类。
- **建议修复方向**：按意图二选一——导出为公共组件（补注册/指南/examples），或降级为内部辅助并把测试改为内部契约。
- **验收场景**：`library-docs-export-parity.test.ts` 与 `side-panel-api.test.tsx` 的意图一致且无歧义。

---

#### HIG-AUD-036 EditMenu 在指针设备上仍以横向胶囊呈现（与 HIG iPadOS 指引不同）

- **严重度**：P1 ｜ **类型**：实现缺陷（HIG 对齐） ｜ **验证状态**：`[静态确证]`
- **依据**：§3.1 `edit-menus.md` —— 「In iPadOS … when people use a **keyboard or pointing device** to reveal it, the edit menu opens **directly in a context menu**（竖向）」；同页「Let people reveal an edit menu using the system-defined interactions they already know」。
- **证据**：`src/components/ui/edit-menu.tsx:156-157` —— 触发条件同时包含 `mouseup` 与 `touchend`，二者一律渲染同一个横向胶囊（`:254-308`）；组件**不区分输入模态**。仓库已有现成的模态判定工具 `src/lib/input-modality.ts`（`pointer: coarse/fine`、`hover: none`）但未被本组件使用。
- **影响**：桌面/笔指针用户拖选文本后得到的是移动端形态；按 HIG 应等价为竖向菜单。
- **建议修复方向**：用 `useInputModality()` 分流——粗指针呈现横向胶囊，细指针/键盘呈现竖向菜单（或直接把该场景交给 `ContextMenu`，并在文档写明分工）。
- **验收场景**：桌面拖选文本 → 呈现竖向菜单；触屏长按选中 → 呈现横向胶囊；两者都能用键盘操作。
- **补充（同一原文）**：「Support **undo and redo** when possible. Like all menus, an edit menu doesn't require confirmation before performing its actions, so people can easily use undo and redo to recover a previous state.」→ Cut 不做确认的前提是**存在撤销**。本库的 `onCut` 只把文本交给调用方，**库侧不提供撤销**，这使 HIG-AUD-021 第 3 点（复制失败仍触发 `onCut`）从「不便」升级为**潜在数据丢失**：若调用方未实现撤销，误触 Cut 不可恢复。建议在 `edit-menu` 文档中明确「调用方必须提供撤销或确认」。

#### HIG-AUD-037 破坏性菜单项无二次确认

- **严重度**：P1 ｜ **类型**：实现缺陷（HIG 对齐） ｜ **验证状态**：`[静态确证]`
- **依据**：§3.1 `pull-down-buttons.md` —— 「**Let people know when a pull-down button's menu item is destructive, and ask them to confirm their intent.** Menus use red text to highlight actions that you identify as potentially destructive. When people choose a destructive action, the system displays an action sheet … in which they can **confirm their choice or cancel the action**. Because an action sheet appears in a different location from the menu and requires deliberate dismissal, it can help people avoid losing data by mistake.」
- **证据**：
  - `src/components/ui/context-menu.tsx:188,200` —— `destructive` 只做**红色文字**（`text-[#ee0000]`），`:194-219` 的 `onSelect` **直接执行**，无确认步骤。
  - `QuickActions` 演示 `docs/geist/src/examples/context-menu/quick-actions-8d41b0e7.example.tsx:44-48` 的 "Remove App" 直接 `setLog("Remove App")`，**无确认**。
  - 仓库已有可复用的确认组件 `DestructiveActionModal`（含输入门控 + loading + error），未被这条路径使用。
- **影响**：HIG 明确把「红字」与「二次确认」成对要求；当前只做了一半，破坏性操作可被误触立即执行。
- **建议修复方向**：在 `destructive` 项上提供可选确认（例如 `confirm?: boolean` 或在文档中约定消费方必须串接 `DestructiveActionModal`）；至少让 examples 演示确认流程，避免示范「直接执行」。
- **验收场景**：点击 destructive 项 → 出现确认（含取消路径）；取消后状态不变。

---

### 4.3 P2 问题

#### HIG-AUD-025 loading / empty 状态在浮层组件中普遍缺失

- **严重度**：P2 ｜ **类型**：实现缺陷（状态覆盖）
- **证据**：逐组件静态核对结果——本批 19 个浮层/交互组件中：
  - 有 error：`select`（`error`）、`combobox`（`errored`）、`destructive-action-modal`（`role="alert"` 错误区）
  - 有 empty：`combobox`（`emptyMessage`）、`command-menu`（`Command.Empty`）
  - 有 loading：仅 `destructive-action-modal`（`:206,213,221` 的 `loading` 门控）
  - **其余组件全部没有 loading，且大部分没有 empty**：`menu`、`context-menu`、`edit-menu`、`dots-menu`、`split-button`、`multi-select`、`sheet`、`bottom-sheet`、`drawer`、`modal`、`tooltip`、`toast`（kind 间接表达）、`hamburger-menu`（**搜索无结果时渲染空 `ul`，无空态文案**：`hamburger-menu.tsx:379-403`）、`side-panel`、`theme-switcher`
- **建议修复方向**：为「数据驱动列表型」浮层（menu/context-menu/multi-select/hamburger-menu/split-button）统一补 `empty` 与 `loading` 槽位；`select`/`combobox` 的 empty 已可复用模式。
- **验收场景**：向菜单传入空数组 → 出现可访问的空态文案；传入 loading → 出现 `aria-busy` 与骨架/加载指示。

#### HIG-AUD-026 移动端视口高度用 `vh` 而非 `dvh`

- **严重度**：P2 ｜ **类型**：实现缺陷
- **证据**：`command-menu.tsx:65` `max-grid-sm:h-[80vh] max-grid-sm:max-h-[80vh]`；`modal.tsx:117` `max-h-[min(800px,80vh)]`；`destructive-action-modal.tsx:126` `max-h-[min(800px,80vh)]`。
- 已有正确先例：`bottom-sheet.tsx:181` 用 `dvh`、`drawer.tsx:152` 用 `80dvh`、`hamburger-menu` 用 `100dvh`。
- **影响**：移动端地址栏收缩/展开时内容被截断或出现跳动。
- **建议修复方向**：统一改用 `dvh`（并保留 `vh` 作为回退，如 `max-h-[80vh]` → `max-h-[80dvh]`）。
- **验收场景**：移动视口下滚动隐藏地址栏，浮层内容不被截断。

#### HIG-AUD-027 Select 缺移动端全宽贴底形态（与项目自定规范不一致）

- **严重度**：P2 ｜ **类型**：实现缺陷（一致性）
- **证据**：`PLAN-HIG-COMPONENTS.md:118` 自定「移动端浮层 `max-sm:w-full max-sm:rounded-b-none` 全宽贴底」；`context-menu.tsx:25` 与 `multi-select.tsx:30` 已实现该先例，但 `select.tsx`（浮层 `:230-231`）**无任何 `max-sm:` 处理**。
- **建议修复方向**：为 Select/MultiSelect 统一移动端形态（或撤销该规范并统一改为居中 popover）。
- **验收场景**：390 视口下 Select 浮层形态与 ContextMenu 一致。

#### HIG-AUD-028 滚动条宽度补偿缺失

- **严重度**：P2 ｜ **类型**：实现缺陷
- **证据**：全仓无 `scrollbar-gutter`（唯一一处 `scrollbar-gutter: stable both-edges` 在文档侧栏 `index.css:2001`）；浮层打开导致 body 滚动条消失时，仅靠 `react-remove-scroll` 注入的 `body padding-right` 补偿。`index.css:2242-2244` 把 `overflow: hidden` 提权覆盖为 `clip` 作为兜底。
- **影响**：Windows 等经典滚动条平台可能出现一次横向抖动。
- **建议修复方向**：在 `:root` 或浮层打开时使用 `scrollbar-gutter: stable`；或在 e2e 中断言打开浮层前后 `main` 的 `clientWidth` 不变。
- **验收场景**：e2e 断言打开/关闭 Sheet、Modal、Menu 前后内容区宽度不变（±1px）。

#### HIG-AUD-029 移动端断点覆盖零散 + 无 `visualViewport` 监听

- **严重度**：P2 ｜ **类型**：实现缺陷
- **证据**：仅 6 个组件有 `max-sm`/`max-grid-sm`/`max-modal` 特化（`context-menu`、`multi-select`、`command-menu`、`modal`、`sheet`、`breadcrumbs`、`note`、`calendar-classes`）；`select`、`combobox`、`drawer`、`bottom-sheet`、`side-panel`、`toast`、`tooltip`、`edit-menu` **无序断点特化**。
  `edit-menu.tsx:161` 只监听 `resize`，**不监听 `visualViewport`** → 移动端软键盘弹起、双指缩放时不重算位置。
- **建议修复方向**：为浮层建立统一的响应式契约（与 HIG-AUD-027 合并处理）；`edit-menu` 增加 `visualViewport` 的 `resize`/`scroll` 监听（或直接关闭浮层）。
- **验收场景**：390 视口下逐个浮层截图核对形态；`edit-menu` 在模拟软键盘弹起时不会停留在错误位置。

#### HIG-AUD-030 屏幕阅读器播报缺陷（3 处）

- **严重度**：P2 ｜ **类型**：实现缺陷
- **证据**：
  1. `toast.tsx:153-154` `<ol aria-live="polite" aria-relevant="additions text">` + `:185` 每个 `<li role="status">` → **双层 live region**，可能重复播报；且无 `aria-atomic`。
  2. `command-menu.tsx:137` `Command.Empty role="presentation"` → 无结果时**不播报**。
  3. `edit-menu.tsx:254-308` 浮层出现**无任何播报**（无 `aria-live`，也无焦点移动，见 HIG-AUD-004）。
- **建议修复方向**：Toast 只保留一层 live region（推荐 `<ol aria-live>` + `<li>` 无 role，或反之）并加 `aria-atomic="true"`；`Command.Empty` 去掉 `role="presentation"`（或改为 `role="status"`）；`edit-menu` 与 HIG-AUD-004 一并修。
- **验收场景**：NVDA/VoiceOver 下：新 toast 只播报一次；搜索无结果有播报；编辑菜单出现有播报。

---

### 4.4 P3 审美与一致性建议

#### HIG-AUD-031 破坏性色彩用 Tailwind 命名色而非语义 token

- **类型**：审美建议 ｜ **证据**：`destructive-action-modal.tsx:155` 使用 `red-100/red-200/red-900`；`toast.tsx:192` success kind 使用硬编码 `text-white`；`context-menu.tsx:200`、`activity-view.tsx:134` 使用 `#ee0000`。
- **说明**：效果服务于「破坏性/成功」这类**状态层级**，应走语义 token（`--destructive` 已存在）。统一后暗色对比可控，且能顺带解决 HIG-AUD-005。
- **验收场景**：破坏性/成功态在双主题下的对比度实测一致性；`raw-color-governance` 全绿。

#### HIG-AUD-032 DotsMenu 与 Menu 的表面不一致

- **类型**：审美建议 ｜ **证据**：`dots-menu.tsx:20-21` 用 `bg-background`，而 `menu.tsx:139` 用 `bg-surface`；两者同族（DotsMenu 基于 menu.tsx 封装）但底色不同。另有 `dots-menu` 显式传 `aria-haspopup="true"`（`:53`）覆盖 Radix 的 `aria-haspopup="menu"`，语义降级。
- **建议**：统一表面 token；移除显式 `aria-haspopup`。
- **验收场景**：DotsMenu 与 Menu 的浮层底色 computed 值一致。

#### HIG-AUD-033 Combobox 面板自写字面量阴影

- **类型**：审美建议 ｜ **证据**：`combobox.tsx:120` 使用 `shadow-[0_0_0_1px_…rgba(0,0,0,0.04)…]` 字面量，而非 `material-menu` / `--material-shadow-menu`（`select.tsx`、`multi-select.tsx` 已用后者）。
- **建议**：迁移到材质 utility，统一浮层「同一材质语言」。
- **验收场景**：Popover 族面板阴影 computed 值同源。

#### HIG-AUD-034 EditMenu 无退场动画造成「闪现消失」

- **类型**：审美建议 ｜ **证据**：`edit-menu.tsx:278` 只有 `animate-in`；`:152,154,198` 通过 `setSelection(null)` 立即卸载。
- **说明**：这正是「必要反馈不足」——选中文字后的操作条在每次选区变化时闪动。建议与 HIG-AUD-011 合并处理。
- **验收场景**：选区移动时胶囊平滑过渡而非逐帧闪烁。

#### HIG-AUD-035 装饰性模糊的用途边界未文档化

- **类型**：审美建议 ｜ **证据**：`destructive-action-modal.tsx:118` 是全仓**唯一**使用 `backdrop-blur-sm` 的遮罩；`context-menu.tsx:162`（Quick Actions）新增了 `backdrop-blur-sm`；其余遮罩为纯色。
- **说明**：审核尺度是「模糊作为点缀」。建议明确**模糊只用于表达「主屏/AI 建议/临时前台」这类层级**，并写成 token（`--uni-overlay-backdrop-blur`）而非逐组件自由选择，否则会从「点缀」滑向「装饰过量」。
- **验收场景**：全仓模糊使用点 ≤ 2 处且有注释说明其服务层级。

---

### 4.5 HIG 八项能力覆盖（**复核后已更新**）

> **重要更新**：审核交付复核时发现，并发会话已在审核期间**把二期能力全部落地**。本节原判「缺失」的条目已作废，改为下表。
> **补审已完成**：下表 6 项「审核未覆盖」的原判**已由补充报告关闭** —— 深度静态审核结论、3 个新的 P1 缺陷（HIG-AUD-038/039/040）与 10 条 P2/P3 见
> `docs/audits/hig-experience-audit-2026-09-18-addendum-phase2.md`。**下表「结论」列中「审核未覆盖」的表述以补充报告为准。**

| 编号 | HIG 能力 | 复核后现状 | 证据 | 结论 |
|---|---|---|---|---|
| **HIG-GAP-01** | The Menu Bar | **已实现** | `src/components/ui/menu-bar.tsx`；导出见 `src/lib/index.ts:98-99`（`MenuBar`/`MenuBarMenu`/`MenuBarTrigger`/`MenuBarContent`/`MenuBarItem`/`MenuBarCheckboxItem`/`MenuBarSeparator`/`MenuBarSub`/`MenuBarSubTrigger`/`MenuBarSubContent`）；注册 `components.ts:365-377`；双语指南 `guides-05.ts:456,1110` | **审核未覆盖**（新增，未做 L1 审核）。需验证 APG `menubar` 键盘模型、快捷键仅展示、子菜单逐级 Escape |
| **HIG-GAP-02** | Toolbars | **已实现** | `src/components/ui/toolbar.tsx`；导出 `src/lib/index.ts:100-101`（`Toolbar`/`ToolbarGroup`/`ToolbarItem`，含 `ToolbarSlot`）；注册 `components.ts:395-398`；指南 `guides-05.ts:507,1163` | **审核未覆盖**。需验证溢出折叠（ResizeObserver + 溢出菜单）与 keyboard 可达 |
| **HIG-GAP-03** | Layout & Organization | **已实现（导航重组 + 布局原语）** | `docs-routes.ts:6` 已有 `"layout"`；`:42` `{ id: "layout", title: "Layout & Organization", titleZh: "排版与布局" }`；Typography（`:75`）与 Grid（`:91`）已迁入 `group: "layout"`；`:119` `LAYOUT_COMPONENT_NAMES = new Set(["safe-area","stack"])`；`:125` 按名判定分组；组件 `src/components/ui/layout.tsx`（`SafeArea`/`Stack`）；导出 `src/lib/index.ts:102-103`；注册 `components.ts:379-393`；指南 `guides-05.ts:558,599,1216,1259` | **审核未覆盖**。需验证新分组对 `component-index`/侧栏投影/`docs:llm:check`/`readme:screenshots` 的影响，以及新增第 5 个分组的侧栏信息架构 |
| **HIG-GAP-04** | Activity Views | **已实现** | `src/components/ui/activity-view.tsx`（5.04 KB）；导出 `src/lib/index.ts:97,104`；注册 `components.ts:352-363`；指南 `guides-05.ts:406,1058` | **审核未覆盖** + 已发现 `#ee0000` 治理违规（HIG-AUD-005）。需按 §3.1 的 Activity Views 原文核对：图标 ~70×70、避免与系统动作重复、长任务进度回主 App |
| **HIG-GAP-05** | Pull-Down Buttons | **已实现** | `src/components/ui/split-button.tsx` 变体；示例 `examples/split-button/pull-down-card-*.example.tsx`；测试 `tests/pull-down-button-api.test.ts` | **审核未覆盖**。需按 §3.1 原文核对：破坏性项必须**二次确认**（见 HIG-AUD-037）、「最少三项」、命令与菜单标题 |
| **HIG-GAP-06** | Pop-up Buttons | **已实现（= Select + 文档对齐）** | 示例 `examples/select/pop-up-button-*.example.tsx`；`select.tsx` 已具备「显示当前值 + 弹出单选 + 打开高亮当前项」 | 整合方向与 §3.1 原文一致（Pop-up 承载互斥选项，动作类应走 Pull-down）；遗留移动端形态问题见 HIG-AUD-027 |
| **HIG-GAP-07** | Home Screen Quick Actions | **已实现，形态仍不完整** | `context-menu.tsx:118-241` | 竖排/大图标/副标题/破坏性项已具备；**打开即崩溃（HIG-AUD-051，P0，运行确认）**——崩溃修复前 001 的遮罩层级问题被遮蔽；按 §3.1 原文，缺「移除 App / 编辑主屏幕」**系统尾项**，且 HIG 未提及模糊与图标动画（PLAN 的该项描述无正文依据） |
| **HIG-GAP-08** | 原生专属项（不适用） | — | iOS 原生编辑菜单的系统项、3D Touch 压力感应、Dynamic Type 系统设置、SF Symbols、Share/Action extension 生态 | **原生专属不适用**：Web 无对应能力。按 §3.1，`activity-views` 的 Share extension、`home-screen-quick-actions` 的 3D Touch、`edit-menus` 的 `UIResponderStandardEditActions` 均属此类。建议在文档中显式标注「Web 适配取舍」，而不是当作缺陷 |

### 4.6 文档问题

| 编号 | 问题 | 证据 |
|---|---|---|
| **HIG-DOC-01** | 文档站无「排版与布局」顶层分组，Typography/Grid 仍在「基础」 | `docs-routes.ts:6,40-45,72-95` |
| **HIG-DOC-02** | 7 个已导出组件未注册 | 见 HIG-AUD-023 |
| **HIG-DOC-03** | SidePanel 无指南、未导出，但被测试/门禁当公共组件 | 见 HIG-AUD-024 |
| **HIG-DOC-04** | 文档链在审核期间处于中间态（`components.ts`/`component-api.ts`/`examples/registry.ts` 未提交修改） | §2.1；`git status` |
| **HIG-DOC-05** | 计划文档 / 组件文档页与实现不一致（**已据 HIG 原文更正**） | **(a) 作废的原判**：原判「`PLAN-HIG-COMPONENTS.md:153` 的『无选中文本时禁用』与 `edit-menu.tsx:206-249` 的『无回调则不渲染』漂移」。据 §3.1「removing **or** dimming commands that don't apply」，HIG 允许二者，**实现合规**，此项不成立。**(b) 新增（成立）**：`edit-menu` 文档页「无障碍」栏声称「胶囊容器使用 `role="toolbar"` 并带 `aria-label`，**每个操作是可聚焦的原生 button**」与「**Escape 关闭胶囊**」，但实现中 `edit-menu.tsx:263` 的 `onMouseDown preventDefault` 使按钮**永不获得焦点**、Escape 绑在永不聚焦的胶囊上**不可达** → **文档描述了实现不具备的可访问性保证**，比单纯缺功能更危险（会误导消费方不做补偿）。**(c) 新增（成立）**：`PLAN-HIG-COMPONENTS.md:51` 以「背景模糊 + 图标缩放动画」作为 Quick Actions 的 HIG 依据，但 `home-screen-quick-actions` 正文**无此内容**，属无正文依据的引用，应改为「系统观感描述」或不引用 |

**正面记录（值得保持）**：
- 双语指南与注册组件**一一对应**（78 = 78，含 `edit-menu`），由 `tests/component-doc-completeness.test.ts:24-27` 强制。
- 文档注册/API/导出三方一致性由 `tests/library-docs-export-parity.test.ts`、`tests/component-api-registry.test.ts` 守护，且**明确列出不得导出的内部辅助**（`:105-110`）。
- 大量实现文件带有高质量的**决策注释**（为何与 Drawer 不合并、为何不用某 token、Radix 焦点竞态说明），例如 `drawer.tsx:38-44`、`side-panel.tsx:13-30`、`bottom-sheet.tsx:10-23`、`grabber.tsx:44-46`（含对比度实测值）。这是本仓库最值得保留的资产。
- `grabber.tsx:44-46` 记录了实测对比度（light 3.23:1 / dark 5.51:1）并说明为何弃用 `gray-alpha-500`（1.66/2.06:1 不达标）→ **符合 WCAG 1.4.11 的证据化实践**，建议推广为组件注释规范。

---

### 4.7 本轮补充的浏览器采集与视觉分析

**已完成的采集（可复现）**

| 采集 | 命令 | 产物 |
|---|---|---|
| HIG 正文（JS 渲染） | `node .scratch/hig-audit-2026-09-18/fetch-hig-sources.mjs` | `.scratch/hig-audit-2026-09-18/hig-sources/*.md`（11 页，HTTP 200） |
| 本地文档站 | `pnpm exec vp dev docs/geist --host 127.0.0.1 --port 5211 --strictPort` | 实测 `http://127.0.0.1:5211/` 返回 **200** |
| 组件页截图 | `node .scratch/hig-audit-2026-09-18/capture-docs-screenshots.mjs` | `screenshots/<slug>-<w>-<theme>.png`，**12 页面 × 2 主题 × 2 视口（1440/390）= 48 张**（fullPage） |
| 命中测试脚本 | `node .scratch/hig-audit-2026-09-18/verify-quick-actions.mjs` | 见下方「被阻塞」 |

覆盖页面：`context-menu`、`edit-menu`、`bottom-sheet`、`modal`、`select`、`toast`、`menu`、`split-button`、`activity-view`、`drawer`、`sheet`、`tooltip`。所有页面均成功定位 `h1`（中文标题渲染正常：右键菜单／编辑菜单／底部弹层／模态框／下拉选择器／轻提示／菜单／拆分按钮／活动视图／抽屉／侧边面板／工具提示）。

**视觉分析结论（基于实际查看的截图）**

1. `context-menu-1440-light.png`：排版驱动、留白充足、边框克制，未见过量材质或装饰性动效；best-practices 表与 API 表层级清晰 → 与本次「**简约排版为主体，模糊/材质/动效作点缀**」的审核尺度**一致**，未发现装饰过量。
2. `edit-menu-1440-dark.png`：暗色层级清晰、文字对比充足；示例区与 API 表排版规整 → 暗色主题未见明显问题（**未做像素级对比度测量**，见 HIG-VER-11）。
3. **视觉发现（关键）**：该页侧栏已渲染出 **「排版与布局」分组**（含「安全区」「堆叠」）→ 这是 §4.5 复核「HIG-GAP-03 已实现」的视觉证据来源。
4. **视觉发现（关键）**：`edit-menu` 文档页「无障碍」栏声称「每个操作是可聚焦的原生 button」与「Escape 关闭胶囊」，与实现不符 → 已记为 HIG-DOC-05(b)。
5. 视觉发现（次要）：`edit-menu` 文档页 API 参考的导入示例疑似使用内部别名路径而非包名 → 仅作提示，**未断言**（待人工复核）。

**被阻塞的运行时验证（HIG-AUD-001）→ 已于同日第二轮解决**

- 第一轮（`verify-quick-actions.mjs`，长跑 server @ 5211）：触发器定位成功（`button:has-text("Notes")`，80×80）；原生右键后 `[role="menu"]` 数量为 **0**，遮罩未出现，无页面报错 → 当时结果不确定。后续两次重跑因审批超时被取消。
- **第二轮（同日，`verify-phase2-findings.mjs` + `verify-fresh-server.mjs` + `repro-slot-error.mjs`，全新 dev server @ 5212/5213 以排除长跑 server 缓存漂移）**：
  - QA 菜单打不开的根因**不是**第一轮猜测的三种可能，而是 **HIG-AUD-051（P0，新发现）**：Quick Actions 打开瞬间渲染崩溃（Portal 双子节点 × `MenuPortal asChild` Slot 契约冲突），ErrorBoundary 捕获后整页示例被替换。在全新 server 上稳定复现 → **HEAD 上的真实缺陷，非缓存漂移**。
  - 第一轮「无页面报错」系时序假象；第二轮逐示例隔离 + 全新 server 后取得完整 `pageerror` 栈与 ErrorBoundary 日志。
  - 由此：HIG-AUD-001 的 z 层级缺陷**静态确证维持**，但其「遮罩压住菜单」的表现被 051 遮蔽，须先修 051 再做 001 的命中验收（两处位于同一渲染结构，建议一次修复）。
- HIG-AUD-003 已于 2026-09-21 完成运行确认（手势范围收窄到 `<Grabber>`，内部滚动不再被吞）；HIG-AUD-020（EditMenu 触屏竞态）仍待运行确认。

**局限性声明**：fullPage 截图对「浮层打开态、动效中间帧、命中测试、对比度测量」证据不足。上述视觉分析仅支持**排版/层级/密度**层面的判断，不足以支撑或推翻任何运行时缺陷结论。

---

## 5. 共享根因

将上述问题按根因合并（避免逐组件重复记账）：

| 根因 | 说明 | 受影响问题 |
|---|---|---|
| **R1｜层级契约缺失** | 没有「遮罩 < 其内容 < 各层 token」的成对约定，遮罩与内容共用一个 z token 且取值颠倒；同时存在硬编码 z 与完全缺 z 的组件 | HIG-AUD-001、009、010、035 |
| **R2｜材质/token 迁移只做了一半** | `material-menu`、`--material-shadow-*`、`--uni-overlay-backdrop-*` 已建立，但新组件与旧组件各自写字面量；注释声明「有意等价」掩盖了重复 | HIG-AUD-005、010、031、032、033 |
| **R3｜动效规格未成文** | 入场/退场是否对称、用哪个时长/缓动、reduced-motion 兜底层级，均无强制约定与守护测试 | HIG-AUD-011、012、019、034 |
| **R4｜「指针驱动」组件未定义键盘路径** | EditMenu、ContextMenuQuickActions、Grabber、MultiSelect 热区、ThemeSwitcher 的 `radiogroup` 均按指针设计，未实现对应 ARIA 模式的键盘契约 | HIG-AUD-002、004、015、016、022 |
| **R5｜焦点管理靠「Radix 默认」的以偏概全** | 只在使用 Trigger 的组件成立；无 Trigger 的封装（SidePanel）漏做，注释还写反了 | HIG-AUD-006、007 |
| **R6｜手势监听范围过宽** | 面板级 pointer capture + 无 target 判定，把内部滚动误判为拖拽 | HIG-AUD-003 |
| **R7｜i18n 键集合无类型级同构约束** | 缺 key 静默回显原文，导致 3 处线上可见缺陷 | HIG-AUD-008 |
| **R8｜触控目标无统一策略** | 「视觉小 + 命中区外扩」已有先例但未推广 | HIG-AUD-013、029 |
| **R9｜导航/状态生命周期未覆盖** | 无路由变化关闭、open/detent 受控能力不齐、loading/empty 状态未成规范 | HIG-AUD-017、018、025 |
| **R10｜审核对象未冻结** | 并发写入使文档链长期处于中间态，门禁红灯与「半成品」状态难以区分 | HIG-AUD-BASE-01、HIG-DOC-04、HIG-AUD-005 |

---

## 6. 整改路线

优先级原则（按审核方案）：**先处理任务阻断与可访问性 → 再处理跨组件一致性、布局与动效 → 最后安排能力补全与视觉优化**。

### 阶段 0：冻结与复验（阻塞后续一切）

1. 固定 revision、清理工作区（当前有 6 个已修改 + 3 个未跟踪文件）。
2. ~~跑通并记录退出码~~ ✅ **已完成（2026-09-18 第三轮 @ `834f19d8`）**：typecheck / docs:llm:check / build 全部 **exit 0**；`pnpm test` exit 1（既有基线失败，见下）；`test:docs-layout` exit 1（**1 failed = HIG-AUD-053**，2 flaky 为环境波动）。日志：`.scratch/hig-audit-2026-09-18/cmdlogs/`。
3. 在冻结快照上复验本报告 P0 条目（HIG-AUD-051 已于 `d6d5429` 运行确认；HIG-AUD-003 已于 2026-09-21 完成浏览器确认——`1866616` 把手势范围收窄到 `<Grabber>`；P0 全量复验见 §3.1 各条「修复后证据」）。
- **依赖**：无。**风险（2026-09-18 实测更新）**：HIG-AUD-005 已撤回，治理测试**为绿**（4/4 passed, exit 0）；`pnpm test` 的 9 个稳定失败（`docs-foundations` ×3、`foundation-contract` ×1、`keyboard-input-api` ×5）与 `test:docs-layout` 的 1 个稳定失败（HIG-AUD-053）均属**基线状态**，须与「整改期间新引入回归」分开记录。**（2026-09-21 复核：全量 `pnpm test` 实测 228 files / 1424 tests passed、exit 0，上述 9 个失败未复现；`test:docs-layout` 的 HIG-AUD-053 仍为唯一稳定失败。）**

### 阶段 1：阻断与可访问性（P0 + 高价值 P1）

| 顺序 | 条目 | 依赖 |
|---|---|---|
| 1.1 | **HIG-AUD-051 Quick Actions 打开即崩溃**（双 Portal 拆分）+ HIG-AUD-001 遮罩/内容层级（同一渲染结构，一次修复；建立 R1 的配对约定） | 阶段 0 |
| 1.2 | HIG-AUD-052 颜色治理旁路封堵 + 语义 token 迁移（`--destructive`；含账本棘轮不变量） | 可与 1.1 并行 |
| 1.3 | HIG-AUD-003 BottomSheet 手势范围 | 独立 |
| 1.4 | HIG-AUD-002 ContextMenu 键盘入口 | 独立（可能触及公共 API：新增触发器行为或文档契约） |
| 1.5 | HIG-AUD-004 EditMenu 键盘与焦点 | 与 1.4 共享 R4 约定 |
| 1.6 | HIG-AUD-006/007 SidePanel 焦点与模态语义 | 独立（可能触及公共 API：新增 `SidePanelTrigger`） |
| 1.7 | HIG-AUD-008 i18n 键同构约束 + 补 3 个 key | 独立 |
- **兼容风险**：1.2 改 z 值可能影响依赖旧层级的消费方；1.4/1.6 若新增导出属**公共 API 变更**，需按仓库约定评估（本次审核不实现）。

### 阶段 2：跨组件一致性与动效

| 顺序 | 条目 | 说明 |
|---|---|---|
| 2.1 | HIG-AUD-009 清除硬编码 z | 依赖 1.2 确立的层级序 |
| 2.2 | HIG-AUD-010 overlay 背板统一（含 `--uni-overlay-backdrop-blur`） | 依赖 1.2 |
| 2.3 | HIG-AUD-011/012 浮层动效规格成文 + 逐组件替换 | 依赖 R3 约定 |
| 2.4 | HIG-AUD-019 reduced-motion 全覆盖 + 守护测试 | 与 2.3 同期 |
| 2.5 | HIG-AUD-013/029 触控目标与响应式契约 | 依赖 HIG-AUD-027 的形态决策 |
| 2.6 | HIG-AUD-014/015/016/022/030 键盘与 AT 细节 | 共享 R4 |
| 2.7 | HIG-AUD-017/018/025/026/028 生命周期与状态覆盖 | 共享 R9 |
| 2.8 | HIG-AUD-020/021 EditMenu 触屏与定位边界 | 需真机验证 |
| 2.9 | HIG-AUD-053 命令面板搜索相关性（`getRouteSearchText` 去除分组名拼接或自定义 cmdk filter） | 独立；`command-search.spec.ts:49` 即守护用例 |
- **兼容风险**：2.6 中 MultiSelect 移除 Tab 循环会改变现有键盘行为；2.7 补受控 API 属增量（低风险）。

### 阶段 3：能力补全与视觉优化

| 顺序 | 条目 | 说明 |
|---|---|---|
| 3.1 | HIG-DOC-02/03 注册与导出决策（7 个组件 + SidePanel） | 纯决策 + 文档 |
| 3.2 | HIG-GAP-04 ActivityView 收尾（含治理违规 HIG-AUD-052） | 依赖 1.2 |
| 3.3 | HIG-GAP-05 Pull-down 收尾（动效对齐 2.3） | 依赖 2.3 |
| 3.4 | HIG-GAP-07 Quick Actions 形态补全（图标动画、系统尾项、触屏 only 文档） | 依赖 1.1（HIG-AUD-051/001 修复） |
| 3.5 | HIG-GAP-01/02 MenuBar / Toolbar | 需先验证 radix 统一包是否导出 `Menubar`（`PLAN-HIG-COMPONENTS.md:319` 已列为风险） |
| 3.6 | HIG-GAP-03 Layout & Organization 分组 + SafeArea/Stack | 需先验证侧栏投影对非 `components` 分组的兼容性 |
| 3.7 | HIG-AUD-031~035 视觉优化 | 依赖 2.2 |
| 3.8 | HIG-DOC-05 计划文档与实现对齐（或废弃计划） | 最后做，避免二次漂移 |

### 阶段 4：验证能力补强（贯穿，建议在阶段 1 启动）

| 条目 | 说明 |
|---|---|
| HIG-VER-01 | 增加 200% 缩放（`deviceScaleFactor`/`zoomFactor` 或 CSS `zoom`）用例，覆盖浮层与长文本重排 |
| HIG-VER-02 | 增加 `forced-colors: active` 用例，覆盖按钮、焦点环、图标、分隔线 |
| HIG-VER-03 | 增加 Playwright 触屏仿真（`hasTouch`/`isMobile` + `dispatchTouchEvent`），覆盖长按、拖拽、下拉关闭 |
| HIG-VER-04 | 至少对浮层/文本选择/滚动/材质/动画敏感用例加 WebKit 项目；**模拟结果不得声称等同真实 Safari/iOS/VoiceOver** |
| HIG-VER-05 | 把 reduced-motion 从 1 个用例扩展为浮层矩阵 |
| HIG-VER-06 | 对齐截图 harness 视口（375/768/1440/1920）与 e2e 六档（320/390/768/1024/1100/1440） |
| HIG-VER-07 | 用 JS 渲染抓取补 HIG 正文与访问日期；在此之前保留「证据不足」标注 |

---

## 7. 完整覆盖记录（摘要）

完整逐组件表见 `docs/audits/hig-coverage-matrix-2026-09-18.md`。本节给出结论口径。

### 7.1 组件覆盖口径

- **审核基准集合**：`src/lib/index.ts` 导出的 **85 个组件模块** + `src/components/ui/` 下 **9 个内部辅助**（`calendar-panel`、`expand-panel`、`feedback-faces`、`field-error`、`grabber`、`hamburger-icon`、`loading-icon`、`phone-chrome`、`side-panel`）。
- **文档注册集合**：78（= 双语指南数）。
- **每个组件在矩阵中都有结论**：以下四类之一——
  1. **已审核 · 发现问题**（给出问题编号）；
  2. **已审核 · 未发现问题**（给出审核维度：契约/状态/键盘/动效/材质/i18n）；
  3. **未逐项审核 · 原因**（例如纯展示组件，仅核对了双主题与 token 使用）；
  4. **未验证 · 环境不支持**（明确写出原因）。

### 7.2 HIG 能力覆盖口径

| HIG 领域 | 覆盖状态 |
|---|---|
| 基础原则（简约排版、内容优先、一致性） | **部分覆盖**：token 与排版体系扎实；一致性问题集中在浮层材质/层级/动效（R1–R3） |
| 组件 | **部分覆盖**：HIG 八项中 1 项已落地、2 项进行中、5 项缺失（§4.5） |
| 布局 | **部分覆盖**：响应式与六档视口审计完备；缺 SafeArea 语义与 Stack 原语；部分浮层漏 `safe-area-inset` |
| 输入方式 | **部分覆盖**：指针/鼠标完备；键盘有 4 处硬缺口；触屏有 3 处缺陷；**无 Playwright 触屏仿真证据** |
| 反馈与任务流程 | **部分覆盖**：Toast/Progress/Skeleton/EmptyState 齐备；但浮层的 loading/empty 状态普遍缺失；破坏性操作保护（`DestructiveActionModal`）是本仓库最强项之一（loading + error + 门控 + 双关联 label） |
| 可访问性 | **部分覆盖**：焦点归还实践强（5 个组件自实现 + 注释）；但存在无 Trigger 时的系统性遗漏、AT 播报缺陷、触控目标普遍偏小 |
| 原生专属不适用 | **明确标注**：3D Touch、系统菜单栏、Dynamic Type 系统设置、iOS 原生编辑菜单系统项等 |

### 7.3 审核结论的置信度分层

| 标记 | 含义 | 本报告中的应用 |
|---|---|---|
| `[静态确证]` | 我已直接读取源码并核实行号与语义 | 绝大多数 P0/P1 条目 |
| `[静态推断]` | 基于源码 + 已核实的三方库/平台语义推断，未在浏览器验证 | HIG-AUD-001、003、020 |
| `[待运行验证]` | 需运行测试/浏览器才能定性 | 所有运行时行为 |
| `[证据不足]` | 规范原文无法取得，不做违规断言 | 全部「HIG 对齐」表述（§3） |

---

## 8. 剩余验证项（不计为已确认缺陷）

| 编号 | 未完成项 | 阻塞原因 | 恢复动作 |
|---|---|---|---|
| HIG-VER-01 | 200% 缩放 | 仓库无 harness | 新增 Playwright 用例 |
| HIG-VER-02 | 强制颜色（forced-colors） | 仓库无 harness | 新增 `emulateMedia({ forcedColors: "active" })` 用例 |
| HIG-VER-03 | 触屏模拟 | 仓库无 harness | 新增 `hasTouch` context + 触摸事件派发 |
| HIG-VER-04 | WebKit / Firefox 核验 | `playwright.config.ts:20` 仅 `browserName: "chromium"`，无 `projects` | 增加 projects；结果标注为「模拟，不等同真机」 |
| HIG-VER-05 | reduced-motion 全量 | 仅 1 个 e2e 用例 | 扩展为浮层矩阵 |
| HIG-VER-06 | 截图 harness 视口不一致 | `capture-visual-matrix.mjs` 为 375/768/1440/1920 | 对齐六档 |
| ~~HIG-VER-07~~ | ~~HIG 正文与访问日期~~ | ✅ **已解决** | 改用 chromium 真实渲染抓取，11 个页面正文 + Apple 变更日志日期均已取得（§3、§3.1） |
| HIG-VER-13 | ~~HIG-AUD-001 / 003 / 020 的浏览器确认~~ | ✅ **部分解决（2026-09-18 第二轮）**：QA 定性完成——根因为新 P0 **HIG-AUD-051**（打开即崩溃，非第一轮猜测的三种可能）；001 的 z 层级被 051 遮蔽、静态确证维持；003/020 仍待运行确认 | 051 修复后做 001 的 `elementFromPoint` 命中验收；`repro-slot-error.mjs` 可直接复用 |
| HIG-VER-14 | 浮层**打开态**截图、动效中间帧、对比度像素测量 | 本轮 48 张截图为 fullPage 静止态，不含打开态 | 用 Playwright 打开每个浮层后截 viewport 图，并加 computed 值/像素采样断言 |
| ~~HIG-VER-16~~ | ~~复核后新增的 6 项 HIG 能力组件（MenuBar / Toolbar / SafeArea / Stack / ActivityView / pull-down 变体）的深度审核~~ | ✅ **已解决** | 见补充报告 `hig-experience-audit-2026-09-18-addendum-phase2.md`（新增 HIG-AUD-038~050） |
| HIG-VER-17 | 二期组件的**运行验证**（MenuBar 键盘模型、Toolbar 折叠与 `disabled` 透传、ActivityView 可访问名称、pull-down 定位与展开动画） | **部分解决（2026-09-18 第二轮）**：HIG-AUD-038（长菜单溢出，40 项合成菜单实测）、039（溢出项丢失 `disabled`/状态属性实测）、040（dialog 无可访问名称实测）、037（破坏性项无确认实测）均已运行确认（证据见补充报告 §5A）；**MenuBar 键盘模型与 pull-down 定位动画仍未验证** | 复用 `scripts/runtime-interaction-audit.mjs` 的真实 CDP 输入范式各加一条 |
| — | ~~`pnpm test` / `typecheck` / `build` / `docs:llm:check` / `test:docs-layout` 的退出码~~ | ✅ **已解决（2026-09-18 第三轮 @ `834f19d8`，一次性采集）**：`typecheck` → **exit 0**；`docs:llm:check` → **exit 0**（corpus 确定性通过）；`build` → **exit 0**；`test:docs-layout` → **exit 1**（116 用例：**113 passed / 1 failed / 2 flaky**，13.3m——1 failed 即 HIG-AUD-053；2 flaky 为 dev server 冷启动性能波动非产品）；`pnpm test` → exit 1（分类见前：9 稳定基线失败 + 2 flaky/环境）。审计环境备注：`test:docs-layout` 首跑被 IDE safe-delete shim 拦截（outputDir 1999 文件 > 500 阈值），预清后正常执行——**环境干扰非产品缺陷**，与 `showcode-typecheck` ETIMEDOUT 同源。原始日志：`.scratch/hig-audit-2026-09-18/cmdlogs/*.log` | — |
| — | 真实 iOS Safari / VoiceOver | 环境不支持 | 真机验证；**不得**用模拟结果替代 |

---

## 9. 验收标准（整改完成后）

1. **可追溯**：每个问题的修复点可映射回本报告编号；在冻结 revision 上复验行号一致。
2. **可复现**：每个 P0/P1 条目附带可执行的最小复现（命令或 Cypress/Playwright 片段）。
3. **可验收**：每个条目带验收场景（本报告已逐条给出），且以**新鲜命令输出 + 退出码**为证。
4. **门禁全绿**：`pnpm run typecheck`、`pnpm test`、`pnpm run build`、`pnpm run docs:llm:check`、`pnpm run test:docs-layout` 全部通过，且**既有基线失败与新引入回归分开记录**。
5. **一致性守护**：为 R1（层级）、R3（动效规格）、R7（i18n 键同构）新增守护测试，防止问题回归。
6. **验证能力补齐**：HIG-VER-01～06 至少落地 200% 缩放、强制颜色、触屏仿真、WebKit 四项。
7. **明确剩余项**：环境不支持的验证（真机 iOS/VoiceOver、HIG 正文）在报告中单列，不冒充已完成。

---

## 10. 审核过程声明

- 本次**只读**：未修改 `src/`、`docs/geist/` 或任何测试；未新增或修改公共 API；未 commit、未 push。
- 本次**新增文件仅限**：`docs/audits/hig-experience-audit-2026-09-18.md`、`docs/audits/hig-coverage-matrix-2026-09-18.md`、`.scratch/hig-audit-2026-09-18/baseline-and-evidence.md`。
- 审核期间出现的实现改动（`edit-menu`、Quick Actions、pull-down、activity-view）由**并发会话**产生，非本次审核所为；本报告将其作为审核对象记录。
- 未把 Apple 原生外观当作唯一正确答案；HIG 原生专属能力已单列为「不适用」而非缺陷。
