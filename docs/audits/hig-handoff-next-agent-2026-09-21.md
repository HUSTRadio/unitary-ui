# Unitary UI · HIG 工作交付书（给下一个 Agent）

- **生成时间**：2026-09-21 ｜ **最近修订**：2026-09-25：`043` 双档位/长操作区已定向修复（§7.19；增补 §5AA），尚未提交；`042` 分享目标滚动渐隐已定向修复（§7.18；增补 §5Z）；`028` 在覆盖式滚动条环境未复现、仍待经典滚动条平台；`030` 命令面板无结果状态子项已定向修复（§7.17；增补 §5Y），整条仍待闭环。此前 2026-09-24 续修 `026` 动态视口浮层高度，定向回归及双主题几何通过（§7.16；增补 §5X），移动地址栏真机待验；`053` 同日定向修复（§7.15），与 EditMenu 横向方案（`036` 原标准偏离、仍待审核）等均已按用户要求提交 `88055b7`。提交哈希和工作区状态一律现场核对。
- **工作区**：`d:/Projects/GitHub/HUSTRadio/unitary-ui`
- **仓库状态（2026-09-25 本次核对）**：分支 `master`，前批次 EditMenu/026/030/042/053 已按用户要求提交为 `88055b7`（33 文件，签名及仓库 hooks 通过），未推送；`043` 是本次提交后新改动，尚未提交。接手时重新执行 `git status --short`、`git log -1`、`git rev-list --count origin/master..HEAD`，不可假定远端或并行会话未变化。
- **工作区快照（2026-09-25）**：原有 31 个已跟踪修改和 2 个永久 E2E 已由用户授权提交到 `88055b7`。此后 `043` 新修改 `activity-view` 组件/单测、默认演示、双语指南、元数据、生成语料及三份审计台账，新增 `tests/e2e/activity-view-detents.spec.ts`；**尚未暂存、提交或推送**。未跟踪 `.tmp-logo/` 仍属于其他工作，禁止纳入；最终以 `git status --short` 现场复核。
- **口径**：只记**可核对的静态事实**与**已验证命令输出**；推断处显式标注；未能核实的条目集中列在 §9。

---

## 0. 先读这一条：上下文预算纪律（强制）

### 0.1 警告

本任务的核心材料是**高密度长文档**，且分散在 4 个互相交叉的台账中。**不使用 subagent、直接在主代理里 `read_file` 这些文件，会在几分钟内吃光上下文**，典型后果依次是：输出被截断 → 早期结论丢失 → 开始凭记忆编造行号与条目 ID → 重复劳动 → 任务中途失败。

这不是假设。本轮会话在同类材料上已实际发生两次：
1. **输出 token 超限中断**一次；
2. 首轮枚举子代理的返回**前两节被截断**（被迫补跑第二个子代理才拿到完整 HIG-AUD 清单）。

纯主代理路径下做同类枚举，几乎必然重复这一失败。

### 0.2 量化证据（2026-09-24 本次复核；会随仓库变化）

| 文件 | 行数 | 说明 |
|---|---|---|
| `docs/audits/hig-experience-audit-2026-09-18.md` | **991** | 主台账，原报告条目及修复记录；新增编号还见增补 |
| `docs/audits/hig-coverage-matrix-2026-09-18.md` | 415 | 覆盖矩阵 + `HIG-VER-*` 验证清单 §E |
| `docs/audits/hig-experience-audit-2026-09-18-addendum-phase2.md` | **651** | 二期新增条目与 §5A–§5V 修复/决策记录 |
| `docs/audits/geist-component-and-responsive-remediation-design.md` | 357 | 既有整改门禁台账 |
| `PLAN-HIG-COMPONENTS.md` | **326** | 计划与验收标准 |
| `docs/audits/motion-duration-audit-2026-09-20.md` | 79 | 动效债务及迁移状态 |
| `docs/audits/tests-typecheck-debt.md` | 31 | 类型债务 |
| **上述审核+计划小计** | **≈ 2 850** | 一次全读仍是数万 token；本交付书本次编辑前 433 行 |
| `docs/geist/src/content/component-guides/*.ts`（22 个） | **≈ 11 325** | 双语指南正文；按目标组件定点读取 |
| `docs/llm/index.json` | 1 753 | 机器可读索引 |
| `docs/llm/pages/` | 218 文件 / **≈ 1 919 KB** | 生成语料；按目标路由定点读取 |

即：审核/计划、指南与生成语料的合计规模远超单次上下文预算；不要全量读取。

### 0.3 强制做法

**必须**用 `code-explorer` 子代理承接所有枚举/普查，并在 prompt 里写明输出契约：

- 派子代理时明确要求「**只回表格 + 结构化列表，不粘原文、不复述章节**」；
- **分域并行**（① HIG-AUD 状态枚举 ② 计划待办枚举 ③ 债务/验证枚举），互不重叠；
- 子代理单次回包控制在 **≤ 60 行**；超了就拆成多次调用；
- 主代理仅在需要「某 1–3 行具体证据」时才 `read_file`，**且始终带 `offset`/`limit`**；
- ❌ 禁止无 `limit` 读取 `hig-experience-audit-2026-09-18.md`；
- ❌ 禁止 `read_file` 任意 `guides-*.ts` 全文（单文件最大 1 295 行）；
- ❌ 禁止全量遍历 `docs/llm/pages/` 或 `docs/llm/index.json`。

**预算红线（自我检查）**：主代理同时持有的审核类原文合计 ≤ **100 行**；一旦发现自己在「回忆」条目 ID 或行号，立即停手，改用子代理或带 `limit` 的定点读取重新取证。

---

## 1. 已完成部分（**不要重做**）

| 事项 | 证据 |
|---|---|
| **HIG-AUD-001**（Quick Actions 遮罩层级压住内容）已修复 | 遮罩 `z-[var(--uni-z-drawer)]`(200) < 内容 `--uni-z-popover`(2001)；`src/components/ui/context-menu.tsx:154-156`、`:212` |
| **HIG-AUD-051**（Quick Actions 打开即崩溃：Portal 多子节点）已修复 | `Portal` 只保留 `ContextMenuPrimitive.Content` 一个子节点（`context-menu.tsx:205-218`）；遮罩改由 `QuickActionsScrim`（`:165-180`）在 `Content` 子树内自行 portal（`:216`） |
| **HIG-AUD-002**（ContextMenu 无键盘打开路径）已修复 | `ContextMenuTrigger` 自定义组件识别 `ContextMenu` 键 / `Shift+F10`，在触发器中心派发合成 `contextmenu`；`tabIndex={tabIndex ?? 0}` + `focus-ring`（`context-menu.tsx:27-61`） |
| **HIG-AUD-003**（BottomSheet 面板级指针捕获吞内部滚动）已修复 | 四个手势 handler 只挂 `<Grabber>`，面板内容区不绑定指针事件（`bottom-sheet.tsx:111-116`、`:201-208`）；由 `1866616`（2026-09-19）完成，本轮复核并转为回归保护 |
| **HIG-AUD-004**（EditMenu 键盘不可达）已修复 | `role="toolbar"` roving tabindex（`edit-menu.tsx:141-143/:377-378/:485`）+ 焦点入首项（`:380-396`）+ 文档级 `Escape`（`:398-409`）+ 焦点归还（`:277-281`）；附带动画期测量缺陷改用 `offsetWidth/offsetHeight` |
| 上述五条的**运行确认** | Playwright 复跑：右键 → `[role="menu"]` ×1、`[data-slot="context-menu-quick-actions-overlay"]` ×1、`pageerror` 0；Escape 关闭后遮罩移除；同页 `div[aria-label="Context menu target"]` 前后恒为 5；002 键盘路径与右键菜单位置逐像素一致、004 键盘选区后焦点入首个可用项 |
| **HIG-AUD-054**（`/components/feedback` @320 根级横向溢出 10px，2026-09-22 门禁新发现，P2）已修复 | 根因：demo 收起态胶囊自然宽 285px，占位层 `[data-feedback-inline]` 作为 flex item 被压缩而内层**绝对定位**胶囊不参与 shrink → 胶囊右缘突破视口。修复：占位层补 `shrink-0`（`src/components/ui/feedback.tsx`）。独立探针实测：双主题 × 6 视口 `scrollWidth - clientWidth = 0`，@320 胶囊 18..303px（左右留白 18/17 对称）。台账落点：增补 §5C、本交付书 §7.1 |
| **HIG-AUD-038**（MenuBar 长菜单无高度约束，P1）已于 2026-09-22 修复并运行确认 | 修复：`menu-bar.tsx` 的 `MenuBarContent` 补 `max-h-[var(--radix-menubar-content-available-height)]`、`MenuBarSubContent` 补 `max-h-[var(--radix-popper-available-height)]`。**实况修正**：Radix menubar **不生成** sub 命名空间变量（dist + 运行时双重实测），SubContent 唯一可用约束源为 popper 原生变量（与 dropdown-menu SubContent 官方做法一致）。新增永久回归 `tests/e2e/menu-bar-content-height.spec.ts`（2 passed，注意顶级触发器 role 为 `menuitem` 非 `button`）；门禁：typecheck + `menu-bar-api` 5/5 + `docs-layout chunk 2/11` 双主题 2/2 全绿；双主题 × 双视口几何核查通过。附带补强 044 证据（320 视口子菜单横向溢出 107px，未修）。台账落点：增补 §5D、矩阵 `:245/:346`、主报告 §1.2 P1 行 |
| **HIG-AUD-006/007**（SidePanel 焦点丢失 + noOverlay 语义，P1，成对）已于 2026-09-22 修复并运行确认 | 修复（`side-panel.tsx`）：006 = `SidePanelContent` 自实现归还（`onOpenAutoFocus` 记录 + `onCloseAutoFocus` preventDefault + `setTimeout` 归还；**不导出 SidePanelTrigger**——与 024 导出决策纠缠）；007 = `Root` 补 `modal={!noOverlay}`（不锁滚动/不 hideOthers/无陷阱；外点仍 onDismiss，消费者决定关闭）。回归：`tests/side-panel-api.test.tsx` 追 4 用例 **12/12 passed**（**jsdom 经验**：滚动锁断言用 `data-scroll-locked` 属性而非 `body.style.overflow`（后者在 jsdom 下两种模式恒空=假阳性）；Radix 外点在 jsdom 不触发，须真实浏览器）。真实浏览器核查（临时探针，已删）：SidePanel 无 docs 路由，经 vite `/@fs/` 动态 import harness（dev root 是 `docs/geist`；`.scratch` 点目录 vite 不服务），双主题一致：Escape 后 `activeElement=触发按钮`、模态 `data-scroll-locked:true`、noOverlay `false` + `elementFromPoint` 命中页面 + 真实外点关闭。门禁：typecheck exit 0。台账落点：增补 §5E、矩阵 `:153/:200/:278/:314-315`、主报告 §4.2 两条目 + §1.2 P1 行 |
| **HIG-AUD-055**（移动导航面板三处视觉缺陷：① 关闭按钮重复 ② 外框贴合边圆角 ③ 内容贴边，P2，2026-09-23 用户实测反馈）已修复并运行确认 | 修复：`hamburger-menu.tsx`（`renderCloseButton = showCloseButton && !belowTopbar`——belowTopbar 下 topbar 触发按钮即关闭控件；toolbar 左内边距随关闭按钮取 `pl-0`/`pl-4`；触发按钮补 `aria-label`，此前实测 `aria-label=null`（`HamburgerIcon` 为 `aria-hidden`）；`menu-nav`/`menu-results` `px-2`→`px-4`）、`expand-panel.tsx`（`side=left` 的 belowTopbar 分支 `rounded-tl-none`→`rounded-none`，原值对 left 本就无效）、`docs-shell.tsx`（不传 `showCloseButton`；工具行 `[&>[data-slot=panel-toolbar]]:md:hidden`）。探针实测（双主题 × 390/900，数值两主题一致）：`panel-close` 计数 0、四角圆角全 0px、`menu-nav` padding-left 16px（标题 x=16、条目块 x=16/宽 259）、900 视口工具行 `display:none` 且 nav 上移。回归：`hamburger-menu-modes` / `docs-shell-nav-tiers`（重写）/ `docs-shell-geometry` → 定向 **6 files / 53 tests 全绿** + `docs-layout --grep "drawer behaviors"` **3 passed (49.8s)**。**全量 `pnpm test` 8 failed 经 `git stash` 基线对照判定为既有失败/flaky**（7 个 `tests/audit/*` + `showcode-typecheck` 单跑通过），与本轮无关。台账落点：增补 §5F、本交付书 §1 |
| **HIG-AUD-040**（ActivityView 面板无可访问名称，P1，根因在 `bottom-sheet`）已于 2026-09-23 修复并运行确认 | 修复：`bottom-sheet.tsx` 新增可选 `"aria-label"` / `"aria-labelledby"` props 透传到 `DialogPrimitive.Content`（对齐 drawer / destructive-action-modal 惯例；皆不传时行为不变）；`activity-view.tsx` 用 `useId()` 生成 `titleId`、标题行带 `id`、BottomSheet 传 `aria-labelledby`（有标题）/ `aria-label`（`title=null` 回退），置于 `{...sheetProps}` 前可被覆盖；`component-api.ts` 登记两个新 props。回归：新增 `tests/activity-view-a11y.test.tsx`（4）+ `bottom-sheet.test.tsx`（+1）+ `component-api-registry.test.ts`（+2）→ 定向 **4 files / 30 tests 全绿**；typecheck exit 0。真实浏览器探针（390×844 × 双主题，跑完即删）：`aria-labelledby` 解析到「共享」、不双重命名、**Radix「requires a DialogTitle」警告消除**、视觉无回归。台账落点：增补 §5G、矩阵 `040` 行、本交付书 §1/§2 |
| **HIG-AUD-013**（触屏命中区 < 44pt，P1，跨 11 个组件）已于 2026-09-23 修复并运行确认 | **方案裁决**：密集行布局不能伪元素外扩（相邻命中区重叠反造误触）→ 采用 `pointer-coarse:` 变体：**触屏下 `min-h-11`/`min-w-11` 抬到 44×44、桌面维持 Geist 原视觉**（依据：HIG 44pt 针对触屏；WCAG 2.5.8 AA 桌面仅需 24×24，36px 菜单项已达标）。13 处声明覆盖 11 文件（行类补高、短标签/图标/胶囊同时补宽——实测 MenuBarTrigger「编辑」仅 35.7px）。**绕开原依赖**：主报告路线 2.5 原依赖 027（Select 移动形态）决策，本方案无需等 027。回归：新增源码契约 `tests/touch-targets-contract.test.ts`（15 断言）+ 永久 e2e `tests/e2e/touch-targets.spec.ts` → **9 passed (33.6s)**（触屏 context 实测 boundingBox ≥44×44：宽视口 6 静态目标 + 菜单项 + MultiSelect 行；窄视口 Toolbar 溢出菜单项）。**e2e 踩坑**：`actionTimeout` 未设则元素缺失时 `boundingBox()` 无限等待（首轮卡满 15m）；Radix zoom 动画中间帧低报（42.5px）；窄屏下 Toolbar 项被折叠不可静态测量。台账落点：增补 §5J、矩阵 `013` 行、本交付书 §1/§2 |
| **HIG-AUD-037**（破坏性项无二次确认，P1，HIG `pull-down-buttons` 依据）已于 2026-09-23 修复并运行确认 | **方案裁决**：不内建确认浮层（HIG 允许 action sheet 或 alert，形态留给消费方；既有 `DestructiveActionModal` 的 `verificationPhrase` 必填属高门控，不适合 Remove App 级确认）→ 组件只给红色语义 + 消费方串接确认 + 示例演示 + JSDoc/指南写下约定。改动：Quick Actions 与 ActivityView 两个示例改为「破坏项 → Modal 确认（取消/确认两路径，取消无副作用）」；`context-menu` / `activity-view` / `split-button` 三处 `destructive` JSDoc 写明契约；guides-04/05/13 双语 accessibility 段与示例描述同步。**永久回归**：新增 `tests/e2e/quick-actions-destructive-confirm.spec.ts`（2 用例：红字断言 `rgb(238,0,0)` → 点击弹确认 → 取消状态不变 → 确认才执行；ActivityView 同）**2 passed (29.6s)**；定向 vitest 3 files 全绿；双主题视觉核查通过。台账落点：增补 §5I、矩阵 `037` 行、本交付书 §1/§2 |
| **HIG-AUD-039 + 050**（Toolbar 折叠丢弃非 ToolbarItem 内容 / 溢出项丢 disabled+active / Fragment 收集失败，P1+P3）已于 2026-09-23 修复并运行确认 | 修复（`toolbar.tsx`）：`CollapsedItem` 增 `disabled`/`active` 并透传（溢出项 `disabled=` + `data-active` + `aria-current` + 常驻高亮）；新增 `isCollapsibleGroup()`——显式 `collapsible` 优先，未指定时仅全 ToolbarItem 组折叠，混合内容组常驻（显式折叠 + 混合内容时 dev 告警）；新增 `flattenChildren()` 递归展平 Fragment/数组（050 随之闭环）。**踩坑实况**：`ToolbarGroup` 函数签名的 `collapsible = true` 默认值必须移除，否则收集器（读原始 props）与组件（读解构值）判定不一致 → 组被折叠且溢出菜单为空。回归：新增 `tests/toolbar-collapse.test.tsx`（6 用例，jsdom + mock ResizeObserver）+ `toolbar-api` 契约补强 → 定向 **3 files / 19 tests 全绿**。真实浏览器探针（320×700 × 双主题，跑完即删）：溢出菜单 6 项中「网格视图」`data-active="true"` + `aria-current="true"`（修复前全丢），其余项正确为 null；截图确认 active 项常驻高亮。台账落点：增补 §5H、矩阵 `039`/`050` 行、本交付书 §1/§2 |
| **HIG-AUD-009 / 011 / 012**（z-index 三态并存 / 退场动画不对称 / 时长 token 覆盖不全，P1，浮层 token 化三件套）已于 2026-09-23 修复并运行确认 | **基线校正**：三条目自 09-18 后代码已漂移——Select / EditMenu / Toast 的退场与时长在既往修复中已 token 化，本轮按实况收敛。**009**：destructive-action-modal 遮罩+卡片 `z-50` 与 command-menu `z-100` → `--uni-z-modal`；ContextMenuContent（**决策**：可在 drawer/modal 内唤起 → popover 带，与同文件 QuickActions 对齐）、multi-select、feedback、relative-time-card、calendar 组合框（`z-[99999999]`）→ popover 带；index.css tip 九位数字面量 → `--uni-z-context-card`；新增 `--uni-z-header: 40`（navbar 回退显式化，保留 `,40` 不破坏锁定测试）+ z token 组补层级序/配对约定注释。**011**：menu / menu-bar（`MENU_BAR_SURFACE`）/ context-menu（含 QuickActions）/ multi-select 退场补 `zoom-out-95`；relative-time-card 补整套退场。**012**：menu 族补 `duration-(--uni-duration-fast)`、destructive-action-modal 补 `--uni-motion-overlay + ease-pop`（对齐 modal）、context-card 补 base 档、bottom-sheet / responsive-drawer `300ms` 与 drawer `500ms` 内联、command-menu `0.3s/0.4s` → 档位 token、`sheet` 官方对齐的 `ease-in-out` 走**内建显式化**（`--ease-in-out` 与 Tailwind v4 内建值严格相等，computed 零变化）。**账本清账**：`motion-duration-allowlist` 12→7（移除 0.3s / 0.4s / 300ms / 500ms）；`bottom-sheet.test.tsx:114` 硬断言随迁移更新（motion 审核 §9 遗留闭环）。**回归**：`layer-tokens` / `duration-tokens` / `ease-tokens` 治理扩展 + 8 个组件测试；定向 **23 files / 184 tests passed**；typecheck exit 0。**双主题探针（跑完即删）**：computed 实测 menu 50/0.15s、modal 卡片与遮罩 300/0.35s/ease-pop、multi-select 2001、command-menu 300、context-menu 2001、hover-card 2001；退场经 `animationstart` 实测 `exit` + `--tw-exit-scale` 生效、command-menu `command-menu-scale-out`。台账落点：增补 §5K、主报告 §4.2 + §1.2、矩阵、motion 审核 §4/§8/§9、本交付书 §1/§2/批次 C/§6 |
| **HIG-AUD-010**（Overlay 背板 5 种写法，P1，一致性）已于 2026-09-23 修复并运行确认 | **方案裁决（与条目原建议不同）**：5 种写法实为**两种有官方出处的遮罩角色**（表面洗色 `#f2f2f2`/`#000`@0.8 = 官方 Modal scrim + 官方 Sheet overlay；暗化 `rgba(0,0,0,.4)` = 官方 Drawer overlay）→ 不做「全迁 backdrop 族」（会破坏 Drawer 官方 parity），改为**两族并行登记**：新增 `--uni-overlay-scrim-color`（alpha 内联，护 `backdrop-filter` 合成）与合成色 `--uni-overlay-backdrop`（`color-mix`，供 Content 是 Overlay 子节点的 modal，避免元素 opacity 把内容一起降透明）；7 处写法收敛、computed 零变化，唯 `destructive-action-modal` 孤例 `bg-black/50`→0.4；`command-menu` 保持 design-gate 冻结的官方 cmdk 写法（单列例外，契约锁定）。验收 grep 为空。回归：新增 `tests/overlay-backdrop-tokens.test.ts`（6 用例）+ 同步 9 个旧断言测试 + `raw-color-allowlist` 清账。**探针（跑完即删，双主题 12 passed）**：旧写法与 token **渲染像素逐字节等价**、族内 computed 一致（`rgba(0,0,0,0.4)`）、modal 遮罩满覆盖 + 卡片精确居中 + 内容未被降透明。台账落点：增补 §5L、主报告 `010`、矩阵 `:229`/`:150-154`/`:318` |
| **HIG-AUD-019**（reduced-motion 覆盖不完整，P1，WCAG 2.3.3）已于 2026-09-23 修复并运行确认 | **根因（本轮新发现）**：`data-[state=open]:animate-in` 的 specificity 0,2,0 **压过**单类名 `motion-reduce:animate-none`（0,1,0）→ 22 个 tw-animate 浮层的组件级 reduce 类**一直是空操作**，实际只有全局 `0.01ms !important` 兜底（原审核「28 文件包含 motion-reduce」属**虚假覆盖**）。修复：animation kill switch 统一 **`motion-reduce:animate-none!`**（末尾 important；`skeleton` 的 v3 前缀写法归一）；过渡侧实测 plain `motion-reduce:transition-none` 已生效、无需 important；点名缺口 `theme-switcher`/`combobox` 补齐，**`drawer` 面板缺口经复核不成立**（行号漂移）。回归：永久 e2e `tests/e2e/reduced-motion.spec.ts`（**8 passed**：reduce 下 modal/quick-actions/bottom-sheet/command-menu 的 computed `animation-name: none` + 功能正常）+ `tests/reduced-motion-coverage.test.ts`（5 用例，含免动画清单与全局兜底冻结）。**环境教训**：`test.use({reducedMotion})` 在本项目配置下不生效，须用 `page.emulateMedia()`。台账落点：增补 §5L、主报告 `019`、矩阵 `:232`/`:327`、motion 审核 §5/§8 |
| **HIG-AUD-008**（i18n key 缺失 3 处，P1）已于 2026-09-23 修复并运行确认 | **补齐 3 key**（en/zh 双侧行序镜像）：`"Close menu"`→`关闭菜单`（`hamburger-menu.tsx:234,278`）、`"Ctrl K"`→两侧同值（`:324` 的 `<kbd>`，快捷键不翻译）、`"Resize height"`→`调整高度`（`grabber.tsx:45`，**key 由中文改英文写法**，修掉英文站显示中文）。**根因修复**：`framework-messages.ts` 增 `FrameworkMessageKey`，`i18n.tsx` 把 locale 消息表注解为 `Record<FrameworkMessageKey, string>` → 缺 key 变**编译错误**（不再靠人工同步）。回归：`component-i18n-source` 新增键集双向相等 + 钉住 3 key + **全 `src` 扫描 `t("…")` 字面量 key 存在性**（补上让 3 key 漏过的缺口；含条件分支/模板前缀族 + 收集器健康度断言）；`framework-i18n` 增 grabber 双语言断言；`grabber.test.tsx:31` 旧中文断言更新。**变异测试证明守护有效**（删 zh 一个 key → tsc TS2322 + 键集 + 调用点扫描三道同时报警）。**探针 4 passed**：bottom-sheet grabber `调整高度`/`Resize height`、导航面板 `菜单→关闭菜单`/`Menu→Close menu` 且无 key 原文回显。全 `src` 扫描确认这三处即全部缺失项。台账落点：增补 §5M、主报告 `008`、矩阵 `:137`/`:196`/`:316` |
| **HIG-AUD-017**（无路由变化即关闭浮层机制，P1，机制性）已于 2026-09-23 修复并运行确认 | **组件层**：`hamburger-menu.tsx:379-395` 导航列表项此前只调 `onNavigate` **不关面板**（与同文件搜索结果项 `:466-469` 及 prop 注释矛盾、且无测试覆盖）→ 统一「激活即关闭」，保留修饰键/中键（新标签页）语义，`onNavigate` 时机不变。**库层**：新增 `src/lib/navigation.ts` 的 `useDismissOnNavigate`（`hashchange` + `popstate`，不耦合路由库）并从包入口导出；库内浮层默认不自动关闭，由消费方接入。**文档消费方**：`docs-shell`（面板）+ `App.tsx`（命令面板）各接一行 → 覆盖前进/后退与程序化导航。回归：`hamburger-menu-groups` 增 2 用例、新增 `navigation-dismiss`（4 用例）、新增永久 e2e `tests/e2e/overlay-route-dismiss.spec.ts`（**2 passed**）。**变异测试**：停用消费方接入 → 「后退关闭」用例失败而「点击条目」仍过，证明两条路径各自独立生效。**未验证**：`context-menu`/`menu` 的 `href` 条目依赖 Radix Item 默认关闭（未实测），见 §9。台账落点：增补 §5N、主报告 `017`、矩阵 `:137` |
| **HIG-AUD-018**（受控能力缺口，P1）已于 2026-09-23 修复并运行确认（4/4 闭环） | **Combobox `open`/`onOpenChange`**（4 处写入点收敛到统一 setter，受控时只上报）；**BottomSheet `detent`**（复用 `open` 双模 + 越界钳位）；**SplitButton `menuButtonDisabled`**（纯透传）；**Toasts 受控 store 注入**（模块级单例收进 `createToastStore()` 闭包，`Toasts store?` + `useToasts(store?)` 绑定同一实例，**默认全局 store 行为不变**）。回归：新增 `combobox-controlled`(2)、`split-button-controlled`(2)、`toasts-controlled`(4)，`bottom-sheet` 增 detent 用例；**浏览器回归探针** 2 轮共 4 passed（Radix Popover 受控语义、非受控切档、菜单可开、docs toast 弹出/关闭）；文档注册 `component-api.ts` 四处补行 + 注册表门禁（含 toast `toEqual` 列表）全绿。台账落点：增补 §5O、主报告 `018`、矩阵 `:326` |
| **HIG-AUD-015**（Tooltip 强注 `tabIndex=0`，P1）已于 2026-09-23 修复并运行确认 | 触发元素构造改为**只透传**调用方显式声明的 `tabIndex`（去掉 `?? 0`），非元素兜底 `<span>` 去掉强注的 `tabIndex={0}`；注释写明「不制造焦点」契约。**消费面 22 处复核**：内部 `tabs`/`progress`/`description` 本就显式声明、`text-with-copy-button` 包裹真按钮 → 键盘可达性无回归。回归：`tooltip-focus` 用例①重写（**原用例把缺陷固化成契约**）+ 新增可聚焦子元素用例 → 定向 4 files/16 tests；浏览器探针 **1 passed**（span 无 tabindex / button tabIndex 0 / 聚焦仍开 `[role="tooltip"]`）。台账落点：增补 §5P、主报告 `015`、矩阵 `:88`/`:323` |
| **HIG-AUD-016**（MultiSelect 热区 / Tab 锁 / 无名对话框，P1）已于 2026-09-23 修复并运行确认 | **Tab 循环**：移除我们的 `preventDefault` 后**实测仍走不出** → 根因是 **Radix Popover `FocusScope` 硬编码 `loop: true`**（`react-popover/dist/index.mjs:222-227`），改为面板边缘显式接管（边缘 Tab → `Popover.Close` + 焦点交还触发元素）。**控件可达**：`Checkbox`/行操作按钮去掉 `tabIndex={-1}`（各带 role + `aria-label`），命中区 div 降级为指针冗余放大。**对话框命名**：缺省 `t("Select options")`（新增 en/zh key）+ 可覆盖且 `label`/`labelledby` 互斥。回归：新增 `multi-select-keyboard`（4 用例）+ **永久 e2e**（1 passed：仅键盘 打开→Tab 遍历→Tab 离开）；`multi-select-api` 复跑通过。**教训**：表象修复能让单测通过但用户行为不变——必须用浏览器行为断言收口。台账落点：增补 §5Q、主报告 `016`、矩阵 `:79`/`:324` |
| **HIG-AUD-014**（Toast 隐藏项在 Tab 序列 + 计时不可暂停，P1，WCAG 2.2.1/2.4.3）已于 2026-09-23 修复并运行确认 | **隐藏项**：新增与 CSS `nth-last-[n+4]` **对齐**的 JS 判定 `hidden = d >= MAX_STACK`，命中项加 `aria-hidden` + **`inert`**（此前只改视觉，Tab 会落到不可见 toast 的按钮）。**计时可暂停**：`paused = hover || focusWithin`，暂停时结算**剩余量**（`deadline`/`remaining`）并停表，恢复时按剩余量续跑；`<ol>` 加 `onFocusCapture`/`onBlurCapture`（`relatedTarget` 判断真离开）。回归：新增 `toast-timer`（3 用例，含「聚焦 10s 不被关闭」）；浏览器探针 exit 0（6 条时**恰好 2 条** `inert`，聚焦后 4.5s 仍存活）。台账落点：增补 §5R、主报告 `014`、矩阵 `:87`/`:322` |
| **HIG-AUD-020**（EditMenu 触屏：合成 `mousedown` 把刚浮现的胶囊立刻收掉 + iOS 原生菜单冲突，P1）已于 2026-09-24 修复并运行确认 | 修复（`edit-menu.tsx`）：① **合成事件过滤**（`sourceCapabilities.firesTouchEvents === true` 或 `touchend` 后 1s 窗口，窗口只吞一次）；② 容器 / 胶囊补 `[-webkit-touch-callout:none]` + 容器 `onContextMenu` preventDefault（消费方自行处理即让位）+ 胶囊 `touch-manipulation`（容器**不**加 `touch-action`）。**审计建议的 `isTrusted` 过滤不可用**：真实触屏实测合成 mousedown `isTrusted === true`。**矩阵 `:284`「Radix 设了 `-webkit-touch-callout: none`」经 `node_modules` 全量检索证伪（0 命中）并已订正**。回归：`edit-menu-api` +2 用例、**变异测试**（停用过滤 → 单测 2 条 + e2e 同时报警）；永久 e2e `tests/e2e/edit-menu.spec.ts` 真实触屏 tap 后胶囊状态迁移**不出现** `exiting`/`absent`。真实序列实测 `pointerdown→touchstart→pointerup→touchend→mousedown(firesTouch=true)→mouseup→click`。**未验证**：真机 iOS 原生菜单（`-webkit-touch-callout` 属 WebKit-only，Blink/jsdom 均丢弃该声明）→ §9.17。台账落点：增补 §5S、主报告 `020`、矩阵 `:141`/`:241`/`:284`/`:328`/`:377` |
| **HIG-AUD-021**（EditMenu 垂直无下边界 clamp / 选区文本被 `trim()` / 复制失败仍 `onCut`，P1，3 项）已于 2026-09-24 修复并运行确认 | 修复（`edit-menu.tsx`）：① `bottom` 分支 `max(margin, min(rect.bottom + offset, innerHeight - height - margin))`；② `SelectionInfo` 增 `rawText`（`text` 仍为已 trim，**语义不变**），剪贴板写**选区原文**，`onCut`/`onCopy`/`onLookUp`/`onShare` 与 `EditMenuAction.onSelect` **追加第二参数 `rawText`**；③ 新增 `onError`，写入失败**不**触发 `onCut`/`onCopy`（可见反馈交消费方，示例已接）。回归：`edit-menu-api` 9 → **18** 用例；永久 e2e **5 passed (32.4s)**（clamp 双主题、剪切按原文删除、剪贴板失败保留文本 + 可见反馈）。**变异测试**：去掉 clamp → 实测底边 **165.66 > 视口 152.5**；退回已 trim 文本 → 实测残留**双空格**。门禁：typecheck exit 0 / lint 0 errors / 定向 vitest **10 files·97 tests** / 全量 `pnpm test` = 文档基线（7 failed | 233 passed）。台账落点：增补 §5S、主报告 `021`、矩阵 `:141`/`:241`/`:265`/`:329` |
| **HIG-AUD-022**（Grabber `role="slider"` 无键盘契约，P1）已于 2026-09-24 修复并运行确认 | `Grabber` 新增垂直 orientation + Arrow 四键/Home/End，边界钳制、不重复上报；BottomSheet 复用既有 `setDetent`，保持 `018` 的受控/非受控契约；ResponsiveDrawer 同步接线并钳制动态 detents。回归 **3 files / 42 tests**；变异：反转键方向 **8 failed**、断开父接线 **2 failed**；Chromium 双主题 + 两组件探针 **3 passed (23.5s)**，命中区 ≥44px。台账落点：增补 §5T、主报告 `022`、矩阵键盘行 / ID 行、本交付书 §7.12 |
| **HIG-AUD-053**（命令面板搜索相关性，P2）已于 2026-09-24 定向修复 | 搜索值去掉每项的分组名，只保留中英文条目名和别名；修复前浏览器 4 passed / 1 failed（`toast` 落到「堆叠」），修复后 5 passed（默认选中「轻提示」）；单测 3 passed、typecheck/build exit 0、双主题视觉几何 2 passed；全量 `test:docs-layout` 未重跑。增补 §5W / 本交付书 §7.15；已提交 `88055b7` |
| **HIG-AUD-026**（三种浮层移动动态视口高度，P2）已于 2026-09-24 定向修复 | CommandMenu/Modal/DestructiveActionModal 保留 `vh` 回退，优先使用 `dvh`；Vitest 3 文件 / 19 passed、Chromium 双主题双高度 E2E 6 passed、临时视觉几何 2 passed（已删脚本），typecheck/build exit 0；移动端真实地址栏伸缩待设备验证。增补 §5X / 本交付书 §7.16；已提交 `88055b7` |
| **HIG-AUD-042**（ActivityView 八目标横滚渐隐，P2）已于 2026-09-25 定向修复 | 左右渐隐依滚动和容器尺寸变化切换，不阻断按钮事件；双主题 E2E 4 passed、临时视觉 2 passed、相关单测 11 passed、typecheck/build exit 0；双语指南、元数据和构建语料同步。增补 §5Z / 本交付书 §7.18；已提交 `88055b7` |
| **HIG-AUD-043**（ActivityView 双档与长操作区，P2）已于 2026-09-25 定向修复 | 默认 60%/90% 双档、操作组不可收缩；八目标八操作下低档可滚动、高档可完整浏览。双主题 E2E 4 passed、临时视觉 2 passed、相关单测 11 passed；typecheck/build/docs:llm:check/README 截图 check exit 0；真实触屏拖拽待设备验收。增补 §5AA / 本交付书 §7.19；**尚未提交** |
| 三份审核文档已同步标注 | 主报告、增补、矩阵均已改；原「修复前证据」段落**保留作对照**，仅加注「行号取自修复前版本」 |
| 临时复现脚本已删除（本次复核） | `tests/e2e/` 现有 **14 个永久 `.spec.ts`**，包含新增 `edit-menu.spec.ts`；本轮 `tmp-edit-toolbar-visual.spec.ts` 及历史 `tmp-triage-probe.spec.ts` 均已删除。`.scratch/` 截图/日志为本机临时产物，不纳入版本库 |
| 历史轮次已验证命令（**截至 §7.2~§7.9，不代表本轮全量门禁**） | `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**；定向 `vitest run` 各轮全绿（18·112 / 13·80 / 5·55 / 5·55 / 受控契约各批 / 4·16 / 4 / 3·*，逐轮见 §7.3~§7.9）；`typecheck:tests` 命中项均为存量（见批次 F）。**注意**：2026-09-23 某轮全量 `pnpm test` **exit 1**（`9 failed | 231 passed`），09-24 在 023/024 批次另有更晚的 **7 failed | 233 passed**（见 §7.13）；本轮横向方案未重跑全量，2026-09-21 的历史记录为 228 files / 1424 tests passed |

---

## 2. 剩余工作量总账

| 口径 | 总数 | 已完成 | **剩余** |
|---|---|---|---|
| **HIG-AUD 编号（冻结基数并入 054；不含后续反馈 055）** | **54** | **34 已定向修复**（P0 001–004、051；P1 见下；P2 026/042/043/053/054；P3 050）；另 **2 关闭**（`005` 撤回、`049` 判非缺陷） | **18 待闭环**（含 `036` 产品决策偏离、待审核） |
| ├ P0 | 6（含 `005` 撤回） | 5（001–004、051）；另撤回 1 | **0** |
| ├ P1 | 24 | 23（006/007、008、009/011/012、010、013、014、015、016、017、018、019、**020/021/022/023/024**、037、038、039、040，2026-09-22~24） | **1**（`036` 待审核） |
| ├ P2 | 13（新增 054） | 5（026/042/043/053/054；026 移动地址栏及 043 触屏手势真机待验） | **8** |
| └ P3 | 11 | 1（050，随 039 成对修复）；另非缺陷关闭 1（049） | **9** |
| **PLAN-HIG-COMPONENTS 交付项** | **90** | 67 完成 / 18 部分 / 5 缺失 | **23** |
| **债务台账（类型 9 + 动效 8 + 测试 1）** | **18**（可执行 13） | 4（动效账本迁移 0.3s/0.4s/300ms/500ms，2026-09-23） | **14** |
| **`HIG-VER-*` 验证项** | 见 §9（未逐条计数，不臆造） | 1 | 余量未闭环 |

计划完成度三口径（子代理统计，附证据链）：**产物存在性 ≈ 93%**、**加权 ≈ 84%**、**逐项严格判定 ≈ 74%**。三者必须与「验证缺口」一起读，否则会高估。

> **口径已对账（2026-09-25，按 ID 级重算）**：P0 6 = 已修 5 + 撤回 `005` 1；P1 24 = 已修 23 + 待审核 `036` 1；P2 13 = 已定向修复 5（`026`/`042`/`043`/`053`/`054`）+ 待闭环 8；P3 11 = 已修 1 + 判非缺陷 `049` 1 + 待闭环 9。合计 **已定向修复 34 + 关闭 2 + 待闭环 18 = 54**。`026` 的真机地址栏验收仍单列待验，不能算已经设备验证。`055` 是 09-23 用户反馈的移动导航视觉修复（§1 / 增补 §5F），未并入这一冻结的 54 条主报告 ∪ 增补统计，不能据此静默把分母改为 55。`036` 按原竖向菜单验收条件仍未修复，现为产品决定的横向偏离、**待审核，相关实现已提交 `88055b7`**（§7.14），其余历史提交与依据见下。历史注记：`005` 改记为 `052`（P2）、`049` 关闭，均已计入上述口径；`010`/`019` 于 2026-09-23 修复（增补 §5L）、`008` 同日修复（增补 §5M）、`017` 同日修复（增补 §5N，已提交 `b7747ff`）、`018` 同日修复 4/4（增补 §5O，已提交 `0c802d5`）、`015` 同日修复（增补 §5P，已提交 `b3036d2`）、`016` 同日修复（增补 §5Q，已提交 `c225cbc`）、`014` 同日修复（增补 §5R，已提交 `d26e3c7`）、`020`/`021` 于 2026-09-24 修复并提交（实现 `a2678f1`；增补 §5S，见 §7.11）；`022` 同日修复并提交（实现 `2ecf19f`，台账 `189128b`；增补 §5T / §7.12）；`023`/`024` 同日修复并提交（实现 `89b6359`，语料 `e369610`；增补 §5U / §7.13，台账提交 `804e81f`）。**§5L~§5Z 已入库（§5V~§5Z 提交 `88055b7`）；§5AA 的 043 修复记录仍未提交。**

> **门禁新发现（2026-09-22 已闭环）**：`test:docs-layout` 首轮 `aggregate` 报出 3 条断言失败（详见 §7.1）→ 分诊结论：**1 条真实产品缺陷**（`/components/feedback` @320 横向溢出，记为 **HIG-AUD-054**，已修复并计入上表）+ **2 条断言缺陷**（`/colors` 前缀无关比较、`/grid` 容器断点预期，均已修）。

---

## 3. 剩余清单（按批次）

### 批次 A：开放 P0（3 条）— ✅ 已于 2026-09-21 全部关闭

| ID | 问题 | 结论（修复 + 证据） |
|---|---|---|
| HIG-AUD-002 | ContextMenu 无键盘打开路径 | ✅ 已修复 + 运行确认：`context-menu.tsx:27-61`；主报告 `hig-experience-audit-2026-09-18.md:212` |
| HIG-AUD-003 | BottomSheet 吞掉内部滚动 | ✅ 已修复 + 运行确认：`bottom-sheet.tsx:111-116`、`:201-208`；由 `1866616` 修复，主报告 `:230` |
| HIG-AUD-004 | EditMenu 键盘不可达 | ✅ 已修复 + 运行确认：`edit-menu.tsx:141-143/:377-409`；主报告 `:249` |

> HIG-AUD-005（原始色治理）P0 判定**已撤回**，实质残留改记为 HIG-AUD-052（P2）。矩阵 `:312` 已同步订正为「P0 判定已撤回」，**跨文档口径冲突已消除**。

### 批次 B：计划交付缺口（5 项，✅ 已全部闭环）

| 编号 | 缺口 | 依据 | 收口状态（2026-09-22 核对） |
|---|---|---|---|
| PLAN §六.6 / E11 / M4 | `patterns/app-shell` **组合演示未落**（`app-shell-demo.tsx` 未导入 MenuBar/Toolbar） | `PLAN-HIG-COMPONENTS.md:86`、`:283`、`:312` | ✅ 已闭环：`522e53f` 落地 MenuBar + Toolbar 组合演示并重生成语料 |
| PLAN §六 readme:截图 | `readme:screenshots`(+`:check`) **无执行证据**，与 HIG 新页无绑定 | `PLAN-HIG-COMPONENTS.md:92` | ✅ 已闭环：`99f2a3b` 重生成 PNG；`docs:readme:screenshots:check` 5 页 × 2 主题通过 |
| PLAN §十一.3 / G3 | Quick Actions **触屏长按仿真验证未做** | `PLAN-HIG-COMPONENTS.md:321` | ✅ 已闭环：新增永久回归 `tests/e2e/context-menu-quick-actions-touch.spec.ts`（CDP `Input.dispatchTouchEvent` 真实 touch），`2 passed (12.6s)`；断言长按 900ms 后遮罩可见且 `backdrop-filter: blur(8px)`、菜单计算宽 `224px`，短按 150ms（阈值 700ms 以下）不打开。**注意**：Radix `ContextMenuTrigger` 的触屏长按是自实现 `setTimeout(handleOpen, 700)`，**不派发原生 `contextmenu`** |
| PLAN §十一.4 / G4 | **backdrop-blur 材质 token 未新增**，仍是字面量 `bg-black/40 backdrop-blur-sm` | `PLAN-HIG-COMPONENTS.md:322`；`context-menu.tsx:154-156` | ✅ 已闭环：新增 `--uni-overlay-backdrop-blur: 8px`（`src/styles/index.css` 遮罩 token 组），`context-menu.tsx` 与 `destructive-action-modal.tsx` 改走 `backdrop-blur-(--uni-overlay-backdrop-blur)`；真实浏览器双主题实测计算值 `blur(8px)`、遮罩色仍 40% / 50% |
| PLAN M1–M4 门禁 | `pnpm test` exit 1（9 基线失败）、`test:docs-layout` exit 1、lint 无证据 | `…-addendum-phase2.md:225-227` | ✅ **汇总口径已闭环（2026-09-22 04:21，独占运行）**：`typecheck`、`build`、`lint`（0 error）、`pnpm test`（228 files / 1424 tests）均 exit 0；**`test:docs-layout` 可信汇总行已取得** → `2 failed / 1 flaky / 119 passed (42.8m)`，exit 1。failed = `command-search.spec.ts:49`（HIG-AUD-053，已知基线）+ `docs-layout.spec.ts:619` `static routes (light)`（环境卡死，见 §4）；flaky = `docs-layout.spec.ts:642` `aggregate layout audit gate`（首轮 3 条**真实**断言失败，重试被清空掩盖，见 §7.1） |

### 批次 C：P1（已修 23 条；`036` 产品决策偏离原验收，待审核，见 §7.14）

~~`020` EditMenu 触屏缺陷~~ ｜ ~~`021` EditMenu 定位/语义边界~~ ｜ ~~`022` Grabber slider 无键盘~~ ｜ ~~`023` 导出组件文档 owner 缺口~~ ｜ ~~`024` SidePanel 未导出~~ ｜ `036` EditMenu 指针设备形态（原审计未通过；产品决定横向）

> `009`/`011`/`012` 的受影响清单已扩充到 MenuBar / Toolbar / pull-down（**已于 2026-09-23 修复，见 §1**）；`013`/`018`/`025` 的扩充清单改动时注意连带面。
>
> `010`/`019` **已于 2026-09-23 修复并运行确认**（§1、增补 §5L）。两条目都带**口径教训**：`010` 的「5 种写法」实为两种官方遮罩角色（不可简单合并）；`019` 的「28 个文件包含 motion-reduce」实为虚假覆盖（specificity 压过，文件数达标 ≠ 生效）。改动其连带面（`--uni-overlay-*` 族、`motion-reduce:` 写法）前先读增补 §5L。

> **枚举已完成（2026-09-24 更新）**：未通过原验收的 P1 = 1 条（`036`，已明确产品横向偏好、待审核记录偏离；§7.14，尚未提交）。口径提示：主报告 §1.2 的总数是原报告口径，以本交付书按 ID 并集重算为准。建议先复核 `036` 的明确文件集合（README 截图检查已通过，见 §7.14；提交须用户明确要求），再排查批次 D 的 **`053`**（命令面板搜索相关性门禁红点）；不要把 `.tmp-logo/` 等无关文件纳入提交。**方法教训（各轮积累，完整记录见 §10）**：① 覆盖率/一致性结论必须落到运行时断言；② 缺 key / 缺声明用静态扫描 + 编译期约束并做变异测试；③ 机制类条目拆组件层与消费方两层验证；④ 受控改造必须双断言；⑤ ARIA 复合控件不仅要补键映射，还要验证父组件接线、动态边界与真实浏览器默认滚动。

### 批次 D：P2（剩余 7 条；`053`/`026`/`042`/`043`/`044` 已定向修复，§7.15–§7.19、增补 §3.2）

`025` 浮层 loading/empty 缺失 ｜ ~~`026` 用 vh 而非 dvh~~（✅ 定向修复，移动地址栏真机待验，§7.16）｜ `027` Select 缺移动贴底形态 ｜ `028` 滚动条宽度补偿缺失（覆盖式滚动条无抖动，经典环境待验，§7.17）｜ `029` 移动断点零散/无 vv ｜ `030` 屏幕阅读器播报 3 处（命令面板子项已修，toast/edit-menu + AT 待验，§7.17）｜ `041` 5 个测试为**源码字符串契约**（非行为验收） ｜ ~~`042` 目标横滚无边缘提示~~（✅ 2026-09-25 定向修复，§7.18）｜ ~~`043` ActivityView 固定单档~~（✅ 2026-09-25 双档位已定向修复，真机手势待验，§7.19）｜ ~~`044` MenuBar 层级与溢出提示~~（✅ 2026-09-25 已定向修复，增补 §3.2） ｜ `052` legacy 账本只增不减 ｜ ~~`053` 命令面板搜索相关性回归~~（✅ 2026-09-24 定向修复，§7.15；全量 `test:docs-layout` 未重跑）

> `054`（`/components/feedback` @320 根级横向溢出）为 2026-09-22 门禁新发现，**已当场修复并复核**（§7.1、增补 §5C），不计入剩余。

### 批次 E：P3（剩余 9 条；`050` 已随 `039` 修复、`049` 判非缺陷关闭）

`031` 破坏色非语义 token ｜ `032` DotsMenu/Menu 表面不一致 ｜ `033` Combobox 字面量阴影 ｜ `034` EditMenu 无退场闪现 ｜ `035` 模糊用途边界未文档化 ｜ `045` SafeArea style 可覆盖 ｜ `046` SafeArea/Stack 双档表 ｜ `047` MenuBar 快捷键无效承诺 ｜ `048` pull-down 允许上方展开 ｜ `049` 图标瓦片 48px vs 70px（**已判为非缺陷**，✅ 已于 2026-09-22 关闭：设计决策注释已落 `activity-view.tsx` 瓦片处，增补 §3.3 已回填） ｜ ~~`050` Fragment 包裹收集失败~~（**✅ 已随 `039` 修复，2026-09-23，增补 §5H**）

### 批次 F：债务台账（18 条，可执行 13 条）

- **类型债务**（`docs/audits/tests-typecheck-debt.md`）：`tests/` 存量约 150 条类型错误；收紧批次 1（清零 TS7017）/ 批次 2（按文件清零 audit 系列）/ 批次 3（开 strict 并接入 `ci.yml`）**均未执行**（`:23-25`）。
- **动效债务**（`docs/audits/motion-duration-audit-2026-09-20.md`）：**2026-09-23 更新**——账本 12→7（~~8 条待迁移~~ → **4 条待迁移**：`0.15s`/`0.2s`/`150ms`/`250ms`；另有 3 条刻意保留：`0s`/`0.01ms`/`2s`）；~~浮层同族漂移~~ **已收敛**（bottom-sheet/responsive-drawer 300ms→overlay 档、drawer 500ms→expansive 同值、modal 系对齐）；~~退场动画不对称~~ **已修**（并案 HIG-AUD-011 ✅）；~~`tests/bottom-sheet.test.tsx:114` 硬断言~~ **已随迁移更新**；HIG-AUD-019 的 reduced-motion 行为修复及 e2e **已完成**（§1 / §7.3），若仍有更广的组件级免动画清单债务，须明确新增范围与证据，不得再将 019 标为未修。

### 批次 G：验证环境遗留（语料暂缓已解除）

| 事项 | 当前状态 |
|---|---|
| LLM 语料生成与核查 | **已恢复并完成**：此前 `ctxmenu-quick-actions` 导致的 3 处漂移属于历史状态；023/024 与本轮 EditMenu 横向文档均已从真实文档构建运行 `pnpm run docs:llm:generate`，`pnpm run docs:llm:check` 通过、当前无漂移（§7.13–§7.14）。后续修改指南须重新生成并核查，不手改 `docs/llm/pages/`。 |
| 真机 / AT / 非 Chromium 验证 | 本环境不具备，维持「未验证·环境不支持」，不能用 Chromium 触屏模拟代替 iOS 真机/AT。 |

---

## 4. 环境阻塞与已知干扰（先读，否则会浪费大量时间）

| 干扰 | 现象 | 应对 |
|---|---|---|
| **IDE safe-delete shim（历史环境干扰）** | 曾因单次删除 >500 文件被拦：`Safe delete needs confirmation for this bulk deletion (629 item(s), threshold 500)`；**不是当前固定阻塞**，023/024 与本轮 EditMenu 文档均已成功生成语料并通过 check（§7.13–§7.14） | 正常运行仓库脚本；若再次遇到同类审批阻断，停止并请求人工确认，勿绕过拒绝或断言生成必然失败，也无需预先手删语料目录。 |
| 同类历史案例 | 旧会话删除 `.scratch/playwright-results` 时也曾被审批拦截（主报告 `:866`、增补 `:228`、矩阵 `:375`，属环境干扰而非产品缺陷） | 不要主动清理 `.scratch`；若重现阻断，核对审批提示并请求人工确认，勿绕过拒绝。 |
| **Vitest 偶被误判为 watch 命令** | 早期有 `isWatchCommand: true`、输出为空/超时；最近定向 `pnpm exec vitest run … --maxWorkers=1 --reporter=dot` 已成功结束并拿到汇总（§7.14） | 先用有界定向命令并核对退出码；若输出被误判再重定向到新日志名读取汇总，避免重复启动长时间后台进程。 |
| **`npx` 被 devEngines 拒绝（2026-09-23 实测）** | `npx playwright …` 直接报 `npm error EBADDEVENGINES … Invalid name "pnpm" does not match "npm"`，命令不执行 | 一律用 **`pnpm exec`**：`pnpm exec playwright test -c playwright.config.ts <spec>`、`pnpm exec vitest run …` |
| **watch 误判后进程残留并锁住重定向日志（2026-09-23 实测）** | vitest/playwright 被 harness 判为 watch 后进程仍在后台运行，持有 `> log 2>&1` 的文件句柄；紧接的重试报 `The process cannot access the file because it is being used by another process` | 换新日志名，或先用 `findstr` 查旧日志是否已出现汇总行（后台进程自然结束后可读）；勿对同一日志名立即重跑 |
| **共享的外置 dev server 会中途掉线（2026-09-22 实测）** | `PW_REUSE_SERVER=1` 复用外部 dev server 跑到 `component routes chunk 4/11` 时该 server 消失，其后 71 个用例全部 `page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:5211/…`，最后 `51 passed (19.3m)`——**这不是有效结论**，只是级联假失败 | 门禁运行**不要**依赖外置 server，用 Playwright 默认的独占启动；`PW_REUSE_SERVER=1` 只用于本地人工视觉核查 |
| **同一 5211 被多份 Playwright 运行共享（2026-09-22 实测）** | 环境里另有一份 `playwright test -c playwright.config.ts`（`cli.js test -c playwright.config.ts`，02:47:50 起）持有 dev server 并在跑；两份 `full registry matrix` 同时打同一 server 后，`docs-layout.spec.ts:619` 的 `static routes (light)` 直接撞满用例上限：`x 49 … (15.2m)`，门禁无法产出可信汇总 | 跑前确认独占：`Get-NetTCPConnection -LocalPort 5211 -State Listen` 取 `OwningProcess`，再 `Get-CimInstance Win32_Process -Filter "ProcessId=<pid>"` 看命令是否 `vite … dev docs/geist --port 5211`；同时清点 `cli.js test -c playwright.config.ts` 进程数。确认是遗留/多余的运行后**需人工确认**再 `taskkill /T /F /PID <pid>`（本会话的 `taskkill` 请求因审批弹窗不可见而超时，未能执行） |
| **同一 page 连续整页导航约 18–19 条后渲染进程失去响应（2026-09-22 已修复）** | 旧 `static routes` 在**同一个 page** 上连续整页导航逐条路由：第 19 条（`/charts`，`?docs-layout-navigation=19`）起 `page.goto` 永不返回 → 用例撞满 15 分钟上限（**两次独立复现：04:21 门禁、13:11 单独运行**）。诊断证据：JSONL 停在 **108 组合 = 18 条路由 × 6 视口**不再增长且 `page.evaluate` 不返回；卡住时该 page 有 ≈35 个模块请求 pending >30s，而同一时刻 `Invoke-WebRequest` 请求相同 URL 全部 `HTTP 200`（0.01–0.19s）、server CPU 0 → 卡点在**浏览器/渲染进程侧**，不是 docs 应用或 dev server 的 bug。旁证：`static routes (dark)` 单跑通过（1.3m），全部 component chunk（fresh page 形态）长期稳定绿 | ✅ **已修复（2026-09-22）**：静态路由改为与 component routes 相同的**分块**（`chunk(STATIC_ROUTES, 8)` → 3 个用例，各自全新 page/context，单页导航 ≤8 条），并把无限等待改为**有界**（`loadDocsRoute`：`goto` 60s → 复位 `about:blank` 15s → 重试一次；`settle` 的 `document.fonts.ready` 加 15s 上限）。**实测 `static routes chunk 1–3` 双主题 `6 passed (3.1m)`**（light 34.5s / 36.6s / 16.5s，dark 33.3s / 34.1s / 19.3s）——light 侧此前**从未跑通过**。断言与采集逻辑未改，只改等待与编排方式 |
| Playwright / 子进程超时 | `tests/llm-task-runner.test.ts`（超时）、`tests/showcode-typecheck.test.ts`（safe-delete ETIMEDOUT）为已知 flaky | 单独重跑确认，不要当成回归 |
| **仓库被并发会话写入** | 矩阵 `:6` 记录审核期间仓库被并发写入（`b68d3f0 → … → 5d173ca`） | 每次开工先 `git status` 重新确认基线，不要沿用本交付书的状态 |

---

## 5. 工作区状态：**不得误提交**的东西

- **当前实测（2026-09-24，HEAD `804e81f`）**：`git status --short` 显示 **17 个已跟踪 modified，0 个 staged**，未跟踪仅 `.tmp-logo/`。其中 17 个文件：实现 `src/components/ui/edit-menu.tsx`；测试 `tests/edit-menu-api.test.tsx`、`tests/edit-menu-keyboard.test.tsx`、`tests/e2e/edit-menu.spec.ts`；源文档 `docs/geist/src/content/component-guides/guides-05.ts`、`docs/geist/src/data/components.ts`、`docs/geist/src/i18n/best-practices-zh.ts`、`CHANGELOG.md`、`CHANGELOG.en.md`；生成语料 `docs/llm/index.json`、`docs/llm/pages/en-US/components.md`、`docs/llm/pages/en-US/components/edit-menu.md`、`docs/llm/pages/zh-CN/components/edit-menu.md`；审核台账 `docs/audits/hig-coverage-matrix-2026-09-18.md`、`docs/audits/hig-experience-audit-2026-09-18.md`、`docs/audits/hig-experience-audit-2026-09-18-addendum-phase2.md`、**本交付书**。接手时重新核对列表和 diff；不许盲目 `git add -A` / `git add .`，提交须用户明确要求。
- **未跟踪目录 `.tmp-logo/` 为无关工作**：禁止删除或纳入本轮提交；当前未在 `git status` 发现 logo 线列举的品牌/示例文件 modified，不能凭旧记录将它们视作待提交。`.scratch/` 本机截图与日志不进版本库。
- **历史记录，不是当前待清理项**：2026-09-22 曾发现 `tests/e2e/tmp-triage-probe.spec.ts`，本次 `Test-Path` 为 False；本轮横向视觉探针也已删除。2026-09-23 的 `8d528b8` / `0ed630a` 提交是彼时工作区快照，不代表当前工作区干净。
- **2026-09-23（009/011/012 会话）**：实现与测试由 `8d528b8` 提交（fix：`src/components/ui` 13 个组件文件 + `src/styles/index.css`，`tests` 13 个文件 = 治理 3 + 组件 9 + allowlist 1）；5 份 audits 台账由 `0ed630a` 提交（docs），工作区回归干净；探针与日志已删净。
- 除用户明确要求外，**不得 commit、不得 push**（AGENTS.md 硬约束）。
- 所有临时脚本（Playwright 复现、测量脚本、日志）**跑完即删**；`.scratch/` 产物不得进版本库。

---

## 6. 建议执行顺序

1. **先只读核对现场**：`git status --short`、HEAD、§5 中 17 个文件的 diff 和 §7.14 已有验证证据；不碰无关 `.tmp-logo/`，不把历史门禁结果冒充本次实测。`pnpm test` / `pnpm run test:docs-layout` 是耗时验证，不属于只读取证；本轮横向方案**未重跑全量**，已知旧基线为 7 个 `tests/audit/*` Python 环境失败及稳定 `053` 红点。需要扩大门禁时先跑定向用例、保留准确退出码，再决定是否运行全量；不要为基线对照执行可能扰乱未提交文件的 `git stash`。
2. ~~**批次 A（3 个开放 P0）**~~ → ✅ **已于 2026-09-21 完成闭环**（每条均走：复现 → 修复 → 加/改回归测试 → 双主题视觉核查 → 三份台账同步；含行号与「修复后证据」）。
3. **批次 B（计划缺口）**：~~优先 E11 `app-shell` 组合演示与 G4 材质 token（两者影响文档链与语料）~~ → ✅ E11（`522e53f`）、G4（`--uni-overlay-backdrop-blur`）、G3（`tests/e2e/context-menu-quick-actions-touch.spec.ts`）均已闭环；~~剩余 M1–M4 的 `test:docs-layout` 汇总口径~~ → ✅ 汇总口径已闭环（§7，`2 failed / 1 flaky / 119 passed (42.8m)`）；~~接续项 = §7.1 的三条断言分诊~~ → ✅ 已分诊闭环（§7.1：1 真实缺陷修复为 HIG-AUD-054 + 2 断言缺陷修正，增补台账 §5C）。
4. **本轮 EditMenu 收尾 → 批次 D**：`049` 已于 2026-09-22 判非缺陷关闭；P1 除 `036` 外均已修复，`036` 是用户选择横向后对原竖向验收的有意偏离，待审核决策，不得冒称通过。先核对 §5 的 17 文件（README 截图门禁已通过）；是否提交/推送由用户明确授权。之后优先分诊 `053`：先读主报告 §4.1 末尾的 `HIG-AUD-053`（严重度 P2，虽位于该节但不属于 P0 清单）与 `tests/e2e/command-search.spec.ts:49-52`，先用 `pnpm exec playwright test tests/e2e/command-search.spec.ts --retries=0 --timeout=30000` 定向复现（仓库未配置名为 `chromium` 的 Playwright project），再选最小修复；不因旧全量门禁耗时 42.8 分钟而直接重跑全量。`020`/`021` 的历史起点简报保留在 §7.10。
5. **批次 F（债务）**：建议在 P0/P1 收敛后再做，且批次 1→2→3 顺序不可颠倒。
6. **批次 G**：LLM 语料暂缓与 safe-delete 阻塞均属历史状态；本轮已正常生成并核查（§7.14）。真机/AT/非 Chromium 验证仍待有条件时实施。

每批收尾都必须重跑：`pnpm run typecheck` + 定向 `vitest` + 受影响路由的双主题浏览器核查。

---

## 7. 验收门禁（命令 + 期望）

| 命令 | 期望 | 备注 |
|---|---|---|
| `pnpm run typecheck` | exit 0 | 本轮已验证为 0 |
| `pnpm exec vitest run <定向文件> --maxWorkers=1 --reporter=dot` | exit 0 | 优先定向且核对退出码；偶发输出误判 watch 时才写新日志（§4）。EditMenu 横向方案 25 passed（§7.14） |
| `pnpm run test` | **最近一次全量（2026-09-24，023/024 批次）exit 1：7 failed / 233 passed（240 files）；本轮横向方案未重跑** | 2026-09-21 的 **228 files / 1424 tests passed**；此前的「9 个基线失败 / 3 文件」（`docs-foundations`、`foundation-contract`、`keyboard-input-api`）在该轮未复现。**基线构成（2026-09-23 两次全量 + `git stash` 对照定性）**：① **7 个稳定基线失败** = `tests/audit/{comparator-context,comparator-exemptions,comparator-icon,comparator-provenance,comparator-v3,ledger-comparator,ledger-consumers}`（stash 后同样失败；根因 = 用例 `execFileSync("python", …)` 的**环境类**失败）；② **并发 flaky（单跑均通过）** = `tests/showcode-typecheck.test.ts`（tsc 子进程）、`tests/button-api.test.ts`（扫描型用例）、`tests/audit/evidence-v2.test.ts`（git/hash 遍历型用例）、`tests/llm-task-runner.test.ts`、`tests/pre-push-orchestrator.test.ts`（后两者见 §4）。**判定回归须核对已注明日期的基线并定向单跑可疑文件；当前有 17 个未提交文件，不得为此擅自 `git stash`**，勿直接把失败数记为当轮引入 |
| `pnpm run test:docs-layout` | 基线（2026-09-22 04:21，独占运行）：`2 failed / 1 flaky / 119 passed (42.8m)`，exit 1（failed = HIG-AUD-053 + `static routes (light)` 卡死）。**harness 修复后（2026-09-22 14:05）**：静态路由双主题 `7 passed (2.8m)`（含 `aggregate layout audit gate` 空失败集）、`component routes chunk 1/11` 双主题 `3 passed (1.0m)` → **矩阵内已无已知红点，唯一稳定红点仍是 `command-search.spec.ts:49`（HIG-AUD-053）**；`aggregate` 的「重试清空失败集」机制未修（分块+加固后未再复现首败） | 布局改动必须跑，且**必须独占**：`PW_REUSE_SERVER=0`（由 Playwright 自己拉起 dev server）+ 跑前确认没有另一份 `playwright test -c playwright.config.ts` 持有 5211（探测命令见 §4）。**用例名已变**：静态路由现为 `static routes chunk k/3 (${theme})`（`docs-layout.spec.ts:683`），临时重跑用 `-g 'static routes chunk'`（原 `-g 'static routes \(dark\)'` 已不再匹配）；`aggregate` 在 `:707`。**注意**：命令行传含 `|` 的 grep 会被中间层截断，需要多条件时把 `grep` 写进临时配置文件 |
| `pnpm run docs:llm:check` | **本轮 exit 0，无漂移**（§7.14） | 023/024 与本轮 EditMenu 均从真实文档构建 `pnpm run docs:llm:generate`；后续源文档变化时再执行 generate + check，不手改语料或预先删除目录 |
| `pnpm run build` | **本轮 exit 0**（§7.14） | EditMenu 横向方案最后一次事件处理收敛后重跑成功；未对本轮执行全量 `pnpm test` |
| `pnpm run lint` | **exit 0（2026-09-21 实测）** | oxlint：**0 errors / 16 warnings**（872 files / 96 rules）；16 条 warning 为既有存量，非本轮引入 |
| `pnpm exec playwright test tests/e2e/context-menu-quick-actions-touch.spec.ts` | **exit 0（2026-09-22 实测）** | **2 passed (12.6s)**；触屏长按回归（G3）。spec 自带 `test.use({ hasTouch: true, isMobile: true })`，用 CDP `Input.dispatchTouchEvent` 派发真实 touch；如需复用已起的 dev server 可设 `PW_REUSE_SERVER=1` |

### 7.1 2026-09-22 门禁首轮真实断言失败（3 条，已分诊闭环）

`aggregate layout audit gate`（`tests/e2e/docs-layout.spec.ts:642`，断言进程内 `ALL_FAILURES` 为空）在**第一次执行**时输出的非空内容原文如下（断言实现行号 = `docs-layout.spec.ts`）：

| # | 断言 | 路由 / 视口 / 主题 | 失败原文（首条） | 初判 |
|---|---|---|---|---|
| 1 | `no-root-horizontal-overflow` | `/components/feedback` @320x700，**light + dark 各 1 行** | `documentElement.scrollWidth 330 > clientWidth 320 + 1` | 疑似**真实缺陷**：320 宽下根节点横向溢出 10px。断言为纯测量（`:384-392`），无归一化问题 |
| 2 | `colors-computed-value-contract` | `/colors` @1440x900、1100x800、1024x768、768x1024、390x844、320x700，**仅 dark**（6 视口 × 3 token = 18 行） | `swatch --color-background-100 显示值 "0a0a0a" ≠ computed "#0a0a0a"`（另 `--color-amber-500 "70400b"`、`--color-pink-1000 "fdf1f7"`） | **断言侧嫌疑**：卡片内显示值**故意去掉 `#`**（`docs/geist/src/components/docs-pages.tsx:276-279`，完整值在 `title`），断言做字符串全等（`:488-497`）。**为何仅 dark、仅这 3 个 token 未定**，需定点复核 |
| 3 | `grid-responsive-columns` | `/grid` @1440x900、1100x800、1024x768，**仅 dark** | `responsive-breakpoints 列数 2 ≠ 预期 3` | 存疑：断言为真实列数比较（`:517-526`，≥1024 预期 3）。仅 dark 且仅 ≥1024，需复核是否主题切换后容器/媒体查询未重算 |

**分诊结论与修复（2026-09-22，含独立复核）**：三条已全部定性并修复。复核方式 = 临时探针 spec（跑完即删）在**独占 dev server** 下逐条路由 × 双主题 × 6 视口重新测量（36 组合，`6 passed (1.6m)`，证据 `.scratch/triage-probe.jsonl`）：

| # | 定性 | 修复落点 | 独立实测（本轮探针，非沿用他人结论） |
|---|---|---|---|
| 1 | **真实产品缺陷** → 新记 **HIG-AUD-054**（P2，见增补 §5C） | `src/components/ui/feedback.tsx`：占位层 `[data-feedback-inline]` 补 `shrink-0`（占位层是 flex item，被 demo 卡内容区压到 230px；内层**绝对定位**胶囊不参与 shrink 仍为 285px，且 demo 卡 `overflow-visible` 不裁切 → 胶囊右缘突破视口；解除压缩后 `justify-center` 容器令占位层两侧对称溢出，LTR 左侧溢出不产生滚动宽度） | 12/12 组合 `scrollWidth - clientWidth = 0`；@320 胶囊 18..303px（宽 285，左右留白 18/17 对称），双主题一致 |
| 2 | **断言缺陷**（非产品缺陷） | `tests/e2e/docs-layout.spec.ts` 第 9a 组：改**前缀无关**比较（卡内紧凑显示按约定省略 `#`，完整值在 `title` 与剪贴板，clipboard 契约测试本就前缀无关） | `/colors` 页面 92 个 swatch：**严格全等 92/92 全部「不一致」**（差异全部只是 `#` 前缀），**前缀无关不一致 0/12 组合**（realDrift=0，与增补 §5C 记录一致）→ 「仅 dark」是**观测假象**（light 侧证据随 `static routes (light)` 卡死丢失，见 §4） |
| 3 | **断言缺陷**（非产品缺陷） | 同文件第 11 组：改**容器感知**预期——`responsive-breakpoints` demo 用 `unstable_useContainer`，断点按**容器**宽度解析；采集容器宽度 + Grid 内联断点变量 `--{xs,sm,smd,md,lg}-grid-columns`，按与 `grid.module.css` 一致的阈值（xs≤400 / sm 401–600 / smd 601–768 / md 769–960 / lg≥961）与 fallback 链推导预期 | `/grid` 12/12 组合 `列数 == 预期`：@1440 容器 863px → md 层 → 2 列；@1100 容器 743px、@1024 容器 667px → smd 链 → 2 列；@390/@320 容器 350/280px → xs 层 → 1 列 |

**门禁自身缺陷（重要）**：`aggregate layout audit gate` 断言的是**worker 进程内数组**（`ALL_FAILURES`，`:543`），而 Playwright 的重试会**重启 worker → 数组清空**，于是「首次 fail + 重试 pass」被记为 `1 flaky`。**重试会静默掩盖真实布局断言失败**：判定矩阵是否全绿必须看**首次执行**的 aggregate 结果，不能只看最终 `119 passed / 1 flaky` 汇总。

**门禁侧改动（2026-09-22 本轮）**：

- `loadDocsRoute` / `settle` 改为**有界等待 + 一次重试**（整页导航 `goto` 60s → 复位 `about:blank` 15s → 重试；navbar 可见 90s；`document.fonts.ready` 15s 上限），把「静默撞满 15 分钟用例上限」变成「带路由名的有界失败」。
- 静态路由**分块**（`chunk(STATIC_ROUTES, 8)` → 每主题 3 个用例，各自全新 page/context），与 component routes 同形态（详见 §4）。
- **仍未修**：`aggregate` 的失败清单只存在 worker 内存里，重试重启 worker 即清空 → 建议把失败清单持久化到 JSONL 证据文件后再断言。

> 说明：本节原另有一份分诊表，已与上表合并（同一结论不留两处口径）；两条来源的原始记录见增补台账 §5C。

**权威复核（真实门禁，2026-09-22 14:05；独立于增补 §5C 记录的 6 passed 运行）**：静态路由分块后，用临时配置（5212 端口 + 把 `grep` 写进配置，因命令行传含 `|` 的模式会被中间层截断）跑 `static routes chunk` + `aggregate layout audit gate` → **7 passed (2.8m)**，其中 **`aggregate` 失败集为空**（「`ALL_FAILURES` 为空」断言成立）→ 20 条静态路由 × 6 视口 × 双主题的**全部断言**首次运行全绿，`static routes (light)` **首次跑完**。另跑 `component routes chunk 1/11` + `aggregate` 双主题 → **3 passed (1.0m)**，证明本次导航/字体「有界等待」加固未引入回归。附：`pnpm run typecheck` exit 0；`pnpm exec vitest run tests/feedback-rating-bar.test.tsx tests/docs-feedback.test.tsx` → **2 files / 29 tests passed**（两项均本轮独立复跑，非沿用他人结论）。

**复跑记录（2026-09-22，修复后定向门禁）**：`tsc -b` 通过；定向 vitest（`feedback-rating-bar` + `docs-feedback`）2 文件 / 29 测试通过；`docs-feedback-typography.spec.ts` 13 通过（1.3m）；`docs-layout --grep "component routes chunk 7"`（含 /components/feedback，双主题 @320）2 通过（1.4m）；`docs-layout --grep "static routes \(dark\)"`（含 /colors、/grid 断言修正）1 通过（1.3m）。全绿。

**遗留（未修）**：上文「门禁自身缺陷」（重试清空 `ALL_FAILURES` 的掩蔽）仍在——三处断言源头修复后，该掩蔽当前已无被掩盖对象，但机制性风险未消除，建议后续把失败清单持久化到文件。

**下一接续项（2026-09-23 更新）**：**批次 C P1 修复**——`038`、`006`/`007`、`013`、`037`、`039`、`040`、`009`/`011`/`012` 已修（§1），剩余 **14 条**，推荐起手 `010`/`019`（浮层背板 token 与 reduced-motion 全覆盖，与 009/012 同族收尾）→ `008`（i18n，独立）；每条走「实现 + 回归测试 + 双主题视觉核查 + 门禁 + 三台账同步」全流程，每会话 1–2 条并先派 subagent 取证。`049` 已关闭、`050` 已随 `039` 修复（批次 E）。**本轮独立复核补充（2026-09-22 深夜）**：`menu-bar-content-height.spec.ts` 独占复跑 **2/2 passed**（SubContent 运行时 `--radix-popper-available-height=700px` 实测成立）；`side-panel-api` + `menu-bar-api` 组合 vitest **17/17 passed**（一次 `body.style.overflow` 断言时序 flaky 后重跑全绿，与 §1 的 jsdom 假阳性经验同源）；`tsc -b` exit 0。**环境实况注意**：(a) `vp dev`（docs/geist）对 root 外 `/@fs/` 模块可能 serve 过期快照（本轮实测 serve 出 21KB 旧版 `side-panel`，磁盘为 8KB 当前版），`/@fs/` 动态 import 探针结论仅在其运行时刻有效，复用前须重验；(b) 上轮运行残留的 Playwright 进程树 + dev server 会占住 5211（且 `taskkill` 审批弹窗可能超时不可见），跑门前先查端口。

### 7.2 2026-09-23 会话门禁记录（HIG-AUD-009/011/012 三件套）

- `pnpm run typecheck` → **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**；`typecheck:tests` 命中项均为存量（`TS7017`（`globalThis.IS_REACT_ACT_ENVIRONMENT`）等，无新增；收紧见批次 F 类型债务）。
- 定向 vitest（23 文件：`layer-tokens` / `duration-tokens` / `ease-tokens` / `motion-duration-governance` + 13 个受影响组件契约 + 其余治理）→ **23 files / 184 tests passed**。
- 双主题视觉核查（临时 Playwright 探针，跑完即删；webServer 独占启动，单轮约 30–60s）：computed 实测 menu `z 50 / 0.15s`、destructive-action-modal 卡片与遮罩 `z 300 / 0.35s / ease-pop`、multi-select / context-menu / hover-card / feedback `z 2001`、command-menu 遮罩与面板 `z 300 / 0.35s`；退场经 `animationstart` 实测播放且 `--tw-exit-scale` 生效。
- **经验（写进探针范式）**：tw-animate 退场统一 `animation-name: exit`，zoom 镜像经 `--tw-exit-*` 变量表达——断言退场**应捕获 `animationstart` 事件并读变量**，不要找 `zoom-out` 动画名（会把通过案例误判为失败）；右键菜单的渲染目标为 `[aria-label="Context menu target"]`（演示页触发器）。

### 7.3 2026-09-23 会话门禁记录（HIG-AUD-010/019）

- `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**。
- 定向 vitest（18 文件）→ **18 files / 112 tests passed**：新增 `tests/overlay-backdrop-tokens.test.ts`(6) + `tests/reduced-motion-coverage.test.ts`(5)；其余为受影响组件契约与治理（`modal-api`/`sheet-api`/`side-panel-api`/`drawer-api`/`bottom-sheet`/`responsive-drawer`/`expand-panel`/`quick-actions-api`/`destructive-action-modal-state`/`command-menu-api`/`menu-surface`/`menu-bar-api`/`relative-time-card`/`visual-fixes-regression`/`skeleton-motion`/`raw-color-governance`）。
- 永久 e2e：`pnpm exec playwright test -c playwright.config.ts tests/e2e/reduced-motion.spec.ts` → **8 passed (47.6s)**（双主题 × modal / quick-actions / bottom-sheet / command-menu；reduce 下 `animation-name: none` 且功能正常）。该 spec 自带 `page.emulateMedia()`，**不依赖 `test.use`**（原因见下）。
- 临时视觉探针（跑完即删）→ **12 passed (1.0m)**：① 旧写法展开与 token 的**渲染像素逐字节等价**；② CSSOM 规则采集（`.motion-reduce\:animate-none\!` 位于 reduce 块内、值为 `animation: … none !important`）；③ reduce 层叠最小复现（plain → `enter`，important → `none`）；④ 真实 DOM 族内一致（`rgba(0, 0, 0, 0.4)`，quick-actions 仍 `blur(8px)`）；⑤ modal 几何与内容透明度（遮罩满覆盖、卡片精确居中、内容未被降透明）。
- 审计验收 grep（`bg-black/4|bg-black/5|bg-[#f2f2f2]` in `src/components/ui`）→ **为空**。
- 全量 `pnpm run test` → **exit 1，`Test Files 8 failed | 226 passed (234)` ＝ 文档基线**（7 个 `tests/audit/*` 环境类 + 并发 flaky）。**首轮曾抓出本会话引入的 2 处回归并已修复**（记录在案以示范纪律）：① `tests/token-namespace.test.ts`——我在 `index.css` 两处族注释里写了**退役的 `--ds-*` 前缀**（该测试全量扫描 `src/` 与 `docs/geist/src`，且**不过滤注释**）；② `tests/modal-typography-geometry.test.ts:68`——仍锁 `bg-[#f2f2f2]/80 dark:bg-black/80` 旧字面量。修复后单跑两者 **2 passed**；`tests/button-api.test.ts` 单跑 **1 passed**（确认属文档记录的并发 flaky，非回归）。**教训**：改 token 注释时不得复述外部命名空间前缀；改遮罩写法前先 grep 全仓（含 `tests/` 与 `docs/`）的旧字面量。
- **本轮新增环境事实（务必遵守）**：
  1. `test.use({ reducedMotion: "reduce" })` 在本项目配置下**不生效**（探针读 `matchMedia("(prefers-reduced-motion: reduce)").matches === false`）→ 必须用显式 `page.emulateMedia({ reducedMotion: "reduce" })`。否则动画类断言会在「无模拟」下**假失败**，并可能误导根因判断（本轮已实际踩到一次）。
  2. 探针的跨 worker 证据必须**每条即时落盘**：Playwright 重试会换 worker，模块级对象 + `afterAll` 整文件写入会互相覆盖，只剩最后一个 worker 的数据。
  3. 半透明色块的像素比对必须叠在**同一不透明底色**上（否则页底内容不同会造成假失败）；色值 alpha 解析要兼容 `oklab(a b c / 0.8)`、`rgba(a, b, c, 0.4)`、`rgb(0 0 0 / 40%)` 三种序列化。

### 7.4 2026-09-23 会话门禁记录（HIG-AUD-008）

- `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量，与上轮一致）**。
- 定向 vitest（13 文件）→ **13 files / 80 tests passed**：`component-i18n-source`（含新增 3 用例：键集双向相等 / 钉住 3 key / 全 `src` `t("…")` 扫描）/ `framework-i18n`（含新增 grabber 双语言断言）/ `i18n-remaining` / `i18n-controls` / `feedback-i18n` / `grabber` / `hamburger-menu` / `hamburger-menu-groups` / `hamburger-menu-modes` / `hamburger-trigger-layout` / `hamburger-icon` / `docs-i18n` / `docs-i18n-parity`。
- 全量 `pnpm run test` → exit 1，`Test Files 8 failed | 226 passed (234)` ＝ 文档基线（7 个 `tests/audit/*` 环境类 + `button-api` 并发 flaky），**无新增回归**。
- **变异测试（守护有效性证据）**：临时删除 zh-CN 的 `"Close menu"` → ① `tsc -b`：`src/lib/i18n.tsx(36,11): error TS2322 … is not assignable to type 'Record<…>'`；② 键集同构用例：`zh-CN 缺失的 key: expected [ 'Close menu' ] to deeply equal []`；③ 调用点扫描：`src/components/ui/hamburger-menu.tsx: "Close menu" 不在 zh-CN`（2 处调用点）。**恢复后复跑 13 files passed，工作区无残留**。
- 临时浏览器探针（跑完即删，4 passed (26.8s)）：见增补 §5M。
- **本轮新增方法论**：新增「守护类测试」必须做**变异测试**（故意破坏一次并确认报警），否则无法区分「守护有效」与「守护恒真」——与 §7.3 的「文件级计数 ≠ 生效」是同一类风险的两面。

### 7.5 2026-09-23 会话门禁记录（HIG-AUD-017）

- `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**。
- 定向 vitest（5 文件）→ **5 files / 55 tests passed**：新增 `navigation-dismiss`(4) 与 `hamburger-menu-groups`(+2 用例)；另 `hamburger-menu`、`hamburger-menu-modes`、`docs-shell-geometry` 一并复跑通过。
- 永久 e2e：`pnpm exec playwright test -c playwright.config.ts tests/e2e/overlay-route-dismiss.spec.ts` → **2 passed (30.9s)**（① 点击条目关闭 + 路由切换；② 浏览器后退关闭）。
- **变异测试（守护有效性）**：停用 `docs-shell.tsx` 的 `useDismissOnNavigate` 接入 → 「浏览器后退关闭」用例 **失败**（`not.toBeVisible()` 超时、面板仍可见），而「点击条目关闭」仍通过 → 证明两条路径**各自独立生效**（组件层契约 vs 库层原语 + 消费方接入）；恢复后复跑 2 passed。
- 全量 `pnpm test` → exit 1，`Test Files 9 failed | 226 passed (235)`：7 个 `tests/audit/*`（python 环境类）为文档基线；`tests/button-api.test.ts`、`tests/showcode-typecheck.test.ts`、**`tests/llm-task-runner.test.ts`** 为并发 flaky——三者**单跑均通过**（`llm-task-runner` 本轮单跑 **1 file / 9 tests passed**，16.3s；全量中它跑满 51.5s 才失败，属资源竞争型抖动）。**结论：无新增回归。**
- **基线清单更新**：把 `tests/llm-task-runner.test.ts`（spawn 重型、9 用例）并入「并发 flaky，须单跑复验」名单，与 `button-api` / `showcode-typecheck` 同类。

### 7.6 2026-09-23 会话门禁记录（HIG-AUD-018，同会话由 3/4 补齐至 **4/4**）

- `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**。
- 定向 vitest：受控契约与既有契约分批跑全绿——`combobox-controlled`(2)、`split-button-controlled`(2)、`bottom-sheet`(13，含新增 detent 用例)、`combobox-api`(3)、`combobox-multiple-instances`(4)、`split-button-api`(14)、`component-api-registry`(**9**)。
- 真实浏览器回归探针（跑完即删）→ **3 passed (26.6s)**：combobox 点击展开 + listbox 可见 + Escape 收起（**Radix Popover 受控语义**，单测覆盖不到的一环）；bottom-sheet grabber 非受控切档 0→1；split-button 菜单触发按钮开菜单。
- 全量 `pnpm test` → exit 1，`Test Files 8 failed | 229 passed (237)` ＝ **文档基线**（7 个 `tests/audit/*` 环境类 + `button-api` 并发 flaky；本轮新增 5 个用例已计入 passed）。**无新增回归。**
- **踩坑记录**：`tests/split-button-api.test.ts` 是 `.ts` 文件，**不能含 JSX**——加入 JSX 会让整个文件 `0 test` 静默加载失败（vitest 不打印语法错误明细）；受控用例改放新增 `.tsx` 文件后通过。
- **追加：Toasts store 注入（同会话后半段，凑齐 4/4）** —— `pnpm run typecheck` exit 0、`lint` 0 errors / 16 warnings（存量）；定向 vitest **5 files passed**（`toast-api`、`toasts-controlled`(4)、`toast-example-actions`、`component-api-registry`、`library-docs-export-parity`）；真实浏览器探针 **1 passed**（docs `/components/toast` 弹出 + 关闭按钮出栈）；全量 `pnpm test` → `8 failed | 230 passed (238)` ＝ **文档基线**。**踩坑**：`Duplicated export`（函数声明 + 末尾导出表重复导出 `createToastStore`）同样会让测试文件**静默 0 test**——「加载期失败」类问题要留意 `0 test` 这个信号。

### 7.7 2026-09-23 会话门禁记录（HIG-AUD-015）

- `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**。
- 定向 vitest（4 文件）→ **4 files / 16 tests passed**：`tooltip-focus`（用例①按新契约重写 + 新增可聚焦子元素用例，共 3）、`tooltip-api`(7)、`tooltip-tip`(2)、`loading-icon-layout`(4)。
- 真实浏览器验收探针（跑完即删）→ **1 passed (17.6s)**：`/components/tooltip` 上 `span` 触发器**无 `tabindex`**、`button` 触发器 `tabIndex 0`、聚焦被 Tooltip 包裹的 `<Button>` 仍打开 `[role="tooltip"]`。
  - 首轮该探针失败：**目标选错**——`button[data-state]` 命中了非 Tooltip 的 Radix 组件；改为按示例按钮名定位后通过。教训：`data-state` 不是 Tooltip 触发器的专属标记。
- 全量 `pnpm test` → exit 1，`Test Files 8 failed | 230 passed (238)` ＝ **文档基线**（7 个 `tests/audit/*` 环境类 + `button-api` 并发 flaky）。**无新增回归。**
- **重要教训（新增）**：`tests/tooltip-focus.test.tsx` 的既有用例①**把缺陷固化成了契约**（断言「非交互子元素被强制可聚焦」）——这解释了本条为何长期无人发现。**落地审计条目时，先检查「既有测试是否在锁定坏行为」**，否则会把修复当成回归。

### 7.8 2026-09-23 会话门禁记录（HIG-AUD-016）

- `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**。
- 定向 vitest：`tests/multi-select-keyboard.test.tsx` → **4 tests passed**（命名与两种覆盖 / Tab 不被 `preventDefault` / 行控件可 Tab 且带 `aria-label` / 方向键 roving 不回归）；`multi-select-api` / `component-i18n-source`（含新 key 的调用点扫描）/ `framework-i18n` 复跑通过。
- **永久 e2e**：`tests/e2e/multi-select-keyboard.spec.ts` → **1 passed (17.9s)**（仅键盘：Enter 打开 → Tab 进入面板遍历 → Tab 最终离开面板；对话框 `aria-label` 命中 `Select options|选择选项`）。
- 全量 `pnpm test` → exit 1，`Test Files 7 failed | 232 passed (239)` ＝ **文档基线**（本轮 7 个均为 `tests/audit/*` 环境类；`button-api` / `showcode-typecheck` / `llm-task-runner` 三个 flaky 本轮全部通过）。**无新增回归。**
- **本轮关键教训（务必遵守）**：`016` 的「Tab 锁」**第一版修复方向是错的**——我们自己的 `preventDefault` 只是表象，真正的拦截是 **Radix Popover 在 `FocusScope` 上硬编码的 `loop: true`**；只改我们的代码时**单测会通过（`defaultPrevented === false`）而用户可见行为不变**，是靠 e2e 才暴露。**规则：凡「用户能否完成某操作」类条目，必须用真实浏览器行为断言收口**，不能以单测通过为完成依据。

### 7.9 2026-09-23 会话门禁记录（HIG-AUD-014）

- `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**。
- 定向 vitest：新增 `tests/toast-timer.test.tsx` → **3 tests passed**（6 条时**恰好 2 条** `inert`+`aria-hidden` / hover 暂停 5s 后按剩余量续跑 / **聚焦后停留 10s 不被关闭**）；`toasts-controlled`、`toast-example-actions` 复跑通过。
- 真实浏览器验收探针（跑完即删）→ **exit 0**：`/components/toast` 连点 6 次 → `li[inert]` **恰好 2 条**（**JS 判定与 CSS `nth-last-[n+4]` 范围一致**——本轮最大实现风险点）、`li[inert][aria-hidden="true"]` 同为 2；聚焦最新一条关闭按钮后等待 **4.5s（> 默认 3500ms）** 仍可见。
- 全量 `pnpm test` → exit 1，`Test Files 9 failed | 231 passed (240)` ＝ **文档基线**（7 个 `tests/audit/*` 环境类 + `button-api` / `showcode-typecheck` 并发 flaky，单跑均通过）。**无新增回归。**
- **测试写法教训（新增）**：React 的 `onMouseEnter/Leave` 由 `mouseover/mouseout` 委托合成、`onFocus/BlurCapture` 由 `focusin/focusout` 合成 → jsdom 单测必须派发**对应原生事件**（直接 `dispatchEvent(new MouseEvent("mouseenter"))` 不会触发 React 处理器）；此外 toast 出栈还有 **350ms 退场驻留**，断言出栈前要推进两次计时器。

### 7.10 历史起点简报（HIG-AUD-020 / 021，2026-09-23 当时尚未动手；现已由 §7.11 完成）

> 以下是修复前的历史取证与曾经的建议，**不是当前实施指令**：其中 `isTrusted` 方案已证伪，EditMenu e2e 已存在，语料暂缓已解除，036 采用横向产品决策。接手勿照搬此段重做 020/021；以 §7.11、§7.14 和当前代码为准。

**取证结论：审计行号整段向下漂移 32–197 行（仅 `VIEWPORT_MARGIN :91` 未动）→ 必须以内容锚点定位，勿按行号改。** 两条目同文件（`src/components/ui/edit-menu.tsx`）、改动点互不重叠，**可一次合批**。

- **020（触屏：胶囊一闪即隐 + iOS 原生菜单冲突）最小改动**
  1. `edit-menu.tsx:233` 的 capture `closeIfOutside`（实现 `:212-216`）：加守卫忽略 `touchend` 之后的合成 `mousedown`——现状无 `isTrusted` 判断、无时间戳、无延后挂载（已逐条确认）；建议用「打开后短窗口内忽略 `!event.isTrusted`」或统一改由 `pointerdown` 关闭。
  2. 胶囊根（渲染 `:411-506`，属性在 `:415-419`）：补 `onContextMenu` 阻止默认 + `style.WebkitTouchCallout: "none"`（全仓现无 `-webkit-touch-callout` / `contextmenu` / `touch-action` 处理）。
- **021（定位/语义边界 3 项）最小改动**
  1. 垂直**下边界 clamp**：`:307-310` 的 `bottom` 分支改为 `Math.min(rect.bottom + offset, innerHeight - height - VIEWPORT_MARGIN)`（`VIEWPORT_MARGIN` 目前只用在上方翻转判定与水平 clamp）。
  2. **回调传原始选区文本**：`:164` 做了 `.trim()`，`onCut/onCopy/...` 收到的是已 trim 文本（`:326`/`:488`）→ 建议**新增 `rawText`** 而非改 `text` 语义（`tests/edit-menu-api.test.tsx:130-131` 依赖现语义）。
  3. **剪贴板失败仍触发 `onCut`**：`:337`/`:347` 的 `void copyTextToClipboard(text).then(() => onCut(text))` 无 `catch` → 失败时**不得**调用 `onCut`，并给可见反馈。
- **验证计划**：扩 `tests/edit-menu-api.test.tsx`（jsdom 显式注入「`touchend` → 合成 `mousedown`」复现竞态 + 底部 clamp 定位断言 + 剪贴板 reject 断言 + `rawText`）；新增 `tests/e2e/edit-menu-touch.spec.ts`（参照 `tests/e2e/context-menu-quick-actions-touch.spec.ts` 的触屏范式做 tap/长按 + 视口底部定位；`tests/e2e` 现无 edit-menu spec）；**020 的 iOS 真机验收（原生菜单是否仍出现）本机无法完成，需在台账标注为「待真机」**。
- **同步面**：若新增 prop → `docs/geist/src/data/component-api.ts:569-631`（+ 注册表测试未断言 edit-menu，不会强制失败但需人工同步）+ 双语指南 `docs/geist/src/content/component-guides/guides-05.ts:355/1005` + `docs/llm/pages/{zh-CN,en-US}/components/edit-menu.md`（语料按批次 G 仍暂缓）。
- **关联**：`HIG-AUD-036` 同文件（触发条件不区分输入模态：`:230`/`:231`），做 020 时一并评估输入模态判定（仓库有 `src/lib/input-modality.ts` 可用）。

### 7.11 2026-09-24 会话（020/021 修复）门禁记录

**按 §7.10 简报完成 020/021 合批修复，全程门禁如下（均含最新命令输出）：**

1. **只读取证（开工时）**：基线核对（HEAD = `4e04969`，领先 origin/master ≥ 100 commits 未 push）；`node_modules` 全量检索 `touch-callout`/`TouchCallout` **0 命中**（证伪简报引用的矩阵结论——**安装版本的 Radix 并未设该属性**）。
2. **真实浏览器取证（Chromium CDP touch，临时探针跑完即删）**：
   - 真实 tap 事件序列 = `pointerdown → touchstart → pointerup → touchend → mousedown(firesTouch=true) → mouseup → click`；
   - **简报的 `isTrusted` 方案证伪**：合成 mousedown 实测 `isTrusted === true`，改用 `sourceCapabilities.firesTouchEvents` + `touchend` 1s 窗口（只吞一次）双判据；
   - 修复前对照（临时停用守护）：真实触屏下胶囊 `VISIBLE → EXITING` 闪烁**实证复现**；修复后全程 `visible`。
3. **回归**：`edit-menu-api.test.tsx` 9 → **18 passed**（+2 竞态守护 +2 容器契约 +4 定位/原文 +2 失败路径，jsdom 断言 `[-webkit-touch-callout:none]` 类名——该属性 Blink/jsdom 均丢弃计算值）；永久 e2e `tests/e2e/edit-menu.spec.ts` **5 passed (32.4s)**（触屏竞态含 MutationObserver 状态迁移记录、翻转下方 clamp 双主题、剪切按原文、剪贴板失败保留文本 + 可见反馈——文档站真实示例）。
4. **变异测试（全部恢复后复跑）**：① 停用合成过滤 → 单测 2 条 + e2e 触屏用例同报；② 去 clamp → e2e 实测胶囊底边 **165.66 > 视口 152.5**（溢出 13px）；③ 退回「已 trim 文本 + 失败仍回调」→ e2e 实测残留**双空格**且失败无反馈。
5. **视觉核查（双主题截图 + 几何测量，临时探针跑完即删）**：light/dark 下胶囊与选区 **gap 8px**、水平**居中偏差 0**、桌面高 36px、`touch-action: manipulation`、背景 `rgb(255,255,255)` / `rgb(26,26,26)`——几何与主题令牌均无回归。
6. **门禁**：`pnpm run typecheck` exit **0**；`pnpm run lint` **0 errors** / 16 warnings（存量）；定向 vitest **10 files / 97 tests passed**（含 `docs-coverage`、`docs-i18n-parity`、`component-api-registry`、`library-docs-export-parity`、`touch-targets-contract`、`component-i18n-source`、`edit-menu-api`、`edit-menu-keyboard`、`reduced-motion-coverage`、`duration-tokens`）；全量 `pnpm test` = **7 failed | 233 passed (240)** ＝ **文档基线**（7 个 `tests/audit/*` 环境类，本轮无并发 flaky）。
7. **文档链**：`component-api.ts`（onCut/onCopy/onLookUp/onShare 签名 + 新增 `onError` 行）；`guides-05.ts` 双语 `accessibility`/`controlledBehavior`/`responsiveBehavior` 各 +1 条（**两侧条数一致**，`docs-i18n-parity` 绿）；示例 `default-3f2a9c71.example.tsx` 改用 `rawText` 删除 + 接 `onError` 可见反馈。
8. **经验教训（新）**：① e2e 里**禁止** `navigator.clipboard.readText()`——文档页未获焦时挂起（实测卡满用例上限）；剪贴板载荷由单测 mock 断言。② e2e 的 `describe.configure({ timeout })` 必须收紧（默认 15 分钟会掩盖元素缺失型挂死），并显式设 `actionTimeout`。③ **无任何真实交互的程序化选区**会让胶囊走「抢焦点 + 还原选区」路径、时序抖动（见 §9.18）——e2e 里先 `mouse.click` / `touchscreen.tap` 一次再构造选区即稳定。
9. **提交**：用户于 2026-09-24 明确要求提交；实现 + 测试 + 组件文档已入库 `a2678f1`，四份审核台账随后以 `13c71b0` 入库。

### 7.12 2026-09-24 会话（022 修复）门禁记录

1. **实现**：`Grabber` 新增 `onDetentChange`、`aria-orientation="vertical"` 与 Arrow 四键/Home/End；边界钳制、不循环、不重复上报，已消费键阻止页面默认滚动。BottomSheet 接既有 `setDetent`，ResponsiveDrawer 接 `setCurrent` 并新增动态索引钳制。
2. **契约回归**：`grabber.test.tsx` 覆盖 6 键 + 边界 + 未知键 + 无回调 + 既有 Enter/Space；BottomSheet 新增非受控立即更新与受控只上报/回灌后更新；ResponsiveDrawer 新增键盘调档和 detents 缩短保护。定向 **3 files / 42 tests passed**；typecheck exit 0。
3. **变异测试**：反转 ArrowUp/Right → **8 failed**；移除 BottomSheet 接线 → **2 failed**；恢复后定向测试全绿。
4. **真实 Chromium**：临时 spec **3 passed (23.5s)**（BottomSheet light/dark + ResponsiveDrawer），确认 `aria-orientation`、各键 `aria-valuenow`、两主题命中盒 ≥44×44；截图无视觉回归。探针已删除。首轮因把 hash 路由写成 path 路由而卡满 15m；修正并将临时用例 timeout 收到 60s 后通过。
5. **文档链**：双语 CHANGELOG、`component-api.ts`、BottomSheet/ResponsiveDrawer 双语指南、ResponsiveDrawer detents 示例均同步；四份审核台账增补 §5T / 本节。
6. **最终门禁**：typecheck exit 0；lint **0 errors / 16 warnings**（存量）；定向 **8 files / 74 tests passed**；台账守护 **3 files / 12 tests passed**；全量 `pnpm test` = **8 failed | 232 passed (240)**，相较文档基线多出的 `button-api` 单跑 **9/9 passed**，确认是已登记的并发 flaky，实质仍为 7 个 `tests/audit/*` 环境类失败。
7. **当时的下一项**：`036`（EditMenu 指针设备形态；完成情况见 §7.14）。

### 7.13 2026-09-24 会话（023/024 公共导出与文档注册）门禁记录

1. **修正取证口径**：023 原称 7 个缺页，实际 Phone/PhoneScreen → Device、SkeletonMask → Skeleton 已有承接，RatingPill → Feedback 缺显式 API 导出；独立缺页为四个导航/页脚模块。024 将 SidePanel 正式公开，故总共新增五个文档页。细节见增补 §5U。
2. **实现/回归**：`src/lib/index.ts` 根导出 SidePanel 四子组件及 props 类型；五页新增注册、API、双语指南、live demo；三组合并 owner 显式声明。parity 门禁按根导出 AST 逐符号比对一至多个文档 owner，同时验证中英指南与 demo，要求已确认公共模块必须持续存在，纯图表工具精确豁免；更新 component-api-registry 和 docs-coverage 契约。
3. **语料**：真实文档构建 `pnpm run docs:llm:generate` 输出 109 路由 × 2 语言 = 218 页，`pnpm run docs:llm:check` exit 0。类型检查 exit 0。
4. **真实 Chromium**：临时 spec **3 passed**（SidePanel 浅/深双主题 + 四个导航页的 live demo）；SidePanel 双主题截图人工确认无视觉异常，面板宽度 304px、右边缘不越界，Close 后焦点回到打开按钮；临时 spec 已删除。README living styleguide 截图检查 **5 页 × 2 主题通过**。
5. **变异验证**：临时将 RatingPill owner 指向不存在页面 → parity **1 failed**；临时移除真实 `src/lib/index.ts` 的 SidePanel 导出 → 固定公开模块断言 **1 failed**。两处均已恢复，四组定向门禁 **4 files / 20 tests passed**；审核账本门禁 **3 files / 12 tests passed**。
6. **最终门禁**：`pnpm run typecheck` exit 0；`pnpm run lint` **0 errors / 16 存量 warnings**；`pnpm run build` 与 `pnpm run docs:build` exit 0；`pnpm run test:package` 4/4 passed，发布包 dry-run 163 文件，确认 ESM/CJS、SidePanel 类型声明、许可证/声明与字体，ESM 四个 SidePanel 值导出可导入；`docs:llm:check` 无漂移。`pnpm test` 最终 **7 failed | 233 passed (240 files)**，7 个均是既有 `tests/audit/*` 的 Python/PIL 环境失败；新增中文实践缺翻译曾导致 component-i18n-source 红点，补齐后该文件单跑 9/9 及全量相关测试通过。文档链与实现已完成运行确认。

### 7.14 2026-09-24 会话（036 编辑域即时工具条）产品决策与门禁

1. **原方案（未提交，已撤回）**：上一轮按触摸横向、鼠标/键盘竖向实现了两种形态，并获得定向单测 56 passed、Chromium 6 passed、浅/深主题竖排截图核查通过；这些证据**仅适用于撤回的方案**，不能当作本轮通过证据。
2. **本轮产品决策**：用户明确要求编辑域中即时呼出的工具按钮列保持横向。`EditMenu` 不再读取输入模态，触摸/鼠标/键盘选区统一为横向胶囊（`role="toolbar"`、左右方向键、Home/End）；右键与对象操作仍交给 `ContextMenu` 的竖向菜单。选区焦点、触摸合成鼠标事件防闪烁、视口 clamp 和剪贴板失败反馈保留。原 HIG-AUD-036 要求桌面竖向菜单，故按原审计口径为**产品决策偏离、待审核**，不能计入已修复；当前总账为修复 30、关闭 2（撤回 `005` / 判非缺陷 `049`）、待闭环 22（含 `036` 待审核）。
3. **文档与验证**：双语指南、组件卡片、最佳实践、CHANGELOG、主报告/矩阵/增补 §5V 已校准为横向方案。`pnpm run docs:llm:generate` 与 `pnpm run docs:llm:check` 通过（语料无漂移）；EditMenu 定向单测 25 passed，Chromium 组件 E2E 6 passed，双主题文档站临时探针 2 passed（实际按钮同一行、边界内），截图 `.scratch/edit-toolbar-horizontal-light.png` / `-dark.png` 已目视核查，探针已删除；`pnpm run build` 与 README 5 页双主题截图检查通过，文档相关 Vitest 3 文件 26 passed。浏览器首轮在入场动画亚像素边界 7.98px 对 8px 的断言上失败，已按 7.5px 容差修正后重跑 6 passed；此前带不存在 `--project=chromium` 的调用未执行用例，不计为门禁。上述文件尚未提交，提交须用户明确要求。
4. **持续待验 / 接手**：iOS WebKit 真机原生 callout/AT 行为沿用 §9.16–§9.17；`pnpm test` 全量与 `test:docs-layout` **未因本轮定向验证而重新通过**，以 §7 中标注日期的历史基线为准。横向视觉核查已完成；先核对 §5 的原有 17 个未提交文件与审计偏离决策，若用户授权才提交；`053` 已随后定向复现和修复（§7.15）。

### 7.15 2026-09-24 会话（053 命令面板搜索相关性）

- **先验基线**：开工时 `master` HEAD `804e81f`，原有 17 个已跟踪文件 modified，`.tmp-logo/` 未跟踪且属其他工作；本轮未暂存、未提交、未推送。
- **修复前复现**：`pnpm exec playwright test tests/e2e/command-search.spec.ts --retries=0 --timeout=30000` → 4 passed / 1 failed，zh-CN 搜 `toast` 后实际标题「堆叠」。`docs-routes.ts` 把组名拼入每项索引，cmdk 子序列匹配导致布局组 Stack 抢在 Toast 之前。
- **修复与回归**：索引仅保留条目中英文标签与别名，组名仍作为可见分组标题；`tests/docs-command-search.test.tsx` 3 passed；`tests/e2e/command-search.spec.ts` 5 passed（`--retries=0`，含首个及默认选中项「轻提示」）。`pnpm run typecheck`、`pnpm run build` 均 exit 0，目标文件 IDE diagnostics 0。
- **视觉核查**：临时 Playwright 用例（已删）于双主题各测一次，均为面板 x=320..960、y=108..249，首选行 x=328..952、y=205..241（高 36px），在面板内部且两主题一致；2 passed。全量 `pnpm test` / `pnpm run test:docs-layout` 尚未重跑；旧门禁失败保留历史证据，不得冒称本轮仍失败或已全绿。

### 7.16 2026-09-24 会话（026 三浮层动态视口高度）

- **起手状态**：承接 §7.15 的 21 个已跟踪 modified 文件和未跟踪 `.tmp-logo/`；本轮另改 6 个此前干净的已跟踪组件/测试文件，并新建 `tests/e2e/overlay-dynamic-viewport.spec.ts`，未暂存/提交/推送，也未改已有 EditMenu 工作。
- **修复**：CommandMenu 移动端 `h/max-h` 及 Modal/DestructiveActionModal `max-h` 加 `supports-[height:100dvh]` 覆盖，仍保留 `vh` 回退；滚动与可访问性行为不改。三组件定向 Vitest **3 files / 19 passed**；永久 E2E **6 passed**，light/dark 下各测试真实 demo 的 390×700→390×320 视口变化与滚动；`pnpm run typecheck`、`pnpm run build` exit 0，生产 CSS 含 `@supports (height:100dvh)`、`80dvh` 和 `80vh`。
- **双主题几何**：临时 Playwright 脚本（已删）在 390×320 下实测 light/dark 一致：CommandMenu `(x0,y64,w390,h256)`、Modal `(10,0,370,256)`、DestructiveActionModal `(0,32,390,256)`；2 passed，无边界溢出。此为 Chromium 视口缩放模拟，**不能代替真实移动浏览器地址栏收缩/展开**；需后续设备验证。全量 `pnpm test` / `test:docs-layout` 未重跑。

### 7.17 2026-09-25 会话（028 分诊 / 030 命令面板子项）

- **028 分诊、仍待闭环**：临时 Playwright（已删）双主题测 Sheet/Modal/Menu，三者开合前后 `main.x=30`、`main.width=1220`、触发器 x=363 不变；当前平台 `innerWidth=clientWidth=1280`（覆盖式滚动条）。非真实经典滚动条模拟曾使几何变化，不作为缺陷证据；不添加全局 gutter 与已有 Radix 补偿叠加，等待真实经典滚动条环境验收。增补 §5Y。
- **030 部分完成，不计入已修总数**：cmdk 1.1.1 会把 Empty 外层 `role` 强制设为 presentation；先尝试传 `role=status` 的定向 E2E 4 passed/1 failed，排查真实 DOM 后改为在内部嵌 `span role=status aria-live=polite aria-atomic=true`。`tests/command-menu-api.test.tsx` 8 passed、`tests/e2e/command-search.spec.ts` 5 passed（`--retries=0`，可访问树 status 和输入焦点通过）。typecheck/build exit 0；lint 0 errors（16 个存量 warning）。
- **视觉及剩余边界**：临时 Playwright 390×700 测 light/dark，无结果行与文字均在面板内，2 passed（临时脚本已删）；现有移动 flex 列表空行偏左属存量布局。toast/edit-menu 子项及 NVDA/VoiceOver 实际播报待验，**030 整条未闭环**。全量 `pnpm test` / `test:docs-layout` 尚未重跑；未暂存、未提交/推送，原有 EditMenu 工作未改。

### 7.18 2026-09-25 会话（042 ActivityView 横向目标边缘提示）

- **修复**：`ActivityView` 目标区仍单行横滚；按 Portal 回调 ref 挂载后测量滚动余量，`onScroll` + `ResizeObserver` 维护左右两个渐隐（`pointer-events-none`、`aria-hidden`），在起点只显示右侧、终点只显示左侧，无溢出不显示；底层按钮和选择行为不变。默认演示扩为 8 个目标；中英文指南、组件元数据及语料同步。增补 §5Z。
- **回归**：新增永久 `tests/e2e/activity-view-scroll-edges.spec.ts`，双主题滚动、键盘 Tab 隐藏目标入视、末端点击和放宽视口后提示消失 **4 passed（无重试）**；相关单测 **3 files / 11 passed**，typecheck/build exit 0，lint 0 errors（16 条存量 warning），`docs:llm:generate` + `docs:llm:check`、README 双主题截图 check exit 0。生成器还同步刷新了先前未提交 EditMenu 文档派生页与索引，属原有工作，不应单独回退。
- **视觉核查**：临时 Playwright 脚本（已删）于 390×844 light/dark 测目标行 `(16,408.61,358,76)`、右渐隐 `(350,408.61,24,76)`，贴右缘、两主题宽高一致，背景分别取白/黑主题色，2 passed。全量 `pnpm test`/`test:docs-layout` 未重跑；本轮未暂存、未提交或推送。

### 7.19 2026-09-25 会话（提交前批次、043 ActivityView 双档位）

- **先提交前批次**：用户明确要求「提交，继续」。排除未跟踪 `.tmp-logo/`，审查 33 个相关文件，修正 EditMenu 双语指南里未获 iOS 真机证明的绝对用语并重生成语料；git 签名/hooks 通过，提交 `88055b7`（`fix(ui): close focused HIG overlay and search gaps`），未推送。此前 §7.14–§7.18 的“尚未提交”为历史快照，现以后续提交状态为准。
- **043 实现**：`ActivityView` 默认双档 0.6/0.9，保留 `sheetProps` 覆写及下拉关闭；操作组防 flex 收缩，使低档位真的可纵向滚动。演示扩为八目标八操作，双语指南、元数据、生成语料同步；增补 §5AA。
- **验证**：新永久 `tests/e2e/activity-view-detents.spec.ts` 双主题键盘升/降档、鼠标拖拽、低档位滚动、高档位末项可见且选中后关闭 **4 passed**；与横滚 E2E 同跑 **8 passed**。相关 Vitest **3 files / 11 passed**，typecheck/build exit 0、lint 0 errors（16 存量 warnings），`docs:llm:check` 与 README 双主题截图 check exit 0。临时 Playwright 明暗主题分别量到 60% 面板 `(0,337.59,390,506.41)` 与 90% 面板 `(0,84.39,390,759.61)`，两主题均不越界，2 passed，脚本已删除。真机触屏拖拽待验；全量 `pnpm test` / `test:docs-layout` 未重跑。**043 本轮未提交、未推送**。
- **录屏追加核查（2026-09-25）**：经用户要求模拟操作并录制 light/dark 两段视频（19.08s/7.40s），核验视频流与末帧；三阶段截图显示 60% 档内容内滚、90% 档显示全部 8 操作，标题、指示条与按钮无裁切，面板高度 506→760px。录像/截图在忽略的 `.scratch/hig-043-*`，不入 Git；是桌面 Chromium 390×844 视口模拟，**不是**真实触屏或读屏器验收。见增补 §5AA。

---

## 8. 强制纪律（仓库规则 + 用户长期记忆）

1. **视觉核查强制**：任何 UI/样式改动完成后，必须用临时 Playwright 脚本（跑完即删）打开对应文档站页面截图或测量元素几何（间距/居中/对齐），确认视觉符合预期后才能提交；**不能只靠类型检查与单元测试**。
2. **双语 parity**：新增用户可见文档必须中英同步；`docs-i18n-parity` 测试会把关。
3. **不得臆造**：props、默认值、事件、可访问性行为、demo 标识符一律不得编造；以 `src/components/ui` 实现为准。
4. **文档链同步**：改组件时同步 `docs/geist/src/data`（注册/API 表）、双语 `component-guides`、示例 registry，以及生成语料。
5. **证据格式**：报告给证据必须落到 `文件:行号`；修复后保留「修复前证据」作对照，不要删除原结论。
6. **临时脚本清理**：`tests/e2e/` 下不得留下 audit 专用临时 spec（**长期回归测试除外**，如 `context-menu-quick-actions-touch.spec.ts`）；`.scratch/` 不得进入提交。

---

## 9. 本交付书的**不确证项**（下一个 Agent 必须自行核实）

1. **`HIG-VER-*` 的完整条目数与逐条状态未逐条计数**（以矩阵 §E 为准）。已知碎片：`HIG-VER-11`（像素级对比度测量）未做；MenuBar 键盘模型、pull-down 定位与展开动画仍未验证；`[静态确证，待运行确认]`（主报告 `:226`）、`[静态推断，待真机验证]`（`:489`）；真机 / AT / 非 Chromium 全部未验证（矩阵 `:47`）。
2. ~~**9 个基线失败的具体用例名**来自文档记录，本轮未重跑全量 `pnpm test` 复核。~~ **已于 2026-09-21 复核**：全量 `pnpm test` 实测 **228 files / 1424 tests passed，exit 0**，原 9 项基线失败**未复现**。
3. ~~**`pnpm test` 的 221 文件 / 1343 用例**为旧文档计数，静态枚举得 225 个用例文件……~~ **已订正（2026-09-21 实测）**：`pnpm test` = **228 files / 1424 tests passed（exit 0）**；旧计数（221 / 1343）作废。
4. ~~**`motion-duration-audit-2026-09-20.md` 有两处描述已过期**：账本实为 11 条（文档写 12 条）……~~ **已订正（2026-09-23）**：账本随迁移更新为 **7 条**（该文档 §4 计数与迁移状态列同步、§8/§9 遗留项已标注闭环，增补 §5K）；`duration-(--uni-motion-*)` 消费者清单无需再标注（现已多处消费）。
5. ~~**lint 门禁状态**无任何执行证据。~~ **已取证（2026-09-21）**：`pnpm run lint`（oxlint）→ **0 errors / 16 warnings，exit 0**。
6. **各文档间的口径冲突**（改文档时必须先裁决）：
   - ~~HIG-AUD-005 严重度：矩阵 `:312` 仍为 P0，主报告 `:278`/`:631` 已撤回为 P2 等价；~~ **已订正（2026-09-21）**：矩阵 `:312` 已同步改为「P0 判定已撤回」；
   - 主报告 §4.5 `:663-670` 的「结论」列仍写「审核未覆盖」，同段 `:663-664` 声明以补充报告为准 → 表内文字已过时；
   - `PLAN-HIG-COMPONENTS.md:3` 状态仍为「待确认」，`:296` 的「safe-area.tsx / stack.tsx 执行时定」实际已合并为 `layout.tsx`，均未回填。
7. ~~**`docs/llm/` 语料与文档源不一致**（此前 3 处漂移）~~：023/024 批次及本轮 EditMenu 横向文档均从真实文档构建重生成并执行 `pnpm run docs:llm:check`，最近一次 exit 0、无漂移（§7.14）；下次改源文档后须重查。
8. ~~**`test:docs-layout` 的可信汇总行本轮（2026-09-22）仍未取得**：三次尝试分别被「外置 server 掉线级联」「`5211 already used`」「并发运行共享 server 致 15 分钟超时」阻断（细节见 §4 末两行）。~~ **已取得（2026-09-22 04:21，独占运行，汇总行见 §7）**：`2 failed / 1 flaky / 119 passed (42.8m)`，exit 1 → (a) **HIG-AUD-053 稳定复现**（`tests/e2e/command-search.spec.ts:49`，fail + retry fail）；(b) `static routes (light)` 为**环境卡死**（§4 末两行）；(c) `aggregate layout audit gate` 首轮**真实**失败 3 条断言（§7.1），重试因 worker 重启清空 `ALL_FAILURES` 而通过。~~**仍未核实**：§7.1 第 2、3 条的分诊结论（需定点复核）。~~ **已于 2026-09-22 分诊闭环**（§7.1：#1 真实缺陷修复为 HIG-AUD-054；#2/#3 为断言缺陷，已修）。**同日追加**：(b) 的 `static routes (light)` 卡死已在 harness 侧消除（静态路由分块 + 有界等待，见 §4、§7.1），矩阵内**已无已知红点，唯一稳定红点 = HIG-AUD-053**；`aggregate` 的「重试清空失败集」机制**仍未修**（未能稳定复现首败，故未改）。
9. **HIG-AUD-054 的台账落点尚不齐**：目前只登记在增补台账 §5C 与本交付书（§1、§2、§7.1），`hig-experience-audit-2026-09-18.md`（主报告）与 `hig-coverage-matrix-2026-09-18.md` 尚未登记该编号 → 三份台账编号口径未完全对齐，同步时以「主报告 ∪ 增补」为准。
10. **静态路由用例改名与调用方式（2026-09-22 harness 修复的副作用）**：`static routes (${theme})` → `static routes chunk k/3 (${theme})`（`docs-layout.spec.ts:683`，`aggregate` 在 `:707`）。因此**旧文档/日志里 `-g 'static routes \(dark\)'` 之类的命令已不再匹配任何用例**（增补 §5C 引用的该命令即属此类，属历史记录，重跑请改用 `-g 'static routes chunk'`）。另：命令行传含 `|` 的 grep 会被中间层截断，多条件筛选需把 `grep` 写进配置文件。
11. **「覆盖率」类结论不得只看文件级计数（2026-09-23 HIG-AUD-019 的教训）**：`src/components/ui` 里「多少文件包含 `motion-reduce`」与「reduce 下是否真的不播动画」是两件事——`data-[state=*]:animate-in/out`（specificity 0,2,0）压过单类名 reduce 工具类，故此前 22 个浮层的组件级保护**全是空操作**（审核原文的「28 个文件」因此是虚假覆盖）。今后同类结论必须落到运行时断言（`tests/e2e/reduced-motion.spec.ts`）。
12. **HIG-AUD-010 的验收口径已被本轮修订**（增补 §5L）：由「所有浮层同一个 token」改为「**族内一致**（backdrop 族 / scrim 族）+ 组件层无颜色字面量」，因为两族各有官方实测出处；照原口径「全迁 backdrop 族」会破坏 Drawer 官方 parity。改 `--uni-overlay-*` 族或 `motion-reduce:` 写法前先读 §5L。
13. **浮层内 `href` 条目的「Radix 自动关闭」未经实测（HIG-AUD-017 遗留面）**：`context-menu.tsx:124-140`、`menu.tsx:208-227`（含 `dots-menu`、`menu-bar` 透传路径）在带 `href` 时渲染 `asChild` + `<a>`，仓库**无任何显式关闭代码**，关闭行为被推断来自 Radix `Item` 的 select 语义。本轮**未改动、未做浏览器实测**；若后续验证不成立，需在这两处补 `onSelect` 关闭（做法同 `hamburger-menu` 的组件层修复）。
14. ~~**Toasts 受控 store 注入的影响面未穷举（HIG-AUD-018 未完成项）**~~ **已解决（2026-09-23，同会话完成）**：状态已从模块级单例收进 `createToastStore()` 闭包，消费点（`useToasts`、`Toasts`、文档示例、既有测试的 `drainToasts`）逐一验证**零改动通过**；`Toasts store?` + `useToasts(store?)` 绑定同一实例，默认全局 store 行为不变（`tests/toasts-controlled.test.tsx` 4 用例含跨 store 隔离断言）。
15. **i18n 键集约束的覆盖边界（HIG-AUD-008，增补 §5M）**：编译期约束只覆盖「locale ↔ locale」漂移；「组件 ↔ key」漂移（组件用了字典里根本没有的 key）由 `tests/component-i18n-source.test.ts` 的静态扫描在**测试期**守护。`t()` 参数**未**收窄为 `FrameworkMessageKey`——现有 5 处动态 key 调用（`t(topicName)`、`t(label)`、`t(menuButtonLabel)`、`t(STATUS_LABELS[state])`、`` t(`JSON ${node.type}`) ``）会被误伤，收窄前需先把它们改成显式联合类型（属可选债务）。另：文档站导航面板不渲染搜索行，`"Search"`/`"Search…"`/`"Ctrl K"` 无浏览器级证据（前两者由键集 + 静态扫描守护；`"Ctrl K"` 两侧同值，浏览器断言本身无区分度）。
16. **iOS 真机与原生菜单行为无法在本机验证（HIG-AUD-020 的验收残留）**：`020` 的第二项（iOS 长按原生菜单冲突）**必须真机验证**——本机的 Playwright 触屏模拟只能覆盖「合成 `mousedown` 竞态」，无法证明 iOS WebKit 的原生 callout 是否仍会弹出。对应改动（`-webkit-touch-callout` / `onContextMenu` 阻止）落地后须在真机复核，并在 §7.x 记录一条「真机待验」；同理，`021` 的剪贴板失败路径（拒绝授权）在 Chromium 下只能靠 mock/`clipboard` 权限覆盖，真机表现需人工确认。**→ 状态更新（2026-09-24，§7.11）**：改动已落地（容器/胶囊 `[-webkit-touch-callout:none]` + `onContextMenu` 让位式抑制）；Chromium 侧以「类名（jsdom）+ 编译后选择器（e2e）」为证据，真机项**仍开放**。
17. **`-webkit-touch-callout` 在非 WebKit 引擎下不可行为验证（020 取证边界）**：该属性会被 Blink **与 jsdom 同时丢弃**（实测 `getComputedStyle` 与 CSSOM 序列化都取不到声明），因此「抑制是否生效」只能在 WebKit 真机上验证；本机证据链止步于「Tailwind 已成功编译该任意属性工具类」（无解析失败时 Tailwind 才会发射类选择器）。**附带订正**：矩阵 `:284` 原称「Radix 设了 `-webkit-touch-callout: none`」——`node_modules` 全量检索 0 命中，该口径**已证伪并订正**。
18. **无交互来源的程序化选区存在时序抖动（020 e2e 的环境发现，未修）**：`range.selectNodeContents()` 且此前无任何 pointer/keydown 时，胶囊走「抢焦点 + 还原选区」路径，实测同一段选区**先开后收**（`selectionchange` 仅 2 次）；真实用户必然先有交互，故归为测试环境问题。e2e 已用「先真实 click/tap 一次再构造选区」绕开；若未来要在纯程序化选区场景（如辅助脚本）使用本组件，需重新评估焦点逻辑（涉 `004` 契约，勿轻动）。

---

## 10. 交接时的一句话总结

> 截至 2026-09-25（最近修订 = **043 已定向修复但未提交、042/026/053 及 EditMenu 横向方案已提交 `88055b7`，028 分诊仍待验、030 仅命令面板子项已修**，见 §7.14–§7.19）：54 个编号中 **已定向修复 34、已关闭 2（`005` 撤回、`049` 非缺陷）、待闭环 18**（按 ID 计：P0 001–004、051 **已修复，005 判定撤回**；P1 006/007、**008**、009/011/012、**010**、013、**014**、**015**、**016**、**017**、**018**、**019**、**020**、**021**、**022**、**023**、**024**、037/038/039/040；P2 026/042/043/053/054；P3 050；另 **`049` 判非缺陷关闭**）。**010/019/008 已提交**（`1045dd0` fix 43 files、`5d63437` fix 6 files，台账 `4b725d3` + `a1b8efa`）；**017 已提交（`b7747ff` + `2416a5c`）**；**018 已提交（`0c802d5` + `be22a50`）、015 已提交（`b3036d2` + `5160a41`）、016 已提交（`c225cbc` + `bd154d0`）**；**014 已提交（`d26e3c7` + `177d83f`）**；**HIG-AUD-020/021 已于 2026-09-24 合批修复并提交 `a2678f1`**（实现 + 单测 9→18 + 永久 e2e `edit-menu` **5 passed** + 变异测试三组 + 双主题视觉核查，增补 §5S / §7.11；起手简报 `c362235` 作废）；**HIG-AUD-022 已提交 `2ecf19f`**（定向 42 tests + 变异两组 + Chromium 3 passed，增补 §5T / §7.12）；**HIG-AUD-023/024 已提交 `89b6359` + `e369610`**（定向 20 tests + Chromium 3 passed + npm 包导入 4 passed，增补 §5U / §7.13）；**未 push**（本地领先 `origin/master` ≥ 100 commits，现场以 `git rev-list --count origin/master..HEAD` 为准）。**待闭环 18 条审核问题（无开放 P0；P1 的 `036` 为产品横向决策偏离原验收、待审核；另 `005` 撤回、`049` 判非缺陷均已关闭，见 §2 / §7.14）、计划缺口、14 条债务**构成下一阶段主体工作量；动效账本 12→7。门禁侧：typecheck（`tsc -b`）exit 0 / lint 0 errors（16 warnings 存量）/ 定向 vitest 18·112（010/019）+ 13·80（008）+ 5·55（017）+ 受控契约（`combobox-controlled` 2 / `split-button-controlled` 2 / `bottom-sheet` 13 / `toasts-controlled` 4 / `component-api-registry` 9 / `library-docs-export-parity` 4）全绿 / 新增 e2e：`reduced-motion` **8 passed**、`overlay-route-dismiss` **2 passed**（§7.3~§7.6）；全量 `pnpm test` **7 failed | 233 passed（240）＝ 文档基线**（7 个 `tests/audit/*` 环境类，2026-09-24 轮无并发 flaky；`020`/`021` 的定向/浏览器证据见 §7.11）。**历轮七条硬教训**：① `test.use({ reducedMotion })` 在本项目配置下不生效，必须用 `page.emulateMedia()`；②「文件级覆盖计数」不等于「生效」（specificity 压过）；③ 新增守护测试必须做**变异测试**（`008`：删一个 zh key，三道守护同时报警）；④ 机制类条目要拆「组件层契约 / 库层原语 + 消费方接入」分别验证——`017` 的变异测试表明两条路径确实各由不同代码承担；⑤ 受控能力类改造（`018`）必须**双断言**（传受控值时内部不变 + 既有非受控路径不回归），并注意 **`.ts` 测试文件不能含 JSX**（会静默 0 test）；⑥ 落地审计条目时**先检查既有测试是否在锁定缺陷**（`015` 的 `tooltip-focus` 用例①即把「强注 tabIndex」写成了契约断言，是它长期无人发现的直接原因）；⑦ 凡「用户能否完成某操作」类条目**必须用真实浏览器行为断言收口**——`016` 的第一版修复单测通过但用户仍走不出面板（真正拦截者是 Radix `FocusScope` 的 `loop: true`）。**并发 flaky 名单**（单跑复验即过）：`button-api`、`showcode-typecheck`、`llm-task-runner`。`test:docs-layout` 历史汇总行 `2 failed / 1 flaky / 119 passed`（修复前）；**053 本轮已定向修复：E2E 5 passed，未重跑全量门禁**；重试仍可能静默掩盖失败（机制未修，遗留项）；全量 `pnpm test` 上次全量（023/024 批次）exit 1，7 个 Python/PIL 环境失败；**本轮横向方案未重跑全量**，不能称当前已通过或当前仍失败。LLM 语料在 023/024 与本轮横向指南修改后均从真实文档构建生成并通过 `docs:llm:check`；EditMenu 本轮定向 25 passed、Chromium E2E 6 passed、双主题视觉探针 2 passed、构建及 README 5 页×2 主题截图检查通过；iOS 真机验证仍待办。**做任何枚举前先派 subagent，否则本任务会在中途因上下文耗尽而失败。** **下一接续 = `88055b7` 已提交、`043` 后续改动尚未提交，核对 `git status` 并排除 `.tmp-logo/`；按需重跑全量门禁，下一独立 P2 项可评估 `044`（与 009 的层级问题关联）；安排 `026` 移动地址栏及 `030` 读屏器设备验收、`028` 经典滚动条复核；`026`/`042`/`043`/`053` 已定向修复，`030` 仅部分完成；仅前批次已获提交授权，`043` 后续提交/推送须用户再次明确要求；`036` 的证据见 §7.14；`023`/`024` 的证据见 §7.13；`022` 的完整证据见 §7.12；`016`/`020`/`021` 的 iOS 真机项见 §9.16–§9.17；e2e 硬教训（`clipboard.readText` 挂起、程序化选区时序抖动、用例超时上限）见 §7.11 第 8 条。**

